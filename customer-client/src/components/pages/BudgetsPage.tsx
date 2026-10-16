"use client";

import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Link from "next/link";
import { BudgetSummaryCard } from "@/components/goals/BudgetSummaryCard";
import { GoalsPanel } from "@/components/goals/GoalsPanel";
import { PageHeader } from "@/components/ui";
import { customerPath } from "@/lib/params";
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
          <Link
            href={`${customerPath(customerId, "budgets")}/new`}
            className="inline-flex items-center gap-1.5 rounded-md bg-ink px-3 py-1.5 text-sm font-medium text-card hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Plus className="h-4 w-4" aria-hidden /> Add budget
          </Link>
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
