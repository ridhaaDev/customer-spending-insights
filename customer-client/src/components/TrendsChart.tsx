"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatInteger, formatMonth, formatZAR } from "@/lib/format";
import type { MonthTrend, SpendingTrends } from "@/lib/types";
import { Card, CardHeader, EmptyState, ErrorState, Refreshing, Skeleton } from "./ui";

interface Props {
  data: SpendingTrends | undefined;
  months: number;
  loading: boolean;
  error: Error | null;
  onRetry: () => void;
}

interface TooltipProps {
  active?: boolean;
  payload?: ReadonlyArray<{ payload: MonthTrend }>;
  currentMonth?: string;
}

function TrendTooltip({ active, payload, currentMonth }: TooltipProps) {
  const row = payload?.[0]?.payload;
  if (!active || !row) return null;
  return (
    <div className="rounded-lg border border-line bg-card px-3 py-2 text-sm shadow-sm">
      <p className="font-medium text-ink">
        {formatMonth(row.month, "long")}
        {row.month === currentMonth && <span className="ml-1 text-xs font-normal text-ink-muted">(month to date)</span>}
      </p>
      <p className="mt-1 tabular-nums text-ink">
        <strong className="font-semibold">{formatZAR(row.totalSpent)}</strong>
        <span className="text-ink-muted"> spent</span>
      </p>
      <p className="tabular-nums text-ink-secondary">
        {formatInteger(row.transactionCount)} transactions · avg {formatZAR(row.averageTransaction)}
      </p>
    </div>
  );
}

interface PeakLabelProps {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  index?: number;
  value?: number | string;
  peakIndex: number;
}

/** Direct-label only the peak month; the axis and tooltip carry the rest. */
function PeakLabel({ x, y, width, index, value, peakIndex }: PeakLabelProps) {
  if (index !== peakIndex || x === undefined || y === undefined || width === undefined) return null;
  return (
    <text x={Number(x) + Number(width) / 2} y={Number(y) - 6} textAnchor="middle" className="fill-ink-secondary text-xs tabular-nums">
      {formatZAR(Number(value), { compact: true })}
    </text>
  );
}

export function TrendsChart({ data, months, loading, error, onRetry }: Props) {
  const [view, setView] = useState<"chart" | "table">("chart");
  const trends = data?.trends ?? [];
  const currentMonth = trends.at(-1)?.month;
  const peakIndex = trends.reduce((best, t, i) => (t.totalSpent > (trends[best]?.totalSpent ?? -1) ? i : best), 0);

  const toggle = data && trends.length > 0 && (
    <button
      type="button"
      onClick={() => setView(view === "chart" ? "table" : "chart")}
      className="rounded-md border border-line px-2.5 py-1 text-xs font-medium text-ink-secondary hover:bg-surface"
      aria-pressed={view === "table"}
    >
      {view === "chart" ? "Table" : "Chart"}
    </button>
  );

  return (
    <Card>
      <CardHeader title="Monthly spending" subtitle={`Last ${months} months`} action={toggle} />
      {error && !data ? (
        <ErrorState message={error.message} onRetry={onRetry} />
      ) : !data ? (
        <Skeleton className="h-64 w-full" />
      ) : trends.length === 0 ? (
        <EmptyState message="No history yet." />
      ) : view === "table" ? (
        <Refreshing loading={loading}>
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-ink-muted">
              <tr>
                <th className="py-1.5 font-medium">Month</th>
                <th className="py-1.5 text-right font-medium">Spent</th>
                <th className="py-1.5 text-right font-medium">Transactions</th>
                <th className="py-1.5 text-right font-medium">Average</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line tabular-nums">
              {trends.map((t) => (
                <tr key={t.month}>
                  <td className="py-1.5 text-ink">{formatMonth(t.month, "long")}</td>
                  <td className="py-1.5 text-right text-ink">{formatZAR(t.totalSpent)}</td>
                  <td className="py-1.5 text-right text-ink-secondary">{formatInteger(t.transactionCount)}</td>
                  <td className="py-1.5 text-right text-ink-secondary">{formatZAR(t.averageTransaction)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Refreshing>
      ) : (
        <Refreshing loading={loading}>
          <div className="h-64 w-full" role="img" aria-label={`Bar chart of total spending per month for the last ${months} months`}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trends} margin={{ top: 20, right: 4, bottom: 0, left: 4 }} barCategoryGap="35%">
                <CartesianGrid vertical={false} stroke="var(--line)" />
                <XAxis
                  dataKey="month"
                  tickFormatter={(m: string) => formatMonth(m)}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--ink-muted)", fontSize: 12 }}
                  interval="preserveStartEnd"
                  minTickGap={12}
                />
                <YAxis
                  tickFormatter={(v: number) => formatZAR(v, { compact: true })}
                  axisLine={false}
                  tickLine={false}
                  width={56}
                  tick={{ fill: "var(--ink-muted)", fontSize: 12 }}
                />
                <Tooltip cursor={{ fill: "var(--line)", fillOpacity: 0.5 }} content={<TrendTooltip currentMonth={currentMonth} />} />
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
        </Refreshing>
      )}
    </Card>
  );
}
