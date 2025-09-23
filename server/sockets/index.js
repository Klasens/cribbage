// server/sockets/index.js
const roomHandlers = require("./room");
const scoringHandlers = require("./scoring");
const dealHandlers = require("./deal");
const cribHandlers = require("./crib");
const pegHandlers = require("./peg");
const nextHandHandlers = require("./nextHand"); // ⬅️ NEW
const connectionHandlers = require("./lifecycle");

function registerSocket(io) {
  io.on("connection", (socket) => {
    console.log("✅ user connected:", socket.id);

    // Mutable session ref shared by all handlers
    const joined = { roomId: null, seatId: null };

    // Wire up groups
    roomHandlers.register(io, socket, joined);
    scoringHandlers.register(io, socket, joined);
    dealHandlers.register(io, socket, joined);
    cribHandlers.register(io, socket, joined);
    pegHandlers.register(io, socket, joined);
    nextHandHandlers.register(io, socket, joined); // ⬅️ NEW
    connectionHandlers.register(io, socket, joined);
  });
}

module.exports = { registerSocket };

