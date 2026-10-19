import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { CategoryTrendChart } from "@/components/trends/CategoryTrendChart";
import { CategoryTrendTable } from "@/components/trends/CategoryTrendTable";
import { TrendCard } from "@/components/trends/TrendCard";
import { WeekdayChart } from "@/components/trends/WeekdayChart";
import { WeekdayTable } from "@/components/trends/WeekdayTable";
import type { CategoryTrends, WeekdaySpending } from "@/lib/types";
import { categoryTrends, weekdaySpending } from "@/test/fixtures";

// The generic chart card: header, chart/table toggle and the loading, empty and error states.
const meta = {
  title: "Organisms/TrendCard",
  component: TrendCard<CategoryTrends>,
  args: {
    title: "Spend by category",
    subtitle: "Last 12 months",
    data: categoryTrends,
    isEmpty: (d: CategoryTrends) => d.trends.length === 0,
    loading: false,
    error: null,
    onRetry: fn(),
    chart: (d: CategoryTrends) => <CategoryTrendChart data={d} label="Stacked bar chart of monthly spend split by category" />,
    table: (d: CategoryTrends) => <CategoryTrendTable data={d} />,
  },
  decorators: [(Story) => <div className="w-[40rem] max-w-full">{Story()}</div>],
} satisfies Meta<typeof TrendCard<CategoryTrends>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SpendByCategory: Story = {};

export const ToggledToTable: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Table" }));
    await expect(canvas.getByRole("table")).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Chart" })).toHaveAttribute("aria-pressed", "true");
  },
};

export const SpendByWeekday: StoryObj<Meta<typeof TrendCard<WeekdaySpending>>> = {
  render: () => (
    <TrendCard
      title="Spend by weekday"
      subtitle="Last 12 months"
      data={weekdaySpending}
      isEmpty={(d) => d.weekdays.every((w) => w.transactionCount === 0)}
      loading={false}
      error={null}
      onRetry={fn()}
      chart={(d) => <WeekdayChart weekdays={d.weekdays} label="Bar chart of average spend per day of the week" />}
      table={(d) => <WeekdayTable weekdays={d.weekdays} />}
    />
  ),
};

export const Refetching: Story = { args: { loading: true } };

export const Empty: Story = { args: { data: { trends: [], categories: [] } } };

export const Loading: Story = { args: { data: undefined, loading: true } };

export const Error: Story = { args: { data: undefined, error: new globalThis.Error("Could not reach the API") } };
