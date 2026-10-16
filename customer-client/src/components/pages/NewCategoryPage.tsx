"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { CategoryForm } from "@/components/categories/CategoryForm";
import { Card, PageHeader } from "@/components/ui";
import { api } from "@/lib/api";
import { customerPath } from "@/lib/params";
import { filtersQuery } from "@/lib/queries";
import type { CategoryCreate } from "@/lib/types";
import { PageFrame } from "./PageFrame";

export function NewCategoryPage({ customerId }: { customerId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const filters = useQuery(filtersQuery(customerId));
  const listPath = customerPath(customerId, "categories");

  const create = useMutation({
    mutationFn: (body: CategoryCreate) => api.createCategory(customerId, body),
    onSuccess: async () => {
      // The category list feeds every filter and form for this customer.
      await queryClient.invalidateQueries({ queryKey: ["customer", customerId] });
      router.push(listPath);
    },
  });

  return (
    <PageFrame>
      <PageHeader title="Add category" description="A new category for this customer, available straight away when recording transactions." />
      <Card className="max-w-2xl">
        <CategoryForm
          colors={filters.data?.colors}
          icons={filters.data?.icons}
          onSubmit={(body) => create.mutate(body)}
          onCancel={() => router.push(listPath)}
          submitting={create.isPending}
          error={create.error?.message ?? null}
        />
      </Card>
    </PageFrame>
  );
}
