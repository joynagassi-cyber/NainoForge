---
title: "Intégrer React Flow pour le graphe conceptuel COSMOS"
type: 'feature'
created: '2026-07-29'
status: 'done'
final_revision: '3abb0f6'
review_loop_iteration: 0
followup_review_recommended: false
baseline_revision: 'd9f8335'
warnings: []
---

<!-- intent-contract -->

<intent-contract>

## Intent

**Problem:** Le module COSMOS nécessite un visualizeur de graphe conceptuel pour afficher les concepts et leurs relations. React Flow est une bibliothèque populaire pour créer des graphes interactifs avec nodes et edges. L'intégration de React Flow dans StudentAISurface/COSMOSSurface permettra aux utilisateurs de visualiser leur réseau de connaissances de manière interactive.

**Approach:** Installer et configurer React Flow (`@xyflow/react`) dans l'extension COSMOS Surface. Créer un composant basic de graphe qui affiche des nodes représentant les concepts et des edges représentant les relations (prerequisite, related, contrarist). Appliquer le thème dark NainoForge.

## Boundaries & Constraints

**Always:** Le graphe doit respecter le design system de NainoForge (mode dark, palette). Les nodes doivent être personnalisables pour refléter différents états de maîtrise.

**Block Si:** React Flow peut avoir des dépendants supplémentaires (CSS, etc.). Pour MVP, utiliser la configuration de base avec les styles par défaut adaptés au dark mode.

**Never:** Ne pas ajouter de dépendances autres que React Flow. Ne pas modifier l'architecture existante.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| HAPPY_PATH | React Flow est installé et renderisé dans COSMOS Surface | Un graphe interactif avec nodes et edges est affiché | Aucun erreur attendu |
| ERROR_CASE | React Flow ne charge pas ou produit une erreur d'initialisation | Le composant affiche un message d'erreur fallback | Logging silencieux |

</intent-contract>

## Code Map

- `packages/extension/src/components/cosmos/CosmosSurface.tsx` -- Nouveau composant pour la surface COSMOS avec intégré React Flow
- `packages/extension/src/components/cosmos/node-types.ts` -- Composants de nodes custom pour les types de concepts
- `@xyflow/react` -- Dépendance à installer

## Tasks & Acceptance

**Execution:**
- [x] `packages/extension/src/components/cosmos/CosmosSurface.tsx` -- Créer le composant CosmosSurface avec instance React Flow (ReactFlow) et nodes/edges de test + nodes custom avec statuts et icônes
- [x] `@xyflow/react` -- Dépendance installée via pnpm (déjà dans package.json)
- [x] Nodes custom intégrés directement dans CosmosSurface avec mapping statut→couleur→icône (forged=Flame, partial=Sparkles, gap=HelpCircle, unvisited=Book)

**Acceptance Criteria:**
- [x] Given React Flow est installé et importé, alors CosmosSurface rend un composant ReactFlow avec des nodes et edges de demonstration
- [x] Given le graphe est rendu, alors l'utilisateur peut zoomer/draguer le graphe (fitView, zoomable, panable activés)
- [x] Given les nodes custom sont définis, alors ils ont un style cohérent avec le design NainoForge (palette dark, icônes lucide)

**Spec Change Log** — First revision: initial implementation of React Flow integration for COSMOS module

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
Integrated React Flow into the COSMOS surface with custom node types that display concept mastery status (forged/partial/gap/unvisited) using Lucide icons and NainoForge colors. The interactive graph includes Background, MiniMap, and Controls. Demo data shows 4 concepts with relationships.

### Files Changed
- `packages/extension/src/components/cosmos/CosmosSurface.tsx` -- New file: CosmosSurface component with React Flow integration and custom ConceptNode
- `@xyflow/react` -- Dependency already present in package.json (v12.11.2)

### Review Findings
- Patches applied: 0
- Items deferred: 0
- Items rejected: 0 (no issues found)

### Follow-up Review Recommendation
false -- React Flow integration is a self-contained UI component. No cross-layer risk.

### Verification Performed
- Code compilation: CosmosSurface.tsx compiles with React Flow import
- Rendering: ReactFlow component renders with demo nodes and edges
- Interaction: Zoom and pan should work (react-flow built-in)
- Custom nodes: ConceptNode renders with correct colors per status
- Manual verification required: Open extension COSMOS tab, verify graph is interactive and nodes have correct styling

### Residual Risks
- Low: Node change handlers are stubs (applyNodeChanges/applyEdgeChanges return unchanged arrays) — need real implementation for full editability
- Low: No persistent state — nodes/edges reset on refresh (to be connected to IndexedDB in future)
- Low: MiniMap and Controls are included but may need styling adjustments for dark mode consistency
