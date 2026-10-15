"use client";

import { useState } from "react";
import { TrendsChart } from "@/components/trends/TrendsChart";
import { PageHeader, SegmentedControl, type SegmentOption } from "@/components/ui";
import { useQuery } from "@/hooks/useQuery";
import { api } from "@/lib/api";
import { PageFrame } from "./PageFrame";

type MonthsChoice = "6" | "12" | "24";

const MONTH_OPTIONS: SegmentOption<MonthsChoice>[] = [
  { label: "6 months", value: "6" },
  { label: "12 months", value: "12" },
  { label: "24 months", value: "24" },
];

export function TrendsPage() {
  const [months, setMonths] = useState<MonthsChoice>("12");
  return <PageFrame>{(customerId) => <Trends cid={customerId ?? ""} enabled={customerId !== null} months={months} setMonths={setMonths} />}</PageFrame>;
}

interface Props {
  cid: string;
  enabled: boolean;
  months: MonthsChoice;
  setMonths: (m: MonthsChoice) => void;
}

function Trends({ cid, enabled, months, setMonths }: Props) {
  const count = Number(months);
  const trends = useQuery(`trends:${cid}:${count}`, (s) => api.trends(cid, count, s), { enabled });
  return (
    <>
      <PageHeader
        title="Trends"
        description="Total spend per calendar month."
        action={<SegmentedControl label="Months" options={MONTH_OPTIONS} value={months} onChange={setMonths} />}
      />
      <TrendsChart data={trends.data} months={count} loading={trends.loading} error={trends.error} onRetry={trends.refetch} />
    </>
  );
}
