"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { GoalForm } from "@/components/goals/GoalForm";
import { Card, PageHeader } from "@/components/ui";
import { api } from "@/lib/api";
import { customerPath } from "@/lib/params";
import { filtersQuery, goalsQuery } from "@/lib/queries";
import type { GoalCreate } from "@/lib/types";
import { PageFrame } from "./PageFrame";

export function NewBudgetPage({ customerId }: { customerId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const filters = useQuery(filtersQuery(customerId));
  const goals = useQuery(goalsQuery(customerId));
  const listPath = customerPath(customerId, "budgets");

  const create = useMutation({
    mutationFn: (body: GoalCreate) => api.createGoal(customerId, body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["customer", customerId, "goals"] });
      router.push(listPath);
    },
  });

  return (
    <PageFrame>
      <PageHeader title="Add budget" description="A monthly limit for one category. Spend so far this month counts against it immediately." />
      <Card className="max-w-2xl">
        <GoalForm
          categories={filters.data?.categories}
          budgeted={goals.data?.goals.map((g) => g.category)}
          onSubmit={(body) => create.mutate(body)}
          onCancel={() => router.push(listPath)}
          submitting={create.isPending}
          error={create.error?.message ?? null}
        />
      </Card>
    </PageFrame>
  );
}
