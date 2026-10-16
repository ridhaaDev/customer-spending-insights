"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useUrlState } from "@/hooks/useUrlState";
import { withCustomer } from "@/lib/params";
import { customersQuery } from "@/lib/queries";
import { AppShell } from "./AppShell";
import { navItemsFor } from "./SideNav";
import { ThemeMenu } from "./ThemeMenu";

// Wires the presentational shell to the route: customer from the path, view state from the search params.
export function ConnectedShell({ customerId, children }: { customerId: string; children: ReactNode }) {
  const { data } = useQuery(customersQuery());
  const { theme, setTheme } = useTheme();
  const { search } = useUrlState();
  const pathname = usePathname();
  const router = useRouter();

  const switchCustomer = (id: string) => {
    router.push(search ? `${withCustomer(pathname, id)}?${search}` : withCustomer(pathname, id));
  };

  return (
    <AppShell
      customers={data?.customers}
      currentId={customerId}
      onSwitch={switchCustomer}
      items={navItemsFor(customerId, search)}
      activeHref={pathname}
      tools={<ThemeMenu value={theme} onChange={setTheme} />}
    >
      {children}
    </AppShell>
  );
}
