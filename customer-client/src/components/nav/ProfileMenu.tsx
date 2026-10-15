"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, ChevronDown } from "lucide-react";
import { Avatar } from "@/components/ui";
import type { CustomerSummary } from "@/lib/types";

interface Props {
  customers: CustomerSummary[];
  currentId: string | null;
  onSwitch: (customerId: string) => void;
}

// Account-style menu without sign-in: it only switches which customer the dashboard shows.
// Radix supplies the keyboard model, focus management, outside-click and Escape handling.
export function ProfileMenu({ customers, currentId, onSwitch }: Props) {
  const current = customers.find((c) => c.customerId === currentId);
  // Non-modal: a menu shouldn't hide the rest of the page from assistive tech.
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-line bg-card py-1 pl-1 pr-2 text-sm hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <Avatar name={current?.name ?? ""} size="sm" />
          <span className="hidden max-w-40 truncate font-medium text-ink sm:block">{current?.name ?? "Select profile"}</span>
          <ChevronDown className="h-4 w-4 text-ink-muted" aria-hidden />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          aria-label="Profile"
          className="z-30 w-72 rounded-xl border border-line bg-card p-2 text-ink shadow-lg"
        >
          {current && (
            <div className="flex items-center gap-3 px-2 py-2">
              <Avatar name={current.name} />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">{current.name}</p>
                <p className="truncate text-xs text-ink-muted">{current.email}</p>
              </div>
            </div>
          )}
          <DropdownMenu.Separator className="my-1 h-px bg-line" />
          <DropdownMenu.Label className="px-2 pb-1 pt-2 text-xs font-medium uppercase tracking-wide text-ink-muted">
            Switch profile
          </DropdownMenu.Label>
          <DropdownMenu.RadioGroup value={currentId ?? undefined} onValueChange={onSwitch}>
            {customers.map((c) => (
              <DropdownMenu.RadioItem
                key={c.customerId}
                value={c.customerId}
                className="flex cursor-default select-none items-center gap-3 rounded-md px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-surface"
              >
                <Avatar name={c.name} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-ink">{c.name}</span>
                  <span className="block truncate text-xs capitalize text-ink-muted">{c.accountType} account</span>
                </span>
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
