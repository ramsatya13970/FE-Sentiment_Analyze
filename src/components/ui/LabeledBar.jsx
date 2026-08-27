import React from "react";
import "./LabeledBar.css";

export default function LabeledBar({ label, pct, color }) {
  return (
    <div className="labeled-bar" style={{ "--bar-color": color, "--bar-width": `${pct}%` }}>
      <div className="labeled-bar__header">
        <span className="labeled-bar__label">{label}</span>
        <span className="labeled-bar__value">{pct}%</span>
      </div>
      <div className="labeled-bar__track">
        <div className="labeled-bar__fill" />
      </div>
    </div>
  );
}
