// client/src/hooks/useSize.js
import { useEffect, useState } from "react";

/**
 * Observe element size via ResizeObserver.
 * Returns last observed { width, height } (integers).
 */
export function useSize(ref) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref?.current;
    if (!el) return;

    let frame = null;

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      const cr = entry.contentRect;
      // Debounce into rAF to avoid layout thrash
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const w = Math.max(0, Math.floor(cr.width));
        const h = Math.max(0, Math.floor(cr.height));
        setSize((prev) => {
          if (prev.width === w && prev.height === h) return prev;
          return { width: w, height: h };
        });
      });
    });

    ro.observe(el);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, [ref]);

  return size;
}

