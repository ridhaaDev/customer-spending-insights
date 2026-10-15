import type { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  // min-w-0 lets a card shrink inside a grid column; tables scroll internally instead of widening the page.
  return <section className={`min-w-0 rounded-xl border border-line bg-card p-5 ${className}`}>{children}</section>;
}
