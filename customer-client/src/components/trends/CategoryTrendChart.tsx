"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { formatBucket } from "@/lib/format";
import type { CategoryTrends } from "@/lib/types";
import { categoryRowsToQuarters, COLLAPSE_ABOVE, PHONE_QUERY } from "./buckets";
import { type CategorySeriesRow, categorySeries } from "./category-series";
import { CategoryTrendTooltip } from "./CategoryTrendTooltip";
import { ChartLegend } from "./ChartLegend";
import { CHART_HEIGHT, tooltipCursor, xAxisProps, yAxisProps } from "./chart-axes";

interface Props {
  data: CategoryTrends;
  label: string;
}

// Stacked bars: the biggest category sits at the bottom so its height is read against the axis.
// Legend entries toggle their series so one category can be isolated.
export function CategoryTrendChart({ data, label }: Props) {
  const { series, rows: monthly } = categorySeries(data);
  const quarters = useMediaQuery(PHONE_QUERY) && monthly.length > COLLAPSE_ABOVE;
  const rows = quarters ? categoryRowsToQuarters(monthly) : monthly;
  const current = rows.at(-1)?.month;
  const [hidden, setHidden] = useState<ReadonlySet<string>>(new Set());
  const visible = series.filter((s) => !hidden.has(s.name));
  const toggle = (name: string) =>
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  const topVisible = visible.at(-1)?.name;
  return (
    <>
      <div className={CHART_HEIGHT} role="img" aria-label={label}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} margin={{ top: 12, right: 4, bottom: 0, left: 4 }} barCategoryGap="35%">
            <CartesianGrid vertical={false} stroke="var(--line)" />
            <XAxis dataKey="month" tickFormatter={(m: string) => formatBucket(m)} {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip cursor={tooltipCursor} content={<CategoryTrendTooltip series={visible} allSeries={series.length} currentMonth={current} />} />
            {series.map((s) => (
              <Bar
                key={s.name}
                name={s.name}
                dataKey={(row: CategorySeriesRow) => row.values[s.name] ?? 0}
                stackId="spend"
                hide={hidden.has(s.name)}
                fill={s.color}
                stroke="var(--card)"
                strokeWidth={1}
                radius={s.name === topVisible ? [4, 4, 0, 0] : 0}
                maxBarSize={28}
                isAnimationActive={false}
              >
                {rows.map((r) => (
                  // The in-progress period is lighter so it isn't read as a drop.
                  <Cell key={r.month} fillOpacity={r.month === current ? 0.55 : 1} />
                ))}
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ChartLegend series={series} hidden={hidden} onToggle={toggle} onShowAll={() => setHidden(new Set())} />
      <p className="mt-2 text-xs text-ink-muted">
        {quarters ? "Shown by quarter on small screens. " : ""}Lighter bar is the current {quarters ? "quarter" : "month"} to date. Click a legend entry to hide it.
      </p>
    </>
  );
}
