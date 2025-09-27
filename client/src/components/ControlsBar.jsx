// client/src/components/ControlsBar.jsx
import React from "react";
import Button from "../ui/Button";
import Toolbar from "../ui/Toolbar";
import { useUI } from "../context/UIContext";
import "./controls-bar.css";

export default function ControlsBar({
  joined,
  isDealer,
  onDeal,
  onClearLocal,
  onNextHand,
  canNextHand = false,
  onNewGame,
  canNewGame = false,
  winnerActive = false,
}) {
  const ui = useUI();

  return (
    <Toolbar>
      <Button
        onClick={() => ui.openModal("room")}
        variant="subtle"
        title="Room info, crib progress, starter, and log"
      >
        Room
      </Button>

      <Button
        onClick={() => ui.openModal("seats")}
        variant="subtle"
        title="See seats, scores, and dealer"
      >
        Seats
      </Button>

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
    </Toolbar>
  );
}

