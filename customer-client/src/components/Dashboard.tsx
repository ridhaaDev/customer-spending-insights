"use client";

import { useState } from "react";
import { useQuery } from "@/hooks/useQuery";
import { api } from "@/lib/api";
import { formatDate, formatZAR } from "@/lib/format";
import type { Period } from "@/lib/types";
import { CategoryBreakdown } from "./CategoryBreakdown";
import { CustomerPicker } from "./CustomerPicker";
import { GoalsPanel } from "./GoalsPanel";
import { PeriodSelector } from "./PeriodSelector";
import { SummaryCards } from "./SummaryCards";
import { TransactionsTable } from "./TransactionsTable";
import { TrendsChart } from "./TrendsChart";
import { ErrorState, Skeleton } from "./ui";

const TREND_MONTHS = 12;

export function Dashboard() {
  const customers = useQuery("customers", (signal) => api.listCustomers(signal));
  const [chosenId, setChosenId] = useState<string | null>(null);
  const [period, setPeriod] = useState<Period>("30d");

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
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">Spending Insights</h1>
          {profile.data ? (
            <p className="mt-1 text-sm text-ink-muted">
              <span className="font-medium text-ink">{profile.data.name}</span>
              <span className="mx-1.5">·</span>
              <span className="capitalize">{profile.data.accountType}</span> account
              <span className="mx-1.5">·</span>
              Customer since {formatDate(profile.data.joinDate)}
              <span className="mx-1.5">·</span>
              {formatZAR(profile.data.totalSpent, { whole: true })} lifetime
            </p>
          ) : profile.error ? (
            <p className="mt-1 text-sm text-critical">
              Could not load the profile: {profile.error.message}{" "}
              <button type="button" onClick={profile.refetch} className="underline">
                Retry
              </button>
            </p>
          ) : (
            <Skeleton className="mt-2 h-4 w-72" />
          )}
        </div>
        {customers.data && customerId && (
          <CustomerPicker customers={customers.data.customers} value={customerId} onChange={setChosenId} />
        )}
      </header>

      {customers.error && !customers.data ? (
        <div className="mt-10 rounded-xl border border-line bg-card">
          <ErrorState message={`Could not load customers: ${customers.error.message}`} onRetry={customers.refetch} />
        </div>
      ) : (
        <>
          {/* One filter row scopes the summary and category breakdown below it. */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <PeriodSelector value={period} onChange={setPeriod} presets={filters.data?.dateRangePresets} />
          </div>

          <main className="mt-4 space-y-4">
            <SummaryCards
              summary={summary.data}
              period={period}
              loading={summary.loading}
              error={summary.error}
              onRetry={summary.refetch}
            />

            <div className="grid gap-4 lg:grid-cols-2">
              <CategoryBreakdown
                data={categories.data}
                loading={categories.loading}
                error={categories.error}
                onRetry={categories.refetch}
              />
              <TrendsChart
                data={trends.data}
                months={TREND_MONTHS}
                loading={trends.loading}
                error={trends.error}
                onRetry={trends.refetch}
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-[2fr_3fr]">
              <GoalsPanel
                data={goals.data}
                categories={filters.data?.categories}
                loading={goals.loading}
                error={goals.error}
                onRetry={goals.refetch}
              />
              {/* Keyed on the customer so filters and paging reset when the customer changes. */}
              {customerId && <TransactionsTable key={customerId} customerId={customerId} categories={filters.data?.categories} />}
            </div>
          </main>
        </>
      )}
    </div>
  );
}
