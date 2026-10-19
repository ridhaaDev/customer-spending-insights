"use client";

import { type ReactNode, useState } from "react";
import { Button, Card, CardHeader, EmptyState, ErrorState, Refreshing, Skeleton } from "@/components/ui";

interface Props<T> {
  title: string;
  subtitle?: string;
  data: T | undefined;
  isEmpty: (data: T) => boolean;
  loading: boolean;
  error: Error | null;
  onRetry: () => void;
  chart: (data: T) => ReactNode;
  // The accessible twin of the chart: same numbers as a table.
  table: (data: T) => ReactNode;
}

export function TrendCard<T>({ title, subtitle, data, isEmpty, loading, error, onRetry, chart, table }: Props<T>) {
  const [view, setView] = useState<"chart" | "table">("chart");
  const hasRows = data !== undefined && !isEmpty(data);

  const toggle = hasRows && (
    <Button size="sm" onClick={() => setView(view === "chart" ? "table" : "chart")} aria-pressed={view === "table"}>
      {view === "chart" ? "Table" : "Chart"}
    </Button>
  );

  return (
    <Card>
      <CardHeader title={title} subtitle={subtitle} action={toggle} />
      {error && !data ? (
        <ErrorState message={error.message} onRetry={onRetry} />
      ) : data === undefined ? (
        <Skeleton className="h-64 w-full" />
      ) : !hasRows ? (
        <EmptyState message="No history yet." />
      ) : (
        <Refreshing loading={loading}>{view === "table" ? table(data) : chart(data)}</Refreshing>
      )}
    </Card>
  );
}
