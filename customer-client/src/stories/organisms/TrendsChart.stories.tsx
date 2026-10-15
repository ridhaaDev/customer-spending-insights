import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { TrendsChart } from "@/components/trends/TrendsChart";
import { trends } from "@/test/fixtures";

const meta = {
  title: "Organisms/TrendsChart",
  component: TrendsChart,
  args: { data: { trends }, months: 12, loading: false, error: null, onRetry: fn() },
  decorators: [(Story) => <div className="w-[40rem] max-w-full">{Story()}</div>],
} satisfies Meta<typeof TrendsChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TwelveMonths: Story = {};

export const SixMonths: Story = { args: { data: { trends: trends.slice(-6) }, months: 6 } };

export const Refetching: Story = { args: { loading: true } };

export const Empty: Story = { args: { data: { trends: [] } } };

export const Loading: Story = { args: { data: undefined, loading: true } };

export const Error: Story = { args: { data: undefined, error: new globalThis.Error("Could not reach the API") } };
