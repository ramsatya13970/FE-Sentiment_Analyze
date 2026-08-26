import React from "react";
import { C } from "../theme";

export default function SettingsBar({ apiBase, setApiBase, locationId, setLocationId, onLoad, loading }) {
  return (
    <div
      style={{
        background: "#0E1626",
        borderBottom: `1px solid ${C.panelBorder}`,
        padding: "14px 28px",
        display: "flex",
        gap: 10,
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <input
        className="cx-input"
        style={{ width: 260 }}
        placeholder="API base URL, e.g. https://api.example.com"
        value={apiBase}
        onChange={(e) => setApiBase(e.target.value)}
      />
      <input
        className="cx-input"
        style={{ width: 300 }}
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
