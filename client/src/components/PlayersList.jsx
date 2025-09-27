// client/src/components/PlayersList.jsx
import React from "react";
import "./players-list.css";

export default function PlayersList({ players = [], mySeatId, full, dealerSeat }) {
  return (
    <div className="players">
      <h2 className="players__title">
        Players {full ? "(full)" : ""}
      </h2>
      <ul className="players__list">
        {players.map((p) => {
          const isMe = p.seatId === mySeatId;
          const isDealer = p.seatId === dealerSeat;
          return (
            <li key={p.seatId} className="players__item">
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

