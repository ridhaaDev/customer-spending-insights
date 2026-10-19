import type { Period } from "./types";

const LOCALE = "en-ZA";

const zar = new Intl.NumberFormat(LOCALE, { style: "currency", currency: "ZAR" });
const zarWhole = new Intl.NumberFormat(LOCALE, { style: "currency", currency: "ZAR", maximumFractionDigits: 0 });
const zarCompact = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: "ZAR",
  notation: "compact",
  maximumFractionDigits: 1,
});
const integer = new Intl.NumberFormat(LOCALE);

/** "R 1 234,50". `compact` gives "R 12k" for axis ticks; `whole` drops cents for headline figures. */
export function formatZAR(amount: number, opts: { compact?: boolean; whole?: boolean } = {}): string {
  if (opts.compact) return zarCompact.format(amount);
  if (opts.whole) return zarWhole.format(amount);
  return zar.format(amount);
}

export function formatInteger(value: number): string {
  return integer.format(value);
}

/** Signed percentage with one decimal, e.g. "+12.5%". */
export function formatChange(value: number | null): string {
  if (value === null) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

const monthShort = new Intl.DateTimeFormat(LOCALE, { month: "short" });
const monthLong = new Intl.DateTimeFormat(LOCALE, { month: "long", year: "numeric" });

/** "2024-09" -> "Sep" (short) or "September 2024" (long). */
export function formatMonth(yyyyMm: string, style: "short" | "long" = "short"): string {
  const [y, m] = yyyyMm.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1, 1, 12));
  return style === "short" ? monthShort.format(d) : monthLong.format(d);
}

/** A month key ("2024-09") or a quarter key ("2024-Q3", used when a phone collapses months into quarters). */
export function formatBucket(key: string, style: "short" | "long" = "short"): string {
  const q = /^(\d{4})-Q([1-4])$/.exec(key);
  if (!q) return formatMonth(key, style);
  return style === "short" ? `Q${q[2]} ${q[1].slice(2)}` : `Q${q[2]} ${q[1]}`;
}

// Dates display in UTC because the API buckets by UTC calendar day.
const dateFmt = new Intl.DateTimeFormat(LOCALE, { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const dateTimeFmt = new Intl.DateTimeFormat(LOCALE, {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
});

export function formatDate(iso: string): string {
  return dateFmt.format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return dateTimeFmt.format(new Date(iso));
}

export const PERIOD_LABEL: Record<Period, string> = {
  "7d": "7 days",
  "30d": "30 days",
  "90d": "90 days",
  "1y": "12 months",
};

// True for amounts representable in cents. Compares against the rounded cents with a tolerance,
// because e.g. 78.9 * 100 is 7890.000000000001 in floating point.
export function hasAtMostTwoDecimals(amount: number): boolean {
  const cents = amount * 100;
  return Math.abs(cents - Math.round(cents)) < 1e-6;
}
