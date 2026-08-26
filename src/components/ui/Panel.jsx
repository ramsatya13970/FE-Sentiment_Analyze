import React from "react";
import { C } from "../../theme";

export default function Panel({ title, right, children, style }) {
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.panelBorder}`, borderRadius: 12, padding: 20, ...style }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontWeight: 700, fontSize: 14.5, color: C.text }}>{title}</div>
        {right}
      </div>
      {children}
    </div>
  );
}
