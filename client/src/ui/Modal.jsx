import React from "react";
import Card from "./Card";
import Button from "./Button";

export default function Modal({
  open,
  onClose,
  title,
  width = 680,
  children,
}) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
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
          <strong style={{ fontSize: 16 }}>{title}</strong>
          <Button
            onClick={onClose}
            style={{ marginLeft: "auto" }}
            size="sm"
            variant="subtle"
            title="Close"
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

