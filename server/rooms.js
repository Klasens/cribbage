// server/rooms.js
const { createInitialState } = require("../shared/protocol");

const MAX_PLAYERS = 4;
const MAX_LOG = 200; // cap log length to avoid unbounded growth

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

    // NEW: log entries and per-room sequence for stable unique IDs
    state.log = [];
    state.logSeq = 0;

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

/**
 * NEW: pushLog — add a server-assigned unique log entry
 * @param {object} room
 * @param {string} kind short category (e.g., 'winner', 'next-hand', 'deal')
 * @param {string} text human text for UI
 * @param {object} extra optional extra fields to store with entry
 * @returns {object|undefined} the created entry
 */
function pushLog(room, kind, text, extra = {}) {
  if (!room || !room.state) return;
  const now = Date.now();
  const seq = (room.state.logSeq = (room.state.logSeq || 0) + 1);
  const id = `${now}-${seq}`; // <= unique even if same ms; stable and string
  const entry = { id, ts: now, kind, text, ...extra };
  const list = Array.isArray(room.state.log) ? room.state.log : [];
  const next = [...list, entry];
  if (next.length > MAX_LOG) next.splice(0, next.length - MAX_LOG);
  room.state.log = next;
  return entry;
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
  // NEW export:
  pushLog,
};

