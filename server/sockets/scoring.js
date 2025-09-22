// server/sockets/scoring.js
const { EVT } = require("../../shared/protocol");
const { rooms, broadcastState } = require("../rooms");

function register(io, socket, joined) {
  socket.on(EVT.PEG_ADD, ({ roomId, seatId, delta }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    // Freeze all scoring once a winner is declared
    if (room.state.winnerSeat != null) return;

    const p = room.state.players.find((p) => p.seatId === seatId);
    if (!p) return;

    const n = Number(delta) || 0;
    p.score += n;

    // Winner detection (>= 121)
    if (p.score >= 121 && room.state.winnerSeat == null) {
      room.state.winnerSeat = p.seatId;
      room.state.winnerName = p.name || `Seat ${p.seatId}`;
    }

    broadcastState(io, roomId);
  });
}

module.exports = { register };

