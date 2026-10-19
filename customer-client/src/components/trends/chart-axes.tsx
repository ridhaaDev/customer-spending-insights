import { formatZAR } from "@/lib/format";

// Shared axis props so every trend chart reads the same way.
export const xAxisProps = {
  axisLine: false,
  tickLine: false,
  tick: { fill: "var(--ink-muted)", fontSize: 12 },
  interval: "preserveStartEnd" as const,
  minTickGap: 12,
};

export const yAxisProps = {
  tickFormatter: (v: number) => formatZAR(v, { compact: true }),
  axisLine: false,
  tickLine: false,
  width: 56,
  tick: { fill: "var(--ink-muted)", fontSize: 12 },
  // Headroom so a peak label above the tallest bar clears the top gridline.
  padding: { top: 16 },
};

export const CHART_HEIGHT = "h-72 w-full";

export const tooltipCursor = { fill: "var(--line)", fillOpacity: 0.5 };
