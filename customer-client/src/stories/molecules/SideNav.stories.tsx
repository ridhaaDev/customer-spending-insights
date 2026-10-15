import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { SideNav } from "@/components/nav/SideNav";

const meta = {
  title: "Molecules/SideNav",
  component: SideNav,
  args: { activeHref: "/", onNavigate: fn() },
  decorators: [(Story) => <div className="w-56 rounded-xl border border-line bg-card p-3">{Story()}</div>],
} satisfies Meta<typeof SideNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OverviewActive: Story = {};

export const TransactionsActive: Story = { args: { activeHref: "/transactions" } };

export const NothingActive: Story = { args: { activeHref: "/settings" } };
