import { expect, test } from "@playwright/test";
import { customerPath } from "./helpers";

const CARDS = ["Monthly spending", "Spend by category", "Average transaction", "Spend by weekday"];

test("four trend cards share the months control", async ({ page }) => {
  await page.goto(customerPath("trends"));
  for (const title of CARDS) await expect(page.getByRole("heading", { name: title })).toBeVisible();
  await expect(page.getByText("Last 12 months")).toHaveCount(4);
  await expect(page.getByRole("img", { name: /bar chart|line chart/i })).toHaveCount(4);

  await page.getByRole("radio", { name: "24 months" }).click();
  await expect(page).toHaveURL(/months=24/);
  await expect(page.getByText("Last 24 months")).toHaveCount(4);
});

test("every chart has a table twin", async ({ page }) => {
  await page.goto(customerPath("trends"));
  const monthly = page.locator("section", { has: page.getByRole("heading", { name: "Monthly spending" }) });
  await monthly.getByRole("button", { name: "Table" }).click();
  await expect(monthly.getByRole("table")).toBeVisible();
  await expect(monthly.getByRole("columnheader", { name: "Spent" })).toBeVisible();
  await monthly.getByRole("button", { name: "Chart" }).click();
  await expect(monthly.getByRole("img")).toBeVisible();
});

test("legend entries isolate a category", async ({ page }) => {
  await page.goto(customerPath("trends"));
  const card = page.locator("section", { has: page.getByRole("heading", { name: "Spend by category" }) });
  const groceries = card.getByRole("button", { name: "Groceries" });
  await expect(groceries).toHaveAttribute("aria-pressed", "true");
  await groceries.click();
  await expect(groceries).toHaveAttribute("aria-pressed", "false");
  await card.getByRole("button", { name: "Show all" }).click();
  await expect(groceries).toHaveAttribute("aria-pressed", "true");
});

test("each card opens with a sentence about its data", async ({ page }) => {
  await page.goto(customerPath("trends"));
  await expect(page.getByText(/^Spending peaked in \w+ \d{4}/)).toBeVisible();
  await expect(page.getByText(/^\w+ is \d+% of spend\./)).toBeVisible();
  await expect(page.getByText(/^The average transaction was/)).toBeVisible();
  await expect(page.getByText(/^\w+s are the most expensive at/)).toBeVisible();
});
