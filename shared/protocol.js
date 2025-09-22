// shared/protocol.js

// Centralized socket event names
exports.EVT = {
  ROOM_CREATE: "room:create", // { roomId, displayName }
  ROOM_JOIN: "room:join", // { roomId, displayName }
  ROOM_REJOIN: "room:rejoin", // { roomId, seatId, displayName }
  STATE_UPDATE: "state:update", // { state }
  PEG_ADD: "peg:add", // { roomId, seatId, delta }

  // NEW: dealing flow
  HOST_DEAL: "host:deal", // { roomId } (dealer-only)
  HAND_YOUR: "hand:your", // { cards: string[] } (private to seat)
};

// Minimal GameState factory
exports.createInitialState = function createInitialState() {
  return {
    roomId: "",
    players: [], // [{ seatId, name, score }]
    dealerSeat: null, // number | null
  };
};
