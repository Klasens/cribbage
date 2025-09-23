// server/sockets/scoring.js
const { EVT } = require("../../shared/protocol");
const { rooms, broadcastState, addLog } = require("../rooms");

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

    // Log score change
    const sign = n >= 0 ? `+${n}` : `${n}`;
    addLog(room, `${p.name || `Seat ${p.seatId}`} ${sign} (score ${p.score})`);

    // Winner detection (>= 121)
    if (p.score >= 121 && room.state.winnerSeat == null) {
      room.state.winnerSeat = p.seatId;
      room.state.winnerName = p.name || `Seat ${p.seatId}`;
      addLog(room, `🏁 ${room.state.winnerName} wins at ${p.score}`);
    }

    broadcastState(io, roomId);
  });
}

module.exports = { register };

