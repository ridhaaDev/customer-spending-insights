import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { CategoryForm } from "@/components/categories/CategoryForm";
import { categoryColors, categoryIcons } from "@/test/fixtures";

const meta = {
  title: "Molecules/CategoryForm",
  component: CategoryForm,
  args: { colors: categoryColors, icons: categoryIcons, onSubmit: fn(), onCancel: fn() },
  decorators: [(Story) => <div className="w-[36rem] max-w-full rounded-xl border border-line bg-card p-5">{Story()}</div>],
} satisfies Meta<typeof CategoryForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Submitting: Story = { args: { submitting: true } };

export const ServerError: Story = { args: { error: "Category 'Pets' already exists" } };

export const ChoicesStillLoading: Story = { args: { colors: undefined, icons: undefined } };

export const SubmitsNameColourAndIcon: Story = {
  play: async ({ canvasElement, args }) => {
    const c = within(canvasElement);
    await userEvent.type(c.getByLabelText(/name/i), "Pets");
    await userEvent.click(c.getByRole("radio", { name: "#e34948" }));
    await userEvent.click(c.getByRole("radio", { name: "paw print" }));
    await expect(c.getByText("Pets")).toBeInTheDocument();
    await userEvent.click(c.getByRole("button", { name: /add category/i }));
    await expect(args.onSubmit).toHaveBeenCalledWith({ name: "Pets", color: "#e34948", icon: "paw-print" });
  },
};

export const RequiresAName: Story = {
  play: async ({ canvasElement, args }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole("button", { name: /add category/i }));
    await expect(c.getByRole("alert")).toHaveTextContent(/name is required/i);
    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
};
