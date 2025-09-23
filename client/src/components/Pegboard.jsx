import React, { useEffect, useMemo, useRef, useState } from "react";
import { slotX } from "../lib/pegboardMath";

/**
 * Pegboard: ruler + lanes + pegs.
 * Back peg = previous score; front peg = current score.
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

function useSlotWidth() {
  const ref = useRef(null);
  const [slotW, setSlotW] = useState(12);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const w = e.contentRect?.width ?? el.clientWidth ?? 0;
        if (!Number.isFinite(w) || w <= 0) continue;

        // leave some padding left/right (~48px)
        const usable = Math.max(0, w - 96);
        const raw = usable / SLOTS;
        const clamped = Math.max(SLOTW_MIN, Math.min(SLOTW_MAX, raw));
        setSlotW(clamped);
      }
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return { ref, slotW };
}

function MajorTick({ x, label }) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        bottom: 28,
        width: 1,
        height: 10,
        background: "#777",
      }}
      aria-hidden
    >
      <div
        style={{
          position: "absolute",
          top: 10,
          transform: "translateX(-50%)",
          fontSize: 12,
          color: "#cfcfcf",
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
        background: "#555",
        opacity: 0.8,
      }}
      aria-hidden
    />
  );
}

function LaneRow({ children, color }) {
  return (
    <div
      style={{
        position: "relative",
        marginTop: 8,
        padding: "10px 12px",
        borderRadius: 8,
        background: "#101419",
        border: "1px solid #1e2530",
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
      {children}
    </div>
  );
}

function Peg({ x = 0, y = 0, color = "#fff", size = 10, stroke = "#000" }) {
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
  };
  return <div style={pegStyle} aria-hidden />;
}

export default function Pegboard({
  players = [],
  dealerSeat = null,
  winnerSeat = null,
  peggingComplete = false,
}) {
  // --- width → slotW (px)
  const { ref, slotW } = useSlotWidth();

  const axisLeftPad = 48;
  const axisRightPad = 48;

  const majors = useMemo(() => [0, 30, 60, 90, 121], []);
  const minors = useMemo(() => {
    const m = [];
    for (let i = 5; i < 121; i += 5) {
      if (!majors.includes(i)) m.push(i);
    }
    return m;
  }, [majors]);

  const showMinors =
    typeof window !== "undefined" ? window.innerWidth >= 520 : true;

  const lanes = Array.isArray(players) ? players : [];

  return (
    <div style={{ marginTop: 16, textAlign: "left" }}>
      <h2 style={{ margin: 0, marginBottom: 6 }}>Scoreboard</h2>

      <div
        style={{
          display: "flex",
          gap: 16,
          alignItems: "center",
          flexWrap: "wrap",
          fontSize: 12,
          opacity: 0.9,
          marginBottom: 8,
        }}
      >
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
        <div style={{ marginLeft: "auto", opacity: 0.6, fontSize: 11 }}>
          slotW {Math.round(slotW)}px
        </div>
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
          padding: "18px 0 24px 0",
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
        <div style={{ padding: "6px 10px 10px" }}>
          {lanes.map((p) => {
            const color = colorForSeat(p.seatId);
            const isDealer = p.seatId === dealerSeat;

            // Back peg uses prevScore (fallback to score)
            const backScore =
              typeof p.prevScore === "number" ? p.prevScore : p.score || 0;
            const frontScore = p.score || 0;

            const xBack = axisLeftPad + slotX(backScore, slotW);
            const xFront = axisLeftPad + slotX(frontScore, slotW);

            const lanePegBaseY = 34;

            return (
              <LaneRow key={p.seatId} color={color}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      fontSize: 12,
                      opacity: 0.9,
                      minWidth: 68,
                      display: "flex",
                      gap: 6,
                      alignItems: "center",
                    }}
                  >
                    {isDealer ? "👑 " : null}
                    <span>[Seat {p.seatId}]</span>
                    <strong>{p.name}</strong>
                  </div>
                  <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
                    <div
                      style={{
                        fontVariantNumeric: "tabular-nums",
                        fontWeight: 700,
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
                    height: 48,
                    marginTop: 6,
                    borderRadius: 6,
                    background: "#19202a",
                    border: "1px solid #233042",
                  }}
                >
                  {/* back peg (previous score) */}
                  <Peg
                    x={xBack}
                    y={lanePegBaseY}
                    size={12}
                    color={color}
                    stroke="#000"
                  />
                  {/* front peg (current score) */}
                  <Peg
                    x={xFront}
                    y={lanePegBaseY - 8}
                    size={12}
                    color="#eaeaea"
                    stroke="#000"
                  />
                </div>
              </LaneRow>
            );
          })}
        </div>
      </div>
    </div>
  );
}

