import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { TrendsPage } from "@/components/pages/TrendsPage";
import { parseMonths } from "@/lib/params";
import { trendsQuery } from "@/lib/queries";
import { getQueryClient } from "@/lib/query-client.server";

export const metadata: Metadata = { title: "Trends" };

export default async function Page({ params, searchParams }: PageProps<"/customers/[customerId]/trends">) {
  const [{ customerId }, sp] = await Promise.all([params, searchParams]);
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trendsQuery(customerId, parseMonths(sp.months)));
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TrendsPage customerId={customerId} />
    </HydrationBoundary>
  );
}
