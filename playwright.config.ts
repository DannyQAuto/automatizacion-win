import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './test/specs',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['allure-playwright', {
      detail: true,
      outputFolder: 'allure-results',
      suiteTitle: false
    }]
  ],
  use: {
    trace: 'on-first-retry',
    screenshot: 'on',
    video: 'on',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        channel: 'chrome',
        viewport: null,
        video: {
          mode: 'on',
          size: { width: 1920, height: 1080 }
        },
        launchOptions: {
          slowMo: 1000,
          headless: false,
          args: [
            '--start-maximized'
          ]
        }
      },
    }
  ],

  timeout: 300000,
  outputDir: 'test-results/',
});