"use client";

import type { SpendingTrends } from "@/lib/types";
import { TrendCard } from "./TrendCard";
import { TrendsBarChart } from "./TrendsBarChart";
import { TrendsTable } from "./TrendsTable";

interface Props {
  data: SpendingTrends | undefined;
  months: number;
  loading: boolean;
  error: Error | null;
  onRetry: () => void;
}

export function TrendsChart({ data, months, loading, error, onRetry }: Props) {
  return (
    <TrendCard
      title="Monthly spending"
      subtitle={`Last ${months} months`}
      data={data}
      isEmpty={(d) => d.trends.length === 0}
      loading={loading}
      error={error}
      onRetry={onRetry}
      chart={(d) => <TrendsBarChart trends={d.trends} label={`Bar chart of total spending per month for the last ${months} months`} />}
      table={(d) => <TrendsTable trends={d.trends} />}
    />
  );
}
