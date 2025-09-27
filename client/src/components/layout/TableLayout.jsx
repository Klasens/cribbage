// client/src/components/layout/TableLayout.jsx
import React from "react";

/**
 * Minimal grid wrapper:
 * - left: narrow column (e.g., your hand)
 * - center: primary column (e.g., pegging + pegboard)
 * - right: narrow column (e.g., opponent summary)
 *
 * Responsive behavior in CSS:
 * - ≥1000px: 3 columns
 * - 700–999px: 2 columns (left + center; right below)
 * - <700px: 1 column (left, center, right stacked)
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

