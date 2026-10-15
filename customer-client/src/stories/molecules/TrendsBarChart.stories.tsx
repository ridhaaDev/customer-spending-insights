import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TrendsBarChart } from "@/components/trends/TrendsBarChart";
import { trends } from "@/test/fixtures";

const meta = {
  title: "Molecules/TrendsBarChart",
  component: TrendsBarChart,
  args: { trends, label: "Bar chart of total spending per month for the last 12 months" },
  decorators: [(Story) => <div className="w-[36rem]">{Story()}</div>],
} satisfies Meta<typeof TrendsBarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TwelveMonths: Story = {};

export const SixMonths: Story = { args: { trends: trends.slice(-6) } };

export const Narrow: Story = {
  decorators: [(Story) => <div className="w-72">{Story()}</div>],
};
