"use client";

import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatMonth } from "@/lib/format";
import type { MonthTrend } from "@/lib/types";
import { tooltipCursor, xAxisProps, yAxisProps } from "./chart-axes";
import { PeakLabel } from "./PeakLabel";
import { TrendTooltip } from "./TrendTooltip";

interface Props {
  trends: MonthTrend[];
  label: string;
}

export function TrendsBarChart({ trends, label }: Props) {
  const currentMonth = trends.at(-1)?.month;
  const peakIndex = trends.reduce((best, t, i) => (t.totalSpent > (trends[best]?.totalSpent ?? -1) ? i : best), 0);
  return (
    <>
      <div className="h-64 w-full" role="img" aria-label={label}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={trends} margin={{ top: 20, right: 4, bottom: 0, left: 4 }} barCategoryGap="35%">
            <CartesianGrid vertical={false} stroke="var(--line)" />
            <XAxis dataKey="month" tickFormatter={(m: string) => formatMonth(m)} {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip cursor={tooltipCursor} content={<TrendTooltip currentMonth={currentMonth} />} />
            <Bar dataKey="totalSpent" fill="var(--accent)" radius={[4, 4, 0, 0]} maxBarSize={28} isAnimationActive={false}>
              {trends.map((t) => (
                // The in-progress month is lighter so it isn't read as a drop.
                <Cell key={t.month} fill={t.month === currentMonth ? "var(--accent-soft)" : "var(--accent)"} />
              ))}
              <LabelList dataKey="totalSpent" content={<PeakLabel peakIndex={peakIndex} />} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-xs text-ink-muted">Lighter bar is the current month to date.</p>
    </>
  );
}
