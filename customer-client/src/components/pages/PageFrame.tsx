import type { ReactNode } from "react";

// Shared page chrome: consistent width and the skip-link target.
export function PageFrame({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <main id="main" tabIndex={-1} className="space-y-4 focus:outline-none">
        {children}
      </main>
    </div>
  );
}
