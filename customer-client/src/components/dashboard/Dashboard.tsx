"use client";

import { useState } from "react";
import { CategoryBreakdown } from "@/components/categories/CategoryBreakdown";
import { GoalsPanel } from "@/components/goals/GoalsPanel";
import { AppShell } from "@/components/nav/AppShell";
import { SummaryCards } from "@/components/summary/SummaryCards";
import { TransactionsPanel } from "@/components/transactions/TransactionsPanel";
import { TrendsChart } from "@/components/trends/TrendsChart";
import { ErrorState } from "@/components/ui";
import { useQuery } from "@/hooks/useQuery";
import { api } from "@/lib/api";
import type { Period } from "@/lib/types";
import { DashboardHeader } from "./DashboardHeader";
import { PeriodSelector } from "./PeriodSelector";

const TREND_MONTHS = 12;

export function Dashboard() {
  const customers = useQuery("customers", (signal) => api.listCustomers(signal));
  const [chosenId, setChosenId] = useState<string | null>(null);
  const [period, setPeriod] = useState<Period>("30d");
  const [section, setSection] = useState("overview");

  // Default to the first customer once the list arrives; an explicit choice wins.
  const customerId = chosenId ?? customers.data?.customers[0]?.customerId ?? null;
  const enabled = customerId !== null;
  const cid = customerId ?? "";

  const profile = useQuery(`profile:${cid}`, (s) => api.profile(cid, s), { enabled });
  const filters = useQuery(`filters:${cid}`, (s) => api.filters(cid, s), { enabled });
  const summary = useQuery(`summary:${cid}:${period}`, (s) => api.summary(cid, period, s), { enabled });
  const categories = useQuery(`categories:${cid}:${period}`, (s) => api.categories(cid, period, s), { enabled });
  const trends = useQuery(`trends:${cid}`, (s) => api.trends(cid, TREND_MONTHS, s), { enabled });
  const goals = useQuery(`goals:${cid}`, (s) => api.goals(cid, s), { enabled });

  return (
    <AppShell
      customers={customers.data?.customers}
      currentId={customerId}
      onSwitch={setChosenId}
      activeSection={section}
      onNavigate={setSection}
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {customers.error && !customers.data ? (
          <div className="rounded-xl border border-line bg-card">
            <ErrorState message={`Could not load customers: ${customers.error.message}`} onRetry={customers.refetch} />
          </div>
        ) : (
          <main className="space-y-4">
            <section id="overview" className="min-w-0 scroll-mt-20 space-y-4">
              <DashboardHeader profile={profile.data} error={profile.error} onRetry={profile.refetch} />
              {/* One filter row scopes the summary and category breakdown. */}
              <PeriodSelector value={period} onChange={setPeriod} presets={filters.data?.dateRangePresets} />
              <SummaryCards
                summary={summary.data}
                period={period}
                loading={summary.loading}
                error={summary.error}
                onRetry={summary.refetch}
              />
            </section>

            <div className="grid gap-4 lg:grid-cols-2">
              <section id="categories" className="min-w-0 scroll-mt-20">
                <CategoryBreakdown
                  data={categories.data}
                  loading={categories.loading}
                  error={categories.error}
                  onRetry={categories.refetch}
                />
              </section>
              <section id="trends" className="min-w-0 scroll-mt-20">
                <TrendsChart
                  data={trends.data}
                  months={TREND_MONTHS}
                  loading={trends.loading}
                  error={trends.error}
                  onRetry={trends.refetch}
                />
              </section>
            </div>

            <div className="grid gap-4 lg:grid-cols-[2fr_3fr]">
              <section id="budgets" className="min-w-0 scroll-mt-20">
                <GoalsPanel
                  data={goals.data}
                  categories={filters.data?.categories}
                  loading={goals.loading}
                  error={goals.error}
                  onRetry={goals.refetch}
                />
              </section>
              <section id="transactions" className="min-w-0 scroll-mt-20">
                {/* Keyed on the customer so filters and paging reset when the customer changes. */}
                {customerId && (
                  <TransactionsPanel key={customerId} customerId={customerId} categories={filters.data?.categories} />
                )}
              </section>
            </div>
          </main>
        )}
      </div>
    </AppShell>
  );
}
