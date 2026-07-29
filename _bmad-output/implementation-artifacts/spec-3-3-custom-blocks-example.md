---
title: "Implémenter le bloc 'Exemple' pour BlockNote"
type: 'feature'
created: '2026-07-29'
status: 'in-review'
final_revision: '<to-be-filled-after-commit>'
review_loop_iteration: 0
followup_review_recommended: false
baseline_revision: 'b4722b8'
warnings: []
---

<!-- intent-contract -->

<intent-contract>

## Intent

**Problem:** L'IMPRINT utilise BlockNote pour l'édition de notes, et le bloc "Idée clé" a été implémenté. Le bloc "Exemple" est le deuxième bloc personnalisé requis pour la personnalisation NainoForge de l'IMPRINT. Sans ce bloc, l'utilisateur ne peut pas marquer visuellement les exemples dans ses notes d'imprentage.

**Approach:** Ajouter le bloc custom `example` au tableau des blocs personnalisés BlockNote dans l'ImprintSurface. Le bloc doit avoir une bordure verte (state-forged #22C55E), un label inline « Exemple », et l'icône BookOpen.

## Boundaries & Constraints

**Always:** Le bloc doit respecter le design system de NainoForge (palette, formes, icônes). Il doit fonctionner dans le mode dark de BlockNote. Le label inline doit être cohérent avec les autres blocs custom (keyIdea, future example/analogy/teachBackSeed).

**Block If:** Le schéma BlockNote requiert l'enregistrement du type de bloc au moment de la création de l'éditeur. Le casting workaround `(BlockNoteEditor as any).defaultSchema` doit être utilisé.

**Never:** Ne pas ajouter de dépendances externes supplémentaires. Ne pas modifier l'architecture existante de l'ImprintSurface. Le bloc ne doit pas casser l'éditeur BlockNote existant.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| HAPPY_PATH | L'utilisateur clique sur l'option "Exemple" dans la toolbar | Un bloc example est inséré avec le label "Exemple" et l'icône BookOpen | Aucun erreur attendu |
| ERROR_CASE | BlockNote ne reconnaît pas le type de bloc custom | L'éditeur reste stable, aucun bloc ne s'insère, message d'erreur minimal logging | Logging silencieux, pas d'UI d'erreur |

</intent-contract>

## Code Map

- `packages/extension/src/components/imprint/custom-blocks.ts` -- Ajouter entry pour example dans le tableau nfCustomBlocks
- `packages/extension/src/styles/globals.css` -- Ajouter le style CSS pour .block-example avec bordure state-forged (#22C55E)

## Tasks & Acceptance

**Execution:**
- [x] `packages/extension/src/components/imprint/custom-blocks.ts` -- Ajouter l'entry example à nfCustomBlocks (label, icon, type) -- Étendre le tableau des blocs personnalisés
- [x] `packages/extension/src/styles/globals.css` -- Ajouter le style CSS pour .block-example -- Appliquer le design vert avec bordure state-forged

**Acceptance Criteria:**
- Given le bloc example est disponible dans la custom blocks, when l'utilisateur l'insère, alors un bloc avec bordure verte, label "Exemple" et icône BookOpen est rendu
- Given le bloc example existe, when l'utilisateur édite le contenu du bloc, alors l'édition fonctionne normalement
- Given l'IMPRINT est utilisé, when le bloc example est inséré, alors le design match les tokens du design system (#22C55E, radius 6px, icône BookOpen)

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
Added custom BlockNote block "example" to the IMPRINT editor. The block displays with a green border (state-forged #22C55E), a "Exemple" label, and a BookOpen icon. The implementation extended the nfCustomBlocks array with the example entry and applied CSS styling via globals.css.

### Files Changed
- `packages/extension/src/components/imprint/custom-blocks.ts` — Added example entry to nfCustomBlocks array (type, label, icon BookOpen)
- `packages/extension/src/styles/globals.css` — Added .block-example CSS style with border-state-forged, label styling, and icon integration

### Review Findings
- Patches applied: 0
- Items deferred: 0
- Items rejected: 0 (no issues found)

### Follow-up Review Recommendation
false — Changes are localized, follow the same pattern as the previous keyIdea implementation, and pose no cross-layer risk.

### Verification Performed
- Code compilation: Custom blocks file imports correctly; BookOpen icon from icons.ts
- Style application: CSS class .block-example defined in globals.css follows design tokens
- Manual verification required: Open extension in dev mode, verify block appears in BlockNote toolbar, test insertion and rendering

### Residual Risks
- Low: Same as keyIdea implementation — TypeScript casting workaround and potential BlockNote class naming convention.


## Design Notes
Le bloc example utilise la couleur state-forged (#22C55E) pour la bordure, ce qui le distingue visuellement du bloc keyIdea (violet). Le label inline "Exemple" apparaît à gauche du bloc, utilisant la police system-ui avec taille body_sm. L'icône BookOpen (20px)accompagne le label pour renforcer l'identité visuelle de NainoForge.

Exemple de rendu (description textuelle) :
```
📖 Exemple: Ce bloc a une bordure verte et contient un exemple.
```

## Verification

**Commands:**
- `pnpm build` -- Expected: compilation sans erreur, le fichier custom-blocks.ts doit compiler correctly
- `pnpm --filter @nainoforge/extension dev` -- Expected: l'IMPRINT s'ouvre avec l'éditeur BlockNote, le bloc example est accessible via les custom blocks

**Manual checks:**
- Ouvrir l'extension, naviguer dans l'onglet IMPRINT
- Vérifier que la toolbar BlockNote montre l'option pour insérer un bloc "Exemple"
- Insérer un bloc example et vérifier la bordure verte (#22C55E), le label "Exemple" et l'icône BookOpen
- Éditer le contenu du bloc pour s'assurer qu'il fonctionne normalement
