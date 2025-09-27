// client/src/ui/Card.jsx
import React from "react";
import "./card.css";

export default function Card({ as: As = "div", className = "", style, ...rest }) {
  const classes = ["ui-card", className].filter(Boolean).join(" ");
  return <As className={classes} style={style} {...rest} />;
}

