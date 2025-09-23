// client/src/components/ToastLog.jsx
import React, { useMemo } from "react";

/**
 * Simple toast-style log viewer.
 * Props:
 *  - logs: Array<{ text:string, ts:number }>
 *  - maxVisible: number (default 6)
 */
export default function ToastLog({ logs = [], maxVisible = 6 }) {
  const items = useMemo(() => {
    const arr = Array.isArray(logs) ? logs : [];
    return arr.slice(Math.max(0, arr.length - maxVisible));
  }, [logs, maxVisible]);

  if (!items.length) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 16,
        left: 16,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        zIndex: 9999,
      }}
    >
      {items.map((e, i) => (
        <div
          key={e.ts ?? i}
          style={{
            background: "rgba(20,20,20,0.9)",
            color: "#eaeaea",
            border: "1px solid #333",
            borderRadius: 8,
            padding: "8px 12px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
            maxWidth: 360,
            fontSize: 13,
          }}
          title={new Date(e.ts || Date.now()).toLocaleTimeString()}
        >
          {e.text}
        </div>
      ))}
    </div>
  );
}

