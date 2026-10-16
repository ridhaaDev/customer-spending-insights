"use client";

import { ErrorState } from "@/components/ui";

export default function RootError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="rounded-xl border border-line bg-card">
        <ErrorState message={error.message || "Something went wrong."} onRetry={reset} />
      </div>
    </main>
  );
}
