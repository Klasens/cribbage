// client/src/components/ControlsBar.jsx
import React from "react";

export default function ControlsBar({
  joined,
  isDealer,
  onDeal,
  onClearLocal,
  onNextHand,
  canNextHand = false,
  onOpenLog,
  onNewGame,
  canNewGame = false,
  // NEW: for disabling controls on game over
  winnerActive = false,
}) {
  const btnStyle = {
    padding: "8px 12px",
    background: "#222",
    color: "#eaeaea",
    border: "1px solid #333",
    borderRadius: 6,
  };

  return (
    <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
      {joined && isDealer && (
        <button
          onClick={onDeal}
          disabled={winnerActive}
          style={btnStyle}
          title={winnerActive ? "Game over — start a New Game" : "Dealer: deal 6 cards to each player"}
        >
          Deal 6
        </button>
      )}

      <button
        onClick={() => onClearLocal(false)}
        style={btnStyle}
        title="Clear saved seat/name for this room (no reload)"
      >
        Clear Local
      </button>

      <button
        onClick={onNextHand}
        disabled={!canNextHand || winnerActive}
        style={btnStyle}
        title={
          winnerActive
            ? "Game over — start a New Game"
            : canNextHand
              ? "Rotate dealer and start next hand"
              : "Available after pegging complete"
        }
      >
        Next Hand
      </button>

      <button
        onClick={onNewGame}
        disabled={!canNewGame}
        style={btnStyle}
        title={canNewGame ? "Reset scores and start a fresh game" : "Appears after a winner is declared"}
      >
        New Game
      </button>

      <button
        onClick={onOpenLog}
        style={btnStyle}
        title="Show room log"
      >
        Log
      </button>
    </div>
  );
}

