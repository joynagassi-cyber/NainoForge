---
title: "Implémenter le bloc 'Amorce teach-back' pour BlockNote"
type: 'feature'
created: '2026-07-29'
status: 'in-review'
final_revision: '<to-be-filled-after-commit>'
review_loop_iteration: 0
followup_review_recommended: false
baseline_revision: '1b61b16'
warnings: []
---

<!-- intent-contract -->

<intent-contract>

## Intent

**Problem:** L'IMPRINT utilise BlockNote pour l'édition de notes, et les blocs "Idée clé", "Exemple" et "Analogie" ont été implémentés. Le bloc "Amorce teach-back" est le quatrième et dernier bloc personnalisé requis pour la personnalisation NainoForge de l'IMPRINT dans cette phase. Sans ce bloc, l'utilisateur ne peut pas marquer visuellement les amorces de teach-back dans ses notes d'imprentage.

**Approach:** Ajouter le bloc custom `teachBackSeed` au tableau des blocs personnalisés BlockNote dans l'ImprintSurface. Le bloc doit avoir une bordure neutre (muted/grise), un label inline « Amorce TB », et l'icône HelpCircle.

## Boundaries & Constraints

**Always:** Le bloc doit respecter le design system de NainoForge (palette, formes, icônes). Il doit fonctionner dans le mode dark de BlockNote. Le label inline doit être cohérent avec les autres blocs custom (keyIdea, example, analogy).

**Block If:** Le schéma BlockNote requiert l'enregistrement du type de bloc au moment de la création de l'éditeur. Le casting workaround `(BlockNoteEditor as any).defaultSchema` doit être utilisé.

**Never:** Ne pas ajouter de dépendances externes supplémentaires. Ne pas modifier l'architecture existante de l'ImprintSurface. Le bloc ne doit pas casser l'éditeur BlockNote existant.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| HAPPY_PATH | L'utilisateur clique sur l'option "Amorce TB" dans la toolbar | Un bloc teachBackSeed est inséré avec le label "Amorce TB" et l'icône HelpCircle | Aucun erreur attendu |
| ERROR_CASE | BlockNote ne reconnaît pas le type de bloc custom | L'éditeur reste stable, aucun bloc ne s'insère, message d'erreur minimal logging | Logging silencieux, pas d'UI d'erreur |

</intent-contract>

## Code Map

- `packages/extension/src/components/imprint/custom-blocks.ts` -- Ajouter entry teachBackSeed dans le tableau nfCustomBlocks
- `packages/extension/src/styles/globals.css` -- Ajouter le style CSS pour .block-teachBackSeed avec bordure neutre

## Tasks & Acceptance

**Execution:**
- [x] `packages/extension/src/components/imprint/custom-blocks.ts` -- Ajouter l'entry teachBackSeed à nfCustomBlocks (label, icon, type) -- Compléter le tableau des blocs personnalisés
- [x] `packages/extension/src/styles/globals.css` -- Ajouter le style CSS pour .block-teachBackSeed -- Appliquer le design neutre avec bordure text-muted

**Acceptance Criteria:**
- Given le bloc teachBackSeed est disponible dans la custom blocks, when l'utilisateur l'insère, alors un bloc avec bordure neutre, label "Amorce TB" et icône HelpCircle est rendu
- Given le bloc teachBackSeed existe, when l'utilisateur édite le contenu du bloc, alors l'édition fonctionne normalement
- Given l'IMPRINT est utilisé, when le bloc teachBackSeed est inséré, alors le design match les tokens du design system (couleur neutre, radius 6px, icône HelpCircle)

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
Added custom BlockNote block "teachBackSeed" to the IMPRINT editor. The block displays with a neutral border (text-muted), a "Amorce TB" label, and a HelpCircle icon. This completes the set of four custom blocks for the IMPRINT editor (keyIdea, example, analogy, teachBackSeed). The implementation added the teachBackSeed entry to nfCustomBlocks and applied CSS styling via globals.css.

### Files Changed
- `packages/extension/src/components/imprint/custom-blocks.ts` — Added teachBackSeed entry to nfCustomBlocks array (type, label, icon HelpCircle), completing the custom block set
- `packages/extension/src/styles/globals.css` — Added .block-teachBackSeed CSS style with border-text-muted, label styling, and icon integration

### Review Findings
- Patches applied: 0
- Items deferred: 0
- Items rejected: 0 (no issues found)

### Follow-up Review Recommendation
false — This completes the custom blocks pattern. Changes are fully aligned with established implementation from previous stories (keyIdea, example, analogy) and pose no new risk.

### Verification Performed
- Code compilation: custom-blocks.ts imports HelpCircle from lucide-react successfully; all four custom blocks defined
- Style application: CSS class .block-teachBackSeed defined in globals.css follows design tokens
- Manual verification required: Open extension in dev mode, verify all four custom blocks appear in BlockNote toolbar, test insertion and rendering for each

### Residual Risks
- Low: Same pattern as previous implementations — casting workaround for BlockNote schema. All four blocks follow consistent styling pattern.


## Design Notes
Le bloc teachBackSeed utilise une couleur neutre (grise/muted) pour la bordure, ce qui le distingue visuellement des autres blocs (keyIdea violet, example vert, analogy ambre). Le label inline "Amorce TB" apparaît à gauche du bloc, utilisant la police system-ui avec taille body_sm. L'icône HelpCircle (20px)accompagne le label pour renforcer l'identité visuelle de NainoForge.

Exemple de rendu (description textuelle)：
```
❓ Amorce TB: Ce bloc a une bordure neutre et contient une amorce de teach-back.
```

## Verification

**Commands:**
- `pnpm build` -- Expected: compilation sans erreur, le fichier custom-blocks.ts doit compiler correctly
- `pnpm --filter @nainoforge/extension dev` -- Expected: l'IMPRINT s'ouvre avec l'éditeur BlockNote, le bloc teachBackSeed est accessible via les custom blocks

**Manual checks:**
- Ouvrir l'extension, naviguer dans l'onglet IMPRINT
- Vérifier que la toolbar BlockNote montre l'option pour insérer un bloc "Amorce TB"
- Insérer un bloc teachBackSeed et vérifier la bordure neutre, le label "Amorce TB" et l'icône HelpCircle
- Éditer le contenu du bloc pour s'assurer qu'il fonctionne normalement
