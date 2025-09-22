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

    // Reset crib & starter state
    room.crib = [];
    room.cribBySeat = new Set();
    room.state.cribCount = 0;
    room.state.cribLocked = false;
    room.state.cutCard = null;
    room.deck = [];

    // Reset pegging *session* state
    room.state.runCount = 0;
    room.state.pegPile = [];
    room.state.lastShown = null;
    room.state.lastShownBySeat = null;
    room.state.lastShownByName = null;
    room.state.shownBySeat = {};
    room.state.peggingComplete = false;

    // Build & shuffle deck (objects)
    const deck = shuffle(createDeck());

    // Deal 6 each (send text to clients, keep objects in deck)
    room.hands.clear();
    for (const p of room.state.players) {
      const six = deck.splice(0, 6);
      const handText = six.map(cardText);
      room.hands.set(p.seatId, handText);

      const set = room.seatSockets.get(p.seatId);
      if (set && set.size) {
        for (const sid of set) {
          io.to(sid).emit(EVT.HAND_YOUR, { cards: handText });
        }
      }
    }

    // Keep the remaining deck for starter flip
    room.deck = deck;

    // Let clients see resets
    broadcastState(io, roomId);
  });
}

module.exports = { register };

