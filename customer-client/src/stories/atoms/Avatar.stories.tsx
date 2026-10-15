import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Avatar } from "@/components/ui";

const meta = {
  title: "Atoms/Avatar",
  component: Avatar,
  args: { name: "Thandi Mokoena" },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Medium: Story = {};

export const Small: Story = { args: { size: "sm" } };

export const SingleName: Story = { args: { name: "Priya" } };

export const Unknown: Story = { args: { name: "" } };
