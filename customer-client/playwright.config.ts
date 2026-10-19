import { defineConfig, devices } from "@playwright/test";

// Ports away from the dev stack (3000/8000/6006) so the suite can run beside it.
export const API_PORT = 8123;
export const APP_PORT = 3123;
export const STORYBOOK_PORT = 6123;
// Pinned so the generated dataset, and therefore every assertion, is the same on every machine.
export const MOCK_TODAY = "2026-10-16";

const CI = !!process.env.CI;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  workers: CI ? 2 : undefined,
  reporter: CI ? [["list"], ["html", { open: "never" }]] : [["list"]],
  use: {
    baseURL: `http://localhost:${APP_PORT}`,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  // The real API, the production build served the way the Docker image serves it, and the static Storybook.
  webServer: [
    {
      command: `poetry run fastapi run src/customer_api/main.py --port ${API_PORT}`,
      cwd: "../customer-api",
      url: `http://localhost:${API_PORT}/health`,
      env: { MOCK_TODAY, CORS_ORIGINS: `http://localhost:${APP_PORT}` },
      reuseExistingServer: !CI,
      timeout: 60_000,
    },
    {
      command: "npm run build && npm run start:standalone",
      url: `http://localhost:${APP_PORT}/`,
      env: { NEXT_PUBLIC_API_URL: `http://localhost:${API_PORT}`, API_URL: `http://localhost:${API_PORT}`, PORT: `${APP_PORT}` },
      reuseExistingServer: !CI,
      timeout: 300_000,
    },
    {
      command: `npm run build-storybook && python3 -m http.server ${STORYBOOK_PORT} --directory storybook-static`,
      url: `http://localhost:${STORYBOOK_PORT}/index.json`,
      reuseExistingServer: !CI,
      timeout: 300_000,
    },
  ],
});
