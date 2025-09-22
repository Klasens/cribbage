// client/src/components/Status.jsx
import React from "react";

export default function Status({ joined, roomId, mySeatId }) {
  return (
    <div style={{ marginTop: 12, fontSize: 14, opacity: 0.85 }}>
      {joined ? (
        <>
          <div>Room: <strong>{roomId}</strong></div>
          <div>Your seat: <strong>{mySeatId ?? "?"}</strong></div>
        </>
      ) : (
        <div>Not joined yet.</div>
      )}
    </div>
  );
}

