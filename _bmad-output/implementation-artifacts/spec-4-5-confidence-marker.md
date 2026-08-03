---
title: "Implémenter le marqueur de confiance (jauge Cran)"
type: 'feature'
created: '2026-07-29'
status: 'done'
final_revision: '294c960'
review_loop_iteration: 0
followup_review_recommended: false
baseline_revision: 'ca18064'
warnings: []
---

<!-- intent-contract -->

<intent-contract>

## Intent

**Problem:** L'IMPRINT et Student AI ont besoin d'une visualisation claire du niveau de Cran (niveau de maîtrise) de l'utilisateur. La barre de Cran existe déjà sous forme linéaire, mais un marqueur circulaire (jauge)提供更直观的视觉反馈. Le marqueur de confiance montre le Cran actuel (1-5) avec une couleur correspondante et un indicateur visuel.

**Approach:** Créer un composant `ConfidenceMarker` qui:
- Affiche une jauge circulaire (ou segmentée) représentant le Cran (1-5)
- Change de couleur selon le niveau (1=text-muted, 2=accent-warm, 3=primary, 4-5=state-forged + flame icon)
- Peut inclure un nombre ou un rang
- Est réactif aux changements de valeur

## Boundaries & Constraints

**Always:** Le marqueur doit respecter le design system de NainoForge (palette, formes, icônes). Il doit être compact et visible dans l'UI.

**Block Si:** La mise en œuvre d'une jauge circulaire complexisée peut nécessiter SVG ou librairie externe. Pour MVP, implémenter une version simple avec CSS et emoji/icones.

**Never:** Ne pas ajouter de dépendances externes. Ne pas modifier l'architecture existante.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| HAPPY_PATH | Cran = 3 est passé au marqueur | La jauge affiche le niveau 3 avec couleur primary et aucun flame | Aucun erreur attendu |
| ERROR_CASE | Cran est hors des bounds (0 ou >5) | Le marqueur utilise la valeur la plus proche valide (1 ou 5) | Logging silencieux |

</intent-contract>

## Code Map

- `packages/extension/src/components/ConfidenceMarker.tsx` -- Nouveau composant pour la jauge de Cran
- `packages/extension/src/components/imprint/ImprintSurface.tsx` -- Intégrer ConfidenceMarker pour afficher le Cran (remplacer ou compléter l'affichage textuel actuel)
- `packages/extension/src/components/student-ai/StudentAISurface.tsx` -- Intégrer ConfidenceMarker pour visualiser le Cran du student

## Tasks & Acceptance

**Execution:**
- [x] `packages/extension/src/components/ConfidenceMarker.tsx` -- Créer le composant ConfidenceMarker avec props cran (1-5), render une jauge circulaire avec couleur correspondante et icône flame pour cran >= 4 -- Implémenté
- [x] `packages/extension/src/components/imprint/ImprintSurface.tsx` -- Remplacer l'affichage texte "Cran X/5" par le composant ConfidenceMarker -- Intégré
- [n/a] `packages/extension/src/components/student-ai/StudentAISurface.tsx` -- Ajouter un affichage du Cran avec ConfidenceMarker si approprié -- Hors scope pour MVP (le Cran dans Student AI n'est pas encore lié à une source de données)

**Acceptance Criteria:**
- Given un Cran value (1-5) est passé à ConfidenceMarker, alors la jauge affiche la bonne couleur (muted pour 1, amber pour 2, primary pour 3, green pour 4-5)
- Given Cran >= 4, alors l'icône flame est affichée sur la jauge
- Given le Cran change, alors la jauge se met à jour avec la nouvelle couleur et icône
- Given un Cran invalid (0 ou >5), alors le marqueur utilise la valeur la plus proche valide (1 ou 5)

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
Created ConfidenceMarker component that visualizes the Cran (1-5) as a circular gauge with color-coded states (muted→amber→primary→green+flame) according to NainoForge design tokens. Integrated into ImprintSurface to replace the text-based Cran display. The marker supports dynamic updates and automatic clamping of out-of-range values.

### Files Changed
- `packages/extension/src/components/ConfidenceMarker.tsx` -- New file: ConfidenceMarker component with color states and flame icon for high Cran values
- `packages/extension/src/components/imprint/ImprintSurface.tsx` -- Replaced text "Cran X/5" with ConfidenceMarker component

### Review Findings
- Patches applied: 0
- Items deferred: 0
- Items rejected: 0 (no issues found)

### Follow-up Review Recommendation
false -- ConfidenceMarker is a simple, self-contained UI component with no side effects. Integration with ImprintSurface follows existing patterns.

### Verification Performed
- Code compilation: ConfidenceMarker.tsx compiles with lucide-react import
- Color states: verified for Cran 1 (text-muted), 2 (text-accent-warm), 3 (text-primary), 4-5 (text-state-forged + flame icon)
- Integration: ImprintSurface renders ConfidenceMarker with correct dynamic cran value
- Manual verification required: Open extension, IMPRINT tab, verify marker changes color as Cran varies (test by typing content)

### Residual Risks
- Low: The marker uses a simple circle; could be enhanced with a segment ring in a future iteration
- Low: The size prop defaults to "md" but "lg" is used in ImprintSurface for better visibility; could be adjusted
- Low: StudentAISurface integration is deferred to a future story (student-ai requires connecting to actual Cran data)


## Design Notes
Le ConfidenceMarker suit les règles de coloriage du DESIGN.md:
- Cran 1: text-muted (gris)
- Cran 2: accent-warm (#F59E0B) - orange
- Cran 3: primary (#7C3AED) - violet
- Cran 4-5: state-forged (#22C55E) - vert + icône flame

La jauge peut être implémentée comme un cercle segmenté (5 segments) ou un anneau de progression. Pour MVP, une version simple avec cercle coloré et icône centrée sera suffisante.

Exemple d'UI (description textuelle):
```
      🔥
    ╱     ╲
   |   5   |
    ╲     ╱
```
(Où le flame apparaît seulement pour Cran >= 4)

## Verification

**Commands:**
- `pnpm build` -- Expected: compilation sans error, ConfidenceMarker doit compiler
- `pnpm --filter @nainoforge/extension dev` -- Expected: le marqueur s'affiche avec les bonnes couleurs

**Manual checks:**
- Ouvrir l'extension, vérifier le Cran dans IMPRINT et Student AI
- Tester différents valeurs de Cran (1-5) pour voir les couleurs correctes
- Vérifier l'apparition de l'icône flame pour Cran >= 4
