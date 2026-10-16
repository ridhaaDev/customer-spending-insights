"use client";

import { useQuery } from "@tanstack/react-query";
import { AddBudgetDialog } from "@/components/goals/AddBudgetDialog";
import { BudgetSummaryCard } from "@/components/goals/BudgetSummaryCard";
import { GoalsPanel } from "@/components/goals/GoalsPanel";
import { PageHeader } from "@/components/ui";
import { filtersQuery, goalsQuery } from "@/lib/queries";
import { PageFrame } from "./PageFrame";

export function BudgetsPage({ customerId }: { customerId: string }) {
  const filters = useQuery(filtersQuery(customerId));
  const goals = useQuery(goalsQuery(customerId));
  return (
    <PageFrame>
      <PageHeader
        title="Budgets"
        description="Monthly spending limits per category, with a status that is never colour alone."
        action={
          <AddBudgetDialog
            customerId={customerId}
            categories={filters.data?.categories}
            budgeted={goals.data?.goals.map((g) => g.category)}
          />
        }
      />
      <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
        <div>
          <BudgetSummaryCard goals={goals.data?.goals} />
        </div>
        <GoalsPanel
          data={goals.data}
          categories={filters.data?.categories}
          loading={goals.isFetching && !!goals.data}
          error={goals.error}
          onRetry={goals.refetch}
        />
      </div>
    </PageFrame>
  );
}
