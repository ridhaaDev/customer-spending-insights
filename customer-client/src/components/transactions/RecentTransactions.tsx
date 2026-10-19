"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, EmptyState, ErrorState, Refreshing, Skeleton } from "@/components/ui";
import { customerPath } from "@/lib/params";
import { RECENT_LIMIT, recentTransactionsQuery } from "@/lib/queries";
import type { CategoryFilter } from "@/lib/types";
import { AddTransactionDialog } from "./AddTransactionDialog";
import { TransactionTable } from "./TransactionTable";

interface Props {
  customerId: string;
  categories: CategoryFilter[] | undefined;
  paymentMethods: string[] | undefined;
}

export function RecentTransactions({ customerId, categories, paymentMethods }: Props) {
  const { data, isFetching, error, refetch } = useQuery(recentTransactionsQuery(customerId));
  return (
    <Card>
      <CardHeader
        title="Recent transactions"
        subtitle={`Latest ${RECENT_LIMIT}`}
        action={
          <div className="flex items-center gap-3">
            <Link
              href={customerPath(customerId, "transactions")}
              className="inline-flex items-center gap-1 whitespace-nowrap text-sm font-medium text-accent-ink hover:underline"
            >
              View all <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <AddTransactionDialog customerId={customerId} categories={categories} paymentMethods={paymentMethods} size="sm" />
          </div>
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
          <TransactionTable transactions={data.transactions} compact />
        </Refreshing>
      )}
    </Card>
  );
}
