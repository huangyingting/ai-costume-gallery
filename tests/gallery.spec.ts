import { expect, test } from "@playwright/test";

test("catalog filters, search, pagination and original links work under the Pages base path", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("./");
  await expect(page.getByRole("heading", { name: /a wardrobe of/i })).toBeVisible();
  await expect(page.getByRole("status")).toHaveText("1,407 references found");
  await expect(page.locator(".outfit-card")).toHaveCount(48);
  await page.getByRole("button", { name: "Discover more" }).click();
  await expect(page.locator(".outfit-card")).toHaveCount(96);
  await page.getByRole("button", { name: "Winter 253" }).click();
  await expect(page.getByRole("status")).toHaveText("253 references found");
  await expect(page.locator(".outfit-card")).toHaveCount(48);
  await expect(page.locator(".outfit-card").first()).toContainText("Winter");
  await page.getByRole("button", { name: "All outfits" }).click();
  await page.getByRole("searchbox").fill("SPR-0001");
  await expect(page.getByRole("status")).toHaveText("1 reference found");
  await page.getByRole("button", { name: "Preview SPR-0001", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog").locator("img")).toHaveAttribute("src", "/ai-costume-gallery/img/SPR-0001.webp");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.getByRole("link", { name: "Open original PNG for SPR-0001" })).toHaveAttribute("href", "https://ai-costume-gallery.pages.dev/png/SPR-0001.png");
  await page.getByRole("searchbox").fill("白 denim");
  await expect(page.locator(".outfit-card").first()).toBeVisible();
  const descriptions = await page.locator(".outfit-card h3").allTextContents();
  expect(descriptions.every((text) => text.includes("white") && text.includes("denim"))).toBe(true);
  await page.getByRole("searchbox").fill("no-such-outfit");
  await expect(page.getByRole("heading", { name: "No matching outfits." })).toBeVisible();
  await page.getByRole("button", { name: "Clear all filters" }).click();
  await expect(page.getByRole("status")).toHaveText("1,407 references found");
  expect(errors).toEqual([]);
});

test("mobile catalog displays local artwork without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("./");
  await expect(page.getByRole("heading", { name: "Find your inspiration." })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await expect(page.locator(".thumbnail img")).toHaveCount(48);
  await expect.poll(() => page.locator(".thumbnail img").first().evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  await page.getByRole("button", { name: "Swimwear 54" }).click();
  await expect(page.getByRole("status")).toHaveText("54 references found");
  await page.getByRole("searchbox").fill("blue");
  await expect(page.locator(".outfit-card").first()).toBeVisible();
});

test("preview supports keyboard navigation and restores focus", async ({ page }) => {
  await page.goto("./");
  const first = page.getByRole("button", { name: "Preview SPR-0001", exact: true });
  await first.click();
  await expect(page.getByRole("button", { name: "Previous outfit" })).toBeDisabled();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("heading", { name: "SPR-0002", exact: true })).toBeVisible();
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByRole("heading", { name: "SPR-0001", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Close preview" }).click();
  await expect(first).toBeFocused();
});
