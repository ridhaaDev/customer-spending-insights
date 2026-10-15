import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TrendsTable } from "@/components/trends/TrendsTable";
import { trends } from "@/test/fixtures";

const meta = {
  title: "Molecules/TrendsTable",
  component: TrendsTable,
  args: { trends },
  decorators: [(Story) => <div className="w-[36rem]">{Story()}</div>],
} satisfies Meta<typeof TrendsTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TwelveMonths: Story = {};

export const ThreeMonths: Story = { args: { trends: trends.slice(-3) } };
