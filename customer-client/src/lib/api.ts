import type {
  CustomerList,
  Transaction,
  TransactionCreate,
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

// In the browser the URL is baked in at build time; on the server (Next's Node runtime) API_URL
// can point at an internal address, e.g. http://api:8000 inside compose.
const PUBLIC_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
export const API_URL = (typeof window === "undefined" ? (process.env.API_URL ?? PUBLIC_URL) : PUBLIC_URL).replace(/\/$/, "");

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

interface RequestOptions {
  signal?: AbortSignal;
  method?: "GET" | "POST";
  body?: unknown;
}

async function request<T>(path: string, params: Params = {}, { signal, method = "GET", body }: RequestOptions = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(buildUrl(path, params), {
      method,
      signal,
      headers: { Accept: "application/json", ...(body !== undefined ? { "Content-Type": "application/json" } : {}) },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
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
    const message = describeDetail(detail) ?? `API returned ${res.status}`;
    throw new ApiError(res.status, message, detail);
  }
  try {
    return (await res.json()) as T;
  } catch {
    // e.g. a proxy answering 200 with an HTML page
    throw new ApiError(res.status, "The API returned an unreadable response");
  }
}

// FastAPI validation errors arrive as a list of {loc, msg}; turn them into one readable line.
function describeDetail(detail: unknown): string | undefined {
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    const parts = detail
      .map((d) => {
        if (!d || typeof d !== "object") return null;
        const { loc, msg } = d as { loc?: unknown[]; msg?: string };
        const field = Array.isArray(loc) ? String(loc[loc.length - 1]) : undefined;
        return field && msg ? `${field}: ${msg}` : (msg ?? null);
      })
      .filter(Boolean);
    if (parts.length) return parts.join("; ");
  }
  return undefined;
}

export interface TransactionQuery {
  limit?: number;
  offset?: number;
  category?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: SortBy;
}

export interface CategoriesQuery {
  period?: Period;
  startDate?: string;
  endDate?: string;
}

export const api = {
  health: (signal?: AbortSignal) => request<{ status: string }>("/health", {}, { signal }),

  listCustomers: (signal?: AbortSignal) => request<CustomerList>("/api/customers", {}, { signal }),

  profile: (customerId: string, signal?: AbortSignal) =>
    request<CustomerProfile>(`/api/customers/${encodeURIComponent(customerId)}/profile`, {}, { signal }),

  summary: (customerId: string, period: Period, signal?: AbortSignal) =>
    request<SpendingSummary>(`/api/customers/${encodeURIComponent(customerId)}/spending/summary`, { period }, { signal }),

  // Either a preset period or a custom inclusive range; the API gives the range precedence.
  categories: (customerId: string, query: CategoriesQuery, signal?: AbortSignal) =>
    request<SpendingByCategory>(`/api/customers/${encodeURIComponent(customerId)}/spending/categories`, { ...query }, { signal }),

  trends: (customerId: string, months: number, signal?: AbortSignal) =>
    request<SpendingTrends>(`/api/customers/${encodeURIComponent(customerId)}/spending/trends`, { months }, { signal }),

  transactions: (customerId: string, query: TransactionQuery, signal?: AbortSignal) =>
    request<TransactionPage>(`/api/customers/${encodeURIComponent(customerId)}/transactions`, { ...query }, { signal }),

  createTransaction: (customerId: string, body: TransactionCreate) =>
    request<Transaction>(`/api/customers/${encodeURIComponent(customerId)}/transactions`, {}, { method: "POST", body }),

  goals: (customerId: string, signal?: AbortSignal) =>
    request<GoalList>(`/api/customers/${encodeURIComponent(customerId)}/goals`, {}, { signal }),

  filters: (customerId: string, signal?: AbortSignal) =>
    request<Filters>(`/api/customers/${encodeURIComponent(customerId)}/filters`, {}, { signal }),
};
