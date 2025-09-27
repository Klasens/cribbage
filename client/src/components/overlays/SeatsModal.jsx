// client/src/components/overlays/SeatsModal.jsx
import React from "react";
import Modal from "../../ui/Modal";
import Chip from "../../ui/Chip";
import "./seats-modal.css";

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
        <div className="seats__empty">No players yet.</div>
      ) : (
        <ul className="seats__list">
          {players.map((p) => {
            const isDealer = p.seatId === dealerSeat;
            const isMe = p.seatId === mySeatId;
            return (
              <li key={p.seatId} className="seats__item">
                <div className="seats__seat">[Seat {p.seatId}]</div>
                <div className="seats__name">
                  {p.name} {isMe ? <span className="seats__you">(you)</span> : null}
                </div>
                <div className="seats__score">
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

