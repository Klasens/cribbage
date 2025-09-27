import React from "react";

export default function HandActions({
  canSend = false,
  onSendCrib,
  cribLocked = false,
  winnerActive = false,
  selCount = 0,
}) {
  return (
    <div style={{ marginTop: 10 }}>
      <button
        onClick={onSendCrib}
        disabled={!canSend}
        style={{ padding: "8px 12px" }}
        title={
          winnerActive
            ? "Game over — actions are locked"
            : cribLocked
            ? "Crib is locked"
            : selCount !== 2
            ? "Pick 2 cards"
            : "Send to crib"
        }
      >
        Send 2 to crib
      </button>
    </div>
  );
}

