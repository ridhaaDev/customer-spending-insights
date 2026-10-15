import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button, Card, CardHeader, Skeleton } from "@/components/ui";

const meta = {
  title: "Molecules/Card",
  component: Card,
  args: { children: null },
  decorators: [(Story) => <div className="w-[28rem]">{Story()}</div>],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Plain: Story = {
  render: () => (
    <Card>
      <p className="text-sm text-ink-secondary">Card body content.</p>
    </Card>
  ),
};

export const WithHeader: Story = {
  render: () => (
    <Card>
      <CardHeader title="Monthly spending" subtitle="Last 12 months" />
      <p className="text-sm text-ink-secondary">Card body content.</p>
    </Card>
  ),
};

export const WithHeaderAction: Story = {
  render: () => (
    <Card>
      <CardHeader title="Monthly spending" subtitle="Last 12 months" action={<Button size="sm">Table</Button>} />
      <p className="text-sm text-ink-secondary">Card body content.</p>
    </Card>
  ),
};

export const Loading: Story = {
  render: () => (
    <Card>
      <CardHeader title="Spending by category" />
      <div className="space-y-3">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </div>
    </Card>
  ),
};
