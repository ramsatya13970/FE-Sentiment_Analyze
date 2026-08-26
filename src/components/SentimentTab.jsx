import React from "react";
import { C } from "../theme";
import { pretty, trendLabel } from "../lib/format";
import KpiCard from "./ui/KpiCard";
import Panel from "./ui/Panel";
import LabeledBar from "./ui/LabeledBar";

export default function SentimentTab({ data, locationId, updatedAt }) {
  const dist = data.sentiment_distribution || [];
  const getPct = (name) => dist.find((d) => d.sentiment === name)?.percent ?? 0;

  return (
    <>
      <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Output — Sentiment Analysis</div>
      <div style={{ fontSize: 12.5, color: C.textDim, marginBottom: 22 }}>
        {updatedAt} &nbsp;|&nbsp; Location: <span style={{ color: C.text }}>{locationId}</span>
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 26 }}>
        <KpiCard label="POSITIVE SENTIMENT" value={`${data.positive_sentiment_percent}%`} color={C.green} bg={C.greenBg} />
        <KpiCard label="NEUTRAL SENTIMENT" value={`${data.neutral_sentiment_percent}%`} color={C.orange} bg={C.orangeBg} />
        <KpiCard label="NEGATIVE SENTIMENT" value={`${data.negative_sentiment_percent}%`} color={C.red} bg={C.redBg} />
        <KpiCard label="AVG SCORE" value={`${data.cx_score} / 100`} color={C.blue} bg={C.blueBg} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }} className="grid-2">
        <Panel title="Overall Sentiment Distribution">
          <LabeledBar label="Positive" pct={getPct("positive")} color={C.green} />
          <LabeledBar label="Neutral" pct={getPct("neutral")} color={C.orange} />
          <LabeledBar label="Mixed" pct={getPct("mixed")} color={C.purple} />
          <LabeledBar label="Negative" pct={getPct("negative")} color={C.red} />
          <div
            style={{
              marginTop: 4,
              background: C.blueBg,
              border: `1px solid ${C.blue}88`,
              borderRadius: 8,
              padding: "10px 14px",
              textAlign: "center",
              fontWeight: 700,
              color: C.blue,
              fontSize: 14,
            }}
          >
            Overall Score: {data.cx_score} / 100
          </div>
        </Panel>

        <Panel title="Sentiment by Source">
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {(data.source_sentiment || []).map((s) => (
              <div key={s.source}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                  <span style={{ textTransform: "capitalize", color: C.text }}>{s.source}</span>
                  <span style={{ color: C.textDim }}>
                    <span style={{ color: C.green, fontWeight: 700 }}>{s.positive_percent}%</span>
                    {"  "}
                    <span style={{ color: C.red, fontWeight: 700 }}>{s.negative_percent}%</span>
                  </span>
                </div>
                <div style={{ display: "flex", height: 9, borderRadius: 5, overflow: "hidden", background: "#1B2438" }}>
                  <div style={{ width: `${s.positive_percent}%`, background: C.green }} />
                  <div style={{ width: `${s.neutral_percent}%`, background: C.orange }} />
                  <div style={{ width: `${s.mixed_percent}%`, background: C.purple }} />
                  <div style={{ width: `${s.negative_percent}%`, background: C.red }} />
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
          style={{
            display: "grid",
            gridTemplateColumns: "1.3fr 0.8fr 0.8fr 0.8fr 0.8fr 1fr",
            fontSize: 11,
            letterSpacing: 0.5,
            textTransform: "uppercase",
            color: C.textDim,
            padding: "0 4px 10px",
            borderBottom: `1px solid ${C.panelBorder}`,
          }}
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
              style={{
                display: "grid",
                gridTemplateColumns: "1.3fr 0.8fr 0.8fr 0.8fr 0.8fr 1fr",
                fontSize: 13,
                padding: "11px 4px",
                borderBottom: `1px solid ${C.panelBorder}`,
                alignItems: "center",
              }}
            >
              <div style={{ color: C.text }}>{pretty(a.aspect)}</div>
              <div style={{ textAlign: "right", color: C.textDim }}>{a.mentions}</div>
              <div style={{ textAlign: "right", color: C.green }}>{a.positive_percent}%</div>
              <div style={{ textAlign: "right", color: C.orange }}>{a.neutral_percent}%</div>
              <div style={{ textAlign: "right", color: C.red }}>{a.negative_percent}%</div>
              <div style={{ textAlign: "right", color: t.color, fontWeight: 600 }}>
                {t.arrow} {t.label}
              </div>
            </div>
          );
        })}
      </Panel>
    </>
  );
}
