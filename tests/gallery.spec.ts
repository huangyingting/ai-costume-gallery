import { expect, test } from "@playwright/test";
import catalog from "../gallery.json";
import { translateKeywords } from "../app/keywords";

test("catalog filters, search, pagination and original links work under the Pages base path", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("./");
  await expect(page.getByRole("heading", { name: /一间衣橱，\s*无限灵感。/ })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  await expect(page).toHaveTitle("衣装灵感库 | AI 服装参考图库");
  await expect(page.getByRole("status")).toHaveText("找到 1,407 套服装");
  await expect(page.locator(".outfit-card")).toHaveCount(48);
  await page.getByRole("button", { name: "发现更多" }).click();
  await expect(page.locator(".outfit-card")).toHaveCount(96);
  await page.getByRole("button", { name: "冬季 253" }).click();
  await expect(page.getByRole("status")).toHaveText("找到 253 套服装");
  await expect(page.locator(".outfit-card")).toHaveCount(48);
  await expect(page.locator(".outfit-card").first()).toContainText("冬季");
  await page.getByRole("button", { name: "全部服装" }).click();
  await page.getByRole("searchbox").fill("SPR-0001");
  await expect(page.getByRole("status")).toHaveText("找到 1 套服装");
  await page.getByRole("button", { name: "预览 SPR-0001", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog").locator("img")).toHaveAttribute("src", "/ai-costume-gallery/img/SPR-0001.webp");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.getByRole("link", { name: "打开 SPR-0001 的 PNG 原图" })).toHaveAttribute("href", "https://ai-costume-gallery.pages.dev/png/SPR-0001.png");
  await page.getByRole("searchbox").fill("white denim");
  await expect(page.locator(".outfit-card").first()).toBeVisible();
  const descriptions = await page.locator(".outfit-card h3").allTextContents();
  expect(descriptions.every((text) => text.includes("白色") && text.includes("牛仔"))).toBe(true);
  await page.getByRole("searchbox").fill("白色 牛仔");
  await expect(page.locator(".outfit-card").first()).toContainText("SPR-0001");
  const chineseDescriptions = await page.locator(".outfit-card h3").allTextContents();
  expect(chineseDescriptions.every((text) => text.includes("白色") && text.includes("牛仔"))).toBe(true);
  await page.getByRole("searchbox").fill("no-such-outfit");
  await expect(page.getByRole("heading", { name: "没有找到匹配的服装。" })).toBeVisible();
  await page.getByRole("button", { name: "清除所有筛选" }).click();
  await expect(page.getByRole("status")).toHaveText("找到 1,407 套服装");
  expect(errors).toEqual([]);
});

test("mobile catalog displays local artwork without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("./");
  await expect(page.getByRole("heading", { name: "寻找你的穿搭灵感。" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await expect(page.locator(".thumbnail img")).toHaveCount(48);
  await expect.poll(() => page.locator(".thumbnail img").first().evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  await page.getByRole("button", { name: "泳装 54" }).click();
  await expect(page.getByRole("status")).toHaveText("找到 54 套服装");
  await page.getByRole("searchbox").fill("blue");
  await expect(page.locator(".outfit-card").first()).toBeVisible();
});

test("preview supports keyboard navigation and restores focus", async ({ page }) => {
  await page.goto("./");
  const first = page.getByRole("button", { name: "预览 SPR-0001", exact: true });
  await first.click();
  await expect(page.getByRole("button", { name: "上一套服装" })).toBeDisabled();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("heading", { name: "SPR-0002", exact: true })).toBeVisible();
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByRole("heading", { name: "SPR-0001", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "关闭预览" }).click();
  await expect(first).toBeFocused();
});

test("all outfit descriptions are translated into Chinese", () => {
  for (const entry of catalog.entries) {
    expect(translateKeywords(entry.キーワード), entry.id).not.toMatch(/[a-z]/i);
  }
});
