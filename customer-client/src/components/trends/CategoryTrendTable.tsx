import { formatMonth, formatZAR } from "@/lib/format";
import type { CategoryTrends } from "@/lib/types";
import { categorySeries } from "./category-series";

// The accessible twin of the stacked chart: one row per month, one column per series.
export function CategoryTrendTable({ data }: { data: CategoryTrends }) {
  const { series, rows } = categorySeries(data);
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-left text-xs text-ink-muted">
          <tr>
            <th className="py-1.5 pr-3 font-medium">Month</th>
            {series.map((s) => (
              <th key={s.name} className="py-1.5 pl-3 text-right font-medium whitespace-nowrap">
                {s.name}
              </th>
            ))}
            <th className="py-1.5 pl-3 text-right font-medium">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line tabular-nums">
          {rows.map((r) => (
            <tr key={r.month}>
              <td className="py-1.5 pr-3 whitespace-nowrap text-ink">{formatMonth(r.month, "long")}</td>
              {series.map((s) => (
                <td key={s.name} className="py-1.5 pl-3 text-right text-ink-secondary">
                  {r.values[s.name] ? formatZAR(r.values[s.name]) : "–"}
                </td>
              ))}
              <td className="py-1.5 pl-3 text-right font-medium text-ink">{formatZAR(r.totalSpent)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
