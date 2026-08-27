import React from "react";
import { C } from "../../theme";
import "./KpiCard.css";

export default function KpiCard({ label, value, sub, color, bg }) {
  return (
    <div
      className="kpi-card"
      style={{
        "--kpi-bg": bg,
        "--kpi-color": color,
        "--kpi-color-border": `${color}77`,
        "--text-color": C.text,
        "--text-dim-color": C.textDim,
      }}
    >
      <div className="kpi-card__label">{label}</div>
      <div className="kpi-card__value">{value}</div>
      {sub && <div className="kpi-card__sub">{sub}</div>}
    </div>
  );
}
