const DEFAULT_BASE = import.meta.env.VITE_API_BASE_URL || "";

/**
 * Fetch GET /api/v1/insights/summary?location_id=...
 *
 * @param {Object} opts
 * @param {string} opts.locationId - required location UUID
 * @param {string} [opts.apiBase] - overrides VITE_API_BASE_URL when provided
 * @param {AbortSignal} [opts.signal]
 * @returns {Promise<Object>} the parsed insights summary payload
 */
export async function fetchInsightsSummary({ locationId, apiBase, signal } = {}) {
  if (!locationId) throw new Error("locationId is required");

  const base = (apiBase ?? DEFAULT_BASE).replace(/\/+$/, "");
  const url = `${base}/api/v1/insights/summary?location_id=${encodeURIComponent(locationId)}`;

  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal,
  });

  if (!res.ok) {
    throw new Error(`Insights summary request failed (${res.status} ${res.statusText})`);
  }

  return res.json();
}

/**
 * Fetch GET /api/v1/reviews with arbitrary filters (location_id, aspect,
 * aspect_sentiment, page_size, cursor, etc). Handy for drill-down views.
 *
 * @param {Object} params - query params, e.g. { location_id, aspect, aspect_sentiment, page_size }
 * @param {string} [apiBase]
 */
export async function fetchReviews(params = {}, apiBase) {
  const base = (apiBase ?? DEFAULT_BASE).replace(/\/+$/, "");
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
  ).toString();

  const url = `${base}/api/v1/reviews${qs ? `?${qs}` : ""}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });

  if (!res.ok) {
    throw new Error(`Reviews request failed (${res.status} ${res.statusText})`);
  }

  return res.json();
}
