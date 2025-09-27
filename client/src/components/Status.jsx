// client/src/components/Status.jsx
import React from "react";
import "./status.css";

export default function Status({
  joined,
  roomId,
  mySeatId,
  cribCount = 0,
  cribLocked = false,
  cutCard = null,
}) {
  return (
    <div className="status">
      {joined ? (
        <>
          <div>Room: <strong>{roomId}</strong></div>
          <div>Your seat: <strong>{mySeatId ?? "?"}</strong></div>
          <div>Crib: <strong>{cribCount}/4</strong> {cribLocked ? "• Locked" : ""}</div>
          {cutCard ? (
            <div>Starter: <strong>{cutCard}</strong></div>
          ) : (
            <div>Starter: <span className="status__dim">—</span></div>
          )}
        </>
      ) : (
        <div>Not joined yet.</div>
      )}
    </div>
  );
}

