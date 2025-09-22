// client/src/hooks/useGameClient.js
import { useEffect, useMemo, useState } from "react";
import { api, onStateUpdate } from "../lib/socket";
import { loadSeat, saveSeat, clearSeat } from "../lib/storage";

export function useGameClient() {
  const [state, setState] = useState(() => window.lastState || null);
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const [mySeatId, setMySeatId] = useState(null);
  const [pendingSelfAssign, setPendingSelfAssign] = useState(false);

  // Restore seat/name if we already have a room in state (HMR/refresh)
  useEffect(() => {
    if (state?.roomId) {
      const saved = loadSeat(state.roomId);
      if (saved) {
        const { seatId, name: savedName } = saved;
        if (Number.isInteger(seatId)) setMySeatId(seatId);
        if (savedName && !name) setName(savedName);
        if (!roomId) setRoomId(state.roomId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Subscribe to server state
  useEffect(() => {
    const off = onStateUpdate(({ state }) => {
      setState(state);
      if (pendingSelfAssign && state?.players?.length) {
        const last = state.players[state.players.length - 1];
        const seatId = last?.seatId ?? null;
        setMySeatId(seatId);
        setPendingSelfAssign(false);
        saveSeat(state.roomId, { seatId, name });
      }
    });
    return off;
  }, [pendingSelfAssign, name]);

  // Prefill when user types a known roomId
  useEffect(() => {
    if (!roomId) return;
    const saved = loadSeat(roomId);
    if (saved) {
      const { seatId, name: savedName } = saved;
      if (mySeatId == null && Number.isInteger(seatId)) setMySeatId(seatId);
      if (!name && savedName) setName(savedName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  const joined = useMemo(() => {
    if (!state?.roomId || !state?.players) return false;
    return state.players.some((p) => p.seatId === mySeatId);
  }, [state, mySeatId]);

  const roomFull = useMemo(() => (state?.players?.length ?? 0) >= 4, [state]);

  // Auto-rejoin: when we have stored room + seat + name and we are not joined
  useEffect(() => {
    if (!joined && roomId && name && Number.isInteger(mySeatId)) {
      api.rejoin(roomId, mySeatId, name);
    }
  }, [joined, roomId, name, mySeatId]);

  // Actions
  const create = () => {
    if (!roomId || !name) return;
    api.create(roomId, name);
    setPendingSelfAssign(true);
  };

  const join = () => {
    if (!roomId || !name) return;
    api.join(roomId, name);
    setPendingSelfAssign(true);
  };

  const peg = (delta) => {
    if (!state?.roomId || mySeatId == null) return;
    api.peg(state.roomId, mySeatId, delta);
  };

  const pegN = () => {
    const raw = prompt("Add how many points?");
    const n = Number(raw);
    if (Number.isFinite(n) && n !== 0) peg(n);
  };

  const resetLocal = () => {
    if (!roomId) return;
    clearSeat(roomId);
    location.reload();
  };

  return {
    // state
    state,
    roomId,
    setRoomId,
    name,
    setName,
    mySeatId,

    // derived
    joined,
    roomFull,

    // actions
    create,
    join,
    peg,
    pegN,
    resetLocal,
  };
}
