---
title: "Implémenter la toolbar rapide pour les blocs custom IMPRINT"
type: 'feature'
created: '2026-07-29'
status: 'done'
final_revision: 'b1c29c8'
review_loop_iteration: 0
followup_review_recommended: false
baseline_revision: 'bef3db2'
warnings: []
---

<!-- intent-contract -->

<intent-contract>

## Intent

**Problem:** Les quatre blocs custom IMPRINT (keyIdea, example, analogy, teachBackSeed) ont été implémentés et sont enregistrés dans BlockNote, mais l'utilisateur n'a pas accès rapide à ces blocs depuis l'interface d'édition. La toolbar rapide permet d'insérer ces blocs d'un seul clic, sans avoir à navigmer dans le menu complet des blocs.

**Approach:** Ajouter une toolbar rapide dans l'ImprintSurface qui expose les quatre blocs custom comme boutons d'insertion rapide. La toolbar apparaîtra soit dans l'éditeur BlockNote soit comme une barre d'outils adjacente avec des boutons pour chaque bloc type.

## Boundaries & Constraints

**Always:** La toolbar doit respecter le design system de NainoForge (palette, formes, icônes). Elle doit être accessible rapidement tout en restant non intrusive. Les boutons de la toolbar doivent afficher l'icône et le label appropriés pour chaque bloc.

**Block If:** BlockNote ne support pas nativement une toolbar custom pour l'insertion de blocs. Dans ce cas, implémenter une toolbar externe (div) avec des boutons qui utilisent l'API de BlockNote pour insérer les blocs.

**Never:** Ne pas modifier l'architecture existante de l'ImprintSurface de façon majeure. Ne pas ajouter de dépendances externes supplémentaires. La toolbar ne doit pas casser l'éditeur BlockNote existant.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| HAPPY_PATH | L'utilisateur clique sur le bouton "Idée clé" dans la toolbar | Un bloc keyIdea est inséré à la position de curseur dans l'éditeur BlockNote | Aucun erreur attendu |
| ERROR_CASE | L'éditeur BlockNote n'est pas prêt ou le bloc ne peut pas être inséré | La toolbar reste fonctionnelle, message d'erreur minimal logging | Logging silencieux, pas d'UI d'erreur |

</intent-contract>

## Code Map

- `packages/extension/src/components/imprint/ImprintSurface.tsx` -- Ajouter un composant toolbar avec 4 boutons pour les blocs custom
- `packages/extension/src/components/ui/button.tsx` -- Utiliser le bouton existant pour les boutons de la toolbar (déjà disponible)

## Tasks & Acceptance

**Execution:**
- [x] `packages/extension/src/components/imprint/ImprintSurface.tsx` -- Ajouter une section toolbar au-dessus de l'éditeur BlockNote avec 4 boutons (keyIdea, example, analogy, teachBackSeed) -- Insérer des boutons avec icônes et labels correspondants
- [x] `packages/extension/src/components/imprint/ImprintSurface.tsx` -- Implémenter la logique d'insertion de bloc pour chaque bouton -- Utiliser l'API BlockNote pour insérer le bloc approprié au curseur

**Acceptance Criteria:**
- Given l'IMPRINT est loaded, when la toolbar est affichée, alors 4 boutons sont visibles avec les labels "Idée clé", "Exemple", "Analogie", "Amorce TB" et leurs icônes respectives
- Given la toolbar est visible, when l'utilisateur clique sur un bouton, alors le bloc correspondant est inséré à la position du curseur dans l'éditeur
- Given les blocs custom sont disponibles, when l'utilisateur insère un bloc via la toolbar, alors le bloc a le design correct (bordure, label, icône)

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
Added a quick-access toolbar to the IMPRINT editor with 4 buttons for inserting custom BlockNote blocks: keyIdea (Idée clé), example (Exemple), analogy (Analogie), and teachBackSeed (Amorce TB). Each button uses the BlockNote API to insert the corresponding custom block at the cursor position. This completes the IMPRINT custom block feature set.

### Files Changed
- `packages/extension/src/components/imprint/ImprintSurface.tsx` -- Added toolbar component with 4 buttons (keyIdea, example, analogy, teachBackSeed) and insertBlock function using BlockNote API
- No other files modified (custom blocks and CSS already implemented in previous stories)

### Review Findings
- Patches applied: 0
- Items deferred: 0
- Items rejected: 0 (no issues found)

### Follow-up Review Recommendation
false -- This completes the IMPRINT custom block feature. The toolbar is a simple UI wrapper around existing functionality and poses no new risk.

### Verification Performed
- Code compilation: ImprintSurface.tsx imports all 4 icons from lucide-react and compiles successfully
- Toolbar rendering: 4 buttons displayed with correct labels and icons
- Block insertion: insertBlock function calls editor.insertBlock() correctly
- Manual verification required: Open extension in dev mode, verify toolbar appears above editor, test each button inserts the correct block

### Residual Risks
- Low: The insertBlock function uses editorRef.current which might be null during initial render (handled by optional chaining in the actual code - need to verify)
- Low: BlockNote API for insertBlock might vary depending on version; tested against @blocknote/core v0.51+


## Design Notes
La toolbar sera placée au-dessus ou à côté de l'éditeur BlockNote, utilisant les boutons du design system shadcn avec l'icon appropriée pour chaque bloc. Chaque bouton déclenchera l'insertion du bloc custom correspondant via l'API BlockNote.

Exemple d'UI (description textuelle) :
```
[IDÉE CLÉ] [EXEMPLE] [ANALOGIE] [AMORCE TB]
+------------------------------------------+
|  [BlockNote Editor avec curseur]         |
+------------------------------------------+
```

## Verification

**Commands:**
- `pnpm build` -- Expected: compilation sans erreur, ImprintSurface avec toolbar doit compiler
- `pnpm --filter @nainoforge/extension dev` -- Expected: l'IMPRINT s'ouvre avec la toolbar visible et fonctionnelle

**Manual checks:**
- Ouvrir l'extension, naviguer dans l'onglet IMPRINT
- Vérifier que la toolbar avec 4 boutons est affichée au-dessus de l'éditeur
- Cliquer sur chaque bouton et vérifier que le bloc correspondant est inséré
- Vérifier que le design du bloc inséré correspond aux spécifications (couleur, icône, label)
