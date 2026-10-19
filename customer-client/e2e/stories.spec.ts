import { expect, test } from "@playwright/test";
import { STORYBOOK_PORT } from "../playwright.config";

interface StoryIndex {
  entries: Record<string, { id: string; title: string; name: string; tags?: string[] }>;
}

// Every story with a play function runs in the built Storybook; a failed interaction or assertion
// turns on Storybook's error display, which is what this checks.
test("Storybook play functions pass", async ({ page, request }) => {
  test.setTimeout(180_000);
  const index = (await (await request.get(`http://localhost:${STORYBOOK_PORT}/index.json`)).json()) as StoryIndex;
  const stories = Object.values(index.entries).filter((e) => e.tags?.includes("play-fn"));
  expect(stories.length).toBeGreaterThan(0);

  const failures: string[] = [];
  page.on("pageerror", (err) => failures.push(`pageerror: ${err.message}`));
  for (const story of stories) {
    await test.step(`${story.title} / ${story.name}`, async () => {
      await page.goto(`http://localhost:${STORYBOOK_PORT}/iframe.html?id=${story.id}&viewMode=story`);
      await expect(page.locator("body")).toHaveClass(/sb-show-main|sb-show-errordisplay/, { timeout: 30_000 });
      // Play functions run after render; give userEvent interactions time to finish.
      await page.waitForTimeout(1500);
      if (await page.locator("body.sb-show-errordisplay").count()) {
        failures.push(`${story.id}: ${(await page.locator("#error-message").innerText()).slice(0, 300)}`);
      }
    });
  }
  expect(failures).toEqual([]);
});
