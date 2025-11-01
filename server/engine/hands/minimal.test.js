/* Run: node server/engine/hands/minimal.test.js */
const assert = require("assert");
const { scoreHandFifteens } = require("./minimal");

(function testOnlyFifteens() {
  // Classic 5-5-5-J with 5 cut → many fifteens (pairs/runs ignored here)
  const hand = ["5H", "5D", "5C", "JH"];
  const cut = "5S";
  const s = scoreHandFifteens(hand, cut);
  // In full rules it's 16 pts for fifteens; minimal should still reflect those fifteens.
  assert.ok(s.breakdown.fifteens >= 16);

  // Another hand with at least one fifteen: 7-8 in hand with a cut face  → e.g., 7 + 8 = 15 with a face 10 doesn't combine; use a better example:
  const h2 = ["2S", "3D", "10C", "QH"]; // with cut 0 that makes 15 via 2+3+10
  const cut2 = "KD";
  const s2 = scoreHandFifteens(h2, cut2);
  assert.ok(s2.total >= 2);
})();
console.log("✓ hands/minimal tests passed");
