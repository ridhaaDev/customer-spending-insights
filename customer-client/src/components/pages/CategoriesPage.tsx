"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Link from "next/link";
import { CategoryBreakdown } from "@/components/categories/CategoryBreakdown";
import { DateRangeControl } from "@/components/dashboard/DateRangeControl";
import { PageHeader } from "@/components/ui";
import { useUrlState } from "@/hooks/useUrlState";
import { customerPath } from "@/lib/params";
import { categoriesQuery, filtersQuery } from "@/lib/queries";
import { PageFrame } from "./PageFrame";

export function CategoriesPage({ customerId }: { customerId: string }) {
  const { period, setPeriod, range, setRange } = useUrlState();
  const filters = useQuery(filtersQuery(customerId));
  const query = range ? { ...range } : { period };
  const categories = useQuery({ ...categoriesQuery(customerId, query), placeholderData: keepPreviousData });

  return (
    <PageFrame>
      <PageHeader
        title="Categories"
        description="Where the money went in the selected window."
        action={
          <Link
            href={`${customerPath(customerId, "categories")}/new`}
            className="inline-flex items-center gap-1.5 rounded-md bg-ink px-3 py-1.5 text-sm font-medium text-card hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Plus className="h-4 w-4" aria-hidden /> Add category
          </Link>
        }
      />
      {/* Presets are API periods; a custom range overrides them (see useUrlState). */}
      <DateRangeControl
        range={range}
        period={period}
        presets={filters.data?.dateRangePresets}
        onPeriodChange={setPeriod}
        onRangeChange={setRange}
      />
      <CategoryBreakdown
        data={categories.data}
        loading={categories.isPlaceholderData}
        error={categories.error}
        onRetry={categories.refetch}
      />
    </PageFrame>
  );
}
