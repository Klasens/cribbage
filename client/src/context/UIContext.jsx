import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [openId, setOpenId] = useState(null);
  const openModal = useCallback((id) => setOpenId(id), []);
  const closeModal = useCallback(() => setOpenId(null), []);
  const isOpen = useCallback((id) => openId === id, [openId]);

  const value = useMemo(
    () => ({ openId, openModal, closeModal, isOpen }),
    [openId, openModal, closeModal, isOpen]
  );

  // ESC to close
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeModal]);

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within a UIProvider");
  return ctx;
}

