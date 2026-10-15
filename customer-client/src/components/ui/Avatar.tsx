interface Props {
  name: string;
  size?: "sm" | "md";
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

export function Avatar({ name, size = "md" }: Props) {
  const box = size === "sm" ? "h-7 w-7 text-xs" : "h-10 w-10 text-sm";
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 select-none items-center justify-center rounded-full bg-accent-soft font-semibold text-accent-soft-ink ${box}`}
    >
      {initials(name) || "?"}
    </span>
  );
}
