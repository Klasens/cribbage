// FILE: server/game/state.js
// Authoritative game-state factory (server-only). Public fields are the
// JSON-serializable shape we emit to clients; private fields are prefixed
// with "_" and are never broadcast.

function createState(roomId = "") {
  return {
    // ---------- PUBLIC (broadcast) ----------
    roomId,
    players: [], // [{ seatId, name, score, prevScore }]
    dealerSeat: null,

    // Crib / starter progress
    cribCount: 0,
    cribLocked: false,
    cutCard: null, // "5♣" | null

    // Pegging run (manual for now)
    runCount: 0, // 0..31
    pegPile: [],
    lastShown: null,
    lastShownBySeat: null,
    lastShownByName: null,
    shownBySeat: {}, // { [seatId:number]: string[] }
    peggingComplete: false,

    // Reveal after pegging
    revealHands: null, // { [seatId:number]: string[] } | null
    revealCrib: null, // string[] | null

    // Convenience
    handCounts: {}, // { [seatId:number]: number }

    // Winner
    winnerSeat: null,
    winnerName: null,

    // Room log
    log: [],
    logSeq: 0,

    // ---------- PRIVATE (server-only) ----------
    _phase: "idle", // 'idle'|'deal'|'crib'|'cut'|'peg'|'reveal'|'score'
    _hands: new Map(), // seatId -> string[]
    _crib: [], // string[]
    _cribBySeat: new Set(), // Set<number>
    _deck: [], // Array<{r,s}>
  };
}

// Produce a JSON-safe public snapshot; strips Maps/Sets/private fields.
function getPublicState(state) {
  if (!state || typeof state !== "object") return null;
  return {
    roomId: state.roomId,
    players: Array.isArray(state.players) ? state.players : [],
    dealerSeat: state.dealerSeat,

    cribCount: state.cribCount,
    cribLocked: state.cribLocked,
    cutCard: state.cutCard,

    runCount: state.runCount,
    pegPile: Array.isArray(state.pegPile) ? state.pegPile : [],
    lastShown: state.lastShown,
    lastShownBySeat: state.lastShownBySeat,
    lastShownByName: state.lastShownByName,
    shownBySeat:
      typeof state.shownBySeat === "object" && state.shownBySeat
        ? state.shownBySeat
        : {},

    peggingComplete: state.peggingComplete,

    revealHands: state.revealHands || null,
    revealCrib: state.revealCrib || null,

    handCounts:
      typeof state.handCounts === "object" && state.handCounts
        ? state.handCounts
        : {},

    winnerSeat: state.winnerSeat,
    winnerName: state.winnerName,

    log: Array.isArray(state.log) ? state.log : [],
    logSeq: state.logSeq ?? 0,
  };
}

module.exports = { createState, getPublicState };
