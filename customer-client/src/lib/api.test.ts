import { afterEach, describe, expect, it, vi } from "vitest";
import { api, ApiError, buildUrl } from "./api";

afterEach(() => {
  vi.unstubAllGlobals();
});

function stubFetch(status: number, body: unknown) {
  const fetchMock = vi.fn<(input: string | URL | Request, init?: RequestInit) => Promise<Response>>(
    async () => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } }),
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("buildUrl", () => {
  it("omits empty and undefined params", () => {
    const url = new URL(buildUrl("/api/customers/1/transactions", { limit: 10, category: undefined, sortBy: "", offset: 0 }));
    expect(url.pathname).toBe("/api/customers/1/transactions");
    expect([...url.searchParams.entries()]).toEqual([
      ["limit", "10"],
      ["offset", "0"],
    ]);
  });
});

describe("api", () => {
  it("passes query params and returns the parsed body", async () => {
    const fetchMock = stubFetch(200, { period: "7d", totalSpent: 1 });
    const result = await api.summary("10001", "7d");
    expect(result.totalSpent).toBe(1);
    const called = new URL(String(fetchMock.mock.calls[0][0]));
    expect(called.pathname).toBe("/api/customers/10001/spending/summary");
    expect(called.searchParams.get("period")).toBe("7d");
  });

  it("surfaces the API's detail message on error responses", async () => {
    stubFetch(404, { detail: "Customer 'x' not found" });
    const err = await api.profile("x").catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect((err as ApiError).status).toBe(404);
    expect((err as ApiError).message).toBe("Customer 'x' not found");
  });

  it("wraps network failures", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new TypeError("Failed to fetch");
      }),
    );
    const err = await api.health().catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect((err as ApiError).status).toBe(0);
  });
});
