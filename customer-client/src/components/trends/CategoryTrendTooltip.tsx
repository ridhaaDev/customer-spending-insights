import { formatMonth, formatZAR } from "@/lib/format";
import type { CategoryFilter } from "@/lib/types";
import type { CategorySeriesRow } from "./category-series";

interface Props {
  active?: boolean;
  payload?: ReadonlyArray<{ payload: CategorySeriesRow }>;
  series: CategoryFilter[];
  currentMonth?: string;
}

export function CategoryTrendTooltip({ active, payload, series, currentMonth }: Props) {
  const row = payload?.[0]?.payload;
  if (!active || !row) return null;
  const present = series.filter((s) => (row.values[s.name] ?? 0) > 0);
  return (
    <div className="rounded-lg border border-line bg-card px-3 py-2 text-sm shadow-sm">
      <p className="font-medium text-ink">
        {formatMonth(row.month, "long")}
        {row.month === currentMonth && <span className="ml-1 text-xs font-normal text-ink-muted">(month to date)</span>}
      </p>
      <ul className="mt-1 space-y-0.5 tabular-nums">
        {present.map((s) => (
          <li key={s.name} className="flex items-center justify-between gap-4 text-ink-secondary">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: s.color }} aria-hidden />
              {s.name}
            </span>
            <span>{formatZAR(row.values[s.name] ?? 0)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-1 flex justify-between gap-4 border-t border-line pt-1 tabular-nums text-ink">
        <span className="text-ink-muted">Total</span>
        <strong className="font-semibold">{formatZAR(row.totalSpent)}</strong>
      </p>
    </div>
  );
}
