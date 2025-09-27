// client/src/components/ScoreControls.jsx
import React from "react";
import { useUI } from "../context/UIContext";

export default function ScoreControls({ onPeg, disabled }) {
  const ui = useUI();

  return (
    <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
      <button onClick={() => onPeg(1)} disabled={disabled} style={{ padding: "8px 12px" }}>+1</button>
      <button onClick={() => onPeg(2)} disabled={disabled} style={{ padding: "8px 12px" }}>+2</button>
      <button onClick={() => onPeg(3)} disabled={disabled} style={{ padding: "8px 12px" }}>+3</button>
      <button
        onClick={() => ui.openModal("number")}
        disabled={disabled}
        style={{ padding: "8px 12px" }}
        title="Open +N modal"
      >
        +N
      </button>
    </div>
  );
}

