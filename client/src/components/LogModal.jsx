// client/src/components/LogModal.jsx
import React from "react";

export default function LogModal({ open, onClose, entries = [] }) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "min(680px, 92vw)",
          maxHeight: "80vh",
          background: "#1a1a1a",
          border: "1px solid #333",
          borderRadius: 10,
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: "10px 14px",
            borderBottom: "1px solid #333",
            display: "flex",
            alignItems: "center",
          }}
        >
          <strong style={{ fontSize: 16 }}>Room Log</strong>
          <button onClick={onClose} style={{ marginLeft: "auto" }}>
            Close
          </button>
        </div>

        <div style={{ padding: 12, overflowY: "auto", maxHeight: "calc(80vh - 56px)" }}>
          {entries.length === 0 ? (
            <div style={{ opacity: 0.7 }}>No events yet.</div>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {entries.map((e) => (
                <li key={e.id} style={{ padding: "8px 6px", borderBottom: "1px solid #2a2a2a" }}>
                  <div style={{ fontSize: 12, opacity: 0.7 }}>
                    {new Date(e.ts).toLocaleTimeString()} • {e.kind}
                  </div>
                  <div style={{ marginTop: 2 }}>{e.text}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

