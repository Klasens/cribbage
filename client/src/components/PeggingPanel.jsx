// client/src/components/PeggingPanel.jsx
import React from "react";

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
      <div style={{
        marginTop: 16,
        padding: 12,
        border: "1px solid #333",
        borderRadius: 8,
        background: "#161616",
        textAlign: "left"
      }}>
        <h3 style={{ marginTop: 0, marginBottom: 8 }}>Pegging</h3>
        <div style={{ fontSize: 16, fontWeight: 600 }}>
          🏁 Game over — pegging and scoring are locked.
        </div>
      </div>
    );
  }

  return (
    <div style={{
      marginTop: 16,
      padding: 12,
      border: "1px solid #333",
      borderRadius: 8,
      background: "#161616",
      textAlign: "left"
    }}>
      <h3 style={{ marginTop: 0, marginBottom: 8 }}>Pegging</h3>

      {done ? (
        <div style={{ fontSize: 16, fontWeight: 600 }}>
          ✅ Pegging complete — count hands.
        </div>
      ) : (
        <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Count (0–31)</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{runCount}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Last shown</div>
            <div style={{ fontSize: 18, fontWeight: 600 }}>
              {lastShown ?? <span style={{ opacity: 0.6 }}>—</span>}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>By</div>
            <div style={{ fontSize: 16 }}>
              {lastShownByName ?? <span style={{ opacity: 0.6 }}>—</span>}
            </div>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <button
              onClick={onResetRun}
              title="Reset the count back to 0 (trust-based)"
              style={{ padding: "8px 12px" }}
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

