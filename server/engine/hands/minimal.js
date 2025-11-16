/* Pegging rules (minimal): counts Fifteen (2), Thirty-one (2), and runs.
 * No pairs, no "last card" point.
 *
 * Exports:
 *  - canPlay(card, currentCount)
 *  - legalPegPlays(hand, currentCount)
 *  - evaluatePeggingEvent(prevSeq, newCard)
 *
 * evaluatePeggingEvent returns:
 *   {
 *     valid: boolean,
 *     reason?: "count>31",
 *     count: number,   // new running total
 *     points: number,  // points scored by this play
 *     events: {
 *       fifteen?: boolean,
 *       thirtyOne?: boolean,
 *       run?: number,   // length of run scored (e.g., 3,4,5,...)
 *     },
 *   }
 */
const { parseCard, faceValue } = require("../lib/cards");

/** True if playing `card` would keep the running count ≤ 31 */
function canPlay(card, currentCount) {
  return currentCount + faceValue(card) <= 31;
}

/** Filter hand down to cards playable at `currentCount` */
function legalPegPlays(hand, currentCount) {
  return hand.map(parseCard).filter((c) => currentCount + faceValue(c) <= 31);
}

// ----- Helpers for run detection -----

function cardRankIndex(parsed) {
  const r = parsed && parsed.rank ? String(parsed.rank).toUpperCase() : "";
  if (r === "A") return 1;
  if (r === "J") return 11;
  if (r === "Q") return 12;
  if (r === "K") return 13;
  const n = Number(r);
  if (Number.isFinite(n)) return Math.max(1, Math.min(13, n));
  return 0;
}

/**
 * Detect longest trailing run (len ≥ 3) in a parsed sequence, ending on the
 * newest card. Mirrors pegging rules: walk backwards from last card until a
 * duplicate rank is seen; within that tail, any set of distinct, consecutive
 * ranks yields a run.
 *
 * @param {Array<{rank:string,suit:string}>} parsedSeq
 * @returns {number} run length (0 if none)
 */
function detectRun(parsedSeq) {
  const n = parsedSeq.length;
  if (n < 3) return 0;

  const ranks = parsedSeq.map(cardRankIndex);
  const seen = new Set();
  let minR = Infinity;
  let maxR = -Infinity;
  let bestLen = 0;

  for (let i = n - 1; i >= 0; i--) {
    const r = ranks[i];
    if (seen.has(r)) break; // duplicate rank stops longer runs
    seen.add(r);

    if (r < minR) minR = r;
    if (r > maxR) maxR = r;

    const len = n - i;
    if (len < 3) continue;

    if (maxR - minR + 1 === len) {
      bestLen = len;
    }
  }

  return bestLen >= 3 ? bestLen : 0;
}

/**
 * Evaluate a pegging play with the **minimal** scoring set.
 * @param {Array<string|object>} prevSeq - cards since last reset (after 31 or "go"), oldest→newest
 * @param {Object|String} newCard
 * @returns {Object} { valid, reason?, count, points, events }
 *   events: { fifteen?:true, thirtyOne?:true, run?: number }
 */
function evaluatePeggingEvent(prevSeq, newCard) {
  const seq = prevSeq.map(parseCard);
  const nc = parseCard(newCard);
  const newSeq = seq.concat(nc);

  const newCount = newSeq.reduce((s, c) => s + faceValue(c), 0);

  if (newCount > 31) {
    return {
      valid: false,
      reason: "count>31",
      count: newCount,
      points: 0,
      events: {},
    };
  }

  const events = {};
  let points = 0;

  // Fifteen / thirty-one
  if (newCount === 15) {
    events.fifteen = true;
    points += 2;
  }
  if (newCount === 31) {
    events.thirtyOne = true;
    points += 2;
  }

  // Runs: longest trailing run ending on this card
  const runLen = detectRun(newSeq);
  if (runLen >= 3) {
    events.run = runLen;
    points += runLen;
  }

  return { valid: true, count: newCount, points, events };
}

module.exports = {
  canPlay,
  legalPegPlays,
  evaluatePeggingEvent,
};
