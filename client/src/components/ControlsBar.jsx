// client/src/components/ControlsBar.jsx
import React from "react";

export default function ControlsBar({
  joined,
  isDealer,
  onDeal,
  onClearLocal,
}) {
  return (
    <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
      {joined && isDealer && (
        <button
          onClick={onDeal}
          style={{ padding: "8px 12px", background: "#222", color: "#eaeaea", border: "1px solid #333", borderRadius: 6 }}
          title="Dealer: deal 6 cards to each player"
        >
          Deal 6
        </button>
      )}
      <button
        onClick={() => onClearLocal(false)}
        style={{ padding: "8px 12px", background: "#222", color: "#eaeaea", border: "1px solid #333", borderRadius: 6 }}
        title="Clear saved seat/name for this room (no reload)"
      >
        Clear Local
      </button>
    </div>
  );
}

