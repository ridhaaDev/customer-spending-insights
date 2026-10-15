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
