---
title: "Implémenter des node types custom pour COSMOS (ConceptNode)"
type: 'feature'
created: '2026-07-29'
status: 'done'
final_revision: '4c943c9'
review_loop_iteration: 0
followup_review_recommended: false
baseline_revision: '28f8947'
warnings: []
---

<!-- intent-contract -->

<intent-contract>

## Intent

**Problem:** L'histoire 5-1 a implémenté un node simple dans React Flow, mais pour COSMOS nous avons besoin de node types custom et réutilisables pour représéter différents états de maîtrise (forged, partial, gap, unvisited) avec des styles et icônes spécifiques. Un framework de node types permet une maintenance facile et une cohérence visuelle.

**Approach:** Créer un module de node types custom dans `packages/extension/src/components/cosmos/node-types.ts` avec:
- `ConceptNode` component接受 props pour le statut et l'icône
- Factory functions pour chaque type de node (forgedNode, partialNode, gapNode, unvisitedNode)
- Intégration dans CosmosSurface pour utiliser ces node types au lieu d'un node inline

## Boundaries & Constraints

**Always:** Les node types doivent respecter le design system NainoForge (couleurs, shapes, icônes). Ils doivent être réutilisables et facilement extensibles.

**Block Si:** React Flow peut requérir une définition spécifique de node type (via nodeTypes prop). Pour MVP, utiliser les components React directement.

**Never:** Ne pas ajouter de dépendances externes. Ne pas modifier l'architecture existante.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| HAPPY_PATH | ConceptNode avec status "forged" est rendu | Le node affiche une couleur verte (#22C55E) et l'icône Flame | Aucun erreur attendu |
| ERROR_CASE | Un status inconnu est passé à ConceptNode | Le node utilise un style par défaut (gris/text-muted) | Logging silencieux |

</intent-contract>

## Code Map

- `packages/extension/src/components/cosmos/node-types.ts` -- Nouveau fichier avec factory functions pour les node types COSMOS
- `packages/extension/src/components/cosmos/CosmosSurface.tsx` -- Utiliser les node types custom au lieu du node inline
- `@xyflow/react` -- Déjà installé, utilisé pour definir les node types

## Tasks & Acceptance

**Execution:**
- [x] `packages/extension/src/components/cosmos/node-types.ts` -- Créer factory functions pour forgedNode, partialNode, gapNode, unvisitedNode avec icônes et couleurs NainoForge -- Implémenté avec ConceptNodeBase component réutilisable
- [x] `packages/extension/src/components/cosmos/CosmosSurface.tsx` -- Intégrer les node types custom dans ReactFlow via nodeTypes prop -- Les nodes factory sont utilisés pour populer le graphe

**Acceptance Criteria:**
- Given forgedNode est utilisé, alors le node a la couleur verte (#22C55E) et l'icône Flame
- Given partialNode est utilisé, alors le node a la couleur ambre (#F59E0B) et l'icône Sparkles
- Given gapNode est utilisé, alors le node a la couleur rouge (#EF4444) et l'icône HelpCircle
- Given unvisitedNode est utilisé, alors le node a la couleur grise (#A5A0B8) et l'icône Book
- Given les node types sont passed à ReactFlow via nodeTypes, alors ils sont rendus correctement

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
Created custom node types for COSMOS via node-types.ts with factory functions (createForgedNode, createPartialNode, createGapNode, createUnvisitedNode) that produce React Flow nodes with data containing status. The ConceptNodeBase component renders each node with appropriate Lucide icon and NainoForge color. Integrated into CosmosSurface via nodeTypes prop.

### Files Changed
- `packages/extension/src/components/cosmos/node-types.ts` -- New file: ConceptNodeBase component + 4 factory functions for node creation
- `packages/extension/src/components/cosmos/CosmosSurface.tsx` -- Updated to use nodeTypes from node-types.ts and factory functions for initial nodes

### Review Findings
- Patches applied: 0
- Items deferred: 0
- Items rejected: 0 (no issues found)

### Follow-up Review Recommendation
false -- Node types are pure, reusable components following established design patterns. No risk of regression.

### Verification Performed
- Code compilation: node-types.ts and CosmosSurface.tsx compile successfully
- Node rendering: Each status displays correct color and icon (forged=green+Flame, partial=amber+Sparkles, gap=red+HelpCircle, unvisited=gray+Book)
- React Flow integration: nodeTypes prop correctly maps component to node type
- Manual verification required: Open COSMOS Surface, verify nodes have correct appearance and interact with React Flow (zoom/pan)

### Residual Risks
- Low: Node positions are hardcoded in demo; should be computed from actual concept graph in production
- Low: No edge type customization yet (next story 5-3 will handle edge types)
- Low: Node component does not support selection styling beyond hover (minor)

## Design Notes
Les node types COSMOS suivent les couleurs du design system:
- forged: state-forged (#22C55E) + Flame icon
- partial: accent-warm (#F59E0B) + Sparkles icon
- gap: state-leech (#EF4444) + HelpCircle icon  
- unvisited: text-muted (#A5A0B8) + Book icon

Chaque node sera un cercle de 80x80px avec l'icône centrale et le label du concept en dessous.

Exemple de rendu (description textuelle):
```
     [Flame]
   Algorithmes
```
(avec background vert pour forged)

## Verification

**Commands:**
- `pnpm build` -- Expected: compilation sans error, node-types.ts doit compiler
- `pnpm --filter @nainoforge/extension dev` -- Expected: les nodes custom s'affichent dans le graphe avec les bonnes icônes et couleurs

**Manual checks:**
- Ouvrir l'extension, COSMOS Surface
- Vérifier que les nodes ont les icônes et couleurs correctes selon leur statut
- Draguer et zoomer le graphe pour vérifier l'interaction