"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { parseDateRange, parseMonths, parsePeriod, type MonthsChoice } from "@/lib/params";
import type { DateRangeValue, Period } from "@/lib/types";

// Reads view state from the URL and writes it back with replace, so every view is a shareable link.
export function useUrlState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const update = useCallback(
    (changes: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(changes)) {
        if (value === null || value === "") next.delete(key);
        else next.set(key, value);
      }
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const period = parsePeriod(searchParams.get("period") ?? undefined);
  const months = parseMonths(searchParams.get("months") ?? undefined);
  const range = parseDateRange(searchParams.get("from") ?? undefined, searchParams.get("to") ?? undefined);

  return {
    search: searchParams.toString(),
    period,
    setPeriod: (p: Period) => update({ period: p, from: null, to: null }),
    months,
    setMonths: (m: MonthsChoice) => update({ months: String(m) }),
    range,
    setRange: (r: DateRangeValue | null) => update(r ? { from: r.startDate, to: r.endDate } : { from: null, to: null }),
  };
}
