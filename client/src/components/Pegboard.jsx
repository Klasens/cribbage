import React, { useEffect, useMemo, useRef, useState } from "react";
import { slotX } from "../lib/pegboardMath";

/**
 * Pegboard: ruler + lanes + pegs.
 * Back peg = previous score; front peg = current score.
 * Commit 11: smooth peg transitions (client is a renderer; values come from server)
 * Commit 12: winner highlight on the winning lane
 * Commit 13: board polish + responsiveness
 *  - Major tick labels use chip-style backgrounds for readability
 *  - Minor tick density adapts to available width (5/10/15 step)
 *  - Compact layout under ~520px; axis padding adapts with width
 */

const SLOTS = 122; // 0..121 inclusive
const SLOTW_MIN = 10;
const SLOTW_MAX = 18;

// Color palette: colorblind-safe, dark-friendly
const SEAT_COLORS = [
  "#3da5d9", // blue
  "#d17a22", // orange/brown
  "#8ac926", // green
  "#ff70a6", // magenta
];

function colorForSeat(seatId = 0) {
  const i = Math.abs(Number(seatId)) % SEAT_COLORS.length;
  return SEAT_COLORS[i];
}

/**
 * Measure container width → derive slot width and expose containerW.
 */
function useSlotMetrics() {
  const ref = useRef(null);
  const [slotW, setSlotW] = useState(12);
  const [containerW, setContainerW] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const w = e.contentRect?.width ?? el.clientWidth ?? 0;
        if (!Number.isFinite(w) || w <= 0) continue;

        setContainerW(w);

        // leave padding left/right; adapt with width
        const leftRightPad = w < 560 ? 72 : 96;
        const usable = Math.max(0, w - leftRightPad);
        const raw = usable / SLOTS;
        const clamped = Math.max(SLOTW_MIN, Math.min(SLOTW_MAX, raw));
        setSlotW(clamped);
      }
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return { ref, slotW, containerW };
}

function MajorTick({ x, label }) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        bottom: 26,
        width: 1,
        height: 12,
        background: "#7b8798",
      }}
      aria-hidden
    >
      <div
        style={{
          position: "absolute",
          top: 12,
          transform: "translateX(-50%)",
          fontSize: 11,
          color: "#dfe6ee",
          background: "rgba(8,12,17,0.9)",
          border: "1px solid #273241",
          borderRadius: 6,
          padding: "2px 6px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.35)",
          userSelect: "none",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
    </div>
  );
}

function MinorTick({ x }) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        bottom: 30,
        width: 1,
        height: 6,
        background: "#556072",
        opacity: 0.85,
      }}
      aria-hidden
    />
  );
}

function LaneRow({ children, color, isWinner = false }) {
  return (
    <div
      style={{
        position: "relative",
        marginTop: 8,
        padding: "10px 12px",
        borderRadius: 10,
        background: isWinner ? "linear-gradient(180deg,#12140f,#101419)" : "#101419",
        border: `1px solid ${isWinner ? "#8f7a27" : "#1e2530"}`,
        boxShadow: isWinner
          ? "0 0 0 2px rgba(255,215,0,0.18), 0 8px 30px rgba(0,0,0,0.35)"
          : "none",
        transition: "box-shadow 200ms ease, border-color 200ms ease, background 200ms ease",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 8,
          top: 8,
          width: 10,
          height: 10,
          borderRadius: 3,
          background: color,
          boxShadow: "0 0 0 2px rgba(0,0,0,0.25) inset",
        }}
        aria-hidden
      />
      {isWinner && (
        <div
          style={{
            position: "absolute",
            top: -8,
            right: 10,
            padding: "2px 8px",
            borderRadius: 6,
            background: "rgba(255,215,0,0.12)",
            border: "1px solid rgba(255,215,0,0.35)",
            fontSize: 11,
            fontWeight: 700,
            color: "#f2e29b",
            backdropFilter: "blur(2px)",
          }}
        >
          🏁 Winner
        </div>
      )}
      {children}
    </div>
  );
}

/**
 * Peg with smooth left-position transitions.
 * We disable the transition on the very first paint to avoid
 * pegs flying in from the origin (micro animation polish).
 */
function Peg({ x = 0, y = 0, color = "#fff", size = 10, stroke = "#000" }) {
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
  }, []);

  const pegStyle = {
    position: "absolute",
    left: x,
    top: y,
    width: size,
    height: size,
    borderRadius: size,
    background: color,
    boxShadow: `0 0 0 1px ${stroke}`,
    transform: "translate(-50%, -50%)",
    transition: mountedRef.current ? "left 220ms cubic-bezier(.2,.7,.2,1)" : "none",
    willChange: "left",
  };
  return <div style={pegStyle} aria-hidden />;
}

export default function Pegboard({
  players = [],
  dealerSeat = null,
  winnerSeat = null,
  peggingComplete = false,
}) {
  // --- container & slot metrics
  const { ref, slotW, containerW } = useSlotMetrics();

  // axis padding adapts with width
  const axisLeftPad = containerW < 560 ? 36 : 48;
  const axisRightPad = containerW < 560 ? 36 : 48;

  // minor tick density derived from slot width
  const minorStep = slotW >= 15 ? 5 : slotW >= 12 ? 10 : 15;

  const majors = useMemo(() => [0, 30, 60, 90, 121], []);
  const minors = useMemo(() => {
    const arr = [];
    for (let i = minorStep; i < 121; i += minorStep) {
      if (!majors.includes(i)) arr.push(i);
    }
    return arr;
  }, [majors, minorStep]);

  const showMinors = slotW >= 11; // hide minors when extremely tight
  const compact = containerW < 520;

  const lanes = Array.isArray(players) ? players : [];

  return (
    <div style={{ marginTop: 16, textAlign: "left" }}>
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
          fontSize: compact ? 11 : 12,
          opacity: 0.95,
          marginBottom: 6,
        }}
      >
        <h2 style={{ margin: 0, marginRight: 6, fontSize: compact ? 18 : 20 }}>
          Scoreboard
        </h2>
        <div>
          <span style={{ opacity: 0.7 }}>Dealer:</span>{" "}
          <strong>
            {Number.isInteger(dealerSeat) ? `Seat ${dealerSeat}` : "—"}
          </strong>
        </div>
        <div>
          <span style={{ opacity: 0.7 }}>Winner:</span>{" "}
          <strong>
            {Number.isInteger(winnerSeat)
              ? players.find((p) => p.seatId === winnerSeat)?.name ??
                `Seat ${winnerSeat}`
              : "—"}
          </strong>
        </div>
        <div>
          <span style={{ opacity: 0.7 }}>Pegging:</span>{" "}
          <strong>{peggingComplete ? "Complete" : "In progress"}</strong>
        </div>
        {!compact && (
          <div style={{ marginLeft: "auto", opacity: 0.55, fontSize: 11 }}>
            slotW {Math.round(slotW)}px
          </div>
        )}
      </div>

      {/* Axis + ticks + lanes */}
      <div
        ref={ref}
        style={{
          position: "relative",
          overflow: "hidden",
          border: "1px solid #333",
          background: "#0f1216",
          borderRadius: 10,
          padding: compact ? "14px 0 20px 0" : "18px 0 24px 0",
        }}
      >
        {/* axis line */}
        <div
          style={{
            position: "relative",
            height: 1,
            background: "#2a323c",
            marginLeft: axisLeftPad,
            marginRight: axisRightPad,
          }}
        >
          {/* majors */}
          {majors.map((s) => {
            const x = axisLeftPad + slotX(s, slotW);
            return <MajorTick key={`M${s}`} x={x} label={s} />;
          })}

          {/* minors */}
          {showMinors &&
            minors.map((s) => {
              const x = axisLeftPad + slotX(s, slotW);
              return <MinorTick key={`m${s}`} x={x} />;
            })}
        </div>

        {/* lanes */}
        <div style={{ padding: compact ? "6px 8px 8px" : "6px 10px 10px" }}>
          {lanes.map((p) => {
            const color = colorForSeat(p.seatId);
            const isDealer = p.seatId === dealerSeat;
            const isWinner =
              Number.isInteger(winnerSeat) && p.seatId === winnerSeat;

            // Back peg uses prevScore (fallback to score) — server-provided
            const backScore =
              typeof p.prevScore === "number" ? p.prevScore : p.score || 0;
            const frontScore = p.score || 0;

            const xBack = axisLeftPad + slotX(backScore, slotW);
            const xFront = axisLeftPad + slotX(frontScore, slotW);

            const lanePegBaseY = 34;

            return (
              <LaneRow key={p.seatId} color={color} isWinner={isWinner}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      fontSize: compact ? 11 : 12,
                      opacity: 0.9,
                      minWidth: 68,
                      display: "flex",
                      gap: 6,
                      alignItems: "center",
                    }}
                  >
                    {isDealer ? "👑 " : null}
                    <span>[Seat {p.seatId}]</span>
                    <strong
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {p.name}
                    </strong>
                  </div>
                  <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
                    <div
                      style={{
                        fontVariantNumeric: "tabular-nums",
                        fontWeight: 700,
                        color: isWinner ? "#f2e29b" : "#eaeaea",
                        textShadow: isWinner
                          ? "0 0 10px rgba(255,215,0,0.25)"
                          : "none",
                        transition:
                          "color 150ms ease, text-shadow 150ms ease",
                      }}
                    >
                      {p.score}
                    </div>
                  </div>
                </div>

                {/* peg layer */}
                <div
                  style={{
                    position: "relative",
                    height: compact ? 42 : 48,
                    marginTop: 6,
                    borderRadius: 6,
                    background: isWinner ? "#1c232c" : "#19202a",
                    border: `1px solid ${isWinner ? "#3d4a5c" : "#233042"}`,
                    transition:
                      "background 200ms ease, border-color 200ms ease",
                    filter: isWinner
                      ? "drop-shadow(0 4px 20px rgba(255,215,0,0.16))"
                      : "none",
                  }}
                >
                  {/* back peg (previous score) */}
                  <Peg x={xBack} y={lanePegBaseY} size={12} color={color} stroke="#000" />
                  {/* front peg (current score) */}
                  <Peg x={xFront} y={lanePegBaseY - 8} size={12} color="#eaeaea" stroke="#000" />
                </div>
              </LaneRow>
            );
          })}
        </div>
      </div>
    </div>
  );
}

