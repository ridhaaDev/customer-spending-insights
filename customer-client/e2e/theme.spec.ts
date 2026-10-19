import { expect, test } from "@playwright/test";
import { customerPath } from "./helpers";

test("the theme choice applies at once and survives a reload", async ({ page }) => {
  await page.goto(customerPath());
  const html = page.locator("html");
  await page.getByRole("button", { name: /^Theme:/ }).click();
  await page.getByRole("menuitemradio", { name: "Dark" }).click();
  await expect(html).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("button", { name: "Theme: Dark" })).toBeVisible();

  await page.reload();
  await expect(html).toHaveAttribute("data-theme", "dark");

  await page.getByRole("button", { name: "Theme: Dark" }).click();
  await page.getByRole("menuitemradio", { name: "Candy" }).click();
  await expect(html).toHaveAttribute("data-theme", "candy");
});
