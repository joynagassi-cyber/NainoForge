import { test, expect } from '@playwright/test';

test('extension loads without critical errors', async ({ page }) => {
  // Load the dev server
  await page.goto('http://localhost:3001');

  // Wait for the page to load
  await page.waitForLoadState('networkidle');

  // Collect console messages
  const consoleErrors: string[] = [];
  const consoleWarnings: string[] = [];

  page.on('console', msg => {
    const text = msg.text();
    if (msg.type() === 'error') {
      // Ignore known non-critical errors (like favicon 404)
      if (!text.includes('favicon') && !text.includes('404')) {
        consoleErrors.push(text);
      }
    } else if (msg.type() === 'warning') {
      consoleWarnings.push(text);
    }
  });

  // Wait a bit to catch any async errors
  await page.waitForTimeout(2000);

  // Check that the page has content
  await expect(page.locator('body')).toBeVisible();

  // Check that there are no critical errors
  if (consoleErrors.length > 0) {
    console.error('Critical console errors:', consoleErrors);
  }

  // The extension should load without critical errors
  expect(consoleErrors.length).toBe(0);
});

test('extension renders main components', async ({ page }) => {
  await page.goto('http://localhost:3001');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // Check that the app is rendered
  await expect(page.locator('body')).toBeVisible();

  // Check for key UI elements
  const pageContent = await page.content();

  // At minimum, the app should have some content
  expect(pageContent.length).toBeGreaterThan(100);
});
