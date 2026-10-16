import { redirect } from "next/navigation";
import { api } from "@/lib/api";
import { customerPath } from "@/lib/params";

// Fetches at request time, never at build time.
export const dynamic = "force-dynamic";

export default async function Home() {
  const { customers } = await api.listCustomers();
  if (customers.length === 0) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10 text-sm text-ink-muted">
        No customers are available.
      </main>
    );
  }
  redirect(customerPath(customers[0].customerId));
}
