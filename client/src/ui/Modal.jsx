import React, { useEffect, useMemo, useRef } from "react";
import Card from "./Card";
import Button from "./Button";

export default function Modal({
  open,
  onClose,
  title,
  width = 680,
  children,
}) {
  const dialogRef = useRef(null);
  const previouslyFocused = useRef(null);
  const titleId = useMemo(() => `modal-title-${Math.random().toString(36).slice(2)}`, []);

  useEffect(() => {
    if (!open) return;

    // Save focus to restore on close
    previouslyFocused.current = document.activeElement;

    const root = dialogRef.current;
    if (!root) return;

    // Focus the first focusable element within the dialog
    const focusables = root.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusables[0];
    if (first && typeof first.focus === "function") first.focus();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose?.();
        return;
      }
      if (e.key !== "Tab") return;

      // Focus trap
      const list = Array.from(
        root.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);

      if (list.length === 0) {
        e.preventDefault();
        return;
      }

      const firstEl = list[0];
      const lastEl = list[list.length - 1];
      const active = document.activeElement;

      if (e.shiftKey) {
        if (active === firstEl || !root.contains(active)) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (active === lastEl || !root.contains(active)) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };

    root.addEventListener("keydown", handleKeyDown);
    return () => {
      root.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  // Restore focus to the opener after close
  useEffect(() => {
    if (open) return;
    const el = previouslyFocused.current;
    if (el && typeof el.focus === "function") {
      // slight delay to avoid race with unmounts
      setTimeout(() => el.focus(), 0);
    }
  }, [open]);

  if (!open) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={handleBackdropClick}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <Card
        as="div"
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: `min(${width}px, 92vw)`,
          maxHeight: "80vh",
          overflow: "hidden",
          background: "var(--c-bg-elev)",
          boxShadow: "var(--shadow-2)",
          padding: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 14px",
            borderBottom: "1px solid var(--c-border)",
          }}
        >
          <strong id={titleId} style={{ fontSize: 16 }}>
            {title}
          </strong>
          <Button
            onClick={onClose}
            style={{ marginLeft: "auto" }}
            size="sm"
            variant="subtle"
            title="Close (Esc)"
            aria-label="Close dialog"
          >
            Close
          </Button>
        </div>

        <div style={{ padding: 12, overflowY: "auto", maxHeight: "calc(80vh - 56px)" }}>
          {children}
        </div>
      </Card>
    </div>
  );
}

