import { Select } from "@/components/ui";
import type { CategoryFilter, SortBy } from "@/lib/types";

export const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: "date_desc", label: "Newest first" },
  { value: "date_asc", label: "Oldest first" },
  { value: "amount_desc", label: "Largest amount" },
  { value: "amount_asc", label: "Smallest amount" },
];

interface Props {
  categories: CategoryFilter[] | undefined;
  category: string;
  sortBy: SortBy;
  onCategoryChange: (category: string) => void;
  onSortChange: (sortBy: SortBy) => void;
}

export function TransactionFilters({ categories, category, sortBy, onCategoryChange, onSortChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <Select label="Category" hideLabel value={category} onChange={(e) => onCategoryChange(e.target.value)}>
        <option value="">All categories</option>
        {categories?.map((c) => (
          <option key={c.name} value={c.name}>
            {c.name}
          </option>
        ))}
      </Select>
      <Select label="Sort" hideLabel value={sortBy} onChange={(e) => onSortChange(e.target.value as SortBy)}>
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
