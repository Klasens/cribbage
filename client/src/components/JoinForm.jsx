// client/src/components/JoinForm.jsx
import React from "react";
import Button from "../ui/Button";
import "./join-form.css";

export default function JoinForm({
  roomId, setRoomId,
  name, setName,
  joined, roomFull,
  onCreate, onJoin,
  onReset,
}) {
  return (
    <div className="join">
      <input
        className="join__input"
        placeholder="Room ID (e.g., test)"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value.trim())}
      />
      <input
        className="join__input"
        placeholder="Display Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
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

