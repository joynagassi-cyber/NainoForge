# NainoForge — Product Brief

> **Version:** 1.0 | **Crée:** 2026-08-03 | **Source:** PRD v0.1.0 + DESIGN.md Neuro-Technical

---

## 1. Projet

- **Type:** Extension Chrome (MV3) — pas une application mobile
- **Contexte:** Three rendering contexts — Popup · Side Panel · App Mode
- **Public cible:** Professionnels, ingenieurs, chercheurs, autodidactes techniques
- **Langue:** Anglais (prioritaire), Francais (S2)

## 2. Probleme

Les professionnels passent des heures à **consommer** du contenu (articles, vidéos, PDFs). La plupart n'est jamais transforme en connaissance durable.

## 3. Vision

**NainoForge transforme la consommation passive en forge active.**

Pipeline: Capture → Forge (IMPRINT) → Review (FSRS) → Master (COSMOS)

## 4. Positionnement

| Avant | Avec NainoForge |
|---|---|
| Consommer sans transformer | Écrire → mesurer → réviser optimisé |
| Notes non évaluees | IQS + Cran IMPRINT mesurés automatiquement |
| Anki/SM-2 standard | FSRS (état de l'art) |
| Pas de vue sur lacunes | COSMOS (arbre sémantique + Gap Detection) |

## 5. Modeles Économiques

| Tier | Prix/mois | Cible |
|---|---|---|
| Starter | $10 | Étudiants |
| Pro | $20 | Professionnels |
| Power | $49 | Recherecheurs |

## 6. Success Criteria

| Métrique | Cible J+180 |
|---|---|
| Installs CWS | 2,000,000 |
| Conversion install→paid | 10% |
| Revenue mensuel | $200,000 |
| Retention J+30 | ≥35% |
| NPS | ≥60 |
| SMI moyen | ≥68% |

## 7. Contraintes

### Techniques
- Chrome Extension MV3 | IndexedDB source de vérité | FSRS WASM | Offline-first

### Design
- Dark mode only | Neuro-Technical aesthetic | Monochromatic palette (white accent)
- 3 contextes: Popup (400×600), Side Panel (320-560px), App Mode (≥800px)
- Inter font, aucune couleur hardcodée en JSX

### Compliance
- RGPD, CCPA/CPRA | 3 niveaux confidentialité | Clés API dans Chrome Secret Storage

## 8. Technologies

| Couche | Choix |
|---|---|
| Framework | React 19 + Vite 8 |
| CSS | Tailwind CSS v4 + @theme |
| Composants | shadcn/ui + CVA |
| Animations | tw-animate-css |
| Ikonnes | Lucide React |
| Éditeur | BlockNote (IMPRINT) |
| Chat | assistant-ui (Student AI) |
| Graphe | React Flow (COSMOS) |
| FSRS | wasm-pack (Rust) |
| State | Zustand |
