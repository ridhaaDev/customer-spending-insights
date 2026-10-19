import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WeekdayChart } from "@/components/trends/WeekdayChart";
import { weekdaySpending } from "@/test/fixtures";

const meta = {
  title: "Molecules/WeekdayChart",
  component: WeekdayChart,
  args: { weekdays: weekdaySpending.weekdays, label: "Bar chart of average spend per day of the week over the last 12 months" },
  decorators: [(Story) => <div className="w-[36rem]">{Story()}</div>],
} satisfies Meta<typeof WeekdayChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TwelveMonths: Story = {};

export const Narrow: Story = {
  decorators: [(Story) => <div className="w-72">{Story()}</div>],
};
