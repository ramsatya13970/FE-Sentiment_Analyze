import React, { useMemo } from "react";
import { C } from "../theme";
import { pretty, complaintBarColor } from "../lib/format";
import KpiCard from "./ui/KpiCard";
import FlowStep from "./ui/FlowStep";
import Panel from "./ui/Panel";
import LabeledBar from "./ui/LabeledBar";
import "./OverviewTab.css";

export default function OverviewTab({ data, locationName, updatedAt }) {
  const complaints = useMemo(() => {
    return [...(data.aspect_sentiment || [])]
      .filter((a) => a.negative_percent > 0)
      .sort((a, b) => b.negative_percent - a.negative_percent)
      .slice(0, 5);
  }, [data]);

  return (
    <>
      <div className="overview__title">Output — Insight Flow Overview</div>
      <div className="overview__meta" style={{ "--text-dim-color": C.textDim, "--text-color": C.text }}>
        {updatedAt} &nbsp;|&nbsp; Location: <strong>{locationName}</strong>
      </div>

      {/* KPI row */}
      <div className="overview__kpis">
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
      <div className="overview__section-label" style={{ "--text-dim-color": C.textDim }}>AI INSIGHT FLOW</div>
      <div className="overview__flow">
        <FlowStep title="Data Ingestion" sub="Reviews · Search · Feedback signals" color={C.blue} bg={C.blueBg} arrow />
        <FlowStep title="AI Processing" sub="Aspect & sentiment extraction" color={C.purple} bg={C.purpleBg} arrow />
        <FlowStep title="Insight Generation" sub="Pain points · Themes · Trends" color={C.orange} bg={C.orangeBg} arrow />
        <FlowStep title="Visualisation" sub="Dashboard · Reports · Recommendations" color={C.green} bg={C.greenBg} />
      </div>

      {/* two column: complaints + trending */}
      <div className="overview__columns">
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

        <Panel title="Emerging Trends" right={<span style={{ fontSize: 11, color: C.textDim }}>by current volume</span>}>
          <div className="overview__trend-list">
            {(data.emerging_trends || []).map((t) => (
              <div
                key={t.category}
                className="overview__trend-item"
                style={{ "--panel-border-color": C.panelBorder }}
              >
                <span className="overview__trend-name" style={{ "--text-color": C.text }}>{pretty(t.category)}</span>
                <span className="overview__trend-count" style={{ "--success-color": C.green }}>
                  {t.current_volume} mentions · {t.growth_percent}% growth
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
