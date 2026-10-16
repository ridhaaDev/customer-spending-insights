import {
  Baby,
  Briefcase,
  Car,
  Coffee,
  Film,
  Gift,
  GraduationCap,
  HeartPulse,
  House,
  PawPrint,
  Plane,
  Receipt,
  ShoppingBag,
  ShoppingCart,
  Utensils,
  Wrench,
  Zap,
  type LucideProps,
} from "lucide-react";
import type { ComponentType } from "react";

// The API names icons with lucide identifiers; unknown names fall back to a generic receipt.
const ICONS: Record<string, ComponentType<LucideProps>> = {
  "shopping-cart": ShoppingCart,
  film: Film,
  car: Car,
  utensils: Utensils,
  "shopping-bag": ShoppingBag,
  zap: Zap,
  house: House,
  "heart-pulse": HeartPulse,
  "graduation-cap": GraduationCap,
  plane: Plane,
  gift: Gift,
  baby: Baby,
  "paw-print": PawPrint,
  wrench: Wrench,
  briefcase: Briefcase,
  coffee: Coffee,
};

// "paw-print" -> "paw print", for accessible names.
export const iconLabel = (icon: string) => icon.replace(/-/g, " ");

export function CategoryIcon({ icon, ...props }: { icon: string } & LucideProps) {
  const Icon = ICONS[icon] ?? Receipt;
  return <Icon aria-hidden {...props} />;
}
