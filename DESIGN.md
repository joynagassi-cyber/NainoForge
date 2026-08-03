---
name: nainoforge-design-system
description: NainoForge — Neuro-Technical design system, single source of truth for Chrome extension (Popup / Side Panel / App Mode)
status: final
updated: 2026-08-03
---

# NainoForge — Design System : Neuro-Technical

> **Produit :** Extension Chrome (pas une application mobile)
> **Contextes :** Popup · Side Panel · App Mode
> **Esthétique :** Minimalism × Glassmorphism — fond monochromatique obsidienne, typographie haut contraste, indicateurs cinétiques subtils.
> **Émotion cible :** "Calm focus" + "technological depth"

---

## Contexte

NainoForge est une **extension Chrome** avec trois contextes de rendu, chacun ayant des contraintes d'espace radicalement différentes :

| Contexte | Point d'entrée | Dimensions | Contrainte dominante |
|---|---|---|---|
| **Popup** | `main.tsx` (mode par défaut) | 400px × ≤600px, fixe | Hauteur ET largeur limitées — densité maximale |
| **Side Panel** | `main.tsx` (`?mode=sidebar`) | 320–560px de large, hauteur = fenêtre | Largeur étroite mais variable, hauteur généreuse |
| **App Mode** | `appModeMain.tsx` | ≥800px, viewport desktop | Espace généreux — seul contexte où la mise en page à 3 colonnes a du sens |

Chaque section ci-dessous précise à quel(s) contexte(s) elle s'applique. Sauf mention contraire, **Couleurs, Typographie, Rounded, Elevation** sont partagés par les trois contextes.

---

## Colors

Palette monochromatique rooted in deep obsidian. **Primary = blanc (#FFFFFF) comme accent** — interface strictement monochrome, le blanc est le seul accent fonctionnel.

```yaml
name: NainoForge Neuro-Technical
colors:
  surface: '#141313'
  surface-dim: '#141313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353434'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c4c7c8'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c6c6c7'
  primary: '#ffffff'
  on-primary: '#2f3131'
  primary-container: '#e2e2e2'
  on-primary-container: '#636565'
  inverse-primary: '#5d5f5f'
  secondary: '#cac6c5'
  on-secondary: '#313030'
  secondary-container: '#484646'
  on-secondary-container: '#b8b4b4'
  tertiary: '#ffffff'
  on-tertiary: '#342f2d'
  tertiary-container: '#eae1dd'
  on-tertiary-container: '#696360'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#e6e1e1'
  secondary-fixed-dim: '#cac6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#484646'
  tertiary-fixed: '#eae1dd'
  tertiary-fixed-dim: '#cec5c1'
  on-tertiary-fixed: '#1f1b19'
  on-tertiary-fixed-variant: '#4b4643'
  background: '#141313'
  on-background: '#e5e2e1'
  surface-variant: '#353434'
```

### Traduction CSS (globals.css)

```css
:root {
  /* Background */
  --nf-bg: #141313;
  --nf-on-bg: #e5e2e1;

  /* Surface elevation ladder (MD3 tonal) */
  --nf-surface-lowest: #0e0e0e;
  --nf-surface-low: #1c1b1b;
  --nf-surface: #201f1f;
  --nf-surface-high: #2a2a2a;
  --nf-surface-highest: #353434;
  --nf-surface-variant: #353434;
  --nf-surface-dim: #141313;
  --nf-surface-bright: #3a3939;

  /* Text */
  --nf-on-surface: #e5e2e1;
  --nf-on-surface-variant: #c4c7c8;
  --nf-inverse-surface: #e5e2e1;
  --nf-inverse-on-surface: #313030;

  /* Outline */
  --nf-outline: #8e9192;
  --nf-outline-variant: #444748;
  --nf-surface-tint: #c6c6c7;

  /* Primary accent (white-on-dark) */
  --nf-primary: #ffffff;
  --nf-on-primary: #2f3131;
  --nf-primary-container: #e2e2e2;
  --nf-on-primary-container: #636565;
  --nf-inverse-primary: #5d5f5f;

  /* Secondary */
  --nf-secondary: #cac6c5;
  --nf-on-secondary: #313030;
  --nf-secondary-container: #484646;
  --nf-on-secondary-container: #b8b4b4;
  --nf-secondary-fixed: #e6e1e1;
  --nf-secondary-fixed-dim: #cac6c5;
  --nf-on-secondary-fixed: #1c1b1b;
  --nf-on-secondary-fixed-variant: #484646;

  /* Tertiary (reserved for future accent — currently = primary) */
  --nf-tertiary: #ffffff;
  --nf-on-tertiary: #342f2d;
  --nf-tertiary-container: #eae1dd;
  --nf-on-tertiary-container: #696360;
  --nf-tertiary-fixed: #eae1dd;
  --nf-tertiary-fixed-dim: #cec5c1;
  --nf-on-tertiary-fixed: #1f1b19;
  --nf-on-tertiary-fixed-variant: #4b4643;

  /* Error */
  --nf-error: #ffb4ab;
  --nf-on-error: #690005;
  --nf-error-container: #93000a;
  --nf-on-error-container: #ffdad6;

  /* Fixed variants */
  --nf-primary-fixed: #e2e2e2;
  --nf-primary-fixed-dim: #c6c6c7;
  --nf-on-primary-fixed: #1a1c1c;
  --nf-on-primary-fixed-variant: #454747;
}
```

### Rules

- **Primary accent** = `--nf-primary` (`#ffffff`) — buttons, high-importance icons, active-focus border. Paired with `--nf-on-primary` (`#2f3131`) for text on filled primary surfaces.
- **Body text** = `--nf-on-surface` (`#e5e2e1`) — softened off-white, distinct from pure-white `primary`, reserved for body copy and long-form reading.
- **Elevated surfaces** = `--nf-surface-low` → `--nf-surface-high` — 3-step elevation ladder for containers, cards, hover states.
- **Accent scope** = interface strictly monochromatic — `primary` is the sole functional accent. `tertiary` is currently identical to `primary`; treat as reserved slot for a future distinguishing accent.
- **No hardcoded hex in JSX** — only `var(--nf-*)` tokens.

---

## Typography

Exclusivement **Inter** — look utilitaire, systématique. Poids variable + tracking pour créer des rôles distincts.

```yaml
typography:
  display:
    fontFamily: Inter
    fontSize: 42px
    fontWeight: '400'
    lineHeight: '1.15'
    letterSpacing: -0.02em
  headline-1:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.20'
    letterSpacing: -0.01em
  headline-2:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '400'
    lineHeight: '1.25'
  headline-3:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.35'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '300'
    lineHeight: '1.65'
    letterSpacing: -0.005em
  body-reg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '300'
    lineHeight: '1.60'
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.50'
    letterSpacing: 0.05em
  code:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.70'
```

### Traduction CSS

```css
/* Font import */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  --nf-font-sans: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  --nf-font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
}

.text-display    { font-size: 2.625rem; font-weight: 400; line-height: 1.15; letter-spacing: -0.02em; }
.text-headline-1 { font-size: 2rem;    font-weight: 400; line-height: 1.20; letter-spacing: -0.01em; }
.text-headline-2 { font-size: 1.5rem;  font-weight: 400; line-height: 1.25; }
.text-headline-3 { font-size: 1.125rem; font-weight: 500; line-height: 1.35; letter-spacing: -0.01em; }
.text-body-lg    { font-size: 1rem;    font-weight: 300; line-height: 1.65; letter-spacing: -0.005em; }
.text-body-reg   { font-size: 0.875rem; font-weight: 300; line-height: 1.60; }
.text-caption    { font-size: 0.75rem;  font-weight: 500; line-height: 1.50; letter-spacing: 0.05em; text-transform: uppercase; }
.text-code       { font-size: 0.8125rem; font-weight: 400; line-height: 1.70; font-family: var(--nf-font-mono); }
```

### Rules

- **Display & Headlines** : tight letter-spacing, lighter weights — elegant yet technical.
- **Body** : light weight (300), generous line-height (1.6x+) — maximum readability for long-form research content. *Vérifier le rendu sur écran non-Retina avant de généraliser ce poids : à 14px/weight 300 sur fond `#141313`, la lisibilité peut se dégrader.*
- **Captions/Labels** : always uppercase + increased letter-spacing (0.05em) — metadata and navigation.
- **Code** : sans-serif but wider line-height — technical figure labels and timestamps.

**Adaptive Layout** — les tokens ne changent pas, seul leur usage se restreint (voir section Adaptive Layout).

---

## Spacing

```yaml
spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
```

### Règles d'usage par contexte

| Espacement | Popup | Side Panel | App Mode |
|---|---|---|---|
| `xxs` (4px) | ✅ | ✅ | ✅ |
| `xs` (8px) | ✅ | ✅ | ✅ |
| `sm` (12px) | ✅ | ✅ | ✅ |
| `md` (16px) | ✅ | ✅ | ✅ |
| `lg` (24px) | ⚠️ limiter | ✅ | ✅ |
| `xl` (32px) | ❌ | ⚠️ limiter | ✅ |
| `2xl` (48px) | ❌ | ❌ | ✅ |
| `3xl` (64px) | ❌ | ❌ | ✅ |

**Commun aux contextes étroits (Popup / Side Panel)** : privilégier `xxs`/`xs`/`sm`/`md`, réserver `xl`/`2xl`/`3xl` au seul App Mode.

---

## Rounded

```yaml
rounded:
  sm: 0.125rem   /* 2px */
  DEFAULT: 0.25rem  /* 4px */
  md: 0.375rem   /* 6px */
  lg: 0.5rem     /* 8px */
  xl: 0.75rem    /* 12px */
  full: 9999px
```

| Élément | Radius |
|---|---|
| Boutons, petits conteneurs | `rounded-sm` (2px) |
| Figures, callout blocks | `rounded-lg` (8px) |
| Navigation active items, chips | `rounded-full` (pill) |

**Language "Soft-Technical"** — precise but not aggressive.

---

## Elevation & Depth

Depth créé par **Tonal Layering** + **Glassmorphism** (pas d'ombres portées traditionnelles). Commun aux trois contextes.

| Niveau | Token | Valeur | Usage |
|---|---|---|---|
| Surface 0 | `--nf-bg` | `#141313` | Canvas principal |
| Surface 1 | `--nf-surface-low` | `#1c1b1b` | Sidebar, navigation, hover states |
| Surface 2a | `--nf-surface` | `#201f1f` | Containers, modals, dialogs |
| Surface 2b | `--nf-surface-high` | `#2a2a2a` | Séparation forte |
| Surface 3 | `--nf-surface-highest` | `#353434` | Éléments flottants, popovers |

### Glassmorphism

```css
.glass-header {
  background: rgba(20, 19, 19, 0.80);
  backdrop-filter: blur(12px) saturate(150%);
  -webkit-backdrop-filter: blur(12px) saturate(150%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
```

- **Translucidity** : header à 80% opacity + `backdrop-blur-md` — maintain spatial awareness of content scrolling beneath. Applies at all header heights (48px in Popup, 64px elsewhere).
- **Decorative depth** : backgrounds of figures/callouts use `--nf-surface` (`#201f1f`).
- **Active focus** : sections highlightées utilisent une bordure verticale 2px en `--nf-primary` (`#ffffff`) — "reading line" ou zone de focus actif.

---

## Adaptive Layout

### App Mode (≥800px)

Layout **Fixed-Width Content** — contenu centré dans interface fluide.

- **Sidebar** : fixe à 240px pour la navigation.
- **Header** : hauteur fixe 64px (`spacing.3xl`) avec `backdrop-blur`.
- **Main Content** : `max-width: 720px` — optimise la longueur de ligne (70-80 caractères).
- **Rythme** : échelle linéaire 8px. Grands espacements verticaux (64px) séparent les sections majeures; petits espacements (12-16px) gèrent les relations composants.
- **Grid** : à partir de 1100px de large, colonne margin-metadata de 120px apparaît à droite pour les "Key Insights". En dessous, masquée plutôt que compressée.

### Side Panel (320–560px de large, hauteur généreuse)

- **Pas de sidebar 240px** — trop large même à 560px.
- **Rail d'icônes vertical étroit** (~56px) plutôt que barre basse — hauteur généreuse le permet.
- **Header** : conserve 64px (`spacing.3xl`) — hauteur non contrainte.
- **Contenu principal** : largeur fluide (100% moins gutters), jamais `max-width: 720px` tant que le panneau reste sous 800px.
- **Margin-metadata** : absente en dessous de 800px, comme en App Mode sous 1100px.
- **Typographie** : `headline-1` (32px) utilisable si panneau élargi au-delà de ~450px; en dessous, se limiter à `headline-2`.

### Popup (400px × ≤600px, fixe)

- **Pas de sidebar** — navigation compressée en barre d'onglets basse (icônes + label court).
- **Header** : réduit à 48px (`spacing.2xl`) pour préserver l'espace vertical.
- **Contenu principal** : largeur 100% moins gutter `spacing.md` (16px) de chaque côté — jamais de `max-width: 720px`.
- **Margin-metadata** : absente, sans exception.
- **Typographie** : ne PAS utiliser `display` (42px) ni `headline-1` (32px). Le plus grand titre visible en Popup est `headline-2` (24px).

---

## Viewports

```yaml
viewports:
  popup:
    width: 400px
    max-height: 600px
    note: Fenêtre popup classique — dimensions imposées par Chrome, non redimensionnable.
  sidepanel:
    min-width: 320px
    max-width: 560px
    note: Panneau latéral natif Chrome — largeur redimensionnable, hauteur = hauteur fenêtre navigateur.
  app:
    min-width: 800px
    note: Mode app — ouvert dans un onglet complet, viewport desktop classique.
```

---

## Components

Commun aux trois contextes sauf mention contraire.

### Button

```typescript
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
```

| Variant | Background | Text | Hover | Focus |
|---|---|---|---|---|
| `primary` | `--nf-primary` (`#ffffff`) | `--nf-on-primary` (`#2f3131`) | opacity 0.9 | ring 2px `--nf-primary` |
| `secondary` | `--nf-secondary-container` (`#484646`) | `--nf-on-secondary-container` (`#b8b4b4`) | `--nf-surface-high` | ring 2px `--nf-primary` |
| `ghost` | transparent | `--nf-on-surface` (`#e5e2e1`) | `--nf-surface-low` | ring 2px `--nf-primary` |
| `destructive` | `--nf-error-container` (`#93000a`) | `--nf-on-error` (`#690005`) | `#7f0009` | ring 2px `--nf-error` |

**Sizes :** sm `h-9 px-3 text-caption`, md `h-11 px-4 text-body-reg`, lg `h-12 px-6 text-headline-3`.
**Text:** uppercase caption text for buttons to distinguish from body content.
**Focus ring:** `0 0 0 2px var(--nf-bg), 0 0 0 4px var(--nf-primary)`.

### Navigation Links

Feature a 2px left border in App Mode. When active: `--nf-surface-low` background shift + solid `--nf-primary` border. *En Popup, ce composant n'est pas utilisé — voir barre d'onglets basse dans Adaptive Layout.*

### Chips / Tags

Small, pill-shaped containers.
- Background: `--nf-secondary-container` (`#484646`)
- Text: `--nf-on-secondary-container` (`#b8b4b4`)
- Hover: increase text contrast

### Quote Blocks

Large, italicized typography with solid 2px left `--nf-primary` border and `--nf-surface` background tint.

### Charts / Figures

- Always include a technical caption in uppercase code-style font.
- Use `--nf-primary` for data visualization paths.
- *En Popup/Side Panel : figures fluides (`width: 100%`), jamais en largeur fixe. Légende peut passer sur deux lignes.*

### Avatar

Circular icons using `--nf-primary` as background and `--nf-on-primary` for icon/initials.

---

## Motion

```css
:root {
  --nf-duration-snap: 80ms;
  --nf-duration-fast: 120ms;
  --nf-duration-normal: 200ms;
  --nf-duration-slow: 350ms;
  --nf-duration-long: 600ms;

  --nf-easing-standard: ease;
  --nf-easing-decel: cubic-bezier(0.2, 0, 0, 1);
  --nf-easing-accel: cubic-bezier(0.4, 0, 1, 1);
  --nf-easing-smooth: cubic-bezier(0.4, 0, 0.2, 1);
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

| Interaction | Trigger | Animation | Duration | Easing |
|---|---|---|---|---|
| Button press | Tap/click | Scale 1→0.97→1 | 120ms | `easing-accel` |
| Tab switch | Tab tap | underline slide + fade content | 200ms | `easing-decel` |
| Toast enter | Event fired | slide from edge, opacity 0→1 | 200ms | `easing-decel` |
| Toast exit | Timeout/dismiss | opacity 1→0, scale 0.95 | 150ms | `easing-accel` |
| Card hover | Mouse enter | elevation shift (tonal lift) | 150ms | `easing-standard` |
| Bottom sheet open | Tap card | translateY 100%→0, scale 0.95→1 | 350ms | `easing-smooth` |
| Page transition | Route change | fade 200ms | 200ms | `easing-decel` |

---

## Accessibility Floor

### WCAG 2.1 AA Checklist

| Critère | Implémentation | Statut |
|---|---|---|
| Contrast ≥ 4.5:1 | `#e5e2e1` sur `#141313` = ~14:1 | ✅ |
| Contrast ≥ 3:1 (large text) | `#c4c7c8` sur `#141313` = ~8:1 | ✅ |
| Touch target ≥ 44×44 | Boutons min 44px height | ✅ |
| Focus visible | Ring 2px primary + 4px surface | ✅ |
| Reduced motion | `prefers-reduced-motion` → 0.01ms | ✅ |
| Dynamic type 200% | Font scaling, lineHeight 1.5 min | ✅ |
| Color not sole indicator | Icons + text + color combined | ✅ |

### ARIA Patterns

| Élément | Role | Attributs |
|---|---|---|
| Tab bar | `role="tablist"` | `aria-label="Navigation"` |
| Tab item | `role="tab"` | `aria-selected`, `aria-controls` |
| Tab panel | `role="tabpanel"` | `aria-labelledby` |
| Dialog/Sheet | `role="dialog"` | `aria-modal="true"`, `aria-labelledby` |
| Toast | `role="status"` | `aria-live="polite"` |
| Alert | `role="alert"` | `aria-live="assertive"` |
| Progress bar | `role="progressbar"` | `aria-valuenow/min/max` |
| Spinner | `role="status"` | `aria-live="polite"`, sr-only label |
| Card | `role="article"` | `aria-labelledby` → title |

---

## Do's and Don'ts

- ✅ Use CSS tokens (`var(--nf-*)`) everywhere
- ✅ Use Tailwind class names derived from tokens
- ✅ Hardcode colors only in `globals.css` token definitions
- ✅ Use `currentColor` for icon fills where appropriate
- ✅ Respect adaptive layout rules per context (Popup/Side Panel/App)
- ✅ Keep primary accent usage to 5-10% of screen real estate
- ✅ Use `backdrop-blur` on headers for spatial awareness
- ✅ Support `prefers-reduced-motion` on all animations
- ❌ Never use hardcoded hex values in JSX components
- ❌ Never use runtime style strings for colors
- ❌ Don't use `display` (42px) or `headline-1` (32px) in Popup context
- ❌ Don't mix glow effects with tonal layering — choose one depth strategy
- ❌ Don't use tertiary as a second accent yet (reserved slot)
- ❌ Don't reference "mobile app" or "mobile UX" — NainoForge is a Chrome extension

---

## Migration v2 → Neuro-Technical

| v2 token | Neuro-Technical | Change |
|---|---|---|
| `--color-primary` `#8B5CF6` | `--nf-primary` `#ffffff` | Violet → white accent (monochromatic shift) |
| `--color-surface-base` `#121212` | `--nf-bg` `#141313` | Slightly warmer black |
| `--color-surface-1` `#1A1A2E` | `--nf-surface-low` `#1c1b1b` | MD3 tonal mapping |
| `--color-surface-2` `#22223A` | `--nf-surface` `#201f1f` | MD3 tonal mapping |
| `--color-surface-3` `#2A2A45` | `--nf-surface-high` `#2a2a2a` | MD3 tonal mapping |
| `--color-text-primary` `#F8FAFC` | `--nf-on-surface` `#e5e2e1` | Slightly warmer off-white |
| `--color-text-muted` `#94A3B8` | `--nf-on-surface-variant` `#c4c7c8` | MD3 on-surface-variant |
| `--color-state-forged` `#22C55E` | `--nf-secondary-container` `#484646` | Monochromatic substitution |
| `--color-state-leech` `#EF4444` | `--nf-error-container` `#93000a` | MD3 error mapping |
| `--color-state-partial` `#F59E0B` | `--nf-on-secondary-container` `#b8b4b4` | Monochromatic substitution |
| `--color-state-lacune` `#F97316` | `--nf-outline` `#8e9192` | Monochromatic substitution |

**Note :** Les états cognitifs (forged/leech/partial/lacune) perdaient leur signification sémantique dans une palette strictement monochromatique. Dans le modèle Neuro-Technical, ils sont substitués par les tokens MD3 correspondants (secondary-container, error-container, etc.). Si la sémantique colorée est nécessaire, ajouter un token d'accent séparé (ex: `--nf-state-forged`) tout en gardant la monochromie dominante.

---

## Suppression des fichiers redondants

Les fichiers suivants ont été consolidés dans ce DESIGN.md unique :

| Ancien fichier | Statut |
|---|---|
| `DESIGN.md` (v2.0 "Forge") | ❌ Supprimé — remplacé par ce fichier |
| `PALETTE_RULES.md` | ❌ Supprimé — règles intégrées dans ce DESIGN.md |
| `PROMPT_REFONTE_DESIGN_SYSTEM_v2.md` | ❌ Supprimé — mission accomplie |
| `REPORT_PremiumDesign_CodeOnly_2026.md` | ❌ Supprimé — historique, archiver si nécessaire |
| `packages/extension/DESIGN_SYSTEM_PREVIEW.html` | ⚠️ À archiver dans `_archive/design-system-previews/` |
| `DESIGN_SYSTEM_PREVIEW.html` | ⚠️ À archiver dans `_archive/design-system-previews/` |

---

## Architecture CSS finale attendue

```
packages/extension/src/styles/
├── globals.css          ← Tokens + base + composants + effets
└── (aucun autre fichier de tokens)
```

```
tailwind.config.ts       ← Mappage des tokens CSS vers classes Tailwind
DESIGN.md                ← Source de vérité unique (ce fichier)
```

Tout le code doit referencing `var(--nf-*)` ou les classes Tailwind dérivées. Aucune couleur hardcodée dans le JSX.
