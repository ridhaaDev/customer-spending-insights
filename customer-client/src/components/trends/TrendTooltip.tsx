import { formatInteger, formatMonth, formatZAR } from "@/lib/format";
import type { MonthTrend } from "@/lib/types";

// Recharts clones this element with `active` and `payload`; `currentMonth` is passed by us.
export interface TrendTooltipProps {
  active?: boolean;
  payload?: ReadonlyArray<{ payload: MonthTrend }>;
  currentMonth?: string;
}

export function TrendTooltip({ active, payload, currentMonth }: TrendTooltipProps) {
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
