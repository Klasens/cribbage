// client/src/components/PlayersList.jsx
import React from "react";

export default function PlayersList({ players = [], mySeatId, full, dealerSeat }) {
  return (
    <div style={{ marginTop: 16 }}>
      <h2 style={{ margin: 0, marginBottom: 8 }}>
        Players {full ? "(full)" : ""}
      </h2>
      <ul style={{ margin: 0, paddingLeft: 18 }}>
        {players.map((p) => {
          const isMe = p.seatId === mySeatId;
          const isDealer = p.seatId === dealerSeat;
          return (
            <li key={p.seatId}>
              {isDealer ? "👑 " : ""}
              [Seat {p.seatId}] {p.name} — <strong>{p.score}</strong>
              {isMe ? " (you)" : ""}
              {isDealer ? " (dealer)" : ""}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

