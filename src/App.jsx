import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { C } from "./theme";
// import { SAMPLE_DATA } from "./data/sampleData";
import { fetchInsightsMetrics, fetchLocations, resolveLocationId } from "./lib/api";
import { formatDate } from "./lib/format";
import Header from "./components/Header";
import SettingsBar from "./components/SettingsBar";
import OverviewTab from "./components/OverviewTab";
import SentimentTab from "./components/SentimentTab";
import ReviewsTab from "./components/ReviewsTab";
import "./App.css";

const DEFAULT_LOCATION_ID =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_DEFAULT_LOCATION_ID) ||
  "7a2c3a49-c34c-4ba9-b35f-c583768c8487";
const DEFAULT_API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE_URL) || "";

export default function App() {
  const [apiBase, setApiBase] = useState(DEFAULT_API_BASE);
  const [locationId, setLocationId] = useState(DEFAULT_LOCATION_ID);
  const [locations, setLocations] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationsLoading, setLocationsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("overview");
  const [showSettings, setShowSettings] = useState(false);
  const initialLoadStarted = useRef(false);

  const selectedLocation = locations.find((location) => location.location_id === locationId) || null;
  const locationName = selectedLocation?.name || locationId;

  const loadLocations = useCallback(async () => {
    setLocationsLoading(true);
    try {
      const nextLocations = await fetchLocations({ apiBase });
      setLocations(nextLocations);
      setLocationId((currentLocationId) =>
        resolveLocationId(nextLocations, currentLocationId || DEFAULT_LOCATION_ID, "Rio shopping")
      );
    } catch (e) {
      console.error("Could not load locations:", e);
      setLocations([]);
      setLocationId((currentLocationId) => currentLocationId || DEFAULT_LOCATION_ID);
    } finally {
      setLocationsLoading(false);
    }
  }, [apiBase]);

  const loadData = useCallback(async () => {
    if (!locationId) return;
    setLoading(true);
    setError(null);
    try {
      const metrics = await fetchInsightsMetrics({ locationId, apiBase });
      setData(metrics);
    } catch (e) {
      setError(e.message || "Could not reach the insights API.");
    } finally {
      setLoading(false);
    }
  }, [apiBase, locationId]);

  const handleLoad = useCallback(async () => {
    await loadLocations();
  }, [loadLocations]);

  useEffect(() => {
    if (initialLoadStarted.current) return;
    initialLoadStarted.current = true;
    loadLocations();
  }, [loadLocations]);

  useEffect(() => {
    if (!locationId) return;
    loadData();
  }, [loadData]);

  const updatedAt = `Last updated: ${formatDate()}`;
  const selectedLocationName = useMemo(
    () =>
      locations.find((location) => location.location_id === locationId)?.name ||
      (locationId ? "Selected location" : "Rio shopping"),
    [locationId, locations]
  );

  return (
    <div className="app-shell" style={{ "--app-bg": C.bg, "--text-color": C.text }}>
      <Header
        tab={tab}
        setTab={setTab}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        locations={locations}
        locationId={locationId}
        setLocationId={setLocationId}
        loading={loading}
      />

      {showSettings && (
        <SettingsBar
          apiBase={apiBase}
          setApiBase={setApiBase}
          onLoad={handleLoad}
          loading={loading}
        />
      )}

      <main className="app-main">
        {error && (
          <div
            className="app-status"
            style={{
              "--status-bg": error ? C.redBg : C.blueBg,
              "--status-border-color": `${error ? C.red : C.blue}55`,
              "--status-text-color": error ? "#F79AA5" : "#9DB8F5",
            }}
          >
            {error}
          </div>
        )}

        {loading && !data ? (
          <div className="app-loader" role="status" aria-label="Loading insights">
            <span className="app-loader__spinner" />
            <span>Loading insights...</span>
          </div>
        ) : data ? (
          tab === "overview" ? (
            <OverviewTab data={data} locationName={locationName} locationId={locationId} updatedAt={updatedAt} />
          ) : tab === "reviews" ? (
            <ReviewsTab locationName={locationName} locationId={locationId} updatedAt={updatedAt} apiBase={apiBase} />
          ) : (
            <SentimentTab data={data} locationName={locationName} locationId={locationId} updatedAt={updatedAt} />
          )
        ) : null}
      </main>

      <footer className="app-footer" style={{ "--panel-border-color": C.panelBorder, "--text-dim-color": C.textDim }}>
        AI CX Intelligence Platform &nbsp;|&nbsp; Confidential &nbsp;|&nbsp; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
