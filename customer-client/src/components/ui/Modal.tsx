"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  title: string;
  description?: string;
  children: ReactNode;
  // Controlled open state. Omit both and pass `trigger` for an uncontrolled modal.
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  // Element that opens the modal; rendered as the trigger via Radix's asChild.
  trigger?: ReactNode;
  size?: "md" | "lg";
}

const SIZE = { md: "sm:max-w-lg", lg: "sm:max-w-2xl" };

// Accessible dialog: focus is trapped inside, Escape and the overlay close it, and focus returns
// to the trigger on close. The body scrolls within the viewport on small screens.
export function Modal({ title, description, children, open, onOpenChange, trigger, size = "md" }: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50" />
        <Dialog.Content
          className={`fixed left-1/2 top-1/2 z-50 flex max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl border border-line bg-card text-ink shadow-xl focus:outline-none ${SIZE[size]}`}
        >
          <header className="px-6 pr-14 pt-5">
            <Dialog.Title className="text-lg font-semibold text-ink">{title}</Dialog.Title>
            {description ? (
              <Dialog.Description className="mt-1 text-sm text-ink-muted">{description}</Dialog.Description>
            ) : (
              <Dialog.Description className="sr-only">{title}</Dialog.Description>
            )}
          </header>
          <div className="overflow-y-auto px-6 pb-6 pt-4">{children}</div>
          {/* After the body in DOM order so initial focus lands on the content, not on Close. */}
          <Dialog.Close
            aria-label="Close"
            className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-md text-ink-muted hover:bg-surface hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <X className="h-4 w-4" aria-hidden />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
