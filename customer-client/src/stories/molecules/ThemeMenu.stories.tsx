import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState, type ComponentProps } from "react";
import { expect, fn, screen, userEvent, within } from "storybook/test";
import { ThemeMenu } from "@/components/nav/ThemeMenu";
import type { Theme } from "@/context/ThemeContext";

const meta = {
  title: "Molecules/ThemeMenu",
  component: ThemeMenu,
  args: { value: "system", onChange: fn() },
  decorators: [(Story) => <div className="flex min-h-60 w-72 justify-end">{Story()}</div>],
} satisfies Meta<typeof ThemeMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const System: Story = {};

export const Candy: Story = { args: { value: "candy" } };

function Stateful(args: ComponentProps<typeof ThemeMenu>) {
  const [value, setValue] = useState<Theme>(args.value);
  return (
    <ThemeMenu
      {...args}
      value={value}
      onChange={(t) => {
        args.onChange(t);
        setValue(t);
      }}
    />
  );
}

// Picks Candy from the menu; the story stays in the page's own theme because onChange is stubbed.
export const PicksATheme: Story = {
  render: (args) => <Stateful {...args} />,
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: /theme/i }));
    await userEvent.click(await screen.findByRole("menuitemradio", { name: /candy/i }));
    await expect(args.onChange).toHaveBeenCalledWith("candy");
    await expect(within(canvasElement).getByRole("button", { name: /theme: candy/i })).toBeInTheDocument();
  },
};
