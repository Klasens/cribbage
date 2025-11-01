// FILE: server/game/scoring/pegging.js
// Pegging-related utilities. Minimal for now.

function pegValue(cardText) {
  const t = String(cardText || "").trim();
  const rank = t.slice(0, -1);
  if (rank === "A") return 1;
  if (rank === "J" || rank === "Q" || rank === "K") return 10;
  const n = Number(rank);
  if (Number.isFinite(n)) return Math.max(1, Math.min(10, n));
  return 0;
}

// Placeholders for future auto-awards (pairs, runs, 15/31, etc.)
function scorePeggingEvent(/* pile, newCardText */) {
  return 0;
}

module.exports = { pegValue, scorePeggingEvent };
