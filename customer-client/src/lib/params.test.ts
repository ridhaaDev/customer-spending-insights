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
