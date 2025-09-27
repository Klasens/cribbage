// client/src/components/OpponentSummary.jsx
import React from "react";
import "./opponents.css";

/**
 * Lightweight snapshot of opponents (anyone not mySeatId).
 * Server owns truth; this just renders name/score/dealer mark + public card count.
 */
export default function OpponentSummary({
  players = [],
  mySeatId = null,
  dealerSeat = null,
  handCounts = {},
}) {
  const opps = Array.isArray(players)
    ? players.filter((p) => p.seatId !== mySeatId)
    : [];
  if (!opps.length) return null;

  return (
    <div className="opps">
      <h3 className="opps__title">Opponents</h3>
      <ul className="opps__list">
        {opps.map((p) => {
          const isDealer = p.seatId === dealerSeat;
          const count =
            typeof handCounts?.[p.seatId] === "number" ? handCounts[p.seatId] : 0;
          return (
            <li key={p.seatId} className="opps__item">
              {isDealer ? "👑 " : ""}
              [Seat {p.seatId}] {p.name} — <strong>{p.score}</strong>
              {isDealer ? " (dealer)" : ""} • cards: {count}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

