// tests/support/auto-heal.plugin.js
// Plugin d'auto-réparation pour Playwright

class AutoHealPlugin {
  constructor(config) {
    this.config = config;
    this.repairActions = {
      'element not found': { maxAttempts: 3, strategy: 'reload' },
      'timeout': { maxAttempts: 3, strategy: 'wait' },
      'element invisible': { maxAttempts: 3, strategy: 'scroll' },
      'network error': { maxAttempts: 3, strategy: 'retry' }
    };
  }

  async onTestBegin(test) {
    // Initialiser le state de réparation pour ce test
    test.healAttempt = 0;
    test.lastRepair = null;
  }

  async onTestEnd(test, result) {
    if (result.status === 'failed' && test.healAttempt < 3) {
      // Tenter une réparation
      await this.healTest(test);
      test.healAttempt++;
    }
  }

  async healTest(test) {
    const lastError = test.errors?.[test.errors.length - 1];
    if (!lastError) return;

    const errorType = this.detectErrorType(lastError.message);
    const strategy = this.repairActions[errorType]?.strategy || 'retry';

    console.log(`🔧 Auto-healing: ${errorType} - Méthode: ${strategy}`);

    switch (strategy) {
      case 'reload':
        await test.page.reload();
        break;
      case 'wait':
        await test.page.waitForTimeout(2000);
        break;
      case 'scroll':
        await test.page.evaluate(() => {
          window.scrollTo(0, 0);
        });
        break;
      case 'retry':
        // Re-exécuter simplement
        break;
    }

    test.lastRepair = { strategy, timestamp: new Date().toISOString() };
  }

  detectErrorType(message) {
    const lower = message.toLowerCase();
    if (lower.includes('timeout') || lower.includes('time out')) return 'timeout';
    if (lower.includes('not found') || lower.includes("can't find")) return 'element not found';
    if (lower.includes('invisible') || lower.includes('not visible')) return 'element invisible';
    if (lower.includes('network') || lower.includes('error')) return 'network error';
    if (lower.includes('element') && lower.includes('is')) return 'element error';
    return 'unknown';
  }
}

module.exports = AutoHealPlugin;
