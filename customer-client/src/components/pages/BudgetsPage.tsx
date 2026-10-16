"use client";

import { useQuery } from "@tanstack/react-query";
import { GoalsPanel } from "@/components/goals/GoalsPanel";
import { PageHeader } from "@/components/ui";
import { filtersQuery, goalsQuery } from "@/lib/queries";
import { PageFrame } from "./PageFrame";

export function BudgetsPage({ customerId }: { customerId: string }) {
  const filters = useQuery(filtersQuery(customerId));
  const goals = useQuery(goalsQuery(customerId));
  return (
    <PageFrame>
      <PageHeader title="Budgets" description="Monthly spending limits per category, with a status that is never colour alone." />
      <div className="max-w-2xl">
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
