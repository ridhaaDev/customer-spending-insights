import type { ReactNode } from "react";
import { Card, CardHeader, EmptyState, ErrorState, Refreshing, Skeleton } from "@/components/ui";
import type { CategoryFilter, GoalList } from "@/lib/types";
import { GoalRow } from "./GoalRow";

interface Props {
  data: GoalList | undefined;
  categories: CategoryFilter[] | undefined;
  loading: boolean;
  error: Error | null;
  onRetry: () => void;
  // Rendered in the card header, e.g. an Add budget button.
  action?: ReactNode;
}

export function GoalsPanel({ data, categories, loading, error, onRetry, action }: Props) {
  const byName = new Map(categories?.map((c) => [c.name, c]));
  return (
    <Card>
      <CardHeader title="Monthly budgets" subtitle="Spend so far this month against each goal" action={action} />
      {error && !data ? (
        <ErrorState message={error.message} onRetry={onRetry} />
      ) : !data ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : data.goals.length === 0 ? (
        <EmptyState message="No budgets set." />
      ) : (
        <Refreshing loading={loading}>
          <ul className="divide-y divide-line">
            {data.goals.map((g) => (
              <GoalRow key={g.id} goal={g} meta={byName.get(g.category)} />
            ))}
          </ul>
        </Refreshing>
      )}
    </Card>
  );
}
