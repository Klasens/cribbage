import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { socket, api, EVT, onStateUpdate } from "./lib/socket";

// Diagnostics
socket.on("connect", () => console.log("🔌 Connected to server:", socket.id));
socket.on("disconnect", () => console.log("🔌 Disconnected"));

// Keep latest state handy for dev
onStateUpdate(({ state }) => {
  console.log("📥 state:update", state);
  window.lastState = state;
});

// Expose for quick console testing (kept for MVP convenience)
window.socket = socket;
window.api = api;
window.EVT = EVT;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

