"use client";

import { useState } from "react";
import { Card, CardHeader, EmptyState, ErrorState, Refreshing, Skeleton } from "@/components/ui";
import { useQuery } from "@/hooks/useQuery";
import { api } from "@/lib/api";
import { formatInteger } from "@/lib/format";
import type { CategoryFilter, DateRangeValue, SortBy } from "@/lib/types";
import { Pagination } from "./Pagination";
import { TransactionFilters } from "./TransactionFilters";
import { TransactionTable } from "./TransactionTable";

const PAGE_SIZE = 10;

interface Props {
  customerId: string;
  categories: CategoryFilter[] | undefined;
  // Remount (key) the panel when this changes so paging resets.
  dateRange?: DateRangeValue | null;
}

// Data-connected: owns the filter and paging state and fetches each page.
export function TransactionsPanel({ customerId, categories, dateRange = null }: Props) {
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("date_desc");
  const [offset, setOffset] = useState(0);

  const query = { limit: PAGE_SIZE, offset, category: category || undefined, sortBy, ...dateRange };
  const { data, loading, error, refetch } = useQuery(`transactions:${customerId}:${JSON.stringify(query)}`, (signal) =>
    api.transactions(customerId, query, signal),
  );

  const changeCategory = (value: string) => {
    setCategory(value);
    setOffset(0);
  };
  const changeSort = (value: SortBy) => {
    setSortBy(value);
    setOffset(0);
  };

  const total = data?.pagination.total ?? 0;

  return (
    <Card>
      <CardHeader
        title="Transactions"
        subtitle={data ? `${formatInteger(total)} in total` : undefined}
        action={
          <TransactionFilters
            categories={categories}
            category={category}
            sortBy={sortBy}
            onCategoryChange={changeCategory}
            onSortChange={changeSort}
          />
        }
      />
      {error && !data ? (
        <ErrorState message={error.message} onRetry={refetch} />
      ) : !data ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : data.transactions.length === 0 ? (
        <EmptyState message="No transactions match these filters." />
      ) : (
        <Refreshing loading={loading}>
          <TransactionTable transactions={data.transactions} />
          <Pagination
            offset={offset}
            pageSize={PAGE_SIZE}
            total={total}
            hasMore={data.pagination.hasMore}
            onPrevious={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
            onNext={() => setOffset(offset + PAGE_SIZE)}
          />
        </Refreshing>
      )}
    </Card>
  );
}
