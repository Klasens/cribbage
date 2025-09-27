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

