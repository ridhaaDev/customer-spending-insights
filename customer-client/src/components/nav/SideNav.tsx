import { ChartColumn, ChartPie, LayoutDashboard, Receipt, Target, type LucideProps } from "lucide-react";
import Link from "next/link";
import type { ComponentType } from "react";

export interface NavItem {
  href: string;
  label: string;
  Icon: ComponentType<LucideProps>;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Overview", Icon: LayoutDashboard },
  { href: "/categories", label: "Categories", Icon: ChartPie },
  { href: "/trends", label: "Trends", Icon: ChartColumn },
  { href: "/budgets", label: "Budgets", Icon: Target },
  { href: "/transactions", label: "Transactions", Icon: Receipt },
];

interface Props {
  activeHref: string;
  onNavigate?: () => void;
  items?: NavItem[];
}

export function SideNav({ activeHref, onNavigate, items = NAV_ITEMS }: Props) {
  return (
    <nav aria-label="Pages">
      <ul className="space-y-0.5">
        {items.map(({ href, label, Icon }) => {
          const active = href === activeHref;
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                onClick={onNavigate}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-surface text-ink" : "text-ink-secondary hover:bg-surface hover:text-ink"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-accent" : ""}`} aria-hidden />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
