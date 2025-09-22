// client/src/components/MyHand.jsx
import React, { useEffect, useMemo, useState } from "react";

export default function MyHand({
  cards = [],
  cribLocked = false,
  cribCount = 0,
  onSendCrib,            // (cards[2]) => void
  onShowCard,            // (cardText) => void
  shownBySeat = {},      // map from server (persists across GO)
  mySeatId = null,       // my seat
  peggingComplete = false,
  winnerActive = false,  // ⬅️ NEW
}) {
  const [sel, setSel] = useState([]);

  // Clear selection whenever the hand changes
  useEffect(() => {
    setSel([]);
  }, [cards.join("|")]); // stable enough for MVP

  const canSend = useMemo(() => sel.length === 2 && !cribLocked, [sel, cribLocked]);

  const toggle = (c) => {
    setSel((prev) => {
      const has = prev.includes(c);
      if (has) return prev.filter((x) => x !== c);
      if (prev.length >= 2) return prev; // cap at 2
      return [...prev, c];
    });
  };

  // Persisted "shown" for my seat across GO resets
  const myShown = useMemo(() => {
    if (!Number.isInteger(mySeatId)) return new Set();
    const list = shownBySeat?.[mySeatId] || [];
    return new Set(Array.isArray(list) ? list : []);
  }, [shownBySeat, mySeatId]);

  const isShownByMe = (c) => myShown.has(c);

  if (!cards.length) return null;

  const canShowNow = cribLocked && !peggingComplete && !winnerActive;

  return (
    <div style={{ marginTop: 16, textAlign: "left" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <h3 style={{ margin: 0, marginBottom: 8 }}>Your hand</h3>
        <div style={{ fontSize: 12, opacity: 0.8 }}>
          Crib: <strong>{cribCount}/4</strong> {cribLocked ? "• Locked" : ""}
          {peggingComplete ? " • Pegging complete" : ""}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {cards.map((c, i) => {
          const picked = sel.includes(c);
          const shown = isShownByMe(c);

          return (
            <div key={`${c}-${i}`} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <button
                onClick={() => toggle(c)}
                style={{
                  padding: "6px 10px",
                  borderRadius: 8,
                  border: "1px solid " + (picked ? "#6cf" : shown ? "#9acd32" : "#333"),
                  background: picked ? "#1e2a33" : shown ? "#223118" : "#1b1b1b",
                  boxShadow: shown ? "0 0 0 2px rgba(154,205,50,0.35) inset" : "none",
                  transition: "box-shadow 120ms, background 120ms, border-color 120ms",
                  fontWeight: 600,
                  letterSpacing: 0.2,
                  cursor: "pointer",
                  minWidth: 64,
                }}
                title={
                  shown
                    ? "You showed this card this pegging session"
                    : cribLocked
                    ? picked ? "Unselect" : "Select for crib"
                    : picked ? "Unselect" : "Select for crib"
                }
              >
                {c}
              </button>

              {/* Show button appears only during pegging and not after game over */}
              {canShowNow && (
                <button
                  onClick={() => onShowCard?.(c)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 6,
                    border: "1px solid #333",
                    background: shown ? "#2a3b1f" : "#222",
                    fontSize: 12
                  }}
                  title={shown ? "Already shown this session" : "Show this card (increments shared count)"}
                >
                  {shown ? "Shown ✓" : "Show"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 10 }}>
        <button
          onClick={() => onSendCrib?.(sel)}
          disabled={!canSend}
          style={{ padding: "8px 12px" }}
          title={cribLocked ? "Crib is locked" : sel.length !== 2 ? "Pick 2 cards" : "Send to crib"}
        >
          Send 2 to crib
        </button>
      </div>
    </div>
  );
}

