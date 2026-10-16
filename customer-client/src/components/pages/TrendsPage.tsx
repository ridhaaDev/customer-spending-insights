"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { TrendsChart } from "@/components/trends/TrendsChart";
import { PageHeader, SegmentedControl, type SegmentOption } from "@/components/ui";
import { useUrlState } from "@/hooks/useUrlState";
import { MONTH_CHOICES, type MonthsChoice } from "@/lib/params";
import { trendsQuery } from "@/lib/queries";
import { PageFrame } from "./PageFrame";

const MONTH_OPTIONS: SegmentOption<`${MonthsChoice}`>[] = MONTH_CHOICES.map((m) => ({ label: `${m} months`, value: `${m}` }));

export function TrendsPage({ customerId }: { customerId: string }) {
  const { months, setMonths } = useUrlState();
  const trends = useQuery({ ...trendsQuery(customerId, months), placeholderData: keepPreviousData });
  return (
    <PageFrame>
      <PageHeader
        title="Trends"
        description="Total spend per calendar month."
        action={
          <SegmentedControl
            label="Months"
            options={MONTH_OPTIONS}
            value={`${months}`}
            onChange={(v) => setMonths(Number(v) as MonthsChoice)}
          />
        }
      />
      <TrendsChart data={trends.data} months={months} loading={trends.isPlaceholderData} error={trends.error} onRetry={trends.refetch} />
    </PageFrame>
  );
}
