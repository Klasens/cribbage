// client/src/components/layout/TableLayout.jsx
import React from "react";
import "./table-layout.css";

/**
 * Minimal grid wrapper:
 * - left: narrow column
 * - center: primary column
 * - right: narrow column
 */
export default function TableLayout({ left, center, right }) {
  return (
    <div className="table-layout">
      <div className="table-cell">{left}</div>
      <div className="table-cell">{center}</div>
      <div className="table-cell">{right}</div>
    </div>
  );
}

