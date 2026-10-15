import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState, type ComponentProps } from "react";
import { fn } from "storybook/test";
import { SideNav } from "@/components/nav/SideNav";

const meta = {
  title: "Molecules/SideNav",
  component: SideNav,
  args: { activeId: "overview", onNavigate: fn() },
  decorators: [(Story) => <div className="w-56 rounded-xl border border-line bg-card p-3">{Story()}</div>],
} satisfies Meta<typeof SideNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TransactionsActive: Story = { args: { activeId: "transactions" } };

function Stateful(args: ComponentProps<typeof SideNav>) {
  const [activeId, setActiveId] = useState(args.activeId);
  return (
    <SideNav
      {...args}
      activeId={activeId}
      onNavigate={(id) => {
        args.onNavigate(id);
        setActiveId(id);
      }}
    />
  );
}

export const Interactive: Story = { render: (args) => <Stateful {...args} /> };
