// client/src/components/OpponentSummary.jsx
import React from "react";

/**
 * Lightweight snapshot of opponents (anyone not mySeatId).
 * Server owns truth; this just renders name/score/dealer mark.
 */
export default function OpponentSummary({ players = [], mySeatId = null, dealerSeat = null }) {
  const opps = Array.isArray(players) ? players.filter(p => p.seatId !== mySeatId) : [];
  if (!opps.length) return null;

  return (
    <div style={{ textAlign: "left" }}>
      <h3 style={{ marginTop: 0, marginBottom: 8 }}>Opponents</h3>
      <ul style={{ margin: 0, paddingLeft: 18 }}>
        {opps.map((p) => {
          const isDealer = p.seatId === dealerSeat;
          return (
            <li key={p.seatId}>
              {isDealer ? "👑 " : ""}
              [Seat {p.seatId}] {p.name} — <strong>{p.score}</strong>
              {isDealer ? " (dealer)" : ""}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

