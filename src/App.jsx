import React, { useCallback, useEffect, useRef, useState } from "react";
import { C } from "./theme";
// import { SAMPLE_DATA } from "./data/sampleData";
import { fetchInsightsMetrics } from "./lib/api";
import { formatDate } from "./lib/format";
import Header from "./components/Header";
import SettingsBar from "./components/SettingsBar";
import OverviewTab from "./components/OverviewTab";
import SentimentTab from "./components/SentimentTab";
import ReviewsTab from "./components/ReviewsTab";
import "./App.css";

const DEFAULT_LOCATION_ID =
  import.meta.env.VITE_DEFAULT_LOCATION_ID || "6b486d79-9fc7-4f35-bf6f-e037e3e10e0d";
const DEFAULT_API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export default function App() {
  const [apiBase, setApiBase] = useState(DEFAULT_API_BASE);
  const [locationId, setLocationId] = useState(DEFAULT_LOCATION_ID);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("overview");
  const [showSettings, setShowSettings] = useState(false);
  const initialLoadStarted = useRef(false);

  const loadData = useCallback(async () => {
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

  useEffect(() => {
    if (initialLoadStarted.current) return;
    initialLoadStarted.current = true;
    loadData();
  }, []);

  const updatedAt = `Last updated: ${formatDate()}`;

  return (
    <div className="app-shell" style={{ "--app-bg": C.bg, "--text-color": C.text }}>
      <Header tab={tab} setTab={setTab} showSettings={showSettings} setShowSettings={setShowSettings} />

      {showSettings && (
        <SettingsBar
          apiBase={apiBase}
          setApiBase={setApiBase}
          locationId={locationId}
          setLocationId={setLocationId}
          onLoad={loadData}
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
            <OverviewTab data={data} locationId={locationId} updatedAt={updatedAt} />
          ) : tab === "reviews" ? (
            <ReviewsTab locationId={locationId} updatedAt={updatedAt} apiBase={apiBase} />
          ) : (
            <SentimentTab data={data} locationId={locationId} updatedAt={updatedAt} />
          )
        ) : null}
      </main>

      <footer className="app-footer" style={{ "--panel-border-color": C.panelBorder, "--text-dim-color": C.textDim }}>
        AI CX Intelligence Platform &nbsp;|&nbsp; Confidential &nbsp;|&nbsp; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
