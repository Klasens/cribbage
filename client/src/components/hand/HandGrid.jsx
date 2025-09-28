import React from "react";
import HandCard from "./HandCard";

export default function HandGrid({
  cards = [],
  sel = [],
  shownSet = new Set(),
  disabled = false,
  canShowNow = false,
  onToggle,
  onShow,
}) {
  return (
    <div className="hand-grid">
      {cards.map((c, i) => (
        <HandCard
          key={`${c}-${i}`}
          card={c}
          idx={i}
          picked={sel.includes(c)}
          shown={shownSet.has(c)}
          disabled={disabled}
          canShowNow={canShowNow}
          onToggle={onToggle}
          onShow={onShow}
        />
      ))}
    </div>
  );
}

