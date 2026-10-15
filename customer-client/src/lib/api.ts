import type {
  CustomerList,
  CustomerProfile,
  Filters,
  GoalList,
  Period,
  SortBy,
  SpendingByCategory,
  SpendingSummary,
  SpendingTrends,
  TransactionPage,
} from "./types";

// Base URL of the customer-api. Baked in at build time from NEXT_PUBLIC_API_URL.
export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly detail?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type Params = Record<string, string | number | undefined | null>;

export function buildUrl(path: string, params: Params = {}): string {
  const url = new URL(`${API_URL}${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
  }
  return url.toString();
}

async function request<T>(path: string, params: Params = {}, signal?: AbortSignal): Promise<T> {
  let res: Response;
  try {
    res = await fetch(buildUrl(path, params), { signal, headers: { Accept: "application/json" } });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    throw new ApiError(0, "Could not reach the API");
  }
  if (!res.ok) {
    let detail: unknown;
    try {
      detail = (await res.json())?.detail;
    } catch {
      /* non-JSON error body */
    }
    const message = typeof detail === "string" ? detail : `API returned ${res.status}`;
    throw new ApiError(res.status, message, detail);
  }
  try {
    return (await res.json()) as T;
  } catch {
    // e.g. a proxy answering 200 with an HTML page
    throw new ApiError(res.status, "The API returned an unreadable response");
  }
}

export interface TransactionQuery {
  limit?: number;
  offset?: number;
  category?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: SortBy;
}

export const api = {
  health: (signal?: AbortSignal) => request<{ status: string }>("/health", {}, signal),

  listCustomers: (signal?: AbortSignal) => request<CustomerList>("/api/customers", {}, signal),

  profile: (customerId: string, signal?: AbortSignal) =>
    request<CustomerProfile>(`/api/customers/${encodeURIComponent(customerId)}/profile`, {}, signal),

  summary: (customerId: string, period: Period, signal?: AbortSignal) =>
    request<SpendingSummary>(`/api/customers/${encodeURIComponent(customerId)}/spending/summary`, { period }, signal),

  // Either a preset period or a custom inclusive range; the API gives the range precedence.
  categories: (customerId: string, query: { period?: Period; startDate?: string; endDate?: string }, signal?: AbortSignal) =>
    request<SpendingByCategory>(`/api/customers/${encodeURIComponent(customerId)}/spending/categories`, { ...query }, signal),

  trends: (customerId: string, months: number, signal?: AbortSignal) =>
    request<SpendingTrends>(`/api/customers/${encodeURIComponent(customerId)}/spending/trends`, { months }, signal),

  transactions: (customerId: string, query: TransactionQuery, signal?: AbortSignal) =>
    request<TransactionPage>(`/api/customers/${encodeURIComponent(customerId)}/transactions`, { ...query }, signal),

  goals: (customerId: string, signal?: AbortSignal) =>
    request<GoalList>(`/api/customers/${encodeURIComponent(customerId)}/goals`, {}, signal),

  filters: (customerId: string, signal?: AbortSignal) =>
    request<Filters>(`/api/customers/${encodeURIComponent(customerId)}/filters`, {}, signal),
};
