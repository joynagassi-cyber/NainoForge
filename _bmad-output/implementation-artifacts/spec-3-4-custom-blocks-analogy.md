---
title: "Implémenter le bloc 'Analogie' pour BlockNote"
type: 'feature'
created: '2026-07-29'
status: 'in-review'
final_revision: '<to-be-filled-after-commit>'
review_loop_iteration: 0
followup_review_recommended: false
baseline_revision: '1c383ef'
warnings: []
---

<!-- intent-contract -->

<intent-contract>

## Intent

**Problem:** L'IMPRINT utilise BlockNote pour l'édition de notes, et les blocs "Idée clé" et "Exemple" ont été implémentés. Le bloc "Analogie" est le troisième bloc personnalisé requis pour la personnalisation NainoForge de l'IMPRINT. Sans ce bloc, l'utilisateur ne peut pas marquer visuellement les analogies dans ses notes d'imprentage.

**Approach:** Ajouter le bloc custom `analogy` au tableau des blocs personnalisés BlockNote dans l'ImprintSurface. Le bloc doit avoir une bordure ambre (accent-warm #F59E0B), un label inline « Analogie », et l'icône Sparkles.

## Boundaries & Constraints

**Always:** Le bloc doit respecter le design system de NainoForge (palette, formes, icônes). Il doit fonctionner dans le mode dark de BlockNote. Le label inline doit être cohérent avec les autres blocs custom (keyIdea, example, future teachBackSeed).

**Block If:** Le schéma BlockNote requiert l'enregistrement du type de bloc au moment de la création de l'éditeur. Le casting workaround `(BlockNoteEditor as any).defaultSchema` doit être utilisé.

**Never:** Ne pas ajouter de dépendances externes supplémentaires. Ne pas modifier l'architecture existante de l'ImprintSurface. Le bloc ne doit pas casser l'éditeur BlockNote existant.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| HAPPY_PATH | L'utilisateur clique sur l'option "Analogie" dans la toolbar | Un bloc analogy est inséré avec le label "Analogie" et l'icône Sparkles | Aucun erreur attendu |
| ERROR_CASE | BlockNote ne reconnaît pas le type de bloc custom | L'éditeur reste stable, aucun bloc ne s'insère, message d'erreur minimal logging | Logging silencieux, pas d'UI d'erreur |

</intent-contract>

## Code Map

- `packages/extension/src/components/imprint/custom-blocks.ts` -- Ajouter entry pour analogy dans le tableau nfCustomBlocks
- `packages/extension/src/styles/globals.css` -- Ajouter le style CSS pour .block-analogy avec bordure accent-warm (#F59E0B)

## Tasks & Acceptance

**Execution:**
- [x] `packages/extension/src/components/imprint/custom-blocks.ts` -- Ajouter l'entry analogy à nfCustomBlocks (label, icon, type) -- Étendre le tableau des blocs personnalisés
- [x] `packages/extension/src/styles/globals.css` -- Ajouter le style CSS pour .block-analogy -- Appliquer le design ambre avec bordure accent-warm

**Acceptance Criteria:**
- Given le bloc analogy est disponible dans la custom blocks, when l'utilisateur l'insère, alors un bloc avec bordure ambre, label "Analogie" et icône Sparkles est rendu
- Given le bloc analogy existe, when l'utilisateur édite le contenu du bloc, alors l'édition fonctionne normalement
- Given l'IMPRINT est utilisé, when le bloc analogy est inséré, alors le design match les tokens du design system (#F59E0B, radius 6px, icône Sparkles)

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
Added custom BlockNote block "analogy" to the IMPRINT editor. The block displays with an amber border (accent-warm #F59E0B), a "Analogie" label, and a Sparkles icon. The implementation extended the nfCustomBlocks array with the analogy entry and applied CSS styling via globals.css.

### Files Changed
- `packages/extension/src/components/imprint/custom-blocks.ts` — Added analogy entry to nfCustomBlocks array (type, label, icon Sparkles)
- `packages/extension/src/styles/globals.css` — Added .block-analogy CSS style with border-accent-warm, label styling, and icon integration

### Review Findings
- Patches applied: 0
- Items deferred: 0
- Items rejected: 0 (no issues found)

### Follow-up Review Recommendation
false — Changes are localized, follow the established pattern from keyIdea and example implementations, and pose no cross-layer risk.

### Verification Performed
- Code compilation: custom-blocks.ts imports Sparkles from lucide-react successfully
- Style application: CSS class .block-analogy defined in globals.css follows design tokens
- Manual verification required: Open extension in dev mode, verify block appears in BlockNote toolbar, test insertion and rendering

### Residual Risks
- Low: Same as previous implementations — TypeScript casting workaround and potential BlockNote class naming convention.


## Design Notes
Le bloc analogy utilise la couleur accent-warm (#F59E0B) pour la bordure, ce qui le distingue visuellement des autres blocs (keyIdea violet, example vert). Le label inline "Analogie" apparaît à gauche du bloc, utilisant la police system-ui avec taille body_sm. L'icône Sparkles (20px)accompagne le label pour renforcer l'identité visuelle de NainoForge.

Exemple de rendu (description textuelle) :
```
✨ Analogie: Ce bloc a une bordure ambre et contient une analogie.
```

## Verification

**Commands:**
- `pnpm build` -- Expected: compilation sans erreur, le fichier custom-blocks.ts doit compiler correctly
- `pnpm --filter @nainoforge/extension dev` -- Expected: l'IMPRINT s'ouvre avec l'éditeur BlockNote, le bloc analogy est accessible via les custom blocks

**Manual checks:**
- Ouvrir l'extension, naviguer dans l'onglet IMPRINT
- Vérifier que la toolbar BlockNote montre l'option pour insérer un bloc "Analogie"
- Insérer un bloc analogy et vérifier la bordure ambre (#F59E0B), le label "Analogie" et l'icône Sparkles
- Éditer le contenu du bloc pour s'assurer qu'il fonctionne normalement
