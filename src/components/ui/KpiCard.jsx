import React from "react";
import { C } from "../../theme";

export default function KpiCard({ label, value, sub, color, bg }) {
  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${color}77`,
        borderRadius: 10,
        padding: "16px 18px",
        flex: "1 1 220px",
        minWidth: 200,
      }}
    >
      <div style={{ fontSize: 12, color, fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 700, color: C.text, marginTop: 8, letterSpacing: -0.5 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 12, color: C.textDim, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}
