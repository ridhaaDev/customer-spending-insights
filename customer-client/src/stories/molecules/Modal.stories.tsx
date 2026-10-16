import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, fn, screen, userEvent, within } from "storybook/test";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { Button, Modal } from "@/components/ui";
import { categoryFilters, paymentMethods } from "@/test/fixtures";

const meta = {
  title: "Molecules/Modal",
  component: Modal,
  args: {
    title: "Add transaction",
    description: "Recorded against this customer and reflected in every view immediately.",
    trigger: <Button variant="primary">Open modal</Button>,
    children: <p className="text-sm text-ink-secondary">Modal body content.</p>,
  },
  decorators: [(Story) => <div className="min-h-40">{Story()}</div>],
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {};

export const Open: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: /open modal/i }));
    await expect(await screen.findByRole("dialog", { name: /add transaction/i })).toBeVisible();
  },
};

export const WithoutDescription: Story = {
  args: { description: undefined },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: /open modal/i }));
    await expect(await screen.findByRole("dialog", { name: /add transaction/i })).toBeVisible();
  },
};

export const WithAForm: Story = {
  args: {
    size: "lg",
    children: (
      <TransactionForm categories={categoryFilters} paymentMethods={paymentMethods} defaultDate="2026-10-16T12:00" onSubmit={fn()} onCancel={fn()} />
    ),
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: /open modal/i }));
    const dialog = await screen.findByRole("dialog");
    await expect(within(dialog).getByLabelText(/merchant/i)).toBeInTheDocument();
  },
};

export const LongContentScrolls: Story = {
  args: {
    children: (
      <div className="space-y-3">
        {Array.from({ length: 30 }, (_, i) => (
          <p key={i} className="text-sm text-ink-secondary">
            Paragraph {i + 1} of a long body that scrolls inside the modal instead of pushing it off screen.
          </p>
        ))}
      </div>
    ),
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: /open modal/i }));
    await screen.findByRole("dialog");
  },
};

function Controlled() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Open controlled
      </Button>
      <Modal open={open} onOpenChange={setOpen} title="Controlled modal">
        <Button onClick={() => setOpen(false)}>Done</Button>
      </Modal>
    </>
  );
}

// Escape closes the modal and focus returns to the trigger.
export const EscapeClosesAndRestoresFocus: Story = {
  render: () => <Controlled />,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", { name: /open controlled/i });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole("dialog", { name: /controlled modal/i });
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainElement(document.activeElement as HTMLElement);
    await userEvent.keyboard("{Escape}");
    await expect(screen.queryByRole("dialog")).toBeNull();
    await expect(trigger).toHaveFocus();
  },
};
