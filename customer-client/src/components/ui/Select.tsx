"use client";

import * as RadixSelect from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { useId } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

interface Props {
  label: string;
  options: SelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  hideLabel?: boolean;
  // Label above the control (forms) instead of beside it (toolbars).
  stacked?: boolean;
  required?: boolean;
  name?: string;
  className?: string;
}

// Radix-backed select: typeahead, arrow keys, Escape, and a styled list instead of the native one.
export function Select({
  label,
  options,
  value,
  onValueChange,
  placeholder = "Choose…",
  hideLabel = false,
  stacked = false,
  required,
  name,
  className = "",
}: Props) {
  const id = useId();
  const labelClass = hideLabel ? "sr-only" : stacked ? "mb-1 block font-medium text-ink" : "text-ink-muted";
  return (
    <div className={stacked ? "block text-sm" : "flex items-center gap-2 text-sm"}>
      <label id={`${id}-label`} htmlFor={id} className={labelClass}>
        {label}
      </label>
      {/* Radix can't represent "" as a value, so an empty string means "nothing chosen". */}
      <RadixSelect.Root value={value || undefined} onValueChange={onValueChange} required={required} name={name}>
        <RadixSelect.Trigger
          id={id}
          aria-labelledby={`${id}-label`}
          className={`inline-flex items-center justify-between gap-2 rounded-md border border-line bg-card px-3 text-sm font-medium text-ink hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent data-[placeholder]:text-ink-muted ${
            stacked ? "w-full py-2" : "py-1.5"
          } ${className}`}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon>
            <ChevronDown className="h-4 w-4 text-ink-muted" aria-hidden />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content
            position="popper"
            sideOffset={4}
            // Above the modal layer (z-50) so a select inside a dialog opens over it.
            className="z-[60] min-w-[var(--radix-select-trigger-width)] rounded-lg border border-line bg-card p-1 text-ink shadow-lg"
          >
            <RadixSelect.Viewport>
              {options.map((o) => (
                <RadixSelect.Item
                  key={o.value}
                  value={o.value}
                  className="relative flex cursor-default select-none items-center rounded-md py-1.5 pl-8 pr-3 text-sm outline-none data-[highlighted]:bg-surface data-[disabled]:opacity-40"
                >
                  <RadixSelect.ItemIndicator className="absolute left-2 inline-flex">
                    <Check className="h-4 w-4 text-accent" aria-hidden />
                  </RadixSelect.ItemIndicator>
                  <RadixSelect.ItemText>{o.label}</RadixSelect.ItemText>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    </div>
  );
}
