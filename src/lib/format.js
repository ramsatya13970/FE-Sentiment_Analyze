export function pretty(aspect = "") {
  return aspect.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function complaintBarColor(pct, C) {
  if (pct >= 30) return C.red;
  if (pct >= 18) return C.orange;
  return C.green;
}

export function trendLabel(t, C) {
  if (!t) return { label: "—", color: C.textDim, arrow: "" };
  const v = String(t).toLowerCase();
  if (v.includes("improv") || v.includes("up")) return { label: "Improving", color: C.green, arrow: "↑" };
  if (v.includes("worsen") || v.includes("down")) return { label: "Worsening", color: C.red, arrow: "↓" };
  if (v.includes("stable")) return { label: "Stable", color: C.orange, arrow: "→" };
  return { label: pretty(t), color: C.blue, arrow: "•" };
}

export function formatDate(date = new Date()) {
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
