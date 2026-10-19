// One-sentence readings of each trend, computed from the same data the charts draw.
import { formatMonth, formatZAR } from "./format";
import type { CategoryTrends, MonthTrend, WeekdaySpend } from "./types";

const whole = (v: number) => formatZAR(v, { whole: true });
const share = (part: number, total: number) => Math.round((part / total) * 100);

// "3% above", "3% below" or "in line with"; differences under half a percent are noise.
export function relative(value: number, baseline: number): string {
  if (baseline === 0) return "in line with";
  const diff = Math.round(((value - baseline) / baseline) * 100);
  if (diff === 0) return "in line with";
  return `${Math.abs(diff)}% ${diff > 0 ? "above" : "below"}`;
}

const possessive = (name: string) => (name.endsWith("s") ? `${name}'` : `${name}'s`);

// Only completed months: the in-progress month would drag every average down.
const completed = <T>(rows: T[]) => rows.slice(0, -1);

export function monthlyInsight(trends: MonthTrend[]): string | null {
  const full = completed(trends);
  if (full.length < 2) return null;
  const peak = full.reduce((a, b) => (b.totalSpent > a.totalSpent ? b : a));
  const average = full.reduce((s, t) => s + t.totalSpent, 0) / full.length;
  const last = full[full.length - 1];
  return `Spending peaked in ${formatMonth(peak.month, "long")} at ${whole(peak.totalSpent)}. ${formatMonth(last.month, "long")} was ${relative(last.totalSpent, average)} the ${whole(average)} monthly average.`;
}

export function averageInsight(trends: MonthTrend[]): string | null {
  const full = completed(trends);
  const count = full.reduce((s, t) => s + t.transactionCount, 0);
  if (full.length < 2 || count === 0) return null;
  const average = full.reduce((s, t) => s + t.totalSpent, 0) / count;
  const last = full[full.length - 1];
  return `The average transaction was ${formatZAR(average)} across the window. ${formatMonth(last.month, "long")} came in ${relative(last.averageTransaction, average)} that.`;
}

export function categoryInsight(data: CategoryTrends): string | null {
  const full = completed(data.trends);
  if (full.length < 2) return null;
  const totals = new Map<string, number>();
  for (const t of full) for (const [name, amount] of Object.entries(t.categories)) totals.set(name, (totals.get(name) ?? 0) + amount);
  const grand = [...totals.values()].reduce((s, v) => s + v, 0);
  if (grand === 0) return null;
  const [topName, topTotal] = [...totals.entries()].reduce((a, b) => (b[1] > a[1] ? b : a));
  const lead = `${topName} is ${share(topTotal, grand)}% of spend.`;

  // Compare each category's share of the first half of the window with its share of the second half.
  const half = Math.floor(full.length / 2);
  const shareOf = (rows: MonthTrend[] | typeof full, name: string) => {
    const total = rows.reduce((s, t) => s + t.totalSpent, 0);
    return total === 0 ? 0 : (rows.reduce((s, t) => s + ((t as (typeof full)[number]).categories[name] ?? 0), 0) / total) * 100;
  };
  let mover: { name: string; from: number; to: number } | null = null;
  for (const name of totals.keys()) {
    const from = shareOf(full.slice(0, half), name);
    const to = shareOf(full.slice(half), name);
    const change = to - from;
    if (Math.abs(change) < 1) continue;
    // Largest swing wins; on a tie the category that grew is the more useful one to name.
    const best = mover ? mover.to - mover.from : 0;
    if (!mover || Math.abs(change) > Math.abs(best) || (Math.abs(change) === Math.abs(best) && change > best)) mover = { name, from, to };
  }
  if (!mover) return `${lead} Shares barely moved across the window.`;
  const verb = mover.to > mover.from ? "grew" : "shrank";
  return `${lead} ${possessive(mover.name)} share ${verb} the most, from ${Math.round(mover.from)}% to ${Math.round(mover.to)}% between the two halves of the window.`;
}

export function weekdayInsight(weekdays: WeekdaySpend[]): string | null {
  if (weekdays.length === 0 || weekdays.every((w) => w.transactionCount === 0)) return null;
  const top = weekdays.reduce((a, b) => (b.averagePerDay > a.averagePerDay ? b : a));
  const low = weekdays.reduce((a, b) => (b.averagePerDay < a.averagePerDay ? b : a));
  const workdays = weekdays.filter((w) => w.weekday !== "Saturday" && w.weekday !== "Sunday");
  const workdayAverage = workdays.reduce((s, w) => s + w.averagePerDay, 0) / Math.max(workdays.length, 1);
  return `${top.weekday}s are the most expensive at ${whole(top.averagePerDay)} a day, ${relative(top.averagePerDay, workdayAverage)} the Monday-to-Friday average. ${low.weekday}s are the quietest at ${whole(low.averagePerDay)}.`;
}
