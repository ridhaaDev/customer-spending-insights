import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button, PageHeader } from "@/components/ui";

const meta = {
  title: "Molecules/PageHeader",
  component: PageHeader,
  args: { title: "Trends", description: "Total spend per calendar month." },
  decorators: [(Story) => <div className="w-[40rem] max-w-full">{Story()}</div>],
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TitleOnly: Story = { args: { description: undefined } };

export const WithAction: Story = { args: { action: <Button>Export</Button> } };
