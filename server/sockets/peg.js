// server/sockets/peg.js
const { EVT } = require("../../shared/protocol");
const { rooms, broadcastState, pushLog } = require("../rooms");
const {
  evaluatePeggingEvent,
} = require("../engine/pegging/evaluatePeggingEvent");
const { addPoints } = require("./scoring");
const { scoreHandFifteens } = require("../engine/hands/scoreFifteens");

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

/**
 * Determine if a GO situation exists:
 * - All other players cannot play without exceeding 31
 * - Returns true if the current player should get +1 for GO
 */
function isGoSituation(room, currentSeatId) {
  const currentCount = room.state.runCount;
  const players = room.state.players || [];

  // Check each player except the one who just played
  for (const player of players) {
    if (player.seatId === currentSeatId) continue;

    // Get remaining cards for this seat
    const hand = room.hands.get(player.seatId) || [];
    const shown = room.state.shownBySeat[player.seatId] || [];
    
    // Calculate remaining cards (cards in hand that haven't been shown)
    const remainingCards = hand.filter(card => !shown.includes(card));

    // Check if any remaining card can be played
    for (const card of remainingCards) {
      const val = pegValue(card);
      if (currentCount + val <= 31) {
        return false; // Someone can still play
      }
    }
  }

  // No one else can play - it's a GO
  return true;
}

/**
 * Auto-score all hands + crib after pegging completes.
 * Scores fifteens (2 pts each) for each player's 4-card hand + cut.
 * Scores crib (dealer only) with cut card.
 */
function autoScoreHands(room) {
  if (!room || !room.state) return;
  if (!room.state.cutCard) return; // need starter

  const cutCard = room.state.cutCard;
  const dealerSeat = room.state.dealerSeat;

  // Score each player's hand
  for (const [seatId, handCards] of room.hands.entries()) {
    if (!Array.isArray(handCards) || handCards.length === 0) continue;

    const result = scoreHandFifteens(handCards, cutCard, { isCrib: false });
    if (result.points > 0) {
      const player = room.state.players.find((p) => p.seatId === seatId);
      const playerName = player ? player.name : `Seat ${seatId}`;

      addPoints(room, seatId, result.points);

      // Log with detail breakdown
      const details =
        Array.isArray(result.detail) && result.detail.length > 0
          ? ` (${result.detail.join(", ")})`
          : "";
      pushLog(
        room,
        "hand-score",
        `${playerName} scores ${result.points} from hand${details}`,
      );
    }
  }

  // Score crib (dealer only)
  if (
    Number.isInteger(dealerSeat) &&
    Array.isArray(room.crib) &&
    room.crib.length > 0
  ) {
    const result = scoreHandFifteens(room.crib, cutCard, { isCrib: true });
    if (result.points > 0) {
      const dealer = room.state.players.find((p) => p.seatId === dealerSeat);
      const dealerName = dealer ? dealer.name : `Seat ${dealerSeat}`;

      addPoints(room, dealerSeat, result.points);

      const details =
        Array.isArray(result.detail) && result.detail.length > 0
          ? ` (${result.detail.join(", ")})`
          : "";
      pushLog(
        room,
        "crib-score",
        `${dealerName} scores ${result.points} from crib${details}`,
      );
    }
  }
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

    // Award points for 15s, 31s, pairs, and runs
    if (result.points > 0) {
      addPoints(room, seatId, result.points);
      
      // Build label for what was scored
      const labels = [];
      if (result.hit15) labels.push("15");
      if (result.hit31) labels.push("31");
      if (result.pairLength === 2) labels.push("Pair");
      if (result.pairLength === 3) labels.push("Pair Royal");
      if (result.pairLength === 4) labels.push("Double Pair Royal");
      if (result.runLength >= 3) labels.push(`Run of ${result.runLength}`);
      
      const bonusLabel = labels.length > 0 ? labels.join(" + ") : "scoring play";
      pushLog(
        room,
        "score",
        `${displayName} +${result.points} for ${bonusLabel}.`,
      );

      // Set last scoring event for UI animation
      room.state.lastScoringEvent = {
        points: result.points,
        label: bonusLabel,
        timestamp: Date.now(),
      };
    }

    // Check for GO (only if count < 31, since 31 already scores +2)
    let goAwarded = false;
    if (result.total < 31 && isGoSituation(room, seatId)) {
      addPoints(room, seatId, 1);
      pushLog(room, "score", `${displayName} +1 for GO.`);
      
      // Set scoring event for UI animation
      room.state.lastScoringEvent = {
        points: 1,
        label: "GO",
        timestamp: Date.now(),
      };
      goAwarded = true;
    }

    // Check for Last Card (only if count < 31 and all cards played)
    // Last Card is when all 16 cards (4 per player in 4-player) are played
    let lastCardAwarded = false;
    if (result.total < 31 && !goAwarded && allSeatsShownFour(room)) {
      addPoints(room, seatId, 1);
      pushLog(room, "score", `${displayName} +1 for last card.`);
      
      // Set scoring event for UI animation
      room.state.lastScoringEvent = {
        points: 1,
        label: "Last Card",
        timestamp: Date.now(),
      };
      lastCardAwarded = true;
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
        "Pegging complete — counting hands automatically",
      );

      // Auto-score all hands + crib (fifteens only for now)
      autoScoreHands(room);
    }

    broadcastState(io, roomId);
  });

  // Reset the current run (GO) — DO NOT clear shownBySeat (keep checkmarks)
  socket.on(EVT.PEG_RESET, ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room) return;
    if (room.state.peggingComplete) return; // nothing to reset once done
    if (room.state.winnerSeat != null) return; // freeze if game over

    // Award GO point to last player before reset (only if not already at 31)
    if (room.state.lastShownBySeat != null && room.state.runCount < 31) {
      const lastSeat = room.state.lastShownBySeat;
      const lastPlayer = room.state.players.find(p => p.seatId === lastSeat);
      const lastName = lastPlayer ? lastPlayer.name : `Seat ${lastSeat}`;
      
      addPoints(room, lastSeat, 1);
      pushLog(room, "score", `${lastName} +1 for GO before reset.`);
      
      // Set scoring event for UI animation
      room.state.lastScoringEvent = {
        points: 1,
        label: "GO",
        timestamp: Date.now(),
      };
    }

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
