import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ShareBar } from "@/components/categories/ShareBar";
import { categorySpend } from "@/test/fixtures";

const meta = {
  title: "Atoms/ShareBar",
  component: ShareBar,
  args: { segments: categorySpend, label: "Share of spending by category" },
  decorators: [(Story) => <div className="w-96">{Story()}</div>],
} satisfies Meta<typeof ShareBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SixCategories: Story = {};

export const TwoCategories: Story = {
  args: {
    segments: [
      { name: "Groceries", percentage: 70, color: "#e34948" },
      { name: "Dining", percentage: 30, color: "#eda100" },
    ],
  },
};

export const TinySegmentStaysVisible: Story = {
  args: {
    segments: [
      { name: "Groceries", percentage: 99.5, color: "#e34948" },
      { name: "Entertainment", percentage: 0.5, color: "#e87ba4" },
    ],
  },
};
