import React, { useRef, useState } from "react";
import { C } from "../theme";
import { fetchReviews } from "../lib/api";
import { pretty, trendLabel } from "../lib/format";
import KpiCard from "./ui/KpiCard";
import Panel from "./ui/Panel";
import LabeledBar from "./ui/LabeledBar";
import "./SentimentTab.css";

const SENTIMENT_LABELS = {
  positive: "Positive",
  neutral: "Neutral",
  negative: "Negative",
};

export default function SentimentTab({ data, locationName, locationId, updatedAt, apiBase }) {
  const [reviewPopup, setReviewPopup] = useState({
    open: false,
    aspect: "",
    sentiment: "",
    title: "",
    loading: false,
    loadingMore: false,
    items: [],
    error: "",
    hasMore: false,
    nextCursor: null,
  });
  const [isModalAtBottom, setIsModalAtBottom] = useState(false);
  const modalListRef = useRef(null);
  const dist = data.sentiment_distribution || [];
  const getPct = (name) => dist.find((d) => d.sentiment === name)?.percent ?? 0;

  const handleReviewPopupScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    setIsModalAtBottom(scrollHeight - scrollTop - clientHeight <= 20);
  };

  const loadPopupReviews = async ({ aspect, sentiment, cursor, append = false } = {}) => {
    if (!locationId) return;

    setReviewPopup((current) => ({
      ...current,
      loading: !append,
      loadingMore: append,
      error: "",
    }));

    try {
      const params = {
        location_id: locationId,
        aspect,
        page_size: 50,
        sort: "newest",
        cursor,
      };

      if (sentiment) params.aspect_sentiment = sentiment;

      const payload = await fetchReviews(params, apiBase);
      const items = Array.isArray(payload.items) ? payload.items : [];
      const hasMore = Boolean(payload.has_more);
      const nextCursor = payload.next_cursor || null;

      setReviewPopup((current) => ({
        ...current,
        loading: false,
        loadingMore: false,
        items: append ? [...(current.items || []), ...items] : items,
        error: items.length ? "" : "No matching reviews found.",
        hasMore,
        nextCursor,
      }));

      if (modalListRef.current) {
        const atBottom = modalListRef.current.scrollHeight - modalListRef.current.scrollTop - modalListRef.current.clientHeight <= 20;
        setIsModalAtBottom(atBottom);
      }
    } catch (error) {
      setReviewPopup((current) => ({
        ...current,
        loading: false,
        loadingMore: false,
        error: error.message || "Could not load reviews for this topic.",
      }));
    }
  };

  const openReviewPopup = async (aspect, sentiment = "") => {
    setReviewPopup({
      open: true,
      aspect,
      sentiment,
      title: sentiment ? `${pretty(aspect)} • ${SENTIMENT_LABELS[sentiment] || pretty(sentiment)} reviews` : `${pretty(aspect)} reviews`,
      loading: true,
      loadingMore: false,
      items: [],
      error: "",
      hasMore: false,
      nextCursor: null,
    });
    setIsModalAtBottom(false);

    await loadPopupReviews({ aspect, sentiment });
  };

  const loadMoreReviewPopup = async () => {
    if (!reviewPopup.aspect || !reviewPopup.hasMore) return;
    await loadPopupReviews({
      aspect: reviewPopup.aspect,
      sentiment: reviewPopup.sentiment,
      cursor: reviewPopup.nextCursor,
      append: true,
    });
  };

  const closeReviewPopup = () => {
    setReviewPopup({ open: false, aspect: "", sentiment: "", title: "", loading: false, loadingMore: false, items: [], error: "", hasMore: false, nextCursor: null });
  };

  return (
    <>
      <div className="sentiment__title">Output — Sentiment Analysis</div>
      <div className="sentiment__meta" style={{ "--text-dim-color": C.textDim, "--text-color": C.text }}>
        {updatedAt} &nbsp;|&nbsp; Location: <strong>{locationName}</strong>
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
              <div
                className="sentiment__topic sentiment__clickable"
                style={{ "--text-color": C.text }}
                onClick={() => openReviewPopup(a.aspect)}
              >
                {pretty(a.aspect)}
              </div>
              <div className="sentiment__volume" style={{ "--text-dim-color": C.textDim }}>{a.mentions}</div>
              <div className="sentiment__clickable" style={{ color: C.green }} onClick={() => openReviewPopup(a.aspect, "positive")}>
                {a.positive_percent}%
              </div>
              <div className="sentiment__clickable" style={{ color: C.orange }} onClick={() => openReviewPopup(a.aspect, "neutral")}>
                {a.neutral_percent}%
              </div>
              <div className="sentiment__clickable" style={{ color: C.red }} onClick={() => openReviewPopup(a.aspect, "negative")}>
                {a.negative_percent}%
              </div>
              <div className="sentiment__trend" style={{ color: t.color }}>
                {t.arrow} {t.label}
              </div>
            </div>
          );
        })}
      </Panel>

      {reviewPopup.open && (
        <div className="sentiment__modal-backdrop" onClick={closeReviewPopup}>
          <div className="sentiment__modal" onClick={(event) => event.stopPropagation()}>
            <div className="sentiment__modal-header">
              <div>
                <div className="sentiment__modal-title">{reviewPopup.title}</div>
                <div className="sentiment__modal-subtitle">{locationName}</div>
              </div>
              <button type="button" className="sentiment__modal-close" onClick={closeReviewPopup}>
                Close
              </button>
            </div>

            {reviewPopup.loading ? (
              <div className="sentiment__modal-loading">Loading related reviews...</div>
            ) : reviewPopup.error ? (
              <div className="sentiment__modal-empty sentiment__modal-error">{reviewPopup.error}</div>
            ) : reviewPopup.items.length === 0 ? (
              <div className="sentiment__modal-empty">No reviews found for this filter.</div>
            ) : (
              <>
                <div
                  ref={modalListRef}
                  className="sentiment__modal-list"
                  onScroll={handleReviewPopupScroll}
                >
                  {reviewPopup.items.map((review) => {
                    const text = review.review_text?.translated || review.review_text?.cleaned || review.review_text?.raw || "No review text available.";
                    const sentiment = review.analysis?.sentiment || "neutral";
                    const aspectText = review.analysis?.aspects?.map((aspect) => pretty(aspect.name)).join(", ") || "General";
                    const date = review.review_date ? new Date(review.review_date).toLocaleDateString("en-GB") : "Unknown date";
                    return (
                      <article key={review.review_id} className="sentiment__modal-review">
                        <div className="sentiment__modal-review-top">
                          <span className="sentiment__modal-badge" style={{ background: `${C[sentiment === "positive" ? "green" : sentiment === "neutral" ? "orange" : sentiment === "mixed" ? "purple" : "red"]}22`, color: C[sentiment === "positive" ? "green" : sentiment === "neutral" ? "orange" : sentiment === "mixed" ? "purple" : "red"] }}>
                            {pretty(sentiment)}
                          </span>
                          <span className="sentiment__modal-date">{date}</span>
                        </div>

                        <div className="sentiment__modal-review-body">{text}</div>

                        <div className="sentiment__modal-review-meta">
                          <span>Aspect: {aspectText}</span>
                          <span>Source: {review.source_platform}</span>
                          <span>Rating: {review.rating ?? "N/A"}</span>
                        </div>
                      </article>
                    );
                  })}

                  {reviewPopup.hasMore && (
                    <div className={`sentiment__modal-load-more-wrap${isModalAtBottom ? " sentiment__modal-load-more-wrap--visible" : ""}`}>
                      <button type="button" className="sentiment__modal-load-more" onClick={loadMoreReviewPopup} disabled={reviewPopup.loadingMore}>
                        {reviewPopup.loadingMore ? "Loading more..." : "Load more reviews"}
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
