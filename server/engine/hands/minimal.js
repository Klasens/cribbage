/* Hand/Crib scoring (minimal): only counts Fifteens.
 * No pairs, runs, flush, or knobs.
 *
 * Exports:
 *  - scoreHandFifteens(hand4, cut, { isCrib })  // isCrib currently unused
 */
const { parseCard, faceValue } = require("../lib/cards");

/**
 * Count all 15s in the 5-card set (hand4 + cut).
 * Returns { total, breakdown: { fifteens } }
 */
function scoreHandFifteens(hand, cut, { isCrib = false } = {}) {
  const H = hand.map(parseCard);
  const C = parseCard(cut);
  const five = H.concat([C]);

  const fifteenPoints = countFifteens(five) * 2;

  return {
    total: fifteenPoints,
    breakdown: { fifteens: fifteenPoints },
  };
}

function countFifteens(cards) {
  const vals = cards.map(faceValue);
  let count = 0;
  const n = vals.length; // 5
  for (let mask = 1; mask < 1 << n; mask++) {
    let sum = 0;
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) sum += vals[i];
    }
    if (sum === 15) count++;
  }
  return count;
}

module.exports = {
  scoreHandFifteens,
};
