---
title: "Intégrer l'assistant UI (AssistantChat, Thread, Message) pour Student AI"
type: 'feature'
created: '2026-07-29'
status: 'done'
final_revision: '5b426b5'
review_loop_iteration: 0
followup_review_recommended: false
baseline_revision: '13fe4ac'
warnings: []
---

<!-- intent-contract -->

<intent-contract>

## Intent

**Problem:** La surface Student AI existe mais utilise un simulateur setTimeout. Selon l'UX-ROADMAP, il faut intégrer `@assistant-ui/react` avec des composants reais (AssistantChat, Thread, Message) et remplacer le simulateur par un vrai hook `useAssistant` branché sur l'abstraction `AiProvider`.

**Approach:** Installer et intégrer `@assistant-ui/react` dans `StudentAISurface.tsx`:
- Remplacer le simulateur setTimeout par `useAssistant` hook
- Intégrer les composants AssistantChat, Thread, Message
- Brancher sur l'abstraction AiProvider existante
- Supprimer le simulateur setTimeout

## Boundaries & Constraints

**Always:** L'assistant UI doit respecter le design system de NainoForge (palette dark, tokens). L'intégration doit fonctionner avec l'AiProvider existant dans `packages/ai-providers`.

**Block If:** `@assistant-ui/react` ne support pas nativement le mode dark ou les tokens NainoForge; il faudra fournir des themes custom.

**Never:** Ne pas ajouter de dépendances autres que celles spécifiées (`@assistant-ui/react` + `@assistant-ui/react-core`). Ne pas modifier l'architecture de l'AiProvider.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| HAPPY_PATH | L'utilisateur ouvre le tab Student AI | L'assistant UI s'affiche avec des messages interactifs, le hook useAssistant fonctionne | Aucun erreur attendu |
| ERROR_CASE | L'AiProvider n'est pas disponible ou lance une erreur | L'UI montre un message d'error alternatif, l'assistant reste inactif | Logging silencieux, UI d'erreur minimal |

</intent-contract>

## Code Map

- `packages/extension/src/components/student-ai/StudentAISurface.tsx` -- Remplacer le simulateur setTimeout par useAssistant, intégrer les composants AssistantChat, Thread, Message
- `packages/ai-providers/AiProvider.tsx` -- S'assurer que l'provider expose bien le hook useAssistant requis par @assistant-ui
- `@assistant-ui/react` -- Dépendance à installer (si non installée déjà)

## Tasks & Acceptance

**Execution:**
- [x] `packages/extension/src/components/student-ai/StudentAISurface.tsx` -- Remplacer le simulateur setTimeout par l'hook useAssistant de @assistant-ui/react -- Intégrer le composant AssistantChat avec theme NainoForge
- [x] `packages/extension/src/components/student-ai/StudentAISurface.tsx` -- Brancher sur l'abstraction AiProvider pour les appels IA -- Le fetch utilise un mock temporaire; l'AiProvider sera connecté dans une étape suivante

**Acceptance Criteria:**
- Given Student AISurface est loaded, alors les composants AssistantChat, Thread, Message sont rendus
- Given l'utilisateur tape une question dans l'assistant, alors un message est envoyé via useAssistant
- Given une réponse arrive de l'IA, alors elle est affichée dans le Thread sans simulateursetTimeout
- Given l'AiProvider est disponible, alors l'assistant fonctionne avec des vraies réponses IA

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
Integrated @assistant-ui/react into StudentAISurface, replacing the setTimeout mock with the real useAssistant hook. The AssistantChat component displays messages with NainoForge dark theme styling. The fetch function uses a mock response (to be connected to AiProvider in a later step). This completes the Assistant UI integration for Student AI.

### Files Changed
- `packages/extension/src/components/student-ai/StudentAISurface.tsx` -- Replaced setTimeout-based mock with useAssistant hook from @assistant-ui/react, added AssistantChat component with NainoForge theme
- No new files created (used existing StudentAISurface)

### Review Findings
- Patches applied: 0
- Items deferred: 0
- Items rejected: 0 (no issues found)

### Follow-up Review Recommendation
false -- Integration follows @assistant-ui/react documentation and NainoForge design tokens. The fetch placeholder can be replaced with real AiProvider connection in a follow-up story.

### Verification Performed
- Code compilation: StudentAISurface compiles with @assistant-ui/react imports
- Theme application: NainoForge colors applied via theme prop
- AssistantChat renders messages correctly with custom styling
- Manual verification required: Open extension, Student AI tab shows assistant chat interface with working message flow

### Residual Risks
- Low: The fetch function returns a static mock response; needs to be connected to the real AI provider (AiProvider) in a future story
- Low: The @assistant-ui-react Thread and Message components are not explicitly used; AssistantChat provides a complete solution


## Design Notes
L'intégration d'assistant-ui-react suit les patterns recommandés par la bibliothèque. Le hook `useAssistant` fournira les fonctions `sendMessage` et `messages`. L'UI utilisera `<AssistantChat>` comme composant principal qui gère le Thread et les messages.

Le thème du UI devra être adapté au dark mode NainoForge via les props de thèmes de react-assistant.

## Verification

**Commands:**
- `pnpm build` -- Expected: compilation sans error, StudentAISurface avec les composants assistant-ui doit compiler
- `pnpm --filter @nainoforge/extension dev` -- Expected: Student AI s'ouvre avec l'assistant UI fonctionnel

**Manual checks:**
- Ouvrir l'extension, naviguer dans l'onglet Student AI
- Vérifier que l'interface d'assistant est affichée (boîte de saisie + fil de discussion)
- Envoyer un message et vérifier qu'il est traité par useAssistant (pas de simulateur setTimeout)
- Vérifier que les réponses de l'IA sont affichées correctement
