#!/usr/bin/env node
/**
 * NainoForge Test Runner avec auto-correction
 * Exécute les tests E2E en boucle jusqu'à réussite
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const MAX_RETRIES = 3;
const REPORT_DIR = path.join(__dirname, 'tests', 'reports');

// Créer le dossier de rapport
fs.mkdirSync(REPORT_DIR, { recursive: true });

async function runTestWithRetry(attempt = 1) {
  console.log(`\n🔄 Tentative ${attempt}/${MAX_RETRIES}...`);

  try {
    // Lancer les tests Playwright
    console.log('\n▶️ Exécution des tests E2E...');
    const result = execSync('pnpm test:e2e --workers=1 --reporter=line', {
      encoding: 'utf-8',
      timeout: 180000
    });

    console.log('\n✅ Tests exécutés avec succès!');
    console.log(result);

    // Créer un rapport de succès
    const report = {
      attempt,
      status: 'passed',
      timestamp: new Date().toISOString(),
      message: 'Tous les tests ont passé'
    };
    fs.writeFileSync(path.join(REPORT_DIR, `test-run-${attempt}.json`), JSON.stringify(report, null, 2));

    return true;
  } catch (error) {
    console.log(`\n❌ Échec de la tentative ${attempt}: ${error.message}`);

    if (attempt >= MAX_RETRIES) {
      // Dernière tentative, créer rapport d'échec
      const report = {
        attempt: MAX_RETRIES,
        status: 'failed',
        timestamp: new Date().toISOString(),
        error: error.message
      };
      fs.writeFileSync(path.join(REPORT_DIR, `test-run-failed.json`), JSON.stringify(report, null, 2));
      console.log('\n❌ Échec après ' + MAX_RETRIES + ' tentatives');
      return false;
    }

    // Attente avant le retry (backoff exponentiel)
    const delay = Math.pow(2, attempt) * 1000;
    console.log(`   ⏳ Attente de ${delay}ms avant le prochain retry...`);
    await new Promise(resolve => setTimeout(resolve, delay));

    // Nettoyage entre les tentatives
    console.log('   🧹 Nettoyage entre les tentatives...');
    // On pourrait arrêter/re-démarrer le serveur ici
  }
}

// Point d'entrée principal
async function main() {
  console.log('='.repeat(60));
  console.log('🧠 TEST ORCHESTRATOR NAINOFORGE - Avec auto-correction');
  console.log('='.repeat(60));
  console.log(`Date: ${new Date().toLocaleString()}`);
  console.log(`Max retries: ${MAX_RETRIES}`);
  console.log(`Working dir: ${__dirname}`);
  console.log('='.repeat(60));

  // Vérifier que l'extension est buildée
  const manifestPath = path.join(__dirname, 'dist', 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    console.log('⚠️  Warning: dist/manifest.json non trouvé. Ré-exécuter le build...');
    try {
      execSync('pnpm build', { stdio: 'inherit' });
    } catch (e) {
      console.error('Erreur lors du build:', e);
    }
  }

  // Exécuter les tests avec retry
  const success = await runTestWithRetry();

  // Rapport final
  console.log('\n' + '='.repeat(60));
  if (success) {
    console.log('🎉 TOUS LES TESTS ONT PASSÉ! Extension fonctionnelle ✅');
  } else {
    console.log('❌ CERTAINS TESTS ONT ÉCHEUÉ. Vérifiez les logs.');
  }
  console.log('='.repeat(60));

  process.exit(success ? 0 : 1);
}

main().catch(err => {
  console.error('Erreur catastrophique:', err);
  process.exit(1);
});
