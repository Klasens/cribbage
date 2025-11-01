// FILE: server/game/actions.js
// Action catalog for reducer. Pure data only.

const ACT = {
  DEAL: "DEAL", // { dealerSeat }
  CRIB_SELECT: "CRIB_SELECT", // { seatId, cards:[string,string] }
  CUT_STARTER: "CUT_STARTER", // {}
  PEG_SHOW: "PEG_SHOW", // { seatId, cardText }
  PEG_RESET: "PEG_RESET", // {}
  PEG_COMPLETE: "PEG_COMPLETE", // {}
  REVEAL: "REVEAL", // {}
  NEXT_HAND: "NEXT_HAND", // {}
  SCOREBOARD_ADD: "SCOREBOARD_ADD", // { seatId, delta }
  NEW_GAME: "NEW_GAME", // {}
};

module.exports = { ACT };
