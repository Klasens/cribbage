// client/src/components/RevealPanel.jsx
import React, { useMemo } from "react";
import "./reveal.css";

/**
 * Public reveals shown after peggingComplete.
 */
export default function RevealPanel({
  players = [],
  revealHands = null,
  revealCrib = null,
  cutCard = null,
  dealerSeat = null,
}) {
  const hasReveal = !!revealHands || !!revealCrib;
  if (!hasReveal) return null;

  const bySeat = useMemo(() => {
    const map = typeof revealHands === "object" && revealHands ? revealHands : {};
    return map;
  }, [revealHands]);

  const seatOrder = useMemo(
    () => (players || []).map((p) => p.seatId).sort((a,b)=>a-b),
    [players]
  );

  return (
    <div className="reveal">
      <h3 className="reveal__title">
        Revealed hands {cutCard ? `• Starter: ${cutCard}` : ""}
      </h3>

      <div className="reveal__grid">
        {seatOrder.map((seat) => {
          const p = players.find((x) => x.seatId === seat);
          const cards = bySeat[seat] || [];
          return (
            <div key={seat} className="reveal__block">
              <div className="reveal__blockHeader">
                {seat === dealerSeat ? "👑 " : ""}[Seat {seat}] {p?.name ?? "Player"}
              </div>
              {cards.length ? (
                <div className="reveal__cards">
                  {cards.map((c, i) => (
                    <span key={`${seat}-${c}-${i}`} className="reveal__chip">
                      {c}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="reveal__none">—</div>
              )}
            </div>
          );
        })}

        <div className="reveal__block reveal__crib">
          <div className="reveal__blockHeader">🧺 Crib</div>
          {Array.isArray(revealCrib) && revealCrib.length ? (
            <div className="reveal__cards">
              {revealCrib.map((c, i) => (
                <span key={`crib-${c}-${i}`} className="reveal__chip reveal__chip--crib">
                  {c}
                </span>
              ))}
            </div>
          ) : (
            <div className="reveal__none">—</div>
          )}
        </div>
      </div>
    </div>
  );
}

