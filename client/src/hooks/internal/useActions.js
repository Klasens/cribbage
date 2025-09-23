// client/src/hooks/internal/useActions.js
import { api } from "../../lib/socket";
import { clearSeat, clearAllSeats } from "../../lib/storage";

export function makeActions(ctx) {
  const {
    state,
    roomId,
    setRoomId,
    name,
    mySeatId,
    setMySeatId,
    setPendingSelfAssign,
  } = ctx;

  const create = () => {
    if (!roomId || !name) return;
    api.create(roomId, name);
    setPendingSelfAssign(true);
  };

  const join = () => {
    if (!roomId || !name) return;
    api.join(roomId, name);
    setPendingSelfAssign(true);
  };

  // Manual scoreboard points (separate from run-to-31)
  const peg = (delta) => {
    if (!state?.roomId || mySeatId == null) return;
    api.peg(state.roomId, mySeatId, delta);
  };

  const pegN = () => {
    const raw = prompt("Add how many points?");
    const n = Number(raw);
    if (Number.isFinite(n) && n !== 0) peg(n);
  };

  const deal = () => {
    if (!state?.roomId) return;
    api.deal(state.roomId);
  };

  const sendCrib = (cards) => {
    if (!state?.roomId || mySeatId == null) return;
    if (!Array.isArray(cards) || cards.length !== 2) return;
    api.cribSelect(state.roomId, mySeatId, cards);
  };

  // --- Pegging (run-to-31) ---
  const showCard = (cardText) => {
    if (!state?.roomId || mySeatId == null) return;
    if (!cardText) return;
    api.pegShow(state.roomId, mySeatId, String(cardText));
  };

  const resetRun = () => {
    if (!state?.roomId) return;
    api.pegReset(state.roomId);
  };

  // --- Next Hand rotation ---
  const nextHand = () => {
    if (!state?.roomId) return;
    api.nextHand(state.roomId);
  };

  // Local helpers
  const resetLocal = () => {
    if (!roomId) return;
    clearSeat(roomId);
    location.reload();
  };

  const clearLocal = (all = false) => {
    if (all) clearAllSeats();
    else if (roomId) clearSeat(roomId);
    setMySeatId(null);
    // keep name in input for convenience
  };

  return {
    create,
    join,
    peg,
    pegN,
    deal,
    sendCrib,
    showCard,
    resetRun,
    nextHand,  // ⬅️ NEW
    resetLocal,
    clearLocal,
  };
}

