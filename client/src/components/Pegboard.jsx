import React, { useEffect, useMemo, useRef, useState } from "react";
import { slotX } from "../lib/pegboardMath";
import "./pegboard.css";

/**
 * Pegboard: ruler + lanes + pegs.
 * Back peg = previous score; front peg = current score.
 * Client is a renderer; values come from the server.
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
    <div className="tick tick--major" style={{ left: x }} aria-hidden>
      <div className="tick__label">{label}</div>
    </div>
  );
}

function MinorTick({ x }) {
  return <div className="tick tick--minor" style={{ left: x }} aria-hidden />;
}

function LaneRow({ children, color, isWinner = false }) {
  return (
    <div className={`lane${isWinner ? " lane--winner" : ""}`}>
      <div className="lane__swatch" style={{ background: color }} aria-hidden />
      {isWinner && <div className="lane__badge">🏁 Winner</div>}
      {children}
    </div>
  );
}

/**
 * Peg with smooth left-position transitions.
 * We disable the transition on the very first paint to avoid
 * pegs flying in from the origin (micro animation polish).
 */
function Peg({ x = 0, y = 0, color = "#fff", variant = "front" }) {
  const mountedRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;
  }, []);

  const style = {
    left: x,
    top: y,
    transition: mountedRef.current ? "left 220ms cubic-bezier(.2,.7,.2,1)" : "none",
    background: variant === "back" ? color : undefined,
  };
  return <div className={`peg peg--${variant}`} style={style} aria-hidden />;
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
    <div className="pegboard">
      <div className={`pegboard__header${compact ? " is-compact" : ""}`}>
        <h2 className="pegboard__title">Scoreboard</h2>
        <div className="pegboard__meta">
          <span className="pegboard__metaKey">Dealer:</span>{" "}
          <strong>
            {Number.isInteger(dealerSeat) ? `Seat ${dealerSeat}` : "—"}
          </strong>
        </div>
        <div className="pegboard__meta">
          <span className="pegboard__metaKey">Winner:</span>{" "}
          <strong>
            {Number.isInteger(winnerSeat)
              ? players.find((p) => p.seatId === winnerSeat)?.name ??
                `Seat ${winnerSeat}`
              : "—"}
          </strong>
        </div>
        <div className="pegboard__meta">
          <span className="pegboard__metaKey">Pegging:</span>{" "}
          <strong>{peggingComplete ? "Complete" : "In progress"}</strong>
        </div>
        {!compact && (
          <div className="pegboard__debug">slotW {Math.round(slotW)}px</div>
        )}
      </div>

      {/* Axis + ticks + lanes */}
      <div
        ref={ref}
        className={`pegboard__frame${compact ? " is-compact" : ""}`}
      >
        {/* axis line */}
        <div
          className="pegboard__axis"
          style={{
            ["--axis-left"]: `${axisLeftPad}px`,
            ["--axis-right"]: `${axisRightPad}px`,
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
        <div className="pegboard__lanes">
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
                <div className="lane__row">
                  <div className="lane__name">
                    {isDealer ? "👑 " : null}
                    <span>[Seat {p.seatId}]</span>
                    <strong className="lane__nameText">{p.name}</strong>
                  </div>
                  <div className="lane__score">{p.score}</div>
                </div>

                {/* peg layer */}
                <div
                  className={`lane__pegLayer${compact ? " is-compact" : ""}${
                    isWinner ? " is-winner" : ""
                  }`}
                >
                  {/* back peg (previous score) */}
                  <Peg x={xBack} y={lanePegBaseY} color={color} variant="back" />
                  {/* front peg (current score) */}
                  <Peg x={xFront} y={lanePegBaseY - 8} variant="front" />
                </div>
              </LaneRow>
            );
          })}
        </div>
      </div>
    </div>
  );
}

