import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, screen, userEvent, within } from "storybook/test";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { categoryFilters, paymentMethods } from "@/test/fixtures";

const meta = {
  title: "Molecules/TransactionForm",
  component: TransactionForm,
  args: { categories: categoryFilters, paymentMethods, defaultDate: "2026-10-16T12:00", onSubmit: fn(), onCancel: fn() },
  decorators: [(Story) => <div className="w-[40rem] max-w-full rounded-xl border border-line bg-card p-5">{Story()}</div>],
} satisfies Meta<typeof TransactionForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Submitting: Story = { args: { submitting: true } };

export const ServerError: Story = { args: { error: "amount: Input should be greater than 0" } };

export const OptionsStillLoading: Story = { args: { categories: undefined, paymentMethods: undefined } };

export const SubmitsAValidBody: Story = {
  play: async ({ canvasElement, args }) => {
    const c = within(canvasElement);
    await userEvent.type(c.getByLabelText(/merchant/i), "Kauai");
    await userEvent.type(c.getByLabelText(/amount/i), "89.5");
    await userEvent.click(c.getByRole("combobox", { name: /category/i }));
    await userEvent.click(await screen.findByRole("option", { name: "Dining" }));
    await userEvent.click(c.getByRole("combobox", { name: /payment method/i }));
    await userEvent.click(await screen.findByRole("option", { name: "Credit Card" }));
    await userEvent.type(c.getByLabelText(/description/i), "Lunch");
    await userEvent.click(c.getByRole("button", { name: /add transaction/i }));
    await expect(args.onSubmit).toHaveBeenCalledWith({
      merchant: "Kauai",
      category: "Dining",
      amount: 89.5,
      date: "2026-10-16T12:00:00Z",
      description: "Lunch",
      paymentMethod: "Credit Card",
    });
  },
};

export const RejectsAnEmptyMerchant: Story = {
  play: async ({ canvasElement, args }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole("button", { name: /add transaction/i }));
    await expect(c.getByRole("alert")).toHaveTextContent(/merchant is required/i);
    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
};
