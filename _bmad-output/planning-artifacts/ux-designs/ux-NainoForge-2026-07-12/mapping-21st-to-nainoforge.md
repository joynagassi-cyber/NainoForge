# 21st.dev → NainoForge Mapping

## Rôle de ce fichier

Ce document capture les composants 21st candidats pour NainoForge et leurs adaptations prévues.
Il ne s’agit pas d’une liste d’installations automatiques : NainoForge S1 est CSS Modules MV3 sans shadcn/Tailwind.
Les composants 21st servent de **références de design** à implémenter dans le design system maison.

## Contexte design cible

- Dark mode only
- Tokens DESIGN.md : `#7C3AED`, `surface-1/2/3`, `text-primary/muted`, `border-subtle`, `state-forged`, `state-leech`
- Side panel : 400px fixed
- Forms : radius `6/10/14px`, spacing `4–64px`

---

## 1. Sidebar — Surface clé pour S2 (Review/Cosmos/Home)

| 21st component | ID | Patterns retenus | Adaptation NainoForge |
|---|---|---|---|
| Dashboard Sidebar (arunjdass) | 14941 | Dual-theme shell, micro-contrast, workspace frames | Dark-only ; couleurs `surface-1/2/3` ; accents `#7C3AED` ; radius override `6/10/14px` |
| Sidebar (aceternity) | 1075 | Expand on hover, dark mode | Désactiver hover-expand ; fixe 400px ; retirer dépendance animation S2 |
| SidebarShowcase (ruixenui) | 8252 | Categories, badges, profile dropdown | Badges → `privacy-public/personal` ; count AI → `accent-warm` |

## 2. Cards / Lists / Status — SourcesList + SourceDetail S2

| 21st component | ID | Patterns retenus | Adaptation NainoForge |
|---|---|---|---|
| Card Status List (isaiahbjork) | 2514 | Status-driven cards, hover actions, staggered motion | Status → Cran levels 1→5 ; hover actions → Forge/Preview ; motion réduite |
| Glowing Card (ravikatiyar) | 5328 | Glassmorphic stat card, subtle glow | Réduire glow ; elevation `card` ; border discret `border-subtle` |

## 3. Buttons / Badges / Spinner — forge badge + side panel S1-S2

| 21st component | ID | Patterns retenus | Adaptation NainoForge |
|---|---|---|---|
| Button (originui) | 227 | Enhanced button states | Tokens `primary/primary-dark/primary-darkest` ; focus ring `2px + 4px surface-base` |
| Badge Button Combo (ruixenui) | 7916 | Floating badge sur bouton | Perfect pour privacy dot + count AI dans SidePanelHeader |
| Spinner (shadcn) | 8682 | Badge spinner | `border-top-color: #7C3AED` ; reduced-motion override `animation: none` |
| Badge (tom_ui / aceternity) | 10216 / 10754 | Variants, tailles | Variants NainoForge : `forge`, `privacy-public`, `privacy-personal`, `count`, `status-dot` |

## 4. Mocks existants déjà alignés

- `mocks/uj1-article.html` — badge article
- `mocks/uj2-youtube.html` — badge YouTube
- `mocks/sidepanel-empty.html` — empty state side panel

## Décisions

- Pas d’installation 21st en dépendance S1
- 21st utilisé comme **catalogue de patterns** uniquement
- Implémentation dans `.module.css` maison quand side panel S2 sera construit
