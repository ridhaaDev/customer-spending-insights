import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState, type ComponentProps } from "react";
import { expect, fn, screen, userEvent, within } from "storybook/test";
import { ProfileMenu } from "@/components/nav/ProfileMenu";
import { customers } from "@/test/fixtures";

const meta = {
  title: "Molecules/ProfileMenu",
  component: ProfileMenu,
  args: { customers, currentId: customers[0].customerId, onSwitch: fn() },
  decorators: [(Story) => <div className="flex min-h-80 w-[28rem] justify-end">{Story()}</div>],
} satisfies Meta<typeof ProfileMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {};

// The menu renders in a portal, so assertions look at the whole document.
export const Open: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { expanded: false }));
    await expect(await screen.findByRole("menu")).toBeVisible();
  },
};

function Stateful(args: ComponentProps<typeof ProfileMenu>) {
  const [currentId, setCurrentId] = useState(args.currentId);
  return (
    <ProfileMenu
      {...args}
      currentId={currentId}
      onSwitch={(id) => {
        args.onSwitch(id);
        setCurrentId(id);
      }}
    />
  );
}

export const SwitchesProfile: Story = {
  render: (args) => <Stateful {...args} />,
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { expanded: false }));
    await userEvent.click(await screen.findByRole("menuitemradio", { name: /priya/i }));
    await expect(args.onSwitch).toHaveBeenCalledWith("10003");
    await expect(screen.queryByRole("menu")).toBeNull();
  },
};

export const KeyboardNavigation: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", { expanded: false });
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    await screen.findByRole("menu");
    await userEvent.keyboard("{ArrowDown}");
    await expect(screen.getByRole("menuitemradio", { name: /johan/i })).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await expect(screen.queryByRole("menu")).toBeNull();
    await expect(trigger).toHaveFocus();
  },
};

export const NoProfileSelected: Story = { args: { currentId: null } };
