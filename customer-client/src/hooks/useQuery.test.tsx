import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useQuery } from "./useQuery";

describe("useQuery", () => {
  it("fetches on mount and exposes the result", async () => {
    const fetcher = vi.fn(async () => "hello");
    const { result } = renderHook(() => useQuery("k", fetcher));
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toBe("hello");
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("refetches when the key changes and keeps previous data while loading", async () => {
    const fetcher = vi.fn(async (_signal: AbortSignal, key: string) => key);
    const { result, rerender } = renderHook(({ key }) => useQuery(key, (s) => fetcher(s, key)), {
      initialProps: { key: "a" },
    });
    await waitFor(() => expect(result.current.data).toBe("a"));

    rerender({ key: "b" });
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBe("a");
    await waitFor(() => expect(result.current.data).toBe("b"));
    expect(result.current.loading).toBe(false);
  });

  it("exposes errors and recovers on refetch", async () => {
    let attempts = 0;
    const fetcher = vi.fn(async () => {
      attempts += 1;
      if (attempts === 1) throw new Error("boom");
      return "ok";
    });
    const { result } = renderHook(() => useQuery("k", fetcher));
    await waitFor(() => expect(result.current.error?.message).toBe("boom"));

    act(() => result.current.refetch());
    await waitFor(() => expect(result.current.data).toBe("ok"));
    expect(result.current.error).toBeNull();
  });

  it("does not fetch when disabled", async () => {
    const fetcher = vi.fn(async () => "x");
    const { result } = renderHook(() => useQuery("k", fetcher, { enabled: false }));
    expect(result.current.loading).toBe(false);
    expect(fetcher).not.toHaveBeenCalled();
  });
});
