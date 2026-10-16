"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { Card, PageHeader } from "@/components/ui";
import { api } from "@/lib/api";
import { customerPath } from "@/lib/params";
import { filtersQuery } from "@/lib/queries";
import type { TransactionCreate } from "@/lib/types";
import { PageFrame } from "./PageFrame";

export function NewTransactionPage({ customerId, defaultDate }: { customerId: string; defaultDate: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const filters = useQuery(filtersQuery(customerId));
  const listPath = customerPath(customerId, "transactions");

  const create = useMutation({
    mutationFn: (body: TransactionCreate) => api.createTransaction(customerId, body),
    onSuccess: async () => {
      // Every figure for this customer may have moved, so drop all of their cached queries.
      await queryClient.invalidateQueries({ queryKey: ["customer", customerId] });
      router.push(listPath);
    },
  });

  return (
    <PageFrame>
      <PageHeader title="Add transaction" description="Recorded against this customer and reflected in every view immediately." />
      <Card className="max-w-2xl">
        <TransactionForm
          categories={filters.data?.categories}
          paymentMethods={filters.data?.paymentMethods}
          defaultDate={defaultDate}
          onSubmit={(body) => create.mutate(body)}
          onCancel={() => router.push(listPath)}
          submitting={create.isPending}
          error={create.error?.message ?? null}
        />
      </Card>
    </PageFrame>
  );
}
