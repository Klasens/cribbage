// client/src/components/overlays/RoomDetailsModal.jsx
import React from "react";
import Modal from "../../ui/Modal";
import Chip from "../../ui/Chip";
import "./room-details.css";

export default function RoomDetailsModal({
  open,
  onClose,
  roomId = "",
  dealerSeat = null,
  cribCount = 0,
  cribLocked = false,
  cutCard = null,
  onOpenLog,
}) {
  return (
    <Modal open={open} onClose={onClose} title="Room Details" width={520}>
      <div className="rmodal">
        <div>
          <div className="rmodal__label">Room</div>
          <div className="rmodal__value">{roomId || "—"}</div>
        </div>
        <div>
          <div className="rmodal__label">Dealer</div>
          <div className="rmodal__value">
            {Number.isInteger(dealerSeat) ? `Seat ${dealerSeat}` : "—"}
          </div>
        </div>
        <div>
          <div className="rmodal__label">Crib</div>
          <div className="rmodal__row">
            <Chip>{cribCount}/4</Chip>
            {cribLocked ? <Chip tone="success">Locked</Chip> : null}
          </div>
        </div>
        <div>
          <div className="rmodal__label">Starter</div>
          <div>{cutCard ? <Chip>{cutCard}</Chip> : <span className="rmodal__dim">—</span>}</div>
        </div>

        <div className="rmodal__actions">
          <button
            onClick={onOpenLog}
            className="rmodal__btn"
            title="Open the room event log"
          >
            Open Log
          </button>
        </div>
      </div>
    </Modal>
  );
}

