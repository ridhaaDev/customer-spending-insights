// URL state: parsing of search params and building of customer-scoped paths.
import type { DateRangeValue, Period } from "./types";

export const PERIODS: Period[] = ["7d", "30d", "90d", "1y"];
export const DEFAULT_PERIOD: Period = "30d";

export type MonthsChoice = 6 | 12 | 24;
export const MONTH_CHOICES: MonthsChoice[] = [6, 12, 24];
export const DEFAULT_MONTHS: MonthsChoice = 12;

type Param = string | string[] | undefined;

const first = (v: Param) => (Array.isArray(v) ? v[0] : v);

export function parsePeriod(value: Param): Period {
  const v = first(value);
  return (PERIODS as string[]).includes(v ?? "") ? (v as Period) : DEFAULT_PERIOD;
}

export function parseMonths(value: Param): MonthsChoice {
  const n = Number(first(value));
  return (MONTH_CHOICES as number[]).includes(n) ? (n as MonthsChoice) : DEFAULT_MONTHS;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

// Both bounds must be present, well-formed and ordered; anything else means "no custom range".
export function parseDateRange(from: Param, to: Param): DateRangeValue | null {
  const startDate = first(from);
  const endDate = first(to);
  if (!startDate || !endDate || !ISO_DATE.test(startDate) || !ISO_DATE.test(endDate) || startDate > endDate) return null;
  return { startDate, endDate };
}

export type Section = "" | "categories" | "trends" | "budgets" | "transactions";

export function customerPath(customerId: string, section: Section = ""): string {
  const base = `/customers/${encodeURIComponent(customerId)}`;
  return section ? `${base}/${section}` : base;
}

// Swaps the customer id in a /customers/{id}/... path, keeping the section.
export function withCustomer(pathname: string, customerId: string): string {
  const match = pathname.match(/^\/customers\/[^/]+(\/.*)?$/);
  const rest = match?.[1] ?? "";
  return `/customers/${encodeURIComponent(customerId)}${rest}`;
}

export function sectionOf(pathname: string): Section {
  const match = pathname.match(/^\/customers\/[^/]+\/?([^/?]*)/);
  const seg = match?.[1] ?? "";
  return (["categories", "trends", "budgets", "transactions"] as const).includes(seg as Exclude<Section, "">) ? (seg as Section) : "";
}
