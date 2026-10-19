"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PeriodSelector } from "@/components/dashboard/PeriodSelector";
import { AddBudgetDialog } from "@/components/goals/AddBudgetDialog";
import { BudgetSummaryCard } from "@/components/goals/BudgetSummaryCard";
import { GoalsPanel } from "@/components/goals/GoalsPanel";
import { SummaryCards } from "@/components/summary/SummaryCards";
import { RecentTransactions } from "@/components/transactions/RecentTransactions";
import { useUrlState } from "@/hooks/useUrlState";
import { filtersQuery, goalsQuery, profileQuery, summaryQuery } from "@/lib/queries";
import { PageFrame } from "./PageFrame";

export function OverviewPage({ customerId }: { customerId: string }) {
  const { period, setPeriod } = useUrlState();
  const profile = useQuery(profileQuery(customerId));
  const filters = useQuery(filtersQuery(customerId));
  const summary = useQuery({ ...summaryQuery(customerId, period), placeholderData: keepPreviousData });
  const goals = useQuery(goalsQuery(customerId));
  return (
    <PageFrame>
      <DashboardHeader profile={profile.data} error={profile.error} onRetry={profile.refetch} />
      <PeriodSelector value={period} onChange={setPeriod} presets={filters.data?.dateRangePresets} />
      <SummaryCards
        summary={summary.data}
        period={period}
        loading={summary.isPlaceholderData}
        error={summary.error}
        onRetry={summary.refetch}
      />
      <div className="grid gap-4 lg:grid-cols-[2fr_3fr]">
        <div className="space-y-4">
          <BudgetSummaryCard goals={goals.data?.goals} />
          <GoalsPanel
          data={goals.data}
          categories={filters.data?.categories}
          loading={goals.isFetching && !!goals.data}
          error={goals.error}
          onRetry={goals.refetch}
          action={
            <AddBudgetDialog
              customerId={customerId}
              categories={filters.data?.categories}
              budgeted={goals.data?.goals.map((g) => g.category)}
              size="sm"
            />
          }
          />
        </div>
        <RecentTransactions customerId={customerId} categories={filters.data?.categories} paymentMethods={filters.data?.paymentMethods} />
      </div>
    </PageFrame>
  );
}
