import React from "react";
import "./opponents.css";

/**
 * Opponent snapshot with stacked blue card backs and count.
 * Server owns truth; we render name/score/dealer mark + public card count.
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

          // Cap the visual stack; still display the true count below
          const visual = Math.min(Math.max(count, 0), 6);
          const backs = Array.from({ length: visual }, (_, i) => i);

          return (
            <li key={p.seatId} className="opps__item">
              <div className="oppHand">
                <div className="oppHand__title">
                  {isDealer ? <span className="ico ico--crown" aria-label="Dealer" /> : null}
                  {p.name}'s Hand
                </div>
                <div className="oppHand__stack" aria-label={`${count} cards`}>
                  {backs.map((i) => (
                    <span
                      key={`${p.seatId}-${i}`}
                      className="oppBack"
                      style={{ transform: `rotate(${(i % 2 ? -9 : 7)}deg)` }}
                      aria-hidden
                    />
                  ))}
                </div>
                <div className="oppHand__count tnum"><strong>{count}</strong></div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

