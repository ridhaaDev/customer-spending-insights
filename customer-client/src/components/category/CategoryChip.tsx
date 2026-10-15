import { CategoryIcon } from "./CategoryIcon";

interface Props {
  icon: string;
  color: string;
  size?: "sm" | "md";
}

// The colour is the data mark; the text label beside the chip carries the name.
export function CategoryChip({ icon, color, size = "md" }: Props) {
  const box = size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const glyph = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-lg ${box}`}
      style={{ backgroundColor: `${color}26`, color }}
    >
      <CategoryIcon icon={icon} className={glyph} strokeWidth={2.25} />
    </span>
  );
}
