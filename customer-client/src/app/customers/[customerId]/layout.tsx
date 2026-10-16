import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { ConnectedShell } from "@/components/nav/ConnectedShell";
import { ApiError } from "@/lib/api";
import { customersQuery, profileQuery } from "@/lib/queries";
import { getQueryClient } from "@/lib/query-client.server";

export default async function CustomerLayout({ children, params }: LayoutProps<"/customers/[customerId]">) {
  const { customerId } = await params;
  const queryClient = getQueryClient();

  // The profile doubles as the existence check; the customer list feeds the profile switcher.
  const [profile] = await Promise.all([
    queryClient.fetchQuery(profileQuery(customerId)).catch((err: unknown) => {
      if (err instanceof ApiError && err.status === 404) return null;
      throw err;
    }),
    queryClient.prefetchQuery(customersQuery()),
  ]);
  if (!profile) notFound();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ConnectedShell customerId={customerId}>{children}</ConnectedShell>
    </HydrationBoundary>
  );
}
