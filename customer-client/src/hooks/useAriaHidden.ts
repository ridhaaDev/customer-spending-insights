"use client";

import { useEffect, useState, type RefObject } from "react";

// True while the element is aria-hidden, e.g. because a Radix modal layer (Select, Dialog) is open
// and has hidden everything outside its portal. Lets focusable chrome step out of the tab order.
export function useAriaHidden(ref: RefObject<HTMLElement | null>): boolean {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new MutationObserver(() => setHidden(el.getAttribute("aria-hidden") === "true"));
    observer.observe(el, { attributes: true, attributeFilter: ["aria-hidden"] });
    return () => observer.disconnect();
  }, [ref]);
  return hidden;
}
