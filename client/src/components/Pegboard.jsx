// client/src/components/Pegboard.jsx
import React, { useMemo } from "react";
import { SCORE_MAX, slotX } from "../lib/pegboardMath";

/**
 * Pegboard: baseline ruler + player lanes (no pegs yet).
 * - Deterministic color per seat (colorblind-safe palette)
 * - Dealer crown in lane label
 * - Static slot width for now; animation/measurement comes later
 */

// Static slot width (px) until we wire up ResizeObserver in later commits
const SLOT_W = 11;

// Colorblind-safe palette (Okabe–Ito + tuned for dark UI)
const PALETTE = [
  { fg: "#4E79A7", bg: "rgba(78,121,167,0.15)" },  // seat 0 — blue
  { fg: "#F28E2B", bg: "rgba(242,142,43,0.15)" },  // seat 1 — orange
  { fg: "#59A14F", bg: "rgba(89,161,79,0.15)" },   // seat 2 — green
  { fg: "#AF7AA1", bg: "rgba(175,122,161,0.18)" }, // seat 3 — purple
];

function seatSwatch(seatId = 0) {
  return PALETTE[seatId % PALETTE.length] || PALETTE[0];
}

const majors = [0, 30, 60, 90, 121];
const minors = Array.from({ length: 25 }, (_, i) => (i + 1) * 5).filter(
  (v) => !majors.includes(v) && v <= SCORE_MAX
);

export default function Pegboard({
  players = [],
  dealerSeat = null,
  winnerSeat = null,
  peggingComplete = false,
}) {
  const widthPx = useMemo(() => slotX(SCORE_MAX, SLOT_W), []);
  const winnerName =
    Number.isInteger(winnerSeat)
      ? players.find((p) => p.seatId === winnerSeat)?.name ?? `Seat ${winnerSeat}`
      : null;

  return (
    <div style={{ marginTop: 16, textAlign: "left" }}>
      <h2 style={{ margin: 0, marginBottom: 6 }}>Scoreboard</h2>

      {/* Status row */}
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
          <strong>{winnerName ?? "—"}</strong>
        </div>
        <div>
          <span style={{ opacity: 0.7 }}>Pegging:</span>{" "}
          <strong>{peggingComplete ? "Complete" : "In progress"}</strong>
        </div>
      </div>

      {/* Ruler baseline */}
      <div
        style={{
          position: "relative",
          border: "1px solid #333",
          background: "#161616",
          borderRadius: 8,
          minHeight: 120,
          padding: "18px 12px 12px",
          overflow: "hidden",
        }}
      >
        {/* Axis */}
        <div
          aria-hidden
          style={{
            position: "relative",
            height: 46,
            borderBottom: "1px solid #3a3a3a",
            marginBottom: 12,
          }}
        >
          {/* Major ticks + labels */}
          {majors.map((v) => {
            const x = slotX(v, SLOT_W);
            return (
              <div
                key={`major-${v}`}
                style={{
                  position: "absolute",
                  left: x,
                  bottom: 0,
                  height: 12,
                  width: 1,
                  background: "#888",
                }}
                title={`${v}`}
              />
            );
          })}
          {majors.map((v) => {
            const x = slotX(v, SLOT_W);
            return (
              <div
                key={`label-${v}`}
                style={{
                  position: "absolute",
                  left: x - 6,
                  bottom: -18,
                  fontSize: 12,
                  color: "#cfcfcf",
                }}
              >
                {v}
              </div>
            );
          })}

          {/* Minor ticks (hide on narrow viewports) */}
          <div
            aria-hidden
            className="pegboard-minors"
            style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
          >
            {minors.map((v) => {
              const x = slotX(v, SLOT_W);
              return (
                <div
                  key={`minor-${v}`}
                  style={{
                    position: "absolute",
                    left: x,
                    bottom: 0,
                    height: 8,
                    width: 1,
                    background: "#555",
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Player lanes */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {players.length === 0 ? (
            <div style={{ opacity: 0.7 }}>No players yet.</div>
          ) : (
            players.map((p) => <Lane key={p.seatId} p={p} dealerSeat={dealerSeat} />)
          )}
        </div>

        {/* Dev hint for now */}
        <div
          style={{
            position: "absolute",
            right: 8,
            bottom: 6,
            fontSize: 11,
            opacity: 0.5,
            userSelect: "none",
          }}
        >
          slotW {SLOT_W}px
        </div>

        {/* Fake width box to keep absolute ticks in view if horizontal overflows */}
        <div style={{ width: widthPx, height: 0 }} aria-hidden />
      </div>

      {/* Inline CSS for hiding minors under 520px (micro & portable) */}
      <style>{`
        @media (max-width: 520px) {
          .pegboard-minors { display: none; }
        }
      `}</style>
    </div>
  );
}

function Lane({ p, dealerSeat }) {
  const { fg, bg } = seatSwatch(p.seatId);
  const isDealer = p.seatId === dealerSeat;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        alignItems: "center",
        gap: 10,
        padding: "6px 8px",
        border: "1px solid #2a2a2a",
        borderRadius: 6,
        background: bg,
      }}
      aria-label={`Lane for ${p.name}`}
    >
      {/* Swatch */}
      <div
        style={{
          width: 14,
          height: 14,
          borderRadius: 4,
          background: fg,
          boxShadow: "0 0 0 1px rgba(0,0,0,0.35) inset",
        }}
        title={`Seat ${p.seatId}`}
      />

      {/* Label */}
      <div style={{ fontSize: 14 }}>
        <span style={{ opacity: 0.8 }}>[Seat {p.seatId}]</span>{" "}
        {isDealer ? "👑 " : ""}
        <strong>{p.name}</strong>
      </div>

      {/* Score */}
      <div style={{ fontVariantNumeric: "tabular-nums", fontWeight: 700 }}>
        {p.score}
      </div>
    </div>
  );
}

