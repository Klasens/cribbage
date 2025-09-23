import React, { useMemo } from "react";

/**
 * Public reveals shown after peggingComplete:
 * - Each player's hand (by seat/name)
 * - Crib cards
 * Trust-first display: server sends arrays of card text.
 */
export default function RevealPanel({
  players = [],
  revealHands = null,   // { [seatId]: string[] } | null
  revealCrib = null,    // string[] | null
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
    <div style={{
      marginTop: 16,
      padding: 12,
      border: "1px solid #333",
      borderRadius: 8,
      background: "#171a1f",
      textAlign: "left"
    }}>
      <h3 style={{ marginTop: 0, marginBottom: 8 }}>
        Revealed hands {cutCard ? `• Starter: ${cutCard}` : ""}
      </h3>

      <div style={{ display: "grid", gap: 12 }}>
        {seatOrder.map((seat) => {
          const p = players.find((x) => x.seatId === seat);
          const cards = bySeat[seat] || [];
          return (
            <div key={seat} style={{
              padding: "8px 10px",
              border: "1px solid #263041",
              borderRadius: 8,
              background: "#10141a"
            }}>
              <div style={{ fontSize: 12, opacity: 0.85, marginBottom: 6 }}>
                {seat === dealerSeat ? "👑 " : ""}[Seat {seat}] {p?.name ?? "Player"}
              </div>
              {cards.length ? (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {cards.map((c, i) => (
                    <span
                      key={`${seat}-${c}-${i}`}
                      style={{
                        padding: "6px 10px",
                        borderRadius: 8,
                        border: "1px solid #333",
                        background: "#1b1f26",
                        fontWeight: 600,
                        minWidth: 48,
                        textAlign: "center"
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              ) : (
                <div style={{ opacity: 0.6 }}>—</div>
              )}
            </div>
          );
        })}

        <div style={{
          padding: "8px 10px",
          border: "1px solid #3a2b2b",
          borderRadius: 8,
          background: "#1a1414"
        }}>
          <div style={{ fontSize: 12, opacity: 0.9, marginBottom: 6 }}>
            🧺 Crib
          </div>
          {Array.isArray(revealCrib) && revealCrib.length ? (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {revealCrib.map((c, i) => (
                <span
                  key={`crib-${c}-${i}`}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 8,
                    border: "1px solid #333",
                    background: "#221a1a",
                    fontWeight: 600,
                    minWidth: 48,
                    textAlign: "center"
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          ) : (
            <div style={{ opacity: 0.6 }}>—</div>
          )}
        </div>
      </div>
    </div>
  );
}

