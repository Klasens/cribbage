// client/src/lib/socket.js
import { io } from "socket.io-client";

// Keep event names synced with shared/protocol.js (duplicated locally for now)
export const EVT = {
  ROOM_CREATE: "room:create",
  ROOM_JOIN: "room:join",
  ROOM_REJOIN: "room:rejoin",
  STATE_UPDATE: "state:update",

  PEG_ADD: "peg:add", // scoreboard increments (separate from run-to-31)

  HOST_DEAL: "host:deal",
  HAND_YOUR: "hand:your",

  // Crib flow
  PLAYER_CRIB_SELECT: "player:cribSelect",

  // Pegging run
  PEG_SHOW: "peg:show",
  PEG_RESET: "peg:reset",

  // Next Hand rotation
  NEXT_HAND: "hand:next",

  // New Game
  NEW_GAME: "game:new",
};

export const socket = io("http://localhost:3000");

export function onStateUpdate(fn) {
  socket.on(EVT.STATE_UPDATE, fn);
  return () => socket.off(EVT.STATE_UPDATE, fn);
}

export function onYourHand(fn) {
  socket.on(EVT.HAND_YOUR, fn);
  return () => socket.off(EVT.HAND_YOUR, fn);
}

export const api = {
  create: (roomId, displayName = "Player") =>
    socket.emit(EVT.ROOM_CREATE, { roomId, displayName }),
  join: (roomId, displayName = "Player") =>
    socket.emit(EVT.ROOM_JOIN, { roomId, displayName }),
  rejoin: (roomId, seatId, displayName = "Player") =>
    socket.emit(EVT.ROOM_REJOIN, { roomId, seatId, displayName }),

  // Manual scoreboard points
  peg: (roomId, seatId, delta) =>
    socket.emit(EVT.PEG_ADD, { roomId, seatId, delta }),

  // Dealing
  deal: (roomId) => socket.emit(EVT.HOST_DEAL, { roomId }),

  // Crib
  cribSelect: (roomId, seatId, cards /* length 2 */) =>
    socket.emit(EVT.PLAYER_CRIB_SELECT, { roomId, seatId, cards }),

  // Pegging run (manual)
  pegShow: (roomId, seatId, cardText) =>
    socket.emit(EVT.PEG_SHOW, { roomId, seatId, cardText }),
  pegReset: (roomId) =>
    socket.emit(EVT.PEG_RESET, { roomId }),

  // Next Hand (rotate dealer, reset per-hand state)
  nextHand: (roomId) =>
    socket.emit(EVT.NEXT_HAND, { roomId }),

  // New Game (full reset to fresh game)
  newGame: (roomId) =>
    socket.emit(EVT.NEW_GAME, { roomId }),
};

