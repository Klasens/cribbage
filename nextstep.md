# Cribbage MVP — Bootstrap (Current State & Next Step)

## TL;DR
We’ve shipped realtime rooms, manual scoring, dealing, crib selection with auto-flipped starter, **manual pegging (show to count-to-31)**, **winner lock**, **Next Hand (dealer rotation)**, **New Game reset**, and a **room log (modal) with stable IDs**.  
**Next up:** start the pegboard UI (visual score track). Reconnect polish is intentionally out-of-scope for this artifact.

---

## What exists now

### Architecture
- **Backend:** Node.js + Express + Socket.IO (in-memory rooms)
- **Frontend:** React + Vite
- **Shared:** common protocol for socket event names and initial state factory

### Features
- **Create / Join / Rejoin** with seat + display name (stored in `localStorage`)
- **Manual scoring:** per-seat **+1 / +2 / +3 / +N** (trust-based scoreboard)
- **Deal 6 (dealer-only):** server shuffles, privately sends hands
- **Crib selection:** each player picks **2 cards**; server collects
- **Auto-starter:** when crib hits 4, crib locks and **starter (cut) flips** from remaining deck
- **Manual pegging flow:**  
  - “Show” a card to add its pegging value to a shared **runCount (0–31)**  
  - “Reset” the run (GO) — clears `runCount`/pile but keeps each seat’s “shown” checkmarks  
  - Auto-**pegging complete** when every active seat has shown 4 unique cards; run resets and checkmarks clear
- **Winner lock:** first player to **≥ 121** becomes winner; scoring and pegging freeze
- **Next Hand:** rotates dealer clockwise among active seats; resets per-hand state, **scores persist**
- **New Game:** scores reset to 0, dealer → seat 0, winner cleared, per-hand state reset
- **Room log (modal):** compact event feed (deal, crib lock + cut, peg events, next hand, winner, new game) with **server-assigned unique IDs** and capped history

### UI Surface
- **JoinForm** (room & name), **Status** (crib 0–4, locked, starter)
- **ControlsBar**: Deal 6 (dealer), Clear Local, Next Hand (enabled when pegging complete), **New Game** (enabled when winner), Log (opens modal)
- **MyHand**: choose 2 for crib, **Show** buttons during pegging with per-card “Shown ✓” feedback
- **PeggingPanel**: runCount, last shown, who showed it, Reset (GO)
- **PlayersList**: names, scores, **👑 dealer marker**, “(you)” tag
- **LogModal**: sorted list with timestamp + kind + text

### Modularization
**Server**
- `rooms.js` — room lifecycle, broadcasting, name normalization, **pushLog (unique IDs, capped length)**
- `deck.js` — deck creation, shuffle, `cardText`
- `sockets/` — modular handlers
  - `room` (create/join/rejoin)
  - `deal` (dealer-only, sends private hands, logs)
  - `crib` (collect 2 per seat → lock → flip starter, logs)
  - `peg` (show/reset run, checkmarks, auto-complete, logs)
  - `scoring` (manual scoreboard, **winner detection + lock**, logs)
  - `nextHand` (rotate dealer, reset per-hand, logs)
  - `newGame` (full reset, logs)
  - `lifecycle` (disconnect cleanup)
- `shared/protocol.js` — event names + `createInitialState()` (crib, pegging, winner, log fields)

**Client**
- Hooks: `useGameClient` (state/actions), `useRoomState` (socket state + rejoin attempt), `useActions` (emitters), `useHand` (private hand)
- Components: `JoinForm`, `Status`, `ControlsBar`, `MyHand`, `PeggingPanel`, `PlayersList`, `ScoreControls`, **`LogModal`**, `ToastLog` (kept but modal-first)
- `lib/socket.js` — Socket.IO client, typed `api` wrapper

---

## Socket Protocol (current)

**Client → Server**
- `room:create`, `room:join`, `room:rejoin`
- `peg:add` (scoreboard)
- `host:deal`
- `player:cribSelect` (exactly two)
- `peg:show`, `peg:reset`
- `hand:next`
- `game:new`

**Server → Client**
- `state:update` (authoritative room state)
- `hand:your` (private hand to a seat)

---

## Pegging Rules (implemented)
- **Values:** A=1; 2–10=face; J/Q/K=10
- **Run:** shared `runCount` clamped to 31
- **Show:** appends to `pegPile`, updates `lastShown`, `lastShownBySeat/Name`, tracks per-seat `shownBySeat`
- **Reset (GO):** clears transient run fields; retains `shownBySeat`
- **Auto-complete:** when every active seat has shown 4 unique cards, set `peggingComplete=true`, clear transient run & checkmarks, prompt to count hands
- **Trust-based:** no turn order enforcement; players self-manage

---

## Build Rules (we’re following these)
1. **Micro-steps only** — land small, testable changes end-to-end.
2. **Trust-first UX** — minimal enforcement; avoid heavy rules engine.
3. **Server is the source of truth** — client is a renderer/emitter.
4. **Freeze on winner** — no scoring/pegging after victory (explicit guards).
5. **Deterministic, stable IDs** for logs — **server-assigned** (`now-seq`), prevent key collisions.
6. **Cap unbounded lists** — room log stores a fixed-size tail.
7. **No silent branching** — every meaningful state transition emits `state:update`.
8. **Name normalization & bounds** — trim, shorten, default (“Player”).
9. **Dealer actions gated** — e.g., only dealer can deal.
10. **Separation of concerns** — sockets are modular and focused.

---

## Known Omissions (intentional)
- Strict rule validation (turn order, runs, 15s/31 scoring, pegging legality)
- Auto scoring of hands/crib
- Accounts/persistence
- **Reconnect polish** (left out of this artifact by request)

---

## Next Step: **Pegboard UI**
We’re ready to move from mechanics to visuals.

### Scope for Pegboard (MVP)
- Linear track (0–121) with tick marks (0, 30, 60, 90, 121)
- 2–4 lanes (one per seat), **two pegs per player** (front/back) mapped to their score
- Basic movement animation when a score changes
- Dealer indicator near lane label

### Micro-steps to ship it
1. **Data mapping:** transform `players[].score` → peg positions.
2. **Render track:** simple SVG/Canvas/DOM track with tick labels.
3. **Render pegs:** colored pegs per seat; place at score; dual peg spacing.
4. **Animate:** small translate animation on score updates.
5. **Polish:** highlight dealer lane; responsive sizes; dark-theme contrast.

---

## Process Note
We are building this project in **micro steps**.  
Each step should be small, testable, and integrated before moving on.  
We will **not jump ahead** or take on too many steps at once — this ensures stability, clarity, and easier debugging as we grow the codebase.

