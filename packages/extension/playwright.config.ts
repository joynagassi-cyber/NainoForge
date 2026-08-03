import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  use: {
    baseURL: 'http://localhost:3001',
    headless: false, // Crucial pour les tests d'extension Chrome
    browserName: 'chromium',
    channel: 'chrome', // Utiliser Chrome système
    // Capture des traces pour le debugging
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'NainoForge-Debug',
      use: {
        browserName: 'chromium',
        channel: 'chrome',
        headless: false,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
      },
    },
  ],
  webServer: {
    command: 'pnpm vite --port 3001 --strictPort --host 0.0.0.0',
    port: 3001,
    timeout: 120000,
    reuseExistingServer: true,
  },
  reporter: [
    ['list'],
    ['dot'],
    ['json', { outputFile: 'tests/reports/test-results.json' }],
  ],
});
