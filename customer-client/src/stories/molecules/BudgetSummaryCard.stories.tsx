import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BudgetSummaryCard } from "@/components/goals/BudgetSummaryCard";
import { goals } from "@/test/fixtures";

const meta = {
  title: "Molecules/BudgetSummaryCard",
  component: BudgetSummaryCard,
  args: { goals },
  decorators: [(Story) => <div className="w-80">{Story()}</div>],
} satisfies Meta<typeof BudgetSummaryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OneBudgetOver: Story = {};

export const AllOnTrack: Story = { args: { goals: goals.map((g) => ({ ...g, currentSpent: g.monthlyBudget * 0.4, percentageUsed: 40, status: "on_track" })) } };

export const NoBudgets: Story = { args: { goals: [] } };

export const Loading: Story = { args: { goals: undefined } };
