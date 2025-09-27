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

## Build Rules (we’re following these)
1. **Micro-steps only** — land small, testable changes end-to-end.
2. **Trust-first UX** — minimal enforcement; avoid heavy rules engine.
3. **Server is the source of truth** — client is a renderer/emitter.
4. **File Writing** — anytime you touch a file, write the file out in full omitting nothing.
5. **Test Path** — after making changes, outline how we test the changes in the UI.

---

## Next Step: **Pegboard UI**
We’re ready to move from mechanics to visuals.

### Scope for Pegboard (MVP)
- Linear track (0–121) with tick marks (0, 30, 60, 90, 121)
- 2–4 lanes (one per seat), **two pegs per player** (front/back) mapped to their score
- Basic movement animation when a score changes
- Dealer indicator near lane label

