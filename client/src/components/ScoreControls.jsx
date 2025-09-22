// client/src/components/ScoreControls.jsx
import React from "react";

export default function ScoreControls({ onPeg, onPegN, disabled }) {
  return (
    <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
      <button onClick={() => onPeg(1)} disabled={disabled} style={{ padding: "8px 12px" }}>+1</button>
      <button onClick={() => onPeg(2)} disabled={disabled} style={{ padding: "8px 12px" }}>+2</button>
      <button onClick={() => onPeg(3)} disabled={disabled} style={{ padding: "8px 12px" }}>+3</button>
      <button onClick={onPegN} disabled={disabled} style={{ padding: "8px 12px" }}>+N</button>
    </div>
  );
}

