import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { formatChange, formatInteger, formatZAR, PERIOD_LABEL } from "@/lib/format";
import type { Period, SpendingSummary } from "@/lib/types";
import { ErrorState, Refreshing, Skeleton } from "./ui";

interface Props {
  summary: SpendingSummary | undefined;
  period: Period;
  loading: boolean;
  error: Error | null;
  onRetry: () => void;
}

function Delta({ value }: { value: number | null }) {
  if (value === null) return <span className="text-ink-muted">no prior data</span>;
  // Spending more is not "good", so the arrow is neutral ink; only the direction is shown.
  const Icon = value > 0 ? ArrowUpRight : value < 0 ? ArrowDownRight : Minus;
  return (
    <span className="inline-flex items-center gap-0.5 text-ink-secondary">
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {formatChange(value)}
    </span>
  );
}

function Tile({ label, value, foot }: { label: string; value: string; foot: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-card p-5">
      <p className="text-sm text-ink-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{value}</p>
      <p className="mt-1 text-xs text-ink-muted">{foot}</p>
    </div>
  );
}

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
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="rounded-xl border border-line bg-card p-5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-3 h-8 w-32" />
            <Skeleton className="mt-3 h-3 w-20" />
          </div>
        ))}
      </div>
    );
  }
  const vs = `vs previous ${PERIOD_LABEL[period]}`;
  return (
    <Refreshing loading={loading}>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tile
          label="Total spent"
          value={formatZAR(summary.totalSpent, { whole: true })}
          foot={
            <>
              <Delta value={summary.comparedToPrevious.spentChange} /> {vs}
            </>
          }
        />
        <Tile
          label="Transactions"
          value={formatInteger(summary.transactionCount)}
          foot={
            <>
              <Delta value={summary.comparedToPrevious.transactionChange} /> {vs}
            </>
          }
        />
        <Tile label="Average transaction" value={formatZAR(summary.averageTransaction)} foot={`over the last ${PERIOD_LABEL[period]}`} />
        <Tile label="Top category" value={summary.topCategory ?? "—"} foot="by amount spent" />
      </div>
    </Refreshing>
  );
}
