import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StatusBadge } from "@/components/goals/StatusBadge";

const meta = {
  title: "Atoms/StatusBadge",
  component: StatusBadge,
  args: { status: "on_track", detail: "68% used" },
  decorators: [(Story) => <div className="text-xs">{Story()}</div>],
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnTrack: Story = {};

export const NearLimit: Story = { args: { status: "warning", detail: "88% used" } };

export const OverBudget: Story = { args: { status: "exceeded", detail: "137% used" } };

export const WithoutDetail: Story = { args: { detail: undefined } };
