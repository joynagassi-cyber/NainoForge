---
title: 'Initialiser le monorepo NainoForge et le squelette Chrome MV3'
type: 'chore'
created: '2026-07-10T16:21:02+01:00'
status: 'in-progress'
baseline_commit: 'NO_VCS'
review_loop_iteration: 0
context:
  - '{project-root}/nainoforge_prd_enrichment_scyforge.md'
  - '{project-root}/nainoforge_ingestion_architecture.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** NainoForge n'a aucun code source. Le PRD définit un monorepo de 12 packages + une extension Chrome MV3 avec Content Script, Service Worker, Offscreen Document et Side Panel — mais rien n'est scaffoldé. Impossible de commencer l'implémentation des features sans cette fondation.

**Approach:** Créer un monorepo pnpm workspaces avec TypeScript, scaffolder les packages vides (core, shared, extension) et un manifest Chrome MV3 fonctionnel. Le résultat doit compiler (`tsc --noEmit`) et l'extension doit pouvoir être chargée dans Chrome en mode développeur.

## Boundaries & Constraints

**Always:**
- pnpm workspaces — cohérent avec l'écosystème TypeScript monorepo.
- TypeScript strict mode pour tous les packages.
- Structure de packages conforme au PRD §9.2 (core, shared, extension au minimum — les packages vides comme ai, fsrs, cosmos etc. sont créés comme stubs).
- Manifest MV3 conforme à la spec Chrome : `manifest_version: 3`, permissions minimales, déclaration Side Panel, Content Scripts, Service Worker.
- Chaque package exporte un `index.ts` vide ou avec un TODO marker.
- ESLint + Prettier configurés à la racine.

**Ask First:**
- Ajout de frameworks UI (React, Preact, Solid) — le PRD mentionne React mais le scaffolding initial peut rester vanilla pour garder la flexibilité.
- Choix du bundler (Vite, webpack, CRXJS) pour l'extension.

**Never:**
- Ne pas implémenter de logique métier (IMPRINT, FSRS, EventBus, etc.) — ce sera dans des stories futures.
- Ne pas ajouter de dépendances runtime lourdes.
- Ne pas créer de backend Rust — le PRD le mentionne mais c'est hors scope du scaffolding initial.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| pnpm install | Repo cloné, pnpm ≥ 9 installé | Toutes les dépendances installées, workspaces résolus | Erreur claire si pnpm absent |
| tsc --noEmit | Après install | 0 erreurs TypeScript | N/A |
| Chargement extension | chrome://extensions → Load unpacked → dist/extension | Extension chargée, Side Panel accessible, aucune erreur console | Manifest invalide → erreur Chrome visible |

</frozen-after-approval>

## Code Map

- `package.json` -- racine monorepo, pnpm workspaces config
- `pnpm-workspace.yaml` -- déclaration des packages
- `tsconfig.json` -- config TS racine avec project references
- `.eslintrc.cjs` -- config ESLint partagée
- `.prettierrc` -- config Prettier
- `packages/core/` -- entités domain, types partagés, contrats
- `packages/shared/` -- utilitaires (UUID v7, validation, EventBus stub)
- `packages/ai/` -- stub summarizer, concept extractor
- `packages/imprint/` -- stub IMPRINT engine
- `packages/fsrs/` -- stub FSRS scheduler
- `packages/student-ai/` -- stub Teach-Back engine
- `packages/cosmos/` -- stub arbre sémantique
- `packages/vector/` -- stub embeddings
- `packages/bundle/` -- stub bundle engine
- `packages/extract/` -- stub Forge Extract Engine
- `packages/api/` -- stub edge functions
- `packages/extension/` -- extension Chrome MV3
- `packages/extension/manifest.json` -- MV3 manifest
- `packages/extension/src/background.ts` -- Service Worker stub
- `packages/extension/src/content.ts` -- Content Script stub
- `packages/extension/src/sidepanel/` -- Side Panel entry
- `packages/extension/src/offscreen/` -- Offscreen Document entry
- `.gitignore` -- exclusions standard

## Tasks & Acceptance

**Execution:**
- [ ] `package.json` -- Créer le package.json racine avec scripts (build, lint, typecheck) et pnpm workspaces
- [ ] `pnpm-workspace.yaml` -- Déclarer `packages/*` comme workspaces
- [ ] `tsconfig.json` + `tsconfig.base.json` -- Config TS racine avec project references + base partagée (strict, ESNext, NodeNext)
- [ ] `.eslintrc.cjs` + `.prettierrc` -- Linting et formatage uniformes
- [ ] `packages/core/` -- package.json + tsconfig.json + src/index.ts (exporte types domain vides)
- [ ] `packages/shared/` -- package.json + tsconfig.json + src/index.ts (exporte stubs EventBus, uuid)
- [ ] `packages/{ai,imprint,fsrs,student-ai,cosmos,vector,bundle,extract,api}/` -- Pour chaque : package.json + tsconfig.json + src/index.ts (stub TODO)
- [ ] `packages/extension/manifest.json` -- Manifest MV3 avec permissions minimales (activeTab, sidePanel, storage, offscreen), content_scripts (matches youtube.com + all_urls), background service_worker, side_panel
- [ ] `packages/extension/src/background.ts` -- Service Worker minimal (console.log d'initialisation)
- [ ] `packages/extension/src/content.ts` -- Content Script minimal (console.log de détection)
- [ ] `packages/extension/src/sidepanel/` -- sidepanel.html + sidepanel.ts (page minimale avec titre NainoForge)
- [ ] `packages/extension/src/offscreen/` -- offscreen.html + offscreen.ts (document vide prêt pour WASM)
- [ ] `.gitignore` -- node_modules, dist, .env, *.wasm binaires
- [ ] `git init` + premier commit

**Acceptance Criteria:**
- Given le repo est cloné et `pnpm install` exécuté, when `pnpm run typecheck`, then 0 erreurs TypeScript.
- Given l'extension est buildée, when chargée dans chrome://extensions en mode unpacked, then l'extension apparaît sans erreur et le Side Panel est accessible.
- Given un package interne (ex: `@nainoforge/core`), when importé depuis `@nainoforge/extension`, then la résolution TypeScript fonctionne via project references.

## Verification

**Commands:**
- `pnpm install` -- expected: installation sans erreur, tous workspaces résolus
- `pnpm run typecheck` -- expected: 0 erreurs (`tsc --noEmit` sur tous les packages)
- `pnpm run lint` -- expected: 0 erreurs ESLint

**Manual checks:**
- Charger `packages/extension/` dans chrome://extensions → extension visible, pas d'erreur manifest
- Ouvrir Side Panel → page NainoForge visible
