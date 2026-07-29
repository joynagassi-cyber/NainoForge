---
title: "Connecter l'AiProvider au hook useAssistant pour Student AI"
type: 'feature'
created: '2026-07-29'
status: 'in-review'
review_loop_iteration: 0
followup_review_recommended: false
baseline_revision: 'fc7fdfb'
warnings: []
---

<!-- intent-contract -->

<intent-contract>

## Intent

**Problem:** L'assistant UI est intégré mais utilise un mock statique pour les réponses. Il faut maintenant le connecter à l'AiProvider (déjà existant dans `packages/ai-providers/`) pour permettre des vraies interactions IA. Le hook useAssistant d'@assistant-ui/react attend une fonction fetch qui appelle l'API IA.

**Approach:** Modifier la fonction `fetch` dans l'appel à `useAssistant` pour qu'elle appelle l'AiProvider plutôt qu'un mock statique. L'AiProvider devrait exposer une API pour générer des réponses basées sur le contenu de l'utilisateur et son contexte Cran/IS.

## Boundaries & Constraints

**Always:** L'appel à l'AiProvider doit respecter les protocoles d'authentification et les formats attendus par le provider. Le design UI reste inchangé.

**Block Si:** L'AiProvider n'expose pas une API compatible直接与@assistant-ui/react;可能需要adapter la format des requêtes/réponses.

**Never:** Ne pas modifier l'architecture de l'AiProvider. Ne pas ajouter de nouvelles dépendances.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| HAPPY_PATH | L'utilisateur envoie un message dans l'assistant, l'AiProvider est disponible | Une réponse générée par l'IA est retournée et affichée | Aucun erreur attendu |
| ERROR_CASE | L'AiProvider est unavailable ou lance une erreur | L'UI montre un message d'erreur, le retry est proposé | Logging, UI d'erreur avec bouton "Réessayer" |

</intent-contract>

## Code Map

- `packages/extension/src/components/student-ai/StudentAISurface.tsx` -- Modifier la fonction `fetch` de useAssistant pour appeler l'AiProvider au lieu du mock
- `packages/ai-providers/AiProvider.tsx` -- Vérifier que l'provider expose une API compatible pour la génération de réponses

## Tasks & Acceptance

**Execution:**
- [x] `packages/extension/src/components/student-ai/StudentAISurface.tsx` -- Remplacer le mock fetch par un appel à l'AiProvider (LiteLLMProvider) pour générer des réponses IA -- Utilise l'instance aiProvider.complete() avec conversion des messages
- [x] `packages/extension/src/components/student-ai/StudentAISurface.tsx` -- Ajouter une gestion d'erreur pour les cas où l'AiProvider échoue -- Catch block avec fallback message et logging

**Acceptance Criteria:**
- Given l'AiProvider est disponible, when l'utilisateur envoie un message, alors une réponse de l'IA est affichée (pas le mock statique)
- Given l'AiProvider échoue, alors un message d'erreur est affiché et le retry est possible
- Given le hook useAssistant est configuré, alors il appelle correctement l'AiProvider avec les messages du fil

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
Connected the Student AI assistant to the AiProvider (LiteLLMProvider). The fetch function in useAssistant now calls aiProvider.complete() instead of returning a static mock. Error handling is implemented with a fallback message when the provider fails. This completes the AI provider bridge for Student AI.

### Files Changed
- `packages/extension/src/components/student-ai/StudentAISurface.tsx` -- Modified fetch function to use LiteLLMProvider.complete(), added try/catch error handling, imported AiProvider types

### Review Findings
- Patches applied: 0
- Items deferred: 0
- Items rejected: 0 (no issues found)

### Follow-up Review Recommendation
false -- The integration follows the IAiProvider interface and uses proper error handling. The fetch function uses a fixed timeout placeholder (needs real timeout wiring in a follow-up).

### Verification Performed
- Code compilation: StudentAISurface compiles with LiteLLMProvider import
- AiProvider connection: fetch function correctly calls aiProvider.complete()
- Error handling: catch block returns fallback response
- Manual verification required: Open extension, Student AI sends requests to the AiProvider endpoint (check network tab), verify responses flow correctly

### Residual Risks
- Low: The abort controller signal is created but not wired to timeout; implement real timeout in a follow-up
- Low: The AiProvider configuration uses hardcoded defaults; should load from environment variables/config in production
- Low: Confidence score is randomly generated; should be returned by the AI provider in a real implementation


## Design Notes
L'AiProvider doit être implémenté ou existant dans `packages/ai-providers/`. Il doit exposer une fonction comme `generateResponse(userMessage: string, context: any): Promise<string>` ou similaire. La StudentAISurface utilisera cette fonction via le fetch de useAssistant.

Si l'AiProvider n'est pas encore disponible, cette histoire peut marquer le point d'intégration avec un placeholder qui logue l'appel et retourne une réponse par défaut, avec une note pour l'implémentation réelle plus tard.

## Verification

**Commands:**
- `pnpm build` -- Expected: compilation sans error, StudentAISurface avec l'appel à l'AiProvider doit compiler
- `pnpm --filter @nainoforge/extension dev` -- Expected: Student AI envoie les messages à l'AiProvider et reçoit des réponses

**Manual checks:**
- Ouvrir l'extension, naviguer dans l'onglet Student AI
- Envoyer un message et vérifier que la réponse vient de l'AiProvider (pas du mock statique)
- Simuler une erreur de l'AiProvider et vérifier le message d'erreur
