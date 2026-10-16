"use client";

import { useQuery } from "@tanstack/react-query";
import { DateRangePicker } from "@/components/dashboard/DateRangePicker";
import { TransactionsPanel } from "@/components/transactions/TransactionsPanel";
import { PageHeader } from "@/components/ui";
import { useUrlState } from "@/hooks/useUrlState";
import { filtersQuery } from "@/lib/queries";
import { PageFrame } from "./PageFrame";

export function TransactionsPage({ customerId }: { customerId: string }) {
  const { range, setRange } = useUrlState();
  const filters = useQuery(filtersQuery(customerId));
  const rangeKey = range ? `${range.startDate}:${range.endDate}` : "all";
  return (
    <PageFrame>
      <PageHeader title="Transactions" description="Every transaction, filterable by category and date." />
      <DateRangePicker key={rangeKey} value={range} onChange={setRange} />
      <TransactionsPanel key={`${customerId}:${rangeKey}`} customerId={customerId} categories={filters.data?.categories} dateRange={range} />
    </PageFrame>
  );
}
