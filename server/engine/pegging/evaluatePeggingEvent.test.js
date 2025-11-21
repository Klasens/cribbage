/* Run: node server/engine/pegging/evaluatePeggingEvent.test.js */
const assert = require("assert");
const { evaluatePeggingEvent, detectPairs } = require("./evaluatePeggingEvent");

(function testPairs() {
  console.log("Testing pairs detection...");

  // Simple pair (2 consecutive same rank)
  let prev = ["5♣"];
  let res = evaluatePeggingEvent(prev, "5♦");
  assert.strictEqual(res.ok, true, "Pair should be valid");
  assert.strictEqual(res.points, 2, "Pair should score 2 points");
  assert.strictEqual(res.pairLength, 2, "Should detect pair length of 2");

  // Pair royal (3 consecutive same rank)
  prev = ["5♣", "5♦"];
  res = evaluatePeggingEvent(prev, "5♠");
  assert.strictEqual(res.ok, true, "Pair royal should be valid");
  assert.strictEqual(res.points, 6, "Pair royal should score 6 points");
  assert.strictEqual(res.pairLength, 3, "Should detect pair length of 3");

  // Double pair royal (4 consecutive same rank)
  prev = ["5♣", "5♦", "5♠"];
  res = evaluatePeggingEvent(prev, "5♥");
  assert.strictEqual(res.ok, true, "Double pair royal should be valid");
  assert.strictEqual(res.points, 12, "Double pair royal should score 12 points");
  assert.strictEqual(res.pairLength, 4, "Should detect pair length of 4");

  // Interrupted pair sequence (pair broken by different rank)
  prev = ["5♣", "5♦", "7♠"];
  res = evaluatePeggingEvent(prev, "5♥");
  assert.strictEqual(res.ok, true, "Should be valid play");
  assert.strictEqual(res.points, 0, "No pair - sequence was broken");
  assert.strictEqual(res.pairLength, 0, "Should detect no pairs");

  // Face cards with different ranks don't pair
  prev = ["J♣"];
  res = evaluatePeggingEvent(prev, "Q♦");
  assert.strictEqual(res.ok, true, "Should be valid play");
  assert.strictEqual(res.points, 0, "J and Q don't pair");
  assert.strictEqual(res.pairLength, 0, "Should detect no pairs");

  // Same rank face cards do pair
  prev = ["K♣"];
  res = evaluatePeggingEvent(prev, "K♦");
  assert.strictEqual(res.ok, true, "King pair should be valid");
  assert.strictEqual(res.points, 2, "King pair should score 2 points");
  assert.strictEqual(res.pairLength, 2, "Should detect pair length of 2");

  console.log("✓ Pairs tests passed");
})();

(function testPairsAndFifteen() {
  console.log("Testing pairs + fifteen combination...");

  // Pair of 5s that makes 15 (5+5+5=15)
  let prev = ["5♣", "5♦"];
  let res = evaluatePeggingEvent(prev, "5♠");
  assert.strictEqual(res.ok, true, "Should be valid");
  assert.strictEqual(res.points, 8, "Should score 6 for pair royal + 2 for 15");
  assert.strictEqual(res.pairLength, 3, "Should detect 3 of a kind");
  assert.strictEqual(res.hit15, true, "Should detect 15");

  console.log("✓ Pairs + fifteen tests passed");
})();

(function testPairsWithRuns() {
  console.log("Testing pairs don't break run detection...");

  // Run of 3: 2-3-4
  let prev = ["2♣", "3♦"];
  let res = evaluatePeggingEvent(prev, "4♠");
  assert.strictEqual(res.ok, true, "Run should be valid");
  assert.strictEqual(res.points, 3, "Run of 3 scores 3 points");
  assert.strictEqual(res.runLength, 3, "Should detect run of 3");
  assert.strictEqual(res.pairLength, 0, "Should not detect pairs");

  // Pair that breaks run: 2-3-4-4 (pair but no run)
  prev = ["2♣", "3♦", "4♠"];
  res = evaluatePeggingEvent(prev, "4♥");
  assert.strictEqual(res.ok, true, "Pair should be valid");
  assert.strictEqual(res.points, 2, "Just pair, no run");
  assert.strictEqual(res.pairLength, 2, "Should detect pair");
  assert.strictEqual(res.runLength, 0, "Run broken by duplicate rank");

  console.log("✓ Pairs with runs tests passed");
})();

(function testDetectPairsDirectly() {
  console.log("Testing detectPairs function directly...");

  // No pairs in single card
  let result = detectPairs(["5♣"]);
  assert.strictEqual(result.length, 0, "Single card has no pairs");
  assert.strictEqual(result.points, 0, "Single card scores 0");

  // Simple pair
  result = detectPairs(["5♣", "5♦"]);
  assert.strictEqual(result.length, 2, "Two cards of same rank");
  assert.strictEqual(result.points, 2, "Pair scores 2");

  // Pair royal
  result = detectPairs(["5♣", "5♦", "5♠"]);
  assert.strictEqual(result.length, 3, "Three cards of same rank");
  assert.strictEqual(result.points, 6, "Pair royal scores 6");

  // Double pair royal
  result = detectPairs(["5♣", "5♦", "5♠", "5♥"]);
  assert.strictEqual(result.length, 4, "Four cards of same rank");
  assert.strictEqual(result.points, 12, "Double pair royal scores 12");

  // Different ranks
  result = detectPairs(["5♣", "6♦"]);
  assert.strictEqual(result.length, 0, "Different ranks don't pair");
  assert.strictEqual(result.points, 0, "No pair scores 0");

  console.log("✓ detectPairs direct tests passed");
})();

(function testPairsIn31Scenario() {
  console.log("Testing pairs near 31 limit...");

  // Pair of 10s making 20, not 31
  let prev = ["10♣"];
  let res = evaluatePeggingEvent(prev, "10♦");
  assert.strictEqual(res.ok, true, "10-10 should be valid");
  assert.strictEqual(res.points, 2, "Should score 2 for pair");
  assert.strictEqual(res.total, 20, "Total should be 20");
  assert.strictEqual(res.hit31, false, "Should not hit 31");

  // Can't make pair if it would exceed 31
  prev = ["K♣", "K♦", "2♠"];  // 10 + 10 + 2 = 22
  res = evaluatePeggingEvent(prev, "K♥"); // 22 + 10 = 32 > 31
  assert.strictEqual(res.ok, false, "Should reject - would exceed 31");

  console.log("✓ Pairs near 31 tests passed");
})();

console.log("\n✅ All evaluatePeggingEvent tests passed!");
