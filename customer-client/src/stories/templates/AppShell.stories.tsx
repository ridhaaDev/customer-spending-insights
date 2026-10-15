import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { AppShell } from "@/components/nav/AppShell";
import { customers } from "@/test/fixtures";

const meta = {
  title: "Templates/AppShell",
  component: AppShell,
  args: {
    customers,
    currentId: customers[0].customerId,
    onSwitch: fn(),
    activeSection: "overview",
    onNavigate: fn(),
    children: (
      <div className="p-6">
        <div className="h-96 rounded-xl border border-dashed border-line-strong p-4 text-sm text-ink-muted">Page content</div>
      </div>
    ),
  },
  decorators: [(Story) => <div className="-m-6 flex min-h-screen flex-col">{Story()}</div>],
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const Phone: Story = {
  parameters: { viewport: { defaultViewport: "mobile1" } },
};
