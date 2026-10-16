"use client";

import { useQuery } from "@tanstack/react-query";
import { DateRangeControl } from "@/components/dashboard/DateRangeControl";
import { AddTransactionDialog } from "@/components/transactions/AddTransactionDialog";
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
      <PageHeader
        title="Transactions"
        description="Every transaction, filterable by category and date."
        action={
          <AddTransactionDialog customerId={customerId} categories={filters.data?.categories} paymentMethods={filters.data?.paymentMethods} />
        }
      />
      {/* The list endpoint only takes dates, so presets become concrete ranges ending today. */}
      <DateRangeControl range={range} onRangeChange={setRange} allowAllTime />
      <TransactionsPanel key={`${customerId}:${rangeKey}`} customerId={customerId} categories={filters.data?.categories} dateRange={range} />
    </PageFrame>
  );
}
