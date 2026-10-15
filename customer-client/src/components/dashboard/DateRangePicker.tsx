"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import type { DateRangeValue } from "@/lib/types";

interface Props {
  value: DateRangeValue | null;
  onChange: (range: DateRangeValue | null) => void;
}

const inputClass =
  "rounded-md border border-line bg-card px-2.5 py-1.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent";

// Custom inclusive date range; applied explicitly so half-typed dates never fire a request.
export function DateRangePicker({ value, onChange }: Props) {
  const [start, setStart] = useState(value?.startDate ?? "");
  const [end, setEnd] = useState(value?.endDate ?? "");
  const valid = start !== "" && end !== "" && start <= end;
  const dirty = start !== (value?.startDate ?? "") || end !== (value?.endDate ?? "");

  const clear = () => {
    setStart("");
    setEnd("");
    onChange(null);
  };

  return (
    <form
      className="flex flex-wrap items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (valid) onChange({ startDate: start, endDate: end });
      }}
    >
      <label className="flex items-center gap-2 text-sm text-ink-muted">
        From
        <input type="date" value={start} max={end || undefined} onChange={(e) => setStart(e.target.value)} className={inputClass} />
      </label>
      <label className="flex items-center gap-2 text-sm text-ink-muted">
        To
        <input type="date" value={end} min={start || undefined} onChange={(e) => setEnd(e.target.value)} className={inputClass} />
      </label>
      <Button type="submit" disabled={!valid || !dirty}>
        Apply
      </Button>
      {(value || start || end) && (
        <Button onClick={clear}>Clear</Button>
      )}
    </form>
  );
}
