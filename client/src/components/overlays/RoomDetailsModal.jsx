import React from "react";
import Modal from "../../ui/Modal";
import Chip from "../../ui/Chip";

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
      <div style={{ display: "grid", gap: 10 }}>
        <div>
          <div style={{ fontSize: 12, opacity: 0.75 }}>Room</div>
          <div style={{ fontWeight: 700 }}>{roomId || "—"}</div>
        </div>
        <div>
          <div style={{ fontSize: 12, opacity: 0.75 }}>Dealer</div>
          <div style={{ fontWeight: 600 }}>
            {Number.isInteger(dealerSeat) ? `Seat ${dealerSeat}` : "—"}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, opacity: 0.75 }}>Crib</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Chip>{cribCount}/4</Chip>
            {cribLocked ? <Chip tone="success">Locked</Chip> : null}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, opacity: 0.75 }}>Starter</div>
          <div>{cutCard ? <Chip>{cutCard}</Chip> : <span style={{ opacity: 0.6 }}>—</span>}</div>
        </div>

        <div style={{ marginTop: 8 }}>
          <button
            onClick={onOpenLog}
            style={{ padding: "8px 12px" }}
            title="Open the room event log"
          >
            Open Log
          </button>
        </div>
      </div>
    </Modal>
  );
}

