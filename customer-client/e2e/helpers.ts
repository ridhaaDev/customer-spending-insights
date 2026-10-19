import type { Page } from "@playwright/test";

export const FIRST_CUSTOMER = "10001";

export const customerPath = (section = "", customerId = FIRST_CUSTOMER) => `/customers/${customerId}${section ? `/${section}` : ""}`;

// Radix Select: open the trigger (role combobox) and pick an option from the portalled listbox.
export async function chooseOption(page: Page, combobox: ReturnType<Page["getByRole"]>, option: string | RegExp) {
  await combobox.click();
  await page.getByRole("option", { name: option }).click();
}

export async function horizontalOverflow(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
}
