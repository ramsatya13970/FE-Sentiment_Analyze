import React from "react";
import { C } from "../../theme";

export default function FlowStep({ title, sub, color, bg, arrow }) {
  return (
    <>
      <div
        style={{
          flex: 1,
          minWidth: 160,
          background: bg,
          border: `1px solid ${color}88`,
          borderRadius: 10,
          padding: "22px 16px",
          textAlign: "center",
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{title}</div>
        <div style={{ fontSize: 12, color: C.textDim, marginTop: 6 }}>{sub}</div>
      </div>
      {arrow && <div style={{ color: C.textDim, fontSize: 18, alignSelf: "center", padding: "0 4px" }}>→</div>}
    </>
  );
}
