import { ErrorState, Refreshing } from "@/components/ui";
import { formatInteger, formatZAR, PERIOD_LABEL } from "@/lib/format";
import type { Period, SpendingSummary } from "@/lib/types";
import { DeltaBadge } from "./DeltaBadge";
import { StatTile, StatTileSkeleton } from "./StatTile";

interface Props {
  summary: SpendingSummary | undefined;
  period: Period;
  loading: boolean;
  error: Error | null;
  onRetry: () => void;
}

const grid = "grid grid-cols-2 gap-3 lg:grid-cols-4";

export function SummaryCards({ summary, period, loading, error, onRetry }: Props) {
  if (error && !summary) {
    return (
      <div className="rounded-xl border border-line bg-card">
        <ErrorState message={`Could not load the summary: ${error.message}`} onRetry={onRetry} />
      </div>
    );
  }
  if (!summary) {
    return (
      <div className={grid}>
        {Array.from({ length: 4 }, (_, i) => (
          <StatTileSkeleton key={i} />
        ))}
      </div>
    );
  }
  const vs = `vs previous ${PERIOD_LABEL[period]}`;
  return (
    <Refreshing loading={loading}>
      <div className={grid}>
        <StatTile
          label="Total spent"
          value={formatZAR(summary.totalSpent, { whole: true })}
          foot={
            <>
              <DeltaBadge value={summary.comparedToPrevious.spentChange} /> {vs}
            </>
          }
        />
        <StatTile
          label="Transactions"
          value={formatInteger(summary.transactionCount)}
          foot={
            <>
              <DeltaBadge value={summary.comparedToPrevious.transactionChange} /> {vs}
            </>
          }
        />
        <StatTile
          label="Average transaction"
          value={formatZAR(summary.averageTransaction)}
          foot={`over the last ${PERIOD_LABEL[period]}`}
        />
        <StatTile label="Top category" value={summary.topCategory ?? "—"} foot="by amount spent" />
      </div>
    </Refreshing>
  );
}
