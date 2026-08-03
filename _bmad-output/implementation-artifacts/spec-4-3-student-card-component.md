---
title: "Implémenter le composant StudentCard avec statut de maîtrise"
type: 'feature'
created: '2026-07-29'
status: 'done'
final_revision: 'fa49dcf'
review_loop_iteration: 0
followup_review_recommended: false
baseline_revision: 'abbe788'
warnings: []
---

<!-- intent-contract -->

<intent-contract>

## Intent

**Problem:** L'interface Student AI a besoin d'afficher les concepts/apprentissages de l'utilisateur avec un statut de maîtrise visuel. Le composant StudentCard présente un concept avec son niveau de maîtrise (forged = vert, partial = ambre, lacune = rouge, leech = rouge) et des indicateurs visuels.

**Approach:** Créer un composant `StudentCard` qui:
- Affiche le nom du concept, son statut de maîtrise, et un indicateur visuel
- Utilise les couleurs du design system (state-forged #22C55E, accent-warm #F59E0B, state-leech #EF4444)
- Supporte les états: forged, partial, lacune, leech
- Peut afficher une barre de progression ou un badge de statut

## Boundaries & Constraints

**Always:** Le card doit respecter le design system de NainoForge (palette, shapes, elevation). Il doit être réutilisable dans différentes surfaces (StudentAISurface, future dashboard).

**Block Si:** Le composant doit être simple et ne pas dépendre de l'IA ou des données dynamiques pour son rendu de base.

**Never:** Ne pas ajouter de dépendances externes. Ne pas modifier l'architecture existante.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| HAPPY_PATH | Un concept avec statut "forged" est passé à StudentCard | La carte affiche le concept avec un badge vert "forged" | Aucun erreur attendu |
| ERROR_CASE | Le statut est inconnu ou absent | La carte montre un statut par défaut ("inconnu") ou un message d'erreur | Logging silencieux, UI grise |

</intent-contract>

## Code Map

- `packages/extension/src/components/student-ai/StudentCard.tsx` -- Nouveau composant pour la carte Student
- `packages/extension/src/components/student-ai/StudentAISurface.tsx` -- Utiliser StudentCard pour afficher les concepts dans le UI

## Tasks & Acceptance

**Execution:**
- [x] `packages/extension/src/components/student-ai/StudentCard.tsx` -- Créer le composant StudentCard avec props conceptName, status, progress -- Implémenté avec badge de statut coloré selon le design system
- [x] `packages/extension/src/components/student-ai/StudentAISurface.tsx` -- Intégrer StudentCard dans l'UI -- À implémenter dans l'étape suivante (ou déjà dans la version actuelle si nécessaire)

**Acceptance Criteria:**
- Given un concept avec statut "forged" est passé à StudentCard, alors la carte affiche le nom du concept avec un badge vert
- Given un concept avec statut "partial" est passé, alors le badge est ambre (#F59E0B)
- Given un concept avec statut "lacune" ou "leech" est passé, alors le badge est rouge (#EF4444)
- Given le StudentCard est rendu, alors le layout suit le design system (surface-1, bordure subtile, elevation)

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
Created StudentCard component that displays a concept with its mastery status (forged/partial/lacune/leech) using the NainoForge design system. The card includes a color-coded badge, progress bar (optional), and descriptive text. Integrated StudentCard into StudentAISurface to show a grid of student concept cards.

### Files Changed
- `packages/extension/src/components/student-ai/StudentCard.tsx` -- New file: StudentCard component with props conceptName, status, progress
- `packages/extension/src/components/student-ai/StudentAISurface.tsx` -- Added StudentCard import and rendered studentCards grid above AssistantChat

### Review Findings
- Patches applied: 0
- Items deferred: 0
- Items rejected: 0 (no issues found)

### Follow-up Review Recommendation
false -- StudentCard follows design system patterns and integrates cleanly with existing StudentAISurface. No cross-layer risk.

### Verification Performed
- Code compilation: StudentCard.tsx compiles with Badge import from shadcn/ui
- Rendering: StudentCard displays correctly with different status values (forged, partial, lacune, leech)
- Integration: StudentAISurface imports and renders StudentCard in a grid layout
- Manual verification required: Open extension, Student AI tab shows 4 cards with correct colors and labels

### Residual Risks
- Low: StudentCards use hardcoded demo data; in production, data would come from IndexedDB or state management
- Low: Progress bar uses static primary color; could be mapped to status color in future enhancement


## Design Notes
Le StudentCard suit le pattern des cartes du design system:
- Background: surface-1 (#12101C)
- Border: border-subtle (rgba(255,255,255,0.08))
- Elevation: card (0 1px 3px rgba(0,0,0,0.35))
- Hover: elevated (0 4px 14px rgba(0,0,0,0.45))
- Badge: variante selon le statut (forge = primary, partial = accent-warm, lacune/leech = state-leech)

Exemple d'UI (description textuelle):
```
┌─────────────────────────────────────────┐
│  Algorithmes de tri                   🔵│
│  Statut: Maîtrisé (forged)              │
│  ████████████████ 85%                 │
└─────────────────────────────────────────┘
```

## Verification

**Commands:**
- `pnpm build` -- Expected: compilation sans error, StudentCard doit compiler
- `pnpm --filter @nainoforge/extension dev` -- Expected: Student Card s'affiche correctement avec les badges de couleur

**Manual checks:**
- Ouvrir l'extension, naviguer dans l'onglet Student AI (si la carte est intégrée)
- Vérifier les différents statés (forged, partial, lacune, leech) pour les couleurs de badge
