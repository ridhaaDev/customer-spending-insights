"use client";

import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Link from "next/link";
import { DateRangePicker } from "@/components/dashboard/DateRangePicker";
import { TransactionsPanel } from "@/components/transactions/TransactionsPanel";
import { PageHeader } from "@/components/ui";
import { useUrlState } from "@/hooks/useUrlState";
import { customerPath } from "@/lib/params";
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
          <Link
            href={`${customerPath(customerId, "transactions")}/new`}
            className="inline-flex items-center gap-1.5 rounded-md bg-ink px-3 py-1.5 text-sm font-medium text-card hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Plus className="h-4 w-4" aria-hidden /> Add transaction
          </Link>
        }
      />
      <DateRangePicker key={rangeKey} value={range} onChange={setRange} />
      <TransactionsPanel key={`${customerId}:${rangeKey}`} customerId={customerId} categories={filters.data?.categories} dateRange={range} />
    </PageFrame>
  );
}
