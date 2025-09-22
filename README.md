# Cribbage (Family MVP)

Minimal, trust-based cribbage you can play in a browser.  
No accounts. Manual scoring. Fast to run and share.

---

## Features (current)
- Two to four players join via link and display name  
- Dealer deals six cards to each player; each player selects two to the crib  
- When the crib reaches four cards, the crib locks and a starter card flips automatically  
- Manual scoring with per-seat buttons for quick increments  
- Rejoin flow restores seat and name from local storage  

> Pegging (count-to-31) is up next — we’ll keep it manual: players show a card to add its value to a shared count.

---

## Tech
- Frontend: React with Vite  
- Backend: Node.js with Socket.IO  
- Deployment: single service that serves both the client and websockets  

---

## Local Development
- Install dependencies  
- Run the development servers for client and server  
- Open two browser tabs, create a room in one, and join from the other  
- As the dealer, deal six cards; each player selects two to the crib  
- When the crib hits four cards, it locks and the starter card appears  

---

## Scripts
- Development script to run server and client together  
- Build script to compile the client  
- Start script to run the Node server (serving the built client if present)  

---

## Roadmap (short)
- **Pegging (manual):** show-card UX and a shared count to thirty-one  
- Dealer marker and Next Hand rotation  
- Toast-style room log (short messages like “Rob +2” or “Cut 5♣”)  
- Reconnect polish  

---

## License
Familyware 💛 — built for fun, not profit

