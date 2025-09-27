// client/src/ui/Modal.jsx
import React, { useEffect, useMemo, useRef } from "react";
import Card from "./Card";
import Button from "./Button";
import "./modal.css";

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
    previouslyFocused.current = document.activeElement;

    const root = dialogRef.current;
    if (!root) return;

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

  useEffect(() => {
    if (open) return;
    const el = previouslyFocused.current;
    if (el && typeof el.focus === "function") {
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
      className="modal__backdrop"
    >
      <Card
        as="div"
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        className="modal__card"
        style={{ width: `min(${width}px, 92vw)` }}
      >
        <div className="modal__header">
          <strong id={titleId} className="modal__title">
            {title}
          </strong>
          <Button
            onClick={onClose}
            className="modal__close"
            size="sm"
            variant="subtle"
            title="Close (Esc)"
            aria-label="Close dialog"
          >
            Close
          </Button>
        </div>

        <div className="modal__body">
          {children}
        </div>
      </Card>
    </div>
  );
}

