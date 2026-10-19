import { expect, test } from "@playwright/test";
import { customerPath } from "./helpers";

test("the period selector drives the URL and the comparison copy", async ({ page }) => {
  await page.goto(customerPath());
  await expect(page.getByText("vs previous 30 days").first()).toBeVisible();
  await page.getByRole("radio", { name: "Last 7 days" }).click();
  await expect(page).toHaveURL(/period=7d/);
  await expect(page.getByText("vs previous 7 days").first()).toBeVisible();
  await page.reload();
  await expect(page.getByRole("radio", { name: "Last 7 days" })).toBeChecked();
});

test("the overview shows budgets beside the latest transactions", async ({ page }) => {
  await page.goto(customerPath());
  await expect(page.getByText("Left to spend this month")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Monthly budgets" })).toBeVisible();
  const recent = page.locator("section", { has: page.getByRole("heading", { name: "Recent transactions" }) });
  await expect(recent.locator("tbody tr")).toHaveCount(5);
  await recent.getByRole("link", { name: "View all" }).click();
  await expect(page).toHaveURL(/\/transactions$/);
});
