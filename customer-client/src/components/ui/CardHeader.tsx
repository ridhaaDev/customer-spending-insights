import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function CardHeader({ title, subtitle, action }: Props) {
  return (
    <header className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h2 className="text-base font-semibold text-ink">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-ink-muted">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}
