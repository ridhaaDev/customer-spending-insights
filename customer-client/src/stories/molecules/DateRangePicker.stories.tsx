import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { DateRangePicker } from "@/components/dashboard/DateRangePicker";

const meta = {
  title: "Molecules/DateRangePicker",
  component: DateRangePicker,
  args: { value: null, onChange: fn() },
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const WithRange: Story = { args: { value: { startDate: "2026-09-01", endDate: "2026-09-30" } } };

export const AppliesOnlyWhenValid: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const apply = canvas.getByRole("button", { name: /apply/i });
    await expect(apply).toBeDisabled();
    await userEvent.type(canvas.getByLabelText(/from/i), "2026-09-01");
    await userEvent.type(canvas.getByLabelText(/to/i), "2026-09-30");
    await expect(apply).toBeEnabled();
    await userEvent.click(apply);
    await expect(args.onChange).toHaveBeenCalledWith({ startDate: "2026-09-01", endDate: "2026-09-30" });
  },
};
