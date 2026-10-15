"use client";

import * as RadioGroup from "@radix-ui/react-radio-group";

export interface SegmentOption<T extends string> {
  label: string;
  value: T;
}

interface Props<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
}

// A radio group in the shape of a segmented control: arrow keys move between options.
export function SegmentedControl<T extends string>({ options, value, onChange, label }: Props<T>) {
  return (
    <RadioGroup.Root
      value={value}
      onValueChange={(v) => onChange(v as T)}
      aria-label={label}
      orientation="horizontal"
      className="inline-flex flex-wrap rounded-lg border border-line bg-card p-0.5"
    >
      {options.map((o) => (
        <RadioGroup.Item
          key={o.value}
          value={o.value}
          className="rounded-md px-3 py-1.5 text-sm font-medium text-ink-secondary transition-colors hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent data-[state=checked]:bg-ink data-[state=checked]:text-card data-[state=checked]:hover:bg-ink"
        >
          {o.label}
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
}
