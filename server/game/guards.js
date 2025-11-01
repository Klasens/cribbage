// FILE: server/game/guards.js
// Small predicates & helpers used by the reducer.
// Keep these pure and side-effect free.

function isDealer(state, seatId) {
  return Number.isInteger(state?.dealerSeat) && state.dealerSeat === seatId;
}

function canCribSelect(state, seatId, cards) {
  if (!Array.isArray(cards) || cards.length !== 2) return false;
  if (state?._phase !== "crib") return false;
  if (state?.winnerSeat != null) return false;
  if (!(state?._hands instanceof Map)) return false;
  if (state?._cribBySeat instanceof Set && state._cribBySeat.has(seatId))
    return false;

  const hand = state._hands.get(seatId) || [];
  const uniq = Array.from(new Set(cards.map(String)));
  if (uniq.length !== 2) return false;
  return uniq.every((c) => hand.includes(c));
}

function pegValue(cardText) {
  const t = String(cardText || "").trim();
  const rank = t.slice(0, -1);
  if (rank === "A") return 1;
  if (rank === "J" || rank === "Q" || rank === "K") return 10;
  const n = Number(rank);
  if (Number.isFinite(n)) return Math.max(1, Math.min(10, n));
  return 0;
}

function canPegShow(state, seatId, cardText) {
  if (state?._phase !== "peg") return false;
  if (state?.winnerSeat != null) return false;
  return pegValue(cardText) > 0;
}

function allSeatsShownFour(state) {
  const seats = (state?.players || []).map((p) => p.seatId);
  const by = state?.shownBySeat || {};
  for (const s of seats) {
    const list = Array.isArray(by[s]) ? by[s] : [];
    if (new Set(list).size < 4) return false;
  }
  return seats.length > 0;
}

module.exports = {
  isDealer,
  canCribSelect,
  canPegShow,
  allSeatsShownFour,
  pegValue,
};
