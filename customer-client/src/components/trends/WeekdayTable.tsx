import { formatInteger, formatZAR } from "@/lib/format";
import type { WeekdaySpend } from "@/lib/types";

// The accessible twin of the weekday chart.
export function WeekdayTable({ weekdays }: { weekdays: WeekdaySpend[] }) {
  return (
    <table className="w-full text-sm">
      <thead className="text-left text-xs text-ink-muted">
        <tr>
          <th className="py-1.5 font-medium">Day</th>
          <th className="py-1.5 text-right font-medium">Average per day</th>
          <th className="py-1.5 text-right font-medium">Total</th>
          <th className="py-1.5 text-right font-medium">Transactions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-line tabular-nums">
        {weekdays.map((w) => (
          <tr key={w.weekday}>
            <td className="py-1.5 text-ink">{w.weekday}</td>
            <td className="py-1.5 text-right text-ink">{formatZAR(w.averagePerDay)}</td>
            <td className="py-1.5 text-right text-ink-secondary">{formatZAR(w.totalSpent)}</td>
            <td className="py-1.5 text-right text-ink-secondary">{formatInteger(w.transactionCount)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
