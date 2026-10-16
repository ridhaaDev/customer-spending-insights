// Wire types for customer-api. Field names are camelCase as the API serialises them.

export type Period = "7d" | "30d" | "90d" | "1y";
// Categories are per-customer data (six defaults plus whatever the customer adds), so names are open strings.
export type CategoryName = string;
export type AccountType = "standard" | "premium" | "business";
export type SortBy = "date_desc" | "date_asc" | "amount_desc" | "amount_asc";
export type GoalStatus = "on_track" | "warning" | "exceeded";

export interface DateRangeValue {
  startDate: string; // YYYY-MM-DD, inclusive
  endDate: string;
}

export interface CustomerSummary {
  customerId: string;
  name: string;
  email: string;
  accountType: AccountType;
}

export interface CustomerList {
  customers: CustomerSummary[];
}

export interface CustomerProfile extends CustomerSummary {
  joinDate: string; // YYYY-MM-DD
  totalSpent: number;
  currency: string;
}

export interface SpendingSummary {
  period: Period;
  totalSpent: number;
  transactionCount: number;
  averageTransaction: number;
  topCategory: CategoryName | null;
  comparedToPrevious: {
    spentChange: number | null; // percent; null when the previous period had no spend
    transactionChange: number | null;
  };
}

export interface CategorySpend {
  name: CategoryName;
  amount: number;
  percentage: number;
  transactionCount: number;
  color: string;
  icon: string;
}

export interface SpendingByCategory {
  dateRange: { startDate: string; endDate: string };
  totalAmount: number;
  categories: CategorySpend[];
}

export interface MonthTrend {
  month: string; // YYYY-MM
  totalSpent: number;
  transactionCount: number;
  averageTransaction: number;
}

export interface SpendingTrends {
  trends: MonthTrend[];
}

export interface Transaction {
  id: string;
  date: string; // ISO 8601
  merchant: string;
  category: CategoryName;
  amount: number;
  description: string;
  paymentMethod: string;
  icon: string;
  categoryColor: string;
}

export interface TransactionPage {
  transactions: Transaction[];
  pagination: { total: number; limit: number; offset: number; hasMore: boolean };
}

export interface Goal {
  id: string;
  category: CategoryName;
  monthlyBudget: number;
  currentSpent: number;
  percentageUsed: number;
  daysRemaining: number;
  status: GoalStatus;
}

export interface GoalList {
  goals: Goal[];
}

export interface CategoryFilter {
  name: CategoryName;
  color: string;
  icon: string;
}

export interface Filters {
  categories: CategoryFilter[];
  dateRangePresets: { label: string; value: Period }[];
  paymentMethods: string[];
  // Choices offered when creating a category: lucide icon names and a colour-vision-checked palette.
  icons: string[];
  colors: string[];
}

// Body of POST /categories.
export interface CategoryCreate {
  name: string;
  color: string;
  icon: string;
}

// Body of POST /transactions. `date` is ISO 8601; omit it to record "now".
export interface TransactionCreate {
  merchant: string;
  category: CategoryName;
  amount: number;
  date?: string;
  description?: string;
  paymentMethod: string;
}
