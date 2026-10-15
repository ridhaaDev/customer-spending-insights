import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TrendTooltip } from "@/components/trends/TrendTooltip";
import { trends } from "@/test/fixtures";

const meta = {
  title: "Molecules/TrendTooltip",
  component: TrendTooltip,
  args: { active: true, payload: [{ payload: trends[4] }], currentMonth: trends.at(-1)?.month },
} satisfies Meta<typeof TrendTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CompletedMonth: Story = {};

export const CurrentMonthToDate: Story = { args: { payload: [{ payload: trends[trends.length - 1] }] } };

export const InactiveRendersNothing: Story = { args: { active: false } };
