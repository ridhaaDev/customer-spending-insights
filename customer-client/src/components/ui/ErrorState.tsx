import { CircleAlert, RefreshCw } from "lucide-react";
import { Button } from "./Button";

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 py-8 text-center">
      <CircleAlert className="h-6 w-6 text-critical" aria-hidden />
      <p className="text-sm text-ink-secondary">{message}</p>
      {onRetry && (
        <Button onClick={onRetry}>
          <RefreshCw className="h-3.5 w-3.5" aria-hidden /> Retry
        </Button>
      )}
    </div>
  );
}
