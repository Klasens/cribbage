// Pure evaluator for a single pegging play.
// prevSeq: array of prior cardText strings like ["5♣","10♦"]
// cardText: next card string like "K♠"
// Returns:
//   {
//     ok,
//     newSeq,
//     total,
//     points,
//     logs: string[],
//     reason?: "EXCEEDS_31",
//     hit15,
//     hit31,
//     runLength, // length of trailing run scored this play (0 if none)
//     pairLength, // length of trailing pairs scored this play (0 if none)
//   }

function cardToPegVal(cardText) {
  if (!cardText || typeof cardText !== "string") return 0;
  // Support ranks like "10", "J", "Q", "K", "A" with a suit suffix.
  const rank = cardText.slice(0, -1).trim().toUpperCase();
  if (!rank) return 0;
  if (rank === "A") return 1;
  if (rank === "J" || rank === "Q" || rank === "K") return 10;
  const n = Number(rank);
  if (Number.isFinite(n)) return Math.max(1, Math.min(10, n));
  return 0;
}

function sumPeg(seq) {
  return seq.reduce((acc, txt) => acc + cardToPegVal(txt), 0);
}

// ----- Helpers for run detection -----

function rankIndex(cardText) {
  if (!cardText || typeof cardText !== "string") return 0;
  const rank = cardText.slice(0, -1).trim().toUpperCase();
  if (!rank) return 0;
  if (rank === "A") return 1;
  if (rank === "J") return 11;
  if (rank === "Q") return 12;
  if (rank === "K") return 13;
  const n = Number(rank);
  if (Number.isFinite(n)) return Math.max(1, Math.min(13, n));
  return 0;
}

/**
 * Detect the longest trailing run (len ≥ 3) in seq, ending at the last card.
 * Mirrors pegging rules: we walk backwards from the last card, stopping once we
 * see a duplicate rank; within that tail, any set of distinct, consecutive
 * ranks scores the run length.
 *
 * @param {string[]} seq - full pegging sequence, oldest → newest
 * @returns {{ length: number, cards: string[] }}
 */
function detectRun(seq) {
  const n = seq.length;
  if (n < 3) return { length: 0, cards: [] };

  const ranks = seq.map(rankIndex);

  let bestLen = 0;
  let bestStart = -1;

  const seen = new Set();
  let minR = Infinity;
  let maxR = -Infinity;

  // Walk backwards from the most recent card
  for (let i = n - 1; i >= 0; i--) {
    const r = ranks[i];
    if (seen.has(r)) break; // duplicate rank kills longer runs
    seen.add(r);

    if (r < minR) minR = r;
    if (r > maxR) maxR = r;

    const len = n - i;
    if (len < 3) continue;

    if (maxR - minR + 1 === len) {
      bestLen = len;
      bestStart = i;
    }
  }

  if (bestLen >= 3 && bestStart >= 0) {
    return {
      length: bestLen,
      cards: seq.slice(bestStart),
    };
  }

  return { length: 0, cards: [] };
}

/**
 * Count consecutive pairs from the end of the sequence.
 * Returns { length: number, points: number }
 * - 2 consecutive same rank → length 2, points 2
 * - 3 consecutive same rank → length 3, points 6
 * - 4 consecutive same rank → length 4, points 12
 *
 * @param {string[]} seq - full pegging sequence, oldest → newest
 * @returns {{ length: number, points: number }}
 */
function detectPairs(seq) {
  const n = seq.length;
  if (n < 2) return { length: 0, points: 0 };

  // Get rank of the most recent card
  const lastRank = rankIndex(seq[n - 1]);
  let count = 1;

  // Walk backwards counting consecutive matching ranks
  for (let i = n - 2; i >= 0; i--) {
    const rank = rankIndex(seq[i]);
    if (rank !== lastRank) break;
    count++;
    if (count === 4) break; // Max 4 of a kind
  }

  // Convert count to points
  // 2 cards = 1 pair = 2 pts
  // 3 cards = 3 pairs = 6 pts
  // 4 cards = 6 pairs = 12 pts
  if (count === 2) return { length: 2, points: 2 };
  if (count === 3) return { length: 3, points: 6 };
  if (count === 4) return { length: 4, points: 12 };

  return { length: 0, points: 0 };
}

function evaluatePeggingEvent(prevSeq, cardText) {
  const before = sumPeg(prevSeq);
  const v = cardToPegVal(cardText);
  const tentative = before + v;

  const logs = [];

  if (tentative > 31) {
    logs.push(
      `PEG: Reject "${cardText}" — would exceed 31 (current ${before}, value ${v}).`,
    );
    return {
      ok: false,
      newSeq: prevSeq.slice(),
      total: before,
      points: 0,
      logs,
      reason: "EXCEEDS_31",
      hit15: false,
      hit31: false,
      runLength: 0,
      pairLength: 0,
    };
  }

  const newSeq = prevSeq.concat(cardText);
  logs.push(`PEG: Played "${cardText}" → total ${tentative}.`);

  let points = 0;
  let hit15 = false;
  let hit31 = false;

  if (tentative === 15) {
    points += 2;
    hit15 = true;
    logs.push(`PEG: +2 for reaching 15.`);
  }
  if (tentative === 31) {
    points += 2;
    hit31 = true;
    logs.push(`PEG: +2 for reaching 31.`);
  }

  // Pairs: consecutive cards of same rank
  const { length: pairLength, points: pairPoints } = detectPairs(newSeq);
  if (pairLength > 0) {
    points += pairPoints;
    const pairLabel =
      pairLength === 4
        ? "double pair royal"
        : pairLength === 3
        ? "pair royal"
        : "pair";
    const rankLabel = rankIndex(cardText);
    logs.push(
      `PEG: +${pairPoints} for ${pairLabel} (${pairLength} ${rankLabel}'s).`,
    );
  }

  // Runs: longest trailing run ending on this card
  const { length: runLength, cards: runCards } = detectRun(newSeq);
  if (runLength >= 3) {
    points += runLength;
    logs.push(
      `PEG: +${runLength} for run of ${runLength}: ${runCards.join(" - ")}.`,
    );
  }

  return {
    ok: true,
    newSeq,
    total: tentative,
    points,
    logs,
    reason: undefined,
    hit15,
    hit31,
    runLength,
    pairLength,
  };
}

module.exports = { evaluatePeggingEvent, sumPeg, cardToPegVal, detectPairs };
