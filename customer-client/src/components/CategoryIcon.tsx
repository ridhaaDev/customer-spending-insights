import { Car, Film, Receipt, ShoppingBag, ShoppingCart, Utensils, Zap, type LucideProps } from "lucide-react";
import type { ComponentType } from "react";

// The API names icons with lucide identifiers; unknown names fall back to a generic receipt.
const ICONS: Record<string, ComponentType<LucideProps>> = {
  "shopping-cart": ShoppingCart,
  film: Film,
  car: Car,
  utensils: Utensils,
  "shopping-bag": ShoppingBag,
  zap: Zap,
};

export function CategoryIcon({ icon, ...props }: { icon: string } & LucideProps) {
  const Icon = ICONS[icon] ?? Receipt;
  return <Icon aria-hidden {...props} />;
}

/** Coloured chip with the category icon; the colour is the data mark, the label beside it carries the text. */
export function CategoryChip({ icon, color, size = "md" }: { icon: string; color: string; size?: "sm" | "md" }) {
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
