"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@/hooks/useQuery";
import { api } from "@/lib/api";
import { formatDateTime, formatInteger, formatZAR } from "@/lib/format";
import type { CategoryFilter, SortBy } from "@/lib/types";
import { CategoryChip } from "./CategoryIcon";
import { Card, CardHeader, EmptyState, ErrorState, Refreshing, Skeleton } from "./ui";

const PAGE_SIZE = 10;

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: "date_desc", label: "Newest first" },
  { value: "date_asc", label: "Oldest first" },
  { value: "amount_desc", label: "Largest amount" },
  { value: "amount_asc", label: "Smallest amount" },
];

interface Props {
  customerId: string;
  categories: CategoryFilter[] | undefined;
}

const selectClass =
  "rounded-md border border-line bg-card px-2.5 py-1.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent";

export function TransactionsTable({ customerId, categories }: Props) {
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("date_desc");
  const [offset, setOffset] = useState(0);

  const query = { limit: PAGE_SIZE, offset, category: category || undefined, sortBy };
  const { data, loading, error, refetch } = useQuery(`transactions:${customerId}:${JSON.stringify(query)}`, (signal) =>
    api.transactions(customerId, query, signal),
  );

  // Changing the slice resets to the first page; the customer switch is handled by the parent remounting us.
  const changeCategory = (value: string) => {
    setCategory(value);
    setOffset(0);
  };
  const changeSort = (value: SortBy) => {
    setSortBy(value);
    setOffset(0);
  };

  const total = data?.pagination.total ?? 0;
  const from = total === 0 ? 0 : offset + 1;
  const to = Math.min(offset + PAGE_SIZE, total);

  const controls = (
    <div className="flex flex-wrap gap-2">
      <label className="sr-only" htmlFor="txn-category">
        Category
      </label>
      <select id="txn-category" value={category} onChange={(e) => changeCategory(e.target.value)} className={selectClass}>
        <option value="">All categories</option>
        {categories?.map((c) => (
          <option key={c.name} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>
      <label className="sr-only" htmlFor="txn-sort">
        Sort
      </label>
      <select id="txn-sort" value={sortBy} onChange={(e) => changeSort(e.target.value as SortBy)} className={selectClass}>
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <Card>
      <CardHeader title="Transactions" subtitle={data ? `${formatInteger(total)} in total` : undefined} action={controls} />
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
          <div className="-mx-5 overflow-x-auto px-5">
            <table className="w-full min-w-[32rem] text-sm">
              <thead className="text-left text-xs text-ink-muted">
                <tr>
                  <th className="py-2 font-medium">Merchant</th>
                  <th className="py-2 font-medium">Category</th>
                  <th className="hidden py-2 font-medium md:table-cell">Payment</th>
                  <th className="py-2 font-medium">Date</th>
                  <th className="py-2 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {data.transactions.map((t) => (
                  <tr key={t.id}>
                    <td className="py-2.5 pr-3">
                      <div className="flex items-center gap-2.5">
                        <CategoryChip icon={t.icon} color={t.categoryColor} size="sm" />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-ink">{t.merchant}</p>
                          <p className="truncate text-xs text-ink-muted">{t.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 pr-3 text-ink-secondary">{t.category}</td>
                    <td className="hidden py-2.5 pr-3 text-ink-secondary md:table-cell">{t.paymentMethod}</td>
                    <td className="whitespace-nowrap py-2.5 pr-3 text-ink-secondary">{formatDateTime(t.date)}</td>
                    <td className="whitespace-nowrap py-2.5 text-right font-medium tabular-nums text-ink">{formatZAR(t.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <nav className="mt-3 flex items-center justify-between border-t border-line pt-3 text-sm" aria-label="Pagination">
            <p className="text-ink-muted">
              Showing {formatInteger(from)}–{formatInteger(to)} of {formatInteger(total)}
            </p>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
                disabled={offset === 0}
                aria-label="Previous page"
                className="rounded-md border border-line p-1.5 text-ink disabled:opacity-40 hover:enabled:bg-surface"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => setOffset(offset + PAGE_SIZE)}
                disabled={!data.pagination.hasMore}
                aria-label="Next page"
                className="rounded-md border border-line p-1.5 text-ink disabled:opacity-40 hover:enabled:bg-surface"
              >
                <ChevronRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </nav>
        </Refreshing>
      )}
    </Card>
  );
}
