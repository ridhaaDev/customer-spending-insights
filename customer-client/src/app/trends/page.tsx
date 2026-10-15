import type { Metadata } from "next";
import { TrendsPage } from "@/components/pages/TrendsPage";

export const metadata: Metadata = { title: "Trends" };

export default function Page() {
  return <TrendsPage />;
}
