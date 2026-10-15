import { CategoryChip } from "@/components/category/CategoryChip";
import { formatPercent, formatZAR } from "@/lib/format";
import type { CategoryFilter, Goal } from "@/lib/types";
import { GoalMeter } from "./GoalMeter";
import { StatusBadge } from "./StatusBadge";

interface Props {
  goal: Goal;
  meta: CategoryFilter | undefined;
}

export function GoalRow({ goal, meta }: Props) {
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
          <div className="mt-1.5">
            <GoalMeter percentageUsed={goal.percentageUsed} status={goal.status} label={`${goal.category} budget used`} />
          </div>
          <div className="mt-1.5 flex items-center justify-between text-xs">
            <StatusBadge status={goal.status} detail={`${formatPercent(goal.percentageUsed, 0)} used`} />
            <span className="text-ink-muted">{goal.daysRemaining} days left</span>
          </div>
        </div>
      </div>
    </li>
  );
}
