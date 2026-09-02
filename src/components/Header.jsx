import React from "react";
import { C } from "../theme";
import "./Header.css";

const NAV_ITEMS = ["Overview", "Sentiment", "Reviews", "Trends", "Reports", "Settings"];

export default function Header({ tab, setTab, showSettings, setShowSettings, locations = [], locationId, setLocationId }) {
  return (
    <header className="app-header" style={{ "--header-color": C.headerBlue }}>
      <div className="app-header__brand-row">
        <div className="app-header__brand">AI Customer Experience Intelligence Platform</div>

        <select
          className="app-header__location-select"
          value={locationId || ""}
          onChange={(e) => setLocationId(e.target.value)}
          disabled={locations.length === 0}
          aria-label="Select location"
        >
          {locations.length === 0 ? (
            <option value="">Select location</option>
          ) : (
            locations.map((location) => (
              <option key={location.location_id} value={location.location_id}>
                {location.name}
              </option>
            ))
          )}
        </select>
      </div>

      <nav className="app-header__nav">
        {NAV_ITEMS.map((item) => {
          const key = item.toLowerCase();
          const isSettingsItem = key === "settings";
          const isActive = tab === key;
          const clickable = ["overview", "sentiment", "reviews"].includes(key);
          return (
            <span
              key={item}
              onClick={() => {
                if (!isSettingsItem && clickable) setTab(key);
              }}
              className={`app-header__item${isActive ? " app-header__item--active" : ""}${
                isSettingsItem || clickable ? " app-header__item--clickable" : " app-header__item--inactive"
              }`}
              aria-disabled={isSettingsItem}
              style={isSettingsItem ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
            >
              {item}
            </span>
          );
        })}
      </nav>
    </header>
  );
}
