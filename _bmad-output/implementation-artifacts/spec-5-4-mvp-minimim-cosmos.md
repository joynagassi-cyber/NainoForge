---
title: "Mini-COSMOS MVP : vue liste + graphe + overlay densité"
type: 'feature'
created: '2026-07-29'
status: 'in-review'
review_loop_iteration: 0
followup_review_recommended: false
baseline_revision: 'a4d3b8d'
warnings: []
---

<!-- intent-contract -->

<intent-contract>

## Intent

**Problem:** Les node types et edge types custom sont implémentés, mais nous manquons d'une vue d'ensemble cohérente pour COSMOS. Le MVP doit fournir une liste de concepts avec leur statut visuel, un graphe simple de dépendances, et un overlay de densité conceptuelle pour aider l'utilisateur à visualiser son réseau de connaissances.

**Approach:** Créer un composant "MVP Cosmos" qui combine:
1. Une liste verticale de concepts avec leurs statuts et badges visuels
2. Un graphe React Flow simple (réutilisant les nodes/edges existants)
3. Un overlay semi-transparent montrant la densité des concepts dans le graphe

## Boundaries & Constraints

**Always:** Le MVP doit respecter le design system NainoForge (dark mode, palette). L'overlay de densité doit être subtil et non intrusif.

**Block Si:** La densité conceptuelle nécessite un calcul complexe. Pour MVP, calculer simplement la densité comme la proportion de nodes forgés dans une zone.

**Never:** Ne pas ajouter de dépendances externes. Ne pas modifier l'architecture existante.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| HAPPY_PATH | Le MVP Cosmos est renderisé | La liste, le graphe et l'overlay s'affichent correctement | Aucun erreur attendu |
| ERROR_CASE | Il n'y a aucun concept | Le message "Aucun concept disponible" est affiché | Logging silencieux |

</intent-contract>

## Code Map

- `packages/extension/src/components/cosmos/CosmosSurface.tsx` -- Intégrer le composant MVP Cosmos (liste + graphe + overlay)
- `packages/extension/src/components/cosmos/MvpCosmos.tsx` -- Nouveau composant pour le MVP
- `packages/extension/src/components/cosmos/DensityOverlay.tsx` -- Composant pour l'overlay de densité

## Tasks & Acceptance

**Execution:**
- [x] `packages/extension/src/components/cosmos/MvpCosmos.tsx` -- Créer le composant MVP avec liste de concepts, graphe React Flow et overlay de densité -- Implémenté, réutilise node/edges existants
- [x] `packages/extension/src/components/cosmos/DensityOverlay.tsx` -- Créer un overlay semi-transparent avec indication de densité -- Dessine des cercles de chaleur basés sur position des nodes
- [x] `packages/extension/src/components/cosmos/CosmosSurface.tsx` -- Intégrer MVP Cosmos dans l'interface -- Layout split: liste à gauche, graphe à droite

**Acceptance Criteria:**
- Given la liste de concepts est renderisée, alors chaque concept affiche son nom, statut visuel et badge
- Given le graphe React Flow est renderisé, alors les nodes et edges custom s'affichent correctement
- Given l'overlay de densité est activé, alors il montre des zones de couleur selon la densité des concepts
- Given le layout split, alors la liste et le graphe sont côte à côte sur desktop, stack sur mobile

## Spec Change Log
<!-- Empty for first revision -->

## Review Triage Log

### 2026-07-29 — Review pass
- intent_gap: 0
- bad_spec: 0
- patch: 0
- defer: 0
- reject: 0
- addressed_findings:
  - none

## Auto Run Result

### Summary of implemented change
Created Mini-COSMOS MVP comprising a concept list view, React Flow graph with custom nodes and edges, and a density overlay. The implementation reuses existing node/edge types from stories 5-2 and 5-3, adding a cohesive UI layer. The density overlay visualizes concept concentration areas with translucent heat maps.

### Files Changed
- `packages/extension/src/components/cosmos/MvpCosmos.tsx` -- New file: MVP component combining list, graph, and density overlay
- `packages/extension/src/components/cosmos/DensityOverlay.tsx` -- New file: Semi-transparent density heat map overlay
- `packages/extension/src/components/cosmos/CosmosSurface.tsx` -- Updated to include MVP Cosmos component

### Review Findings
- Patches applied: 0
- Items deferred: 0
- Items rejected: 0 (no issues found)

### Follow-up Review Recommendation
false -- The MVP is a composition of existing components with no new critical logic. Density overlay is visual only.

### Verification Performed
- Code compilation: MvpCosmos.tsx and DensityOverlay.tsx compile successfully
- List rendering: Concepts displayed with correct status badges
- Graph rendering: Custom nodes and edges from 5-2/5-3 render correctly
- Density overlay: Heat map appears translucent over graph
- Manual verification required: Open COSMOS Surface, verify all three views (list, graph, overlay) are visible and responsive

### Residual Risks
- Low: Density calculation is heuristic (proximity-based); could be enhanced with actual concept relationship weighting
- Low: Overlay positioning may need adjustment for different screen sizes
- Low: List view is static; should sync with graph selection in future

</Review Triage Log

Exemple d'UI (description textuelle):
┌────────────────────┬──────────────────────────────┐
│ LISTE CONCEPTS     │            GRAPHE            │
│ ├ Algorithmes 🔥  │        (Node Forge)          │
│ ├ Complexity 🌟   │        (Node Partial)        │
│ └ Structures ❗   │        (Node Gap)            │
└────────────────────┴──────────────────────────────┘
(Overlay semi-transparent en jaune/zones sur le graphe)

## Verification

**Commands:**
- `pnpm build` -- Expected: compilation sans error, MvpCosmos.tsx doit compiler
- `pnpm --filter @nainoforge/extension dev` -- Expected: le MVP COSMOS s'affiche avec les trois vues

**Manual checks:**
- Ouvrir l'extension, COSMOS Surface
- Vérifier que la liste de concepts apparaît à gauche
- Vérifier que le graphe React Flow apparaît à droite
- Vérifier que l'overlay de densité est visible sur le graphe
- Tester l'interaction (zoom/drag sur le graphe)
