// Pure evaluator for a single pegging play.
// prevSeq: array of prior cardText strings like ["5♣","10♦"]
// cardText: next card string like "K♠"
// Returns:
//   { ok, newSeq, total, points, logs: string[], reason?: "EXCEEDS_31", hit15, hit31 }

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

  return {
    ok: true,
    newSeq,
    total: tentative,
    points,
    logs,
    reason: undefined,
    hit15,
    hit31,
  };
}

module.exports = { evaluatePeggingEvent, sumPeg, cardToPegVal };
