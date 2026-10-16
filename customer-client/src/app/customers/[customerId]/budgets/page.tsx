import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { BudgetsPage } from "@/components/pages/BudgetsPage";
import { filtersQuery, goalsQuery } from "@/lib/queries";
import { getQueryClient } from "@/lib/query-client.server";

export const metadata: Metadata = { title: "Budgets" };

export default async function Page({ params }: PageProps<"/customers/[customerId]/budgets">) {
  const { customerId } = await params;
  const queryClient = getQueryClient();
  await Promise.all([queryClient.prefetchQuery(filtersQuery(customerId)), queryClient.prefetchQuery(goalsQuery(customerId))]);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BudgetsPage customerId={customerId} />
    </HydrationBoundary>
  );
}
