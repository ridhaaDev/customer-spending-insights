import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { CategoriesPage } from "@/components/pages/CategoriesPage";
import { parseDateRange, parsePeriod } from "@/lib/params";
import { categoriesQuery, filtersQuery } from "@/lib/queries";
import { getQueryClient } from "@/lib/query-client.server";

export const metadata: Metadata = { title: "Categories" };

export default async function Page({ params, searchParams }: PageProps<"/customers/[customerId]/categories">) {
  const [{ customerId }, sp] = await Promise.all([params, searchParams]);
  const range = parseDateRange(sp.from, sp.to);
  const query = range ? { ...range } : { period: parsePeriod(sp.period) };
  const queryClient = getQueryClient();
  await Promise.all([
    queryClient.prefetchQuery(filtersQuery(customerId)),
    queryClient.prefetchQuery(categoriesQuery(customerId, query)),
  ]);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CategoriesPage customerId={customerId} />
    </HydrationBoundary>
  );
}
