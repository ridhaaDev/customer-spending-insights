import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui";
import { formatInteger } from "@/lib/format";

interface Props {
  offset: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export function Pagination({ offset, pageSize, total, hasMore, onPrevious, onNext }: Props) {
  const from = total === 0 ? 0 : offset + 1;
  const to = Math.min(offset + pageSize, total);
  return (
    <nav className="mt-3 flex items-center justify-between border-t border-line pt-3 text-sm" aria-label="Pagination">
      <p className="text-ink-muted">
        Showing {formatInteger(from)}–{formatInteger(to)} of {formatInteger(total)}
      </p>
      <div className="flex gap-1">
        <Button size="icon" onClick={onPrevious} disabled={offset === 0} aria-label="Previous page">
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </Button>
        <Button size="icon" onClick={onNext} disabled={!hasMore} aria-label="Next page">
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Button>
      </div>
    </nav>
  );
}
