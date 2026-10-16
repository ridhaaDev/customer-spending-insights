// Builds the transaction list query from UI state. Plain module so the server page can prefetch
// exactly the query the client panel will issue first.
import type { TransactionQuery } from "./api";
import type { DateRangeValue, SortBy } from "./types";

export const PAGE_SIZE = 10;

export interface TransactionListState {
  offset: number;
  category: string;
  sortBy: SortBy;
  dateRange: DateRangeValue | null;
}

export function buildTransactionQuery(s: TransactionListState): TransactionQuery {
  const q: TransactionQuery = { limit: PAGE_SIZE, offset: s.offset, sortBy: s.sortBy };
  if (s.category) q.category = s.category;
  if (s.dateRange) {
    q.startDate = s.dateRange.startDate;
    q.endDate = s.dateRange.endDate;
  }
  return q;
}

export function firstPageQuery(dateRange: DateRangeValue | null): TransactionQuery {
  return buildTransactionQuery({ offset: 0, category: "", sortBy: "date_desc", dateRange });
}
