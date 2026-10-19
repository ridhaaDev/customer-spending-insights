import type { CategoryFilter } from "@/lib/types";

// Swatch + name per series; the table twin carries the numbers.
export function ChartLegend({ series }: { series: CategoryFilter[] }) {
  return (
    <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-secondary">
      {series.map((s) => (
        <li key={s.name} className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: s.color }} aria-hidden />
          {s.name}
        </li>
      ))}
    </ul>
  );
}
