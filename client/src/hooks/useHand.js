// client/src/hooks/useHand.js
import { useEffect, useState } from "react";
import { onYourHand } from "../lib/socket";

export function useHand() {
  const [hand, setHand] = useState([]);

  useEffect(() => {
    const off = onYourHand(({ cards }) => {
      setHand(Array.isArray(cards) ? cards : []);
      // keep the dev convenience around
      window.myHand = cards;
    });
    return off;
  }, []);

  const clearHand = () => setHand([]);

  return { hand, clearHand };
}
