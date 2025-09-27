import React from "react";

export default function Toolbar({ children, style }) {
  return (
    <div
      style={{
        marginTop: 12,
        display: "flex",
        gap: 8,
        flexWrap: "wrap",
        alignItems: "center",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

