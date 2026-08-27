import React from "react";
import { C } from "../theme";
import { pretty, trendLabel } from "../lib/format";
import KpiCard from "./ui/KpiCard";
import Panel from "./ui/Panel";
import LabeledBar from "./ui/LabeledBar";
import "./SentimentTab.css";

export default function SentimentTab({ data, locationId, updatedAt }) {
  const dist = data.sentiment_distribution || [];
  const getPct = (name) => dist.find((d) => d.sentiment === name)?.percent ?? 0;

  return (
    <>
      <div className="sentiment__title">Output — Sentiment Analysis</div>
      <div className="sentiment__meta" style={{ "--text-dim-color": C.textDim, "--text-color": C.text }}>
        {updatedAt} &nbsp;|&nbsp; Location: <strong>{locationId}</strong>
      </div>

      <div className="sentiment__kpis">
        <KpiCard label="POSITIVE SENTIMENT" value={`${data.positive_sentiment_percent}%`} color={C.green} bg={C.greenBg} />
        <KpiCard label="NEUTRAL SENTIMENT" value={`${data.neutral_sentiment_percent}%`} color={C.orange} bg={C.orangeBg} />
        <KpiCard label="MIXED SENTIMENT" value={`${data.mixed_sentiment_percent}%`} color={C.purple} bg={C.purpleBg} />
        <KpiCard label="NEGATIVE SENTIMENT" value={`${data.negative_sentiment_percent}%`} color={C.red} bg={C.redBg} />
        <KpiCard label="AVG SCORE" value={`${data.cx_score} / 100`} color={C.blue} bg={C.blueBg} />
      </div>

      <div className="sentiment__columns">
        <Panel title="Overall Sentiment Distribution">
          <LabeledBar label="Positive" pct={getPct("positive")} color={C.green} />
          <LabeledBar label="Neutral" pct={getPct("neutral")} color={C.orange} />
          <LabeledBar label="Mixed" pct={getPct("mixed")} color={C.purple} />
          <LabeledBar label="Negative" pct={getPct("negative")} color={C.red} />
          <div className="sentiment__score" style={{ "--score-bg": C.blueBg, "--score-border-color": `${C.blue}88`, "--score-color": C.blue }}>
            Overall Score: {data.cx_score} / 100
          </div>
        </Panel>

        <Panel title="Sentiment by Source">
          <div className="sentiment__source-list">
            {(data.source_sentiment || []).map((s) => (
              <div key={s.source}>
                <div className="sentiment__source-header" style={{ "--text-color": C.text, "--text-dim-color": C.textDim }}>
                  <span className="sentiment__source-name">{s.source}</span>
                  <span className="sentiment__source-values">
                    <span className="sentiment__positive" style={{ "--positive-color": C.green }}>{s.positive_percent}%</span>
                    {"  "}
                     <span className="sentiment__neutral" style={{ "--neutral-color": C.orange }}>{s.neutral_percent}%</span>
                    {"  "}
                    <span className="sentiment__mixed" style={{ "--mixed-color": C.purple }}>{s.mixed_percent}%</span>
                    {"  "}
                    <span className="sentiment__negative" style={{ "--negative-color": C.red }}>{s.negative_percent}%</span>
                  </span>
                </div>
                <div className="sentiment__source-track">
                  <div className="sentiment__source-positive" style={{ width: `${s.positive_percent}%`, "--positive-color": C.green }} />
                  <div className="sentiment__source-neutral" style={{ width: `${s.neutral_percent}%`, "--neutral-color": C.orange }} />
                  <div className="sentiment__source-mixed" style={{ width: `${s.mixed_percent}%`, "--mixed-color": C.purple }} />
                  <div className="sentiment__source-negative" style={{ width: `${s.negative_percent}%`, "--negative-color": C.red }} />
                </div>
              </div>
            ))}
            {(!data.source_sentiment || data.source_sentiment.length === 0) && (
              <div style={{ color: C.textDim, fontSize: 13 }}>No source breakdown returned by the API.</div>
            )}
          </div>
        </Panel>
      </div>

      {/* Topic-level table */}
      <Panel title="Topic-Level Sentiment Breakdown">
        <div
          className="sentiment__table-header"
          style={{ "--text-dim-color": C.textDim, "--panel-border-color": C.panelBorder }}
        >
          <div>Topic</div>
          <div style={{ textAlign: "right" }}>Volume</div>
          <div style={{ textAlign: "right" }}>Positive</div>
          <div style={{ textAlign: "right" }}>Neutral</div>
          <div style={{ textAlign: "right" }}>Negative</div>
          <div style={{ textAlign: "right" }}>Trend</div>
        </div>
        {(data.aspect_sentiment || []).map((a) => {
          const t = trendLabel(a.trend, C);
          return (
            <div
              key={a.aspect}
              className="sentiment__table-row"
              style={{ "--panel-border-color": C.panelBorder }}
            >
              <div className="sentiment__topic" style={{ "--text-color": C.text }}>{pretty(a.aspect)}</div>
              <div className="sentiment__volume" style={{ "--text-dim-color": C.textDim }}>{a.mentions}</div>
              <div style={{ color: C.green }}>{a.positive_percent}%</div>
              <div style={{ color: C.orange }}>{a.neutral_percent}%</div>
              <div style={{ color: C.red }}>{a.negative_percent}%</div>
              <div className="sentiment__trend" style={{ color: t.color }}>
                {t.arrow} {t.label}
              </div>
            </div>
          );
        })}
      </Panel>
    </>
  );
}
