import type { ReactNode } from "react";

// Dims content while a refetch is in flight instead of flashing a skeleton.
export function Refreshing({ loading, children }: { loading: boolean; children: ReactNode }) {
  return (
    <div aria-busy={loading} className={`transition-opacity ${loading ? "opacity-50" : ""}`}>
      {children}
    </div>
  );
}
