// client/src/components/ControlsBar.jsx
import React from "react";
import Button from "../ui/Button";
import Toolbar from "../ui/Toolbar";

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
  winnerActive = false,
}) {
  return (
    <Toolbar>
      {joined && isDealer && (
        <Button
          onClick={onDeal}
          disabled={winnerActive}
          title={
            winnerActive
              ? "Game over — start a New Game"
              : "Dealer: deal 6 cards to each player"
          }
        >
          Deal 6
        </Button>
      )}

      <Button
        onClick={() => onClearLocal(false)}
        title="Clear saved seat/name for this room (no reload)"
        variant="subtle"
      >
        Clear Local
      </Button>

      <Button
        onClick={onNextHand}
        disabled={!canNextHand || winnerActive}
        title={
          winnerActive
            ? "Game over — start a New Game"
            : canNextHand
            ? "Rotate dealer and start next hand"
            : "Available after pegging complete"
        }
      >
        Next Hand
      </Button>

      <Button
        onClick={onNewGame}
        disabled={!canNewGame}
        title={
          canNewGame
            ? "Reset scores and start a fresh game"
            : "Appears after a winner is declared"
        }
        variant="primary"
      >
        New Game
      </Button>

      <Button onClick={onOpenLog} variant="subtle" title="Show room log">
        Log
      </Button>
    </Toolbar>
  );
}

