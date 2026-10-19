import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { customerPath } from "./helpers";

// Real-browser axe over every route in the light and dark themes, including colour contrast,
// which the jsdom unit tests cannot check.
const ROUTES = [
  ["overview", ""],
  ["categories", "categories"],
  ["trends", "trends"],
  ["budgets", "budgets"],
  ["transactions", "transactions"],
] as const;

for (const scheme of ["light", "dark"] as const) {
  for (const [name, section] of ROUTES) {
    test(`${name} has no WCAG AA violations (${scheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto(customerPath(section));
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await page.waitForLoadState("networkidle");
      const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
      expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
    });
  }
}

test("the add-transaction modal has no violations", async ({ page }) => {
  await page.goto(customerPath("transactions"));
  await page.getByRole("button", { name: "Add transaction" }).click();
  await expect(page.getByRole("dialog", { name: "Add transaction" })).toBeVisible();
  const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(violations.map((v) => v.id)).toEqual([]);
});
