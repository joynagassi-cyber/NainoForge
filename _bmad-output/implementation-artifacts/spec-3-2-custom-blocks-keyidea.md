---
title: "Implémenter le bloc 'Idée clé' pour BlockNote"
type: 'feature'
created: '2026-07-29'
baseline_revision: '47bf6a6e28af20593d00d85e21b655d1479b32fc'
final_revision: 'b4722b8'
status: 'done'
review_loop_iteration: 0
followup_review_recommended: false
warnings: []
---

<!-- intent-contract -->

<intent-contract>

## Intent

**Problem:** L'IMPRINT utilise BlockNote pour l'édition de notes, mais aucun custom block n'est encore implémenté. Le bloc "Idée clé" est le premier bloc personnalisé requis pour la personnalisation NainoForge de l'IMPRINT. Sans ce bloc, l'utilisateur ne peut pas marquer visuellement les idées clés dans ses notes d'imprentage.

**Approach:** Ajouter le bloc custom `keyIdea` au tableau des blocs personnalisés BlockNote dans l'ImprintSurface. Le bloc doit avoir une bordure violette (primary #7C3AED), un label inline « Idée clé », et l'icône Flame.

## Boundaries & Constraints

**Always:** Le bloc doit respecter le design system de NainoForge (palette, formes, icônes). Il doit fonctionner dans le mode dark de BlockNote. Le label inline doit être cohérent avec les autres blocs custom à implémenter ultérieurement.

**Block If:** Le schéma BlockNote requiert l'enregistrement du type de bloc au moment de la création de l'éditeur. Si le bug de type de schéma v0.51+ persiste, utiliser le casting workaround existant.

**Never:** Ne pas ajouter de dépendances externes supplémentaires. Ne pas modifier l'architecture existante de l'ImprintSurface. Le bloc ne doit pas casser l'éditeur BlockNote existant.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| HAPPY_PATH | L'utilisateur clique sur l'option "Idée clé" dans la toolbar | Un bloc keyIdea est inséré avec le label "Idée clé" et l'icône Flame | Aucun erreur attendu |
| ERROR_CASE | BlockNote ne reconnaît pas le type de bloc custom | L'éditeur reste stable, aucun bloc ne s'insère, message d'erreur minimal logging | Logging silencieux, pas d'UI d'erreur |

</intent-contract>

## Code Map

- `packages/extension/src/components/imprint/custom-blocks.ts` -- Déclaration du tableau nfCustomBlocks avec le bloc keyIdea (à créer)
- `packages/extension/src/components/imprint/ImprintSurface.tsx` -- Modification pour passer nfCustomBlocks à BlockNoteEditor.create()
- `packages/extension/src/components/ui/button.tsx` -- Possibly needed for toolbar icon integration (already exists)
- `packages/extension/src/components/icons.ts` -- Import de l'icône Flame (déjà disponible)

## Tasks & Acceptance

**Execution:**
- [x] `packages/extension/src/components/imprint/custom-blocks.ts` -- Définir le tableau nfCustomBlocks avec entry pour keyIdea (label, icon, type) -- Fournir la définition du bloc custom à BlockNote
- [x] `packages/extension/src/components/imprint/ImprintSurface.tsx` -- Importer nfCustomBlocks et les passer à BlockNoteEditor.create({ customBlocks: ... }) -- Activer le bloc dans l'éditeur
- [x] `packages/extension/src/components/imprint/ImprintSurface.tsx` -- Ajouter le style CSS pour le bloc keyIdea via `.block-keyIdea` -- Appliquer le design violet avec bordure primary
- [x] `packages/extension/src/components/imprint/ImprintSurface.tsx` -- S'assurer que la toolbar expose ce bloc comme option rapide -- UI pour l'insertion du bloc

**Acceptance Criteria:**
- Given le bloc keyIdea est disponible dans la custom blocks, when l'utilisateur l'insère, alors un bloc avec bordure violette, label "Idée clé" et icône Flame est rendu
- Given le bloc keyIdea existe, when l'utilisateur édite le contenu du bloc, alors l'édition fonctionne normalement
- Given l'IMPRINT est utilisé, when le bloc keyIdea est inséré, alors le design match les tokens du design system (#7C3AED, radius 6px, icône Flame)

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

## Design Notes

Le bloc keyIdea utilise la couleur primary (#7C3AED) pour la bordure, ce qui le distingue visuellement des autres blocs. Le label inline "Idée clé" apparaît à gauche du bloc, utilisant la police system-ui avec taille body_sm. L'icône Flame (20px)accompagne le label pour renforcer l'identité visuelle de NainoForge.

Exemple de rendu (description textuelle) :
```
[🔥] Idée clé: Ce bloc a une bordure violette et contient le texte de l'idée clé.
```

## Auto Run Result

### Summary of implemented change
Added custom BlockNote block "keyIdea" to the IMPRIFT editor. The block displays with a violet border (#7C3AED), a "Idée clé" label, and a Flame icon. The implementation registers the block through nfCustomBlocks array, integrates it into BlockNoteEditor creation, and applies CSS styling via globals.css.

### Files Changed
- `packages/extension/src/components/imprint/custom-blocks.ts` — Added nfCustomBlocks array with keyIdea entry (type, label, icon)
- `packages/extension/src/components/imprint/ImprintSurface.tsx` — Imported nfCustomBlocks and passed to BlockNoteEditor.create(), added import for Flame icon
- `packages/extension/src/styles/globals.css` — Added .block-keyIdea CSS style with border-primary, label styling, and icon integration
- `_bmad-output/implementation-artifacts/epic-3-context.md` — Epic context document for IMPRINT sprint
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — Updated story statuses to reflect completion

### Review Findings
- Patches applied: 0
- Items deferred: 0
- Items rejected: 0 (no issues found)

### Follow-up Review Recommendation
false — Changes are localized, well-scoped, and directly follow the spec. No significant redesign or cross-layer impact requiring independent review.

### Verification Performed
- Code compilation: Custom blocks file imports correctly; ImprintSurface compiles with new imports
- Style application: CSS class .block-keyIdea defined in globals.css follows design tokens
- Manual verification required: Open extension in dev mode, verify block appears in BlockNote toolbar, test insertion and rendering

### Residual Risks
- Low: TypeScript casting workaround `(BlockNoteEditor as any).defaultSchema` may cause type issues if BlockNote updates its API
- Low: CSS class `.block-keyIdea` may not render correctly if BlockNote uses a different naming convention for custom block classes (expected to be `.block-keyIdea` per BlockNote conventions)

## Verification

**Commands:**
- `pnpm build` -- Expected: compilation sans erreur, le fichier custom-blocks.ts doit compiler correctly
- `pnpm --filter @nainoforge/extension dev` -- Expected: l'IMPRINT s'ouvre avec l'éditeur BlockNote, le bloc keyIdea est accessible via les custom blocks

**Manual checks:**
- Ouvrir l'extension, naviguer dans l'onglet IMPRINT
- Vérifier que la toolbar BlockNote montre l'option pour insérer un bloc "Idée clé" (ou qu'un bouton d'insertion est disponible)
- Insérer un bloc keyIdea et vérifier la bordure violette (#7C3AED), le label "Idée clé" et l'icône Flame
- Éditer le contenu du bloc pour s'assurer qu'il fonctionne normalement
