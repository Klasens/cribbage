import React from "react";

export default function HandCard({
  card,
  picked = false,
  shown = false,
  disabled = false,
  onToggle,
  onShow,
  canShowNow = false,
}) {
  const pickedClass = picked ? " is-picked" : "";
  const shownClass = shown ? " is-shown" : "";

  return (
    <div className="hand-card">
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
        {card}
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

