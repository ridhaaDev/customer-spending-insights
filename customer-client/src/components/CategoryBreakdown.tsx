import { formatDate, formatInteger, formatPercent, formatZAR } from "@/lib/format";
import type { SpendingByCategory } from "@/lib/types";
import { CategoryChip } from "./CategoryIcon";
import { Card, CardHeader, EmptyState, ErrorState, Refreshing, Skeleton } from "./ui";

interface Props {
  data: SpendingByCategory | undefined;
  loading: boolean;
  error: Error | null;
  onRetry: () => void;
}

export function CategoryBreakdown({ data, loading, error, onRetry }: Props) {
  const subtitle = data ? `${formatDate(data.dateRange.startDate)} – ${formatDate(data.dateRange.endDate)}` : undefined;
  return (
    <Card>
      <CardHeader title="Spending by category" subtitle={subtitle} />
      {error && !data ? (
        <ErrorState message={error.message} onRetry={onRetry} />
      ) : !data ? (
        <div className="space-y-3">
          <Skeleton className="h-3 w-full" />
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </div>
      ) : data.categories.length === 0 ? (
        <EmptyState message="No spending in this period." />
      ) : (
        <Refreshing loading={loading}>
          {/* Part-to-whole: one stacked bar, 2px surface gaps between segments. */}
          <div className="flex h-3 w-full gap-0.5 overflow-hidden rounded-full" role="img" aria-label="Share of spending by category">
            {data.categories.map((c) => (
              // flex-grow shares the width net of the gaps, so the smallest segment is never clipped.
              <div
                key={c.name}
                style={{ flex: `${c.percentage} 0 0`, minWidth: 2, backgroundColor: c.color }}
                title={`${c.name} ${formatPercent(c.percentage)}`}
              />
            ))}
          </div>
          <ul className="mt-4 divide-y divide-line">
            {data.categories.map((c) => (
              <li key={c.name} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 py-2.5 sm:grid-cols-[auto_minmax(0,1fr)_minmax(0,1.2fr)_auto]">
                <CategoryChip icon={c.icon} color={c.color} size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{c.name}</p>
                  <p className="text-xs text-ink-muted">{formatInteger(c.transactionCount)} transactions</p>
                </div>
                {/* Magnitude comparison: horizontal bar, same colour as the entity. */}
                <div className="hidden h-1.5 rounded-full bg-line sm:block" aria-hidden>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(c.amount / data.categories[0].amount) * 100}%`, backgroundColor: c.color }}
                  />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium tabular-nums text-ink">{formatZAR(c.amount)}</p>
                  <p className="text-xs tabular-nums text-ink-muted">{formatPercent(c.percentage)}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-3 flex justify-between border-t border-line pt-3 text-sm">
            <span className="text-ink-muted">Total</span>
            <span className="font-semibold tabular-nums text-ink">{formatZAR(data.totalAmount)}</span>
          </p>
        </Refreshing>
      )}
    </Card>
  );
}
