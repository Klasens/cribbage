// client/src/hooks/useGameClient.js
import { useMemo } from "react";
import { useRoomState } from "./internal/useRoomState";
import { makeActions } from "./internal/useActions";

export function useGameClient() {
  const {
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
  } = useRoomState();

  const roomFull = useMemo(() => (state?.players?.length ?? 0) >= 4, [state]);
  const isDealer = useMemo(() => {
    if (state?.dealerSeat == null) return false;
    return mySeatId === state.dealerSeat;
  }, [state, mySeatId]);

  const actions = makeActions({
    state,
    roomId,
    setRoomId,
    name,
    setName,
    mySeatId,
    setMySeatId,
    pendingSelfAssign,
    setPendingSelfAssign,
    setState,
  });

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
    isDealer,

    // actions
    ...actions,
  };
}
