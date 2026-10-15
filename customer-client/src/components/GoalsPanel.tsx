import { CircleAlert, CircleCheck, TriangleAlert } from "lucide-react";
import { formatPercent, formatZAR } from "@/lib/format";
import type { CategoryFilter, Goal, GoalList, GoalStatus } from "@/lib/types";
import { CategoryChip } from "./CategoryIcon";
import { Card, CardHeader, EmptyState, ErrorState, Refreshing, Skeleton } from "./ui";

interface Props {
  data: GoalList | undefined;
  categories: CategoryFilter[] | undefined;
  loading: boolean;
  error: Error | null;
  onRetry: () => void;
}

// Status is never colour alone: each state ships an icon and a label.
const STATUS: Record<GoalStatus, { label: string; bar: string; text: string; Icon: typeof CircleCheck }> = {
  on_track: { label: "On track", bar: "bg-accent", text: "text-ink-secondary", Icon: CircleCheck },
  warning: { label: "Near limit", bar: "bg-warning", text: "text-ink-secondary", Icon: TriangleAlert },
  exceeded: { label: "Over budget", bar: "bg-critical", text: "text-critical", Icon: CircleAlert },
};

function GoalRow({ goal, meta }: { goal: Goal; meta: CategoryFilter | undefined }) {
  const s = STATUS[goal.status];
  const pct = Math.min(goal.percentageUsed, 100);
  return (
    <li className="py-3">
      <div className="flex items-center gap-3">
        <CategoryChip icon={meta?.icon ?? ""} color={meta?.color ?? "var(--ink-muted)"} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <p className="truncate text-sm font-medium text-ink">{goal.category}</p>
            <p className="shrink-0 text-sm tabular-nums text-ink">
              {formatZAR(goal.currentSpent, { whole: true })}
              <span className="text-ink-muted"> / {formatZAR(goal.monthlyBudget, { whole: true })}</span>
            </p>
          </div>
          <div
            className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-line"
            role="meter"
            aria-label={`${goal.category} budget used`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pct)}
          >
            <div className={`h-full rounded-full ${s.bar}`} style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-1.5 flex items-center justify-between text-xs">
            <span className={`inline-flex items-center gap-1 ${s.text}`}>
              <s.Icon className="h-3.5 w-3.5" aria-hidden />
              {s.label} · {formatPercent(goal.percentageUsed, 0)} used
            </span>
            <span className="text-ink-muted">{goal.daysRemaining} days left</span>
          </div>
        </div>
      </div>
    </li>
  );
}

export function GoalsPanel({ data, categories, loading, error, onRetry }: Props) {
  const byName = new Map(categories?.map((c) => [c.name, c]));
  return (
    <Card>
      <CardHeader title="Monthly budgets" subtitle="Spend so far this month against each goal" />
      {error && !data ? (
        <ErrorState message={error.message} onRetry={onRetry} />
      ) : !data ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : data.goals.length === 0 ? (
        <EmptyState message="No budgets set." />
      ) : (
        <Refreshing loading={loading}>
          <ul className="divide-y divide-line">
            {data.goals.map((g) => (
              <GoalRow key={g.id} goal={g} meta={byName.get(g.category)} />
            ))}
          </ul>
        </Refreshing>
      )}
    </Card>
  );
}
