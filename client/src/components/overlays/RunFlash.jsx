import React, { useEffect, useRef, useState } from "react";
import "./run-flash.css";

/**
 * Full-screen overlay that flashes a big green "15" or "31"
 * when the shared pegging count *arrives* at those values.
 * Purely presentational; server remains source of truth.
 */
export default function RunFlash({
  runCount = 0,
  peggingComplete = false,
  winnerActive = false,
  durationMs = 900, // keep in sync with CSS animation timing
}) {
  const prevRef = useRef(runCount);
  const [flash, setFlash] = useState(null); // { text: '15' | '31', key: number }

  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = runCount;

    if (winnerActive || peggingComplete) return;

    // Trigger only when we arrive exactly at 15 or 31 (no repeats)
    if (runCount === 15 && prev !== 15) {
      setFlash({ text: "15", key: Date.now() });
    } else if (runCount === 31 && prev !== 31) {
      setFlash({ text: "31", key: Date.now() });
    }
  }, [runCount, peggingComplete, winnerActive]);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), durationMs);
    return () => clearTimeout(t);
  }, [flash, durationMs]);

  if (!flash) return null;

  // Use aria-live for a11y without stealing focus.
  return (
    <div className="runflash" aria-live="polite" aria-atomic="true">
      <div className="runflash__inner" key={flash.key}>
        <div className="runflash__burst" aria-hidden />
        <div className="runflash__text">{flash.text}</div>
      </div>
    </div>
  );
}

