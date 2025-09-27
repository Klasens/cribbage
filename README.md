# Cribbage

Minimal, trust-based cribbage you can play in a browser.  
No accounts. Manual scoring. Fast to run and share.

---

## Features
- 2–4 players join a room by ID and display name
- Dealer deals 6 cards to each player; each player selects 2 to the crib
- Crib locks at 4 cards; a starter (cut) card flips automatically
- Manual scoring: +1 / +2 / +3 / +N
- Pegging run (manual): show a card to add its value to a shared 0–31 count
- Dealer marker, “Next Hand” rotation, winner detection at 121
- Lightweight room log; basic reconnect by seat/name

---

## Tech Stack
- **Frontend:** React + Vite  
- **Realtime:** Socket.IO  
- **Backend:** Node.js (Express) with in-memory per-room state  
- **Deploy:** Single Node service that serves the built client and Socket.IO  

---

## Quick Start

### Prerequisites
- Node.js 18+ and npm

### Install & Run (dev)
See **Commands** below.

### Production build
See **Commands** below.

---

## Scripts
- `npm run dev` — run server + client in development  
- `npm run build` — build the client bundle  
- `npm start` — start the Node server (serves built client if present)  

---

## Configuration
The server listens on `PORT` (default `3000`). When serving the built client
from the same origin, the Socket.IO client can connect with the default
`io()` call and no manual URL.

---

## Deploy Notes
- Use a single service (Node) that serves both static assets and Socket.IO.
- Ensure websockets are enabled on your platform.
- For horizontal scaling later, plan for sticky sessions and a Socket.IO
  adapter (e.g., Redis) to fan out events across instances.

---

## Verify (manual test path)
1. Open two browser tabs.  
2. In Tab A: enter a room ID and display name, then **Create**.  
3. In Tab B: enter the same room ID and a different display name, then **Join**.  
4. As the dealer (seat 0 initially), click **Deal 6**.  
5. In each tab, select exactly two cards and click **Send 2 to crib**.  
6. Observe crib count advance to **4/4**, crib locks, starter card appears.  
7. In either tab, click **Show** on a card to advance the pegging count;  
   click **Reset** to set the count back to 0 (trust-based).  
8. Use **+1/+2/+3/+N** to update scores; confirm scoreboard pegs move.  
9. After a winner is declared (>=121), **New Game** becomes available.  

---

## License
ISC

---

## Commands
See package.json scripts.

