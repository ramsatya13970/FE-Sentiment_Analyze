// Fallback payload — shape mirrors GET /api/v1/insights/summary
// Used until a real location is loaded, and whenever the live
// request fails, so the UI is never blank.
export const SAMPLE_DATA = {
  reviews_ingested: 50,
  avg_sentiment_score: 0.522,
  cx_score: 76,
  positive_sentiment_percent: 74,
  neutral_sentiment_percent: 6,
  mixed_sentiment_percent: 10,
  negative_sentiment_percent: 10,
  open_pain_points: 3,
  emerging_trends_count: 3,
  sentiment_distribution: [
    { sentiment: "positive", count: 37, percent: 74 },
    { sentiment: "neutral", count: 3, percent: 6 },
    { sentiment: "mixed", count: 5, percent: 10 },
    { sentiment: "negative", count: 5, percent: 10 },
  ],
  source_sentiment: [
    {
      source: "tripadvisor",
      total_reviews: 50,
      avg_sentiment_score: 0.522,
      cx_score: 76,
      positive_percent: 74,
      neutral_percent: 6,
      mixed_percent: 10,
      negative_percent: 10,
    },
  ],
  aspect_sentiment: [
    { aspect: "overall", mentions: 31, review_percent: 62, avg_sentiment_score: 0.706, cx_score: 85, positive_percent: 87.1, neutral_percent: 6.5, mixed_percent: 6.5, negative_percent: 0, complaint_mentions: 2, trend: "new" },
    { aspect: "food_and_beverage", mentions: 21, review_percent: 42, avg_sentiment_score: 0.512, cx_score: 76, positive_percent: 76.2, neutral_percent: 9.5, mixed_percent: 0, negative_percent: 14.3, complaint_mentions: 3, trend: "new" },
    { aspect: "amenities", mentions: 11, review_percent: 22, avg_sentiment_score: 0.841, cx_score: 92, positive_percent: 100, neutral_percent: 0, mixed_percent: 0, negative_percent: 0, complaint_mentions: 0, trend: "new" },
    { aspect: "cleanliness", mentions: 10, review_percent: 20, avg_sentiment_score: 0.84, cx_score: 92, positive_percent: 100, neutral_percent: 0, mixed_percent: 0, negative_percent: 0, complaint_mentions: 0, trend: "new" },
    { aspect: "staff", mentions: 10, review_percent: 20, avg_sentiment_score: 0.225, cx_score: 61, positive_percent: 60, neutral_percent: 0, mixed_percent: 0, negative_percent: 40, complaint_mentions: 4, trend: "new" },
    { aspect: "parking", mentions: 7, review_percent: 14, avg_sentiment_score: 0.836, cx_score: 92, positive_percent: 100, neutral_percent: 0, mixed_percent: 0, negative_percent: 0, complaint_mentions: 0, trend: "new" },
    { aspect: "ambience", mentions: 4, review_percent: 8, avg_sentiment_score: 0.875, cx_score: 94, positive_percent: 100, neutral_percent: 0, mixed_percent: 0, negative_percent: 0, complaint_mentions: 0, trend: "new" },
    { aspect: "value", mentions: 3, review_percent: 6, avg_sentiment_score: -0.15, cx_score: 42, positive_percent: 33.3, neutral_percent: 0, mixed_percent: 0, negative_percent: 66.7, complaint_mentions: 2, trend: "new" },
    { aspect: "wait_time", mentions: 3, review_percent: 6, avg_sentiment_score: -0.767, cx_score: 12, positive_percent: 0, neutral_percent: 0, mixed_percent: 0, negative_percent: 100, complaint_mentions: 3, trend: "new" },
    { aspect: "accessibility", mentions: 2, review_percent: 4, avg_sentiment_score: 0.4, cx_score: 70, positive_percent: 50, neutral_percent: 50, mixed_percent: 0, negative_percent: 0, complaint_mentions: 0, trend: "new" },
    { aspect: "wayfinding", mentions: 2, review_percent: 4, avg_sentiment_score: 0.075, cx_score: 54, positive_percent: 50, neutral_percent: 0, mixed_percent: 0, negative_percent: 50, complaint_mentions: 1, trend: "new" },
    { aspect: "safety", mentions: 1, review_percent: 2, avg_sentiment_score: 0.85, cx_score: 92, positive_percent: 100, neutral_percent: 0, mixed_percent: 0, negative_percent: 0, complaint_mentions: 0, trend: "new" },
  ],
};
