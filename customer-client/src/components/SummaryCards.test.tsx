import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SummaryCards } from "./SummaryCards";

const summary = {
  period: "30d" as const,
  totalSpent: 4250.75,
  transactionCount: 47,
  averageTransaction: 90.44,
  topCategory: "Groceries" as const,
  comparedToPrevious: { spentChange: 12.5, transactionChange: null },
};

const text = (s: string) => s.replace(/[\s  ]+/g, " ");

describe("SummaryCards", () => {
  it("renders the four headline figures", () => {
    render(<SummaryCards summary={summary} period="30d" loading={false} error={null} onRetry={() => {}} />);
    expect(text(screen.getByText(/R.*4.*251/).textContent ?? "")).toBe("R 4 251");
    expect(screen.getByText("47")).toBeInTheDocument();
    expect(screen.getByText("Groceries")).toBeInTheDocument();
    expect(screen.getByText("+12.5%")).toBeInTheDocument();
    expect(screen.getByText("no prior data")).toBeInTheDocument();
  });

  it("shows skeletons before data arrives", () => {
    const { container } = render(<SummaryCards summary={undefined} period="30d" loading error={null} onRetry={() => {}} />);
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });

  it("shows an error with retry when the request fails before any data", () => {
    render(<SummaryCards summary={undefined} period="30d" loading={false} error={new Error("boom")} onRetry={() => {}} />);
    expect(screen.getByRole("alert")).toHaveTextContent("boom");
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });
});
