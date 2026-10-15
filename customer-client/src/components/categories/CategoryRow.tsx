import { CategoryChip } from "@/components/category/CategoryChip";
import { formatInteger, formatPercent, formatZAR } from "@/lib/format";
import type { CategorySpend } from "@/lib/types";

interface Props {
  category: CategorySpend;
  // Amount of the largest category, so the bar shows relative magnitude.
  maxAmount: number;
}

export function CategoryRow({ category: c, maxAmount }: Props) {
  return (
    <li className="grid grid-cols-[auto_1fr_auto] items-center gap-3 py-2.5 sm:grid-cols-[auto_minmax(0,1fr)_minmax(0,1.2fr)_auto]">
      <CategoryChip icon={c.icon} color={c.color} size="sm" />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-ink">{c.name}</p>
        <p className="text-xs text-ink-muted">{formatInteger(c.transactionCount)} transactions</p>
      </div>
      <div className="hidden h-1.5 rounded-full bg-line sm:block" aria-hidden>
        <div className="h-full rounded-full" style={{ width: `${(c.amount / maxAmount) * 100}%`, backgroundColor: c.color }} />
      </div>
      <div className="text-right">
        <p className="text-sm font-medium tabular-nums text-ink">{formatZAR(c.amount)}</p>
        <p className="text-xs tabular-nums text-ink-muted">{formatPercent(c.percentage)}</p>
      </div>
    </li>
  );
}
