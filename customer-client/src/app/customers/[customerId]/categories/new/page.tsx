import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { NewCategoryPage } from "@/components/pages/NewCategoryPage";
import { filtersQuery } from "@/lib/queries";
import { getQueryClient } from "@/lib/query-client.server";

export const metadata: Metadata = { title: "Add category" };

export default async function Page({ params }: PageProps<"/customers/[customerId]/categories/new">) {
  const { customerId } = await params;
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(filtersQuery(customerId));
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NewCategoryPage customerId={customerId} />
    </HydrationBoundary>
  );
}
