import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState, type ComponentProps } from "react";
import { fn } from "storybook/test";
import { SegmentedControl } from "@/components/ui";

const options = [
  { label: "6 months", value: "6" },
  { label: "12 months", value: "12" },
  { label: "24 months", value: "24" },
];

const meta = {
  title: "Atoms/SegmentedControl",
  component: SegmentedControl,
  args: { label: "Months", options, value: "12", onChange: fn() },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TwoOptions: Story = {
  args: {
    options: [
      { label: "Chart", value: "chart" },
      { label: "Table", value: "table" },
    ],
    value: "chart",
  },
};

function Stateful(args: ComponentProps<typeof SegmentedControl>) {
  const [value, setValue] = useState(args.value);
  return (
    <SegmentedControl
      {...args}
      value={value}
      onChange={(v) => {
        args.onChange(v);
        setValue(v);
      }}
    />
  );
}

export const Interactive: Story = { render: (args) => <Stateful {...args} /> };
