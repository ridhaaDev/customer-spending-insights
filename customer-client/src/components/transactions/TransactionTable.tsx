import { CategoryChip } from "@/components/category/CategoryChip";
import { formatDateTime, formatZAR } from "@/lib/format";
import type { Transaction } from "@/lib/types";

interface Props {
  transactions: Transaction[];
  // Compact drops the payment column until 2xl so the table fits a narrow card without scrolling.
  compact?: boolean;
}

export function TransactionTable({ transactions, compact = false }: Props) {
  const payment = compact ? "hidden 2xl:table-cell" : "hidden md:table-cell";
  return (
    // The scroll region is focusable so keyboard users can reach the overflow with arrow keys.
    <div className="-mx-5 overflow-x-auto px-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent" tabIndex={0} role="region" aria-label="Transactions table">
      <table className={`w-full text-sm ${compact ? "min-w-[26rem]" : "min-w-[32rem]"}`}>
        <thead className="text-left text-xs text-ink-muted">
          <tr>
            <th className="py-2 pr-3 font-medium">Merchant</th>
            <th className="py-2 pr-3 font-medium">Category</th>
            <th className={`py-2 pr-3 font-medium ${payment}`}>Payment</th>
            <th className="py-2 pr-3 font-medium">Date</th>
            <th className="py-2 text-right font-medium">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {transactions.map((t) => (
            <tr key={t.id}>
              <td className="py-2.5 pr-3">
                <div className="flex items-center gap-2.5">
                  <CategoryChip icon={t.icon} color={t.categoryColor} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink">{t.merchant}</p>
                    <p className="truncate text-xs text-ink-muted">{t.description}</p>
                  </div>
                </div>
              </td>
              <td className="py-2.5 pr-3 text-ink-secondary">{t.category}</td>
              <td className={`whitespace-nowrap py-2.5 pr-3 text-ink-secondary ${payment}`}>{t.paymentMethod}</td>
              <td className="whitespace-nowrap py-2.5 pr-3 text-ink-secondary">{formatDateTime(t.date)}</td>
              <td className="whitespace-nowrap py-2.5 text-right font-medium tabular-nums text-ink">{formatZAR(t.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
