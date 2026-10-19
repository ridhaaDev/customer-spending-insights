import { describe, expect, it } from "vitest";
import { categoryTrends, trends, weekdaySpending } from "@/test/fixtures";
import { formatZAR } from "./format";
import { averageInsight, categoryInsight, monthlyInsight, relative, weekdayInsight } from "./insights";

// en-ZA currency strings carry non-breaking spaces, so expectations are built with the same formatter.
const R = (v: number) => formatZAR(v, { whole: true });

describe("relative", () => {
  it("rounds to whole percent and treats tiny differences as in line", () => {
    expect(relative(103, 100)).toBe("3% above");
    expect(relative(90, 100)).toBe("10% below");
    expect(relative(100.3, 100)).toBe("in line with");
    expect(relative(5, 0)).toBe("in line with");
  });
});

describe("insights", () => {
  it("names the peak month and compares the last full month with the average", () => {
    // The in-progress October is excluded, so March 2026 is the peak and September the last full month.
    expect(monthlyInsight(trends)).toBe(`Spending peaked in March 2026 at ${R(26210.7)}. September 2026 was 1% above the ${R(21497)} monthly average.`);
  });

  it("needs at least two completed months", () => {
    expect(monthlyInsight(trends.slice(-2))).toBeNull();
    expect(averageInsight(trends.slice(-1))).toBeNull();
    expect(categoryInsight({ ...categoryTrends, trends: categoryTrends.trends.slice(-2) })).toBeNull();
  });

  it("compares the last full month's average transaction with the window", () => {
    expect(averageInsight(trends)).toMatch(/^The average transaction was R\s4\d\d,\d\d across the window\. September 2026 came in .* that\.$/);
  });

  it("names the top category and the biggest share mover", () => {
    // Dining climbs from a fifth of spend to two fifths across the window.
    const months = ["2026-01", "2026-02", "2026-03", "2026-04", "2026-05"];
    const shifting = {
      categories: categoryTrends.categories,
      trends: months.map((month, i) => {
        const dining = i < 2 ? 200 : i < 4 ? 400 : 50;
        return { month, totalSpent: 1000, categories: { Groceries: 1000 - dining, Dining: dining } };
      }),
    };
    expect(categoryInsight(shifting)).toBe("Groceries is 70% of spend. Dining's share grew the most, from 20% to 40% between the two halves of the window.");
  });

  it("uses a bare apostrophe for names ending in s", () => {
    // Five months so that four completed ones split evenly into two halves.
    const months = ["2026-01", "2026-02", "2026-03", "2026-04", "2026-05"];
    const data = {
      categories: categoryTrends.categories,
      trends: months.map((month, i) => ({ month, totalSpent: 1000, categories: { Groceries: i < 2 ? 500 : 800, Dining: i < 2 ? 500 : 200, Pets: 0 } })),
    };
    expect(categoryInsight(data)).toBe("Groceries is 65% of spend. Groceries' share grew the most, from 50% to 80% between the two halves of the window.");
  });

  it("reads the sample window", () => {
    expect(categoryInsight(categoryTrends)).toMatch(/^Groceries is 3\d% of spend\. /);
  });

  it("says shares barely moved when no category shifts a full point", () => {
    const flat = {
      ...categoryTrends,
      trends: categoryTrends.trends.map((t) => ({ ...t, categories: { Groceries: t.totalSpent * 0.6, Dining: t.totalSpent * 0.4 } })),
    };
    expect(categoryInsight(flat)).toBe("Groceries is 60% of spend. Shares barely moved across the window.");
  });

  it("compares the priciest weekday with the Monday-to-Friday average", () => {
    expect(weekdayInsight(weekdaySpending.weekdays)).toBe(
      `Saturdays are the most expensive at ${R(964.21)} a day, 51% above the Monday-to-Friday average. Tuesdays are the quietest at ${R(551.18)}.`,
    );
    expect(weekdayInsight(weekdaySpending.weekdays.map((w) => ({ ...w, transactionCount: 0 })))).toBeNull();
  });
});
