# Epic 3 Context: IMPRINT Workspace Premium

## Source Document
UX-ROADMAP.md — Sprint UX-03

## Description
L'épicé IMPRINT vise à transformer la surface IMPRINT en un workspace premium avec des blocs personnalisés BlockNote, une barre d'outils custom, un feedback cognitif inline et une carte de sortie IMPRINT style forge premium.

## Statut Actuel
- BlockNote installé et intégré dans `ImprintSurface.tsx`
- Sans custom blocks et avec thème par défaut
- Le cœur de l'IMPRINT est fonctionnel mais manque de personnalisation NainoForge

## Architecture du Package
Fichiers clés :
- `packages/imprint/src/components/ImprintSurface.tsx` — Surface principale
- `packages/extension/src/components/imprint/` — Composants IMPRINT
- `packages/imprint/src/` — Logique métier IMPRINT, scoring Cran

## Blocs Personnisés à Implémenter (customBlocks BlockNote)
Chaque bloc doit avoir une bordure distinctive et un label inline :

1. **keyIdea** (Idée clé)
   - Bordure violette (primary: #7C3AED)
   - Label inline « Idée clé »
   - Icône: Flame (flamme)

2. **example** (Exemple)
   - Bordure verte (#22C55E — state-forged)
   - Label « Exemple »
   - Icône: BookOpen (livre ouvert)

3. **analogy** (Analogie)
   - Bordure ambre (#F59E0B — accent-warm)
   - Label « Analogie »
   - Icône: Sparkles (étincelles)

4. **teachBackSeed** (Amorce teach-back)
   - Bordure muted (grise)
   - Label « Amorce TB »
   - Icône: HelpCircle (cercle d'aide)

## Code Map — Implementation Path
1. Définir le tableau `nfCustomBlocks` dans `packages/extension/src/components/imprint/custom-blocks.ts`
2. Intégrer ces blocs dans `BlockNoteEditor.create({ customBlocks: nfCustomBlocks })` dans `ImprintSurface.tsx`
3. Définir le style CSS pour chaque type de bloc via `.block.keyIdea`, `.block.example`, etc.
4. Personnaliser la toolbar pour exposer ces blocs comme actions rapides
5. Ajouter le feedback cognitif (barre de Cran déjà présente à cábler)

## Design Notes
- Les bordures des blocs doivent suivre le palette design tokens (primary, state-forged, accent-warm)
- Les icônes doivent utiliser l'icon set du design system (IconProps avec size=sm et color approprié)
- Le label inline doit apparaître à gauche du bloc, avec un style cohérent avec les autres tags IMPRINT

## Known Constraints
- BlockNote utilise un système de custom blocks qui requiert l'enregistrement des types au moment de l'initialisation de l'éditeur
- Les custom blocks doivent être définis avant la création de l'éditeur
- L'extension BlockNote doit être configurée pour inclure les extensions de schéma pour chaque custom block type

## Continuity — Leçons des histoires précédentes
- Épicé 1 (Fondation): design tokens figés, palette #7C3AED/#0A0A0F确立
- Épicé 2 (App Shell): layout sidepanel 400px, tab navigation home/review/cosmos established
- Blocs existent déjà dans le code existant, mais non personnalisés pour NainoForge

## Acceptance Criteria (Draft)
- [x] Bloc "Idée clé" avec bordure primary + label "Idée clé" + icône Flame
- [x] Bloc "Exemple" avec bordure state-forged + label "Exemple" + icône BookOpen
- [x] Bloc "Analogie" avec bordure accent-warm + label "Analogie" + icône Sparkles
- [x] Bloc "TeachBackSeed" avec bordure muted + label "Amorce TB" + icône HelpCircle
- [x] Toolbar expose ces 4 blocs comme actions rapides
- [x] Les blocs rendus correctement dans l'éditeur BlockNote
- [x] Aucun regress dans l'IMPRINT existant

## Date de Compilation
2026-07-29
