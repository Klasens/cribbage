// server/rooms.js
const { createInitialState } = require("../shared/protocol");

const MAX_PLAYERS = 4;

/** rooms: Map<string, {
 *    state,
 *    sockets:Set<string>,
 *    seatSockets:Map<number, Set<string>>,
 *    hands: Map<number,string[]>,
 *    crib: string[],
 *    cribBySeat: Set<number>,
 *    deck: Array<{r:string,s:string}>
 * }>
 */
const rooms = new Map();

function ensureRoom(roomId) {
  if (!rooms.has(roomId)) {
    const state = createInitialState();
    state.roomId = roomId;
    rooms.set(roomId, {
      state,
      sockets: new Set(),
      seatSockets: new Map(), // seatId -> Set(socketId)
      hands: new Map(), // seatId -> string[]
      crib: [], // running crib pile as card text
      cribBySeat: new Set(), // seats that already submitted their 2 cards
      deck: [], // remaining deck after deal (objects), used to flip starter
    });
  }
  return rooms.get(roomId);
}

function bindSeatSocket(room, seatId, socketId) {
  let set = room.seatSockets.get(seatId);
  if (!set) {
    set = new Set();
    room.seatSockets.set(seatId, set);
  }
  set.add(socketId);
}

function unbindSocket(room, socketId) {
  for (const set of room.seatSockets.values()) {
    set.delete(socketId);
  }
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

/** Append a log entry, capping at the last 60 items. */
function addLog(room, text) {
  try {
    const entry = { text: String(text || "").slice(0, 160), ts: Date.now() };
    const prev = Array.isArray(room.state.logs) ? room.state.logs : [];
    const next = [...prev, entry];
    // Cap to last 60 entries to avoid unbounded growth
    room.state.logs = next.length > 60 ? next.slice(next.length - 60) : next;
  } catch {
    // ignore logging failures
  }
}

module.exports = {
  rooms,
  MAX_PLAYERS,
  ensureRoom,
  bindSeatSocket,
  unbindSocket,
  broadcastState,
  normName,
  roomIsFull,
  addPlayer,
  addLog, // ⬅️ export
};

