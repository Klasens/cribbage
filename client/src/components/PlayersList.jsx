// client/src/components/PlayersList.jsx
import React from "react";

export default function PlayersList({ players = [], mySeatId, full }) {
  return (
    <div style={{ marginTop: 16 }}>
      <h2 style={{ margin: 0, marginBottom: 8 }}>
        Players {full ? "(full)" : ""}
      </h2>
      <ul style={{ margin: 0, paddingLeft: 18 }}>
        {players.map((p) => (
          <li key={p.seatId}>
            [Seat {p.seatId}] {p.name} — <strong>{p.score}</strong>
            {p.seatId === mySeatId ? " (you)" : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}

