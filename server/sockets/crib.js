// server/sockets/crib.js
const { EVT } = require("../../shared/protocol");
const { rooms, broadcastState } = require("../rooms");
const { cardText } = require("../deck"); // NEW: to format starter card

function register(io, socket, joined) {
  socket.on(EVT.PLAYER_CRIB_SELECT, ({ roomId, seatId, cards }) => {
    const room = rooms.get(roomId);
    if (!room) return;
    if (room.state.cribLocked) return;
    if (joined.roomId !== roomId || joined.seatId !== seatId) return;

    if (!Array.isArray(cards) || cards.length !== 2) return;
    const uniq = Array.from(new Set(cards.map(String)));
    if (uniq.length !== 2) return;
    if (room.cribBySeat.has(seatId)) return;

    const hand = room.hands.get(seatId) || [];
    const haveAll = uniq.every((c) => hand.includes(c));
    if (!haveAll) return;

    const sel = new Set(uniq);
    const remaining = hand.filter((c) => !sel.has(c));
    room.hands.set(seatId, remaining);
    room.crib.push(...uniq);
    room.cribBySeat.add(seatId);

    room.state.cribCount = room.crib.length;

    // Lock crib and auto-flip starter when we reach 4
    if (room.state.cribCount >= 4) {
      room.state.cribLocked = true;

      // Flip starter from the remaining deck if not already flipped
      if (!room.state.cutCard && Array.isArray(room.deck) && room.deck.length) {
        const next = room.deck.shift(); // object {r,s}
        if (next) room.state.cutCard = cardText(next); // e.g., "5♣"
      }
    }

    // send updated private hand back to this seat
    const seatSockets = room.seatSockets.get(seatId);
    if (seatSockets && seatSockets.size) {
      for (const sid of seatSockets) {
        io.to(sid).emit(EVT.HAND_YOUR, { cards: remaining });
      }
    }

    // notify room of crib progress/lock/starter
    broadcastState(io, roomId);
  });
}

module.exports = { register };
