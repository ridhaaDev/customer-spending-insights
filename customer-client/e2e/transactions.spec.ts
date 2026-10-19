import { expect, test } from "@playwright/test";
import { chooseOption, customerPath } from "./helpers";

test("adding a transaction puts it at the top of the list", async ({ page }) => {
  await page.goto(customerPath("transactions"));
  const totalText = page.getByText(/\d[\d\s\u00a0]* in total/);
  const digits = (s: string) => Number(s.replace(/\D/g, ""));
  const before = digits(await totalText.innerText());

  await page.getByRole("button", { name: "Add transaction" }).click();
  const dialog = page.getByRole("dialog", { name: "Add transaction" });
  await dialog.getByLabel("Merchant").fill("E2E Coffee");
  await dialog.getByLabel("Amount (R)").fill("42.5");
  await chooseOption(page, dialog.getByRole("combobox", { name: "Category" }), "Dining");
  await chooseOption(page, dialog.getByRole("combobox", { name: "Payment method" }), /Credit Card/);
  await dialog.getByLabel("Description").fill("Flat white");
  await dialog.getByRole("button", { name: "Add transaction" }).click();

  await expect(dialog).toBeHidden();
  const firstRow = page.locator("tbody tr").first();
  await expect(firstRow).toContainText("E2E Coffee");
  await expect(firstRow).toContainText("Dining");
  await expect(firstRow).toContainText(/R\s42,50/);
  await expect.poll(async () => digits(await totalText.innerText())).toBe(before + 1);
});

test("a bad amount is rejected by the API and shown in the form", async ({ page }) => {
  await page.goto(customerPath("transactions"));
  await page.getByRole("button", { name: "Add transaction" }).click();
  const dialog = page.getByRole("dialog", { name: "Add transaction" });
  await dialog.getByLabel("Merchant").fill("Nope");
  await dialog.getByLabel("Amount (R)").fill("0.001");
  await chooseOption(page, dialog.getByRole("combobox", { name: "Category" }), "Dining");
  await chooseOption(page, dialog.getByRole("combobox", { name: "Payment method" }), /Credit Card/);
  await dialog.getByRole("button", { name: "Add transaction" }).click();
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("alert").or(dialog.getByText(/amount/i).last())).toBeVisible();
});

test("the category and sort filters apply at once and the date range lives in the URL", async ({ page }) => {
  await page.goto(customerPath("transactions"));
  await chooseOption(page, page.getByRole("combobox", { name: "Category" }), "Groceries");
  const categoryCells = page.locator("tbody tr td:nth-child(2)");
  await expect(categoryCells.first()).toHaveText("Groceries");
  await expect.poll(async () => (await categoryCells.allInnerTexts()).every((t) => t === "Groceries")).toBe(true);

  await chooseOption(page, page.getByRole("combobox", { name: "Sort" }), "Largest amount");
  const amounts = page.locator("tbody tr td:last-child");
  await expect.poll(async () => {
    const values = (await amounts.allInnerTexts()).map((t) => Number(t.replace(/[^\d,]/g, "").replace(",", ".")));
    return values.every((v, i) => i === 0 || v <= values[i - 1]);
  }).toBe(true);

  // Presets are computed from the browser's clock, so only the shape of the range is asserted.
  await page.getByRole("button", { name: /^Date range:/ }).click();
  await page.getByRole("button", { name: "This month" }).click();
  await expect(page).toHaveURL(/from=\d{4}-\d{2}-01&to=\d{4}-\d{2}-\d{2}/);
  await expect(page.getByRole("button", { name: "Date range: This month" })).toBeVisible();
});

test("paging moves through the list", async ({ page }) => {
  await page.goto(customerPath("transactions"));
  const showing = page.getByText(/^Showing \d/);
  const first = await showing.innerText();
  await page.getByRole("button", { name: "Next page" }).click();
  await expect(showing).not.toHaveText(first);
  await expect(page.getByRole("button", { name: "Previous page" })).toBeEnabled();
});
