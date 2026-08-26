import React, { useMemo } from "react";
import { C } from "../theme";
import { pretty, complaintBarColor } from "../lib/format";
import KpiCard from "./ui/KpiCard";
import FlowStep from "./ui/FlowStep";
import Panel from "./ui/Panel";
import LabeledBar from "./ui/LabeledBar";

export default function OverviewTab({ data, locationId, updatedAt }) {
  const complaints = useMemo(() => {
    return [...(data.aspect_sentiment || [])]
      .filter((a) => a.negative_percent > 0)
      .sort((a, b) => b.negative_percent - a.negative_percent)
      .slice(0, 5);
  }, [data]);

  const trending = useMemo(() => {
    return [...(data.aspect_sentiment || [])].sort((a, b) => b.mentions - a.mentions).slice(0, 5);
  }, [data]);

  return (
    <>
      <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Output — Insight Flow Overview</div>
      <div style={{ fontSize: 12.5, color: C.textDim, marginBottom: 22 }}>
        {updatedAt} &nbsp;|&nbsp; Location: <span style={{ color: C.text }}>{locationId}</span>
      </div>

      {/* KPI row */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 26 }}>
        <KpiCard
          label="REVIEWS INGESTED"
          value={data.reviews_ingested?.toLocaleString?.() ?? data.reviews_ingested}
          sub="from connected sources"
          color={C.blue}
          bg={C.blueBg}
        />
        <KpiCard
          label="AVG SENTIMENT SCORE"
          value={`${data.cx_score} / 100`}
          sub={`raw score ${data.avg_sentiment_score >= 0 ? "+" : ""}${data.avg_sentiment_score?.toFixed(3)}`}
          color={C.green}
          bg={C.greenBg}
        />
        <KpiCard label="OPEN PAIN POINTS" value={data.open_pain_points} sub="aspects needing action" color={C.orange} bg={C.orangeBg} />
        <KpiCard label="EMERGING TRENDS" value={data.emerging_trends_count} sub="newly surfaced aspects" color={C.purple} bg={C.purpleBg} />
      </div>

      {/* Insight flow */}
      <div style={{ fontSize: 11, letterSpacing: 1, color: C.textDim, marginBottom: 10, fontWeight: 600 }}>
        AI INSIGHT FLOW
      </div>
      <div style={{ display: "flex", alignItems: "stretch", marginBottom: 26, flexWrap: "wrap", gap: 8 }}>
        <FlowStep title="Data Ingestion" sub="Reviews · Search · Feedback signals" color={C.blue} bg={C.blueBg} arrow />
        <FlowStep title="AI Processing" sub="Aspect & sentiment extraction" color={C.purple} bg={C.purpleBg} arrow />
        <FlowStep title="Insight Generation" sub="Pain points · Themes · Trends" color={C.orange} bg={C.orangeBg} arrow />
        <FlowStep title="Visualisation" sub="Dashboard · Reports · Recommendations" color={C.green} bg={C.greenBg} />
      </div>

      {/* two column: complaints + trending */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="grid-2">
        <Panel title="Top Customer Complaints">
          {complaints.length === 0 ? (
            <div style={{ color: C.textDim, fontSize: 13 }}>No negative-sentiment aspects for this location.</div>
          ) : (
            complaints.map((c) => (
              <LabeledBar
                key={c.aspect}
                label={pretty(c.aspect)}
                pct={Math.round(c.negative_percent)}
                color={complaintBarColor(c.negative_percent, C)}
              />
            ))
          )}
        </Panel>

        <Panel title="Trending Aspects" right={<span style={{ fontSize: 11, color: C.textDim }}>by mention volume</span>}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {trending.map((t) => (
              <div
                key={t.aspect}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "#0E1626",
                  border: `1px solid ${C.panelBorder}`,
                  borderRadius: 8,
                  padding: "10px 14px",
                }}
              >
                <span style={{ fontSize: 13, color: C.text }}>{pretty(t.aspect)}</span>
                <span style={{ fontSize: 12.5, color: C.green, fontWeight: 700 }}>{t.mentions} mentions</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
