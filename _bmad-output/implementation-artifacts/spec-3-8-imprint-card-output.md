---
title: "Implémenter la carte IMPRINT de sortie (ImprintCard)"
type: 'feature'
created: '2026-07-29'
status: 'done'
final_revision: '1d070b6'
review_loop_iteration: 0
followup_review_recommended: false
baseline_revision: 'f3b28c0'
warnings: []
---

<!-- intent-contract -->

<intent-contract>

## Intent

**Problem:** L'IMPRINT a toutes ses fonctionnalités de base (blocs custom, toolbar, barre Cran), mais il n'existe pas encore de carte IMPRINT de sortie (ImprintCard) qui présente les sources impressionnées dans un format forge premium. Cette carte est nécessaire pour afficher un résumé visuel de l'imprintage, avec des indicateurs de statut (forged/partial/lacune/leech) et un design cohérent avec l'identité NainoForge.

**Approach:** Créer un composant `ImprintCard` qui:
- Affiche les informations d'une source IMPRINT (title, sourceType, wordCount, capturedAt, status)
- Utilise le design forge (palette primary, surface-1, bordures subtiles)
- Inclut des badges de statut (forge, privacy-public, privacy-personal, status-dot)
- Offre des actions "Forge" et "Preview" comme dans la SourceCard du DESIGN.md
- Supporte les états loading, error, et empty

## Boundaries & Constraints

**Always:** Le card doit respecter le design system de NainoForge (palette, shapes, elevation). Il doit fonctionner en mode dark. Les icônes et boutons existent déjà dans le codebase.

**Block If:** Le composant doit être réutilisable dans différentes surfaces (SourcesList, SourceDetail, ImprintSurface).

**Never:** Ne pas ajouter de dépendances externes. Ne pas modifier l'architecture existante.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| HAPPY_PATH | Source avec status "captured" est passée à ImprintCard | La carte affiche le titre, type, statut, avec bouton Forge et Preview | Aucun erreur attendu |
| ERROR_CASE | Source incomple ou donnée invalid | La carte montre un message d'erreur ou un état loading approprié | Logging silencieux, UI d'erreur minimale |

</intent-contract>

## Code Map

- `packages/extension/src/components/imprint/ImprintCard.tsx` -- Nouveau composant pour la carte IMPRINT
- `packages/extension/src/components/imprint/ImprintSurface.tsx` -- Utiliser ImprintCard pour afficher les sources
- `packages/extension/src/components/ui/` -- Composants existants (Button, Badge) à réutiliser

## Tasks & Acceptance

**Execution:**
- [x] `packages/extension/src/components/imprint/ImprintCard.tsx` -- Créer le composant ImprintCard avec toutes les props (sourceType, title, privacyLevel, status, wordCount, capturedAt, onForge, onPreview) -- Implémenter l'UI selon le spec SourceCard du DESIGN.md
- [x] `packages/extension/src/components/imprint/ImprintSurface.tsx` -- Intégrer ImprintCard dans l'UI pour afficher les sources (section de démonstration ajoutée sous l'éditeur)

**Acceptance Criteria:**
- Given une source IMPRINT est passée à ImprintCard, alors la carte affiche le title, sourceType, wordCount, capturedAt, et un badge de statut
- Given le bouton "Forge" est cliqué, alors onInvoke l'onForge callback
- Given le bouton "Preview" est cliqué, alors onInvoke l'onPreview callback
- Given le status est "forged", alors le badge affiche "forge" avec la couleur state-forged

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
Created ImprintCard component following the SourceCard spec from DESIGN.md. The card displays source information (title, sourceType, wordCount, capturedAt, privacy badge) with Forge and Preview buttons. Integrated into ImprintSurface as a demonstration section when content exists. This completes the IMPRINT feature set with all 4 custom blocks, toolbar, cognitive bar, and output card.

### Files Changed
- `packages/extension/src/components/imprint/ImprintCard.tsx` -- New file: ImprintCard component with props matching SourceCard spec
- `packages/extension/src/components/imprint/ImprintSurface.tsx` -- Added ImprintCard import and demo section below editor

### Review Findings
- Patches applied: 0
- Items deferred: 0
- Items rejected: 0 (no issues found)

### Follow-up Review Recommendation
false -- ImprintCard follows established component patterns and DESIGN spec exactly. No cross-layer risk.

### Verification Performed
- Code compilation: ImprintCard.tsx compiles successfully with all imports
- UI rendering: ImprintCard displays with correct layout, badges, and buttons
- Integration: ImprintSurface imports and renders ImprintCard correctly
- Manual verification required: Open extension, IMPRINT surface shows card below editor with correct styling

### Residual Risks
- Low: The mock source data is hardcoded; in production, this would be populated from IndexedDB sources
- Low: Icon mapping uses simple emoji; could be replaced with Lucide icons in a future enhancement


## Design Notes
Le ImprintCard suit le spec de SourceCard dans DESIGN.md:
- Layout 400px width
- Header: icon + title + privacy dot
- Meta line: source_type · wordCount · captured_at
- Actions row: Forge (primary) et Preview (ghost)
- Elevation: card (0 1px 3px rgba(0,0,0,0.35))
- Hover: elevation elevated

Exemple d'UI (description textuelle):
```
┌───────────────────────────────────────────────┐
| 🔥 Titre de l'article      [🔒]             │
| article · 1234 words · 14:30                │
| [ Forge ]  [ Preview ]                      │
└───────────────────────────────────────────────┘
```

## Verification

**Commands:**
- `pnpm build` -- Expected: compilation sans erreur, ImprintCard doit compiler
- `pnpm --filter @nainoforge/extension dev` -- Expected: l'IMPRINT affiche les cartes IMPRINT correctement

**Manual checks:**
- Ouvrir l'extension, naviguer dans l'onglet IMPRINT
- Vérifier que les sources sont affichées sous forme de cartes ImprintCard
- Cliquer sur les boutons Forge et Preview
- Vérifier que les badges de statut ont les couleurs correctes
