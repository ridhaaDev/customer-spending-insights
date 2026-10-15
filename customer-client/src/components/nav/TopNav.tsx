import { Menu, Wallet, X } from "lucide-react";
import type { CustomerSummary } from "@/lib/types";
import { ProfileMenu } from "./ProfileMenu";

interface Props {
  customers: CustomerSummary[] | undefined;
  currentId: string | null;
  onSwitch: (customerId: string) => void;
  menuOpen: boolean;
  onToggleMenu: () => void;
}

export function TopNav({ customers, currentId, onSwitch, menuOpen, onToggleMenu }: Props) {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-card">
      <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={onToggleMenu}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          className="rounded-md p-1.5 text-ink hover:bg-surface lg:hidden"
        >
          {menuOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
        </button>
        <a href="#overview" className="flex items-center gap-2 text-ink">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-card">
            <Wallet className="h-4 w-4" aria-hidden />
          </span>
          <span className="text-base font-semibold tracking-tight">Spending Insights</span>
        </a>
        <div className="ml-auto">
          {customers && <ProfileMenu customers={customers} currentId={currentId} onSwitch={onSwitch} />}
        </div>
      </div>
    </header>
  );
}
