import React from "react";
import { C } from "../theme";

const NAV_ITEMS = ["Overview", "Sentiment", "Trends", "Reports", "Settings"];

export default function Header({ tab, setTab, showSettings, setShowSettings }) {
  return (
    <header
      style={{
        background: C.headerBlue,
        padding: "16px 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 16, color: "#fff", display: "flex", alignItems: "center", gap: 8 }}>
        AI Customer Experience Intelligence Platform
      </div>
      <nav style={{ display: "flex", gap: 22, fontSize: 13.5, alignItems: "center", flexWrap: "wrap" }}>
        {NAV_ITEMS.map((item) => {
          const key = item.toLowerCase();
          const isActive = tab === key;
          const clickable = key === "overview" || key === "sentiment";
          return (
            <span
              key={item}
              onClick={() => {
                if (key === "settings") setShowSettings((s) => !s);
                else if (clickable) setTab(key);
              }}
              style={{
                color: isActive ? "#F5A623" : "rgba(255,255,255,0.85)",
                borderBottom: isActive ? "2px solid #F5A623" : "2px solid transparent",
                paddingBottom: 4,
                cursor: clickable || key === "settings" ? "pointer" : "default",
                opacity: clickable || key === "settings" ? 1 : 0.55,
              }}
            >
              {item}
            </span>
          );
        })}
      </nav>
    </header>
  );
}
