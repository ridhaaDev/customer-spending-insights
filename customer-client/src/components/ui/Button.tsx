import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { size?: "sm" | "md" | "icon"; variant?: "outline" | "primary" };

const SIZE = { sm: "px-2.5 py-1 text-xs", md: "px-3 py-1.5 text-sm", icon: "p-1.5" };
const VARIANT = {
  outline: "border border-line text-ink hover:enabled:bg-surface",
  primary: "bg-ink text-card hover:enabled:opacity-90",
};

export function Button({ size = "md", variant = "outline", className = "", type = "button", ...props }: Props) {
  return (
    <button
      type={type}
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-40 ${VARIANT[variant]} ${SIZE[size]} ${className}`}
      {...props}
    />
  );
}
