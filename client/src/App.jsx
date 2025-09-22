import React from "react";
import PlayersList from "./components/PlayersList";
import ScoreControls from "./components/ScoreControls";
import JoinForm from "./components/JoinForm";
import Status from "./components/Status";
import ControlsBar from "./components/ControlsBar";
import MyHand from "./components/MyHand";
import PeggingPanel from "./components/PeggingPanel";
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
    showCard, resetRun,
  } = useGameClient();

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

  const winnerSeat = state?.winnerSeat ?? null;
  const winnerName = state?.winnerName ?? null;
  const winnerActive = winnerSeat != null;

  return (
    <div style={{ padding: 16, fontFamily: "system-ui, sans-serif", color: "#eaeaea", background: "#111", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: 8, fontSize: 36 }}>Cribbage (MVP)</h1>

      {/* Winner banner */}
      {winnerActive && (
        <div style={{
          marginBottom: 12,
          padding: "10px 12px",
          border: "1px solid #3a3",
          borderRadius: 8,
          background: "#122612",
          fontWeight: 700
        }}>
          🎉 {winnerName} wins at 121!
        </div>
      )}

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
        winnerActive={winnerActive} // disable dealing when game over
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
        winnerActive={winnerActive}
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

      <PlayersList
        players={state?.players ?? []}
        mySeatId={mySeatId}
        full={roomFull}
      />

      {joined && mySeatId != null && (
        <ScoreControls
          onPeg={peg}
          onPegN={pegN}
          disabled={!joined || mySeatId == null || winnerActive} // freeze scoring at game over
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
          <code>api.pegReset(roomId)</code>
        </div>
      </div>
    </div>
  );
}

