// shared/protocol.js

// Centralized socket event names
exports.EVT = {
  ROOM_CREATE: "room:create", // { roomId, displayName }
  ROOM_JOIN: "room:join", // { roomId, displayName }
  ROOM_REJOIN: "room:rejoin", // { roomId, seatId, displayName }
  STATE_UPDATE: "state:update", // { state }
  PEG_ADD: "peg:add", // { roomId, seatId, delta }

  // Dealing & hands
  HOST_DEAL: "host:deal", // { roomId } (dealer-only)
  HAND_YOUR: "hand:your", // { cards: string[] } (private to seat)

  // Crib flow
  PLAYER_CRIB_SELECT: "player:cribSelect", // { roomId, seatId, cards:[string,string] }
};

// Minimal GameState factory
exports.createInitialState = function createInitialState() {
  return {
    roomId: "",
    players: [], // [{ seatId, name, score }]
    dealerSeat: null, // number | null

    // Crib progress (public)
    cribCount: 0, // 0..4
    cribLocked: false, // becomes true when cribCount === 4

    // NEW: public starter (cut) card once crib locks
    cutCard: null, // string like "5♣" | null
  };
};
