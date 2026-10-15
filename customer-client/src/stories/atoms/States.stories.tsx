import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { EmptyState, ErrorState, Refreshing } from "@/components/ui";

const meta = {
  title: "Atoms/States",
  component: ErrorState,
  args: { message: "Could not reach the API", onRetry: fn() },
  decorators: [(Story) => <div className="w-96 rounded-xl border border-line bg-card">{Story()}</div>],
} satisfies Meta<typeof ErrorState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Error: Story = {};

export const ErrorWithoutRetry: Story = { args: { onRetry: undefined } };

export const Empty: Story = { render: () => <EmptyState message="No transactions match these filters." /> };

export const RefreshingHoldsPreviousContent: Story = {
  render: () => (
    <Refreshing loading>
      <p className="p-5 text-sm text-ink">Previous data stays visible at reduced opacity while the next fetch runs.</p>
    </Refreshing>
  ),
};
