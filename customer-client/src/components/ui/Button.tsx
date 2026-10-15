import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { size?: "sm" | "md" | "icon" };

const SIZE = { sm: "px-2.5 py-1 text-xs", md: "px-3 py-1.5 text-sm", icon: "p-1.5" };

export function Button({ size = "md", className = "", type = "button", ...props }: Props) {
  return (
    <button
      type={type}
      className={`inline-flex items-center gap-1.5 rounded-md border border-line font-medium text-ink hover:enabled:bg-surface disabled:opacity-40 ${SIZE[size]} ${className}`}
      {...props}
    />
  );
}
