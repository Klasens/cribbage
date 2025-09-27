// client/src/ui/Button.jsx
import React from "react";
import "./button.css";

export default function Button({
  as: As = "button",
  variant = "default", // default | subtle | primary | danger
  size = "md", // sm | md
  disabled = false,
  style,
  className = "",
  ...rest
}) {
  const classes = [
    "ui-btn",
    `ui-btn--${variant}`,
    `ui-btn--${size}`,
    disabled ? "is-disabled" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <As disabled={disabled} className={classes} style={style} {...rest} />;
}

