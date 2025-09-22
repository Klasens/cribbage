// server/rooms.js
const { createInitialState } = require("../shared/protocol");

const MAX_PLAYERS = 4;

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

function broadcastState(io, roomId) {
  const room = rooms.get(roomId);
  if (!room) return;
  io.to(roomId).emit("state:update", { state: room.state });
}

function normName(name) {
  const s = String(name || "").trim();
  return s.length ? s.slice(0, 40) : "Player";
}

function roomIsFull(state) {
  return (state?.players?.length ?? 0) >= MAX_PLAYERS;
}

function addPlayer(state, rawName) {
  if (roomIsFull(state)) return null;
  const name = normName(rawName);
  const seatId = state.players.length; // 0..3
  state.players.push({ seatId, name, score: 0 });
  if (state.dealerSeat === null) state.dealerSeat = 0;
  return seatId;
}

module.exports = {
  rooms,
  MAX_PLAYERS,
  ensureRoom,
  broadcastState,
  normName,
  roomIsFull,
  addPlayer,
};
