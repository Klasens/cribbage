import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./ui/tokens.css";
import { socket, api, EVT, onStateUpdate, onYourHand } from "./lib/socket";
import { UIProvider } from "./context/UIContext";

// Diagnostics
socket.on("connect", () => console.log("🔌 Connected to server:", socket.id));
socket.on("disconnect", () => console.log("🔌 Disconnected"));

// Keep latest state handy for dev
onStateUpdate(({ state }) => {
  console.log("📥 state:update", state);
  window.lastState = state;
});

// Private hand
onYourHand(({ cards }) => {
  console.log("🃏 your hand:", cards.join(" "));
  window.myHand = cards;
});

// Expose for quick console testing
window.socket = socket;
window.api = api;
window.EVT = EVT;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UIProvider>
      <App />
    </UIProvider>
  </React.StrictMode>
);

