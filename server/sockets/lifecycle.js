// server/sockets/lifecycle.js
const { rooms, unbindSocket } = require("../rooms");

function register(io, socket, joined) {
  socket.on("disconnect", () => {
    console.log("❌ user disconnected:", socket.id);
    if (joined.roomId) {
      const room = rooms.get(joined.roomId);
      if (room) {
        room.sockets.delete(socket.id);
        unbindSocket(room, socket.id);
      }
    }
  });
}

module.exports = { register };
