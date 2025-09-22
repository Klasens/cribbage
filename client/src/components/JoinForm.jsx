// client/src/components/JoinForm.jsx
import React from "react";

export default function JoinForm({
  roomId, setRoomId,
  name, setName,
  joined, roomFull,
  onCreate, onJoin,
  onReset,
}) {
  return (
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
        onClick={onCreate}
        disabled={!roomId || !name || joined || roomFull}
        title={roomFull ? "Room is full" : ""}
        style={{ padding: "8px 12px", background: "#222", color: "#eaeaea", border: "1px solid #333", borderRadius: 6 }}
      >
        Create
      </button>
      <button
        onClick={onJoin}
        disabled={!roomId || !name || joined || roomFull}
        title={roomFull ? "Room is full" : ""}
        style={{ padding: "8px 12px", background: "#222", color: "#eaeaea", border: "1px solid #333", borderRadius: 6 }}
      >
        Join
      </button>
      <button
        onClick={onReset}
        style={{ padding: "8px 12px", background: "#222", color: "#eaeaea", border: "1px solid #333", borderRadius: 6, marginLeft: 8 }}
        title="Clear local seat/name and reload"
      >
        Reset
      </button>
    </div>
  );
}

