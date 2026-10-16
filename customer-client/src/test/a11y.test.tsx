import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { CategoryBreakdown } from "@/components/categories/CategoryBreakdown";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DateRangePicker } from "@/components/dashboard/DateRangePicker";
import { PeriodSelector } from "@/components/dashboard/PeriodSelector";
import { GoalsPanel } from "@/components/goals/GoalsPanel";
import { SummaryCards } from "@/components/summary/SummaryCards";
import { Pagination } from "@/components/transactions/Pagination";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { TrendsTable } from "@/components/trends/TrendsTable";
import { Card, ErrorState, PageHeader } from "@/components/ui";
import { categoryFilters, goals, paymentMethods, profile, spendingByCategory, summary, transactions, trends } from "@/test/fixtures";

// jsdom has no layout engine, so contrast is checked in the browser (Storybook a11y addon, axe over CDP).
const options = { rules: { "color-contrast": { enabled: false } } };
const noop = () => {};

const cases: Record<string, () => React.ReactElement> = {
  SummaryCards: () => <SummaryCards summary={summary} period="30d" loading={false} error={null} onRetry={noop} />,
  CategoryBreakdown: () => <CategoryBreakdown data={spendingByCategory} loading={false} error={null} onRetry={noop} />,
  GoalsPanel: () => <GoalsPanel data={{ goals }} categories={categoryFilters} loading={false} error={null} onRetry={noop} />,
  TrendsTable: () => <TrendsTable trends={trends} />,
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
      <DateRangePicker value={null} onChange={noop} />
    </>
  ),
  Header: () => <DashboardHeader profile={profile} error={null} onRetry={noop} />,
  TransactionForm: () => (
    <TransactionForm categories={categoryFilters} paymentMethods={paymentMethods} defaultDate="2026-10-16T12:00" onSubmit={noop} onCancel={noop} error="amount: must be positive" />
  ),
  ErrorState: () => <ErrorState message="Could not reach the API" onRetry={noop} />,
};

describe("accessibility (axe)", () => {
  for (const [name, element] of Object.entries(cases)) {
    it(`${name} has no violations`, async () => {
      const { container } = render(element());
      expect(await axe(container, options)).toHaveNoViolations();
    });
  }
});
