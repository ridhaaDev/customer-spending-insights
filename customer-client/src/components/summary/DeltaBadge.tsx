import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { formatChange } from "@/lib/format";

// Spending more is not "good", so the arrow stays in neutral ink and only shows direction.
export function DeltaBadge({ value }: { value: number | null }) {
  if (value === null) return <span className="text-ink-muted">no prior data</span>;
  const Icon = value > 0 ? ArrowUpRight : value < 0 ? ArrowDownRight : Minus;
  return (
    <span className="inline-flex items-center gap-0.5 text-ink-secondary">
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {formatChange(value)}
    </span>
  );
}
