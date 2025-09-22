// client/src/lib/socket.js
import { io } from "socket.io-client";

// Keep event names synced with shared/protocol.js (duplicated locally for now)
export const EVT = {
  ROOM_CREATE: "room:create",
  ROOM_JOIN: "room:join",
  ROOM_REJOIN: "room:rejoin",
  STATE_UPDATE: "state:update",
  PEG_ADD: "peg:add",

  HOST_DEAL: "host:deal",
  HAND_YOUR: "hand:your",
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
  peg: (roomId, seatId, delta) =>
    socket.emit(EVT.PEG_ADD, { roomId, seatId, delta }),

  // NEW
  deal: (roomId) => socket.emit(EVT.HOST_DEAL, { roomId }),
};
