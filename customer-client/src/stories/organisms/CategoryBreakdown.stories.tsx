import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { CategoryBreakdown } from "@/components/categories/CategoryBreakdown";
import { spendingByCategory } from "@/test/fixtures";

const meta = {
  title: "Organisms/CategoryBreakdown",
  component: CategoryBreakdown,
  args: { data: spendingByCategory, loading: false, error: null, onRetry: fn() },
  decorators: [(Story) => <div className="w-[36rem] max-w-full">{Story()}</div>],
} satisfies Meta<typeof CategoryBreakdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Refetching: Story = { args: { loading: true } };

export const SingleCategory: Story = {
  args: {
    data: {
      ...spendingByCategory,
      totalAmount: 11792.85,
      categories: [{ ...spendingByCategory.categories[0], percentage: 100 }],
    },
  },
};

export const Empty: Story = { args: { data: { ...spendingByCategory, totalAmount: 0, categories: [] } } };

export const Loading: Story = { args: { data: undefined, loading: true } };

export const Error: Story = { args: { data: undefined, error: new globalThis.Error("API returned 500") } };
