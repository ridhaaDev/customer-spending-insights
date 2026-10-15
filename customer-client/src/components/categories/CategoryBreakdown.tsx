import { Card, CardHeader, EmptyState, ErrorState, Refreshing, Skeleton } from "@/components/ui";
import { formatDate, formatZAR } from "@/lib/format";
import type { SpendingByCategory } from "@/lib/types";
import { CategoryRow } from "./CategoryRow";
import { ShareBar } from "./ShareBar";

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
          <ShareBar segments={data.categories} label="Share of spending by category" />
          <ul className="mt-4 divide-y divide-line">
            {data.categories.map((c) => (
              <CategoryRow key={c.name} category={c} maxAmount={data.categories[0].amount} />
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
