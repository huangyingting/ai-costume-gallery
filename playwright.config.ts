import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: "http://127.0.0.1:43719/ai-costume-gallery/",
    browserName: "chromium",
    launchOptions: process.env.CI ? {} : { executablePath: "/usr/bin/google-chrome", args: ["--no-sandbox"] },
  },
  webServer: {
    command: "node scripts/serve.mjs",
    url: "http://127.0.0.1:43719/ai-costume-gallery/",
    reuseExistingServer: false,
  },
});
