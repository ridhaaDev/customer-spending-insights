import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CategoryChip } from "@/components/category/CategoryChip";
import { categoryFilters } from "@/test/fixtures";

const meta = {
  title: "Atoms/CategoryChip",
  component: CategoryChip,
  args: { icon: "shopping-cart", color: "#e34948" },
} satisfies Meta<typeof CategoryChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Medium: Story = {};

export const Small: Story = { args: { size: "sm" } };

export const AllCategories: Story = {
  render: () => (
    <ul className="flex flex-wrap gap-4">
      {categoryFilters.map((c) => (
        <li key={c.name} className="flex items-center gap-2 text-sm text-ink">
          <CategoryChip icon={c.icon} color={c.color} />
          {c.name}
        </li>
      ))}
    </ul>
  ),
};
