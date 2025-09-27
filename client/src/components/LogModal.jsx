// client/src/components/LogModal.jsx
import React from "react";
import Modal from "../ui/Modal";

export default function LogModal({ open, onClose, entries = [] }) {
  return (
    <Modal open={open} onClose={onClose} title="Room Log" width={680}>
      {entries.length === 0 ? (
        <div style={{ opacity: 0.7 }}>No events yet.</div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {entries.map((e) => (
            <li key={e.id} style={{ padding: "8px 6px", borderBottom: "1px solid var(--c-border)" }}>
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                {new Date(e.ts).toLocaleTimeString()} • {e.kind}
              </div>
              <div style={{ marginTop: 2 }}>{e.text}</div>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}

