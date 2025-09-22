// shared/protocol.js

// Centralized socket event names
exports.EVT = {
  ROOM_CREATE: "room:create", // { roomId, displayName }
  ROOM_JOIN: "room:join", // { roomId, displayName }
  STATE_UPDATE: "state:update", // { state }
  PEG_ADD: "peg:add", // { roomId, seatId, delta }  (+1/+2/+3/+N or negative)
};

// Minimal GameState factory
exports.createInitialState = function createInitialState() {
  return {
    roomId: "",
    players: [], // [{ seatId, name, score }]
    dealerSeat: null, // number | null
  };
};
