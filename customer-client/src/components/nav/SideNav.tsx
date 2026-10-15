import { ChartColumn, ChartPie, LayoutDashboard, Receipt, Target, type LucideProps } from "lucide-react";
import type { ComponentType } from "react";

export interface NavItem {
  id: string;
  label: string;
  Icon: ComponentType<LucideProps>;
}

// The dashboard is one page, so items are anchors to its sections.
export const NAV_ITEMS: NavItem[] = [
  { id: "overview", label: "Overview", Icon: LayoutDashboard },
  { id: "categories", label: "Categories", Icon: ChartPie },
  { id: "trends", label: "Trends", Icon: ChartColumn },
  { id: "budgets", label: "Budgets", Icon: Target },
  { id: "transactions", label: "Transactions", Icon: Receipt },
];

interface Props {
  activeId: string;
  onNavigate: (id: string) => void;
  items?: NavItem[];
}

export function SideNav({ activeId, onNavigate, items = NAV_ITEMS }: Props) {
  return (
    <nav aria-label="Sections">
      <ul className="space-y-0.5">
        {items.map(({ id, label, Icon }) => {
          const active = id === activeId;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={active ? "page" : undefined}
                onClick={() => onNavigate(id)}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-surface text-ink" : "text-ink-secondary hover:bg-surface hover:text-ink"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-accent" : ""}`} aria-hidden />
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
