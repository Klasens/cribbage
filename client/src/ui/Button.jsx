import React from "react";

export default function Button({
  as: As = "button",
  variant = "default", // default | subtle | primary | danger
  size = "md", // sm | md
  disabled = false,
  style,
  ...rest
}) {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    cursor: disabled ? "not-allowed" : "pointer",
    userSelect: "none",
    borderRadius: "var(--r-sm)",
    border: "1px solid transparent",
    fontSize: size === "sm" ? 13 : 14,
    fontWeight: 600,
    padding: size === "sm" ? "6px 10px" : "8px 12px",
    transition: "border-color 150ms, background-color 150ms, color 150ms, opacity 150ms",
    opacity: disabled ? 0.6 : 1,
    background: "var(--c-bg-soft)",
    color: "var(--c-text)",
    borderColor: "var(--c-border)",
  };

  if (variant === "primary") {
    base.background = "var(--c-primary)";
    base.color = "var(--c-primary-ink)";
    base.borderColor = "transparent";
  } else if (variant === "subtle") {
    base.background = "transparent";
    base.borderColor = "var(--c-border)";
  }

  return <As disabled={disabled} style={{ ...base, ...style }} {...rest} />;
}

