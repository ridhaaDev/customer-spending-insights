"use client";

import { useState } from "react";
import { DateRangePicker } from "@/components/dashboard/DateRangePicker";
import { TransactionsPanel } from "@/components/transactions/TransactionsPanel";
import { PageHeader } from "@/components/ui";
import { useQuery } from "@/hooks/useQuery";
import { api } from "@/lib/api";
import type { DateRangeValue } from "@/lib/types";
import { PageFrame } from "./PageFrame";

export function TransactionsPage() {
  const [range, setRange] = useState<DateRangeValue | null>(null);
  return (
    <PageFrame>
      {(customerId) => <Transactions cid={customerId ?? ""} enabled={customerId !== null} range={range} setRange={setRange} />}
    </PageFrame>
  );
}

interface Props {
  cid: string;
  enabled: boolean;
  range: DateRangeValue | null;
  setRange: (r: DateRangeValue | null) => void;
}

function Transactions({ cid, enabled, range, setRange }: Props) {
  const filters = useQuery(`filters:${cid}`, (s) => api.filters(cid, s), { enabled });
  const rangeKey = range ? `${range.startDate}:${range.endDate}` : "all";
  return (
    <>
      <PageHeader title="Transactions" description="Every transaction, filterable by category and date." />
      <DateRangePicker key={rangeKey} value={range} onChange={setRange} />
      {enabled && <TransactionsPanel key={`${cid}:${rangeKey}`} customerId={cid} categories={filters.data?.categories} dateRange={range} />}
    </>
  );
}
