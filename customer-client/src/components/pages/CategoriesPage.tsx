"use client";

import { useState } from "react";
import { CategoryBreakdown } from "@/components/categories/CategoryBreakdown";
import { DateRangePicker } from "@/components/dashboard/DateRangePicker";
import { PeriodSelector } from "@/components/dashboard/PeriodSelector";
import { PageHeader } from "@/components/ui";
import { useDashboard } from "@/context/DashboardContext";
import { useQuery } from "@/hooks/useQuery";
import { api } from "@/lib/api";
import type { DateRangeValue, Period } from "@/lib/types";
import { PageFrame } from "./PageFrame";

export function CategoriesPage() {
  const { period, setPeriod } = useDashboard();
  const [range, setRange] = useState<DateRangeValue | null>(null);
  return (
    <PageFrame>
      {(customerId) => (
        <Categories cid={customerId ?? ""} enabled={customerId !== null} period={period} setPeriod={setPeriod} range={range} setRange={setRange} />
      )}
    </PageFrame>
  );
}

interface Props {
  cid: string;
  enabled: boolean;
  period: Period;
  setPeriod: (p: Period) => void;
  range: DateRangeValue | null;
  setRange: (r: DateRangeValue | null) => void;
}

function Categories({ cid, enabled, period, setPeriod, range, setRange }: Props) {
  const filters = useQuery(`filters:${cid}`, (s) => api.filters(cid, s), { enabled });
  const query = range ? { ...range } : { period };
  const categories = useQuery(`categories:${cid}:${JSON.stringify(query)}`, (s) => api.categories(cid, query, s), { enabled });

  // Choosing a preset drops any custom range so the two controls never disagree.
  const choosePeriod = (p: Period) => {
    setRange(null);
    setPeriod(p);
  };

  return (
    <>
      <PageHeader title="Categories" description="Where the money went in the selected window." />
      <div className="flex flex-wrap items-center gap-3">
        <PeriodSelector value={period} onChange={choosePeriod} presets={filters.data?.dateRangePresets} />
        <span className="text-sm text-ink-muted">or</span>
        <DateRangePicker key={range ? `${range.startDate}:${range.endDate}` : "none"} value={range} onChange={setRange} />
      </div>
      <CategoryBreakdown data={categories.data} loading={categories.loading} error={categories.error} onRetry={categories.refetch} />
    </>
  );
}
