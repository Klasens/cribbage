// shared/protocol.js

// Centralized socket event names
exports.EVT = {
  ROOM_CREATE: "room:create", // { roomId, displayName }
  ROOM_JOIN: "room:join", // { roomId, displayName }
  ROOM_REJOIN: "room:rejoin", // { roomId, seatId, displayName }
  STATE_UPDATE: "state:update", // { state }

  // Manual scoring (separate from pegging run)
  PEG_ADD: "peg:add", // { roomId, seatId, delta }

  // Dealing & hands
  HOST_DEAL: "host:deal", // { roomId } (dealer-only)
  HAND_YOUR: "hand:your", // { cards: string[] } (private to seat)

  // Crib flow
  PLAYER_CRIB_SELECT: "player:cribSelect", // { roomId, seatId, cards:[string,string] }

  // Pegging (run-to-31, manual/trust-based)
  PEG_SHOW: "peg:show",   // { roomId, seatId, cardText }
  PEG_RESET: "peg:reset", // { roomId }

  // Next Hand rotation (dealer passes clockwise)
  NEXT_HAND: "hand:next", // { roomId }

  // NEW GAME (full reset)
  NEW_GAME: "game:new",
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

    // Public starter (cut) card once crib locks
    cutCard: null, // string like "5♣" | null

    // Pegging run (public, manual)
    runCount: 0,           // 0..31
    pegPile: [],           // sequence of shown cards (text)
    lastShown: null,       // last shown card text or null
    lastShownBySeat: null, // seatId of who showed last (number | null)
    lastShownByName: null, // display name of who showed last (string | null)

    // Per-seat record of cards shown in the current pegging session
    shownBySeat: {},       // { [seatId:number]: string[] }

    // Marks end of pegging (UI hides Show/Reset; move to hand scoring)
    peggingComplete: false,

    // 🔓 Public reveal after pegging (for manual counting)
    revealHands: null,     // { [seatId:number]: string[] } | null
    revealCrib: null,      // string[] | null

    // NEW (public): count of cards each seat currently holds (no contents)
    handCounts: {},        // { [seatId:number]: number }

    // Winner metadata
    winnerSeat: null,
    winnerName: null,

    // Room log
    log: [],      // [{ id, ts, kind, text, ...extra }]
    logSeq: 0,    // monotonic per-room sequence to ensure unique ids

    // Last scoring event during pegging (for UI animations)
    lastScoringEvent: null, // { points, label, timestamp } | null
  };
};

