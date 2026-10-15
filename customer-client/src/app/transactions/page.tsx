import type { Metadata } from "next";
import { TransactionsPage } from "@/components/pages/TransactionsPage";

export const metadata: Metadata = { title: "Transactions" };

export default function Page() {
  return <TransactionsPage />;
}
