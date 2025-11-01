// Minimal card utilities shared by pegging/hands modules.

const RANKS = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];
const SUITS_ASCII = ["S", "H", "D", "C"];
const SUITS_UNICODE = ["♠", "♥", "♦", "♣"];
const FACE_VAL = {
  A: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  J: 10,
  Q: 10,
  K: 10,
};

function isObj(x) {
  return x && typeof x === "object";
}

function normSuit(s) {
  if (SUITS_ASCII.includes(s)) return s;
  if (SUITS_UNICODE.includes(s)) {
    return { "♠": "S", "♥": "H", "♦": "D", "♣": "C" }[s];
  }
  throw new Error("Bad suit: " + s);
}

function normRank(r) {
  const R = String(r).toUpperCase();
  if (RANKS.includes(R)) return R;
  if (R === "1") return "A";
  if (R === "11") return "J";
  if (R === "12") return "Q";
  if (R === "13") return "K";
  throw new Error("Bad rank: " + r);
}

/** Accepts "QH", "Q♥", "10D", {rank:'Q', suit:'H'} */
function parseCard(c) {
  if (isObj(c)) return { rank: normRank(c.rank), suit: normSuit(c.suit) };
  const s = String(c).trim();
  const last = s.slice(-1);
  if (SUITS_UNICODE.includes(last) || SUITS_ASCII.includes(last)) {
    const suit = normSuit(last);
    const rank = normRank(s.slice(0, -1));
    return { rank, suit };
  }
  throw new Error("Unrecognized card format: " + s);
}

function faceValue(card) {
  const { rank } = isObj(card) ? card : parseCard(card);
  return FACE_VAL[rank];
}

module.exports = {
  parseCard,
  faceValue,
  FACE_VAL,
};
