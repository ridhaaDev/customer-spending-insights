"use client";

import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { formatBucket } from "@/lib/format";
import type { MonthTrend } from "@/lib/types";
import { COLLAPSE_ABOVE, monthsToQuarters, PHONE_QUERY } from "./buckets";
import { CHART_HEIGHT, tooltipCursor, xAxisProps, yAxisProps } from "./chart-axes";
import { PeakLabel } from "./PeakLabel";
import { TrendTooltip } from "./TrendTooltip";

interface Props {
  trends: MonthTrend[];
  label: string;
}

export function TrendsBarChart({ trends, label }: Props) {
  const quarters = useMediaQuery(PHONE_QUERY) && trends.length > COLLAPSE_ABOVE;
  const rows = quarters ? monthsToQuarters(trends) : trends;
  const current = rows.at(-1)?.month;
  const peakIndex = rows.reduce((best, t, i) => (t.totalSpent > (rows[best]?.totalSpent ?? -1) ? i : best), 0);
  return (
    <>
      <div className={CHART_HEIGHT} role="img" aria-label={label}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} margin={{ top: 20, right: 4, bottom: 0, left: 4 }} barCategoryGap="35%">
            <CartesianGrid vertical={false} stroke="var(--line)" />
            <XAxis dataKey="month" tickFormatter={(m: string) => formatBucket(m)} {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip cursor={tooltipCursor} content={<TrendTooltip currentMonth={current} />} />
            <Bar dataKey="totalSpent" fill="var(--accent)" radius={[4, 4, 0, 0]} maxBarSize={28} isAnimationActive={false}>
              {rows.map((t) => (
                // The in-progress period is lighter so it isn't read as a drop.
                <Cell key={t.month} fill={t.month === current ? "var(--accent-soft)" : "var(--accent)"} />
              ))}
              <LabelList dataKey="totalSpent" content={<PeakLabel peakIndex={peakIndex} />} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-xs text-ink-muted">
        {quarters ? "Shown by quarter on small screens. " : ""}Lighter bar is the current {quarters ? "quarter" : "month"} to date.
      </p>
    </>
  );
}
