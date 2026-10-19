import { expect, test } from "@playwright/test";
import { API_PORT, MOCK_TODAY } from "../playwright.config";

const api = `http://localhost:${API_PORT}/api/customers`;

test("responses are camelCase and windows end on the pinned today", async ({ request }) => {
  const summary = await request.get(`${api}/10001/spending/summary?period=30d`);
  expect(summary.ok()).toBe(true);
  expect(await summary.json()).toMatchObject({ period: "30d", totalSpent: expect.any(Number), comparedToPrevious: { spentChange: expect.any(Number) } });

  const categories = await (await request.get(`${api}/10001/spending/categories?period=30d`)).json();
  expect(categories.dateRange.endDate).toBe(MOCK_TODAY);
  expect(categories.categories[0]).toHaveProperty("transactionCount");
});

test("validation failures are 422 with a field path", async ({ request }) => {
  const res = await request.post(`${api}/10001/transactions`, {
    data: { merchant: "x", amount: -5, category: "Dining", date: `${MOCK_TODAY}T10:00:00Z`, paymentMethod: "Credit Card" },
  });
  expect(res.status()).toBe(422);
  const body = await res.json();
  expect(JSON.stringify(body.detail)).toContain("amount");
});

test("an unknown customer is 404 everywhere", async ({ request }) => {
  for (const path of ["", "/spending/summary", "/spending/trends/categories", "/spending/weekdays", "/goals"]) {
    expect((await request.get(`${api}/99999${path}`)).status(), path).toBe(404);
  }
});
