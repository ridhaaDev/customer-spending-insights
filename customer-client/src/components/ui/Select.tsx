import { useId, type SelectHTMLAttributes } from "react";

type Props = SelectHTMLAttributes<HTMLSelectElement> & { label: string; hideLabel?: boolean };

export function Select({ label, hideLabel = false, id, className = "", children, ...props }: Props) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  return (
    <label htmlFor={selectId} className="flex items-center gap-2 text-sm">
      <span className={hideLabel ? "sr-only" : "text-ink-muted"}>{label}</span>
      <select
        id={selectId}
        className={`rounded-md border border-line bg-card px-2.5 py-1.5 text-sm font-medium text-ink focus:outline-none focus:ring-2 focus:ring-accent ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
