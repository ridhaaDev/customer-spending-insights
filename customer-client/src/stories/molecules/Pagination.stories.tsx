import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { Pagination } from "@/components/transactions/Pagination";

const meta = {
  title: "Molecules/Pagination",
  component: Pagination,
  args: { offset: 0, pageSize: 10, total: 1058, hasMore: true, onPrevious: fn(), onNext: fn() },
  decorators: [(Story) => <div className="w-[32rem]">{Story()}</div>],
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstPage: Story = {};

export const MiddlePage: Story = { args: { offset: 40 } };

export const LastPage: Story = { args: { offset: 1050, hasMore: false } };

export const NoResults: Story = { args: { total: 0, hasMore: false } };
