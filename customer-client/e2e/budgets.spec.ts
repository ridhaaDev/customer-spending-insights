import { expect, test } from "@playwright/test";
import { customerPath } from "./helpers";

test("adding a budget lists it with a status", async ({ page }) => {
  await page.goto(customerPath("budgets"));
  await page.getByRole("button", { name: "Add budget" }).click();
  const dialog = page.getByRole("dialog", { name: "Add budget" });
  await dialog.getByRole("combobox", { name: "Category" }).click();
  const option = page.getByRole("option").first();
  const category = await option.innerText();
  await option.click();
  await dialog.getByLabel("Monthly budget (R)").fill("1234");
  await dialog.getByRole("button", { name: "Add budget" }).click();
  await expect(dialog).toBeHidden();

  const row = page.getByRole("listitem").filter({ hasText: category });
  await expect(row).toContainText(/R\s1\s234/);
  await expect(row).toContainText(/On track|Warning|Over budget/);
  await expect(page.getByText("Left to spend this month")).toBeVisible();
});
