"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/ui";
import type { CustomerSummary } from "@/lib/types";

interface Props {
  customers: CustomerSummary[];
  currentId: string | null;
  onSwitch: (customerId: string) => void;
}

// Account-style menu without sign-in: it only switches which customer the dashboard shows.
export function ProfileMenu({ customers, currentId, onSwitch }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = customers.find((c) => c.customerId === currentId);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const choose = (id: string) => {
    onSwitch(id);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-line bg-card py-1 pl-1 pr-2 text-sm hover:bg-surface focus:outline-none focus:ring-2 focus:ring-accent"
      >
        <Avatar name={current?.name ?? ""} size="sm" />
        <span className="hidden max-w-40 truncate font-medium text-ink sm:block">{current?.name ?? "Select profile"}</span>
        <ChevronDown className="h-4 w-4 text-ink-muted" aria-hidden />
      </button>

      {open && (
        <div role="menu" aria-label="Profile" className="absolute right-0 z-30 mt-2 w-72 rounded-xl border border-line bg-card p-2 shadow-lg">
          {current && (
            <div className="flex items-center gap-3 px-2 py-2">
              <Avatar name={current.name} />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">{current.name}</p>
                <p className="truncate text-xs text-ink-muted">{current.email}</p>
              </div>
            </div>
          )}
          <p className="border-t border-line px-2 pb-1 pt-3 text-xs font-medium uppercase tracking-wide text-ink-muted">Switch profile</p>
          <ul>
            {customers.map((c) => {
              const checked = c.customerId === currentId;
              return (
                <li key={c.customerId}>
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={checked}
                    onClick={() => choose(c.customerId)}
                    className="flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left text-sm hover:bg-surface"
                  >
                    <Avatar name={c.name} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-ink">{c.name}</span>
                      <span className="block truncate text-xs capitalize text-ink-muted">{c.accountType} account</span>
                    </span>
                    {checked && <Check className="h-4 w-4 text-accent" aria-hidden />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
