import React, { useMemo } from "react";
import "./pegboard.css";

/**
 * 2-lane CribbageBoard (121 pips per lane).
 * - Server is truth (scores & prevScore come from state.players[*]).
 * - We render only the first two seats by seatId to keep the board clear.
 * - Back peg = prevScore (fallback to score); Front peg = current score.
 */

const ROWS = 11;
const COLS = 11;
const TOTAL = ROWS * COLS; // 121

// Color palette: colorblind-friendly, dark-friendly
const SEAT_COLORS = ["#3da5d9", "#d17a22", "#8ac926", "#ff70a6"];

function colorForSeat(seatId = 0) {
  const i = Math.abs(Number(seatId)) % SEAT_COLORS.length;
  return SEAT_COLORS[i];
}

// Clamp score 0..121 → cell index 0..120
function scoreToIndex(score) {
  const n = Math.floor(Number(score) || 0);
  if (n <= 0) return 0;
  if (n >= 121) return 120;
  return n;
}

// Choose up to two lanes by seat order for a clean, readable board
function useTwoLanes(players = []) {
  const sorted = [...players].sort((a, b) => (a.seatId ?? 0) - (b.seatId ?? 0));
  return sorted.slice(0, 2);
}

function Pip({ i, children }) {
  const five = ((i + 1) % 5) === 0;
  const cls = five ? "pip pip--five" : "pip";
  return (
    <div className={cls} data-i={i}>
      {children}
    </div>
  );
}

function Lane({ player, dealerSeat, winnerSeat }) {
  const color = colorForSeat(player.seatId);
  const backIdx = scoreToIndex(
    typeof player.prevScore === "number" ? player.prevScore : player.score || 0
  );
  const frontIdx = scoreToIndex(player.score || 0);
  const isDealer = player.seatId === dealerSeat;
  const isWinner = Number.isInteger(winnerSeat) && player.seatId === winnerSeat;

  const cells = useMemo(() => Array.from({ length: TOTAL }, (_, i) => i), []);

  return (
    <div className={`cboard__lane${isWinner ? " is-winner" : ""}`}>
      <div className="cboard__laneHeader">
        <div className="cboard__player">
          {isDealer ? "👑 " : null}
          [Seat {player.seatId}] <strong className="cboard__playerName">{player.name}</strong>
        </div>
        <div className="cboard__score">{player.score}</div>
      </div>

      <div className="pipGrid">
        {cells.map((i) => (
          <Pip key={i} i={i}>
            {i === backIdx && (
              <span
                className="peg peg--back"
                style={{ background: color }}
                aria-label="previous score"
              />
            )}
            {i === frontIdx && (
              <span className="peg peg--front" aria-label="current score" />
            )}
          </Pip>
        ))}
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
    <div className="cboard">
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
          {lanes.map((p) => (
            <Lane
              key={p.seatId}
              player={p}
              dealerSeat={dealerSeat}
              winnerSeat={winnerSeat}
            />
          ))}
        </div>
      )}
    </div>
  );
}

