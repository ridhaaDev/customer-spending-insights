import { formatInteger, formatMonth, formatZAR } from "@/lib/format";
import type { MonthTrend } from "@/lib/types";

// The accessible twin of the bar chart.
export function TrendsTable({ trends }: { trends: MonthTrend[] }) {
  return (
    <table className="w-full text-sm">
      <thead className="text-left text-xs text-ink-muted">
        <tr>
          <th className="py-1.5 font-medium">Month</th>
          <th className="py-1.5 text-right font-medium">Spent</th>
          <th className="py-1.5 text-right font-medium">Transactions</th>
          <th className="py-1.5 text-right font-medium">Average</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-line tabular-nums">
        {trends.map((t) => (
          <tr key={t.month}>
            <td className="py-1.5 text-ink">{formatMonth(t.month, "long")}</td>
            <td className="py-1.5 text-right text-ink">{formatZAR(t.totalSpent)}</td>
            <td className="py-1.5 text-right text-ink-secondary">{formatInteger(t.transactionCount)}</td>
            <td className="py-1.5 text-right text-ink-secondary">{formatZAR(t.averageTransaction)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
