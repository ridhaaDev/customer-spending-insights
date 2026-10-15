import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui";

interface Props {
  label: string;
  value: string;
  foot: ReactNode;
}

export function StatTile({ label, value, foot }: Props) {
  return (
    <div className="rounded-xl border border-line bg-card p-5">
      <p className="text-sm text-ink-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{value}</p>
      <p className="mt-1 text-xs text-ink-muted">{foot}</p>
    </div>
  );
}

export function StatTileSkeleton() {
  return (
    <div className="rounded-xl border border-line bg-card p-5">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-3 h-8 w-32" />
      <Skeleton className="mt-3 h-3 w-20" />
    </div>
  );
}
