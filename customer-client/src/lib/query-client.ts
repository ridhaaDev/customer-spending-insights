import { QueryClient, isServer } from "@tanstack/react-query";

export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data hydrated from the server stays fresh long enough that the client doesn't refetch on mount.
        staleTime: 60 * 1000,
        retry: isServer ? 0 : 2,
      },
    },
  });
}
