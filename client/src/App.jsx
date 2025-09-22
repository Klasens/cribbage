import React, { useEffect, useMemo, useState } from "react";

/**
 * Minimal UI to:
 *  - create/join a room
 *  - show players + scores
 *  - peg +1/+2/+3/+N for *your* seat
 *
 * NOTE: We infer your seat as "the last player added" right after you press Create/Join.
 * This is good enough for the MVP; we can make it explicit later.
 */

export default function App() {
  const socket = window.socket; // provided by main.jsx
  const api = window.api;

  const [state, setState] = useState(() => window.lastState || null);
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const [mySeatId, setMySeatId] = useState(null);
  const [pendingSelfAssign, setPendingSelfAssign] = useState(false);

  // Subscribe to server state
  useEffect(() => {
    if (!socket) return;
    const onUpdate = ({ state }) => {
      setState(state);
      // If we just created/joined, grab the last seat as "me"
      if (pendingSelfAssign && state?.players?.length) {
        const last = state.players[state.players.length - 1];
        setMySeatId(last?.seatId ?? null);
        setPendingSelfAssign(false);
      }
    };
    socket.on("state:update", onUpdate);
    return () => socket.off("state:update", onUpdate);
  }, [socket, pendingSelfAssign]);

  const joined = useMemo(() => {
    return Boolean(state?.roomId && state?.players?.length);
  }, [state]);

  // Handlers
  const handleCreate = () => {
    if (!roomId || !name) return;
    api.create(roomId, name);
    setPendingSelfAssign(true);
  };

  const handleJoin = () => {
    if (!roomId || !name) return;
    api.join(roomId, name);
    setPendingSelfAssign(true);
  };

  const peg = (delta) => {
    if (!state?.roomId || mySeatId == null) return;
    api.peg(state.roomId, mySeatId, delta);
  };

  const pegN = () => {
    const raw = prompt("Add how many points?");
    const n = Number(raw);
    if (Number.isFinite(n) && n !== 0) peg(n);
  };

  // UI
  return (
    <div style={{ padding: 16, fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ marginBottom: 8 }}>Cribbage (MVP)</h1>

      {/* Join/Create controls */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <input
          placeholder="Room ID (e.g., test)"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value.trim())}
          style={{ padding: 8 }}
        />
        <input
          placeholder="Display Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: 8 }}
        />
        <button onClick={handleCreate} disabled={!roomId || !name} style={{ padding: "8px 12px" }}>
          Create
        </button>
        <button onClick={handleJoin} disabled={!roomId || !name} style={{ padding: "8px 12px" }}>
          Join
        </button>
      </div>

      {/* Status */}
      <div style={{ marginTop: 12, fontSize: 14, opacity: 0.8 }}>
        {joined ? (
          <>
            <div>Room: <strong>{state.roomId}</strong></div>
            <div>Your seat: <strong>{mySeatId ?? "?"}</strong></div>
          </>
        ) : (
          <div>Not joined yet.</div>
        )}
      </div>

      {/* Players list */}
      <div style={{ marginTop: 16 }}>
        <h2 style={{ margin: 0, marginBottom: 8 }}>Players</h2>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {(state?.players ?? []).map((p) => (
            <li key={p.seatId}>
              [Seat {p.seatId}] {p.name} — <strong>{p.score}</strong>
              {p.seatId === mySeatId ? " (you)" : ""}
            </li>
          ))}
        </ul>
      </div>

      {/* Your scoring controls */}
      {joined && mySeatId != null && (
        <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
          <button onClick={() => peg(1)} style={{ padding: "8px 12px" }}>+1</button>
          <button onClick={() => peg(2)} style={{ padding: "8px 12px" }}>+2</button>
          <button onClick={() => peg(3)} style={{ padding: "8px 12px" }}>+3</button>
          <button onClick={pegN} style={{ padding: "8px 12px" }}>+N</button>
        </div>
      )}

      {/* Dev helpers */}
      <div style={{ marginTop: 20, fontSize: 12, opacity: 0.7 }}>
        <div>Open a 2nd tab to see realtime updates.</div>
        <div>Console helpers: <code>api.create(roomId, name)</code>, <code>api.join(roomId, name)</code>, <code>api.peg(roomId, seat, n)</code></div>
      </div>
    </div>
  );
}

