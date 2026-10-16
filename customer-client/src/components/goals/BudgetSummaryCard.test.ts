import { describe, expect, it } from "vitest";
import { goals } from "@/test/fixtures";
import { summariseBudgets } from "./BudgetSummaryCard";

describe("summariseBudgets", () => {
  it("sums budgets, spend and the remaining amount floored per budget", () => {
    const s = summariseBudgets(goals);
    expect(s.budget).toBe(8800 + 1350 + 1350);
    expect(s.spent).toBeCloseTo(6024.1 + 1187.5 + 1854.3, 2);
    // The exceeded Entertainment budget contributes nothing; it does not offset the others.
    expect(s.left).toBeCloseTo(8800 - 6024.1 + (1350 - 1187.5), 2);
    expect(s.status).toBe("exceeded");
    expect(s.overBudget).toBe(1);
    expect(s.daysRemaining).toBe(22);
  });

  it("handles no budgets", () => {
    expect(summariseBudgets([])).toMatchObject({ budget: 0, spent: 0, left: 0, percentageUsed: 0, status: "on_track", daysRemaining: 0 });
  });
});
