import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CategoryTrendTable } from "@/components/trends/CategoryTrendTable";
import { categoryTrends } from "@/test/fixtures";

const meta = {
  title: "Molecules/CategoryTrendTable",
  component: CategoryTrendTable,
  args: { data: categoryTrends },
  decorators: [(Story) => <div className="w-[40rem] max-w-full">{Story()}</div>],
} satisfies Meta<typeof CategoryTrendTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TwelveMonths: Story = {};

export const Narrow: Story = {
  decorators: [(Story) => <div className="w-80">{Story()}</div>],
};
