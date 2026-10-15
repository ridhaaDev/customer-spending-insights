"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useQuery, type QueryState } from "@/hooks/useQuery";
import { api } from "@/lib/api";
import type { CustomerList, Period } from "@/lib/types";

const STORAGE_KEY = "spending-insights.customer";

interface DashboardState {
  customers: QueryState<CustomerList>;
  // Resolved customer: the explicit choice if it exists in the list, else the first customer.
  customerId: string | null;
  selectCustomer: (customerId: string) => void;
  period: Period;
  setPeriod: (period: Period) => void;
}

const DashboardContext = createContext<DashboardState | null>(null);

function readSavedCustomer(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const customers = useQuery("customers", (signal) => api.listCustomers(signal));
  const [chosenId, setChosenId] = useState<string | null>(readSavedCustomer);
  const [period, setPeriod] = useState<Period>("30d");

  const list = customers.data?.customers;
  const known = chosenId !== null && list?.some((c) => c.customerId === chosenId);
  const customerId = known ? chosenId : (list?.[0]?.customerId ?? null);

  const selectCustomer = (id: string) => {
    setChosenId(id);
    try {
      window.localStorage.setItem(STORAGE_KEY, id);
    } catch {
      /* storage unavailable: the choice still lasts for this session */
    }
  };

  return (
    <DashboardContext.Provider value={{ customers, customerId, selectCustomer, period, setPeriod }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard(): DashboardState {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used inside DashboardProvider");
  return ctx;
}
