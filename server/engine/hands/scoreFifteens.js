// Minimal hand scoring: counts 15s in hand + cut.
// Cards are strings like "A","2","...","10","J","Q","K"
// Returns { points, detail: string[] }

function rankToPip(cardText) {
  const t = String(cardText).trim().toUpperCase();
  if (t === "A") return 1;
  if (t === "J" || t === "Q" || t === "K") return 10;
  const n = Number(t);
  if (!Number.isNaN(n)) return Math.min(n, 10);
  return 10;
}

function countFifteens(cards) {
  const vals = cards.map(rankToPip);
  let count = 0;
  const detail = [];

  const n = vals.length;
  // check all non-empty subsets
  for (let mask = 1; mask < 1 << n; mask++) {
    let sum = 0;
    const subset = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        sum += vals[i];
        subset.push(cards[i]);
      }
    }
    if (sum === 15) {
      count++;
      detail.push(`15: ${subset.join("+")}`);
    }
  }
  return { count, detail };
}

function scoreHandFifteens(hand, cut, { isCrib = false } = {}) {
  const cards = hand.concat(cut ? [cut] : []);
  const { count, detail } = countFifteens(cards);
  const points = count * 2; // 2 points per 15
  return { points, detail, isCrib };
}

module.exports = {
  scoreHandFifteens,
};
