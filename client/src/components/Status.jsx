// client/src/components/Status.jsx
import React from "react";

export default function Status({
  joined,
  roomId,
  mySeatId,
  cribCount = 0,
  cribLocked = false,
  cutCard = null, // NEW
}) {
  return (
    <div style={{ marginTop: 12, fontSize: 14, opacity: 0.85, textAlign: "left" }}>
      {joined ? (
        <>
          <div>Room: <strong>{roomId}</strong></div>
          <div>Your seat: <strong>{mySeatId ?? "?"}</strong></div>
          <div>Crib: <strong>{cribCount}/4</strong> {cribLocked ? "• Locked" : ""}</div>
          {cutCard ? (
            <div>Starter: <strong>{cutCard}</strong></div>
          ) : (
            <div>Starter: <span style={{ opacity: 0.7 }}>—</span></div>
          )}
        </>
      ) : (
        <div>Not joined yet.</div>
      )}
    </div>
  );
}

