import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState, type ComponentProps } from "react";
import { expect, fn, screen, userEvent, within } from "storybook/test";
import { Select } from "@/components/ui";

const options = [
  { value: "date_desc", label: "Newest first" },
  { value: "date_asc", label: "Oldest first" },
  { value: "amount_desc", label: "Largest amount" },
  { value: "amount_asc", label: "Smallest amount" },
];

const meta = {
  title: "Atoms/Select",
  component: Select,
  args: { label: "Sort", options, value: "date_desc", onValueChange: fn() },
  decorators: [(Story) => <div className="min-h-64">{Story()}</div>],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithLabel: Story = {};

export const HiddenLabel: Story = { args: { hideLabel: true } };

export const Placeholder: Story = { args: { value: "", placeholder: "Choose…" } };

export const Stacked: Story = {
  args: { stacked: true, label: "Payment method", value: "" , options: ["Credit Card", "Debit Card", "EFT"].map((v) => ({ value: v, label: v })) },
  decorators: [(Story) => <div className="w-64">{Story()}</div>],
};

function Stateful(args: ComponentProps<typeof Select>) {
  const [value, setValue] = useState(args.value);
  return (
    <Select
      {...args}
      value={value}
      onValueChange={(v) => {
        args.onValueChange(v);
        setValue(v);
      }}
    />
  );
}

export const PicksAnOption: Story = {
  render: (args) => <Stateful {...args} />,
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole("combobox", { name: /sort/i }));
    await userEvent.click(await screen.findByRole("option", { name: /largest amount/i }));
    await expect(args.onValueChange).toHaveBeenCalledWith("amount_desc");
    await expect(within(canvasElement).getByRole("combobox", { name: /sort/i })).toHaveTextContent("Largest amount");
  },
};
