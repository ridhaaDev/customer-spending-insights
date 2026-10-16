import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { TransactionsPage } from "@/components/pages/TransactionsPage";
import { parseDateRange } from "@/lib/params";
import { filtersQuery, transactionsQuery } from "@/lib/queries";
import { getQueryClient } from "@/lib/query-client.server";
import { firstPageQuery } from "@/lib/transactions-query";

export const metadata: Metadata = { title: "Transactions" };

export default async function Page({ params, searchParams }: PageProps<"/customers/[customerId]/transactions">) {
  const [{ customerId }, sp] = await Promise.all([params, searchParams]);
  const range = parseDateRange(sp.from, sp.to);
  const queryClient = getQueryClient();
  await Promise.all([
    queryClient.prefetchQuery(filtersQuery(customerId)),
    queryClient.prefetchQuery(transactionsQuery(customerId, firstPageQuery(range))),
  ]);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TransactionsPage customerId={customerId} />
    </HydrationBoundary>
  );
}
