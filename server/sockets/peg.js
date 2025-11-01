// server/sockets/peg.js
const { EVT } = require("../../shared/protocol");
const { rooms, broadcastState, pushLog } = require("../rooms");
const {
  evaluatePeggingEvent,
} = require("../engine/pegging/evaluatePeggingEvent");

/** Map a "cardText" like "A♣", "10♦", "J♠" to pegging value. */
function pegValue(cardText) {
  if (!cardText || typeof cardText !== "string") return 0;
  const rank = cardText.slice(0, -1); // supports 10, J, Q, K, A
  if (!rank) return 0;

  if (rank === "A") return 1;
  if (rank === "J" || rank === "Q" || rank === "K") return 10;

  const n = Number(rank);
  if (Number.isFinite(n)) return Math.max(1, Math.min(10, n));
  return 0;
}

function allSeatsShownFour(room) {
  const seats = room.state.players.map((p) => p.seatId);
  const shown = room.state.shownBySeat || {};
  for (const s of seats) {
    const list = Array.isArray(shown[s]) ? shown[s] : [];
    if (new Set(list).size < 4) return false; // de-duped
  }
  return seats.length > 0;
}

function register(io, socket, joined) {
  // Show a card (validated: reject >31; +2 for hitting 15 or 31)
  socket.on(EVT.PEG_SHOW, ({ roomId, seatId, cardText }) => {
    const room = rooms.get(roomId);
    if (!room) return;
    if (!room.state.cribLocked) return; // only after crib locks
    if (room.state.peggingComplete) return; // already done
    if (room.state.winnerSeat != null) return; // freeze if game over
    if (joined.roomId !== roomId || joined.seatId !== seatId) return;

    const cardTxt = String(cardText || "").trim();
    const val = pegValue(cardTxt);
    if (val <= 0) return;

    const prevSeq = Array.isArray(room.state.pegPile) ? room.state.pegPile : [];
    const result = evaluatePeggingEvent(prevSeq, cardTxt);

    // Always surface evaluator logs
    for (const line of result.logs) pushLog(room, "peg", line);

    if (!result.ok) {
      // Reject: DO NOT mutate state
      // Optionally notify the requester explicitly
      if (socket && EVT.PEG_REJECTED) {
        socket.emit(EVT.PEG_REJECTED, {
          roomId,
          seatId,
          cardText: cardTxt,
          reason: result.reason,
          total: result.total,
        });
      }
      // Broadcast logs so observers see the rejection
      broadcastState(io, roomId);
      return;
    }

    // Accept: mutate run state using evaluator totals/sequence
    room.state.runCount = result.total;

    // Track pile + lastShown + who showed it
    room.state.pegPile = result.newSeq;
    room.state.lastShown = cardTxt;
    room.state.lastShownBySeat = seatId;

    const player = room.state.players.find((p) => p.seatId === seatId);
    const displayName = player ? player.name : `Seat ${seatId}`;
    room.state.lastShownByName = displayName;

    // Persist "shown" per seat across GO resets
    if (typeof room.state.shownBySeat !== "object" || !room.state.shownBySeat) {
      room.state.shownBySeat = {};
    }
    const list = room.state.shownBySeat[seatId] || [];
    if (!list.includes(cardTxt)) {
      room.state.shownBySeat[seatId] = [...list, cardTxt];
    }

    // Auto-score +2 for hitting 15 or 31 (if awarded by evaluator)
    if (result.points > 0) {
      // Maintain per-seat score bucket
      room.state.scores = room.state.scores || {};
      room.state.scores[seatId] =
        (room.state.scores[seatId] || 0) + result.points;

      const bonusLabel =
        result.hit31 && result.hit15 ? "15 & 31" : result.hit31 ? "31" : "15";
      pushLog(
        room,
        "score",
        `${displayName} +${result.points} for ${bonusLabel}.`,
      );
    }

    // Additional human-friendly log for the show
    pushLog(
      room,
      "peg-show",
      `${displayName} showed ${cardTxt} (count ${result.total})`,
    );

    // If everyone has shown 4 cards, pegging is complete.
    if (allSeatsShownFour(room)) {
      room.state.peggingComplete = true;

      // 🔓 Publicly reveal all hands + crib for manual counting.
      const revealHands = {};
      for (const [seat, cards] of room.hands.entries()) {
        revealHands[seat] = Array.isArray(cards) ? [...cards] : [];
      }
      room.state.revealHands = revealHands;
      room.state.revealCrib = Array.isArray(room.crib) ? [...room.crib] : [];

      // Clear transient pegging run state and checkmarks
      room.state.runCount = 0;
      room.state.pegPile = [];
      room.state.lastShown = null;
      room.state.lastShownBySeat = null;
      room.state.lastShownByName = null;
      room.state.shownBySeat = {};

      pushLog(
        room,
        "peg-complete",
        "Pegging complete — count hands (revealed)",
      );
    }

    broadcastState(io, roomId);
  });

  // Reset the current run (GO) — DO NOT clear shownBySeat (keep checkmarks)
  socket.on(EVT.PEG_RESET, ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room) return;
    if (room.state.peggingComplete) return; // nothing to reset once done
    if (room.state.winnerSeat != null) return; // freeze if game over

    room.state.runCount = 0;
    room.state.pegPile = [];
    room.state.lastShown = null;
    room.state.lastShownBySeat = null;
    room.state.lastShownByName = null;

    pushLog(room, "peg-reset", "Count reset (GO)");

    broadcastState(io, roomId);
  });
}

module.exports = { register };
