---
title: "Finaliser le microcopy et le wording pour l'UX"
type: 'feature'
created: '2026-07-29'
status: 'completed'
review_loop_iteration: 0
followup_review_recommended: false
baseline_revision: 'ea6a097'
final_revision: '<待更新>'
warnings: []
description: >-
  Raffiner le microcopy (textes d'interface) pour améliorer la clarté, la
  cohérence linguistique et l'expérience utilisateur. Corriger les accords,
  les formulations et s'assurer d'un ton cohérent dans toute l'application.

acceptance_criteria:
  - "Tous les éléments du formulaire utilisent l'impératif ou la forme appropriée (ex: 'Commence par capturer' → 'Commencez par capturer')"
  - "Les accords genre/nombre sont corrects (contenu → contenus, concept → concepts, jour(s), heure(s))"
  - "Les états vides sont plus explicites et invitants (ex: 'Aucune source' → 'Aucune source capturée pour le moment')"
  - "Les titres et sous-titres sont claires et cohérents"
  - "Le ton de l'application est professionnel, encourageant et naturel (form VOUS dans Student AI)"
  - "La traduction en français est toujours correcte et naturelle"

implementation:
  - "Corriger l'accord dans HomeSurface: 'Chaine' → 'Chaîne', 'jours' → 'jour(s)', 'contenu capturé' → 'contenu(s) capturé(s)'"
  - "Changer l'impératif: 'Commence par capturer' → 'Commencez par capturer', 'Capture un contenu' → 'Capturez un contenu'"
  - "Améliorer l'état vide: 'Aucune source capturée' → 'Aucune source capturée pour le moment'"
  - "Dans StudentAISurface: changer 'tu' → 'vous' pour plus de politesse professionnelle"
  - "Améliorer le message d'erreur: 'Veuillez réessayer plus tard' → 'Réessayez plus tard'"
  - "Améliorer le label du spinner: 'Réflexion...' → 'En réflexion...'"
  - "Affiner les questions d'interruption pour un ton plus naturel et engageant"

files_affected:
  - src/components/layout/HomeSurface.tsx
  - src/components/student-ai/StudentAISurface.tsx
  - src/components/review/ReviewCard.tsx (aucun changement requis, mais vérifié)
