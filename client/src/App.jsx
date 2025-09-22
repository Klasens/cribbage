import React from "react";
import PlayersList from "./components/PlayersList";
import ScoreControls from "./components/ScoreControls";
import JoinForm from "./components/JoinForm";
import Status from "./components/Status";
import ControlsBar from "./components/ControlsBar";
import MyHand from "./components/MyHand";
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
    deal, resetLocal, clearLocal,
  } = useGameClient();

  const { hand, clearHand } = useHand();

  // Keep Clear Local button clearing the hand too (no reload)
  const handleClearLocal = (all = false) => {
    clearLocal(all);
    clearHand();
  };

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
        onReset={resetLocal}  // existing: clear current room + reload
      />

      <Status joined={joined} roomId={state?.roomId} mySeatId={mySeatId} />

      <ControlsBar
        joined={joined}
        isDealer={isDealer}
        onDeal={deal}
        onClearLocal={handleClearLocal}
      />

      <MyHand cards={hand} />

      <PlayersList
        players={state?.players ?? []}
        mySeatId={mySeatId}
        full={roomFull}
      />

      {joined && mySeatId != null && (
        <ScoreControls onPeg={peg} onPegN={pegN} disabled={!joined || mySeatId == null} />
      )}

      <div style={{ marginTop: 20, fontSize: 12, opacity: 0.7 }}>
        <div>Open a 2nd tab to see realtime updates.</div>
        <div>Console helpers: <code>api.create(roomId, name)</code>, <code>api.join(roomId, name)</code>, <code>api.rejoin(roomId, seat, name)</code>, <code>api.peg(roomId, seat, n)</code>, <code>api.deal(roomId)</code></div>
      </div>
    </div>
  );
}

