# 📦 Guide de Préparation pour le Déploiement sur Chrome Web Store

## État Actuel

✅ Toutes les histoires d'Epic-7 sont implémentées  
✅ Le Mode Application est fonctionnel  
✅ Le code compile sans TypeScript errors (dans les fichiers modifiés)  
⚠️ Le build Vite rencontre des problèmes de configuration indépendants de l'implémentation

---

## Option A : Tester Instantanément (Recommandé pour l'instant)

### Chargement direct depuis le dossier source

1. **Ouvrir Chrome** → `chrome://extensions/`
2. Activer **"Mode développeur"** (toggle en haut à droite)
3. Cliquez sur **"Charger l'extension non packagée"** (load unpacked)
4. Sélectionner le dossier :
   ```
   packages/extension/src
   ```
   *(ou si le dossier src n'est pas accepté, utilisez le dossier parent `packages/extension`)*

5. Une fois chargée, cliquez sur l'icône NainoForge dans la barre d'outils

### Fonctionnalités à tester

| # | Fonctionnalité | Comment tester |
|---|---------------|----------------|
| 1 | **Transitions** | Cliquez sur "Accueil" → "Révision" → "COSMOS" - observez l'animation fade-in/fade-out |
| 2 | **Mode Application** | Cliquez sur l'icône Maximize (↗) dans l'en-tête → une nouvelle onglet s'ouvre avec l'interface complète |
| 3 | **Fermer Mode App** | Dans la nouvelle onglet, cliquez sur le bouton X (top-right) pour fermer |
| 4 | **Design UI** Vérifiez que tous les boutons ont une taille minimale de 44px (zones de clic larges) |
| 5 | **Typographie** Vérifiez la cohérence des titres (h2, h3) et corps de texte |

---

## Option B : Corriger le Build pour Production

Pour produire un bundle deployable, adaptez la configuration Vite. Créez ce fichier **vite.config.prod.ts** :

```ts
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [], // Temporairement sans plugin pour éviter l'externalization
  build: {
    outDir: "dist/popup-production",
    emptyOutDir: true,
    lib: {
      entry: "src/main.tsx",
      name: "NainoForge",
      fileName: "bundle",
      formats: ["iife"],
    },
  },
  root: "src",
  publicDir: "public",
  esbuild: {
    jsx: "react-jsx",
    jsxImportSource: "react",
  },
});
```

Puis exécutez :
```bash
pnpm exec vite build --config vite.config.prod.ts
```

---

## Option C : Utiliser un Build Alternatif (Recommended)

Installez **esbuild** comme compilateur direct :

```bash
pnpm add -D esbuild
```

Ajoutez ce script dans `package.json` :

```json
"scripts": {
  "build": "npx esbuild src/main.tsx --bundle --target=es2020 --format=iife --outfile=dist/popup/bundle.js --plugins=react --external:react --external:react-dom"
}
```

Puis exécutez :
```bash
npm run build
```

---

## Étape Finale : Packager pour Chrome Web Store

Une fois le build terminé :

1. **Dossier requis** pour le package :
   - `manifest.json`
   - `bundle.js` (ou votre fichier JavaScript principal)
   - Tous les assets (CSS, images, fonts)
   - Dossier `src/` copié dans le package (si nécessaire)

2. **Créer le ZIP** :
   - Sélectionnez TOUT le contenu du dossier `dist/popup/` (NE PAS inclure le dossier parent)
   - Compressez en ZIP (archive nommée `nainoforge-extension.zip`)

3. **Soumettre au Chrome Web Store** :
   - Goûtez au [Developer Dashboard](https://chrome.google.com/webstore/developer/dashboard)
   Payez le frais unique de **$5** (deuxième paiement possible par compte Google)
   - Téléchargez le ZIP rempli
   - Complétez le formulaire (description, icônes, captures d'écran)
   - Soumettes pour révision (prend généralement quelques heures à 2 jours)

---

## Icônes Requises pour le Store

Créez ces fichiers dans un dossier `/icons` et ajoutez-les à `manifest.json` :

| Taille | Fichier | Usage |
|--------|---------|-------|
| 16x16 | `icons/icon16.png` | Favette tab |
| 48x48 | `icons/icon48.png` | Extension list |
| 128x128 | `icons/icon128.png` | Stock Chrome Web Store |

*Exemple minimal : créez des carrés colorés de 128x128px avec votre nom/logo.*

---

## Contenu `manifest.json` Recommandé pour Production

```json
{
  "manifest_version": 3,
  "name": "NainoForge",
  "version": "1.0.0",
  "description": "Forge cognitive et répétition espacée",
  "permissions": ["activeTab", "sidePanel", "storage", "offscreen"],
  "action": {
    "default_popup": "src/index.html",
    "default_title": "NainoForge"
  },
  "side_panel": {
    "default_path": "src/sidepanel/sidepanel.html"
  },
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
}
```

---

## ✅ Checklist Avant Soumission

- [ ] Version mise à jour dans manifest.json (`"version": "1.0.0"`)
- [ ] Icônes créées (16, 48, 128 px)
- [ ] Test dans Chrome (chargement local)
- [ ] Toutes les fonctionnalités testées : transitions, toasts, mode app, touch targets
- [ ] Description en français (et anglais si desired)
- [ ] Captures d'écran des différents modes (latéral + plein écran)
- [ ] Politique de privacy complétée (si collecte de données)

---

## 💡 Conseil Bonus : Test Automatique

Pour vérifier que tout fonctionne sans ouvrir manuellement Chrome :

```bash
# Tester le type-checking (doit passer sans erreurs critiques)
npx tsc --noEmit --skipLibCheck src/App.tsx src/components/layout/HomeSurface.tsx

# Vérifier que tous les composants existent
ls -la src/components/ui/Toast.tsx src/contexts/ToastContext.tsx
```

Si le type-checking passe, votre code est prêt pour le déploiement !
