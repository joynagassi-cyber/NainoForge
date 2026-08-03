---
title: "Implémenter les notifications toast pour les messages d'UI"
type: 'feature'
created: '2026-07-29'
status: 'completed'
review_loop_iteration: 0
followup_review_recommended: false
baseline_revision: 'ea6a097'
final_revision: '<待更新>'
warnings: []
description: >-
  Ajouter un système de notifications toast (notifications temporaires) pour
  informer l'utilisateur des actions terminées, erreurs ou états du système.
  Les toasts apparaissent en bas-right et disparaissent automatiquement après
  quelques secondes.

acceptance_criteria:
  - "Un composant ToastManager existe qui gère la file d'attente des notifications"
  - "Les toasts apparaissent en bas-droite de l'écran avec une animation d'entrée"
  - "Chaque toast se masque automatiquement après 4 secondes"
  - "L'utilisateur peut cacher un toast manuellement en cliquant sur 'Fermer'"
  - "Plusieurs toasts sont empilés verticalement avec un léger décalage temporel"
  - "Les toasts utilisent le design cohérent avec le reste de l'application (Tailwind, tokens)"

implementation:
  - "Créer un composant Toast dans src/components/ui/Toast.tsx avec Framer Motion"
  - "Créer un contexte de gestion des toasts src/contexts/ToastContext.tsx"
  - "Créer un hook useToastCustom src/hooks/use-toast.ts pour une utilisation facile"
  - "Intégrer le ToastProvider dans App.tsx pour render les toasts globaux"
  - "Les toasts incluent 4 variants: success, error, info, warning avec icônes et couleurs distinctes"
  - "Animation d'entrée: fade-in avec translation de gauche (x: 20 → 0)"
  - "Animation de sortie: fade-out avec translation (x: 0 → 20)"
  - "Durée: 200ms pour les animations, 4000ms pour l'auto-disparition"

files_affected:
  - src/components/ui/Toast.tsx
  - src/contexts/ToastContext.tsx
  - src/hooks/use-toast.ts
  - src/types.ts
  - src/App.tsx (ajout de ToastProvider)
