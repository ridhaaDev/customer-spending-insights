import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { formatChange } from "@/lib/format";

// A pill: increases in the accent tint, decreases in the critical tint, no change in neutral.
// The arrow and sign carry the direction too, so colour is never the only cue.
const TONE = {
  up: "bg-accent-soft text-accent-soft-ink",
  down: "bg-critical/15 text-critical-ink",
  flat: "bg-surface text-ink-secondary",
};

export function DeltaBadge({ value }: { value: number | null }) {
  if (value === null) return <span className="text-ink-muted">no prior data</span>;
  const tone = value > 0 ? "up" : value < 0 ? "down" : "flat";
  const Icon = tone === "up" ? ArrowUpRight : tone === "down" ? ArrowDownRight : Minus;
  return (
    <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium tabular-nums ${TONE[tone]}`}>
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {formatChange(value)}
    </span>
  );
}
