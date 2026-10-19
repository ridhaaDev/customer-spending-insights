import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { TrendsPage } from "@/components/pages/TrendsPage";
import { parseMonths } from "@/lib/params";
import { categoryTrendsQuery, trendsQuery, weekdaySpendingQuery } from "@/lib/queries";
import { getQueryClient } from "@/lib/query-client.server";

export const metadata: Metadata = { title: "Trends" };

export default async function Page({ params, searchParams }: PageProps<"/customers/[customerId]/trends">) {
  const [{ customerId }, sp] = await Promise.all([params, searchParams]);
  const months = parseMonths(sp.months);
  const queryClient = getQueryClient();
  await Promise.all([
    queryClient.prefetchQuery(trendsQuery(customerId, months)),
    queryClient.prefetchQuery(categoryTrendsQuery(customerId, months)),
    queryClient.prefetchQuery(weekdaySpendingQuery(customerId, months)),
  ]);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TrendsPage customerId={customerId} />
    </HydrationBoundary>
  );
}
