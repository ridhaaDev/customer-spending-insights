import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GoalMeter } from "@/components/goals/GoalMeter";

const meta = {
  title: "Atoms/GoalMeter",
  component: GoalMeter,
  args: { percentageUsed: 68, status: "on_track", label: "Groceries budget used" },
  decorators: [(Story) => <div className="w-80">{Story()}</div>],
} satisfies Meta<typeof GoalMeter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnTrack: Story = {};

export const NearLimit: Story = { args: { percentageUsed: 88, status: "warning" } };

export const OverBudgetClampsAt100: Story = { args: { percentageUsed: 137, status: "exceeded" } };

export const Empty: Story = { args: { percentageUsed: 0 } };
