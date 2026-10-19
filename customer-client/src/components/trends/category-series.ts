import type { CategoryFilter, CategoryTrends, MonthCategoryTrend } from "@/lib/types";

export const MAX_SERIES = 7;
export const OTHER: CategoryFilter = { name: "Other", color: "var(--ink-muted)", icon: "tag" };

export interface CategorySeriesRow {
  month: string;
  totalSpent: number;
  values: Record<string, number>;
}

// Keeps the largest categories as their own series and folds the long tail into "Other" so the stack stays legible.
export function categorySeries(data: CategoryTrends): { series: CategoryFilter[]; rows: CategorySeriesRow[] } {
  const kept = data.categories.slice(0, MAX_SERIES);
  const folded = new Set(data.categories.slice(MAX_SERIES).map((c) => c.name));
  const series = folded.size > 0 ? [...kept, OTHER] : kept;
  const rows = data.trends.map((t: MonthCategoryTrend) => {
    const values: Record<string, number> = {};
    for (const [name, amount] of Object.entries(t.categories)) {
      const key = folded.has(name) ? OTHER.name : name;
      values[key] = Math.round(((values[key] ?? 0) + amount) * 100) / 100;
    }
    return { month: t.month, totalSpent: t.totalSpent, values };
  });
  return { series, rows };
}
