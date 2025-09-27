import React from "react";

export default function Card({ as: As = "div", style, ...rest }) {
  const base = {
    background: "var(--c-bg-soft)",
    border: "1px solid var(--c-border)",
    borderRadius: "var(--r-md)",
    boxShadow: "var(--shadow-1)",
    padding: "12px",
  };
  return <As style={{ ...base, ...style }} {...rest} />;
}

