import { CategoryChip } from "@/components/category/CategoryChip";
import { formatDateTime, formatZAR } from "@/lib/format";
import type { Transaction } from "@/lib/types";

export function TransactionTable({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="-mx-5 overflow-x-auto px-5">
      <table className="w-full min-w-[32rem] text-sm">
        <thead className="text-left text-xs text-ink-muted">
          <tr>
            <th className="py-2 pr-3 font-medium">Merchant</th>
            <th className="py-2 pr-3 font-medium">Category</th>
            <th className="hidden py-2 pr-3 font-medium md:table-cell">Payment</th>
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
              <td className="hidden whitespace-nowrap py-2.5 pr-3 text-ink-secondary md:table-cell">{t.paymentMethod}</td>
              <td className="whitespace-nowrap py-2.5 pr-3 text-ink-secondary">{formatDateTime(t.date)}</td>
              <td className="whitespace-nowrap py-2.5 text-right font-medium tabular-nums text-ink">{formatZAR(t.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
