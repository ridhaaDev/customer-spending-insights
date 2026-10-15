"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PeriodSelector } from "@/components/dashboard/PeriodSelector";
import { SummaryCards } from "@/components/summary/SummaryCards";
import { RecentTransactions } from "@/components/transactions/RecentTransactions";
import { useDashboard } from "@/context/DashboardContext";
import { useQuery } from "@/hooks/useQuery";
import { api } from "@/lib/api";
import { PageFrame } from "./PageFrame";

export function OverviewPage() {
  const { period, setPeriod } = useDashboard();
  return (
    <PageFrame>
      {(customerId) => {
        const enabled = customerId !== null;
        const cid = customerId ?? "";
        return <Overview cid={cid} enabled={enabled} period={period} setPeriod={setPeriod} />;
      }}
    </PageFrame>
  );
}

interface Props {
  cid: string;
  enabled: boolean;
  period: ReturnType<typeof useDashboard>["period"];
  setPeriod: ReturnType<typeof useDashboard>["setPeriod"];
}

function Overview({ cid, enabled, period, setPeriod }: Props) {
  const profile = useQuery(`profile:${cid}`, (s) => api.profile(cid, s), { enabled });
  const filters = useQuery(`filters:${cid}`, (s) => api.filters(cid, s), { enabled });
  const summary = useQuery(`summary:${cid}:${period}`, (s) => api.summary(cid, period, s), { enabled });
  return (
    <>
      <DashboardHeader profile={profile.data} error={profile.error} onRetry={profile.refetch} />
      <PeriodSelector value={period} onChange={setPeriod} presets={filters.data?.dateRangePresets} />
      <SummaryCards summary={summary.data} period={period} loading={summary.loading} error={summary.error} onRetry={summary.refetch} />
      {enabled && <RecentTransactions key={cid} customerId={cid} />}
    </>
  );
}
