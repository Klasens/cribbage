/* Pegging rules (minimal): only counts Fifteen (2) and Thirty-one (2).
 * No pairs, no runs, no "last card" point.
 *
 * Exports:
 *  - canPlay(card, currentCount)
 *  - legalPegPlays(hand, currentCount)
 *  - evaluatePeggingEvent(prevSeq, newCard)
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

/**
 * Evaluate a pegging play with the **minimal** scoring set.
 * @param {Array} prevSeq - cards since last reset (after 31 or "go"), oldest→newest
 * @param {Object|String} newCard
 * @returns {Object} { valid, reason?, count, points, events }
 *   events: { fifteen?:true, thirtyOne?:true }
 */
function evaluatePeggingEvent(prevSeq, newCard) {
  const seq = prevSeq.map(parseCard);
  const nc = parseCard(newCard);
  const newCount = seq.reduce((s, c) => s + faceValue(c), 0) + faceValue(nc);

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

  if (newCount === 15) {
    events.fifteen = true;
    points += 2;
  }
  if (newCount === 31) {
    events.thirtyOne = true;
    points += 2;
  }

  return { valid: true, count: newCount, points, events };
}

module.exports = {
  canPlay,
  legalPegPlays,
  evaluatePeggingEvent,
};
