// client/src/components/Pegboard.jsx
import React from "react";

/**
 * Render-only shell for the Pegboard.
 * Props are read-only and derived from server state.
 */
export default function Pegboard({
  players = [],
  dealerSeat = null,
  winnerSeat = null,
  peggingComplete = false,
}) {
  const dealerText =
    Number.isInteger(dealerSeat) ? `Seat ${dealerSeat}` : "—";

  const winnerName = Number.isInteger(winnerSeat)
    ? (players.find((p) => p.seatId === winnerSeat)?.name ?? `Seat ${winnerSeat}`)
    : null;

  const statusRowStyle = {
    display: "flex",
    gap: 16,
    alignItems: "center",
    flexWrap: "wrap",
    fontSize: 12,
    opacity: 0.9,
    marginBottom: 8,
  };

  return (
    <div
      style={{
        marginTop: 16,
        textAlign: "left",
      }}
    >
      <h2 style={{ margin: 0, marginBottom: 6 }}>Scoreboard</h2>

      <div style={statusRowStyle}>
        <div>
          <span style={{ opacity: 0.7 }}>Dealer:</span>{" "}
          <strong>{dealerText}</strong>
        </div>
        <div>
          <span style={{ opacity: 0.7 }}>Winner:</span>{" "}
          <strong>{winnerName ?? "—"}</strong>
        </div>
        <div>
          <span style={{ opacity: 0.7 }}>Pegging:</span>{" "}
          <strong>{peggingComplete ? "Complete" : "In progress"}</strong>
        </div>
      </div>

      {/* Neutral placeholder surface — no logic or measurements yet */}
      <div
        style={{
          border: "1px solid #333",
          background: "#161616",
          borderRadius: 8,
          minHeight: 160,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#cfcfcf",
        }}
        aria-label="Pegboard placeholder"
      >
        <div style={{ fontSize: 14, opacity: 0.9 }}>
          Pegboard coming online…
        </div>
      </div>
    </div>
  );
}

