import React, { useEffect, useMemo, useState } from "react";

const LS_KEY = (roomId) => `cribbage:seat:${roomId}`;

export default function App() {
  const socket = window.socket;
  const api = window.api;

  const [state, setState] = useState(() => window.lastState || null);
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const [mySeatId, setMySeatId] = useState(null);
  const [pendingSelfAssign, setPendingSelfAssign] = useState(false);

  // Restore seat/name if we already have a room in state (HMR/refresh)
  useEffect(() => {
    if (state?.roomId) {
      const raw = localStorage.getItem(LS_KEY(state.roomId));
      if (raw) {
        try {
          const { seatId, name: savedName } = JSON.parse(raw);
          if (Number.isInteger(seatId)) setMySeatId(seatId);
          if (savedName && !name) setName(savedName);
          if (!roomId) setRoomId(state.roomId);
        } catch {}
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Subscribe to server state
  useEffect(() => {
    if (!socket) return;
    const onUpdate = ({ state }) => {
      setState(state);

      // If we just created/joined, grab the last seat as "me"
      if (pendingSelfAssign && state?.players?.length) {
        const last = state.players[state.players.length - 1];
        const seatId = last?.seatId ?? null;
        setMySeatId(seatId);
        setPendingSelfAssign(false);
        try {
          localStorage.setItem(
            LS_KEY(state.roomId),
            JSON.stringify({ seatId, name })
          );
        } catch {}
      }
    };
    socket.on("state:update", onUpdate);
    return () => socket.off("state:update", onUpdate);
  }, [socket, pendingSelfAssign, name]);

  // If user types a room ID we know, prefill
  useEffect(() => {
    if (!roomId) return;
    const raw = localStorage.getItem(LS_KEY(roomId));
    if (raw) {
      try {
        const { seatId, name: savedName } = JSON.parse(raw);
        if (mySeatId == null && Number.isInteger(seatId)) setMySeatId(seatId);
        if (!name && savedName) setName(savedName);
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  const joined = useMemo(() => {
    if (!state?.roomId || !state?.players) return false;
    return state.roomId.length > 0 && state.players.some(p => p.seatId === mySeatId);
  }, [state, mySeatId]);

  const roomFull = useMemo(() => {
    return (state?.players?.length ?? 0) >= 4;
  }, [state]);

  // Auto-rejoin: when we have stored room + seat + name and we are not joined,
  // announce ourselves to the server to reclaim the seat.
  useEffect(() => {
    if (!socket) return;
    if (!joined && roomId && name && Number.isInteger(mySeatId)) {
      api.rejoin(roomId, mySeatId, name);
    }
  }, [socket, joined, roomId, name, mySeatId, api]);

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
    <div style={{ padding: 16, fontFamily: "system-ui, sans-serif", color: "#eaeaea", background: "#111", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: 8, fontSize: 48 }}>Cribbage (MVP)</h1>

      {/* Join/Create controls */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <input
          placeholder="Room ID (e.g., test)"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value.trim())}
          style={{ padding: 8, background: "#222", color: "#eaeaea", border: "1px solid #333" }}
        />
        <input
          placeholder="Display Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: 8, background: "#222", color: "#eaeaea", border: "1px solid #333" }}
        />
        <button
          onClick={handleCreate}
          disabled={!roomId || !name || joined || roomFull}
          title={roomFull ? "Room is full" : ""}
          style={{ padding: "8px 12px", background: "#222", color: "#eaeaea", border: "1px solid #333", borderRadius: 6 }}
        >
          Create
        </button>
        <button
          onClick={handleJoin}
          disabled={!roomId || !name || joined || roomFull}
          title={roomFull ? "Room is full" : ""}
          style={{ padding: "8px 12px", background: "#222", color: "#eaeaea", border: "1px solid #333", borderRadius: 6 }}
        >
          Join
        </button>
      </div>

      {/* Status */}
      <div style={{ marginTop: 12, fontSize: 14, opacity: 0.85 }}>
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
        <h2 style={{ margin: 0, marginBottom: 8 }}>
          Players {roomFull ? "(full)" : ""}
        </h2>
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
        <div>Console helpers: <code>api.create(roomId, name)</code>, <code>api.join(roomId, name)</code>, <code>api.rejoin(roomId, seat, name)</code>, <code>api.peg(roomId, seat, n)</code></div>
      </div>
    </div>
  );
}

