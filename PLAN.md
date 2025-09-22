# Cribbage Web MVP – Plan

## Goal
A family-friendly, trust-based cribbage web app. Minimal rules enforcement; fast to build and easy to host.

## MVP Scope
- 2–4 players join a room via link + display name.
- Manual scoring: peg via +1/+2/+3/+N.
- Deal 6 each; each player selects 2 to crib.
- Auto-step when crib has 4 cards: lock → move to crib pile → flip starter card.
- Shared pegging counter to 31 (manual reset).
- Dealer marker & “Next Hand” (rotate dealer, keep scores).
- No accounts, no persistence, no strict validation.

## Tech Overview
- **Frontend:** React + Vite + Tailwind (simple, fast).
- **Realtime:** Socket.IO.
- **Backend:** Node.js (Express or Fastify) + Socket.IO, in-memory per-room state.
- **Deploy (simple):** single Node service on Render/Railway/Fly (serves client + websockets).

## Build Strategy (inside-out)
1. Realtime backbone + live state renderer.
2. Manual score controls (+1/+2/+3/+N).
3. Deal & private hands (text cards).
4. Crib flow auto-step + starter card.
5. Pegging counter to 31 (manual).
6. Dealer rotation & Next Hand.
7. Light polish (invites, toasts, basic reconnect).

## Data Model (minimal)
```ts
type Seat = 'P1'|'P2'|'P3'|'P4';
type Card = { r: 1|2|...|13; s: 'C'|'D'|'H'|'S'; id: string };
type Phase = 'Lobby'|'Deal'|'Discard'|'Cut'|'Peg'|'Show'|'End';

type Player = { id: string; name: string; seat: Seat; connected: boolean };
type GameState = {
  id: string; phase: Phase; dealer: Seat;
  players: Player[];
  deck: Card[]; hands: Record<Seat, Card[]>;
  crib: Card[]; cribLocked: boolean; cutCard?: Card;
  pegCount: Record<Seat, number>;
  runCount: number; // 0–31 manual counter
  log: { t:number; msg:string }[];
};
````

## Socket Events (sketch)

**Client → Server**  
- `room:create`  
- `room:join`  
- `player:rename`  
- `host:deal`  
- `player:cribSelect`  
- `host:flipStarter`  
- `peg:add`  
- `run:add`  
- `run:reset`  
- `host:nextHand`  

**Server → Client**  
- `state:update`  
- `error`  
- `toast`  

---

## Acceptance Checklist
- Two tabs join same room and see each other  
- Scoreboard pegging syncs instantly  
- Deal shows private hands per tab  
- Each selects 2 to crib → auto-step moves crib + shows starter  
- Shared “count to 31” works; reset works  
- Dealer rotates on Next Hand; scores persist across hands  

---

## Deployment (Option A: single service)
1. Build client → copy to `server/public`  
2. Node serves static + Socket.IO on same origin  
3. Deploy to **Render/Railway**:  
   - Set `PORT`  
   - Enable websockets  
   - Add subdomain  
4. Share URL with family  

---

## What We’re Skipping (for speed)
- Rules enforcement, auto-scoring hands/crib  
- Accounts/auth/persistence  
- Fancy pegboard; animations; mobile polish  

