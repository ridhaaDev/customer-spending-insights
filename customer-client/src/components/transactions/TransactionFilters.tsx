import { Select, type SelectOption } from "@/components/ui";
import type { CategoryFilter, SortBy } from "@/lib/types";

export const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: "date_desc", label: "Newest first" },
  { value: "date_asc", label: "Oldest first" },
  { value: "amount_desc", label: "Largest amount" },
  { value: "amount_asc", label: "Smallest amount" },
];

const ALL = "__all__";

interface Props {
  categories: CategoryFilter[] | undefined;
  category: string;
  sortBy: SortBy;
  onCategoryChange: (category: string) => void;
  onSortChange: (sortBy: SortBy) => void;
}

export function TransactionFilters({ categories, category, sortBy, onCategoryChange, onSortChange }: Props) {
  const categoryOptions: SelectOption[] = [{ value: ALL, label: "All categories" }, ...(categories ?? []).map((c) => ({ value: c.name, label: c.name }))];
  return (
    <div className="flex flex-wrap gap-2">
      <Select
        label="Category"
        hideLabel
        options={categoryOptions}
        value={category || ALL}
        onValueChange={(v) => onCategoryChange(v === ALL ? "" : v)}
      />
      <Select label="Sort" hideLabel options={SORT_OPTIONS} value={sortBy} onValueChange={(v) => onSortChange(v as SortBy)} />
    </div>
  );
}
