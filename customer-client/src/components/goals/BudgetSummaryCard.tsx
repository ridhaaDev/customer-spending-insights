import { Card, Skeleton } from "@/components/ui";
import { formatZAR } from "@/lib/format";
import type { Goal } from "@/lib/types";
import { GoalMeter } from "./GoalMeter";
import { StatusBadge } from "./StatusBadge";

// Totals across the customer's budgets. Overspend on one category does not offset another,
// so "left" is the sum of each budget's remaining amount, floored at zero.
export function summariseBudgets(goals: Goal[]) {
  const budget = goals.reduce((s, g) => s + g.monthlyBudget, 0);
  const spent = goals.reduce((s, g) => s + g.currentSpent, 0);
  const left = goals.reduce((s, g) => s + Math.max(g.monthlyBudget - g.currentSpent, 0), 0);
  const percentageUsed = budget > 0 ? (spent / budget) * 100 : 0;
  const status = goals.some((g) => g.status === "exceeded") ? "exceeded" : percentageUsed >= 80 ? "warning" : "on_track";
  const daysRemaining = goals[0]?.daysRemaining ?? 0;
  const overBudget = goals.filter((g) => g.status === "exceeded").length;
  return { budget, spent, left, percentageUsed, status, daysRemaining, overBudget } as const;
}

export function BudgetSummaryCard({ goals }: { goals: Goal[] | undefined }) {
  if (!goals) {
    return (
      <Card>
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-3 h-8 w-40" />
        <Skeleton className="mt-4 h-1.5 w-full" />
        <Skeleton className="mt-3 h-3 w-48" />
      </Card>
    );
  }
  const s = summariseBudgets(goals);
  return (
    <Card>
      <p className="text-sm text-ink-muted">Left to spend this month</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{formatZAR(s.left, { whole: true })}</p>
      <div className="mt-4">
        <GoalMeter percentageUsed={s.percentageUsed} status={s.status} label="All budgets used" />
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs">
        <span className="text-ink-secondary">
          {formatZAR(s.spent, { whole: true })} of {formatZAR(s.budget, { whole: true })} used
        </span>
        <span className="text-ink-muted">{s.daysRemaining} days left</span>
      </div>
      <p className="mt-2 text-xs">
        <StatusBadge
          status={s.status}
          detail={s.overBudget > 0 ? `${s.overBudget} ${s.overBudget === 1 ? "budget" : "budgets"} over` : `${Math.round(s.percentageUsed)}% used`}
        />
      </p>
    </Card>
  );
}
