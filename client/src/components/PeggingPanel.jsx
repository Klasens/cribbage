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
        <>
          <div className="pegbox__row">
            <div className="pegbox__col pegbox__col--count" aria-live="polite">
              <div className="pegbox__count">{runCount}</div>
              <div className="pegbox__label">Count</div>
            </div>

            <div className="pegbox__col">
              <div className="pegbox__value">
                {lastShown ?? <span className="pegbox__dim">—</span>}
              </div>
              <div className="pegbox__label">Last Shown</div>
            </div>

            <div className="pegbox__col">
              <div className="pegbox__value">
                {lastShownByName ?? <span className="pegbox__dim">Player</span>}
              </div>
              <div className="pegbox__label">By</div>
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

          {/* Compact keyboard hints */}
          <div className="pegbox__hints caption" aria-hidden>
            Shortcuts: <kbd>0</kbd> reset · <kbd>d</kbd> deal ·{" "}
            <kbd>n</kbd> next hand · <kbd>g</kbd> new game ·{" "}
            <kbd>r</kbd> room · <kbd>s</kbd> seats · <kbd>l</kbd> log ·{" "}
            <kbd>+</kbd> +N
          </div>
        </>
      )}
    </div>
  );
}

