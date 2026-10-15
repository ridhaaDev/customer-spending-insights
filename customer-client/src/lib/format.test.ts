import { describe, expect, it } from "vitest";
import { formatChange, formatMonth, formatZAR } from "./format";

// Intl inserts non-breaking and narrow spaces; normalise so assertions are about digits and symbols.
const tidy = (s: string) => s.replace(/[\s  ]+/g, " ");

describe("formatZAR", () => {
  it("formats rand with cents in the en-ZA locale", () => {
    expect(tidy(formatZAR(1234.5))).toBe("R 1 234,50");
  });

  it("drops cents for headline figures", () => {
    expect(tidy(formatZAR(1234.5, { whole: true }))).toBe("R 1 235");
  });

  it("compacts large values for axis ticks", () => {
    expect(tidy(formatZAR(12345, { compact: true }))).toMatch(/^R 12,3\s?K$/);
  });
});

describe("formatChange", () => {
  it("signs positive values and keeps one decimal", () => {
    expect(formatChange(12.5)).toBe("+12.5%");
    expect(formatChange(-3.2)).toBe("-3.2%");
    expect(formatChange(0)).toBe("0.0%");
  });

  it("renders a dash when there is no comparison", () => {
    expect(formatChange(null)).toBe("—");
  });
});

describe("formatMonth", () => {
  it("renders short and long month names without timezone drift", () => {
    expect(formatMonth("2024-09")).toBe("Sept");
    expect(formatMonth("2024-01", "long")).toBe("January 2024");
  });
});
