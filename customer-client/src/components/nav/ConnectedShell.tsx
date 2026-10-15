"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useDashboard } from "@/context/DashboardContext";
import { AppShell } from "./AppShell";

// Wires the presentational shell to the shared customer state and the current route.
export function ConnectedShell({ children }: { children: ReactNode }) {
  const { customers, customerId, selectCustomer } = useDashboard();
  const pathname = usePathname();
  return (
    <AppShell customers={customers.data?.customers} currentId={customerId} onSwitch={selectCustomer} activeHref={pathname}>
      {children}
    </AppShell>
  );
}
