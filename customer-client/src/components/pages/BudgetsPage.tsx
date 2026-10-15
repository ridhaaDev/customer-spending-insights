"use client";

import { GoalsPanel } from "@/components/goals/GoalsPanel";
import { PageHeader } from "@/components/ui";
import { useQuery } from "@/hooks/useQuery";
import { api } from "@/lib/api";
import { PageFrame } from "./PageFrame";

export function BudgetsPage() {
  return <PageFrame>{(customerId) => <Budgets cid={customerId ?? ""} enabled={customerId !== null} />}</PageFrame>;
}

function Budgets({ cid, enabled }: { cid: string; enabled: boolean }) {
  const filters = useQuery(`filters:${cid}`, (s) => api.filters(cid, s), { enabled });
  const goals = useQuery(`goals:${cid}`, (s) => api.goals(cid, s), { enabled });
  return (
    <>
      <PageHeader title="Budgets" description="Monthly spending limits per category, with a status that is never colour alone." />
      <div className="max-w-2xl">
        <GoalsPanel data={goals.data} categories={filters.data?.categories} loading={goals.loading} error={goals.error} onRetry={goals.refetch} />
      </div>
    </>
  );
}
