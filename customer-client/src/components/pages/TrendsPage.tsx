"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { AverageTrendChart } from "@/components/trends/AverageTrendChart";
import { CategoryTrendChart } from "@/components/trends/CategoryTrendChart";
import { CategoryTrendTable } from "@/components/trends/CategoryTrendTable";
import { TrendCard } from "@/components/trends/TrendCard";
import { TrendsChart } from "@/components/trends/TrendsChart";
import { TrendsTable } from "@/components/trends/TrendsTable";
import { WeekdayChart } from "@/components/trends/WeekdayChart";
import { WeekdayTable } from "@/components/trends/WeekdayTable";
import { PageHeader, SegmentedControl, type SegmentOption } from "@/components/ui";
import { useUrlState } from "@/hooks/useUrlState";
import { averageInsight, categoryInsight, weekdayInsight } from "@/lib/insights";
import { MONTH_CHOICES, type MonthsChoice } from "@/lib/params";
import { categoryTrendsQuery, trendsQuery, weekdaySpendingQuery } from "@/lib/queries";
import { PageFrame } from "./PageFrame";

const MONTH_OPTIONS: SegmentOption<`${MonthsChoice}`>[] = MONTH_CHOICES.map((m) => ({ label: `${m} months`, value: `${m}` }));

export function TrendsPage({ customerId }: { customerId: string }) {
  const { months, setMonths } = useUrlState();
  const trends = useQuery({ ...trendsQuery(customerId, months), placeholderData: keepPreviousData });
  const byCategory = useQuery({ ...categoryTrendsQuery(customerId, months), placeholderData: keepPreviousData });
  const weekdays = useQuery({ ...weekdaySpendingQuery(customerId, months), placeholderData: keepPreviousData });
  const window = `Last ${months} months`;
  return (
    <PageFrame>
      <PageHeader
        title="Trends"
        description="How spending moves over time: by month, by category, by transaction size and by day of the week."
        action={
          <SegmentedControl
            label="Months"
            options={MONTH_OPTIONS}
            value={`${months}`}
            onChange={(v) => setMonths(Number(v) as MonthsChoice)}
          />
        }
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <TrendsChart data={trends.data} months={months} loading={trends.isPlaceholderData} error={trends.error} onRetry={trends.refetch} />
        <TrendCard
          title="Spend by category"
          subtitle={window}
          data={byCategory.data}
          isEmpty={(d) => d.trends.length === 0}
          loading={byCategory.isPlaceholderData}
          error={byCategory.error}
          onRetry={byCategory.refetch}
          chart={(d) => <CategoryTrendChart data={d} label={`Stacked bar chart of monthly spend split by category for the last ${months} months`} />}
          table={(d) => <CategoryTrendTable data={d} />}
          insight={categoryInsight}
        />
        <TrendCard
          title="Average transaction"
          subtitle={window}
          data={trends.data}
          isEmpty={(d) => d.trends.length === 0}
          loading={trends.isPlaceholderData}
          error={trends.error}
          onRetry={trends.refetch}
          chart={(d) => <AverageTrendChart trends={d.trends} label={`Line chart of the average transaction amount per month for the last ${months} months`} />}
          table={(d) => <TrendsTable trends={d.trends} />}
          insight={(d) => averageInsight(d.trends)}
        />
        <TrendCard
          title="Spend by weekday"
          subtitle={window}
          data={weekdays.data}
          isEmpty={(d) => d.weekdays.every((w) => w.transactionCount === 0)}
          loading={weekdays.isPlaceholderData}
          error={weekdays.error}
          onRetry={weekdays.refetch}
          chart={(d) => <WeekdayChart weekdays={d.weekdays} label={`Bar chart of average spend per day of the week over the last ${months} months`} />}
          table={(d) => <WeekdayTable weekdays={d.weekdays} />}
          insight={(d) => weekdayInsight(d.weekdays)}
        />
      </div>
    </PageFrame>
  );
}
