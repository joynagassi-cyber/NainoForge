---
title: "Assurer la cohérence des icônes dans l'interface"
type: 'feature'
created: '2026-07-29'
status: 'completed'
review_loop_iteration: 0
followup_review_recommended: false
baseline_revision: 'ea6a097'
final_revision: '<待更新>'
warnings: []
description: >-
  Vérifier et uniformiser l'utilisation des icônes (lucide-react) pour assurer
  une cohérence visuelle globale dans l'application. Toutes les icônes d'interface
  (navigation, boutons, en-têtes) doivent avoir la même taille standard.

acceptance_criteria:
  - "Toutes les icônes d'interface (navigation, boutons, en-têtes) utilisent h-5 w-5 (20px)"
  - "Les icônes principales (logo, indicateurs) peuvent utiliser des tailles adaptées (w-6 h-6 ou w-3 h-3) selon leur contexte"
  - "Aucun mélange de tailles incohérentes dans le même contexte UI"
  - "L'icône Send dans le bouton Student AISurface est maintenant cohérente (h-5 w-5)"

implementation:
  - "Standardiser les icônes d'interface à h-5 w-5 (Sidebar, SidePanelHeader, StudentAISurface)"
  - "Vérifier et mettre à jour toutes les occurrences d'icônes dans l'application"
  - "Corriger le bouton Send dans StudentAISurface (passé de h-4 w-4 à h-5 w-5)"
  - "Confirmer que les icônes dans Sidebar et SidePanelHeader ont h-5 w-5"

files_affected:
  - src/components/layout/Sidebar.tsx (icônes à h-5 w-5)
  - src/components/layout/SidePanelHeader.tsx (à h-5 w-5)
  - src/components/student-ai/StudentAISurface.tsx (Send icon mis à jour à h-5 w-5)
