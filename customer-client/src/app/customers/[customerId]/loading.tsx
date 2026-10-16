import { Skeleton } from "@/components/ui";

// Shown while a page's server render is in flight on first visit; revisits come from the router cache.
export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8" aria-busy>
      <Skeleton className="h-7 w-56" />
      <Skeleton className="mt-2 h-4 w-72" />
      <Skeleton className="mt-6 h-10 w-96 max-w-full" />
      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
      <Skeleton className="mt-4 h-96 w-full" />
    </div>
  );
}
