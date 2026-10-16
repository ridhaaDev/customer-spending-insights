import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { NewTransactionPage } from "@/components/pages/NewTransactionPage";
import { filtersQuery } from "@/lib/queries";
import { getQueryClient } from "@/lib/query-client.server";

export const metadata: Metadata = { title: "Add transaction" };

export default async function Page({ params }: PageProps<"/customers/[customerId]/transactions/new">) {
  const { customerId } = await params;
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(filtersQuery(customerId));
  // Computed here so the server and client render the same initial value.
  const defaultDate = new Date().toISOString().slice(0, 16);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NewTransactionPage customerId={customerId} defaultDate={defaultDate} />
    </HydrationBoundary>
  );
}
