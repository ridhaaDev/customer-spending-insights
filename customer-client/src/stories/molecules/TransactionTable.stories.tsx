import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { Card } from "@/components/ui";
import { transactions } from "@/test/fixtures";

const meta = {
  title: "Molecules/TransactionTable",
  component: TransactionTable,
  args: { transactions },
  decorators: [
    (Story) => (
      <Card className="w-[44rem] max-w-full">
        <Story />
      </Card>
    ),
  ],
} satisfies Meta<typeof TransactionTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SingleRow: Story = { args: { transactions: transactions.slice(0, 1) } };

export const Narrow: Story = {
  parameters: { viewport: { defaultViewport: "mobile1" } },
};

export const Compact: Story = {
  args: { compact: true },
  decorators: [(Story) => <div className="w-[34rem] max-w-full rounded-xl border border-line bg-card p-5">{Story()}</div>],
};
