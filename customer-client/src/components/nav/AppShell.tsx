"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState, type ReactNode } from "react";
import type { CustomerSummary } from "@/lib/types";
import { SideNav, type NavItem } from "./SideNav";
import { TopNav } from "./TopNav";

interface Props {
  customers: CustomerSummary[] | undefined;
  currentId: string | null;
  onSwitch: (customerId: string) => void;
  items: NavItem[];
  activeHref: string;
  tools?: ReactNode;
  children: ReactNode;
}

// Top bar plus a left column on large screens; below that the nav is a dialog-backed drawer
// so focus is trapped while open and returned to the menu button on close.
export function AppShell({ customers, currentId, onSwitch, items, activeHref, tools, children }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-full flex-1 flex-col">
      {/* Leaves the tab order while the drawer (a modal dialog) is open. */}
      <a
        href="#main"
        tabIndex={menuOpen ? -1 : 0}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-card focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-ink focus:ring-2 focus:ring-accent"
      >
        Skip to content
      </a>
      <TopNav
        customers={customers}
        currentId={currentId}
        onSwitch={onSwitch}
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((o) => !o)}
        tools={tools}
      />
      <div className="flex flex-1">
        <aside className="hidden w-56 shrink-0 border-r border-line bg-card lg:block">
          <div className="sticky top-14 p-3">
            <SideNav items={items} activeHref={activeHref} />
          </div>
        </aside>

        <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 top-14 z-10 bg-black/40 lg:hidden" />
            <Dialog.Content
              aria-describedby={undefined}
              className="fixed inset-y-0 left-0 top-14 z-20 w-64 bg-card p-3 shadow-xl focus:outline-none lg:hidden"
            >
              <Dialog.Title className="sr-only">Navigation</Dialog.Title>
              <SideNav items={items} activeHref={activeHref} onNavigate={() => setMenuOpen(false)} />
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
