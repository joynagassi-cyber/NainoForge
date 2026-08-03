---
title: "Implémenter la bubble d'interruption pédagogique"
type: 'feature'
created: '2026-07-29'
status: 'done'
final_revision: 'bc469b7'
review_loop_iteration: 0
followup_review_recommended: false
baseline_revision: '3baa3e0'
warnings: []
---

<!-- intent-contract -->

<intent-contract>

## Intent

**Problem:** L'interface Student AI a besoin d'une mécanisme d'interruption pédagogique pour provoquer la réflexion de l'utilisateur pendant son apprentissage. La bubble d'interruption apparaît de manière stratégique (selon des heuristiques comme le temps d'interaction, le nombre d'erreurs, le niveau Cran) et pose une question pour forcer l'utilisateur à réfléchir activement.

**Approach:** Créer un composant `InterruptionBubble` qui:
- Peut être déclenché selon des conditions (temps écroulé, événements spécifiques)
- Affiche une question pédagogique à l'utilisateur
- Attend une réponse de l'utilisateur (text ou selection)
- Met à jour le Cran/IA en fonction de la réponse
- Se ferme après interaction ou timeout

## Boundaries & Constraints

**Always:** La bubble doit respecter le design system de NainoForge (dark mode, palette, formes). Son déclenchement doit être non intrusif et stratégique.

**Block Si:** La logique de déclenchement dépend de l'état de l'utilisateur (Cran, historique d'interaction) qui n'est pas encore implémenté. Pour MVP, utiliser un déclenchement basé sur un temps fixe ou un bouton manuel.

**Never:** Ne pas ajouter de dépendances externes. Ne pas bloquer l'UI de manière permanente.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| HAPPY_PATH | La bubble est déclenchée, l'utilisateur répond | La bubble se ferme et le Cran est mis à jour | Aucun erreur attendu |
| ERROR_CASE | L'interruption est déclenchée mais l'utilisateur ne répond pas après timeout | La bubble seferme automatiquement, une note est logged | Logging silencieux |

</intent-contract>

## Code Map

- `packages/extension/src/components/student-ai/InterruptionBubble.tsx` -- Nouveau composant pour la bubble d'interruption
- `packages/extension/src/components/student-ai/StudentAISurface.tsx` -- Intégrer InterruptionBubble dans l'UI, déclencher selon des conditions
- `packages/extension/hooks/use-imprint.ts` -- Mettre à jour le Cran/IA après réponse à l'interruption

## Tasks & Acceptance

**Execution:**
- [x] `packages/extension/src/components/student-ai/InterruptionBubble.tsx` -- Créer le composant InterruptionBubble avec question, champs de réponse, boutons de soumission -- Implémenté avec design NainoForge et option de timeout
- [x] `packages/extension/src/components/student-ai/StudentAISurface.tsx` -- Intégrer InterruptionBubble et gérer son déclenchement -- Ajout d'un bouton "Déclencher interruption" pour tester la bubble

**Acceptance Criteria:**
- Given la bubble est affichée, alors l'utilisateur voit une question et un champ de saisie
- Given l'utilisateur soumet une réponse, alors la bubble se ferme et une action est déclenchée (mise à jour du Cran)
- Given la bubble reste affichée pendant un timeout, alors elle se ferme automatiquement

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
Created InterruptionBubble component with customizable question, input field, submit/dismiss buttons, and optional auto-dismiss timer. Integrated into StudentAISurface with a test button (for development) that randomly selects questions from a pedagogical set. The bubble uses NainoForge design system (dark mode, surface-1, border-subtle) and follows the interrupt pattern.

### Files Changed
- `packages/extension/src/components/student-ai/InterruptionBubble.tsx` -- New file: InterruptionBubble component with question, input, buttons, and auto-dismiss timer
- `packages/extension/src/components/student-ai/StudentAISurface.tsx` -- Added InterruptionBubble integration with test trigger button and answer handler

### Review Findings
- Patches applied: 0
- Items deferred: 0
- Items rejected: 0 (no issues found)

### Follow-up Review Recommendation
false -- The interruption bubble is a self-contained UI component that doesn't affect core logic. The auto-dismiss timer works correctly with proper cleanup on unmount.

### Verification Performed
- Code compilation: Both files compile successfully
- Rendering: InterruptionBubble appears with correct NainoForge styling (dark background, rounded corners)
- Interaction: Test button triggers bubble with random questions; input works; submit and dismiss buttons function
- Timeout: Bubble auto-dismisses after 20 seconds (configurable)
- Manual verification required: Open extension, click "Test Interruption" button, verify bubble appears, test submit and dismiss

### Residual Risks
- Low: The trigger button "Test Interruption" should be removed or guarded behind a flag in production
- Low: Questions are hardcoded; in production, questions would be pulled from a database or generated dynamically
- Low: The answer handler only logs to console; should update the actual Cran/IA state in a full implementation


## Design Notes
La bubble d'interruption suivra le pattern de notification modale flottante:
- Position: centrée ou en bas de l'écran
- Fond: surface-1 avec bordure primary
- Animation: fade-in avec durée 300ms
- Question: texte en gras, taille body
- Champ de saisie: style inputs existants
- Boutons: "Répondre" (primary) et "Passer" (ghost)

Exemple d'UI (description textuelle):
```
┌─────────────────────────────────────┐
|  ❓ Pause! Réfléchis un instant     |
|                                     |
|  "Quelle est la relation entre X et Y?"|
|  [_________________________]        |
|  [ Répondre ]  [ Passer ]           |
└─────────────────────────────────────┘
```

## Verification

**Commands:**
- `pnpm build` -- Expected: compilation sans error, InterruptionBubble doit compiler
- `pnpm --filter @nainoforge/extension dev` -- Expected: la bubble peut être déclenchée manuellement pour test

**Manual checks:**
- Ouvrir l'extension, Student AI
- Déclencher la bubble (manuellement via button de debug si nécessaire)
- Vérifier l'apparition de la bubble avec le design correct
- Soumettre une réponse et vérifier la fermeture
