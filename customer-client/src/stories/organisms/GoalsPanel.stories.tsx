import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { GoalsPanel } from "@/components/goals/GoalsPanel";
import { categoryFilters, goals } from "@/test/fixtures";

const meta = {
  title: "Organisms/GoalsPanel",
  component: GoalsPanel,
  args: { data: { goals }, categories: categoryFilters, loading: false, error: null, onRetry: fn() },
  decorators: [(Story) => <div className="w-[28rem] max-w-full">{Story()}</div>],
} satisfies Meta<typeof GoalsPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllStatuses: Story = {};

export const WithoutCategoryMetadata: Story = { args: { categories: undefined } };

export const Refetching: Story = { args: { loading: true } };

export const Empty: Story = { args: { data: { goals: [] } } };

export const Loading: Story = { args: { data: undefined, loading: true } };

export const Error: Story = { args: { data: undefined, error: new globalThis.Error("API returned 500") } };
