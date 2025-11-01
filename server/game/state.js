// FILE: server/game/state.js
// Authoritative game-state factory (server-only).
// This mirrors public fields today and adds private server fields
// we'll use once we wire the reducer in step 7/8.

function createState(roomId = "") {
  return {
    // ---- identity / players ----
    roomId,
    players: [], // [{ seatId, name, score, prevScore }]
    dealerSeat: null, // number | null

    // ---- public crib / starter progress ----
    cribCount: 0, // 0..4
    cribLocked: false,
    cutCard: null, // "5♣" | null

    // ---- public pegging run (manual for now) ----
    runCount: 0, // 0..31
    pegPile: [], // ["A♣","5♦",...]
    lastShown: null, // card text
    lastShownBySeat: null, // number | null
    lastShownByName: null, // string | null
    shownBySeat: {}, // { [seatId:number]: string[] }
    peggingComplete: false,

    // ---- public reveal after pegging ----
    revealHands: null, // { [seatId:number]: string[] } | null
    revealCrib: null, // string[] | null

    // ---- public convenience ----
    handCounts: {}, // { [seatId:number]: number }

    // ---- winner metadata ----
    winnerSeat: null,
    winnerName: null,

    // ---- public log (server assigns ids) ----
    log: [],
    logSeq: 0,

    // =========================================
    // Server-private fields (not broadcasted if you choose)
    // We'll keep them on state for single source of truth.
    // =========================================
    _phase: "idle", // 'idle'|'deal'|'crib'|'cut'|'peg'|'reveal'|'score'
    _hands: new Map(), // seatId -> string[]
    _crib: [], // string[]
    _cribBySeat: new Set(), // Set<number>
    _deck: [], // Array<{r,s}>
  };
}

module.exports = { createState };
