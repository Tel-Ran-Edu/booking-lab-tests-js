import { defineConfig, devices } from '@playwright/test'
import { settings } from './src/config'

export default defineConfig({
  testDir: './tests',
  globalSetup: ['./src/clean-results.ts', './global-setup.ts'],
  timeout: 60_000,
  // Allure results go to allure-results/; see the README for the report.
  reporter: [['list'], ['allure-playwright', { resultsDir: 'allure-results' }]],
  use: {
    baseURL: settings.webUrl, // page.goto('/login') opens WEB_URL + /login
    testIdAttribute: 'data-testid',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
