import React from "react";
import { C } from "../../theme";
import "./FlowStep.css";

export default function FlowStep({ title, sub, color, bg, arrow }) {
  return (
    <>
      <div
        className="flow-step"
        style={{
          "--flow-bg": bg,
          "--flow-color-border": `${color}88`,
          "--text-color": C.text,
          "--text-dim-color": C.textDim,
        }}
      >
        <div className="flow-step__title">{title}</div>
        <div className="flow-step__sub">{sub}</div>
      </div>
      {arrow && <div className="flow-step__arrow">→</div>}
    </>
  );
}
