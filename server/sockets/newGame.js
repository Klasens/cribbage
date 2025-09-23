// server/sockets/newGame.js
const { EVT } = require("../../shared/protocol");
const { rooms, broadcastState, pushLog } = require("../rooms");

/**
 * Reset / New Game:
 * - scores -> 0
 * - dealer -> 0 (seat 0)
 * - clear winner
 * - reset crib, deck, hands, pegging, starter
 */
function register(io, socket, joined) {
  socket.on(EVT.NEW_GAME, ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const state = room.state;

    // Reset scores (and prevScore for leapfrog baseline)
    for (const p of state.players || []) {
      p.prevScore = 0;
      p.score = 0;
    }

    // Dealer back to seat 0 (if players exist)
    if ((state.players || []).length > 0) {
      state.dealerSeat = 0;
    } else {
      state.dealerSeat = null;
    }

    // Clear winner
    state.winnerSeat = null;
    state.winnerName = null;

    // Reset crib & dealing state
    room.crib = [];
    room.cribBySeat = new Set();
    state.cribCount = 0;
    state.cribLocked = false;
    state.cutCard = null;
    room.deck = [];

    // Clear private hands
    room.hands.clear();

    // Reset pegging
    state.runCount = 0;
    state.pegPile = [];
    state.lastShown = null;
    state.lastShownBySeat = null;
    state.lastShownByName = null;
    state.shownBySeat = {};
    state.peggingComplete = false;

    // Log it
    pushLog(room, "new-game", "🔄 New game started — scores reset, dealer is Seat 0");

    broadcastState(io, roomId);
  });
}

module.exports = { register };

