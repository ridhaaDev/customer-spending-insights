import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CategoryRow } from "@/components/categories/CategoryRow";
import { categorySpend } from "@/test/fixtures";

const meta = {
  title: "Molecules/CategoryRow",
  component: CategoryRow,
  args: { category: categorySpend[0], maxAmount: categorySpend[0].amount },
  decorators: [(Story) => <ul className="w-[28rem] divide-y divide-line">{Story()}</ul>],
} satisfies Meta<typeof CategoryRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Largest: Story = {};

export const Smaller: Story = { args: { category: categorySpend[4] } };

export const Smallest: Story = { args: { category: categorySpend[5] } };

export const List: Story = {
  render: (args) => (
    <>
      {categorySpend.map((c) => (
        <CategoryRow key={c.name} category={c} maxAmount={args.maxAmount} />
      ))}
    </>
  ),
};
