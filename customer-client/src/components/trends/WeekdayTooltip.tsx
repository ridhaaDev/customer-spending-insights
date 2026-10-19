import { formatInteger, formatZAR } from "@/lib/format";
import type { WeekdaySpend } from "@/lib/types";

interface Props {
  active?: boolean;
  payload?: ReadonlyArray<{ payload: WeekdaySpend }>;
}

export function WeekdayTooltip({ active, payload }: Props) {
  const row = payload?.[0]?.payload;
  if (!active || !row) return null;
  return (
    <div className="rounded-lg border border-line bg-card px-3 py-2 text-sm shadow-sm">
      <p className="font-medium text-ink">{row.weekday}s</p>
      <p className="mt-1 tabular-nums text-ink">
        <strong className="font-semibold">{formatZAR(row.averagePerDay)}</strong>
        <span className="text-ink-muted"> per day on average</span>
      </p>
      <p className="tabular-nums text-ink-secondary">
        {formatZAR(row.totalSpent)} total · {formatInteger(row.transactionCount)} transactions
      </p>
    </div>
  );
}
