import React, { useEffect, useState } from "react";
import { C } from "../theme";
import { fetchReviews } from "../lib/api";
import { pretty } from "../lib/format";
import Panel from "./ui/Panel";
import "./ReviewsTab.css";

const EMPTY_FILTERS = {
  category: "",
  aspect: "",
  sentiment: "",
  aspect_sentiment: "",
  source_platform: "",
  from_date: "",
  to_date: "",
  sort: "newest",
  page_size: "20",
};

const CATEGORY_OPTIONS = [
  "billing",
  "parking",
  "facility_maintenance",
  "security_safety",
  "store_retail",
  "food_court_dining",
  "booking_reservation",
  "wifi_connectivity",
  "accessibility",
  "events_entertainment",
  "customer_support",
  "other",
];

const ASPECT_OPTIONS = [
  "parking",
  "cleanliness",
  "staff",
  "wayfinding",
  "accessibility",
  "safety",
  "amenities",
  "wait_time",
  "food_and_beverage",
  "value",
  "ambience",
  "overall",
  "restroom",
  "escalator_elevator",
  "air_conditioning",
  "noise_crowding",
  "wifi_connectivity",
  "seating",
  "meeting_facilities",
  "entertainment",
  "signage",
  "other",
];

const SENTIMENT_OPTIONS = ["positive", "neutral", "mixed", "negative"];
const SOURCE_OPTIONS = ["tripadvisor", "google_maps"];
const SORT_OPTIONS = ["newest", "oldest", "highest_rating", "highest_confidence", "most_negative"];
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

const labelFromValue = (value) => {
  if (!value) return "All";
  return pretty(value).replace(/\s+/g, " ");
};

const sentimentColor = (sentiment) => {
  if (sentiment === "positive") return C.green;
  if (sentiment === "neutral") return C.orange;
  if (sentiment === "mixed") return C.purple;
  if (sentiment === "negative") return C.red;
  return C.textDim;
};

export default function ReviewsTab({ locationId, locationName, updatedAt, apiBase }) {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);

  const loadReviews = async ({ selectedFilters = filters, cursor, append = false } = {}) => {
    const params = {
      ...selectedFilters,
      location_id: locationId,
      page_size: Number(selectedFilters.page_size || 20),
      cursor,
    };

    Object.entries(params).forEach(([key, value]) => {
      if (value === "" || value === undefined || value === null) delete params[key];
    });

    if (append) setLoadingMore(true); else setLoading(true);
    setError("");

    try {
      const payload = await fetchReviews(params, apiBase);
      const reviewItems = Array.isArray(payload.items) ? payload.items : [];
      setItems((current) => (append ? [...current, ...reviewItems] : reviewItems));
      setHasMore(Boolean(payload.has_more));
      setNextCursor(payload.next_cursor || null);
    } catch (err) {
      setError(err.message || "Could not load reviews.");
      if (!append) setItems([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (!locationId) return;
    void loadReviews({ selectedFilters: EMPTY_FILTERS, append: false });
  }, [apiBase, locationId]);

  const applyFilters = () => {
    void loadReviews({ selectedFilters: filters, append: false });
  };

  const resetFilters = () => {
    setFilters(EMPTY_FILTERS);
    void loadReviews({ selectedFilters: EMPTY_FILTERS, append: false });
  };

  const loadMore = () => {
    if (!hasMore || !nextCursor) return;
    void loadReviews({ selectedFilters: filters, cursor: nextCursor, append: true });
  };

  return (
    <>
      <div className="reviews__title">Output — Review Explorer</div>
      <div className="reviews__meta" style={{ "--text-dim-color": C.textDim, "--text-color": C.text }}>
        {updatedAt} &nbsp;|&nbsp; Location: <strong>{locationName}</strong>
      </div>

      <div className="reviews__section reviews__section--filters">
        <Panel
          title="Review Filters"
          style={{
            "--panel-color": "#0f1b31",
            "--panel-border-color": "#3457b2",
          }}
        >
          <div className="reviews__filters">
            <label className="reviews__field">
              <span>Category</span>
              <select
                value={filters.category}
                onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value }))}
              >
                <option value="">All categories</option>
                {CATEGORY_OPTIONS.map((value) => (
                  <option key={value} value={value}>
                    {labelFromValue(value)}
                  </option>
                ))}
              </select>
            </label>

            <label className="reviews__field">
              <span>Aspect</span>
              <select
                value={filters.aspect}
                onChange={(event) => setFilters((current) => ({ ...current, aspect: event.target.value }))}
              >
                <option value="">All aspects</option>
                {ASPECT_OPTIONS.map((value) => (
                  <option key={value} value={value}>
                    {labelFromValue(value)}
                  </option>
                ))}
              </select>
            </label>

            <label className="reviews__field">
              <span>Overall sentiment</span>
              <select
                value={filters.sentiment}
                onChange={(event) => setFilters((current) => ({ ...current, sentiment: event.target.value }))}
              >
                <option value="">All sentiment</option>
                {SENTIMENT_OPTIONS.map((value) => (
                  <option key={value} value={value}>
                    {labelFromValue(value)}
                  </option>
                ))}
              </select>
            </label>

            <label className="reviews__field">
              <span>Aspect sentiment</span>
              <select
                value={filters.aspect_sentiment}
                onChange={(event) => setFilters((current) => ({ ...current, aspect_sentiment: event.target.value }))}
              >
                <option value="">All aspect sentiment</option>
                {SENTIMENT_OPTIONS.map((value) => (
                  <option key={value} value={value}>
                    {labelFromValue(value)}
                  </option>
                ))}
              </select>
            </label>

            <label className="reviews__field">
              <span>Source</span>
              <select
                value={filters.source_platform}
                onChange={(event) => setFilters((current) => ({ ...current, source_platform: event.target.value }))}
              >
                <option value="">All sources</option>
                {SOURCE_OPTIONS.map((value) => (
                  <option key={value} value={value}>
                    {labelFromValue(value)}
                  </option>
                ))}
              </select>
            </label>

            <label className="reviews__field">
              <span>Sort</span>
              <select
                value={filters.sort}
                onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value }))}
              >
                {SORT_OPTIONS.map((value) => (
                  <option key={value} value={value}>
                    {labelFromValue(value)}
                  </option>
                ))}
              </select>
            </label>

            <label className="reviews__field">
              <span>From date</span>
              <input
                type="date"
                value={filters.from_date}
                onChange={(event) => setFilters((current) => ({ ...current, from_date: event.target.value }))}
              />
            </label>

            <label className="reviews__field">
              <span>To date</span>
              <input
                type="date"
                value={filters.to_date}
                onChange={(event) => setFilters((current) => ({ ...current, to_date: event.target.value }))}
              />
            </label>

            <label className="reviews__field">
              <span>Page size</span>
              <select
                value={filters.page_size}
                onChange={(event) => setFilters((current) => ({ ...current, page_size: event.target.value }))}
              >
                {PAGE_SIZE_OPTIONS.map((value) => (
                  <option key={value} value={String(value)}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="reviews__actions">
            <button type="button" className="reviews__button reviews__button--primary" onClick={applyFilters}>
              Apply filters
            </button>
            <button type="button" className="reviews__button reviews__button--ghost" onClick={resetFilters}>
              Reset
            </button>
          </div>
        </Panel>
      </div>

      <div className="reviews__section reviews__section--results">
        <Panel
          title="Filtered Reviews"
          style={{
            "--panel-color": "#121a2f",
            "--panel-border-color": "#1f9d73",
          }}
        >
          {error ? (
            <div className="reviews__empty" style={{ color: C.red }}>
              {error}
            </div>
          ) : loading ? (
            <div className="reviews__empty">Loading reviews...</div>
          ) : items.length === 0 ? (
            <div className="reviews__empty">No reviews match the selected filters.</div>
          ) : (
            <div className="reviews__list">
              {items.map((review) => {
                const text =
                  review.review_text?.translated ||
                  review.review_text?.cleaned ||
                  review.review_text?.raw ||
                  "No review text available.";
                const sentiment = review.analysis?.sentiment || "neutral";
                const reviewDate = review.review_date ? new Date(review.review_date).toLocaleDateString("en-GB") : "Unknown date";

                return (
                  <article
                    key={review.review_id}
                    className="reviews__item"
                    style={{
                      "--panel-border-color": C.panelBorder,
                      "--review-accent": sentimentColor(sentiment),
                    }}
                  >
                    <div className="reviews__item-header">
                      <div>
                        <div className="reviews__meta-row">
                          <span className="reviews__pill" style={{ background: `${sentimentColor(sentiment)}22`, color: sentimentColor(sentiment) }}>
                            {pretty(sentiment)}
                          </span>
                          <span className="reviews__pill reviews__pill--muted">{review.source_platform}</span>
                          <span className="reviews__pill reviews__pill--muted">{review.rating ?? "No rating"}/5</span>
                        </div>
                      </div>
                      <div className="reviews__date">{reviewDate}</div>
                    </div>

                    <div className="reviews__content">{text}</div>

                    <div className="reviews__summary">
                      <div>
                        <span className="reviews__label">Category</span>
                        <strong>{labelFromValue(review.analysis?.category)}</strong>
                      </div>
                      <div>
                        <span className="reviews__label">Confidence</span>
                        <strong>{Math.round((review.analysis?.confidence ?? 0) * 100)}%</strong>
                      </div>
                      <div>
                        <span className="reviews__label">Action needed</span>
                        <strong>{review.analysis?.action_needed ? "Yes" : "No"}</strong>
                      </div>
                    </div>

                    {review.analysis?.aspects?.length ? (
                      <div className="reviews__aspect-list">
                        {review.analysis.aspects.map((aspect) => (
                          <span
                            key={`${review.review_id}-${aspect.name}`}
                            className="reviews__aspect"
                            style={{ background: `${sentimentColor(aspect.sentiment)}22`, color: sentimentColor(aspect.sentiment) }}
                          >
                            {labelFromValue(aspect.name)} · {pretty(aspect.sentiment)}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    {review.analysis?.reason ? <div className="reviews__reason">Reason: {review.analysis.reason}</div> : null}
                  </article>
                );
              })}
            </div>
          )}

          {hasMore && !loading && (
            <div className="reviews__load-more">
              <button type="button" className="reviews__button reviews__button--primary" onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? "Loading more..." : "Load more reviews"}
              </button>
            </div>
          )}
        </Panel>
      </div>
    </>
  );
}
