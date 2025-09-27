// client/src/components/PeggingPanel.jsx
import React from "react";
import "./pegging.css";

export default function PeggingPanel({
  runCount = 0,
  lastShown = null,
  lastShownByName = null,
  onResetRun,
  peggingComplete = false,
  winnerActive = false,
}) {
  const done = !!peggingComplete;

  if (winnerActive) {
    return (
      <div className="pegbox">
        <h3 className="pegbox__title">Pegging</h3>
        <div className="pegbox__gameover">
          🏁 Game over — pegging and scoring are locked.
        </div>
      </div>
    );
  }

  return (
    <div className="pegbox">
      <h3 className="pegbox__title">Pegging</h3>

      {done ? (
        <div className="pegbox__done">✅ Pegging complete — count hands.</div>
      ) : (
        <div className="pegbox__row">
          <div>
            <div className="pegbox__label">Count (0–31)</div>
            <div className="pegbox__count">{runCount}</div>
          </div>
          <div>
            <div className="pegbox__label">Last shown</div>
            <div className="pegbox__last">{lastShown ?? <span className="pegbox__dim">—</span>}</div>
          </div>
          <div>
            <div className="pegbox__label">By</div>
            <div className="pegbox__by">{lastShownByName ?? <span className="pegbox__dim">—</span>}</div>
          </div>
          <div className="pegbox__spacer" />
          <button
            onClick={onResetRun}
            title="Reset the count back to 0 (trust-based)"
            className="pegbox__reset"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}

