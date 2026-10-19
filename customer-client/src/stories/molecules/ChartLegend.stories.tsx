import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState, type ComponentProps } from "react";
import { fn } from "storybook/test";
import { ChartLegend } from "@/components/trends/ChartLegend";
import { categoryFilters } from "@/test/fixtures";

const meta = {
  title: "Molecules/ChartLegend",
  component: ChartLegend,
  args: { series: categoryFilters },
  decorators: [(Story) => <div className="w-[28rem] max-w-full">{Story()}</div>],
} satisfies Meta<typeof ChartLegend>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ReadOnly: Story = {};

function Stateful(args: ComponentProps<typeof ChartLegend>) {
  const [hidden, setHidden] = useState<ReadonlySet<string>>(new Set(["Entertainment"]));
  return (
    <ChartLegend
      {...args}
      hidden={hidden}
      onToggle={(name) => {
        args.onToggle?.(name);
        setHidden((prev) => {
          const next = new Set(prev);
          if (next.has(name)) next.delete(name);
          else next.add(name);
          return next;
        });
      }}
      onShowAll={() => {
        args.onShowAll?.();
        setHidden(new Set());
      }}
    />
  );
}

export const Toggleable: Story = {
  args: { onToggle: fn(), onShowAll: fn() },
  render: (args) => <Stateful {...args} />,
};
