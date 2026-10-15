"use client";

import type { ReactNode } from "react";
import { ErrorState } from "@/components/ui";
import { useDashboard } from "@/context/DashboardContext";

// Shared page chrome: consistent width and a single place to show the customers-list failure.
export function PageFrame({ children }: { children: (customerId: string | null) => ReactNode }) {
  const { customers, customerId } = useDashboard();
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      {customers.error && !customers.data ? (
        <div className="rounded-xl border border-line bg-card">
          <ErrorState message={`Could not load customers: ${customers.error.message}`} onRetry={customers.refetch} />
        </div>
      ) : (
        <main className="space-y-4">{children(customerId)}</main>
      )}
    </div>
  );
}
