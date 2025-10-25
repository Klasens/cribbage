import React from "react";
import "./table-layout.css";

/**
 * Table layout with strong center column.
 * - ≥1100px: 3 columns (hands hug the edges, board dominates center)
 * - 840–1099px: 2 columns (right column stacks under center)
 * - <840px: single column
 *
 * Content is passed as render-only fragments; no logic here.
 */
export default function TableLayout({ left, center, right }) {
  return (
    <div className="table-layout">
      <div className="table-cell table-cell--left">{left}</div>
      <div className="table-cell table-cell--center">{center}</div>
      <div className="table-cell table-cell--right">{right}</div>
    </div>
  );
}

