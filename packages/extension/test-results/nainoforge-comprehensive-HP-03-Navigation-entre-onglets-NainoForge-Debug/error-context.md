# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: nainoforge-comprehensive.spec.ts >> HP-03: Navigation entre onglets
- Location: tests\e2e\nainoforge-comprehensive.spec.ts:62:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.hover: Target page, context or browser has been closed
Call log:
  - waiting for locator('text=NainoForge').first()

```

```
"afterAll" hook timeout of 30000ms exceeded.
```

# Test source

```ts
  1   | import { test, expect, chromium, Page, BrowserContext } from '@playwright/test';
  2   | import { waitForSelectorWithRetry, createTestReport } from '../support/test-utils';
  3   | 
  4   | let page: Page;
  5   | let browser: any;
  6   | 
  7   | test.beforeAll(async () => {
  8   |   browser = await chromium.launch({ headless: false });
  9   |   page = await browser.newPage();
  10  | });
  11  | 
> 12  | test.afterAll(async () => {
      |      ^ "afterAll" hook timeout of 30000ms exceeded.
  13  |   await browser.close();
  14  | });
  15  | 
  16  | // ================== HAPPY PATH TESTS ==================
  17  | 
  18  | // HP-01: Side panel s'ouvre
  19  | test('HP-01: Side panel ouvre l\'interface React', async () => {
  20  |   try {
  21  |     await test.step('HP-01: Ouvrir le side panel', async () => {
  22  |       await page.goto('https://www.wikipedia.org');
  23  |       await page.waitForTimeout(2000);
  24  |       await page.locator('text=NainoForge').first().hover();
  25  |       await page.click('text=Ouvrir le panneau latéral');
  26  |       await waitForSelectorWithRetry(page, '#root', 3);
  27  |     });
  28  | 
  29  |     await expect(page.locator('text="Vue d\'ensemble"')).toBeVisible();
  30  |     await expect(page.locator('text="Révision"')).toBeVisible();
  31  |     await expect(page.locator('text="Graphe"')).toBeVisible();
  32  | 
  33  |     console.log('✅ HP-01: Side panel React chargé');
  34  |   } catch (error) {
  35  |     console.error('❌ HP-01 échoué:', error.message);
  36  |     throw error;
  37  |   }
  38  | });
  39  | 
  40  | // HP-02: Content script
  41  | test('HP-02: Content script injecte le badge sur les articles', async () => {
  42  |   try {
  43  |     await test.step('HP-02: Content script', async () => {
  44  |       await page.goto('https://www.wikipedia.org/wiki/JavaScript');
  45  |       await page.waitForTimeout(3000);
  46  | 
  47  |       const errors: string[] = [];
  48  |       page.on('console', msg => {
  49  |         if (msg.type() === 'error') errors.push(msg.text());
  50  |       });
  51  | 
  52  |       expect(errors).toHaveLength(0);
  53  |       console.log('✅ HP-02: Content script sans erreurs');
  54  |     });
  55  |   } catch (error) {
  56  |     console.error('❌ HP-02 échoué:', error.message);
  57  |     throw error;
  58  |   }
  59  | });
  60  | 
  61  | // HP-03: Changement d'onglet
  62  | test('HP-03: Navigation entre onglets', async () => {
  63  |   try {
  64  |     await test.step('HP-03: Navigation', async () => {
  65  |       await page.goto('https://www.wikipedia.org');
  66  |       await page.waitForTimeout(2000);
  67  |       await page.locator('text=NainoForge').first().hover();
  68  |       await page.click('text=Ouvrir le panneau latéral');
  69  |       await waitForSelectorWithRetry(page, '#root', 3);
  70  |       await expect(page.locator('text="Vue d\'ensemble"')).toBeVisible();
  71  | 
  72  |       // Cliquer sur Révision
  73  |       await page.locator('text="Révision"').click();
  74  |       await waitForSelectorWithRetry(page, 'text="Révision"', 3);
  75  | 
  76  |       // Cliquer sur Graphe
  77  |       await page.locator('text="Graphe"').click();
  78  |       await waitForSelectorWithRetry(page, 'svg', 3);
  79  |       await expect(page.locator('svg')).toBeVisible();
  80  | 
  81  |       console.log('✅ HP-03: Navigation entre onglets OK');
  82  |     });
  83  |   } catch (error) {
  84  |     console.error('❌ HP-03 échoué:', error.message);
  85  |     throw error;
  86  |   }
  87  | });
  88  | 
  89  | // HP-04: Mode App
  90  | test('HP-04: Mode App (plein écran)', async () => {
  91  |   try {
  92  |     await test.step('HP-04: Mode App', async () => {
  93  |       // Pour le mode app, on ouvre un nouveau popup
  94  |       await page.goto('http://localhost:3001?mode=app');
  95  |       await page.waitForTimeout(2000);
  96  | 
  97  |       const closeButton = page.locator('button[title="Fermer le mode application"]');
  98  |       await expect(closeButton).toBeVisible();
  99  | 
  100 |       console.log('✅ HP-04: Mode App avec fermeture');
  101 |     });
  102 |   } catch (error) {
  103 |     console.error('❌ HP-04 échoué:', error.message);
  104 |     throw error;
  105 |   }
  106 | });
  107 | 
  108 | // HP-05: Toasts
  109 | test('HP-05: Toasts notifications', async () => {
  110 |   try {
  111 |     await test.step('HP-05: Toasts', async () => {
  112 |       await page.goto('https://www.wikipedia.org');
```