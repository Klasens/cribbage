// server/sockets/scoring.js
const { EVT } = require("../../shared/protocol");
const { rooms, broadcastState, pushLog } = require("../rooms");

/**
 * Shared helper: add points to a player's official score.
 * - Sets prevScore for leapfrog animation
 * - Detects winner at >= 121
 * - Logs victory moment
 * Does NOT broadcast — caller handles that.
 */
function addPoints(room, seatId, delta) {
  if (!room || !room.state) return;
  if (room.state.winnerSeat != null) return; // freeze after winner

  const p = room.state.players.find((p) => p.seatId === seatId);
  if (!p) return;

  const n = Number(delta) || 0;
  if (n === 0) return;

  // Capture previous for animation
  p.prevScore = p.score;
  p.score += n;

  // Winner detection
  if (p.score >= 121 && room.state.winnerSeat == null) {
    room.state.winnerSeat = p.seatId;
    room.state.winnerName = p.name || `Seat ${p.seatId}`;
    pushLog(room, "winner", `🏁 ${room.state.winnerName} wins at ${p.score}`);
  }
}

function register(io, socket, joined) {
  socket.on(EVT.PEG_ADD, ({ roomId, seatId, delta }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    addPoints(room, seatId, delta);
    broadcastState(io, roomId);
  });
}

module.exports = { register, addPoints };
