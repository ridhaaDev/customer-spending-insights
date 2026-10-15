import type { CustomerSummary } from "@/lib/types";

interface Props {
  customers: CustomerSummary[];
  value: string;
  onChange: (customerId: string) => void;
}

export function CustomerPicker({ customers, value, onChange }: Props) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-ink-muted">Customer</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-line bg-card px-3 py-1.5 text-sm font-medium text-ink focus:outline-none focus:ring-2 focus:ring-accent"
      >
        {customers.map((c) => (
          <option key={c.customerId} value={c.customerId}>
            {c.name}
          </option>
        ))}
      </select>
    </label>
  );
}
