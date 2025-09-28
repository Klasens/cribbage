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
      {/* LEFT group */}
      <div className="ui-toolbar__group ui-toolbar__left">
        <Button
          onClick={() => ui.openModal("room")}
          variant="subtle"
          title="Room info, crib progress, starter, and log"
        >
          <span aria-hidden>🏠</span>
          <span>Room</span>
        </Button>

        <Button
          onClick={() => ui.openModal("seats")}
          variant="subtle"
          title="See seats, scores, and dealer"
        >
          <span aria-hidden>🎭</span>
          <span>Seats</span>
        </Button>
      </div>

      {/* CENTER group */}
      <div className="ui-toolbar__group ui-toolbar__center">
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
            <span aria-hidden>🃏</span>
            <span>Deal 6</span>
          </Button>
        )}
      </div>

      {/* RIGHT group */}
      <div className="ui-toolbar__group ui-toolbar__right">
        <Button
          onClick={() => onClearLocal(false)}
          title="Clear saved seat/name for this room (no reload)"
          variant="subtle"
        >
          <span aria-hidden>🧹</span>
          <span>Clear Local</span>
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
          <span aria-hidden>⏭️</span>
          <span>Next Hand</span>
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
          <span aria-hidden>🔄</span>
          <span>New Game</span>
        </Button>
      </div>
    </Toolbar>
  );
}

