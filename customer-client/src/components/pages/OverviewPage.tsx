"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PeriodSelector } from "@/components/dashboard/PeriodSelector";
import { SummaryCards } from "@/components/summary/SummaryCards";
import { RecentTransactions } from "@/components/transactions/RecentTransactions";
import { useUrlState } from "@/hooks/useUrlState";
import { filtersQuery, profileQuery, summaryQuery } from "@/lib/queries";
import { PageFrame } from "./PageFrame";

export function OverviewPage({ customerId }: { customerId: string }) {
  const { period, setPeriod } = useUrlState();
  const profile = useQuery(profileQuery(customerId));
  const filters = useQuery(filtersQuery(customerId));
  const summary = useQuery({ ...summaryQuery(customerId, period), placeholderData: keepPreviousData });
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
      <RecentTransactions customerId={customerId} />
    </PageFrame>
  );
}
