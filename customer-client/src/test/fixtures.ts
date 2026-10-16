// Sample API payloads shared by stories and tests.
import type {
  CategoryFilter,
  CategorySpend,
  CustomerProfile,
  CustomerSummary,
  Goal,
  MonthTrend,
  SpendingByCategory,
  SpendingSummary,
  Transaction,
} from "@/lib/types";

export const categoryFilters: CategoryFilter[] = [
  { name: "Groceries", color: "#e34948", icon: "shopping-cart" },
  { name: "Entertainment", color: "#e87ba4", icon: "film" },
  { name: "Transportation", color: "#2a78d6", icon: "car" },
  { name: "Dining", color: "#eda100", icon: "utensils" },
  { name: "Shopping", color: "#4a3aa7", icon: "shopping-bag" },
  { name: "Utilities", color: "#1baf7a", icon: "zap" },
];

const meta = Object.fromEntries(categoryFilters.map((c) => [c.name, c])) as Record<string, CategoryFilter>;

export const categoryIcons = ["shopping-cart", "film", "car", "utensils", "shopping-bag", "zap", "house", "heart-pulse", "graduation-cap", "plane", "gift", "baby", "paw-print", "wrench", "briefcase", "coffee"];
export const categoryColors = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300", "#4a3aa7", "#e34948"];

export const paymentMethods = ["Credit Card", "Debit Card", "Debit Order", "EFT", "Instant EFT"];

export const customers: CustomerSummary[] = [
  { customerId: "10001", name: "Thandi Mokoena", email: "thandi.mokoena@example.com", accountType: "premium" },
  { customerId: "10002", name: "Johan van der Merwe", email: "johan.vdm@example.com", accountType: "standard" },
  { customerId: "10003", name: "Priya Naidoo", email: "priya.naidoo@example.com", accountType: "premium" },
];

export const profile: CustomerProfile = {
  ...customers[0],
  joinDate: "2024-04-15",
  totalSpent: 509777.1,
  currency: "ZAR",
};

export const summary: SpendingSummary = {
  period: "30d",
  totalSpent: 25807.87,
  transactionCount: 51,
  averageTransaction: 506.04,
  topCategory: "Groceries",
  comparedToPrevious: { spentChange: 18.1, transactionChange: -3.2 },
};

export const categorySpend: CategorySpend[] = [
  { ...meta.Groceries, amount: 11792.85, percentage: 45.7, transactionCount: 21 },
  { ...meta.Utilities, amount: 4760.43, percentage: 18.4, transactionCount: 5 },
  { ...meta.Shopping, amount: 4348.28, percentage: 16.8, transactionCount: 7 },
  { ...meta.Transportation, amount: 2814.94, percentage: 10.9, transactionCount: 8 },
  { ...meta.Dining, amount: 1675.48, percentage: 6.5, transactionCount: 7 },
  { ...meta.Entertainment, amount: 415.89, percentage: 1.6, transactionCount: 3 },
];

export const spendingByCategory: SpendingByCategory = {
  dateRange: { startDate: "2026-09-10", endDate: "2026-10-09" },
  totalAmount: 25807.87,
  categories: categorySpend,
};

export const trends: MonthTrend[] = [
  ["2025-11", 21640.1, 52],
  ["2025-12", 24990.4, 61],
  ["2026-01", 20410.2, 48],
  ["2026-02", 19870.0, 45],
  ["2026-03", 26210.7, 58],
  ["2026-04", 19520.3, 44],
  ["2026-05", 20110.9, 47],
  ["2026-06", 22480.0, 50],
  ["2026-07", 19360.5, 46],
  ["2026-08", 20090.8, 49],
  ["2026-09", 21780.2, 51],
  ["2026-10", 9293.7, 19],
].map(([month, totalSpent, transactionCount]) => ({
  month: month as string,
  totalSpent: totalSpent as number,
  transactionCount: transactionCount as number,
  averageTransaction: Math.round(((totalSpent as number) / (transactionCount as number)) * 100) / 100,
}));

export const goals: Goal[] = [
  { id: "goal_001", category: "Groceries", monthlyBudget: 8800, currentSpent: 6024.1, percentageUsed: 68.46, daysRemaining: 22, status: "on_track" },
  { id: "goal_002", category: "Dining", monthlyBudget: 1350, currentSpent: 1187.5, percentageUsed: 87.96, daysRemaining: 22, status: "warning" },
  { id: "goal_003", category: "Entertainment", monthlyBudget: 1350, currentSpent: 1854.3, percentageUsed: 137.36, daysRemaining: 22, status: "exceeded" },
];

const txn = (
  id: string,
  date: string,
  merchant: string,
  category: CategoryFilter["name"],
  amount: number,
  description: string,
  paymentMethod: string,
): Transaction => ({
  id,
  date,
  merchant,
  category,
  amount,
  description,
  paymentMethod,
  icon: meta[category].icon,
  categoryColor: meta[category].color,
});

export const transactions: Transaction[] = [
  txn("txn_000001", "2026-10-09T21:57:00Z", "Woolworths Food", "Groceries", 135.8, "Groceries", "Credit Card"),
  txn("txn_000002", "2026-10-09T18:01:00Z", "Pick n Pay", "Groceries", 983.36, "Groceries", "Credit Card"),
  txn("txn_000003", "2026-10-09T14:11:00Z", "Uber", "Transportation", 86.5, "Ride", "Debit Card"),
  txn("txn_000004", "2026-10-08T19:53:00Z", "Nando's", "Dining", 215.9, "Takeaway", "Credit Card"),
  txn("txn_000005", "2026-10-08T10:05:00Z", "Mr Price", "Shopping", 343.14, "Clothing", "Credit Card"),
  txn("txn_000006", "2026-10-05T06:00:00Z", "Spotify", "Entertainment", 64.99, "Monthly subscription", "Debit Order"),
  txn("txn_000007", "2026-10-01T06:00:00Z", "Afrihost", "Utilities", 897, "Fibre", "Debit Order"),
];
