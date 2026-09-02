// Design tokens — matched to the source PDF mock:
// blue header bar, near-black navy body, colored KPI card outlines
// (blue / green / orange / purple).
export const C = {
  bg: "#0B1220",
  panel: "#111A2E",
  panelBorder: "#1E2A44",
  // headerBlue: "#1E48E0",
  headerBlue: "#07195b",
  text: "#EAF0FA",
  textDim: "#8B96AC",

  blue: "#2F6FED",
  blueBg: "#12203F",

  green: "#22C55E",
  greenBg: "#0F2A1D",

  orange: "#F5A623",
  orangeBg: "#2E2109",

  purple: "#8B5CF6",
  purpleBg: "#22183F",

  red: "#EF4444",
  redBg: "#2E1414",
};

export const SENTIMENT_COLOR = {
  positive: C.green,
  neutral: C.orange,
  mixed: C.purple,
  negative: C.red,
};
