import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { TopNav } from "@/components/nav/TopNav";
import { customers } from "@/test/fixtures";

const meta = {
  title: "Organisms/TopNav",
  component: TopNav,
  args: { customers, currentId: customers[0].customerId, onSwitch: fn(), menuOpen: false, onToggleMenu: fn() },
  decorators: [(Story) => <div className="-m-6 min-h-64">{Story()}</div>],
} satisfies Meta<typeof TopNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MenuOpen: Story = {
  args: { menuOpen: true },
  parameters: { viewport: { defaultViewport: "mobile1" } },
};

export const CustomersLoading: Story = { args: { customers: undefined, currentId: null } };
