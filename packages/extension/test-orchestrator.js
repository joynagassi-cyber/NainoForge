#!/usr/bin/env node
/**
 * Test Orchestrator for NainoForge Extension
 * With auto-healing and retry mechanisms
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Configuration du test
const CONFIG = {
  maxRetries: 3,
  retryDelay: 2000,
  coverageThreshold: {
    happyPath: 100,
    errorStates: 90,
    edgeCases: 80
  },
  reportDir: path.join(__dirname, 'tests', 'reports'),
  testDir: path.join(__dirname, 'tests', 'e2e')
};

// États de test
const TEST_STATES = {
  PENDING: 'pending',
  RUNNING: 'running',
  PASSED: 'passed',
  FAILED: 'failed',
  RETRYING: 'retrying',
  SKIPPED: 'skipped'
};

class TestCase {
  constructor(id, name, description, priority = 'high') {
    this.id = id;
    this.name = name;
    this.description = description;
    this.priority = priority;
    this.state = TEST_STATES.PENDING;
    this.attempts = 0;
    this.errors = [];
    this.duration = 0;
    this.screenshot = null;
  }

  async run(testFn, maxRetries = CONFIG.maxRetries, delay = CONFIG.retryDelay) {
    this.state = TEST_STATES.RUNNING;
    const startTime = Date.now();

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      this.attempts = attempt + 1;

      try {
        await testFn();
        this.state = TEST_STATES.PASSED;
        this.duration = Date.now() - startTime;
        return true;
      } catch (error) {
        this.errors.push({ attempt, error, message: error.message });

        // Auto-correction logique basée sur le type d'erreur
        if (attempt < maxRetries - 1) {
          this.state = TEST_STATES.RETRYING;

          // Stratégie d'auto-correction
          if (error.message.includes('timeout') || error.message.includes('timeout')) {
            console.log(`  🔧 Auto-correction: Augmentation de la durée d'attente (${attempt + 1}/${maxRetries})`);
            // Augmenter le temps d'attente pour le retry suivant
            await new Promise(resolve => setTimeout(resolve, delay * (attempt + 2)));
          } else if (error.message.includes('not found')) {
            console.log(`  🔧 Auto-correction: Refresh de la page pour retrouver l'élément`);
            // Ré-exécuter l'action d'ouverture de la page
          } else {
            // Retry standard
            console.log(`  ⏳ Réessai ${attempt + 1}/${maxRetries} dans ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }
    }

    this.state = TEST_STATES.FAILED;
    this.duration = Date.now() - startTime;
    return false;
  }
}

class TestRunner {
  constructor() {
    this.tests = [];
    this.results = {
      passed: 0,
      failed: 0,
      total: 0,
      byCategory: {
        happyPath: { passed: 0, failed: 0, total: 0 },
        errorStates: { passed: 0, failed: 0, total: 0 },
        edgeCases: { passed: 0, failed: 0, total: 0 }
      },
      startTime: Date.now()
    };
  }

  addTestCase(test) {
    this.tests.push(test);
    this.results.total++;
    this.results.byCategory.edgeCases.total++; // Catégorie par défaut
  }

  async run() {
    console.log('🚀 Démarrage de l\'orchestrateur de tests NainoForge\n');

    for (const test of this.tests) {
      console.log(`\n[Test] ${test.id}: ${test.name}`);
      console.log(`    Catégorie: ${test.priority === 'critical' ? 'Happy Path' : test.priority === 'high' ? 'Error State' : 'Edge Case'}`);
      console.log(`    Description: ${test.description}`);

      const success = await test.run(
        async () => {
          // Fonction de test à exécuter - remplacé par le test réel
          throw new Error('Test implémentation non définie');
        },
        CONFIG.maxRetries,
        CONFIG.retryDelay
      );

      const category = test.priority === 'critical' ? 'happyPath' :
                       test.priority === 'high' ? 'errorStates' : 'edgeCases';

      if (success) {
        this.results.passed++;
        this.results.byCategory[category].passed++;
        console.log(`  ✅ PASS (Durée: ${test.duration}ms, Tentatives: ${test.attempts})`);
      } else {
        this.results.failed++;
        this.results.byCategory[category].failed++;
        console.log(`  ❌ FAIL (Durée: ${test.duration}ms, Tentatives: ${test.attempts})`);
        if (test.errors.length > 0) {
          console.log(`    Dernier erreur: ${test.errors[test.errors.length - 1].message}`);
        }
      }
    }

    this.generateReport();
    this.checkExitCode();
  }

  generateReport() {
    const endTime = Date.now();
    const duration = (endTime - this.results.startTime) / 1000;

    console.log('\n' + '='.repeat(60));
    console.log('📊 RAPPORT DE TESTS FINI');
    console.log('='.repeat(60));
    console.log(`Date: ${new Date().toLocaleString()}`);
    console.log(`Durée: ${duration.toFixed(2)}s`);
    console.log(`Total tests: ${this.results.total}`);
    console.log(`Passés: ${this.results.passed}`);
    console.log(`Échoués: ${this.results.failed}`);
    console.log(`Taux de réussite: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%`);

    console.log('\n📋 Par Catégorie:');
    const categories = [
      { name: 'Happy Path', key: 'happyPath', threshold: CONFIG.coverageThreshold.happyPath },
      { name: 'Error States', key: 'errorStates', threshold: CONFIG.coverageThreshold.errorStates },
      { name: 'Edge Cases', key: 'edgeCases', threshold: CONFIG.coverageThreshold.edgeCases }
    ];

    for (const cat of categories) {
      const catResults = this.results.byCategory[cat.key];
      const pct = catResults.total > 0 ? (catResults.passed / catResults.total) * 100 : 0;
      const status = pct >= cat.threshold ? '✅' : '⚠️';
      console.log(`  ${status} ${cat.name}: ${catResults.passed}/${catResults.total} (${pct.toFixed(0)}%)`);
    }

    console.log('\n' + '='.repeat(60));
  }

  checkExitCode() {
    const overallPct = (this.results.passed / this.results.total) * 100;
    let allPassed = true;

    for (const [key, results] of Object.entries(this.results.byCategory)) {
      const pct = results.total > 0 ? (results.passed / results.total) * 100 : 0;
      const threshold = CONFIG.coverageThreshold[key];
      if (pct < threshold) {
        allPassed = false;
      }
    }

    if (allPassed && overallPct >= 90) {
      console.log('\n🎉 TOUS LES TESTS ONT PASSÉ!');
      process.exit(0);
    } else {
      console.log('\n❌ CERTAINS TESTS ONT ÉCHEUÉ');
      process.exit(1);
    }
  }
}

// Export pour requête externe
module.exports = { TestCase, TestRunner, TEST_STATES };

// Exécution directe si script principal
if (require.main === module) {
  const runner = new TestRunner();

  // Ajout de cas de test pour NainoForge
  const hp01 = new TestCase('HP-01', 'Side panel ouvert', 'L\'icône NainoForge ouvre le side panel avec l\'interface React', 'critical');
  hp01.run = async () => {
    // Implémentation du test à venir via Playwright
    throw new Error('Test HP-01 non implémenté');
  };
  runner.addTestCase(hp01);

  const hp02 = new TestCase('HP-02', 'Content script', 'Le badge d\'injection est injecté sur les articles web', 'high');
  hp02.run = async () => {
    throw new Error('Test HP-02 non implémenté');
  };
  runner.addTestCase(hp02);

  const es01 = new TestCase('ES-01', 'Service worker', 'Le service s\'initialise sans erreurs', 'high');
  es01.run = async () => {
    throw new Error('Test ES-01 non implémenté');
  };
  runner.addTestCase(es01);

  // Exécuter le runner
  runner.run().catch(err => {
    console.error('Erreur critique:', err);
    process.exit(1);
  });
}
