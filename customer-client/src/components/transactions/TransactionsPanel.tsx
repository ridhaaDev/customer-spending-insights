"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardHeader, EmptyState, ErrorState, Refreshing, Skeleton } from "@/components/ui";
import { formatInteger } from "@/lib/format";
import { transactionsQuery } from "@/lib/queries";
import { buildTransactionQuery, PAGE_SIZE } from "@/lib/transactions-query";
import type { CategoryFilter, DateRangeValue, SortBy } from "@/lib/types";
import { Pagination } from "./Pagination";
import { TransactionFilters } from "./TransactionFilters";
import { TransactionTable } from "./TransactionTable";

interface Props {
  customerId: string;
  categories: CategoryFilter[] | undefined;
  // Remount (key) the panel when this changes so paging resets.
  dateRange?: DateRangeValue | null;
}

// Owns the filter and paging state; each page is its own cached query.
export function TransactionsPanel({ customerId, categories, dateRange = null }: Props) {
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("date_desc");
  const [offset, setOffset] = useState(0);

  const query = buildTransactionQuery({ offset, category, sortBy, dateRange });
  const { data, isPlaceholderData, error, refetch } = useQuery({
    ...transactionsQuery(customerId, query),
    placeholderData: keepPreviousData,
  });

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
        <ErrorState message={error.message} onRetry={() => void refetch()} />
      ) : !data ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : data.transactions.length === 0 ? (
        <EmptyState message="No transactions match these filters." />
      ) : (
        <Refreshing loading={isPlaceholderData}>
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
