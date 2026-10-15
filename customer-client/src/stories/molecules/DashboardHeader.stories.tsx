import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { profile } from "@/test/fixtures";

const meta = {
  title: "Molecules/DashboardHeader",
  component: DashboardHeader,
  args: { profile, error: null, onRetry: fn() },
} satisfies Meta<typeof DashboardHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = { args: { profile: undefined } };

export const Error: Story = { args: { profile: undefined, error: new globalThis.Error("Customer '10009' not found") } };
