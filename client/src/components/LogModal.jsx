// client/src/components/LogModal.jsx
import React from "react";
import Modal from "../ui/Modal";
import "./log-modal.css";

export default function LogModal({ open, onClose, entries = [] }) {
  return (
    <Modal open={open} onClose={onClose} title="Room Log" width={680}>
      {entries.length === 0 ? (
        <div className="log__empty">No events yet.</div>
      ) : (
        <ul className="log__list">
          {entries.map((e) => (
            <li key={e.id} className="log__item">
              <div className="log__meta">
                {new Date(e.ts).toLocaleTimeString()} • {e.kind}
              </div>
              <div className="log__text">{e.text}</div>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}

