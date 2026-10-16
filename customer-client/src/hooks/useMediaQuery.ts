"use client";

import { useSyncExternalStore } from "react";

const supported = () => typeof window !== "undefined" && typeof window.matchMedia === "function";

// True when the media query matches; false on the server, during hydration, and where matchMedia is missing (jsdom).
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      if (!supported()) return () => {};
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => (supported() ? window.matchMedia(query).matches : false),
    () => false,
  );
}
