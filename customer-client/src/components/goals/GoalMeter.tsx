import type { GoalStatus } from "@/lib/types";
import { STATUS } from "./StatusBadge";

interface Props {
  percentageUsed: number;
  status: GoalStatus;
  label: string;
}

// The fill carries severity; the track is the unfilled remainder.
export function GoalMeter({ percentageUsed, status, label }: Props) {
  const pct = Math.min(percentageUsed, 100);
  return (
    <div
      className="h-1.5 w-full overflow-hidden rounded-full bg-line"
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
    >
      <div className={`h-full rounded-full ${STATUS[status].bar}`} style={{ width: `${pct}%` }} />
    </div>
  );
}
