# Cribbage Web MVP – Plan

## Goal
A family-friendly, trust-based cribbage web app. Minimal rules enforcement; fast to build and easy to host.

## Current Status (MVP-in-progress)
- Realtime backbone with rooms and live state  
- Create, Join, and Rejoin (seat and name restored from local storage)  
- Manual scoring with +1, +2, +3, and custom increment per seat  
- Dealer-only dealing: six cards privately sent to each player  
- Each player selects two cards to the crib; server collects and tracks progress  
- When the crib reaches four cards, the crib locks and a starter card automatically flips  
- UI shows each player’s private hand and public room state (crib progress, starter card)

## MVP Scope (target)
- Two to four players join a room with a display name  
- Manual scoring via per-seat buttons  
- Deal six cards each; each player selects two to send to the crib  
- Auto-step when crib has four cards: lock the crib and flip a starter card  
- Pegging handled manually: players show a card and increment a shared count toward thirty-one  
- Dealer marker and a Next Hand action to rotate dealer and keep scores  
- No accounts, no persistence, and no strict rule validation

## Tech Overview
- **Frontend:** React with Vite  
- **Realtime:** Socket.IO  
- **Backend:** Node.js with Socket.IO and in-memory per-room state  
- **Deploy:** single Node service that serves the client app and websockets on the same origin

## Build Strategy (inside-out)
1. Realtime backbone and live state renderer (complete)  
2. Manual score controls for per-seat pegging totals (complete)  
3. Dealing and private hands as text cards (complete)  
4. Crib flow with auto-lock and starter card flip (complete)  
5. **Pegging (manual show):** shared count to thirty-one driven by cards shown (**next**)  
6. Dealer rotation and Next Hand control  
7. Light polish (invites, toasts, basic reconnect behavior)

## Data Model (high level)
- Seats are numbered zero through three  
- A player has a seat identifier, name, and score  
- Public state includes the room identifier, list of players, dealer seat, crib progress count, crib locked flag, and the starter card when present  
- Server room internals (not exposed to clients) include private hands per seat, a remaining deck after dealing, the crib pile, and a set of seats that have already submitted to the crib

## Socket Events (current)

**Client → Server**  
- Create room with room identifier and display name  
- Join room with room identifier and display name  
- Rejoin room with room identifier, seat identifier, and display name  
- Per-seat manual score increment  
- Dealer requests a deal for the room  
- Player submits exactly two cards to the crib  

**Server → Client**  
- Room state updates  
- Private hand messages to the owning seat

## Acceptance Checklist
- Two tabs can join the same room and see each other  
- Manual score changes appear instantly across clients  
- Dealing shows each player their private hand  
- Each player submits two crib cards; when total reaches four, the crib locks and the starter card is visible  
- **Pegging show-card flow advances a shared count to thirty-one and can be reset (next)**  
- Dealer rotates on Next Hand while scores persist across hands

## Deployment (single service)
- Build the client so it can be served by the Node server  
- Serve static assets and Socket.IO from the same origin  
- Deploy to a simple host and ensure websockets are enabled  
- Share the deployment URL

## What We’re Skipping (for speed)
- Full rules enforcement or automatic hand/crib scoring  
- Accounts or persistent storage  
- Rich animations, a graphical pegboard, or mobile polish

