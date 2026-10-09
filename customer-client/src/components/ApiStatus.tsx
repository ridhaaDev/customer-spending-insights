"use client";

import { useEffect, useState } from "react";
import { API_URL, getHealth } from "@/lib/api";

type State = "checking" | "ok" | "error";

export function ApiStatus() {
  const [state, setState] = useState<State>("checking");

  useEffect(() => {
    getHealth()
      .then((body) => setState(body.status === "ok" ? "ok" : "error"))
      .catch(() => setState("error"));
  }, []);

  const label = { checking: "Checking API…", ok: "API online", error: "API unreachable" }[state];
  const colour = { checking: "bg-zinc-400", ok: "bg-emerald-500", error: "bg-red-500" }[state];

  return (
    <p className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400" title={API_URL}>
      <span className={`inline-block h-2.5 w-2.5 rounded-full ${colour}`} aria-hidden />
      {label}
    </p>
  );
}
