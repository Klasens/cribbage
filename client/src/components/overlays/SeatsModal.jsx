import React from "react";
import Modal from "../../ui/Modal";
import Chip from "../../ui/Chip";

export default function SeatsModal({
  open,
  onClose,
  players = [],
  dealerSeat = null,
  mySeatId = null,
}) {
  return (
    <Modal open={open} onClose={onClose} title="Seats & Scores" width={520}>
      {players.length === 0 ? (
        <div style={{ opacity: 0.7 }}>No players yet.</div>
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 8 }}>
          {players.map((p) => {
            const isDealer = p.seatId === dealerSeat;
            const isMe = p.seatId === mySeatId;
            return (
              <li
                key={p.seatId}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 10px",
                  border: "1px solid var(--c-border)",
                  borderRadius: 8,
                  background: "var(--c-bg-soft)",
                }}
              >
                <div style={{ minWidth: 64, opacity: 0.85 }}>[Seat {p.seatId}]</div>
                <div style={{ fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis" }}>
                  {p.name} {isMe ? <span style={{ opacity: 0.7 }}>(you)</span> : null}
                </div>
                <div style={{ marginLeft: "auto", fontVariantNumeric: "tabular-nums" }}>
                  <Chip>{p.score}</Chip>
                </div>
                {isDealer ? <Chip tone="success" style={{ marginLeft: 6 }}>Dealer</Chip> : null}
              </li>
            );
          })}
        </ul>
      )}
    </Modal>
  );
}

