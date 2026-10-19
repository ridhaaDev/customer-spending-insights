import type { CategoryFilter } from "@/lib/types";

interface Props {
  series: CategoryFilter[];
  // With `onToggle`, each entry is a button that hides or shows its series.
  hidden?: ReadonlySet<string>;
  onToggle?: (name: string) => void;
  onShowAll?: () => void;
}

// Swatch + name per series; the table twin carries the numbers.
export function ChartLegend({ series, hidden, onToggle, onShowAll }: Props) {
  const Swatch = ({ color }: { color: string }) => <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: color }} aria-hidden />;
  return (
    <ul className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-secondary">
      {series.map((s) => {
        const off = hidden?.has(s.name) ?? false;
        return (
          <li key={s.name} className="inline-flex items-center">
            {onToggle ? (
              <button
                type="button"
                aria-pressed={!off}
                onClick={() => onToggle(s.name)}
                className={`inline-flex min-h-6 items-center gap-1.5 rounded px-0.5 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${off ? "text-ink-muted line-through decoration-ink-muted/60" : ""}`}
              >
                <Swatch color={off ? "var(--line-strong)" : s.color} />
                {s.name}
              </button>
            ) : (
              <span className="inline-flex items-center gap-1.5">
                <Swatch color={s.color} />
                {s.name}
              </span>
            )}
          </li>
        );
      })}
      {onShowAll && hidden && hidden.size > 0 && (
        <li>
          <button type="button" onClick={onShowAll} className="inline-flex min-h-6 items-center rounded px-0.5 font-medium text-accent-ink hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">
            Show all
          </button>
        </li>
      )}
    </ul>
  );
}
