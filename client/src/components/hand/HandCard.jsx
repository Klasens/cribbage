import React from "react";

function parseSuit(card = "") {
  const suit = card.slice(-1);
  if (suit === "♥") return { name: "hearts", red: true, glyph: "♥" };
  if (suit === "♦") return { name: "diamonds", red: true, glyph: "♦" };
  if (suit === "♣") return { name: "clubs", red: false, glyph: "♣" };
  if (suit === "♠") return { name: "spades", red: false, glyph: "♠" };
  return { name: "unknown", red: false, glyph: suit || "•" };
}

export default function HandCard({
  card,
  idx = 0,
  picked = false,
  shown = false,
  disabled = false,
  onToggle,
  onShow,
  canShowNow = false,
}) {
  const pickedClass = picked ? " is-picked" : "";
  const shownClass = shown ? " is-shown" : "";

  const rank = card.slice(0, -1);
  const suit = parseSuit(card);

  // Gentle alternating tilt; tiny jitter for a “real” feel
  const tilt = ((idx % 2 === 0 ? 1 : -1) * (3 + ((idx * 7) % 2))) | 0;

  return (
    <div className="hand-card" style={{ transform: `rotate(${tilt}deg)` }}>
      <button
        onClick={() => onToggle?.(card)}
        disabled={disabled}
        className={`hand-card__btn${pickedClass}${shownClass}`}
        title={
          disabled
            ? "Game over — actions are locked"
            : shown
            ? "You showed this card this pegging session"
            : picked
            ? "Unselect"
            : "Select for crib"
        }
      >
        <span
          className={`card-face suit-${suit.name}${suit.red ? " is-red" : ""}`}
        >
          <span className="card-rank">{rank}</span>
          <span className="card-suit" aria-hidden>
            {suit.glyph}
          </span>
        </span>
      </button>

      {canShowNow && (
        <button
          onClick={() => onShow?.(card)}
          className={`hand-card__show${shownClass}`}
          title={
            shown ? "Already shown this session" : "Show this card (increments shared count)"
          }
        >
          {shown ? "Shown ✓" : "Show"}
        </button>
      )}
    </div>
  );
}

