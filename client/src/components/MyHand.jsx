// client/src/components/MyHand.jsx
import React from "react";

export default function MyHand({ cards = [] }) {
  if (!cards.length) return null;
  return (
    <div style={{ marginTop: 16 }}>
      <h3 style={{ margin: 0, marginBottom: 8 }}>Your hand</h3>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {cards.map((c, i) => (
          <span
            key={`${c}-${i}`}
            style={{
              padding: "6px 10px",
              borderRadius: 8,
              border: "1px solid #333",
              background: "#1b1b1b",
              fontWeight: 600,
              letterSpacing: 0.2,
            }}
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

