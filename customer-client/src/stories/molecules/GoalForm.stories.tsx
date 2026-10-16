import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, screen, userEvent, within } from "storybook/test";
import { GoalForm } from "@/components/goals/GoalForm";
import { categoryFilters } from "@/test/fixtures";

const meta = {
  title: "Molecules/GoalForm",
  component: GoalForm,
  args: { categories: categoryFilters, budgeted: ["Groceries", "Dining"], onSubmit: fn(), onCancel: fn() },
  decorators: [(Story) => <div className="w-[36rem] max-w-full rounded-xl border border-line bg-card p-5">{Story()}</div>],
} satisfies Meta<typeof GoalForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Submitting: Story = { args: { submitting: true } };

export const ServerError: Story = { args: { error: "A budget for 'Utilities' already exists" } };

export const EveryCategoryBudgeted: Story = { args: { budgeted: categoryFilters.map((c) => c.name) } };

export const SubmitsCategoryAndAmount: Story = {
  play: async ({ canvasElement, args }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole("combobox", { name: /category/i }));
    await expect(screen.queryByRole("option", { name: "Groceries" })).toBeNull(); // already budgeted
    await userEvent.click(await screen.findByRole("option", { name: "Transportation" }));
    await userEvent.type(c.getByLabelText(/monthly budget/i), "2500");
    await userEvent.click(c.getByRole("button", { name: /add budget/i }));
    await expect(args.onSubmit).toHaveBeenCalledWith({ category: "Transportation", monthlyBudget: 2500 });
  },
};
