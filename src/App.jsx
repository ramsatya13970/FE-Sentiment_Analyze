import React, { useCallback, useState } from "react";
import { C } from "./theme";
import { SAMPLE_DATA } from "./data/sampleData";
import { fetchInsightsSummary } from "./lib/api";
import { formatDate } from "./lib/format";
import Header from "./components/Header";
import SettingsBar from "./components/SettingsBar";
import OverviewTab from "./components/OverviewTab";
import SentimentTab from "./components/SentimentTab";

const DEFAULT_LOCATION_ID =
  import.meta.env.VITE_DEFAULT_LOCATION_ID || "6b486d79-9fc7-4f35-bf6f-e037e3e10e0d";
const DEFAULT_API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export default function App() {
  const [apiBase, setApiBase] = useState(DEFAULT_API_BASE);
  const [locationId, setLocationId] = useState(DEFAULT_LOCATION_ID);
  const [data, setData] = useState(SAMPLE_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usingSample, setUsingSample] = useState(true);
  const [tab, setTab] = useState("overview");
  const [showSettings, setShowSettings] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const json = await fetchInsightsSummary({ locationId, apiBase });
      setData(json);
      setUsingSample(false);
    } catch (e) {
      setError(e.message || "Could not reach the insights API. Showing sample data instead.");
      setData(SAMPLE_DATA);
      setUsingSample(true);
    } finally {
      setLoading(false);
    }
  }, [apiBase, locationId]);

  const updatedAt = `Last updated: ${formatDate()}`;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text }}>
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

      <main style={{ padding: "26px 28px 60px", maxWidth: 1280, margin: "0 auto" }}>
        {(usingSample || error) && (
          <div
            style={{
              background: error ? C.redBg : C.blueBg,
              border: `1px solid ${error ? C.red : C.blue}55`,
              borderRadius: 8,
              padding: "9px 14px",
              fontSize: 12.5,
              color: error ? "#F79AA5" : "#9DB8F5",
              marginBottom: 20,
            }}
          >
            {error
              ? error
              : `Showing sample data. Click "Settings" in the nav bar above to point this at a live location_id and API base URL.`}
          </div>
        )}

        {tab === "overview" ? (
          <OverviewTab data={data} locationId={locationId} updatedAt={updatedAt} />
        ) : (
          <SentimentTab data={data} locationId={locationId} updatedAt={updatedAt} />
        )}
      </main>

      <footer
        style={{
          borderTop: `1px solid ${C.panelBorder}`,
          padding: "14px 28px",
          textAlign: "center",
          fontSize: 11,
          color: C.textDim,
        }}
      >
        AI CX Intelligence Platform &nbsp;|&nbsp; Confidential &nbsp;|&nbsp; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
