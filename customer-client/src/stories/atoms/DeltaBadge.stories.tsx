import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DeltaBadge } from "@/components/summary/DeltaBadge";

const meta = {
  title: "Atoms/DeltaBadge",
  component: DeltaBadge,
  args: { value: 18.1 },
  decorators: [(Story) => <div className="text-xs">{Story()}</div>],
} satisfies Meta<typeof DeltaBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Increase: Story = {};

export const Decrease: Story = { args: { value: -3.2 } };

export const NoChange: Story = { args: { value: 0 } };

export const NoPriorData: Story = { args: { value: null } };
