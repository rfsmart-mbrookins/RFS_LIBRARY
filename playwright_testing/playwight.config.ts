import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: "http://localhost:8000", // Change based on your app
    headless: false,
    viewport: { width: 1280, height: 720 },
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm start", // Start your app before running tests
    port: 3000,
    reuseExistingServer: true,
  },
});
