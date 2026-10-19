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
  // One sentence that reads the chart for the viewer; null when there is too little data to say anything.
  insight?: (data: T) => string | null;
}

export function TrendCard<T>({ title, subtitle, data, isEmpty, loading, error, onRetry, chart, table, insight }: Props<T>) {
  const [view, setView] = useState<"chart" | "table">("chart");
  const hasRows = data !== undefined && !isEmpty(data);
  const reading = hasRows ? insight?.(data) : null;

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
        <Refreshing loading={loading}>
          {reading && <p className="mb-3 text-sm text-ink-secondary">{reading}</p>}
          {view === "table" ? table(data) : chart(data)}
        </Refreshing>
      )}
    </Card>
  );
}
