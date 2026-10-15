import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CategoryIcon } from "@/components/category/CategoryIcon";
import { categoryFilters } from "@/test/fixtures";

const meta = {
  title: "Atoms/CategoryIcon",
  component: CategoryIcon,
  args: { icon: "shopping-cart", className: "h-6 w-6 text-ink" },
} satisfies Meta<typeof CategoryIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const UnknownFallsBackToReceipt: Story = { args: { icon: "mystery" } };

export const AllIcons: Story = {
  render: () => (
    <ul className="flex gap-6">
      {categoryFilters.map((c) => (
        <li key={c.name} className="flex flex-col items-center gap-1 text-xs text-ink-muted">
          <CategoryIcon icon={c.icon} className="h-6 w-6 text-ink" />
          {c.icon}
        </li>
      ))}
    </ul>
  ),
};
