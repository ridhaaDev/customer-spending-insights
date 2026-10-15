import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { SummaryCards } from "@/components/summary/SummaryCards";
import { summary } from "@/test/fixtures";

const meta = {
  title: "Organisms/SummaryCards",
  component: SummaryCards,
  args: { summary, period: "30d", loading: false, error: null, onRetry: fn() },
} satisfies Meta<typeof SummaryCards>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Refetching: Story = { args: { loading: true } };

export const NoPreviousPeriod: Story = {
  args: { summary: { ...summary, comparedToPrevious: { spentChange: null, transactionChange: null } } },
};

export const NoSpend: Story = {
  args: { summary: { ...summary, totalSpent: 0, transactionCount: 0, averageTransaction: 0, topCategory: null } },
};

export const Loading: Story = { args: { summary: undefined, loading: true } };

export const Error: Story = { args: { summary: undefined, error: new globalThis.Error("Could not reach the API") } };
