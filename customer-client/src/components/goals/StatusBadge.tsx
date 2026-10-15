import { CircleAlert, CircleCheck, TriangleAlert } from "lucide-react";
import type { GoalStatus } from "@/lib/types";

// Status is never colour alone: each state ships an icon and a label.
export const STATUS: Record<GoalStatus, { label: string; bar: string; text: string; Icon: typeof CircleCheck }> = {
  on_track: { label: "On track", bar: "bg-accent", text: "text-ink-secondary", Icon: CircleCheck },
  warning: { label: "Near limit", bar: "bg-warning", text: "text-ink-secondary", Icon: TriangleAlert },
  exceeded: { label: "Over budget", bar: "bg-critical", text: "text-critical", Icon: CircleAlert },
};

export function StatusBadge({ status, detail }: { status: GoalStatus; detail?: string }) {
  const s = STATUS[status];
  return (
    <span className={`inline-flex items-center gap-1 ${s.text}`}>
      <s.Icon className="h-3.5 w-3.5" aria-hidden />
      {s.label}
      {detail && ` · ${detail}`}
    </span>
  );
}
