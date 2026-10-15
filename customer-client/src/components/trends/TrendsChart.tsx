"use client";

import { useState } from "react";
import { Button, Card, CardHeader, EmptyState, ErrorState, Refreshing, Skeleton } from "@/components/ui";
import type { SpendingTrends } from "@/lib/types";
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
  const [view, setView] = useState<"chart" | "table">("chart");
  const trends = data?.trends ?? [];

  const toggle = trends.length > 0 && (
    <Button size="sm" onClick={() => setView(view === "chart" ? "table" : "chart")} aria-pressed={view === "table"}>
      {view === "chart" ? "Table" : "Chart"}
    </Button>
  );

  return (
    <Card>
      <CardHeader title="Monthly spending" subtitle={`Last ${months} months`} action={toggle} />
      {error && !data ? (
        <ErrorState message={error.message} onRetry={onRetry} />
      ) : !data ? (
        <Skeleton className="h-64 w-full" />
      ) : trends.length === 0 ? (
        <EmptyState message="No history yet." />
      ) : (
        <Refreshing loading={loading}>
          {view === "table" ? (
            <TrendsTable trends={trends} />
          ) : (
            <TrendsBarChart trends={trends} label={`Bar chart of total spending per month for the last ${months} months`} />
          )}
        </Refreshing>
      )}
    </Card>
  );
}
