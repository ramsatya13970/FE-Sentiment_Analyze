import React from "react";
import { C } from "../theme";
import "./Header.css";

const NAV_ITEMS = ["Overview", "Sentiment", "Trends", "Reports", "Settings"];

export default function Header({ tab, setTab, showSettings, setShowSettings }) {
  return (
    <header className="app-header" style={{ "--header-color": C.headerBlue }}>
      <div className="app-header__brand">
        AI Customer Experience Intelligence Platform
      </div>
      <nav className="app-header__nav">
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
              className={`app-header__item${isActive ? " app-header__item--active" : ""}${
                clickable || key === "settings" ? " app-header__item--clickable" : " app-header__item--inactive"
              }`}
            >
              {item}
            </span>
          );
        })}
      </nav>
    </header>
  );
}
