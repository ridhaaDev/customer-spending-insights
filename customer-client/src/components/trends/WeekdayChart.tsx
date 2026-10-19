"use client";

import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { WeekdaySpend } from "@/lib/types";
import { tooltipCursor, xAxisProps, yAxisProps } from "./chart-axes";
import { PeakLabel } from "./PeakLabel";
import { WeekdayTooltip } from "./WeekdayTooltip";

interface Props {
  weekdays: WeekdaySpend[];
  label: string;
}

// Average spend per occurrence of each weekday, so a window with more Mondays than Sundays compares fairly.
export function WeekdayChart({ weekdays, label }: Props) {
  const peakIndex = weekdays.reduce((best, w, i) => (w.averagePerDay > (weekdays[best]?.averagePerDay ?? -1) ? i : best), 0);
  return (
    <>
      <div className="h-64 w-full" role="img" aria-label={label}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weekdays} margin={{ top: 20, right: 4, bottom: 0, left: 4 }} barCategoryGap="35%">
            <CartesianGrid vertical={false} stroke="var(--line)" />
            <XAxis dataKey="weekday" tickFormatter={(d: string) => d.slice(0, 3)} {...xAxisProps} interval={0} />
            <YAxis {...yAxisProps} />
            <Tooltip cursor={tooltipCursor} content={<WeekdayTooltip />} />
            <Bar dataKey="averagePerDay" fill="var(--accent)" radius={[4, 4, 0, 0]} maxBarSize={36} isAnimationActive={false}>
              <LabelList dataKey="averagePerDay" content={<PeakLabel peakIndex={peakIndex} />} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-xs text-ink-muted">Average spend per day of the week across the window.</p>
    </>
  );
}
