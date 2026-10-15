import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState, type ComponentProps } from "react";
import { fn } from "storybook/test";
import { PeriodSelector } from "@/components/dashboard/PeriodSelector";
import type { Period } from "@/lib/types";

const meta = {
  title: "Molecules/PeriodSelector",
  component: PeriodSelector,
  args: { value: "30d", onChange: fn() },
} satisfies Meta<typeof PeriodSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

function Stateful(args: ComponentProps<typeof PeriodSelector>) {
  const [value, setValue] = useState<Period>("90d");
  return (
    <PeriodSelector
      {...args}
      value={value}
      onChange={(p) => {
        args.onChange(p);
        setValue(p);
      }}
    />
  );
}

export const Interactive: Story = { render: (args) => <Stateful {...args} /> };

export const PresetsFromApi: Story = {
  args: {
    presets: [
      { label: "7 days", value: "7d" },
      { label: "30 days", value: "30d" },
    ],
  },
};
