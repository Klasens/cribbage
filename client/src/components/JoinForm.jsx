// client/src/components/JoinForm.jsx
import React from "react";
import Button from "../ui/Button";

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
        style={{ padding: 8, background: "#222", color: "var(--c-text)", border: "1px solid var(--c-border)" }}
      />
      <input
        placeholder="Display Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ padding: 8, background: "#222", color: "var(--c-text)", border: "1px solid var(--c-border)" }}
      />
      <Button
        onClick={onCreate}
        disabled={!roomId || !name || joined || roomFull}
        title={roomFull ? "Room is full" : ""}
      >
        Create
      </Button>
      <Button
        onClick={onJoin}
        disabled={!roomId || !name || joined || roomFull}
        title={roomFull ? "Room is full" : ""}
      >
        Join
      </Button>
      <Button
        onClick={onReset}
        title="Clear local seat/name and reload"
        variant="subtle"
      >
        Reset
      </Button>
    </div>
  );
}

