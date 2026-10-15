import { Skeleton } from "@/components/ui";
import { formatDate, formatZAR } from "@/lib/format";
import type { CustomerProfile } from "@/lib/types";

interface Props {
  profile: CustomerProfile | undefined;
  error: Error | null;
  onRetry: () => void;
}

export function DashboardHeader({ profile, error, onRetry }: Props) {
  return (
    <header>
      {profile ? (
        <>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">{profile.name}</h1>
          <p className="mt-1 text-sm text-ink-muted">
            <span className="capitalize">{profile.accountType}</span> account
            <span className="mx-1.5">·</span>
            Customer since {formatDate(profile.joinDate)}
            <span className="mx-1.5">·</span>
            {formatZAR(profile.totalSpent, { whole: true })} lifetime
          </p>
        </>
      ) : error ? (
        <>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">Overview</h1>
          <p className="mt-1 text-sm text-critical">
            Could not load the profile: {error.message}{" "}
            <button type="button" onClick={onRetry} className="underline">
              Retry
            </button>
          </p>
        </>
      ) : (
        <>
          <Skeleton className="h-7 w-56" />
          <Skeleton className="mt-2 h-4 w-72" />
        </>
      )}
    </header>
  );
}
