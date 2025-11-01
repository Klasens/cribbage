// FILE: server/rooms.js
// server/rooms.js
const { createState, getPublicState } = require("./game/state");

const MAX_PLAYERS = 4;
const MAX_LOG = 200;

/** rooms: Map<string, {
 *    state,                   // authoritative game state (public+private)
 *    sockets:Set<string>,
 *    seatSockets:Map<number, Set<string>>,
 *    // Legacy views kept for existing handlers (point at private state)
 *    hands: Map<number,string[]>,   // alias of state._hands
 *    crib: string[],                // alias of state._crib
 *    cribBySeat: Set<number>,       // alias of state._cribBySeat
 *    deck: Array<{r:string,s:string}>, // alias of state._deck
 * }>
 */
const rooms = new Map();

function ensureRoom(roomId) {
  if (!rooms.has(roomId)) {
    const state = createState(roomId);

    rooms.set(roomId, {
      state,
      sockets: new Set(),
      seatSockets: new Map(),
      // Legacy aliases so existing socket handlers keep working:
      get hands() {
        return state._hands;
      },
      set hands(v) {
        state._hands = v;
      },
      get crib() {
        return state._crib;
      },
      set crib(v) {
        state._crib = v;
      },
      get cribBySeat() {
        return state._cribBySeat;
      },
      set cribBySeat(v) {
        state._cribBySeat = v;
      },
      get deck() {
        return state._deck;
      },
      set deck(v) {
        state._deck = v;
      },
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
  const pub = getPublicState(room.state);
  io.to(roomId).emit("state:update", { state: pub });
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
  state.players.push({ seatId, name, score: 0, prevScore: 0 });
  if (state.dealerSeat === null) state.dealerSeat = 0;
  return seatId;
}

function pushLog(room, kind, text, extra = {}) {
  if (!room || !room.state) return;
  const now = Date.now();
  const seq = (room.state.logSeq = (room.state.logSeq || 0) + 1);
  const id = `${now}-${seq}`;
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
  pushLog,
};
