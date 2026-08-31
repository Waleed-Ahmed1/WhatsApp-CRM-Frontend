// Shared Recharts styling so every panel reads as one system and matches the
// app's existing palette. Imported by all chart components.

export const COLORS = {
  incoming: "#0EA894",
  outgoing: "#0B6F60",
  failed: "#DC2626",
  accent: "#0EA894",
  primary: "#0B6F60",
  grid: "#E5E7EB",
  axis: "#6B7280",
};

export const gridProps = {
  stroke: COLORS.grid,
  strokeDasharray: "3 3",
  vertical: false,
};

export const axisProps = {
  tick: { fill: COLORS.axis, fontSize: 12 },
  axisLine: false,
  tickLine: false,
};

// Mirrors the app's card styling so hover cards feel native rather than
// like a third-party default.
export const tooltipProps = {
  contentStyle: {
    background: "#ffffff",
    border: "1px solid #E5E7EB",
    borderRadius: 14,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    fontSize: 12,
  },
  labelStyle: { color: "#1F2937", fontWeight: 600, marginBottom: 2 },
  cursor: { fill: "rgba(14,168,148,0.06)" },
};

// Forcing every tick (interval=0) only stays readable up to about a
// week's worth of labels; beyond that, adjacent "Aug 2Aug 3…" labels run
// into each other with no gap. Skip ticks so roughly 8-10 labels are
// ever drawn, regardless of the range length.
export const dateAxisInterval = (days) => {
  if (days <= 8) return 0;
  return Math.ceil(days / 8) - 1;
};

// "2026-08-01" -> "1 Aug". Parsed as UTC to match how the API bucketed it.
export const shortDate = (value) => {
  if (typeof value !== "string") return value;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
};
