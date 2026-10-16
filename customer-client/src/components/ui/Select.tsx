import { useId, type SelectHTMLAttributes } from "react";

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  hideLabel?: boolean;
  // Label above the control (forms) instead of beside it (toolbars).
  stacked?: boolean;
};

export function Select({ label, hideLabel = false, stacked = false, id, className = "", children, ...props }: Props) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const labelClass = hideLabel ? "sr-only" : stacked ? "mb-1 block font-medium text-ink" : "text-ink-muted";
  return (
    <label htmlFor={selectId} className={stacked ? "block text-sm" : "flex items-center gap-2 text-sm"}>
      <span className={labelClass}>{label}</span>
      <select
        id={selectId}
        className={`rounded-md border border-line bg-card px-2.5 py-1.5 text-sm font-medium text-ink focus:outline-none focus:ring-2 focus:ring-accent ${stacked ? "w-full py-2" : ""} ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
