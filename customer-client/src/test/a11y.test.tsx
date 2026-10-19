import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { CategoryBreakdown } from "@/components/categories/CategoryBreakdown";
import { CategoryForm } from "@/components/categories/CategoryForm";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DateRangeControl } from "@/components/dashboard/DateRangeControl";
import { PeriodSelector } from "@/components/dashboard/PeriodSelector";
import { BudgetSummaryCard } from "@/components/goals/BudgetSummaryCard";
import { GoalForm } from "@/components/goals/GoalForm";
import { GoalsPanel } from "@/components/goals/GoalsPanel";
import { SummaryCards } from "@/components/summary/SummaryCards";
import { Pagination } from "@/components/transactions/Pagination";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { CategoryTrendTable } from "@/components/trends/CategoryTrendTable";
import { ChartLegend } from "@/components/trends/ChartLegend";
import { TrendsTable } from "@/components/trends/TrendsTable";
import { WeekdayTable } from "@/components/trends/WeekdayTable";
import { Card, ErrorState, Modal, PageHeader } from "@/components/ui";
import {
  categoryColors,
  categoryFilters,
  categoryIcons,
  categoryTrends,
  goals,
  paymentMethods,
  profile,
  spendingByCategory,
  summary,
  transactions,
  trends,
  weekdaySpending,
} from "@/test/fixtures";

// jsdom has no layout engine, so contrast is checked in the browser (Storybook a11y addon, axe over CDP).
const options = { rules: { "color-contrast": { enabled: false } } };
const noop = () => {};

const cases: Record<string, () => React.ReactElement> = {
  SummaryCards: () => <SummaryCards summary={summary} period="30d" loading={false} error={null} onRetry={noop} />,
  CategoryBreakdown: () => <CategoryBreakdown data={spendingByCategory} loading={false} error={null} onRetry={noop} />,
  GoalsPanel: () => <GoalsPanel data={{ goals }} categories={categoryFilters} loading={false} error={null} onRetry={noop} />,
  Budgets: () => (
    <>
      <BudgetSummaryCard goals={goals} />
      <GoalForm categories={categoryFilters} budgeted={["Groceries"]} onSubmit={noop} onCancel={noop} />
    </>
  ),
  TrendsTable: () => <TrendsTable trends={trends} />,
  TrendTables: () => (
    <>
      <CategoryTrendTable data={categoryTrends} />
      <ChartLegend series={categoryTrends.categories} hidden={new Set(["Dining"])} onToggle={noop} onShowAll={noop} />
      <WeekdayTable weekdays={weekdaySpending.weekdays} />
    </>
  ),
  Transactions: () => (
    <Card>
      <TransactionFilters categories={categoryFilters} category="" sortBy="date_desc" onCategoryChange={noop} onSortChange={noop} />
      <TransactionTable transactions={transactions} />
      <Pagination offset={0} pageSize={10} total={42} hasMore onPrevious={noop} onNext={noop} />
    </Card>
  ),
  Controls: () => (
    <>
      <PageHeader title="Categories" description="Where the money went." />
      <PeriodSelector value="30d" onChange={noop} />
      <DateRangeControl range={null} period="30d" onPeriodChange={noop} onRangeChange={noop} today="2026-10-16" />
    </>
  ),
  Header: () => <DashboardHeader profile={profile} error={null} onRetry={noop} />,
  TransactionForm: () => (
    <TransactionForm categories={categoryFilters} paymentMethods={paymentMethods} defaultDate="2026-10-16T12:00" onSubmit={noop} onCancel={noop} error="amount: must be positive" />
  ),
  CategoryForm: () => <CategoryForm colors={categoryColors} icons={categoryIcons} onSubmit={noop} onCancel={noop} />,
  ErrorState: () => <ErrorState message="Could not reach the API" onRetry={noop} />,
  Modal: () => (
    <Modal open onOpenChange={noop} title="Add transaction" description="Recorded against this customer.">
      <TransactionForm categories={categoryFilters} paymentMethods={paymentMethods} defaultDate="2026-10-16T12:00" onSubmit={noop} onCancel={noop} />
    </Modal>
  ),
};

describe("accessibility (axe)", () => {
  for (const [name, element] of Object.entries(cases)) {
    it(`${name} has no violations`, async () => {
      const { container } = render(element());
      expect(await axe(container, options)).toHaveNoViolations();
    });
  }
});
