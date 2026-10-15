import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { summary } from "@/test/fixtures";
import { SummaryCards } from "./SummaryCards";

const text = (s: string) => s.replace(/[\s  ]+/g, " ");
const noop = () => {};

describe("SummaryCards", () => {
  it("renders the four headline figures", () => {
    const data = { ...summary, comparedToPrevious: { spentChange: 12.5, transactionChange: null } };
    render(<SummaryCards summary={data} period="30d" loading={false} error={null} onRetry={noop} />);
    expect(text(screen.getByText(/R.*25.*808/).textContent ?? "")).toBe("R 25 808");
    expect(screen.getByText("51")).toBeInTheDocument();
    expect(screen.getByText("Groceries")).toBeInTheDocument();
    expect(screen.getByText("+12.5%")).toBeInTheDocument();
    expect(screen.getByText("no prior data")).toBeInTheDocument();
  });

  it("shows skeletons before data arrives", () => {
    const { container } = render(<SummaryCards summary={undefined} period="30d" loading error={null} onRetry={noop} />);
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });

  it("shows an error with retry when the request fails before any data", () => {
    render(<SummaryCards summary={undefined} period="30d" loading={false} error={new Error("boom")} onRetry={noop} />);
    expect(screen.getByRole("alert")).toHaveTextContent("boom");
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });
});
