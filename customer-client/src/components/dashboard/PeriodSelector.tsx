import { SegmentedControl, type SegmentOption } from "@/components/ui";
import type { Period } from "@/lib/types";

export const DEFAULT_PRESETS: SegmentOption<Period>[] = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 90 days", value: "90d" },
  { label: "Last year", value: "1y" },
];

interface Props {
  value: Period;
  onChange: (period: Period) => void;
  presets?: SegmentOption<Period>[];
}

export function PeriodSelector({ value, onChange, presets = DEFAULT_PRESETS }: Props) {
  return <SegmentedControl label="Period" options={presets} value={value} onChange={onChange} />;
}
