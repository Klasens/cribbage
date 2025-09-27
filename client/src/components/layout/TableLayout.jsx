// client/src/components/layout/TableLayout.jsx
import React from "react";

/**
 * Minimal grid wrapper:
 * - left: narrow column (e.g., your hand)
 * - center: primary column (e.g., pegging + pegboard)
 * - right: narrow column (e.g., opponent summary)
 *
 * Trust-first & micro: no props magic, just slots.
 */
export default function TableLayout({ left, center, right }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(220px, 1fr) minmax(380px, 2.2fr) minmax(220px, 1fr)",
        gap: 16,
        alignItems: "start",
        marginTop: 16,
      }}
    >
      <div>{left}</div>
      <div>{center}</div>
      <div>{right}</div>
    </div>
  );
}

