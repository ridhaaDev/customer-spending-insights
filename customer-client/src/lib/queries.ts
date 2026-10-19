// Query definitions shared by server prefetching and client components, so keys always match.
import { queryOptions } from "@tanstack/react-query";
import { api, type CategoriesQuery, type TransactionQuery } from "./api";
import type { Period } from "./types";

export const RECENT_LIMIT = 8;

export const customersQuery = () =>
  queryOptions({ queryKey: ["customers"], queryFn: ({ signal }) => api.listCustomers(signal) });

export const profileQuery = (customerId: string) =>
  queryOptions({ queryKey: ["customer", customerId, "profile"], queryFn: ({ signal }) => api.profile(customerId, signal) });

export const filtersQuery = (customerId: string) =>
  queryOptions({ queryKey: ["customer", customerId, "filters"], queryFn: ({ signal }) => api.filters(customerId, signal) });

export const summaryQuery = (customerId: string, period: Period) =>
  queryOptions({
    queryKey: ["customer", customerId, "summary", period],
    queryFn: ({ signal }) => api.summary(customerId, period, signal),
  });

export const categoriesQuery = (customerId: string, query: CategoriesQuery) =>
  queryOptions({
    queryKey: ["customer", customerId, "categories", query],
    queryFn: ({ signal }) => api.categories(customerId, query, signal),
  });

export const trendsQuery = (customerId: string, months: number) =>
  queryOptions({
    queryKey: ["customer", customerId, "trends", months],
    queryFn: ({ signal }) => api.trends(customerId, months, signal),
  });

export const categoryTrendsQuery = (customerId: string, months: number) =>
  queryOptions({
    queryKey: ["customer", customerId, "trends", "categories", months],
    queryFn: ({ signal }) => api.categoryTrends(customerId, months, signal),
  });

export const weekdaySpendingQuery = (customerId: string, months: number) =>
  queryOptions({
    queryKey: ["customer", customerId, "weekdays", months],
    queryFn: ({ signal }) => api.weekdaySpending(customerId, months, signal),
  });

export const goalsQuery = (customerId: string) =>
  queryOptions({ queryKey: ["customer", customerId, "goals"], queryFn: ({ signal }) => api.goals(customerId, signal) });

export const transactionsQuery = (customerId: string, query: TransactionQuery) =>
  queryOptions({
    queryKey: ["customer", customerId, "transactions", query],
    queryFn: ({ signal }) => api.transactions(customerId, query, signal),
  });

export const recentTransactionsQuery = (customerId: string) =>
  transactionsQuery(customerId, { limit: RECENT_LIMIT, sortBy: "date_desc" });
