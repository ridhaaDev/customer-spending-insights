// Calendar-day helpers on ISO strings (YYYY-MM-DD). The app works in UTC days, like the API.
import type { DateRangeValue, Period } from "./types";

export function todayIso(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

export function isoToDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function dateToIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDays(iso: string, days: number): string {
  const d = isoToDate(iso);
  d.setDate(d.getDate() + days);
  return dateToIso(d);
}

export const PERIOD_DAYS: Record<Period, number> = { "7d": 7, "30d": 30, "90d": 90, "1y": 365 };

// The same inclusive window the API uses for a period: `days` days ending today.
export function rangeForPeriod(period: Period, today = todayIso()): DateRangeValue {
  return { startDate: addDays(today, -(PERIOD_DAYS[period] - 1)), endDate: today };
}

export function thisMonth(today = todayIso()): DateRangeValue {
  return { startDate: `${today.slice(0, 7)}-01`, endDate: today };
}

export function lastMonth(today = todayIso()): DateRangeValue {
  const firstOfThis = isoToDate(`${today.slice(0, 7)}-01`);
  const lastOfPrev = new Date(firstOfThis.getFullYear(), firstOfThis.getMonth(), 0);
  const firstOfPrev = new Date(lastOfPrev.getFullYear(), lastOfPrev.getMonth(), 1);
  return { startDate: dateToIso(firstOfPrev), endDate: dateToIso(lastOfPrev) };
}

const monthShort = new Intl.DateTimeFormat("en-ZA", { month: "short", timeZone: "UTC" });

// "2 Oct – 9 Oct 2026", with both years when they differ. Day numbers are unpadded.
function dayMonth(iso: string): string {
  return `${Number(iso.slice(8, 10))} ${monthShort.format(new Date(`${iso}T12:00:00Z`))}`;
}

export function formatRange({ startDate, endDate }: DateRangeValue): string {
  const sameYear = startDate.slice(0, 4) === endDate.slice(0, 4);
  const start = sameYear ? dayMonth(startDate) : `${dayMonth(startDate)} ${startDate.slice(0, 4)}`;
  return `${start} – ${dayMonth(endDate)} ${endDate.slice(0, 4)}`;
}
