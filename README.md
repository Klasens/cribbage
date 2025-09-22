# Cribbage (Family MVP)

Minimal, trust-based cribbage you can play in a browser.  
No accounts. Manual scoring. Fast to run and share.

---

## Features (MVP)
- 2–4 players join via link + name  
- Deal 6 cards to each player; select 2 to crib  
- Auto-step when crib full: crib locks, starter card flips  
- Manual scoring: +1 / +2 / +3 / +N buttons  
- Shared count-to-31 with Reset (manual control)  
- Dealer marker + Next Hand (rotate dealer, keep scores)  

---

## Tech
- Frontend: React + Vite + Tailwind  
- Backend: Node.js + Socket.IO  
- Deploy: single service (serves client + websockets)  

---

## Local Development
1. Install dependencies: `pnpm install` (or `npm install` / `yarn install`)  
2. Run dev mode: `pnpm dev` (runs server and client together)  
3. Open two browser tabs at the dev URL to test multiplayer  

---

## Scripts (suggested)
- `pnpm dev` – run server and client in dev mode with proxy  
- `pnpm build` – build client and copy to `server/public`  
- `pnpm start` – run Node server (serves built client)  

---

## Deploy (simple)
1. Build client (`pnpm build`) so it’s served by Node  
2. Deploy Node app to Render or Railway  
3. Set `PORT` environment variable  
4. Ensure websockets are enabled (default is fine)  
5. App serves both static client and Socket.IO on the same origin  
6. Share the generated URL with family  

---

## Roadmap (short)
- Toast log (e.g., “Rob +2”, “Cut 5♣”)  
- Basic reconnect (same name reclaims seat)  
- Optional: save finished game summaries  
- Optional: partner rules for 3–4 players  

---

## License
Familyware 💛 — built for fun, not profit

