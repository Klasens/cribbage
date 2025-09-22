// client/src/hooks/internal/useRoomState.js
import { useEffect, useMemo, useState } from "react";
import { onStateUpdate, api } from "../../lib/socket";
import { loadSeat, saveSeat } from "../../lib/storage";

export function useRoomState() {
  const [state, setState] = useState(() => window.lastState || null);
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const [mySeatId, setMySeatId] = useState(null);
  const [pendingSelfAssign, setPendingSelfAssign] = useState(false);

  // Restore after refresh/HMR
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

  // Server state subscription
  useEffect(() => {
    const off = onStateUpdate(({ state: s }) => {
      setState(s);
      if (pendingSelfAssign && s?.players?.length) {
        const last = s.players[s.players.length - 1];
        const seatId = last?.seatId ?? null;
        setMySeatId(seatId);
        setPendingSelfAssign(false);
        saveSeat(s.roomId, { seatId, name });
      }
    });
    return off;
  }, [pendingSelfAssign, name]);

  // Prefill when typing a known roomId
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

  // Auto-rejoin
  useEffect(() => {
    if (!joined && roomId && name && Number.isInteger(mySeatId)) {
      api.rejoin(roomId, mySeatId, name);
    }
  }, [joined, roomId, name, mySeatId]);

  return {
    state,
    setState,
    roomId,
    setRoomId,
    name,
    setName,
    mySeatId,
    setMySeatId,
    pendingSelfAssign,
    setPendingSelfAssign,
    joined,
  };
}
