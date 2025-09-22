// server/sockets/deal.js
const { EVT } = require("../../shared/protocol");
const { rooms, broadcastState } = require("../rooms");
const { createDeck, shuffle, cardText } = require("../deck");

function register(io, socket, joined) {
  socket.on(EVT.HOST_DEAL, ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const dealer = room.state.dealerSeat ?? 0;
    if (joined.seatId !== dealer) return;

    // Reset crib state
    room.crib = [];
    room.cribBySeat = new Set();
    room.state.cribCount = 0;
    room.state.cribLocked = false;

    // Build & shuffle deck
    const deck = shuffle(createDeck());

    // Deal 6 each
    room.hands.clear();
    for (const p of room.state.players) {
      const hand = deck.splice(0, 6).map(cardText);
      room.hands.set(p.seatId, hand);

      const set = room.seatSockets.get(p.seatId);
      if (set && set.size) {
        for (const sid of set) {
          io.to(sid).emit(EVT.HAND_YOUR, { cards: hand });
        }
      }
    }

    // Let clients see crib reset
    broadcastState(io, roomId);
  });
}

module.exports = { register };
