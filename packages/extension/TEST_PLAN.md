# Test Plan - NainoForge Extension
## Système de test agentique avec auto-correction

---

## 1. Objectif
Déployer un framework de test automatisé avec boucle d'auto-correction pour valider toutes les fonctionnalités de l'extension NainoForge.

---

## 2. Fonctionnalités à tester

### 🟢 Happy Path (Cours normal)
| ID | Fonctionnalité | Description | Priorité |
|----|---------------|-------------|----------|
| HP-01 | Side panel ouvert | L'icône N ouvre le side panel avec l'interface React | Critical |
| HP-02 | Content script | Le badge d'injection est injecté sur les articles | High |
| HP-03 | Changement d'onglet | Navigation Home/Review/Cosmos via les boutons | High |
| HP-04 | Mode App | Le bouton ↗ ouvre le mode plein écran | Medium |
| HP-05 | Toast notifications | Les messages s'affichent et se ferment automatiquement | Medium |
| HP-06 | Transitions animées | Les changements d'onglet ont des animations fluides | Medium |

### 🔴 Error States (États d'erreur)
| ID | Scénario | Description | Priorité |
|----|----------|-------------|----------|
| ES-01 | Service worker | Le service worker doit s'initialiser sans erreur | High |
| ES-02 | Content script échec | Handling des erreurs dans content.js | High |
| ES-03 | React erreur | Handling des exceptions React dans le popup | Medium |

### 🟡 Edge Cases (Cas limites)
| ID | Scénario | Description | Priorité |
|----|----------|-------------|----------|
| EC-01 | Page sans article | Le side panel fonctionne sans badge d'injection | Low |
| EC-02 | Nombre élevé de concepts | Performance du graphe COSMOS avec +100 nœuds | Medium |
| EC-03 | Mémoire | Gestion de la mémoire sur des sessions longues | Medium |

---

## 3. Planification des tests

### Jour 1: Tests E2E Fondamentaux (Playwright)
- **09:00-11:00** - Setup de l'environnement de test
  - Installation de Playwright
  - Configuration de l'automatisation
  - Creation des fichiers de test de base
- **11:00-13:00** - Tests HP-01, HP-02, ES-01
  - Vérification du side panel
  - Vérification du content script
  - Vérification du service worker
- **14:00-16:00** - Tests HP-03, HP-04
  - Navigation entre onglets
  - Mode App
- **16:00-17:00** - Premier rapport et auto-correction

### Jour 2: Tests avancés et couverture
- **09:00-11:00** - Tests HP-05, HP-06
  - Toasts et animations
- **11:00-13:00** - Tests ES-02, ES-03
  - Handling d'erreurs
- **14:00-16:00** - Tests EC-01, EC-02, EC-03
  - Edge cases et performance
- **16:00-17:00** - Boucle d'auto-correction finale

### Jour 3: Intégration CI/CD
- **09:00-11:00** - Configuration GitHub Actions
- **11:00-13:00** - Pipeline de test automatisé
- **14:00-16:00** - Tests sur plusieurs versions de Chrome
- **16:00-17:00** - Rapport final de test

---

## 4. Architecture du système de test

### Structure des fichiers
```
packages/extension/
├── tests/
│   ├── e2e/
│   │   ├── hp-01-sidepanel.spec.ts
│   │   ├── hp-02-content-script.spec.ts
│   │   ├── hp-03-navigation.spec.ts
│   │   ├── hp-04-app-mode.spec.ts
│   │   ├── es-01-service-worker.spec.ts
│   │   ├── ec-01-edge-cases.spec.ts
│   │   └── test-orchestrator.ts
│   └── support/
│       ├── test-utils.ts
│       └── auto-heal.plugin.ts
├── test-orchestrator.config.json
├── test-orchestrator.js
├── package.json (scripts de test)
└── playwright.config.ts
```

### Fichiers clés

#### `test-orchestrator.config.json`
```json
{
  "project": "NainoForge",
  "testFramework": "Playwright",
  "autoHeal": true,
  "maxRetries": 3,
  "retryDelay": 2000,
  "coverageThreshold": {
    "happyPath": 100,
    "errorStates": 90,
    "edgeCases": 80
  }
}
```

#### `tests/support/test-utils.ts`
```typescript
import { Page } from '@playwright/test';

// Utils pour les tests NainoForge
export const loadExtension = async (page: Page) => {
  await page.goto('chrome://extensions/');
  await page.click('#options-0 input[type="checkbox"]');
};

export const waitForNainoForge = async (page: Page) => {
  await page.locator('text=NainoForge').first().waitFor({ state: 'visible' });
};

export const clickNainoForgeIcon = async (page: Page) => {
  await page.click('button#nainoforge-extension-icon');
};
```

#### `tests/e2e/hp-01-sidepanel.spec.ts`
```typescript
import { test, expect } from '@playwright/test';
import { loadExtension, waitForNainoForge, clickNainoForgeIcon } from '../support/test-utils';

test('HP-01: Side panel s\'ouvre correctement', async ({ page }) => {
  await loadExtension(page);
  
  await page.goto('https://www.wikipedia.org');
  await waitForNainoForge(page);
  
  // Ouvrir le side panel
  await clickNainoForgeIcon(page);
  
  // Vérifier le rendu
  await expect(page.locator('#root')).toBeVisible();
  await expect(page.locator('text=Vue d\'ensemble')).toBeVisible();
});
```

---

## 5. Système d'auto-correction

### Stratégie de retry (exponential backoff)

```javascript
async function runWithRetry(testFn, maxRetries = 3, baseDelay = 2000) {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await testFn();
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}
```

### Types d'auto-correction

| Type de problème | Stratégie d'auto-correction |
|-----------------|----------------------------|
| Timeout d'élément | Retry + durée d'attente augmentée |
| Element not found | Refresh page + re-rendre |
| Network error | Retry avec backoff exponentiel |
| Element stale | Retrouver l'élément dans le DOM |
| Test transient | Exécuter 2-3 fois consécutif |

---

## 6. Reporting

### Format de rapport quotidien (Markdown)
```markdown
# 📊 Rapport de Tests NainoForge - Jour [X]

## Résumé

| Catégorie | Tests | Passés | Fail | Taux |
|-----------|-------|--------|------|------|
| Happy Path | [X] | [X] | [X] | [XX]% |
| Error States | [X] | [X] | [X] | [XX]% |
| Edge Cases | [X] | [X] | [X] | [XX]% |
| **Total** | **[X]** | **[X]** | **[X]** | **[XX]%** |

## Tests exécutés

### ✅ Passés
- HP-01: Side panel - OK
- HP-02: Content script - OK
- ES-01: Service worker - OK

### ⚠️ En cours d'auto-correction
- EC-02: Grand nombre de concepts - [Retry 1/3 en cours...]

### ❌ Échoués
- Aucun

## Prochaines étapes
- [ ] Finaliser l'optimisation du rendu COSMOS
- [ ] Exécuter tests sur Firefox
- [ ] Intégrer au CI/CD
```

---

## 7. Validation de succès

### Critères de passage (Exit Criteria)
- [ ] Tous les tests Happy Path: 100% passés
- [ ] Tous les tests Error States: ≥90% passés
- [ ] Tous les tests Edge Cases: ≥80% passés
- [ ] Pas de crash du service worker
- [ ] Pas d'erreurs console critiques dans le popup
- [ ] Temps de chargement side panel < 2s
- [ ] Mémoire < 200MB après 10 min d'utilisation

---

## 8. Demande de démarrage

**Pour démarrer l'exécution des tests:**

```bash
# 1. Initialiser l'environnement de test
cd packages/extension
pnpm install -D @playwright-test playwright

# 2. Exécuter les tests de base
pnpm test:e2e

# 3. Lancer l'orchestrateur avec auto-correction
node test-orchestrator.js --auto-heal --max-retries=3

# 4. Visualiser les rapports
npx playwright show-report
```

**Je démarre maintenant l'implémentation du système de test complet. Voulez-vous que je commence par :**

1. [ ] Créer tous les fichiers de test E2E
2. [ ] Configurer l'orchestrateur de test avec auto-correction
3. [ ] Mettre en place le reporting automatisé
4. [ ] Configurer le CI/CD pour GitHub Actions

Choisissez l'option de démarrage ou validez l'ensemble du plan 🚀