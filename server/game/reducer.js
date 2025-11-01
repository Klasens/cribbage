// FILE: server/game/reducer.js
// Pure reducer over the authoritative game state.
// NOTE: Step 3 adds signatures & guard-rails only; cases will be filled in
// in later steps. For now, we return the same state to avoid any behavior
// change until sockets are wired to dispatch.
//
// State shape: see server/game/state.js (public + private fields).

const { TYPES } = require("./actions"); // ⬅️ fixed path
const { createState } = require("./state");

/**
 * @param {ReturnType<typeof createState>} state
 * @param {{ type:string, payload?:any }} action
 * @returns {ReturnType<typeof createState>}
 */
function reduce(state, action) {
  if (!state || typeof state !== "object") {
    throw new Error("reduce(): invalid state");
  }
  if (!action || typeof action.type !== "string") {
    return state;
  }

  switch (action.type) {
    // ===== Lifecycle =====
    case TYPES.NEW_GAME: {
      // payload: {}
      // Reset scores & per-hand/private fields; dealer -> 0 if players exist.
      // (Implemented in Step 4)
      return state;
    }
    case TYPES.NEXT_HAND: {
      // payload: {}
      // Rotate dealer clockwise among active seats; clear per-hand fields.
      // (Implemented in Step 4)
      return state;
    }

    // ===== Deal & crib =====
    case TYPES.DEAL: {
      // payload: { dealerSeat:number }
      // Shuffle new deck, deal 6 each -> state._hands, publish handCounts.
      // (Implemented in Step 5)
      return state;
    }
    case TYPES.CRIB_SELECT: {
      // payload: { seatId:number, cards:[string,string] }
      // Validate cards ∈ player's hand; move to _crib; lock at 4; update counts.
      // (Implemented in Step 5)
      return state;
    }
    case TYPES.CUT_STARTER: {
      // payload: { card:string }
      // Flip and set public cutCard; transition phase to 'peg'.
      // (Implemented in Step 5)
      return state;
    }

    // ===== Pegging (run-to-31) =====
    case TYPES.PEG_SHOW: {
      // payload: { seatId:number, card:string }
      // Increment runCount; track pile and shownBySeat; complete → reveal.
      // (Implemented in Step 6)
      return state;
    }
    case TYPES.PEG_RESET: {
      // payload: { reason?:string }
      // Zero runCount; keep shownBySeat for checkmarks.
      // (Implemented in Step 6)
      return state;
    }

    // ===== Scoreboard =====
    case TYPES.SCORE_ADD: {
      // payload: { seatId:number, delta:number }
      // Add delta; set prevScore; if >=121, dispatch SET_WINNER.
      // (Implemented in Step 7)
      return state;
    }

    // ===== Reveal & winner =====
    case TYPES.PEG_COMPLETE_REVEAL: {
      // payload: { revealHands:Record<number,string[]>, revealCrib:string[] }
      // Publish reveals, then clear transient pegging run fields.
      // (Implemented in Step 6)
      return state;
    }
    case TYPES.SET_WINNER: {
      // payload: { seatId:number }
      // Freeze table interaction; winnerSeat/winnerName populated.
      // (Implemented in Step 7)
      return state;
    }

    // ===== Players =====
    case TYPES.PLAYER_ADD: {
      // payload: { seatId:number, name:string }
      // Append to players[]; only used for state bootstrapping/testing.
      // (Implemented in Step 8, optional)
      return state;
    }

    default:
      return state;
  }
}

module.exports = { reduce };
