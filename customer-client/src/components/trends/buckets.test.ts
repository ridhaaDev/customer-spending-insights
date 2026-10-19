import { describe, expect, it } from "vitest";
import { trends } from "@/test/fixtures";
import { categoryRowsToQuarters, monthsToQuarters, quarterKey } from "./buckets";

describe("quarter buckets", () => {
  it("keys months into calendar quarters", () => {
    expect(quarterKey("2026-01")).toBe("2026-Q1");
    expect(quarterKey("2026-12")).toBe("2026-Q4");
  });

  it("sums months into quarters and recomputes the average", () => {
    const quarters = monthsToQuarters(trends);
    expect(quarters.map((q) => q.month)).toEqual(["2025-Q4", "2026-Q1", "2026-Q2", "2026-Q3", "2026-Q4"]);
    const q1 = quarters[1];
    expect(q1.totalSpent).toBe(Math.round((20410.2 + 19870.0 + 26210.7) * 100) / 100);
    expect(q1.transactionCount).toBe(48 + 45 + 58);
    expect(q1.averageTransaction).toBe(Math.round((q1.totalSpent / q1.transactionCount) * 100) / 100);
  });

  it("sums category values per quarter", () => {
    const rows = categoryRowsToQuarters([
      { month: "2026-01", totalSpent: 10, values: { Groceries: 6, Dining: 4 } },
      { month: "2026-02", totalSpent: 5, values: { Groceries: 5 } },
      { month: "2026-04", totalSpent: 1, values: { Dining: 1 } },
    ]);
    expect(rows).toEqual([
      { month: "2026-Q1", totalSpent: 15, values: { Groceries: 11, Dining: 4 } },
      { month: "2026-Q2", totalSpent: 1, values: { Dining: 1 } },
    ]);
  });
});
