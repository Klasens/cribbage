// client/src/components/Pegboard.jsx
import React, { useMemo, useRef } from "react";
import { useSize } from "../hooks/useSize";
import { SCORE_MAX, slotX } from "../lib/pegboardMath";

/**
 * Pegboard: baseline ruler only (no lanes/pegs yet).
 * - Measures available width via ResizeObserver
 * - Derives clamped slot width (10..18 px)
 * - Renders axis, major ticks (0/30/60/90/121) with labels
 * - Renders minor ticks every 5; auto-hides under 520px width
 */
export default function Pegboard({
  players = [],
  dealerSeat = null,
  winnerSeat = null,
  peggingComplete = false,
}) {
  const rootRef = useRef(null);
  const { width } = useSize(rootRef);

  // Slot width: attempt to fit 122 slots across, clamp 10..18 px
  const slotW = useMemo(() => {
    if (!width || width <= 0) return 10;
    const ideal = Math.floor(width / (SCORE_MAX + 1)); // 0..121 -> 122 slots
    const clamped = Math.max(10, Math.min(18, ideal));
    return clamped;
  }, [width]);

  // Debug log to satisfy the measurement test case
  if (typeof window !== "undefined") {
    // eslint-disable-next-line no-console
    console.debug("[pegboard] width:", width, "slotW(clamped):", slotW);
  }

  const H = 120; // baseline area height
  const pad = 16;
  const axisY = 48;

  const majors = [0, 30, 60, 90, 121];
  const minors = useMemo(() => {
    const out = [];
    for (let s = 0; s <= SCORE_MAX; s += 5) {
      if (!majors.includes(s)) out.push(s);
    }
    return out;
  }, []); // majors constant, compute once

  const showMinors = width >= 520;

  const dealerText =
    Number.isInteger(dealerSeat) ? `Seat ${dealerSeat}` : "—";
  const winnerName = Number.isInteger(winnerSeat)
    ? (players.find((p) => p.seatId === winnerSeat)?.name ?? `Seat ${winnerSeat}`)
    : null;

  const statusRowStyle = {
    display: "flex",
    gap: 16,
    alignItems: "center",
    flexWrap: "wrap",
    fontSize: 12,
    opacity: 0.9,
    marginBottom: 8,
  };

  return (
    <div style={{ marginTop: 16, textAlign: "left" }}>
      <h2 style={{ margin: 0, marginBottom: 6 }}>Scoreboard</h2>

      <div style={statusRowStyle}>
        <div>
          <span style={{ opacity: 0.7 }}>Dealer:</span>{" "}
          <strong>{dealerText}</strong>
        </div>
        <div>
          <span style={{ opacity: 0.7 }}>Winner:</span>{" "}
          <strong>{winnerName ?? "—"}</strong>
        </div>
        <div>
          <span style={{ opacity: 0.7 }}>Pegging:</span>{" "}
          <strong>{peggingComplete ? "Complete" : "In progress"}</strong>
        </div>
        <div style={{ marginLeft: "auto", opacity: 0.7 }}>
          <code>slotW {slotW}px</code>
        </div>
      </div>

      {/* Ruler surface */}
      <div
        ref={rootRef}
        style={{
          border: "1px solid #333",
          background: "#161616",
          borderRadius: 8,
          minHeight: H,
          padding: pad,
          position: "relative",
          overflow: "hidden",
        }}
        aria-label="Pegboard ruler"
      >
        {/* Axis line */}
        <div
          style={{
            position: "absolute",
            left: pad,
            right: pad,
            top: axisY,
            height: 0,
            borderTop: "2px solid #2a2a2a",
          }}
        />

        {/* Major ticks + labels */}
        {majors.map((s) => {
          const x = pad + slotX(s, slotW);
          return (
            <div key={`maj-${s}`} style={{ position: "absolute", left: x }}>
              <div
                style={{
                  position: "absolute",
                  top: axisY - 12,
                  width: 2,
                  height: 24,
                  background: "#bdbdbd",
                  transform: "translateX(-1px)",
                }}
                title={`Score ${s}`}
              />
              <div
                style={{
                  position: "absolute",
                  top: axisY + 14,
                  transform: "translateX(-50%)",
                  fontSize: 12,
                  color: "#d0d0d0",
                  whiteSpace: "nowrap",
                }}
              >
                {s}
              </div>
            </div>
          );
        })}

        {/* Minor ticks (every 5), hidden for narrow boards */}
        {showMinors &&
          minors.map((s) => {
            const x = pad + slotX(s, slotW);
            return (
              <div key={`min-${s}`} style={{ position: "absolute", left: x }}>
                <div
                  style={{
                    position: "absolute",
                    top: axisY - 8,
                    width: 1,
                    height: 16,
                    background: "#555",
                    transform: "translateX(-0.5px)",
                  }}
                  title={`Score ${s}`}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
}

