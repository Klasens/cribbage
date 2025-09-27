// client/src/components/ScoreControls.jsx
import React from "react";
import { useUI } from "../context/UIContext";
import "./score-controls.css";

export default function ScoreControls({ onPeg, disabled }) {
  const ui = useUI();

  return (
    <div className="score">
      <button onClick={() => onPeg(1)} disabled={disabled} className="score__btn">+1</button>
      <button onClick={() => onPeg(2)} disabled={disabled} className="score__btn">+2</button>
      <button onClick={() => onPeg(3)} disabled={disabled} className="score__btn">+3</button>
      <button
        onClick={() => ui.openModal("number")}
        disabled={disabled}
        className="score__btn"
        title="Open +N modal"
      >
        +N
      </button>
    </div>
  );
}

