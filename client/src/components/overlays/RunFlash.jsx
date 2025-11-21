import React, { useEffect, useRef, useState } from "react";
import "./run-flash.css";

/**
 * Full-screen overlay that flashes scoring events during pegging
 * (pairs, runs, 15s, 31s, and combinations).
 * Purely presentational; server remains source of truth.
 */
export default function RunFlash({
  lastScoringEvent = null,
  peggingComplete = false,
  winnerActive = false,
  durationMs = 1200, // keep in sync with CSS animation timing
}) {
  const prevEventRef = useRef(null);
  const [flash, setFlash] = useState(null); // { text: string, points: number, key: number }

  useEffect(() => {
    const prevEvent = prevEventRef.current;
    prevEventRef.current = lastScoringEvent;

    if (winnerActive || peggingComplete) return;
    if (!lastScoringEvent) return;

    // Trigger only when we receive a new scoring event (different timestamp)
    const isNewEvent = 
      !prevEvent || 
      prevEvent.timestamp !== lastScoringEvent.timestamp;

    if (isNewEvent && lastScoringEvent.points > 0) {
      setFlash({ 
        text: lastScoringEvent.label,
        points: lastScoringEvent.points,
        key: lastScoringEvent.timestamp,
      });
    }
  }, [lastScoringEvent, peggingComplete, winnerActive]);

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
        <div className="runflash__content">
          <div className="runflash__label">{flash.text}</div>
          <div className="runflash__points">+{flash.points}</div>
        </div>
      </div>
    </div>
  );
}

