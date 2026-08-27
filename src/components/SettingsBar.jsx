import React from "react";
import { C } from "../theme";
import "./SettingsBar.css";

export default function SettingsBar({ apiBase, setApiBase, locationId, setLocationId, onLoad, loading }) {
  return (
    <div className="settings-bar" style={{ "--panel-border-color": C.panelBorder }}>
      <input
        className="cx-input settings-bar__api-input"
        placeholder="API base URL, e.g. https://api.example.com"
        value={apiBase}
        onChange={(e) => setApiBase(e.target.value)}
      />
      <input
        className="cx-input settings-bar__location-input"
        placeholder="location_id"
        value={locationId}
        onChange={(e) => setLocationId(e.target.value)}
      />
      <button className="cx-btn" onClick={onLoad} disabled={loading}>
        {loading ? "Loading…" : "Load insights"}
      </button>
    </div>
  );
}
