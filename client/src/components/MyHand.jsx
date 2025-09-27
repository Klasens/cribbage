import React, { useEffect, useMemo, useState } from "react";
import HandGrid from "./hand/HandGrid";
import HandActions from "./hand/HandActions";

export default function MyHand({
  cards = [],
  cribLocked = false,
  cribCount = 0,
  onSendCrib,
  onShowCard,
  shownBySeat = {},
  mySeatId = null,
  peggingComplete = false,
  winnerActive = false,
}) {
  const [sel, setSel] = useState([]);

  useEffect(() => {
    setSel([]);
  }, [cards.join("|")]);

  const canSend = useMemo(
    () => sel.length === 2 && !cribLocked && !winnerActive,
    [sel, cribLocked, winnerActive]
  );

  const toggle = (c) => {
    setSel((prev) => {
      const has = prev.includes(c);
      if (has) return prev.filter((x) => x !== c);
      if (prev.length >= 2) return prev;
      return [...prev, c];
    });
  };

  const myShown = useMemo(() => {
    if (!Number.isInteger(mySeatId)) return new Set();
    const list = shownBySeat?.[mySeatId] || [];
    return new Set(Array.isArray(list) ? list : []);
  }, [shownBySeat, mySeatId]);

  if (!cards.length) return null;

  const canShowNow = cribLocked && !peggingComplete && !winnerActive;

  return (
    <div style={{ marginTop: 16, textAlign: "left" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <h3 style={{ margin: 0, marginBottom: 8 }}>Your hand</h3>
        <div style={{ fontSize: 12, opacity: 0.8 }}>
          Crib: <strong>{cribCount}/4</strong> {cribLocked ? "• Locked" : ""}
          {peggingComplete ? " • Pegging complete" : ""}
          {winnerActive ? " • Game over" : ""}
        </div>
      </div>

      <HandGrid
        cards={cards}
        sel={sel}
        shownSet={myShown}
        disabled={winnerActive}
        canShowNow={canShowNow}
        onToggle={toggle}
        onShow={onShowCard}
      />

      <HandActions
        canSend={canSend}
        onSendCrib={() => onSendCrib?.(sel)}
        cribLocked={cribLocked}
        winnerActive={winnerActive}
        selCount={sel.length}
      />
    </div>
  );
}

