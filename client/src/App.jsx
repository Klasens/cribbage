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
    showCard, resetRun, nextHand, newGame,   // ⬅️ NEW
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

  const dealerSeat = state?.dealerSeat ?? null;

  const winnerSeat = state?.winnerSeat ?? null;
  const winnerName = state?.winnerName ?? null;
  const winnerActive = winnerSeat != null;

  return (
    <div style={{ padding: 16, fontFamily: "system-ui, sans-serif", color: "#eaeaea", background: "#111", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: 8, fontSize: 36 }}>Cribbage (MVP)</h1>

      {/* Winner banner */}
      {winnerActive && (
        <div style={{
          marginBottom: 10,
          padding: 10,
          border: "1px solid #333",
          borderRadius: 8,
          background: "#191919",
          textAlign: "left",
          fontWeight: 600
        }}>
          🏁 Winner: {winnerName} (seat {winnerSeat})
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
        onNextHand={nextHand}
        canNextHand={peggingComplete}
        onNewGame={newGame}               
        canNewGame={winnerActive}         
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
        winnerActive={winnerActive}       // ⬅️ NEW
      />

      {joined && (
        <PeggingPanel
          runCount={runCount}
          lastShown={lastShown}
          lastShownByName={lastShownByName}
          onResetRun={resetRun}
          peggingComplete={peggingComplete}
          winnerActive={winnerActive}     // ⬅️ NEW
        />
      )}

      <PlayersList
        players={state?.players ?? []}
        mySeatId={mySeatId}
        full={roomFull}
        dealerSeat={dealerSeat}
      />

      {joined && mySeatId != null && (
        <ScoreControls onPeg={peg} onPegN={pegN} disabled={!joined || mySeatId == null} />
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
          <code>api.newGame(roomId)</code> {/* ⬅️ NEW */}
        </div>
      </div>
    </div>
  );
}

