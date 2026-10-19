import { expect, test } from "@playwright/test";
import { customerPath, FIRST_CUSTOMER } from "./helpers";

test("the root redirects to the first customer's overview", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(new RegExp(`/customers/${FIRST_CUSTOMER}$`));
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Thandi Mokoena");
});

test("the side navigation reaches every section", async ({ page }) => {
  await page.goto(customerPath());
  const nav = page.getByRole("navigation", { name: "Pages" });
  for (const [label, section] of [
    ["Categories", "categories"],
    ["Trends", "trends"],
    ["Budgets", "budgets"],
    ["Transactions", "transactions"],
  ] as const) {
    await nav.getByRole("link", { name: label }).click();
    await expect(page).toHaveURL(new RegExp(`/${section}$`));
    await expect(page.getByRole("heading", { level: 1, name: label })).toBeVisible();
  }
  await nav.getByRole("link", { name: "Overview" }).click();
  await expect(page).toHaveURL(new RegExp(`/customers/${FIRST_CUSTOMER}$`));
});

test("switching profile keeps the section and search params", async ({ page }) => {
  await page.goto(`${customerPath("trends")}?months=24`);
  await page.getByRole("button", { name: /Thandi Mokoena/ }).click();
  const other = page.getByRole("menuitemradio").filter({ hasNotText: "Thandi Mokoena" }).first();
  // Menu items read "initials / name / email"; the name is the first line longer than the initials.
  const name = (await other.innerText()).split("\n").find((line) => line.trim().length > 3)!.trim();
  await other.click();
  await expect(page).toHaveURL(/\/customers\/(?!10001)\d+\/trends\?months=24$/);
  await expect(page.getByRole("heading", { level: 1, name: "Trends" })).toBeVisible();
  await expect(page.getByRole("button", { name: new RegExp(name) })).toBeVisible();
});

test("an unknown customer shows the not-found page", async ({ page }) => {
  const response = await page.goto("/customers/99999");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
  await page.getByRole("link", { name: "Go to the first customer" }).click();
  await expect(page).toHaveURL(new RegExp(`/customers/${FIRST_CUSTOMER}$`));
});

test.describe("phone", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  test("pages fit the viewport and the menu opens the navigation", async ({ page }) => {
    for (const section of ["", "categories", "trends", "budgets", "transactions"]) {
      await page.goto(customerPath(section));
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    }
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page.getByRole("dialog").getByRole("link", { name: "Budgets" }).click();
    await expect(page).toHaveURL(/\/budgets$/);
  });
});
