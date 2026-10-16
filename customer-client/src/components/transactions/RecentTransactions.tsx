"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, EmptyState, ErrorState, Refreshing, Skeleton } from "@/components/ui";
import { customerPath } from "@/lib/params";
import { RECENT_LIMIT, recentTransactionsQuery } from "@/lib/queries";
import { TransactionTable } from "./TransactionTable";

export function RecentTransactions({ customerId }: { customerId: string }) {
  const { data, isFetching, error, refetch } = useQuery(recentTransactionsQuery(customerId));
  return (
    <Card>
      <CardHeader
        title="Recent transactions"
        subtitle={`Latest ${RECENT_LIMIT}`}
        action={
          <Link
            href={customerPath(customerId, "transactions")}
            className="inline-flex items-center gap-1 text-sm font-medium text-accent-ink hover:underline"
          >
            View all <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        }
      />
      {error && !data ? (
        <ErrorState message={error.message} onRetry={() => void refetch()} />
      ) : !data ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : data.transactions.length === 0 ? (
        <EmptyState message="No transactions yet." />
      ) : (
        <Refreshing loading={isFetching && !!data}>
          <TransactionTable transactions={data.transactions} />
        </Refreshing>
      )}
    </Card>
  );
}
