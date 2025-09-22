// client/src/components/MyHand.jsx
import React, { useEffect, useMemo, useState } from "react";

export default function MyHand({
  cards = [],
  cribLocked = false,
  cribCount = 0,
  onSendCrib, // (cards[2]) => void
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

  if (!cards.length) return null;

  return (
    <div style={{ marginTop: 16, textAlign: "left" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <h3 style={{ margin: 0, marginBottom: 8 }}>Your hand</h3>
        <div style={{ fontSize: 12, opacity: 0.8 }}>
          Crib: <strong>{cribCount}/4</strong> {cribLocked ? "• Locked" : ""}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {cards.map((c, i) => {
          const picked = sel.includes(c);
          return (
            <button
              key={`${c}-${i}`}
              onClick={() => toggle(c)}
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                border: "1px solid " + (picked ? "#6cf" : "#333"),
                background: picked ? "#1e2a33" : "#1b1b1b",
                fontWeight: 600,
                letterSpacing: 0.2,
                cursor: cribLocked ? "not-allowed" : "pointer",
                opacity: cribLocked ? 0.6 : 1,
              }}
              disabled={cribLocked}
              title={cribLocked ? "Crib is locked" : picked ? "Unselect" : "Select for crib"}
            >
              {c}
            </button>
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

