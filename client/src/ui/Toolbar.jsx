// client/src/ui/Toolbar.jsx
import React from "react";
import "./toolbar.css";

export default function Toolbar({ children, className = "" }) {
  const cls = ["ui-toolbar", className].filter(Boolean).join(" ");
  return <div className={cls}>{children}</div>;
}

