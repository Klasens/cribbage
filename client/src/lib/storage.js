// client/src/lib/storage.js
const LS_KEY = (roomId) => `cribbage:seat:${roomId}`;

export function loadSeat(roomId) {
  try {
    const raw = localStorage.getItem(LS_KEY(roomId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSeat(roomId, data) {
  try {
    localStorage.setItem(LS_KEY(roomId), JSON.stringify(data));
  } catch {}
}

export function clearSeat(roomId) {
  try {
    localStorage.removeItem(LS_KEY(roomId));
  } catch {}
}

// NEW: clear all cribbage seat entries across rooms
export function clearAllSeats() {
  try {
    const toRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("cribbage:seat:")) toRemove.push(k);
    }
    toRemove.forEach((k) => localStorage.removeItem(k));
  } catch {}
}
