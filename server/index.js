const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const { EVT, createInitialState } = require("../shared/protocol");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// serve built client in prod
app.use(express.static(path.join(__dirname, "../client/dist")));

// ---------------- In-memory room store ----------------
/** rooms: Map<string, { state: GameState, sockets: Set<string> }> */
const rooms = new Map();

function ensureRoom(roomId) {
  if (!rooms.has(roomId)) {
    const state = createInitialState();
    state.roomId = roomId;
    rooms.set(roomId, { state, sockets: new Set() });
  }
  return rooms.get(roomId);
}

function broadcastState(roomId) {
  const room = rooms.get(roomId);
  if (!room) return;
  io.to(roomId).emit(EVT.STATE_UPDATE, { state: room.state });
}

function addPlayer(state, name) {
  const seatId = state.players.length; // 0..3
  state.players.push({ seatId, name: name || "Player", score: 0 });
  if (state.dealerSeat === null) state.dealerSeat = 0;
  return seatId;
}

// ---------------- Socket handlers ----------------
io.on("connection", (socket) => {
  console.log("✅ user connected:", socket.id);

  // Track this socket's membership
  let joined = { roomId: null, seatId: null };

  socket.on(EVT.ROOM_CREATE, ({ roomId, displayName }) => {
    if (!roomId) return;
    const room = ensureRoom(roomId);
    socket.join(roomId);
    room.sockets.add(socket.id);

    const seatId = addPlayer(room.state, displayName);
    joined = { roomId, seatId };

    broadcastState(roomId);
  });

  socket.on(EVT.ROOM_JOIN, ({ roomId, displayName }) => {
    if (!roomId) return;
    const room = ensureRoom(roomId);
    socket.join(roomId);
    room.sockets.add(socket.id);

    const seatId = addPlayer(room.state, displayName);
    joined = { roomId, seatId };

    broadcastState(roomId);
  });

  // Manual scoring delta (+1/+2/+3/+N or negative)
  socket.on(EVT.PEG_ADD, ({ roomId, seatId, delta }) => {
    const room = rooms.get(roomId);
    if (!room) return;
    const p = room.state.players.find(p => p.seatId === seatId);
    if (!p) return;
    const n = Number(delta) || 0;
    p.score += n;
    broadcastState(roomId);
  });

  socket.on("disconnect", () => {
    console.log("❌ user disconnected:", socket.id);
    if (joined.roomId) {
      const room = rooms.get(joined.roomId);
      if (room) {
        room.sockets.delete(socket.id);
        // MVP: keep players in the room for now (no auto-remove)
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

