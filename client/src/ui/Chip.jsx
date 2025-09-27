// client/src/ui/Chip.jsx
import React from "react";
import "./chip.css";

export default function Chip({ children, tone = "default", className = "", style, ...rest }) {
  const classes = ["ui-chip", `ui-chip--${tone}`, className].filter(Boolean).join(" ");
  return (
    <span className={classes} style={style} {...rest}>
      {children}
    </span>
  );
}

