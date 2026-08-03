---
title: "Mode Application - Vue latérale vs plein écran complet"
type: 'feature'
created: '2026-07-30'
status: 'draft'
review_loop_iteration: 0
followup_review_recommended: false
baseline_revision: 'ea6a097'
final_revision: '<待更新>'
warnings: []
description: >-
  Permettre à l'utilisateur d'ouvrir NainoForge en mode application plein écran,
  hors du popup latéral traditionnel. Le mode app ouvre une nouvelle fenêtre/tab
  avec une version complète de l'interface, sans sidebar latéral ni en-tête réduit.
  Idéal pour un workflow plus immersive comme une application web autonome.

acceptance_criteria:
  - "Un bouton 'Fenêtre pleine' (icône Maximize) est disponible dans l'en-tête de l'extension"
  - "Le bouton ouvre une nouvelle tab avec la version complète de l'application"
  - "La version app n'a pas de sidebar ni d'en-tête réduit, occupant toute la largeur"
  - "Un bouton 'Fermer' est présent dans le coin supérieur droit du mode app"
  - "L'état et les données sont partagés entre les deux modes (via localStorage/storage)"
  - "Le mode app ferme correctement lorsque l'utilisateur clique sur Fermer"

implementation:
  - "Ajouter le composant Maximize2 icon dans SidePanelHeader.tsx et le handler onAppModeToggle"
  - "Implémenter handleAppModeToggle dans App.tsx qui utilise chrome.tabs.create pour ouvrir appMode.html?mode=app"
  - "Créer appMode.html (nouveau point d'entrée pour le mode application)"
  - "Créer appModeMain.tsx (entry point pour le mode app)"
  - "Modifier App.tsx pour détecter le mode via URL query paramètre et renderer une version full-width"
  - "Ajouter un bouton de fermeture (window.close()) dans l'interface du mode app"
  - "S'assurer que le partage d'état fonctionne via le système de stockage de l'extension"

files_affected:
  - src/components/layout/SidePanelHeader.tsx (ajout du bouton maximize)
  - src/App.tsx (gestion du mode app, chrome.tabs.create)
  - Nouveau: src/appMode.html
  - Nouveau: src/appModeMain.tsx
