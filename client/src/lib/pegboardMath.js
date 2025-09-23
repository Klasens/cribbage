// client/src/lib/pegboardMath.js

/**
 * Pegboard math utilities (pure, no DOM).
 * Scoreboard maps 0..121 (inclusive) to discrete slot indices 0..121.
 */

export const SCORE_MIN = 0;
export const SCORE_MAX = 121;

/**
 * Clamp an arbitrary score to the legal 0..121 range.
 * @param {number} score
 * @returns {number}
 */
export function clampScore(score) {
  const n = Number(score);
  if (!Number.isFinite(n)) return SCORE_MIN;
  if (n < SCORE_MIN) return SCORE_MIN;
  if (n > SCORE_MAX) return SCORE_MAX;
  return n;
}

/**
 * Map a score to a discrete slot index (0..121).
 * Floors fractional inputs after clamping.
 * @param {number} score
 * @returns {number} integer slot index
 */
export function slotIndex(score) {
  return Math.floor(clampScore(score));
}

/**
 * Convert a score to an X position in pixels given a slot width.
 * @param {number} score
 * @param {number} slotWidth - width of one score slot in px
 * @returns {number} x-position in px
 */
export function slotX(score, slotWidth) {
  const w = Number(slotWidth);
  const safeW = Number.isFinite(w) ? w : 0;
  return slotIndex(score) * safeW;
}

