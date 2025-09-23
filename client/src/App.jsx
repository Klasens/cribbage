import React, { useState } from "react";
import PlayersList from "./components/PlayersList";
import ScoreControls from "./components/ScoreControls";
import JoinForm from "./components/JoinForm";
import Status from "./components/Status";
import ControlsBar from "./components/ControlsBar";
import MyHand from "./components/MyHand";
import PeggingPanel from "./components/PeggingPanel";
import LogModal from "./components/LogModal";
import Pegboard from "./components/Pegboard";
import { useGameClient } from "./hooks/useGameClient";
import { useHand } from "./hooks/useHand";

export default function App() {
  const {
    state,
    roomId, setRoomId,
    name, setName,
    mySeatId,
    joined, roomFull, isDealer,
    create, join, peg, pegN,
    deal, sendCrib, resetLocal, clearLocal,
    showCard, resetRun, nextHand, newGame,
  } = useGameClient();

  const { hand, clearHand } = useHand();

  // Modal open/close state
  const [logOpen, setLogOpen] = useState(false);

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

  const dealerSeat = state?.dealerSeat ?? null;
  const winnerSeat = state?.winnerSeat ?? null;

  // Winner present -> hard lock UI, enable "New Game"
  const winnerActive = state?.winnerSeat != null;

  return (
    <div style={{ padding: 16, fontFamily: "system-ui, sans-serif", color: "#eaeaea", background: "#111", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: 8, fontSize: 36 }}>Cribbage (MVP)</h1>

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
        onOpenLog={() => setLogOpen(true)}
        onNewGame={newGame}
        canNewGame={winnerActive}
        winnerActive={winnerActive}         // ⬅️ tell bar to disable buttons
      />

      <MyHand
        cards={hand}
        cribLocked={cribLocked}
        cribCount={cribCount}
        onSendCrib={sendCrib}
        onShowCard={showCard}
        shownBySeat={shownBySeat}
        mySeatId={mySeatId}
        peggingComplete={peggingComplete}
        winnerActive={winnerActive}         // ⬅️ hide/disable actions
      />

      {joined && (
        <PeggingPanel
          runCount={runCount}
          lastShown={lastShown}
          lastShownByName={lastShownByName}
          onResetRun={resetRun}
          peggingComplete={peggingComplete}
          winnerActive={winnerActive}       // ⬅️ show “game over” banner
        />
      )}

      <PlayersList
        players={state?.players ?? []}
        mySeatId={mySeatId}
        full={roomFull}
        dealerSeat={dealerSeat}
      />

      {/* NEW: Render-only Pegboard scaffold (no logic yet) */}
      <Pegboard
        players={state?.players ?? []}
        dealerSeat={dealerSeat}
        winnerSeat={winnerSeat}
        peggingComplete={peggingComplete}
      />

      {joined && mySeatId != null && (
        <ScoreControls
          onPeg={peg}
          onPegN={pegN}
          disabled={!joined || mySeatId == null || winnerActive}  // ⬅️ lock points
        />
      )}

      <div style={{ marginTop: 20, fontSize: 12, opacity: 0.7 }}>
        <div>Open a 2nd tab to see realtime updates.</div>
        <div>
          Console helpers:
          {" "}
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
      </div>

      <LogModal
        open={logOpen}
        onClose={() => setLogOpen(false)}
        entries={state?.log ?? []}
      />
    </div>
  );
}

