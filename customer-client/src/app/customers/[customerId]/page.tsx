import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { OverviewPage } from "@/components/pages/OverviewPage";
import { parsePeriod } from "@/lib/params";
import { filtersQuery, goalsQuery, recentTransactionsQuery, summaryQuery } from "@/lib/queries";
import { getQueryClient } from "@/lib/query-client.server";

export const metadata: Metadata = { title: "Overview" };

export default async function Page({ params, searchParams }: PageProps<"/customers/[customerId]">) {
  const [{ customerId }, sp] = await Promise.all([params, searchParams]);
  const period = parsePeriod(sp.period);
  const queryClient = getQueryClient();
  await Promise.all([
    queryClient.prefetchQuery(filtersQuery(customerId)),
    queryClient.prefetchQuery(summaryQuery(customerId, period)),
    queryClient.prefetchQuery(recentTransactionsQuery(customerId)),
    queryClient.prefetchQuery(goalsQuery(customerId)),
  ]);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OverviewPage customerId={customerId} />
    </HydrationBoundary>
  );
}
