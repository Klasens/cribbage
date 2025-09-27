import React from "react";

export default function Chip({ children, tone = "default", style, ...rest }) {
  const colors = {
    default: {
      bg: "rgba(255,255,255,0.06)",
      bd: "var(--c-border)",
      ink: "var(--c-text)",
    },
    success: {
      bg: "var(--c-success-bg)",
      bd: "rgba(168,224,109,0.35)",
      ink: "var(--c-success-ink)",
    },
  }[tone];

  const base = {
    display: "inline-flex",
    alignItems: "center",
    padding: "2px 8px",
    borderRadius: "var(--r-xs)",
    background: colors.bg,
    border: `1px solid ${colors.bd}`,
    color: colors.ink,
    fontSize: 12,
    fontWeight: 700,
    whiteSpace: "nowrap",
  };

  return (
    <span style={{ ...base, ...style }} {...rest}>
      {children}
    </span>
  );
}

