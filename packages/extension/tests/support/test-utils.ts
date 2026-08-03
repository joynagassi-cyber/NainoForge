// tests/support/test-utils.ts
import { Page, expect } from '@playwright/test';

export const loadExtension = async (page: Page) => {
  await page.goto('chrome://extensions/');
  await page.click('.extension-item button.action-button');
};

export const waitForNainoForge = async (page: Page) => {
  await page.locator('text=NainoForge').first().waitFor({ state: 'visible', timeout: 5000 });
};

export const clickNainoForgeIcon = async (page: Page) => {
  await page.locator('button.nainoforge-action-button').click();
};

export const waitForSelectorWithRetry = async (page: Page, selector: string, maxRetries = 3) => {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      await page.locator(selector).waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await page.waitForTimeout(1000 * (i + 1));
      }
    }
  }
  throw lastError;
};

export const createTestReport = (testName: string, result: 'passed' | 'failed', details?: any) => {
  const report = {
    testName,
    result,
    timestamp: new Date().toISOString(),
    ...details
  };
  console.log(`[${report.result.toUpperCase()}] ${report.testName}`);
  return report;
};
