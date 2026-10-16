import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChevronRight, RefreshCw } from "lucide-react";
import { fn } from "storybook/test";
import { Button } from "@/components/ui";

const meta = {
  title: "Atoms/Button",
  component: Button,
  args: { onClick: fn(), children: "Retry" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Primary: Story = { args: { variant: "primary", children: "Add transaction" } };

export const Small: Story = { args: { size: "sm", children: "Table" } };

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <RefreshCw className="h-3.5 w-3.5" aria-hidden /> Retry
      </>
    ),
  },
};

export const IconOnly: Story = {
  args: { size: "icon", "aria-label": "Next page", children: <ChevronRight className="h-4 w-4" aria-hidden /> },
};

export const Disabled: Story = { args: { disabled: true } };
