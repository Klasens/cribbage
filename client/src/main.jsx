import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { io } from "socket.io-client";

// ─── Socket connection ────────────────────────────────────────────────────────
const socket = io("http://localhost:3000");

// For now, keep event names local (we'll unify with /shared soon)
const EVT = {
  ROOM_CREATE: "room:create",
  ROOM_JOIN: "room:join",
  STATE_UPDATE: "state:update",
  PEG_ADD: "peg:add",
};

// Minimal diagnostics
socket.on("connect", () => {
  console.log("🔌 Connected to server:", socket.id);
});
socket.on("disconnect", () => {
  console.log("🔌 Disconnected");
});

// Listen for authoritative state from the server
socket.on(EVT.STATE_UPDATE, ({ state }) => {
  console.log("📥 state:update", state);
  // Expose the latest state for quick inspection in DevTools
  window.lastState = state;
});

// ─── Console helpers (for manual testing before UI exists) ───────────────────
/**
 * window.api.create("room123", "Alice")
 * window.api.join("room123", "Bob")
 * window.api.peg("room123", 0, 2)
 */
window.socket = socket;
window.api = {
  create: (roomId, displayName = "Player") =>
    socket.emit(EVT.ROOM_CREATE, { roomId, displayName }),
  join: (roomId, displayName = "Player") =>
    socket.emit(EVT.ROOM_JOIN, { roomId, displayName }),
  peg: (roomId, seatId, delta) =>
    socket.emit(EVT.PEG_ADD, { roomId, seatId, delta }),
};

// ─── Render React scaffold ───────────────────────────────────────────────────
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

