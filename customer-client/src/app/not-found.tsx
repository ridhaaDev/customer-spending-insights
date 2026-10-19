import Link from "next/link";

// Also what an unknown customer id lands on: the customer layout calls notFound(), which the
// root boundary renders.
export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="rounded-xl border border-line bg-card p-8 text-center">
        <h1 className="text-lg font-semibold text-ink">Page not found</h1>
        <p className="mt-2 text-sm text-ink-muted">There is no page or customer at this address.</p>
        <Link href="/" className="mt-4 inline-block text-sm font-medium text-accent-ink hover:underline">
          Go to the first customer
        </Link>
      </div>
    </main>
  );
}
