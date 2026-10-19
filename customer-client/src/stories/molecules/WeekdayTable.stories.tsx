import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WeekdayTable } from "@/components/trends/WeekdayTable";
import { weekdaySpending } from "@/test/fixtures";

const meta = {
  title: "Molecules/WeekdayTable",
  component: WeekdayTable,
  args: { weekdays: weekdaySpending.weekdays },
  decorators: [(Story) => <div className="w-[32rem] max-w-full">{Story()}</div>],
} satisfies Meta<typeof WeekdayTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
