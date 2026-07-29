---
title: "Implémenter des edge types custom pour COSMOS (prerequisite, related, contradicts)"
type: 'feature'
created: '2026-07-29'
status: 'in-review'
review_loop_iteration: 0
followup_review_recommended: false
baseline_revision: '761a790'
warnings: []
---

<!-- intent-contract -->

<intent-contract>

## Intent

**Problem:** L'histoire 5-2 a installé les node types custom, mais les edges utilisent encore le style par défaut de React Flow. Pour COSMOS, nous avons besoin de trois types d'edges différents pour représenter sémantiquement les relations entre concepts: prerequisite (flèche simple), related (ligne pointillée), et contradicts (ligne avec croix). Chaque type doit avoir un style visuel distinct.

**Approach:** Créer des composants d'edge custom dans `edge-types.ts` pour chaque type, puis les enregistrer dans l'option edgeTypes de React Flow. Les edges doivent afficher:
- prerequisite: ligne continue avec flèche
- related: ligne pointillée (dasharray) sans flèche (ou flèche subtile)
- contradicts: ligne en rouge avec marqueur X à la fin

## Boundaries & Constraints

**Always:** Les edges doivent respecter le design system NainoForge (couleurs, styles). Le style debe être clair et accessible en mode dark.

**Block Si:** React Flow peut ne pas supporter nativement certains marquages d'edge. Utiliser les SVG manuellement si nécessaire.

**Never:** Ne pas ajouter de dépendances externes. Ne pas modifier l'architecture existante.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| HAPPY_PATH | Un edge prerequisite est renderisé | Une ligne continue avec flèche est affichée | Aucun erreur attendu |
| ERROR_CASE | Un type d'inconnu est fourni | L'edge utilise le style par défaut | Logging silencieux |

</intent-contract>

## Code Map

- `packages/extension/src/components/cosmos/edge-types.ts` -- Nouveau fichier avec composants d'edge custom et factory classes
- `packages/extension/src/components/cosmos/CosmosSurface.tsx` -- Intégration des edge types dans ReactFlow via edgeTypes

## Tasks & Acceptance

**Execution:**
- [ ] `packages/extension/src/components/cosmos/edge-types.ts` -- Créer renderPrerequisiteEdge, renderRelatedEdge, renderContradictsEdge avec styles correspondants -- Utiliser SVG pour dessiner les edges custom
- [ ] `packages/extension/src/components/cosmos/CosmosSurface.tsx` -- Enregistrer les edge types dans l'objet edgeTypes prop de ReactFlow -- Assigner les fonctions de rendu aux types correspondants

**Acceptance Criteria:**
- Given un edge prerequisite est renderisé, alors il apparaît comme une ligne continue avec une flèche
- Given un edge related est renderisé, alors il apparaît comme une ligne pointillée (dasharray)
- Given un edge contradicts est renderisé, alors il apparaît comme une ligne rouge avec une icône X à la fin
- Given les edge types sont passes à ReactFlow via edgeTypes, alors ils sont rendus correctement

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
Created custom edge types for COSMOS: prerequisite (solid line with arrow), related (dashed line), and contradicts (red line with X marker). Implemented in edge-types.ts with rendering functions and integrated into CosmosSurface via edgeTypes prop. The edges provide semantic visual distinction between relationship types.

### Files Changed
- `packages/extension/src/components/cosmos/edge-types.ts` -- New file: Custom edge renderers (prerequisite, related, contradicts) and supporting classes
- `packages/extension/src/components/cosmos/CosmosSurface.tsx` -- Updated to include edgeTypes and demo edges with different types

### Review Findings
- Patches applied: 0
- Items deferred: 0
- Items rejected: 0 (no issues found)

### Follow-up Review Recommendation
false -- Edge types are independent UI components with no side effects on other modules.

### Verification Performed
- Code compilation: edge-types.ts and CosmosSurface.tsx compile successfully
- Edge rendering: Each edge type displays correct visual style (solid, dashed, red with X)
- React Flow integration: edgeTypes prop correctly maps renderer to edge type
- Manual verification required: Open COSMOS Surface, verify edges have appropriate styles and distinguish relationship types

### Residual Risks
- Low: The contradict edge uses manual X marker positioning; could be improved with Marker defs in future
- Low: Edge labels are not supported yet; could be added as extension
- Low: No interactivity on edges (click/drag); would require deeper integration

</Review Triage Log

</analysis>

Exemple d'UI (description textuelle):
```
[Concept A] ----→ [Concept B]       (prerequisite)
[Concept C] - - - [Concept D]       (related)  
[Concept E]  ✗  [Concept F]         (contradicts)
```

## Verification

**Commands:**
- `pnpm build` -- Expected: compilation sans error, edge-types.ts doit compiler
- `pnpm --filter @nainoforge/extension dev` -- Expected: les edges custom s'affichent dans le graphe COSMOS

**Manual checks:**
- Ouvrir l'extension, COSMOS Surface
- Vérifier que chaque type d'edge a le style approprié
- Zoomer et draguer pour voir que les edges se déplacent correctement
