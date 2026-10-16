import { describe, expect, it } from "vitest";
import { customerPath, parseDateRange, parseMonths, parsePeriod, sectionOf, withCustomer } from "./params";

describe("search param parsing", () => {
  it("accepts known periods and falls back to 30d", () => {
    expect(parsePeriod("7d")).toBe("7d");
    expect(parsePeriod(["1y", "7d"])).toBe("1y");
    expect(parsePeriod("2d")).toBe("30d");
    expect(parsePeriod(undefined)).toBe("30d");
  });

  it("accepts 6, 12 or 24 months and falls back to 12", () => {
    expect(parseMonths("6")).toBe(6);
    expect(parseMonths("24")).toBe(24);
    expect(parseMonths("13")).toBe(12);
    expect(parseMonths(undefined)).toBe(12);
  });

  it("only yields a range when both dates are well-formed and ordered", () => {
    expect(parseDateRange("2026-09-01", "2026-09-30")).toEqual({ startDate: "2026-09-01", endDate: "2026-09-30" });
    expect(parseDateRange("2026-09-30", "2026-09-01")).toBeNull();
    expect(parseDateRange("2026-09-01", undefined)).toBeNull();
    expect(parseDateRange("01/09/2026", "2026-09-30")).toBeNull();
  });
});

describe("customer paths", () => {
  it("builds section paths", () => {
    expect(customerPath("10001")).toBe("/customers/10001");
    expect(customerPath("10001", "trends")).toBe("/customers/10001/trends");
    expect(customerPath("a/b", "budgets")).toBe("/customers/a%2Fb/budgets");
  });

  it("swaps the customer and keeps the section", () => {
    expect(withCustomer("/customers/10001/categories", "10003")).toBe("/customers/10003/categories");
    expect(withCustomer("/customers/10001", "10003")).toBe("/customers/10003");
    expect(withCustomer("/somewhere-else", "10003")).toBe("/customers/10003");
  });

  it("reads the section from a path", () => {
    expect(sectionOf("/customers/10001")).toBe("");
    expect(sectionOf("/customers/10001/transactions")).toBe("transactions");
    expect(sectionOf("/customers/10001/unknown")).toBe("");
  });
});

describe("date helpers", () => {
  it("formats ranges with unpadded days and the year once when shared", async () => {
    const { formatRange, lastMonth, rangeForPeriod, thisMonth } = await import("./dates");
    expect(formatRange({ startDate: "2026-10-02", endDate: "2026-10-09" })).toBe("2 Oct – 9 Oct 2026");
    expect(formatRange({ startDate: "2025-12-28", endDate: "2026-01-03" })).toBe("28 Dec 2025 – 3 Jan 2026");
    expect(rangeForPeriod("7d", "2026-10-16")).toEqual({ startDate: "2026-10-10", endDate: "2026-10-16" });
    expect(thisMonth("2026-10-16")).toEqual({ startDate: "2026-10-01", endDate: "2026-10-16" });
    expect(lastMonth("2026-10-16")).toEqual({ startDate: "2026-09-01", endDate: "2026-09-30" });
    expect(lastMonth("2026-01-05")).toEqual({ startDate: "2025-12-01", endDate: "2025-12-31" });
  });
});
