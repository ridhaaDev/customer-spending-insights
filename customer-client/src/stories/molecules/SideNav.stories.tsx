import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { navItemsFor, SideNav } from "@/components/nav/SideNav";

const items = navItemsFor("10001");

const meta = {
  title: "Molecules/SideNav",
  component: SideNav,
  args: { items, activeHref: "/customers/10001", onNavigate: fn() },
  decorators: [(Story) => <div className="w-56 rounded-xl border border-line bg-card p-3">{Story()}</div>],
} satisfies Meta<typeof SideNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OverviewActive: Story = {};

export const TransactionsActive: Story = { args: { activeHref: "/customers/10001/transactions" } };

export const CarriesSearchParams: Story = {
  args: { items: navItemsFor("10001", "period=90d"), activeHref: "/customers/10001/categories" },
};

export const NothingActive: Story = { args: { activeHref: "/customers/10001/settings" } };
