"use client";

import { useState, type ReactNode } from "react";
import type { CustomerSummary } from "@/lib/types";
import { SideNav } from "./SideNav";
import { TopNav } from "./TopNav";

interface Props {
  customers: CustomerSummary[] | undefined;
  currentId: string | null;
  onSwitch: (customerId: string) => void;
  activeHref: string;
  children: ReactNode;
}

// Top bar plus a left column on large screens, which becomes a drawer below that.
export function AppShell({ customers, currentId, onSwitch, activeHref, children }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <TopNav
        customers={customers}
        currentId={currentId}
        onSwitch={onSwitch}
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((o) => !o)}
      />
      <div className="flex flex-1">
        <aside className="hidden w-56 shrink-0 border-r border-line bg-card lg:block">
          <div className="sticky top-14 p-3">
            <SideNav activeHref={activeHref} />
          </div>
        </aside>

        {menuOpen && (
          <div className="fixed inset-0 top-14 z-10 lg:hidden">
            <button type="button" aria-label="Close navigation" onClick={closeMenu} className="absolute inset-0 bg-black/40" />
            <aside className="absolute inset-y-0 left-0 w-64 bg-card p-3 shadow-xl">
              <SideNav activeHref={activeHref} onNavigate={closeMenu} />
            </aside>
          </div>
        )}

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
