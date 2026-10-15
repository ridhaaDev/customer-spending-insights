"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, EmptyState, ErrorState, Refreshing, Skeleton } from "@/components/ui";
import { useQuery } from "@/hooks/useQuery";
import { api } from "@/lib/api";
import { TransactionTable } from "./TransactionTable";

const LIMIT = 8;

export function RecentTransactions({ customerId }: { customerId: string }) {
  const { data, loading, error, refetch } = useQuery(`recent:${customerId}`, (signal) =>
    api.transactions(customerId, { limit: LIMIT, sortBy: "date_desc" }, signal),
  );
  return (
    <Card>
      <CardHeader
        title="Recent transactions"
        subtitle={`Latest ${LIMIT}`}
        action={
          <Link href="/transactions" className="inline-flex items-center gap-1 text-sm font-medium text-accent-ink hover:underline">
            View all <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        }
      />
      {error && !data ? (
        <ErrorState message={error.message} onRetry={refetch} />
      ) : !data ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : data.transactions.length === 0 ? (
        <EmptyState message="No transactions yet." />
      ) : (
        <Refreshing loading={loading}>
          <TransactionTable transactions={data.transactions} />
        </Refreshing>
      )}
    </Card>
  );
}
