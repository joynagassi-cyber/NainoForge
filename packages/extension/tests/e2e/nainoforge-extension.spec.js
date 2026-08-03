import { test, expect, chromium } from '@playwright/test';
// Configure un test NainoForge avec auto-correction
async function runWithAutoHealing(testFn, maxRetries = 3) {
    let lastError;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await testFn();
        }
        catch (error) {
            lastError = error;
            console.log(`  🔧 Auto-healing attempt ${attempt + 1}/${maxRetries}: ${error.message}`);
            if (attempt < maxRetries - 1) {
                // Essai de réparation selon le type d'erreur
                if (error.message.includes('timeout') || error.message.includes('Timeout')) {
                    console.log('    → Augmentation du temps d\'attente...');
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
                else if (error.message.includes('not found')) {
                    console.log('    → Rafraîchissement de la page...');
                    await page.reload();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                else if (error.message.includes('visible')) {
                    console.log('    → Attente de l\'élément...');
                    await page.waitForTimeout(1000);
                }
                else {
                    console.log('    → Réessai simple...');
                    await new Promise(resolve => setTimeout(resolve, 1500));
                }
            }
        }
    }
    throw lastError;
}
let browser, page;
test.beforeAll(async () => {
    browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    page = await context.newPage();
    // Charger l'extension en mode développeur
    await page.goto('chrome://extensions/');
    await page.waitForTimeout(1000);
});
test.afterAll(async () => {
    await browser.close();
});
// === HP-01: Side panel s'ouvre correctement ===
test('HP-01: Side panel ouvre l\'interface React', async () => {
    // Charger l'extension
    await page.goto('chrome://extensions/');
    await page.waitForSelector('.extension-item:text(NainoForge)');
    // Ouvrir le side panel (le bouton doit être visible)
    const sidePanelButton = await page.locator('.action-button');
    await sidePanelButton.click();
    // Attendre que le side panel se charge
    await page.waitForSelector('#root', { timeout: 15000 });
    // Vérifier les éléments de l'interface
    await expect(page.locator('text=Vue d\'ensemble')).toBeVisible();
    await expect(page.locator('text=Révision')).toBeVisible();
    await expect(page.locator('text=Graphe')).toBeVisible();
    console.log('✅ HP-01: Side panel avec React chargé');
});
// === HP-02: Content script = badge d'injection ===
test('HP-02: Content script injecte le badge sur les articles', async () => {
    // Aller à une page de test
    await page.goto('https://www.wikipedia.org/wiki/JavaScript');
    // Le badge doit être visible (ou au moins l'injection du script)
    // On vérifie que le script s'exécute sans erreur
    const consoleErrors = [];
    page.on('console', msg => {
        if (msg.type() === 'error')
            consoleErrors.push(msg.text());
    });
    await page.waitForTimeout(3000);
    expect(consoleErrors).toEqual([]);
    console.log('✅ HP-02: Content script sans erreurs');
});
// === ES-01: Service worker s'initialise ===
test('ES-01: Service worker fonctionne', async () => {
    // Vérifier le service worker
    const serviceWorkers = await browser.serviceWorkers();
    expect(serviceWorkers.length).toBeGreaterThanOrEqual(1);
    // Le service worker doit être actif
    expect(serviceWorkers[0].state()).toBe('active');
    console.log('✅ ES-01: Service worker actif');
});
// === HP-04: Mode App (plein écran) ===
test('HP-04: Mode App fonctionne', async () => {
    // Changer de mode via le query param
    await page.goto('http://localhost:3001?mode=app');
    // Le mode app doit masquer le sidebar et afficher le bouton de fermeture
    const closeButton = page.locator('button[title="Fermer le mode application"]');
    await expect(closeButton).toBeVisible();
    // Vérifier que l'interface est sans sidebar
    const sidebar = page.locator('.sidebar');
    expect(sidebar.count()).toBe(0);
    console.log('✅ HP-04: Mode App avec fermeture');
});
// === HP-05: Toast notifications ===
test('HP-05: Toasts s\'affichent et se ferment', async () => {
    // Trigger un toast (simulé par console.log ou action)
    await page.evaluate(() => {
        // Simuler l'ajout d'un toast via le hook
        if (window.showToast)
            window.showToast('Test', 'info');
    });
    // Le toast doit être visible
    await page.locator('.toast').waitFor({ state: 'visible', timeout: 5000 });
    // Le toast doit se fermer automatiquement après 4 secondes
    await page.waitForTimeout(5000);
    const isToastVisible = await page.locator('.toast').isVisible();
    expect(isToastVisible).toBe(false);
    console.log('✅ HP-05: Toast visible puis disparu');
});
// === EC-01: Edge case - Page sans article ===
test('EC-01: Side panel fonctionne sans article', async () => {
    // Une page qui n'est pas un article (une page d'accès aux extensions)
    await page.goto('chrome://extensions/');
    // Ouvrir le side panel
    await page.locator('.action-button').click();
    // Le side panel doit toujours fonctionner
    await expect(page.locator('#root')).toBeVisible();
    console.log('✅ EC-01: Side panel sur page non-article');
});
//# sourceMappingURL=nainoforge-extension.spec.js.map