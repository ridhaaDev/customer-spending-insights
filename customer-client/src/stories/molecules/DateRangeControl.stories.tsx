import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState, type ComponentProps } from "react";
import { expect, fn, screen, userEvent, within } from "storybook/test";
import { DateRangeControl } from "@/components/dashboard/DateRangeControl";
import type { DateRangeValue, Period } from "@/lib/types";

const meta = {
  title: "Molecules/DateRangeControl",
  component: DateRangeControl,
  args: { range: null, period: "30d", onPeriodChange: fn(), onRangeChange: fn(), today: "2026-10-16" },
  decorators: [(Story) => <div className="min-h-[28rem]">{Story()}</div>],
} satisfies Meta<typeof DateRangeControl>;

export default meta;
type Story = StoryObj<typeof meta>;

const openIt = async (canvasElement: HTMLElement) => {
  await userEvent.click(within(canvasElement).getByRole("button", { name: /date range/i }));
  return screen.findByRole("dialog", { name: /choose a date range/i });
};

export const RelativePreset: Story = {};

export const CustomRange: Story = { args: { range: { startDate: "2026-09-01", endDate: "2026-09-30" } } };

export const RangeOnlyWithAllTime: Story = { args: { period: undefined, onPeriodChange: undefined, allowAllTime: true } };

export const Open: Story = {
  args: { range: { startDate: "2026-09-21", endDate: "2026-10-05" } },
  play: async ({ canvasElement }) => {
    await openIt(canvasElement);
  },
};

function Stateful(args: ComponentProps<typeof DateRangeControl>) {
  const [period, setPeriod] = useState<Period | undefined>(args.period);
  const [range, setRange] = useState<DateRangeValue | null>(args.range);
  return (
    <DateRangeControl
      {...args}
      period={period}
      range={range}
      onPeriodChange={
        args.onPeriodChange &&
        ((p) => {
          args.onPeriodChange?.(p);
          setPeriod(p);
          setRange(null);
        })
      }
      onRangeChange={(r) => {
        args.onRangeChange(r);
        setRange(r);
      }}
    />
  );
}

export const PresetAppliesOnClick: Story = {
  render: (args) => <Stateful {...args} />,
  play: async ({ canvasElement, args }) => {
    const dialog = await openIt(canvasElement);
    await userEvent.click(within(dialog).getByRole("button", { name: "Last 90 days" }));
    await expect(args.onPeriodChange).toHaveBeenCalledWith("90d");
    await expect(screen.queryByRole("dialog")).toBeNull();
    await expect(within(canvasElement).getByRole("button", { name: /date range/i })).toHaveTextContent("Last 90 days");
  },
};

export const MonthPresetBecomesARange: Story = {
  render: (args) => <Stateful {...args} />,
  play: async ({ canvasElement, args }) => {
    const dialog = await openIt(canvasElement);
    await userEvent.click(within(dialog).getByRole("button", { name: "Last month" }));
    await expect(args.onRangeChange).toHaveBeenCalledWith({ startDate: "2026-09-01", endDate: "2026-09-30" });
  },
};

// Two clicks in the calendar: start, then end. The popover closes only after the second.
export const PicksARangeInTheCalendar: Story = {
  render: (args) => <Stateful {...args} />,
  play: async ({ canvasElement, args }) => {
    const dialog = await openIt(canvasElement);
    await userEvent.click(within(dialog).getByRole("button", { name: /\b2 October 2026/ }));
    await expect(screen.getByRole("dialog")).toBeVisible();
    await expect(args.onRangeChange).not.toHaveBeenCalled();
    await userEvent.click(within(dialog).getByRole("button", { name: /\b9 October 2026/ }));
    await expect(args.onRangeChange).toHaveBeenCalledWith({ startDate: "2026-10-02", endDate: "2026-10-09" });
    await expect(screen.queryByRole("dialog")).toBeNull();
    await expect(within(canvasElement).getByRole("button", { name: /date range/i })).toHaveTextContent("2 Oct – 9 Oct 2026");
  },
};

// Clicking a day before the start restarts the selection instead of ending it.
export const EarlierClickRestarts: Story = {
  render: (args) => <Stateful {...args} />,
  play: async ({ canvasElement, args }) => {
    const dialog = await openIt(canvasElement);
    await userEvent.click(within(dialog).getByRole("button", { name: /\b9 October 2026/ }));
    await userEvent.click(within(dialog).getByRole("button", { name: /\b2 October 2026/ }));
    await expect(args.onRangeChange).not.toHaveBeenCalled();
    await userEvent.click(within(dialog).getByRole("button", { name: /\b12 October 2026/ }));
    await expect(args.onRangeChange).toHaveBeenCalledWith({ startDate: "2026-10-02", endDate: "2026-10-12" });
  },
};
