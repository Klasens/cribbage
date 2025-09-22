// server/sockets/scoring.js
const { EVT } = require("../../shared/protocol");
const { rooms, broadcastState } = require("../rooms");

function register(io, socket, joined) {
  socket.on(EVT.PEG_ADD, ({ roomId, seatId, delta }) => {
    const room = rooms.get(roomId);
    if (!room) return;
    const p = room.state.players.find((p) => p.seatId === seatId);
    if (!p) return;
    const n = Number(delta) || 0;
    p.score += n;
    broadcastState(io, roomId);
  });
}

module.exports = { register };
