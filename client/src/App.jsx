import React, { useEffect } from "react";
import ScoreControls from "./components/ScoreControls";
import JoinForm from "./components/JoinForm";
import Status from "./components/Status";
import ControlsBar from "./components/ControlsBar";
import MyHand from "./components/MyHand";
import PeggingPanel from "./components/PeggingPanel";
import LogModal from "./components/LogModal";
import Pegboard from "./components/Pegboard";
import RevealPanel from "./components/RevealPanel";
import OpponentSummary from "./components/OpponentSummary";
import TableLayout from "./components/layout/TableLayout";
import { useGameClient } from "./hooks/useGameClient";
import { useHand } from "./hooks/useHand";
import { useUI } from "./context/UIContext";
import SeatsModal from "./components/overlays/SeatsModal";
import RoomDetailsModal from "./components/overlays/RoomDetailsModal";
import NumberModal from "./components/overlays/NumberModal";

// NEW: run-to-15/31 full-screen flash overlay
import RunFlash from "./components/overlays/RunFlash";

export default function App() {
  const {
    state,
    roomId, setRoomId,
    name, setName,
    mySeatId,
    joined, roomFull, isDealer,
    create, join, peg,
    deal, sendCrib, resetLocal, clearLocal,
    showCard, resetRun, nextHand, newGame,
  } = useGameClient();

  const ui = useUI();
  const { hand, clearHand } = useHand();

  const handleClearLocal = (all = false) => {
    clearLocal(all);
    clearHand();
  };

  const cribCount = state?.cribCount ?? 0;
  const cribLocked = !!state?.cribLocked;
  const cutCard = state?.cutCard ?? null;

  const runCount = state?.runCount ?? 0;
  const lastShown = state?.lastShown ?? null;
  const lastShownByName = state?.lastShownByName ?? null;
  const shownBySeat = state?.shownBySeat ?? {};
  const peggingComplete = !!state?.peggingComplete;
  const lastScoringEvent = state?.lastScoringEvent ?? null;

  const dealerSeat = state?.dealerSeat ?? null;
  const winnerSeat = state?.winnerSeat ?? null;

  const revealHands = state?.revealHands ?? null;
  const revealCrib = state?.revealCrib ?? null;

  const handCounts = state?.handCounts ?? {};

  const winnerActive = state?.winnerSeat != null;

  // Keyboard shortcuts (trust-first UX)
  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target?.tagName || "").toLowerCase();
      if (["input", "textarea", "select"].includes(tag)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const key = e.key.toLowerCase();

      if (key === "r") {
        e.preventDefault(); ui.openModal("room");
      } else if (key === "s") {
        e.preventDefault(); ui.openModal("seats");
      } else if (key === "l") {
        e.preventDefault(); ui.openModal("log");
      } else if (key === "+") {
        e.preventDefault(); ui.openModal("number");
      } else if (key === "0") {
        if (!peggingComplete && !winnerActive) {
          e.preventDefault(); resetRun();
        }
      } else if (key === "d") {
        if (joined && isDealer && !winnerActive) {
          e.preventDefault(); deal();
        }
      } else if (key === "n") {
        if (peggingComplete && !winnerActive) {
          e.preventDefault(); nextHand();
        }
      } else if (key === "g") {
        if (winnerActive) {
          e.preventDefault(); newGame();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ui, joined, isDealer, peggingComplete, winnerActive, deal, resetRun, nextHand, newGame]);

  const playersCount = state?.players?.length ?? 0;

  return (
    <div className="app-shell">
      {/* Full-screen flash for pegging scores */}
      <RunFlash
        lastScoringEvent={lastScoringEvent}
        peggingComplete={peggingComplete}
        winnerActive={winnerActive}
      />

      <h1>Cribbage (MVP)</h1>

      <JoinForm
        roomId={roomId}
        setRoomId={setRoomId}
        name={name}
        setName={setName}
        joined={joined}
        roomFull={roomFull}
        onCreate={create}
        onJoin={join}
        onReset={resetLocal}
      />

      <Status
        joined={joined}
        roomId={state?.roomId}
        mySeatId={mySeatId}
        cribCount={cribCount}
        cribLocked={cribLocked}
        cutCard={cutCard}
      />

      <ControlsBar
        joined={joined}
        isDealer={isDealer}
        onDeal={deal}
        onClearLocal={handleClearLocal}
        onNextHand={nextHand}
        canNextHand={peggingComplete && !winnerActive}
        onNewGame={newGame}
        canNewGame={winnerActive}
        winnerActive={winnerActive}
        playersCount={playersCount}
        seatsTotal={4}
      />

      <TableLayout
        left={
          <MyHand
            cards={hand}
            cribLocked={cribLocked}
            cribCount={cribCount}
            onSendCrib={sendCrib}
            onShowCard={showCard}
            shownBySeat={shownBySeat}
            mySeatId={mySeatId}
            peggingComplete={peggingComplete}
            winnerActive={winnerActive}
          />
        }
        center={
          <div>
            {/* Phase 1: Board first, then pegging panel directly beneath */}
            <Pegboard
              players={state?.players ?? []}
              dealerSeat={dealerSeat}
              winnerSeat={winnerSeat}
              peggingComplete={peggingComplete}
            />

            {joined && (
              <PeggingPanel
                runCount={runCount}
                lastShown={lastShown}
                lastShownByName={lastShownByName}
                onResetRun={resetRun}
                peggingComplete={peggingComplete}
                winnerActive={winnerActive}
              />
            )}

            {/* Score controls can remain accessible near the center */}
            <ScoreControls onPeg={peg} disabled={winnerActive} />

            {peggingComplete && (
              <RevealPanel
                players={state?.players ?? []}
                revealHands={revealHands}
                revealCrib={revealCrib}
                cutCard={cutCard}
                dealerSeat={dealerSeat}
              />
            )}
          </div>
        }
        right={
          <OpponentSummary
            players={state?.players ?? []}
            mySeatId={mySeatId}
            dealerSeat={dealerSeat}
            handCounts={handCounts}
          />
        }
      />

      <SeatsModal
        open={ui.isOpen("seats")}
        onClose={ui.closeModal}
        players={state?.players ?? []}
        dealerSeat={dealerSeat}
        mySeatId={mySeatId}
      />

      <RoomDetailsModal
        open={ui.isOpen("room")}
        onClose={ui.closeModal}
        roomId={state?.roomId}
        dealerSeat={dealerSeat}
        cribCount={cribCount}
        cribLocked={cribLocked}
        cutCard={cutCard}
        onOpenLog={() => ui.openModal("log")}
      />

      <LogModal
        open={ui.isOpen("log")}
        onClose={ui.closeModal}
        entries={state?.log ?? []}
      />

      <NumberModal
        open={ui.isOpen("number")}
        onClose={ui.closeModal}
        onSubmit={(n) => peg(n)}
      />

      <div style={{ marginTop: 20, fontSize: 12, opacity: 0.7 }}>
        <div>Open a 2nd tab to see realtime updates.</div>
        <div title="Console helpers for quick manual testing">
          Console helpers:{" "}
          <code>api.create(roomId, name)</code>,{" "}
          <code>api.join(roomId, name)</code>,{" "}
          <code>api.rejoin(roomId, seat, name)</code>,{" "}
          <code>api.peg(roomId, seat, n)</code>,{" "}
          <code>api.deal(roomId)</code>,{" "}
          <code>api.pegShow(roomId, seat, card)</code>,{" "}
          <code>api.pegReset(roomId)</code>,{" "}
          <code>api.nextHand(roomId)</code>,{" "}
          <code>api.newGame(roomId)</code>
        </div>
        <div style={{ marginTop: 6, opacity: 0.8 }}>
          Shortcuts: <code>r</code> room, <code>s</code> seats, <code>l</code> log,{" "}
          <code>+</code> +N, <code>0</code> reset run, <code>d</code> deal,{" "}
          <code>n</code> next hand, <code>g</code> new game.
        </div>
      </div>
    </div>
  );
}

