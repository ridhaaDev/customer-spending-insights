import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CategoryTrendChart } from "@/components/trends/CategoryTrendChart";
import { categoryTrends } from "@/test/fixtures";

const meta = {
  title: "Molecules/CategoryTrendChart",
  component: CategoryTrendChart,
  args: { data: categoryTrends, label: "Stacked bar chart of monthly spend split by category for the last 12 months" },
  decorators: [(Story) => <div className="w-[36rem]">{Story()}</div>],
} satisfies Meta<typeof CategoryTrendChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TwelveMonths: Story = {};

export const SixMonths: Story = { args: { data: { ...categoryTrends, trends: categoryTrends.trends.slice(-6) } } };

// Nine categories: the two smallest fold into "Other".
export const LongTail: Story = {
  args: {
    data: {
      categories: [
        ...categoryTrends.categories,
        { name: "Pets", color: "#0f766e", icon: "paw-print" },
        { name: "Gifts", color: "#b45309", icon: "gift" },
        { name: "Fitness", color: "#6d28d9", icon: "dumbbell" },
      ],
      trends: categoryTrends.trends.map((t) => ({
        ...t,
        totalSpent: Math.round((t.totalSpent + 760) * 100) / 100,
        categories: { ...t.categories, Pets: 320, Gifts: 260, Fitness: 180 },
      })),
    },
  },
};

export const Narrow: Story = {
  decorators: [(Story) => <div className="w-72">{Story()}</div>],
};
