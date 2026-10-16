"use client";

import * as Popover from "@radix-ui/react-popover";
import { CalendarDays, Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { dateToIso, formatRange, isoToDate, lastMonth, rangeForPeriod, thisMonth, todayIso } from "@/lib/dates";
import type { DateRangeValue, Period } from "@/lib/types";

export interface Preset {
  label: string;
  value: Period;
}

export const DEFAULT_PRESETS: Preset[] = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 90 days", value: "90d" },
  { label: "Last year", value: "1y" },
];

interface Props {
  // An explicit range wins over the relative period.
  range: DateRangeValue | null;
  period?: Period;
  presets?: Preset[];
  // When given, relative presets are emitted as periods; otherwise as concrete ranges ending today.
  onPeriodChange?: (period: Period) => void;
  onRangeChange: (range: DateRangeValue | null) => void;
  // Offers "All time", i.e. no date filter at all.
  allowAllTime?: boolean;
  today?: string;
}

const sameRange = (a: DateRangeValue | null, b: DateRangeValue) => !!a && a.startDate === b.startDate && a.endDate === b.endDate;

// "2 October 2026, Friday"
const dayLabel = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", weekday: "long" });

// One control for "when". Presets apply on click. The calendar works like a travel-site picker:
// the first click sets the start, hovering previews the range, the second click sets the end and
// applies; clicking before the start restarts the selection.
export function DateRangeControl({
  range,
  period,
  presets = DEFAULT_PRESETS,
  onPeriodChange,
  onRangeChange,
  allowAllTime = false,
  today = todayIso(),
}: Props) {
  const [open, setOpen] = useState(false);
  const [start, setStart] = useState<Date | undefined>();
  const [end, setEnd] = useState<Date | undefined>();
  const [hovered, setHovered] = useState<Date | undefined>();
  const narrow = useMediaQuery("(max-width: 640px)");

  const monthPresets = [
    { label: "This month", range: thisMonth(today) },
    { label: "Last month", range: lastMonth(today) },
  ];

  const activeRelative = (p: Preset) => (range ? sameRange(range, rangeForPeriod(p.value, today)) : period === p.value);
  const activeMonth = monthPresets.find((m) => sameRange(range, m.range));
  const allTimeActive = allowAllTime && !range && !period;

  const label = range
    ? (activeMonth?.label ?? presets.find(activeRelative)?.label ?? formatRange(range))
    : (presets.find((p) => p.value === period)?.label ?? "All time");

  const choose = (apply: () => void) => {
    apply();
    setOpen(false);
  };
  const chooseRelative = (p: Preset) =>
    choose(() => (onPeriodChange ? onPeriodChange(p.value) : onRangeChange(rangeForPeriod(p.value, today))));

  const onOpenChange = (next: boolean) => {
    if (next) {
      setStart(range ? isoToDate(range.startDate) : undefined);
      setEnd(range ? isoToDate(range.endDate) : undefined);
      setHovered(undefined);
    }
    setOpen(next);
  };

  const onDayClick = (day: Date) => {
    if (!start || end) {
      setStart(day);
      setEnd(undefined);
      return;
    }
    if (day < start) {
      setStart(day);
      return;
    }
    setEnd(day);
    choose(() => onRangeChange({ startDate: dateToIso(start), endDate: dateToIso(day) }));
  };

  const preview = start && !end && hovered && hovered > start ? hovered : undefined;
  const selected: DateRange | undefined = start ? { from: start, to: end ?? preview ?? start } : undefined;
  const hint = !start || end ? "Pick the first day of a custom range." : "Now pick the last day.";

  const itemClass = (active: boolean) =>
    `flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
      active ? "bg-surface font-medium text-ink" : "text-ink-secondary hover:bg-surface hover:text-ink"
    }`;

  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label={`Date range: ${label}`}
          className="inline-flex items-center gap-2 rounded-md border border-line bg-card px-3 py-1.5 text-sm font-medium text-ink hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <CalendarDays className="h-4 w-4 text-ink-muted" aria-hidden />
          {label}
          <ChevronDown className="h-4 w-4 text-ink-muted" aria-hidden />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={8}
          collisionPadding={12}
          aria-label="Choose a date range"
          className="z-30 max-w-[var(--radix-popover-content-available-width)] rounded-xl border border-line bg-card p-2 text-ink shadow-lg focus:outline-none"
        >
          <div className="flex flex-col gap-2 sm:flex-row">
            <ul className="flex flex-row flex-wrap gap-1 sm:w-40 sm:flex-col sm:border-r sm:border-line sm:pr-2" aria-label="Relative ranges">
              {presets.map((p) => (
                <li key={p.value}>
                  <button type="button" className={itemClass(activeRelative(p))} onClick={() => chooseRelative(p)}>
                    {p.label}
                    {activeRelative(p) && <Check className="h-4 w-4 text-accent" aria-hidden />}
                  </button>
                </li>
              ))}
              {monthPresets.map((m) => (
                <li key={m.label}>
                  <button type="button" className={itemClass(m === activeMonth)} onClick={() => choose(() => onRangeChange(m.range))}>
                    {m.label}
                    {m === activeMonth && <Check className="h-4 w-4 text-accent" aria-hidden />}
                  </button>
                </li>
              ))}
              {allowAllTime && (
                <li>
                  <button type="button" className={itemClass(allTimeActive)} onClick={() => choose(() => onRangeChange(null))}>
                    All time
                    {allTimeActive && <Check className="h-4 w-4 text-accent" aria-hidden />}
                  </button>
                </li>
              )}
            </ul>
            <div className="px-1" onMouseLeave={() => setHovered(undefined)}>
              <DayPicker
                mode="range"
                numberOfMonths={narrow ? 1 : 2}
                selected={selected}
                onSelect={() => undefined}
                onDayClick={onDayClick}
                onDayMouseEnter={(day) => setHovered(day)}
                defaultMonth={start ?? isoToDate(today)}
                disabled={{ after: isoToDate(today) }}
                endMonth={isoToDate(today)}
                // Accessible name starts with the visible day number (WCAG label-in-name).
                labels={{ labelDayButton: (date) => dayLabel.format(date) }}
              />
              <p className="px-2 pb-1 text-xs text-ink-muted" aria-live="polite">
                {hint}
              </p>
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
