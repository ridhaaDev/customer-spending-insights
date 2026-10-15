import type { Period } from "@/lib/types";

export const DEFAULT_PRESETS: { label: string; value: Period }[] = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 90 days", value: "90d" },
  { label: "Last year", value: "1y" },
];

interface Props {
  value: Period;
  onChange: (period: Period) => void;
  presets?: { label: string; value: Period }[];
}

export function PeriodSelector({ value, onChange, presets = DEFAULT_PRESETS }: Props) {
  return (
    <div role="radiogroup" aria-label="Period" className="inline-flex flex-wrap rounded-lg border border-line bg-card p-0.5">
      {presets.map((p) => {
        const active = p.value === value;
        return (
          <button
            key={p.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(p.value)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              active ? "bg-ink text-card" : "text-ink-secondary hover:bg-surface"
            }`}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );
}
