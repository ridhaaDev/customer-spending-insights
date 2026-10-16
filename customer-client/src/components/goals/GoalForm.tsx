"use client";

import { useState, type FormEvent } from "react";
import { Button, Select } from "@/components/ui";
import type { CategoryFilter, GoalCreate } from "@/lib/types";

interface Props {
  categories: CategoryFilter[] | undefined;
  // Categories that already have a budget are offered but disabled in the list.
  budgeted?: string[];
  onSubmit: (body: GoalCreate) => void;
  onCancel?: () => void;
  submitting?: boolean;
  error?: string | null;
}

const inputClass =
  "w-full rounded-md border border-line bg-card px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-accent";

export function GoalForm({ categories, budgeted = [], onSubmit, onCancel, submitting = false, error }: Props) {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const options = (categories ?? [])
    .filter((c) => !budgeted.includes(c.name))
    .map((c) => ({ value: c.name, label: c.name }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!category) return setLocalError("Choose a category.");
    const monthlyBudget = Number(amount);
    if (!Number.isFinite(monthlyBudget) || monthlyBudget <= 0) return setLocalError("Budget must be more than zero.");
    if (Math.round(monthlyBudget * 100) !== monthlyBudget * 100) return setLocalError("Budget can have at most two decimals.");
    setLocalError(null);
    onSubmit({ category, monthlyBudget });
  };

  const message = localError ?? error;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4" aria-busy={submitting}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Category"
          stacked
          required
          options={options}
          value={category}
          onValueChange={setCategory}
          placeholder={options.length === 0 && categories ? "Every category has a budget" : "Choose…"}
        />
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-ink">Monthly budget (R)</span>
          <input
            type="number"
            inputMode="decimal"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            placeholder="0.00"
            className={inputClass}
          />
        </label>
      </div>

      {message && (
        <p role="alert" className="text-sm text-critical">
          {message}
        </p>
      )}

      <div className="flex gap-2">
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? "Saving…" : "Add budget"}
        </Button>
        {onCancel && (
          <Button onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
