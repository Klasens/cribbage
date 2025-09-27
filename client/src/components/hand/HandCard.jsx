import React from "react";

export default function HandCard({
  card,
  picked = false,
  shown = false,
  disabled = false,
  onToggle,
  onShow,
  canShowNow = false,
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <button
        onClick={() => onToggle?.(card)}
        disabled={disabled}
        style={{
          padding: "6px 10px",
          borderRadius: 8,
          border: "1px solid " + (picked ? "#6cf" : shown ? "#9acd32" : "#333"),
          background: picked ? "#1e2a33" : shown ? "#223118" : "#1b1b1b",
          boxShadow: shown ? "0 0 0 2px rgba(154,205,50,0.35) inset" : "none",
          transition: "box-shadow 120ms, background 120ms, border-color 120ms",
          fontWeight: 600,
          letterSpacing: 0.2,
          cursor: disabled ? "not-allowed" : "pointer",
          minWidth: 64,
        }}
        title={
          disabled
            ? "Game over — actions are locked"
            : shown
            ? "You showed this card this pegging session"
            : picked
            ? "Unselect"
            : "Select for crib"
        }
      >
        {card}
      </button>

      {canShowNow && (
        <button
          onClick={() => onShow?.(card)}
          style={{
            padding: "4px 10px",
            borderRadius: 6,
            border: "1px solid #333",
            background: shown ? "#2a3b1f" : "#222",
            fontSize: 12,
          }}
          title={shown ? "Already shown this session" : "Show this card (increments shared count)"}
        >
          {shown ? "Shown ✓" : "Show"}
        </button>
      )}
    </div>
  );
}


