"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { CategoryBreakdown } from "@/components/categories/CategoryBreakdown";
import { DateRangePicker } from "@/components/dashboard/DateRangePicker";
import { PeriodSelector } from "@/components/dashboard/PeriodSelector";
import { PageHeader } from "@/components/ui";
import { useUrlState } from "@/hooks/useUrlState";
import { categoriesQuery, filtersQuery } from "@/lib/queries";
import { PageFrame } from "./PageFrame";

export function CategoriesPage({ customerId }: { customerId: string }) {
  const { period, setPeriod, range, setRange } = useUrlState();
  const filters = useQuery(filtersQuery(customerId));
  const query = range ? { ...range } : { period };
  const categories = useQuery({ ...categoriesQuery(customerId, query), placeholderData: keepPreviousData });
  const rangeKey = range ? `${range.startDate}:${range.endDate}` : "none";

  return (
    <PageFrame>
      <PageHeader title="Categories" description="Where the money went in the selected window." />
      <div className="flex flex-wrap items-center gap-3">
        {/* Choosing a preset clears any custom range (see useUrlState) so the two never disagree. */}
        <PeriodSelector value={period} onChange={setPeriod} presets={filters.data?.dateRangePresets} />
        <span className="text-sm text-ink-muted">or</span>
        <DateRangePicker key={rangeKey} value={range} onChange={setRange} />
      </div>
      <CategoryBreakdown
        data={categories.data}
        loading={categories.isPlaceholderData}
        error={categories.error}
        onRetry={categories.refetch}
      />
    </PageFrame>
  );
}
