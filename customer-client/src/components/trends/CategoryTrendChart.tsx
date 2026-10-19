"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatMonth } from "@/lib/format";
import type { CategoryTrends } from "@/lib/types";
import { type CategorySeriesRow, categorySeries } from "./category-series";
import { CategoryTrendTooltip } from "./CategoryTrendTooltip";
import { ChartLegend } from "./ChartLegend";
import { tooltipCursor, xAxisProps, yAxisProps } from "./chart-axes";

interface Props {
  data: CategoryTrends;
  label: string;
}

// Stacked bars: the biggest category sits at the bottom so its height is read against the axis.
export function CategoryTrendChart({ data, label }: Props) {
  const { series, rows } = categorySeries(data);
  const currentMonth = rows.at(-1)?.month;
  return (
    <>
      <div className="h-64 w-full" role="img" aria-label={label}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} margin={{ top: 12, right: 4, bottom: 0, left: 4 }} barCategoryGap="35%">
            <CartesianGrid vertical={false} stroke="var(--line)" />
            <XAxis dataKey="month" tickFormatter={(m: string) => formatMonth(m)} {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip cursor={tooltipCursor} content={<CategoryTrendTooltip series={series} currentMonth={currentMonth} />} />
            {series.map((s, i) => (
              <Bar
                key={s.name}
                name={s.name}
                dataKey={(row: CategorySeriesRow) => row.values[s.name] ?? 0}
                stackId="spend"
                fill={s.color}
                stroke="var(--card)"
                strokeWidth={1}
                radius={i === series.length - 1 ? [4, 4, 0, 0] : 0}
                maxBarSize={28}
                isAnimationActive={false}
              >
                {rows.map((r) => (
                  // The in-progress month is lighter so it isn't read as a drop.
                  <Cell key={r.month} fillOpacity={r.month === currentMonth ? 0.55 : 1} />
                ))}
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ChartLegend series={series} />
      <p className="mt-2 text-xs text-ink-muted">Lighter bar is the current month to date.</p>
    </>
  );
}
