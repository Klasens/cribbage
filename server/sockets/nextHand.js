// server/sockets/nextHand.js
const { EVT } = require("../../shared/protocol");
const { rooms, broadcastState, addLog } = require("../rooms");

/**
 * Rotate dealer clockwise and reset all per-hand state
 * (crib, deck, private hands, pegging fields). Scores persist.
 * Trust-based: anyone can press it once peggingComplete is true.
 */
function register(io, socket, joined) {
  socket.on(EVT.NEXT_HAND, ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    if (!room.state.peggingComplete) return;

    const players = room.state.players || [];
    if (players.length === 0) return;

    // Rotate dealer clockwise among active seats
    const cur = Number.isInteger(room.state.dealerSeat)
      ? room.state.dealerSeat
      : 0;
    const seatIds = players.map(p => p.seatId).sort((a,b) => a-b);
    const idx = Math.max(0, seatIds.indexOf(cur));
    const nextSeat = seatIds[(idx + 1) % seatIds.length];
    room.state.dealerSeat = nextSeat;

    // Reset per-hand state (scores persist)
    room.crib = [];
    room.cribBySeat = new Set();
    room.state.cribCount = 0;
    room.state.cribLocked = false;
    room.state.cutCard = null;
    room.deck = [];

    // Clear private hands for all seats
    room.hands.clear();

    // Reset pegging fields for the new hand
    room.state.runCount = 0;
    room.state.pegPile = [];
    room.state.lastShown = null;
    room.state.lastShownBySeat = null;
    room.state.lastShownByName = null;
    room.state.shownBySeat = {};
    room.state.peggingComplete = false;

    const nextName = (players.find(p => p.seatId === nextSeat) || {}).name || `Seat ${nextSeat}`;
    addLog(room, `Next hand — dealer: ${nextName}`);

    broadcastState(io, roomId);
  });
}

module.exports = { register };

