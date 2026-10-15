import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { Select } from "@/components/ui";

const meta = {
  title: "Atoms/Select",
  component: Select,
  args: {
    label: "Sort",
    onChange: fn(),
    defaultValue: "date_desc",
    children: (
      <>
        <option value="date_desc">Newest first</option>
        <option value="date_asc">Oldest first</option>
        <option value="amount_desc">Largest amount</option>
      </>
    ),
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithLabel: Story = {};

export const HiddenLabel: Story = { args: { hideLabel: true } };
