import { formatPercent } from "@/lib/format";

export interface ShareSegment {
  name: string;
  percentage: number;
  color: string;
}

// Part-to-whole as one stacked bar with 2px surface gaps between segments.
export function ShareBar({ segments, label }: { segments: ShareSegment[]; label: string }) {
  return (
    <div className="flex h-3 w-full gap-0.5 overflow-hidden rounded-full" role="img" aria-label={label}>
      {segments.map((s) => (
        // flex-grow shares the width net of the gaps, so the smallest segment is never clipped.
        <div
          key={s.name}
          style={{ flex: `${s.percentage} 0 0`, minWidth: 2, backgroundColor: s.color }}
          title={`${s.name} ${formatPercent(s.percentage)}`}
        />
      ))}
    </div>
  );
}
