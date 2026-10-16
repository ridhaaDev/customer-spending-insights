import Link from "next/link";

export default function CustomerNotFound() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="rounded-xl border border-line bg-card p-8 text-center">
        <h1 className="text-lg font-semibold text-ink">Customer not found</h1>
        <p className="mt-2 text-sm text-ink-muted">There is no customer with that id.</p>
        <Link href="/" className="mt-4 inline-block text-sm font-medium text-accent-ink hover:underline">
          Go to the first customer
        </Link>
      </div>
    </main>
  );
}
