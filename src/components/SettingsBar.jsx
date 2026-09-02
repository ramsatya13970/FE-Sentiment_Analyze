import React from "react";
import { C } from "../theme";
import "./SettingsBar.css";

export default function SettingsBar({
  apiBase,
  setApiBase,
  locationId,
  setLocationId,
  onLoad,
  loading,
  locations,
  locationsLoading,
}) {
  return (
    <div className="settings-bar" style={{ "--panel-border-color": C.panelBorder }}>
      <input
        className="cx-input settings-bar__api-input"
        placeholder="API base URL, e.g. https://api.example.com"
        value={apiBase}
        onChange={(e) => setApiBase(e.target.value)}
      />

      <select
        className="cx-input settings-bar__location-input"
        value={locationId || ""}
        onChange={(e) => setLocationId(e.target.value)}
        disabled={locationsLoading || locations.length === 0}
      >
        {locations.length === 0 ? (
          <option value="">{locationId || "No locations available"}</option>
        ) : (
          locations.map((location) => (
            <option key={location.location_id} value={location.location_id}>
              {location.name}
            </option>
          ))
        )}
      </select>

      <button className="cx-btn" onClick={onLoad} disabled={loading || !locationId}>
        {loading ? "Loading…" : "Load insights"}
      </button>
    </div>
  );
}
