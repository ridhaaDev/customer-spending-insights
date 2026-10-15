import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GoalRow } from "@/components/goals/GoalRow";
import { categoryFilters, goals } from "@/test/fixtures";

const byName = new Map(categoryFilters.map((c) => [c.name, c]));

const meta = {
  title: "Molecules/GoalRow",
  component: GoalRow,
  args: { goal: goals[0], meta: byName.get(goals[0].category) },
  decorators: [(Story) => <ul className="w-96 divide-y divide-line">{Story()}</ul>],
} satisfies Meta<typeof GoalRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnTrack: Story = {};

export const NearLimit: Story = { args: { goal: goals[1], meta: byName.get(goals[1].category) } };

export const OverBudget: Story = { args: { goal: goals[2], meta: byName.get(goals[2].category) } };

export const WithoutCategoryMetadata: Story = { args: { meta: undefined } };
