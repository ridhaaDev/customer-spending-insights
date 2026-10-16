import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { NewBudgetPage } from "@/components/pages/NewBudgetPage";
import { filtersQuery, goalsQuery } from "@/lib/queries";
import { getQueryClient } from "@/lib/query-client.server";

export const metadata: Metadata = { title: "Add budget" };

export default async function Page({ params }: PageProps<"/customers/[customerId]/budgets/new">) {
  const { customerId } = await params;
  const queryClient = getQueryClient();
  await Promise.all([queryClient.prefetchQuery(filtersQuery(customerId)), queryClient.prefetchQuery(goalsQuery(customerId))]);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NewBudgetPage customerId={customerId} />
    </HydrationBoundary>
  );
}
