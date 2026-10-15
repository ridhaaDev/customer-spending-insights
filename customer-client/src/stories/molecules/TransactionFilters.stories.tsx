import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState, type ComponentProps } from "react";
import { fn } from "storybook/test";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import type { SortBy } from "@/lib/types";
import { categoryFilters } from "@/test/fixtures";

const meta = {
  title: "Molecules/TransactionFilters",
  component: TransactionFilters,
  args: { categories: categoryFilters, category: "", sortBy: "date_desc", onCategoryChange: fn(), onSortChange: fn() },
} satisfies Meta<typeof TransactionFilters>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

function Stateful(args: ComponentProps<typeof TransactionFilters>) {
  const [category, setCategory] = useState("Dining");
  const [sortBy, setSortBy] = useState<SortBy>("amount_desc");
  return (
    <TransactionFilters
      {...args}
      category={category}
      sortBy={sortBy}
      onCategoryChange={(c) => {
        args.onCategoryChange(c);
        setCategory(c);
      }}
      onSortChange={(s) => {
        args.onSortChange(s);
        setSortBy(s);
      }}
    />
  );
}

export const Interactive: Story = { render: (args) => <Stateful {...args} /> };

export const CategoriesStillLoading: Story = { args: { categories: undefined } };
