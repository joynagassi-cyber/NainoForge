---
title: "Établir une hiérarchie typographique cohérente et finale"
type: 'feature'
created: '2026-07-29'
status: 'completed'
review_loop_iteration: 0
followup_review_recommended: false
baseline_revision: 'ea6a097'
final_revision: '<待更新>'
warnings: []
description: >-
  Vérifier et établir une hiérarchie typographique cohérente dans toute
  l'application. Tous les titres, sous-titres, corps de texte et utilitaires
  utilisent les classes Tailwind appropriées pour garantir une expérience
  visuelle uniforme et professionnelle.

acceptance_criteria:
  - "Tous les titres principaux (pages/surfaces) utilisent text-h2"
  - "Tous les sous-titres de section et CardTitle utilisent text-h3"
  - "Tout le corps du texte utilise text-body ou variantes appropriées"
  - "Les textes secondaires, légendes, stats utilisent text-caption ou text-xs"
  - "La version number dans SettingsDialog utilise text-caption au lieu de text-sm"
  - "Hiérarchie visuelle claire sans mélange inapproprié de tailles"

implementation:
  - "Auditer tous les composants pour vérifier l'utilisation des classes typographiques"
  - "Confirmation que CardTitle utilise bien text-h3 (défini dans ui/card.tsx)"
  - "Confirmation que CardContent utilise bien text-body (défini dans ui/card.tsx)"
  - "Modifier SettingsDialog: remplacer text-sm → text-caption pour la version"
  - "Vérifier que HomeSurface, StudentAISurface, ImprintSurface, CosmosSurface utilisent tous h2/h3/caption/.body cohéremment"
  - "Confirmer la cohérence across all surfaces"

files_affected:
  - src/components/settings/SettingsDialog.tsx (mise à jour text-sm → text-caption)
  - Vérification des autres surfaces (aucun changement requis, déjà cohérents)
