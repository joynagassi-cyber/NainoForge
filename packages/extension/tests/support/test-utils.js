export const loadExtension = async (page) => {
    await page.goto('chrome://extensions/');
    await page.click('.extension-item button.action-button');
};
export const waitForNainoForge = async (page) => {
    await page.locator('text=NainoForge').first().waitFor({ state: 'visible', timeout: 5000 });
};
export const clickNainoForgeIcon = async (page) => {
    await page.locator('button.nainoforge-action-button').click();
};
export const waitForSelectorWithRetry = async (page, selector, maxRetries = 3) => {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
        try {
            await page.locator(selector).waitFor({ state: 'visible', timeout: 5000 });
            return true;
        }
        catch (error) {
            lastError = error;
            if (i < maxRetries - 1) {
                await page.waitForTimeout(1000 * (i + 1));
            }
        }
    }
    throw lastError;
};
export const createTestReport = (testName, result, details) => {
    const report = {
        testName,
        result,
        timestamp: new Date().toISOString(),
        ...details
    };
    console.log(`[${report.result.toUpperCase()}] ${report.testName}`);
    return report;
};
//# sourceMappingURL=test-utils.js.map