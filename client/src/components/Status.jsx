// client/src/components/Status.jsx
import React from "react";

export default function Status({ joined, roomId, mySeatId, cribCount = 0, cribLocked = false }) {
  return (
    <div style={{ marginTop: 12, fontSize: 14, opacity: 0.85, textAlign: "left" }}>
      {joined ? (
        <>
          <div>Room: <strong>{roomId}</strong></div>
          <div>Your seat: <strong>{mySeatId ?? "?"}</strong></div>
          <div>Crib: <strong>{cribCount}/4</strong> {cribLocked ? "• Locked" : ""}</div>
        </>
      ) : (
        <div>Not joined yet.</div>
      )}
    </div>
  );
}

