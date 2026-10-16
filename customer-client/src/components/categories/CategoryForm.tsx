"use client";

import * as RadioGroup from "@radix-ui/react-radio-group";
import { useState, type FormEvent } from "react";
import { CategoryChip } from "@/components/category/CategoryChip";
import { CategoryIcon, iconLabel } from "@/components/category/CategoryIcon";
import { Button } from "@/components/ui";
import type { CategoryCreate } from "@/lib/types";

interface Props {
  colors: string[] | undefined;
  icons: string[] | undefined;
  onSubmit: (body: CategoryCreate) => void;
  onCancel?: () => void;
  submitting?: boolean;
  error?: string | null;
}

const inputClass =
  "w-full rounded-md border border-line bg-card px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-accent";

// Name plus a colour swatch and an icon from the offered sets, with a live preview of the chip.
export function CategoryForm({ colors, icons, onSubmit, onCancel, submitting = false, error }: Props) {
  const [name, setName] = useState("");
  const [chosenColor, setChosenColor] = useState("");
  const [chosenIcon, setChosenIcon] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  // The first option is preselected once the choices arrive, so a valid category is one field away.
  const color = chosenColor || colors?.[0] || "";
  const icon = chosenIcon || icons?.[0] || "";

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return setLocalError("Name is required.");
    if (trimmed.length > 40) return setLocalError("Name must be 40 characters or fewer.");
    if (!color) return setLocalError("Choose a colour.");
    if (!icon) return setLocalError("Choose an icon.");
    setLocalError(null);
    onSubmit({ name: trimmed, color, icon });
  };

  const message = localError ?? error;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5" aria-busy={submitting}>
      <div className="flex items-center gap-3 rounded-lg border border-line bg-surface px-3 py-2.5">
        {icon ? <CategoryChip icon={icon} color={color || "#6b7280"} /> : <span className="h-9 w-9 rounded-lg bg-line" aria-hidden />}
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-ink">{name.trim() || "New category"}</p>
          <p className="text-xs text-ink-muted">Preview</p>
        </div>
      </div>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-ink">Name</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={40}
          placeholder="e.g. Pets"
          className={inputClass}
        />
      </label>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-ink">Colour</legend>
        <RadioGroup.Root value={color} onValueChange={setChosenColor} aria-label="Colour" className="flex flex-wrap gap-2">
          {(colors ?? []).map((c) => (
            <RadioGroup.Item
              key={c}
              value={c}
              aria-label={c}
              style={{ backgroundColor: c }}
              className="h-8 w-8 rounded-full ring-offset-2 ring-offset-card transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-accent data-[state=checked]:ring-2 data-[state=checked]:ring-ink"
            />
          ))}
        </RadioGroup.Root>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-ink">Icon</legend>
        <RadioGroup.Root value={icon} onValueChange={setChosenIcon} aria-label="Icon" className="flex flex-wrap gap-2">
          {(icons ?? []).map((i) => (
            <RadioGroup.Item
              key={i}
              value={i}
              aria-label={iconLabel(i)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line text-ink-secondary hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent data-[state=checked]:border-ink data-[state=checked]:bg-ink data-[state=checked]:text-card"
            >
              <CategoryIcon icon={i} className="h-4 w-4" strokeWidth={2.25} />
            </RadioGroup.Item>
          ))}
        </RadioGroup.Root>
      </fieldset>

      {message && (
        <p role="alert" className="text-sm text-critical">
          {message}
        </p>
      )}

      <div className="flex gap-2">
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? "Saving…" : "Add category"}
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
