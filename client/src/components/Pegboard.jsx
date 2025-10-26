import React, { useEffect, useMemo, useRef, useState } from "react";
import "./pegboard.css";

const ROWS = 4;
const COLS = 31;
const TOTAL = ROWS * COLS;

const SEAT_COLORS = ["#3da5d9", "#d17a22", "#8ac926", "#ff70a6"];
function colorForSeat(seatId = 0) {
  const i = Math.abs(Number(seatId)) % SEAT_COLORS.length;
  return SEAT_COLORS[i];
}
function scoreToIndex(score) {
  const n = Math.floor(Number(score) || 0);
  if (n <= 0) return 0;
  if (n >= 121) return 120;
  return n;
}
function useTwoLanes(players = []) {
  const sorted = [...players].sort((a, b) => (a.seatId ?? 0) - (b.seatId ?? 0));
  return sorted.slice(0, 2);
}
function useGridMetrics(gridRef) {
  const [m, setM] = useState({ pip: 16, gap: 6, padL: 6, padT: 6, bdL: 1, bdT: 1 });
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const px = (s) => parseFloat(s || "0") || 0;
    const read = () => {
      const cs = getComputedStyle(el);
      setM({
        pip: px(cs.getPropertyValue("--pip")),
        gap: px(cs.getPropertyValue("--gap")),
        padL: px(cs.paddingLeft),
        padT: px(cs.paddingTop),
        bdL: px(cs.borderLeftWidth),
        bdT: px(cs.borderTopWidth),
      });
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return m;
}
function indexToPoint(idx, { pip, gap, padL, padT, bdL, bdT }) {
  const col = idx % COLS;
  const row = (idx / COLS) | 0;
  const x = bdL + padL + col * (pip + gap) + pip / 2;
  const y = bdT + padT + row * (pip + gap) + pip / 2;
  return { x, y };
}
function Pip({ i, state = "empty", ring }) {
  const five = ((i + 1) % 5) === 0;
  const cls = ["pip", five ? "pip--five" : "", `pip--${state}`].filter(Boolean).join(" ");
  return <div className={cls} data-i={i} style={ring ? { ["--pip-ring"]: ring } : undefined} />;
}

function Lane({ laneIndex = 0, player, dealerSeat, winnerSeat }) {
  const color = colorForSeat(player.seatId);
  const backIdx = scoreToIndex(
    typeof player.prevScore === "number" ? player.prevScore : player.score || 0
  );
  const frontIdx = scoreToIndex(player.score || 0);
  const isDealer = player.seatId === dealerSeat;
  const isWinner = Number.isInteger(winnerSeat) && player.seatId === winnerSeat;

  const cells = useMemo(() => Array.from({ length: TOTAL }, (_, i) => i), []);
  const gridRef = useRef(null);
  const metrics = useGridMetrics(gridRef);

  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 0);
    return () => clearTimeout(t);
  }, []);

  const baseBack = indexToPoint(backIdx, metrics);
  const baseFront = indexToPoint(frontIdx, metrics);
  const off = Math.max(3, Math.round(metrics.pip * 0.18));
  const backPos = { x: baseBack.x - off, y: baseBack.y + off };
  const frontPos = { x: baseFront.x + off, y: baseFront.y - off };

  const side = laneIndex === 0 ? "left" : "right";
  const label = `Player ${laneIndex + 1}`;

  return (
    <div className={`cboard__lane${isWinner ? " is-winner" : ""}`}>
      <div className={`cboard__laneHeader cboard__laneHeader--${side}`}>
        <div className="cboard__player">
          {isDealer ? <span className="ico ico--crown" aria-label="Dealer" /> : null}
          <span className="cboard__laneLabel">{label}</span>
          <span className="cboard__divider">•</span>
          <span className="cboard__playerName" title={`[Seat ${player.seatId}] ${player.name}`}>
            [Seat {player.seatId}] {player.name}
          </span>
          {isWinner ? <span className="ico ico--trophy" aria-label="Winner" /> : null}
        </div>
        <div className="cboard__score tnum">{player.score}</div>
      </div>

      <div className="pipWrap">
        <div ref={gridRef} className="pipGrid">
          {cells.map((i) => {
            let state = "empty";
            let ring;
            if (i === backIdx) { state = "back"; ring = color; }
            if (i === frontIdx) { state = "front"; if (isWinner) state = "winner"; }
            return <Pip key={i} i={i} state={state} ring={ring} />;
          })}
        </div>

        <div className={`cboard__pegLayer${ready ? " is-ready" : ""}`}>
          <span
            className="peg peg--back"
            style={{ background: color, transform: `translate(${backPos.x}px, ${backPos.y}px)` }}
            aria-label="previous score"
          />
          <span
            className={`peg peg--front${isWinner ? " peg--frontWinner" : ""}`}
            style={{ transform: `translate(${frontPos.x}px, ${frontPos.y}px)` }}
            aria-label="current score"
          />
        </div>
      </div>
    </div>
  );
}

export default function Pegboard({
  players = [],
  dealerSeat = null,
  winnerSeat = null,
  peggingComplete = false,
}) {
  const lanes = useTwoLanes(players);
  const showNote = (players?.length || 0) > 2;

  return (
    <div className="cboard cboard--tabletop">
      <div className="cboard__header">
        <h2 className="cboard__title">Cribbage Board</h2>
        <div className="cboard__meta">
          Pegging: <strong>{peggingComplete ? "Complete" : "In progress"}</strong>
        </div>
        {showNote && <div className="cboard__hint">Showing first two seats</div>}
      </div>

      {lanes.length === 0 ? (
        <div className="cboard__empty">No players yet.</div>
      ) : (
        <div className="cboard__grid">
          {lanes.map((p, idx) => (
            <Lane
              key={p.seatId}
              laneIndex={idx}
              player={p}
              dealerSeat={dealerSeat}
              winnerSeat={winnerSeat}
            />
          ))}
        </div>
      )}

      <div className="cboard__badge" title="Points to win">121</div>
    </div>
  );
}

