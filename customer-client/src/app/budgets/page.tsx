import type { Metadata } from "next";
import { BudgetsPage } from "@/components/pages/BudgetsPage";

export const metadata: Metadata = { title: "Budgets" };

export default function Page() {
  return <BudgetsPage />;
}
