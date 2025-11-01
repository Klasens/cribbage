// FILE: server/game/reducer.js
// Pure reducer: (state, action) => newState
// Step 1 scaffold: implement identity behavior; wire later.

const { ACT } = require("./actions");

/**
 * Shallow clone helper for state; we only clone when we actually modify
 * something in subsequent steps. For now, step 1 returns state unchanged.
 */
function reduce(state, action) {
  if (!action || typeof action.type !== "string") return state;
  switch (action.type) {
    case ACT.DEAL:
    case ACT.CRIB_SELECT:
    case ACT.CUT_STARTER:
    case ACT.PEG_SHOW:
    case ACT.PEG_RESET:
    case ACT.PEG_COMPLETE:
    case ACT.REVEAL:
    case ACT.NEXT_HAND:
    case ACT.SCOREBOARD_ADD:
    case ACT.NEW_GAME:
      // No-op until we fill logic in step 6/7; return state as-is.
      return state;
    default:
      return state;
  }
}

module.exports = { reduce };
