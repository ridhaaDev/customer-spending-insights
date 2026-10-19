import type { MonthTrend } from "@/lib/types";
import type { CategorySeriesRow } from "./category-series";

// Phones cannot fit 24 bars, so long windows collapse into calendar quarters there.
export const COLLAPSE_ABOVE = 12;
export const PHONE_QUERY = "(max-width: 639px)";

export const quarterKey = (month: string) => {
  const [y, m] = month.split("-").map(Number);
  return `${y}-Q${Math.ceil(m / 3)}`;
};

export function monthsToQuarters(trends: MonthTrend[]): MonthTrend[] {
  const out = new Map<string, MonthTrend>();
  for (const t of trends) {
    const key = quarterKey(t.month);
    const q = out.get(key) ?? { month: key, totalSpent: 0, transactionCount: 0, averageTransaction: 0 };
    q.totalSpent = Math.round((q.totalSpent + t.totalSpent) * 100) / 100;
    q.transactionCount += t.transactionCount;
    q.averageTransaction = q.transactionCount ? Math.round((q.totalSpent / q.transactionCount) * 100) / 100 : 0;
    out.set(key, q);
  }
  return [...out.values()];
}

export function categoryRowsToQuarters(rows: CategorySeriesRow[]): CategorySeriesRow[] {
  const out = new Map<string, CategorySeriesRow>();
  for (const r of rows) {
    const key = quarterKey(r.month);
    const q = out.get(key) ?? { month: key, totalSpent: 0, values: {} };
    q.totalSpent = Math.round((q.totalSpent + r.totalSpent) * 100) / 100;
    for (const [name, amount] of Object.entries(r.values)) q.values[name] = Math.round(((q.values[name] ?? 0) + amount) * 100) / 100;
    out.set(key, q);
  }
  return [...out.values()];
}
