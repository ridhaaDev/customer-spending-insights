import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AverageTrendChart } from "@/components/trends/AverageTrendChart";
import { trends } from "@/test/fixtures";

const meta = {
  title: "Molecules/AverageTrendChart",
  component: AverageTrendChart,
  args: { trends, label: "Line chart of the average transaction amount per month for the last 12 months" },
  decorators: [(Story) => <div className="w-[36rem]">{Story()}</div>],
} satisfies Meta<typeof AverageTrendChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TwelveMonths: Story = {};

export const SixMonths: Story = { args: { trends: trends.slice(-6) } };

export const Narrow: Story = {
  decorators: [(Story) => <div className="w-72">{Story()}</div>],
};
