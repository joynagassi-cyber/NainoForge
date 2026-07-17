# NainoForge — Plan UX/Design complet (Chemin B)

> **Fondation déjà posée** : `globals.css` + `tailwind.config.ts` + shadcn/ui primitives (Button, Card, Badge, Skeleton, Spinner) + AppShell React + Sidebar + SidePanelHeader + surfaces Home / IMPRINT / Student AI / COSMOS.

Ce document couvre les sprints UX-01 → UX-07 du plan de veille, adaptés à l'état actuel du repo.

---

## Rappel : design tokens déjà figés (DESIGN.md)

- Palette : `#7C3AED` primary, surfaces `#0A0A0F` → `#201D2E`, états `#22C55E` forged / `#EF4444` leech
- Typo : system-ui, 26/20/18/16/14/12/11px, mono ui-monospace
- Espacement : échelle 4-8-12-16-20-24-32-40-48-64px
- Motion : 120/200/350ms, easings standard/decel/accel
- Formes : sm 6px, md 10px, lg 14px, touch target min 44px
- Restricted : pas de runtime style strings, CSS Modules uniquement dans les packages

---

## Sprint UX-01 — Fondation de marque ✅ FAIT

**Résultat** : `globals.css` + `tailwind.config.ts` + 6 primitives shadcn re-skinées.

### Livrables déjà réalisés
- [x] `globals.css` — tokens CSS `:root` (`--primary`, `--surface-1`, `--state-forged`, etc.)
- [x] `tailwind.config.ts` — palette étendue + typographie + spacing + borderRadius
- [x] `lib/utils.ts` — `cn()` via tailwind-merge + clsx
- [x] Primitives :
  - `Button` — variants primary/secondary/ghost/destructive/forge, sizes sm/md/lg/icon, aria-busy loading
  - `Card` — Card/CardHeader/CardTitle/CardContent/CardFooter
  - `Badge` — forge/privacy-public/privacy-personal/count/status-dot
  - `Skeleton` — pulse surface-2
  - `Spinner` — sm/md/lg, prefers-reduced-motion respecté
  - Plus `.btn-forge`, `.card`, `.cognitive-bar` en couches `@layer components`

### Règle produit
Tout composant futur doit utiliser les tokens ci-dessus. Aucune couleur hardcodée dans le JSX.

---

## Sprint UX-02 — App shell premium ✅ FAIT

**Résultat** : structure React du sidepanel, layout complet, routing basique.

### Livrables déjà réalisés
- [x] `App.tsx` — état `tab: "home" | "review" | "cosmos"`, routing conditionnelle
- [x] `AppShell` — layout flex `h-screen`, header + sidebar + main
- [x] `SidePanelHeader` — Flame logo + tabs + network dot + Settings2 (DESIGN.md)
- [x] `Sidebar` — nav latérale 56px, icônes lucide
- [x] `main.tsx` — mount React dans `#root`
- [x] `vite.config.ts` — Vite + React + Tailwind Vite plugin
- [x] `sidepanel.html` — `<div id="root">` + script module

### Interfaces restantes à brancher
- Surface `review` → `HomeSurface` pour l'instant, à séparer en `ReviewSurface`
- Surface `imprint` → accessible depuis la sélection d'une source (TODO)
- Surface `student-ai` → accessible depuis `SourceDetail` (TODO)
- Settings sheet → `onSettingsOpen()` raccordé à une `Dialog` shadcn

---

## Sprint UX-03 — IMPRINT comme workspace premium ⚠️ PARTIEL

**État** : BlockNote installé et intégré dans `ImprintSurface.tsx`, mais sans custom blocks ni thème poussé.

### Ce qui manque
1. **Custom blocks NainoForge** (BlockNote `customBlocks` + schema extension)
   - `keyIdea` block — bordure violette primary, label inline « Idée clé »
   - `example` block — bordure verte `#22C55E`, label « Exemple »
   - `analogy` block — bordure ambre `#F59E0B`, label « Analogie »
   - `teachBackSeed` block — bordure muted, label « Amorce teach-back »

2. **Toolbar custom** — barre de formatage qui expose ces blocs comme actions rapides

3. **Feedback cognitif inline**
   - Barre de Cran (déjà présente)
   - Badge IQS dynamique (calculateur à câbler sur `@nainoforge/imprint`)
   - Compteur de concepts couverts

4. **Carte IMPRINT de sortie** — composant `ImprintCard` style forge premium

### Actions à mener
```ts
// packages/extension/src/components/imprint/custom-blocks.ts
export const nfCustomBlocks = [
  { type: "keyIdea", label: "Idée clé", icon: Flame },
  { type: "example", label: "Exemple", icon: BookOpen },
  { type: "analogy", label: "Analog.ie", icon: Sparkles },
  { type: "teachBackSeed", label: "Amorce TB", icon: HelpCircle },
];
```

Puis brancher dans `BlockNoteEditor.create({ customBlocks: nfCustomBlocks })` et définir le style CSS de chaque type via `block.type`.

---

## Sprint UX-04 — Student AI comme espace d'explication active ⚠️ PARTIEL

**État** : surface de chat custom dans `StudentAISurface.tsx`, mais sans assistant-ui.

### Ce qui manque
1. **Intégrer `@assistant-ui/react`**
   - `AssistantChat` + `Thread` + `Message` primitives
   - Remplacer le simulateur setTimeout par un vrai `useAssistant` hook
   - Brancher sur l'abstraction `AiProvider` (`packages/ai-providers`)

2. **Composants signatures**
   - `StudentCard` — carte concept avec statut maîtrise (forged/partial/lacune/leech)
   - `InterruptionBubble` — moment de friction pédagogique
   - `ConfidenceMarker` — barre circulaire ou jauge
   - `SessionSummaryCard` — synthèse fin de session (coverage/coherence/depth)

3. **Wording cognitive**
   - Remplacer les labels de rating (again/hard/good/easy) par des termes produit :
     - `À revoir` / `Difficile` / `Solide` / `Maîtrisé`
   - Messages d'encouragement adaptés au Cran

---

## Sprint UX-05 — COSMOS (mini pour MVP) ⚠️ STUB

**État** : placeholder `CosmosSurface.tsx` avec grille de statuts.

### Ce qui manque
1. **Intégrer `@xyflow/react`**
   - `ReactFlow` instance NainoForge dark theme
   - Custom node types : `ConceptNode` (forged/partial/gap/unvisited)
   - Custom edge types : `prerequisite`, `related`, `contradicts`

2. **Styles custom nodes**
   ```tsx
   // packages/extension/src/components/cosmos/node-types.ts
   const nodeColor = (status) => {
     if (status === "forged") return "#22C55E";
     if (status === "partial") return "#F59E0B";
     if (status === "gap") return "#EF4444";
     return "#5E5A6E";
   };
   ```

3. **Mini-COSMOS MVP** (depuis la roadmap)
   - Vue liste de concepts + statut visuel
   - Vue graphe simple de dépendances
   - Overlay densité conceptuelle

---

## Sprint UX-06 — Dashboard, Review, Settings

### À livrer
#### Dashboard Home
- `HomeSurface.tsx` existe déjà — enrichir avec :
  - Streak de révision (nombre de jours consécutifs)
  - Compte de cartes dues aujourd'hui
  - Prochaine révision dans Xh
  - Mini graph de maîtrise par concept

#### Review UX
- `ReviewSurface` séparé de Home
- Card de révision :
  - front: question
  - back: réponse + indicateur de difficulté
- 4 ratings visuels : `À revoir` / `Difficile` / `Solide` / `Maîtrisé`
- Feedback visuel après rating (couleur + animation 200ms)

#### Settings
- Dialog shadcn personnalisée
- Sections : Compte, Plan premium, Confidentialité, Affichage
- Toggle dark mode (forcé dark au MVP, mais slot prêt)

---

## Sprint UX-07 — Polishing, motion, microcopy

### Motion à ajouter
- Transitions entre onglets (fade 120ms)
- Apparition des messages Student AI (slide-up 200ms)
- Toast notifications pour actions importantes (carte sauvegardée, sync ok)
- Micro-animation sur badge forge

### Microcopy à rédiger
| État | Texte actuel | Texte cible |
|---|---|---|
| Empty inbox | "Aucune source" | "Ta forge est vide. Capture un article pour commencer." |
| Review done | "Fini" | "Session complète. Ta prochaine révision est dans 2h." |
| Loading | — | "Forge en cours..." |
| Error | "Erreur" | "La forge a buté. Réessaye." |
| Leech | "Leech" | "Concept en difficulté — refaire un IMPRINT aidera." |

### Qualité perçue
- Vérifier que les 44px touch target sont respectés partout
- Aligner toutes les bordures sur `border-subtle` / `border-default`
- Cohérence des icônes lucide (toutes même taille, même strokeWidth 1.5/2)
- Hiérarchie typographique finale (titres, corps, caption)

---

## Règle d'or vérifiable à chaque sprint

> **Si j'enlève le logo NainoForge, est-ce que cette interface ressemble encore à un template open source ?**
>
> Si non → personnalisation insuffisante. Continuer.

---

## Package-by-package : ce qui reste à implémenter

| Package | État actuel | Sprint cible | Action |
|---|---|---|---|
| `@nainoforge/extension` | Shell React + surfaces | UX-02 → continued | Brancher routing + navigation vers chaque surface |
| `@nainoforge/imprint` | Contrats + scoring skeleton | S2.3 | Implémenter Cran v1 + IQS v1 |
| `@nainoforge/ai` | Contrats + summarizer skeleton | S2.2 | Implémenter summarizer + conceptExtractor |
| `@nainoforge/fsrs` | WASM wrapper skeleton | S2.3 | Scheduler + transition review |
| `@nainoforge/student-ai` | Contrats skeleton | S2.4 | teachBackEngine minimal + tests |
| `@nainoforge/cosmos` | Contrats skeleton | S2.4 | Projection conceptuelle minimale |
| `@nainoforge/vector` | Contrats skeleton | P2 (post-MVP) | Stub propre, pas d'intégration avant S3 |
| `@nainoforge/bundle` | Contrats skeleton | S2.4 | Export/import minimal |
| `@nainoforge/api` | Edge function stub | S2.4 | Edge function summarizer + auth check |
| `@nainoforge/sync` | Non démarré | S2.4 | Queue locale + transport Supabase |

---

## Ordre d'exécution strict

```
semaine 1:  UX-01(fondation) → UX-02(shell) → UX-03(IMPRINT custom blocks)
semaine 2:  S2.1(tests CI) → S2.2(ai package) → S2.3(imprint + fsrs packages)
semaine 3:  UX-04(student-ai assistant-ui) → S2.4(student-ai pkg + cosmos pkg)
semaine 4:  UX-05(cosmos React Flow) → UX-06(dashboard/review/settings) → UX-07(polish)
```

---

## Prochaine action immédiate

1. Lancer `pnpm --filter @nainoforge/extension dev` pour valider que Vite bundle bien
2. Vérifier que Tailwind applique les tokens dans le sidepanel
3. Si OK → implémenter les custom blocks BlockNote (Sprint UX-03)
4. Si KO → ajuster `vite.config.ts` + `tsconfig.json`

Tout le code Chemin A est dans `packages/extension/src/`. Les composants UI sont dans `components/ui/`. Les surfaces produit sont dans `components/imprint/`, `components/student-ai/`, `components/cosmos/`, `components/layout/`.
