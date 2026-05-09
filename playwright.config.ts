import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  use: {
    baseURL: "http://localhost:3107",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run dev -- --port 3107",
    reuseExistingServer: true,
    timeout: 60_000,
    url: "http://localhost:3107",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 7"] },
    },
  ],
});
