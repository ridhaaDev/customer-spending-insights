"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Candy, Check, Monitor, Moon, Sun, type LucideProps } from "lucide-react";
import type { ComponentType } from "react";
import type { Theme } from "@/context/ThemeContext";

export const THEME_OPTIONS: { value: Theme; label: string; Icon: ComponentType<LucideProps> }[] = [
  { value: "system", label: "System", Icon: Monitor },
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "candy", label: "Candy", Icon: Candy },
];

interface Props {
  value: Theme;
  onChange: (theme: Theme) => void;
}

export function ThemeMenu({ value, onChange }: Props) {
  const current = THEME_OPTIONS.find((o) => o.value === value) ?? THEME_OPTIONS[0];
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={`Theme: ${current.label}`}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-card text-ink hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <current.Icon className="h-4 w-4" aria-hidden />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" sideOffset={8} aria-label="Theme" className="z-30 w-44 rounded-xl border border-line bg-card p-1.5 text-ink shadow-lg">
          <DropdownMenu.RadioGroup value={value} onValueChange={(v) => onChange(v as Theme)}>
            {THEME_OPTIONS.map(({ value: v, label, Icon }) => (
              <DropdownMenu.RadioItem
                key={v}
                value={v}
                className="flex cursor-default select-none items-center gap-2.5 rounded-md px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-surface"
              >
                <Icon className="h-4 w-4 text-ink-secondary" aria-hidden />
                <span className="flex-1">{label}</span>
                <DropdownMenu.ItemIndicator>
                  <Check className="h-4 w-4 text-accent" aria-hidden />
                </DropdownMenu.ItemIndicator>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
