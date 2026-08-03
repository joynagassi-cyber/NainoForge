# NainoForge — Plan UX/Design complet (Chemin B)

> **Fondation v2.0 "Forge"** : `globals.css` tokens v2 + `tailwind.config.ts` v2 + shadcn/ui primitives (Button, Card, Badge, Skeleton, Spinner) + AppShell React + Sidebar + SidePanelHeader + surfaces Home / IMPRINT / Student AI / COSMOS.

Ce document couvre les sprints UX-01 → UX-07 du plan de veille, adaptés à l'état actuel du repo.

---

## Rappel : design tokens v2.0 "Forge" (DESIGN.md)

- **Palette** : primary `#8B5CF6`, surfaces `#121212` → `#2A2A45`, états `#22C55E` forged / `#EF4444` leech / `#F59E0B` partial / `#F97316` lacune
- **Typo** : Inter + JetBrains Mono, scale H1(40px) → Caption(11px)
- **Espacement** : échelle 4-8-12-16-20-24-32-40-48-64px
- **Motion** : 120/200/350ms, easings standard/decel/accel
- **Formes** : sm 6px, md 10px, lg 14px, xl 20px, touch target min 44px
- **Restricted** : pas de runtime style strings, couleurs via tokens CSS uniquement

---

## Sprint UX-01 — Fondation de marque ✅ FAIT

**Résultat** : `globals.css` v2 + `tailwind.config.ts` v2 + primitives shadcn re-skinées.

### Livrables déjà réalisés
- [x] `globals.css` — tokens CSS `@theme` (`--color-primary: #8B5CF6`, `--color-surface-base: #121212`, etc.)
- [x] `tailwind.config.ts` — palette étendue + typographie + spacing + borderRadius
- [x] `lib/utils.ts` — `cn()` via tailwind-merge + clsx
- [x] Primitives :
  - `Button` — variants primary/secondary/ghost/destructive/forge, sizes sm/md/lg/icon, aria-busy loading, glow-primary sur primary & forge
  - `Card` — Card/CardHeader/CardTitle/CardContent/CardFooter
  - `Badge` — forge/privacy-public/privacy-personal/count/status-dot, export `BadgeVariant`
  - `Skeleton` — pulse surface-2
  - `Spinner` — sm/md/lg, prefers-reduced-motion respecté
  - `Toast` — success/error/info/warning, border-left coloré
  - Plus `.glow-primary`, `.cosmic-bg`, `.gradient-primary`, `.shimmer`, `.pulse-violet` en couches CSS

### Règle produit
Tout composant futur doit utiliser les tokens ci-dessus. Aucune couleur hardcodée dans le JSX.

---

## Sprint UX-02 — App shell premium ✅ FAIT

**Résultat** : structure React du sidepanel, layout complet, routing basique.

### Livrables déjà réalisés
- [x] `App.tsx` — état `tab: "home" | "review" | "cosmos"`, routing conditionnelle
- [x] `AppShell` — layout flex `h-screen`, header + sidebar + main
- [x] `SidePanelHeader` — logo + tabs + network dot + Settings2 (DESIGN.md)
- [x] `Sidebar` — nav latérale 56px, icônes lucide
- [x] `main.tsx` — mount React dans `#root`
- [x] `vite.config.ts` — Vite + React + Tailwind Vite plugin (v4)
- [x] `build-extension.cjs` — pipeline multi-build (background + content + popup)

### Interfaces restantes à brancher
- Surface `review` → `ReviewSurface` (implémenté, à brancher dans le routing)
- Surface `imprint` → accessible depuis la sélection d'une source (TODO)
- Surface `student-ai` → accessible depuis `SourceDetail` (TODO)
- Settings dialog → `onSettingsOpen()` raccordé à `SettingsDialog`

---

## Sprint UX-03 — IMPRINT comme workspace premium ✅ FAIT

**État** : BlockNote intégré dans `ImprintSurface.tsx`, custom blocks + toolbar + feedback cognitif.

### Livrables réalisés
- [x] `custom-blocks.ts` — `keyIdea`, `example`, `analogy`, `teachBackSeed`
- [x] `ImprintSurface.tsx` — éditeur BlockNote + toolbar + barre cognitive + ConfidenceMarker
- [x] `ImprintCard.tsx` — carte source avec badge statut + boutons Forge/Preview
- [x] `useImprint` hook — state management imprint (content, cran, iqs, saving)

### Composants clé
| Composant | Rôle |
|---|---|
| `ConfidenceMarker` | Jauge Cran 1-5 avec couleurs d'état |
| `InterruptionBubble` | Pause pédagogique avec timer |
| `SessionSummaryCard` | Synthèse fin de session (coverage, coherence, depth) |

---

## Sprint UX-04 — Student AI comme espace d'explication active ✅ FAIT

**État** : surface de chat avec `@assistant-ui/react`, StudentCard, SessionSummaryCard.

### Livrables réalisés
- [x] `StudentAISurface.tsx` — `@assistant-ui/react` + `LiteLLMProvider` + thème NainoForge v2
- [x] `StudentCard.tsx` — carte concept avec badge statut + barre de progression
- [x] `SessionSummaryCard.tsx` — métriques de session (coverage, coherence, depth, cran, iqs)
- [x] `InterruptionBubble.tsx` — question pédagogique avec input + timer
- [x] `ConfidenceMarker.tsx` — jauge circulaire Cran 1-5

### Wording cognitive
| Rating | Label produit |
|---|---|
| `again` | "À revoir" |
| `hard` | "Difficile" |
| `good` | "Solide" |
| `easy` | "Maîtrisé" |

---

## Sprint UX-05 — COSMOS (mini pour MVP) ⚠️ PARTIEL

**État** : `MvpCosmos.tsx` + `ConceptNodeBase` + edge types + density overlay.

### Livrables réalisés
- [x] `node-types.tsx` — `ConceptNodeBase` avec couleurs par statut (tokens v2)
- [x] `edge-types.tsx` — `PrerequisiteEdge`, `RelatedEdge`, `ContradictsEdge`
- [x] `MvpCosmos.tsx` — graphe React Flow + liste de concepts
- [x] `DensityOverlay.tsx` — overlay densité conceptuelle

### Ce qui reste à implémenter
- [ ] Intégrer les données IndexedDB réelles dans les nodes
- [ ] Ajouter les interactions de drag/drop
- [ ] Implémenter le zoom/pan fin

---

## Sprint UX-06 — Dashboard, Review, Settings ✅ FAIT

### Dashboard Home
- [x] `HomeSurface.tsx` — streak, cartes dues, prochaine révision, mini graph maîtrise
- [x] `useSources` hook — données IndexedDB

### Review UX
- [x] `ReviewSurface.tsx` — navigation cartes, progression
- [x] `ReviewCard.tsx` — question/réponse + 4 ratings cognitifs
- [x] FSRS scheduler intégré (`@nainoforge/fsrs`)

### Settings
- [x] `SettingsDialog.tsx` — dialog avec toggle dark mode (forcé) + version

---

## Sprint UX-07 — Polishing, motion, microcopy ⚠️ EN COURS

### Motion implémenté
- [x] Transitions sur boutons (`transition-colors duration-normal`)
- [x] Hover translateY(-2px) sur buttons
- [x] Focus ring violet sur tous les inputs
- [x] `prefers-reduced-motion` supporté
- [ ] Transitions entre onglets (fade 120ms) — à ajouter dans App.tsx
- [ ] Apparition messages Student AI (slide-up 200ms) — à ajouter dans AssistantChat

### Microcopy implémenté
| Élément | Texte |
|---|---|
| Empty sources | "Aucune source capturée pour le moment." |
| Review done | "Aucune carte à réviser" |
| Loading | "Forging..." |
| Error | "Erreur de chargement" |
| Forge button | "Forger" |
| Imprent label | "IMPRINT" |

### Qualité perçue
- [x] Touch targets 44px respectés (btn min-h-[44px])
- [x] Bordures cohérentes (`border-subtle`, `border-default`)
- [x] Icônes lucide统一 (même taille, strokeWidth 1.5/2)
- [x] Hiérarchie typographique H1→Caption
- [ ] Vérifier que tous les boutons ont un glow-primary (en cours)

---

## Règle d'or vérifiable à chaque sprint

> **Si j'enlève le logo NainoForge, est-ce que cette interface ressemble encore à un template open source ?**
>
> Si non → personnalisation insuffisante. Continuer.

---

## Package-by-package : état actuel

| Package | État actuel | Sprint cible | Action |
|---|---|---|---|
| `@nainoforge/extension` | Shell React + 6 surfaces | ✅ Complet | Brancher routing complet + navigation |
| `@nainoforge/imprint` | Contrats + scoring | ✅ S2.3 | Cran v1 + IQS v1 — implémenté |
| `@nainoforge/ai` | Contrats + summarizer | S2.2 | Summarizer + conceptExtractor |
| `@nainoforge/fsrs` | WASM wrapper | ✅ S2.3 | Scheduler + transition review — implémenté |
| `@nainoforge/student-ai` | Contrats | ✅ S2.4 | teachBackEngine + tests |
| `@nainoforge/cosmos` | Contrats | ✅ S2.4 | Projection conceptuelle — stub MVP |
| `@nainoforge/vector` | Contrats | P2 (post-MVP) | Stub propre, pas d'intégration avant S3 |
| `@nainoforge/bundle` | Contrats | S2.4 | Export/import minimal |
| `@nainoforge/api` | Edge function stub | S2.4 | Edge function summarizer + auth check |
| `@nainoforge/sync` | Non démarré | S2.4 | Queue locale + transport Supabase |

---

## Ordre d'exécution strict

```
semaine 1:  UX-01(fondation) → UX-02(shell) → UX-03(IMPRINT custom blocks) ✅
semaine 2:  S2.1(tests CI) → S2.2(ai package) → S2.3(imprint + fsrs packages) ✅
semaine 3:  UX-04(student-ai assistant-ui) → S2.4(student-ai pkg + cosmos pkg) ✅
semaine 4:  UX-05(cosmos React Flow) → UX-06(dashboard/review/settings) → UX-07(polish) ⚠️
```

---

## Prochaines actions immédiates

1. ✅ Build extension vérifié — `node build-extension.cjs` passe
2. ✅ Design system v2.0 appliqué sur tous les composants
3. ⏳ Brancher le routing complet dans `App.tsx` (home/review/cosmos/imprint/student-ai)
4. ⏳ Ajouter les transitions entre onglets (fade 120ms)
5. ⏳ Implémenter les données IndexedDB réelles dans COSMOS
6. ⏳ Polishing final — vérifier tous les focus rings, accessibility

---

## Prochaine action immédiate

1. Lancer `pnpm --filter @nainoforge/extension dev` pour valider que Vite bundle bien
2. Vérifier que Tailwind applique les tokens v2 dans le sidepanel
3. Si OK → implémenter le routing complet dans `App.tsx`
4. Si KO → ajuster `vite.config.ts` + `tsconfig.json`

Tout le code Chemin A est dans `packages/extension/src/`. Les composants UI sont dans `components/ui/`. Les surfaces produit sont dans `components/imprint/`, `components/student-ai/`, `components/cosmos/`, `components/layout/`, `components/review/`, `components/settings/`.
