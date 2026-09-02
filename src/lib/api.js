const DEFAULT_BASE =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE_URL) || "";

export function resolveLocationId(locations = [], preferredId = "", fallbackName = "Rio shopping") {
  const validLocations = locations.filter((location) => location && location.location_id);

  if (preferredId) {
    const preferredLocation = validLocations.find((location) => location.location_id === preferredId);
    if (preferredLocation) return preferredLocation.location_id;
  }

  const normalizedFallbackName = fallbackName.trim().toLowerCase();
  const fallbackLocation = validLocations.find(
    (location) => (location.name || "").trim().toLowerCase() === normalizedFallbackName
  );

  if (fallbackLocation) return fallbackLocation.location_id;
  return validLocations[0]?.location_id || preferredId || "";
}

export async function fetchLocations({ apiBase, signal } = {}) {
  const base = (apiBase ?? DEFAULT_BASE).replace(/\/+$/, "");
  const url = `${base}/api/v1/locations`;

  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal,
  });

  if (!res.ok) {
    throw new Error(`Locations request failed (${res.status} ${res.statusText})`);
  }

  const payload = await res.json();
  return Array.isArray(payload) ? payload : [];
}

/**
 * Fetch GET /api/v1/insights/metrics?location_id=...
 *
 * This combined endpoint contains the complete dashboard payload in a single
 * response, including sentiment distribution, topic breakdowns, and trend
 * metadata used by the overview and sentiment views.
 *
 * @param {Object} opts
 * @param {string} opts.locationId - required location UUID
 * @param {string} [opts.apiBase] - overrides VITE_API_BASE_URL when provided
 * @param {AbortSignal} [opts.signal]
 * @returns {Promise<Object>} the parsed combined insights payload
 */
export async function fetchInsightsMetrics({ locationId, apiBase, signal } = {}) {
  if (!locationId) throw new Error("locationId is required");

  const base = (apiBase ?? DEFAULT_BASE).replace(/\/+$/, "");
  const url = `${base}/api/v1/insights/metrics?location_id=${encodeURIComponent(locationId)}`;

  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal,
  });

  if (!res.ok) {
    throw new Error(`Insights metrics request failed (${res.status} ${res.statusText})`);
  }

  return res.json();
}

/**
 * Backward compatible wrappers. They delegate to the combined metrics endpoint.
 */
export async function fetchInsightsSummary({ locationId, apiBase, signal } = {}) {
  return fetchInsightsMetrics({ locationId, apiBase, signal });
}

export async function fetchInsightsTrends({ locationId, apiBase, signal } = {}) {
  return fetchInsightsMetrics({ locationId, apiBase, signal });
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
