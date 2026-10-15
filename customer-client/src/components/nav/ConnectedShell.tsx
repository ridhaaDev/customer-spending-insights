"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useDashboard } from "@/context/DashboardContext";
import { useTheme } from "@/context/ThemeContext";
import { AppShell } from "./AppShell";
import { ThemeMenu } from "./ThemeMenu";

// Wires the presentational shell to the shared customer state, the theme and the current route.
export function ConnectedShell({ children }: { children: ReactNode }) {
  const { customers, customerId, selectCustomer } = useDashboard();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  return (
    <AppShell
      customers={customers.data?.customers}
      currentId={customerId}
      onSwitch={selectCustomer}
      activeHref={pathname}
      tools={<ThemeMenu value={theme} onChange={setTheme} />}
    >
      {children}
    </AppShell>
  );
}
