import { formatZAR } from "@/lib/format";

interface Props {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  index?: number;
  value?: number | string;
  peakIndex: number;
}

// Direct-labels only the peak month; the axis and tooltip carry the rest.
export function PeakLabel({ x, y, width, index, value, peakIndex }: Props) {
  if (index !== peakIndex || x === undefined || y === undefined || width === undefined) return null;
  return (
    <text x={Number(x) + Number(width) / 2} y={Number(y) - 6} textAnchor="middle" className="fill-ink-secondary text-xs tabular-nums">
      {formatZAR(Number(value), { compact: true })}
    </text>
  );
}
