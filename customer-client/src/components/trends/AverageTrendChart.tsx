"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatMonth } from "@/lib/format";
import type { MonthTrend } from "@/lib/types";
import { xAxisProps, yAxisProps } from "./chart-axes";
import { TrendTooltip } from "./TrendTooltip";

interface Props {
  trends: MonthTrend[];
  label: string;
}

// Average transaction size per month: a line, because it is a rate rather than a quantity.
export function AverageTrendChart({ trends, label }: Props) {
  const currentMonth = trends.at(-1)?.month;
  return (
    <>
      <div className="h-64 w-full" role="img" aria-label={label}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trends} margin={{ top: 20, right: 8, bottom: 0, left: 4 }}>
            <CartesianGrid vertical={false} stroke="var(--line)" />
            <XAxis dataKey="month" tickFormatter={(m: string) => formatMonth(m)} {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip cursor={{ stroke: "var(--line-strong)" }} content={<TrendTooltip currentMonth={currentMonth} />} />
            <Line
              type="monotone"
              dataKey="averageTransaction"
              stroke="var(--accent)"
              strokeWidth={2}
              dot={{ r: 3, fill: "var(--accent)", strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "var(--accent)", stroke: "var(--card)", strokeWidth: 2 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-xs text-ink-muted">Average spend per transaction; the last point is the current month to date.</p>
    </>
  );
}
