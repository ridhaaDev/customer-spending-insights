"use client";

import { useState, type FormEvent } from "react";
import { Button, Select } from "@/components/ui";
import type { CategoryFilter, CategoryName, TransactionCreate } from "@/lib/types";

export interface TransactionFormValues {
  merchant: string;
  category: string;
  amount: string;
  date: string; // datetime-local value, taken as UTC
  description: string;
  paymentMethod: string;
}

interface Props {
  categories: CategoryFilter[] | undefined;
  paymentMethods: string[] | undefined;
  // Initial datetime-local value; passed in so server and client render the same default.
  defaultDate: string;
  onSubmit: (body: TransactionCreate) => void;
  onCancel?: () => void;
  submitting?: boolean;
  error?: string | null;
}

const inputClass =
  "w-full rounded-md border border-line bg-card px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-accent";

// Converts the form's strings into the API body; returns a field error instead when invalid.
export function toBody(v: TransactionFormValues): { body: TransactionCreate } | { error: string } {
  const merchant = v.merchant.trim();
  if (!merchant) return { error: "Merchant is required." };
  if (!v.category) return { error: "Choose a category." };
  if (!v.paymentMethod) return { error: "Choose a payment method." };
  const amount = Number(v.amount);
  if (!Number.isFinite(amount) || amount <= 0) return { error: "Amount must be more than zero." };
  if (Math.round(amount * 100) !== amount * 100) return { error: "Amount can have at most two decimals." };
  if (!v.date) return { error: "Date is required." };
  return {
    body: {
      merchant,
      category: v.category as CategoryName,
      amount,
      date: `${v.date}:00Z`,
      description: v.description.trim(),
      paymentMethod: v.paymentMethod,
    },
  };
}

export function TransactionForm({ categories, paymentMethods, defaultDate, onSubmit, onCancel, submitting = false, error }: Props) {
  const [values, setValues] = useState<TransactionFormValues>({
    merchant: "",
    category: "",
    amount: "",
    date: defaultDate,
    description: "",
    paymentMethod: "",
  });
  const [localError, setLocalError] = useState<string | null>(null);
  const set = (field: keyof TransactionFormValues) => (e: { target: { value: string } }) =>
    setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = toBody(values);
    if ("error" in result) {
      setLocalError(result.error);
      return;
    }
    setLocalError(null);
    onSubmit(result.body);
  };

  const message = localError ?? error;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4" aria-busy={submitting}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-ink">Merchant</span>
          <input
            type="text"
            value={values.merchant}
            onChange={set("merchant")}
            required
            maxLength={80}
            placeholder="e.g. Pick n Pay"
            className={inputClass}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-ink">Amount (R)</span>
          <input
            type="number"
            inputMode="decimal"
            min="0.01"
            step="0.01"
            value={values.amount}
            onChange={set("amount")}
            required
            placeholder="0.00"
            className={inputClass}
          />
        </label>
        <Select label="Category" stacked value={values.category} onChange={set("category")} required>
          <option value="">Choose…</option>
          {categories?.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </Select>
        <Select label="Payment method" stacked value={values.paymentMethod} onChange={set("paymentMethod")} required>
          <option value="">Choose…</option>
          {paymentMethods?.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </Select>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-ink">Date and time (UTC)</span>
          <input type="datetime-local" value={values.date} onChange={set("date")} required className={inputClass} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-ink">Description</span>
          <input
            type="text"
            value={values.description}
            onChange={set("description")}
            maxLength={120}
            placeholder="Optional"
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
          {submitting ? "Saving…" : "Add transaction"}
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
