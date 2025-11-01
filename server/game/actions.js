// FILE: shared/actions.js
// Canonical action catalog (pure data). These are server-authored actions
// that mutate the authoritative game state. Client code can import the
// shapes for type-safety and for future optimistic UIs, but the server is
// the source of truth and will validate everything.

const TYPES = {
  // Lifecycle
  NEW_GAME: "game/new",
  NEXT_HAND: "hand/next",

  // Deal & crib
  DEAL: "deal/start", // { dealerSeat:number }
  CRIB_SELECT: "crib/select", // { seatId:number, cards:[string,string] }
  CUT_STARTER: "deal/cut", // { card:string } e.g., "5♣"

  // Pegging run (manual/trust-based)
  PEG_SHOW: "peg/show", // { seatId:number, card:string }
  PEG_RESET: "peg/reset", // { reason?:string }

  // Scoreboard (separate from run-to-31)
  SCORE_ADD: "score/add", // { seatId:number, delta:number }

  // Reveal & winner
  PEG_COMPLETE_REVEAL: "reveal/peg", // { revealHands:Record<seatId,string[]>, revealCrib:string[] }
  SET_WINNER: "winner/set", // { seatId:number }

  // Room / players (non-mutating of cards, included for completeness)
  PLAYER_ADD: "player/add", // { seatId:number, name:string }
};

// ----- Minimal creators (shape helpers) -----
const A = {
  newGame: () => ({ type: TYPES.NEW_GAME }),
  nextHand: () => ({ type: TYPES.NEXT_HAND }),

  deal: (dealerSeat) => ({ type: TYPES.DEAL, payload: { dealerSeat } }),
  cribSelect: (seatId, cards) => ({
    type: TYPES.CRIB_SELECT,
    payload: { seatId, cards },
  }),
  cutStarter: (card) => ({ type: TYPES.CUT_STARTER, payload: { card } }),

  pegShow: (seatId, card) => ({
    type: TYPES.PEG_SHOW,
    payload: { seatId, card },
  }),
  pegReset: (reason) => ({ type: TYPES.PEG_RESET, payload: { reason } }),

  scoreAdd: (seatId, delta) => ({
    type: TYPES.SCORE_ADD,
    payload: { seatId, delta },
  }),

  pegReveal: (revealHands, revealCrib) => ({
    type: TYPES.PEG_COMPLETE_REVEAL,
    payload: { revealHands, revealCrib },
  }),
  setWinner: (seatId) => ({ type: TYPES.SET_WINNER, payload: { seatId } }),

  playerAdd: (seatId, name) => ({
    type: TYPES.PLAYER_ADD,
    payload: { seatId, name },
  }),
};

module.exports = { TYPES, A };
