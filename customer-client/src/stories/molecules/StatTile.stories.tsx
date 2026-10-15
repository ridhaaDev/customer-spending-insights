import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DeltaBadge } from "@/components/summary/DeltaBadge";
import { StatTile, StatTileSkeleton } from "@/components/summary/StatTile";

const meta = {
  title: "Molecules/StatTile",
  component: StatTile,
  args: { label: "Total spent", value: "R 25 808", foot: "over the last 30 days" },
  decorators: [(Story) => <div className="w-72">{Story()}</div>],
} satisfies Meta<typeof StatTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Plain: Story = {};

export const WithDelta: Story = {
  args: {
    foot: (
      <>
        <DeltaBadge value={18.1} /> vs previous 30 days
      </>
    ),
  },
};

export const NoPriorData: Story = {
  args: {
    label: "Transactions",
    value: "51",
    foot: (
      <>
        <DeltaBadge value={null} /> vs previous 7 days
      </>
    ),
  },
};

export const Skeleton: Story = { render: () => <StatTileSkeleton /> };
