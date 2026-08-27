import React from "react";
import { C } from "../../theme";
import "./Panel.css";

export default function Panel({ title, right, children, style }) {
  return (
    <div
      className="panel"
      style={{
        "--panel-color": C.panel,
        "--panel-border-color": C.panelBorder,
        "--text-color": C.text,
        ...style,
      }}
    >
      <div className="panel__header">
        <div className="panel__title">{title}</div>
        {right}
      </div>
      {children}
    </div>
  );
}
