---
title: "Implémenter les transitions entre onglets pour l'UX"
type: 'feature'
created: '2026-07-29'
status: 'completed'
review_loop_iteration: 0
followup_review_recommended: false
baseline_revision: 'ea6a097'
final_revision: '<待更新>'
warnings: []
description: >-
  Ajouter des transitions fluides (fadeIn/fadeOut) lors du changement d'onglet
  dans l'application pour améliorer l'expérience utilisateur.

acceptance_criteria:
  - "Lorsque l'utilisateur clique sur un nouvel onglet, la surface actuelle s'estompe en arrière-plan et la nouvelle surface apparaît en douceur"
  - "La transition utilise une durée de 300ms avec un easing suave (easeOut)"
  - "Toutes les surfaces (Home, Review, Cosmos) participent aux transitions"
  - "Les animations fonctionnent sur tous les supports (desktop, mobile)"
  - "Pas de flickering ni de rupture visuelle lors des changements d'onglet"

implementation:
  - "Utiliser Framer Motion (<AnimatePresence> et <motion.div>) pour gérer les transitions"
  - "Dans App.tsx, envelopper chaque Surface dans un motion.div avec des props initial/animate/exit"
  - "Le mode 'wait' assure que la nouvelle surface apparaît avant que l'ancienne ne soit complètement exitée"
  - "Entrée: fade-in avec translation verticale (y: 20px → 0) sur 300ms"
  - "Sortie: fade-out avec translation (y: 0 → -20px) sur 300ms"

files_affected:
  - src/App.tsx (ajout de Framer Motion pour les transitions entre onglets)
  - src/components/layout/AppShell.tsx (ajout du prop onTabChange pour lier le changement d'onglet aux transitions)
