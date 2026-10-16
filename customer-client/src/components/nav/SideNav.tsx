import { ChartColumn, ChartPie, LayoutDashboard, Receipt, Target, type LucideProps } from "lucide-react";
import Link from "next/link";
import type { ComponentType } from "react";
import { customerPath, type Section } from "@/lib/params";

export interface NavItem {
  href: string;
  label: string;
  Icon: ComponentType<LucideProps>;
}

const SECTIONS: { section: Section; label: string; Icon: ComponentType<LucideProps> }[] = [
  { section: "", label: "Overview", Icon: LayoutDashboard },
  { section: "categories", label: "Categories", Icon: ChartPie },
  { section: "trends", label: "Trends", Icon: ChartColumn },
  { section: "budgets", label: "Budgets", Icon: Target },
  { section: "transactions", label: "Transactions", Icon: Receipt },
];

// Links for one customer; the search string (period etc.) is carried across sections.
export function navItemsFor(customerId: string, search = ""): NavItem[] {
  return SECTIONS.map(({ section, label, Icon }) => ({
    href: search ? `${customerPath(customerId, section)}?${search}` : customerPath(customerId, section),
    label,
    Icon,
  }));
}

interface Props {
  items: NavItem[];
  // Pathname only; items are matched on their path, ignoring any search string.
  activeHref: string;
  onNavigate?: () => void;
}

const pathOf = (href: string) => href.split("?")[0];

export function SideNav({ items, activeHref, onNavigate }: Props) {
  return (
    <nav aria-label="Pages">
      <ul className="space-y-0.5">
        {items.map(({ href, label, Icon }) => {
          const active = pathOf(href) === activeHref;
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
