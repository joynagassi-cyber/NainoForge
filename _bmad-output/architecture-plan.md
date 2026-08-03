# Plan d'Architecture — NainoForge
> Généré le 2026-08-02 | Winston (System Architect)

---

## Contexte

**Stack** : Chrome MV3 + React 19 + Vite (custom, non-WXT) + Tailwind v4 + pnpm monorepo + TypeScript project references + FSRS WASM (Rust)
**État** : 4 épiques fonctionnels complétés (IMPRINT, Student AI, COSMOS, Review/Dashboard), 218 fichiers TS/TSX, 13 packages
**Objectif** : Corriger les dettes architecturales identifiées avant de lancer l'Epic 7 (polish UX) et l'Epic 8 (app mode fullscreen)

---

## Plan d'Action

### Phase 0 — Correction immédiate (P0, < 30 min)

| # | Action | Fichier | Détail |
|---|--------|---------|--------|
| 0.1 | Brancher ReviewSurface | `packages/extension/src/App.tsx` | Remplacer `<HomeSurface />` par `<ReviewSurface />` dans le rendu de l'onglet `review` |
| 0.2 | Nettoyer `.js`/`.d.ts` des `src/` | `.gitignore` | Ajouter `packages/*/src/**/*.js` et `packages/*/src/**/*.d.ts` puis `git rm -r --cached` |
| 0.3 | Supprimer artéfacts orphelins | `packages/core/src/`, `packages/shared/src/`, `packages/imprint/src/` | Supprimer les `.js.map` résiduels non commités |

---

### Phase 1 — Unification du domaine (P1, ~2h)

**Problème** : `CapturedSource` et `DCM` sont définis dans **deux packages** (`core` et `shared`) avec des champs légèrement différents.

| # | Action | Détail |
|---|--------|--------|
| 1.1 | Consolidation `CapturedSource` | Conserver la définition la plus riche (celle de `core/src/domain.ts`), l'exporter depuis `@nainoforge/core`, et faire importer `shared` depuis `core` |
| 1.2 | Unifier `DCM` | S'assurer que `DCM` n'existe qu'en un seul endroit (preferred: `@nainoforge/core`) |
| 1.3 | Aligner `SourceLike` | `imprint` et `student-ai` ont chacun leur `SourceLike` — les remplacer par un import de `core` |
| 1.4 | Typage `ImprintNote` unifié | `imprint/src/contracts.ts` définit `ImprintNote` localement, `core/src/domain.ts` aussi — garder la version `core` |

**Fichiers impactés** :
- `packages/core/src/domain.ts` — définition unique des types domaine
- `packages/core/src/contracts.ts` — interfaces engine (extractors, imprint)
- `packages/core/src/index.ts` — export public
- `packages/shared/src/types.ts` — supprimer les types dupliqués, ré-exporter depuis core si besoin
- `packages/imprint/src/contracts.ts` — importer `CapturedSource`/`ImprintNote` de `@nainoforge/core`
- `packages/student-ai/src/contracts.ts` — idem
- `packages/extension/src/hooks/use-sources.ts`, `use-imprint.ts` — ajuster les imports

---

### Phase 2 — Réorganisation des packages (P1, ~3h)

**Problème** : `packages/extract` existe mais n'est pas utilisé ; les extracteurs sont copiés dans `extension/src/extract/`.

| # | Action | Détail |
|---|--------|--------|
| 2.1 | Décider du sort de `extract` | Vérifier si `packages/extract/src/engine.ts` a du code différent de `extension/src/extract/`. Si identique → supprimer `packages/extract`, garder dans extension. Si différent → garder les deux, importer depuis extension |
| 2.2 | Crée `packages/storage/` (nouveau) | Repository pattern unifié pour IndexedDB : sources, imprint notes, FSRS cards, concepts COSMOS |
| 2.3 | Déplacer `SourceRepository` | De `packages/shared/src/repository.ts` vers `packages/storage/src/source-repository.ts` |
| 2.4 | Créer `ImprintRepository` | Stocke les notes IMPRINT dans IndexedDB (`nf_imprints`) |
| 2.5 | Créer `ConceptGraphRepository` | Stocke les concepts COSMOS dans IndexedDB (`nf_concepts`) |
| 2.6 | Créer `FsrsCardRepository` | Interface IndexedDB autour du scheduler WASM |

**Structure cible `packages/storage/`** :
```
packages/storage/src/
├── index.ts
├── db.ts                    # openDB(), migrations
├── source-repository.ts     # ex-shared/repository.ts
├── imprint-repository.ts    # nouveau
├── concept-repository.ts    # nouveau
└── fsrs-repository.ts       # wrapper IndexedDB pour FSRS
```

---

### Phase 3 — Simplification de la communication (P1, ~2h)

**Problème** : `engine-bridge.ts` fait trop (state + events + communication SW).

| # | Action | Détail |
|---|--------|--------|
| 3.1 | Simplifier `useSources` | Lire directement depuis `SourceRepository` (IndexedDB) au lieu de l'event bus du bridge |
| 3.2 | Créer `useImprintAsync` | Hook dédié pour la communication SW (capture + save imprint), séparé du state local |
| 3.3 | Supprimer `engine-bridge.ts` | Remplacer par des imports directs des packages `@nainoforge/core` et `@nainoforge/storage` |
| 3.4 | Unified EventBus | S'assurer que `shared/src/event-bus.ts` est le seul bus utilisé ; supprimer `event-bus-sw.ts` s'il est redondant |

---

### Phase 4 — Qualité du build (P2, ~1h)

| # | Action | Détail |
|---|--------|--------|
| 4.1 | Standardiser les imports | Tous les imports internes doivent utiliser `.js` (conformité TS `moduleResolution: Bundler`) |
| 4.2 | Nettoyer les `dist/` du versionnement | Ajouter `packages/*/dist/` au `.gitignore` |
| 4.3 | Vérifier `tsconfig.base.json` | S'assurer que `composite: true` et `references` sont cohérents partout |
| 4.4 | Ajouter un script `build:clean` | Supprimer les artéfacts JS des `src/` avant le build |

**Fichiers tsconfig concernés** :
- `tsconfig.base.json`
- `packages/core/tsconfig.json`
- `packages/shared/tsconfig.json`
- `packages/extension/tsconfig.json`
- `packages/imprint/tsconfig.json`

---

### Phase 5 — Préparation Epic 7 & 8 (P2, ~2h)

**Epic 7 — Polish UX** (specs existants dans `_bmad-output/`)
| # | Action | Détail |
|---|--------|--------|
| 7.1 | Transition effects | Animations entre surfaces (framer-motion déjà installé) |
| 7.2 | Toast notifications | Centraliser via `ToastContext` déjà existant |
| 7.3 | Microcopy wording | Audit des textes UI existants |
| 7.4 | Touch target validation | Vérifier 44px min sur tous les boutons |
| 7.5 | Icon consistency | Lister tous les SVG icons utilisés, vérifier la cohérence des styles |
| 7.6 | Typography final hierarchy | Vérifier le rendu des tokens typographiques définis dans `DESIGN.md` |

**Epic 8 — App Mode Fullscreen** (spec existe)
| # | Action | Détail |
|---|--------|--------|
| 8.1 | App mode routing | `App.tsx` gère déjà `mode=app` → ajouter une vraie surface fullscreen |
| 8.2 | Navigation fullscreen | Sidebar masquée, header adapté, transitions fluides |
| 8.3 | Back button | Gestion du retour sidebar vs fermeture tab |

---

## Dépendances entre phases

```
Phase 0 (P0) ─────────────────────────────────────► Peut commencer immédiatement
      │
      ▼
Phase 1 (P1) ──► Phase 2 (P1) ──► Phase 3 (P1)    ──► Peuvent s'enchaîner
      │                │                      │
      └────────────────┴──────────────────────┘
                        ▼
               Phase 4 (P2) ──► Phase 5 (P2)     ──► Dépend de 1, 2, 3
```

---

## Estimation totale

| Phase | Effort | Blocant pour |
|-------|--------|-------------|
| Phase 0 | 30 min | Rien — à faire tout de suite |
| Phase 1 | 2h | Phase 2, 3, 4 |
| Phase 2 | 3h | Phase 3, 5 |
| Phase 3 | 2h | Phase 4, 5 |
| Phase 4 | 1h | Release propre |
| Phase 5 | 2h | Livraison Epic 7/8 |
| **Total** | **~10h** | — |

---

## Risques

| Risque | Atténuation |
|--------|-------------|
| Breaking changes sur les imports unifiés (Phase 1) | Tests de compilation `pnpm typecheck` après chaque package modifié |
| `SourceRepository` existant utilisé ailleurs que prévu (Phase 2) | Lister tous les imports de `repository.ts` avant déplacement |
| `engine-bridge.ts` supprimé trop tôt (Phase 3) | Ne pas supprimer tant que tous les consommateurs ne migrent pas |
| WASM FSRS non rechargé après changement de build (Phase 4) | Vérifier que le path du `.wasm` n'est pas hardcodé |

---

## Prochaine étape recommandée

Commencer par la **Phase 0** (3 corrections immédiates) puis enchaîner sur la **Phase 1** (unification des types). Cela stabilise les fondations avant toute nouvelle feature.
