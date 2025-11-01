/* Run: node server/engine/pegging/minimal.test.js */
const assert = require("assert");
const { evaluatePeggingEvent, canPlay, legalPegPlays } = require("./minimal");

(function testCanPlayAndLegals() {
  assert.strictEqual(canPlay("K♣", 20), true); // 20 + 10 = 30
  assert.strictEqual(canPlay("K♣", 22), false); // 22 + 10 = 32 > 31

  // At count=20, 5 (→25), 10 (→30), and K (→30) are all legal.
  const legals = legalPegPlays(["5H", "10S", "K♦"], 20).map((c) => c.rank);
  assert.deepStrictEqual(legals, ["5", "10", "K"]);
})();

(function testFifteenAndThirtyOneOnly() {
  // Fifteen for 2
  let prev = ["5H"]; // 5
  let res = evaluatePeggingEvent(prev, "10C"); // → 15
  assert.strictEqual(res.valid, true);
  assert.strictEqual(res.count, 15);
  assert.strictEqual(res.points, 2);
  assert.ok(res.events.fifteen);

  // A legal non-scoring play (no pairs/runs in minimal rules)
  prev = ["4S", "5D"]; // 9
  res = evaluatePeggingEvent(prev, "3H"); // → 12, 0 pts
  assert.strictEqual(res.valid, true);
  assert.strictEqual(res.points, 0);

  // Thirty-one for 2
  prev = ["10S", "9H", "2♦"]; // 21
  res = evaluatePeggingEvent(prev, "10C"); // → 31
  assert.strictEqual(res.valid, true);
  assert.strictEqual(res.count, 31);
  assert.strictEqual(res.points, 2);
  assert.ok(res.events.thirtyOne);

  // Over 31 → invalid
  prev = ["10S", "9H", "A♦"]; // 20
  res = evaluatePeggingEvent(prev, "J♣"); // → 30 (valid, 0 pts)
  assert.strictEqual(res.valid, true);
  assert.strictEqual(res.count, 30);
  assert.strictEqual(res.points, 0);

  res = evaluatePeggingEvent(["10S", "9H", "A♦"], "Q♣"); // 20 + 10 = 30 (still valid)
  assert.strictEqual(res.valid, true);
  assert.strictEqual(res.count, 30);

  // Actually force invalid (>31)
  res = evaluatePeggingEvent(["10S", "10H", "2♦"], "K♣"); // 22 + 10 = 32 → invalid
  assert.strictEqual(res.valid, false);
})();
console.log("✓ pegging/minimal tests passed");
