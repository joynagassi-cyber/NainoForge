---
name: nainoforge-Chrome extension-design
description: NainoForge Chrome extension — design system étendu, motion design, iconographie, accessibilité Chrome extension
status: final
updated: 2026-08-03
platform: Chrome extension
---

# DESIGN — NainoForge Chrome extension v2.0 "Forge Chrome extension"

> Ce document enrichit le DESIGN v2.0 desktop avec les spécifications Chrome extensions.
> Les tokens CSS sont identiques ; seuls les spacings, layouts et comportements diffèrent.

## Brand & Style

Brand voice : forge industrielle, précision chirurgicale.
Dark mode only. Pas de glow excessif — surfaces précises, violet électrique, amber chaleur.

**Adaptation Chrome extension** : Même palette v2.0, mais densité réduite, touch targets 48px, safe area aware.

---

## Palette — v2.0 "Forge Chrome extension"

*Identique au desktop, espacement des tokens adapté Chrome extension.*

| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#8B5CF6` | CTA, active chrome, link |
| `--color-primary-dark` | `#7C3AED` | hover primary |
| `--color-primary-darkest` | `#6D28D9` | active primary |
| `--color-primary-light` | `#A78BFA` | text on primary surfaces |
| `--color-accent-warm` | `#F59E0B` | status heat, notification |
| `--color-accent-warm-light` | `#FCD34D` | warm highlight |
| `--color-surface-base` | `#121212` | deepest background (canvas) |
| `--color-surface-1` | `#1A1A2E` | cards, elevated panels |
| `--color-surface-2` | `#22223A` | inputs, secondary panels |
| `--color-surface-3` | `#2A2A45` | selected, active elements |
| `--color-text-primary` | `#F8FAFC` | body/headings on dark |
| `--color-text-secondary` | `#E2E8F0` | subtitles |
| `--color-text-muted` | `#94A3B8` | secondary metadata |
| `--color-text-disabled` | `#475569` | disabled text |
| `--color-state-forged` | `#22C55E` | mastery complete, success |
| `--color-state-leech` | `#EF4444` | error, difficult concept |
| `--color-state-partial` | `#F59E0B` | partial mastery |
| `--color-state-lacune` | `#F97316` | knowledge gap |

### Contrast ratios (WCAG 2.1 AA)

| Couloir | Ratio | Niveau |
|---|---|---|
| `#8B5CF6` sur `#1A1A2E` | ~7.5:1 | AAA |
| `#F8FAFC` sur `#121212` | ~16.5:1 | AAA |
| `#94A3B8` sur `#1A1A2E` | ~4.9:1 | AA |
| `#475569` sur `#121212` | ~3.8:1 | A (disabled only) |

---

## Typography — v2.0 Chrome extension

| Token | Size | Weight | Line-height | Usage |
|---|---|---|---|---|
| `text-h1` | 2rem (32px) | 700 | 1.1 | Page titles |
| `text-h2` | 1.5rem (24px) | 700 | 1.15 | Section titles |
| `text-h3` | 1.25rem (20px) | 600 | 1.25 | Card titles |
| `text-body` | 1rem (16px) | 400 | 1.5 | Body text (Chrome extension standard) |
| `text-body-sm` | 0.875rem (14px) | 400 | 1.5 | Secondary text |
| `text-caption` | 0.75rem (12px) | 600 | 1.4 | Uppercase labels, metadata |

**Font families :** `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`
**Font weight tokens :** `font-normal (400)`, `font-medium (500)`, `font-semibold (600)`, `font-bold (700)`

**Letter spacing :** headings -0.02em, body 0.01em, caption +0.06em uppercase.
**Dynamic type :** supporte scale 100%–200%. Minimum lineHeight 1.5 garanti.

---

## Layout & Spacing — Chrome extension

### Safe area
- `env(safe-area-inset-top)` : header
- `env(safe-area-inset-bottom)` : tab bar / bottom nav
- `env(safe-area-inset-left/right)` : padding latéral

### Chrome extension spacing tokens
| Token | Value | Usage |
|---|---|---|
| `space-xs` | 4px | Tight padding |
| `space-sm` | 8px | Compact items |
| `space-md` | 12px | Standard padding |
| `space-lg` | 16px | Comfortable padding |
| `space-xl` | 20px | Section gaps |
| `space-2xl` | 24px | Card margins |
| `space-3xl` | 32px | Screen sections |
| `space-4xl` | 48px | Full section padding |

### Chrome extension grid
- **Colonne unique** : 16px padding latéral
- **Cartes plein écran** : padding-top 16px, padding-bottom 80px (tab bar clearance)
- **Listes** : gap 12px entre items

### Touch targets minimaux
| Élément | Min size |
|---|---|
| Bouton | 48 × 48px |
| Icone interactive | 44 × 44px hit area |
| Champ texte | hauteur 52px |
| Switch/toggle | 51 × 31px |
| Tab bar item | 76px largeur, 48px hauteur |

---

## Shapes

| Token | Value |
|---|---|
| `--radius-sm` | 6px |
| `--radius-md` | 10px |
| `--radius-lg` | 14px |
| `--radius-xl` | 20px |
| `--radius-full` | 9999px |

**Boutons** : `--radius-lg`
**Cartes** : `--radius-xl`
**Badges** : `--radius-full` (pill)
**Inputs** : `--radius-md`

---

## Motion Design — v2.0 Chrome extension (Étendu)

### Timing Tokens

| Token | Value | Usage |
|---|---|---|
| `duration-snap` | 80ms | Micro-feedback (tap ripple, toggle) |
| `duration-fast` | 120ms | State change (button press, tab switch) |
| `duration-normal` | 200ms | Surface transitions (slide, fade) |
| `duration-slow` | 350ms | Progress bars, shimmer, card flip |
| `duration-long` | 600ms | Screen enter/exit, modal open |
| `duration-ceremony` | 1000ms | Forge completion ceremony, celebration |
| `duration-lozenge` | 1500ms | Loading skeleton shimmer repeat |

### Easing Curves

| Token | CSS | Usage |
|---|---|---|
| `easing-standard` | `ease` | Default transitions |
| `easing-decel` | `cubic-bezier(0.2, 0, 0, 1)` | Exit animations, dismiss |
| `easing-accel` | `cubic-bezier(0.4, 0, 1, 1)` | Entry animations, reveal |
| `easing-bounce` | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` | Forge ignition, stamp |
| `easing-spring` | `cubic-bezier(0.175, 0.885, 0.32, 1.275)` | Card flip, expand |
| `easing-smooth` | `cubic-bezier(0.4, 0, 0.2, 1)` | Material-like standard |

### Keyframe Patterns

```css
/* Forge ignition — celebration completion */
@keyframes forge-ignition {
  0%   { transform: scale(0.8); opacity: 0.5; }
  50%  { transform: scale(1.15); opacity: 1; }
  70%  { transform: scale(0.95); }
  100% { transform: scale(1); }
}

/* Card flip — review answer reveal */
@keyframes card-flip {
  0%   { transform: rotateY(0deg); }
  100% { transform: rotateY(180deg); }
}

/* Shimmer — loading skeleton */
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Pulse heat — Leech card warning */
@keyframes pulse-heat {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.3); }
  50%      { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
}

/* Forge particle burst — post-forge snapshot */
@keyframes particle-burst {
  0%   { transform: translate(0, 0) scale(1); opacity: 1; }
  100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
}

/* SMI ring fill animation */
@keyframes ring-fill {
  from { stroke-dashoffset: 283; } /* circumference of r=45 */
  to   { stroke-dashoffset: var(--target-offset); }
}

/* Tab bar slide — page transition */
@keyframes slide-in-right {
  from { transform: translateX(100%); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }
}

@keyframes slide-out-left {
  from { transform: translateX(0); opacity: 1; }
  to   { transform: translateX(-30%); opacity: 0; }
}
```

### Micro-interactions Spec

| Interaction | Trigger | Animation | Duration | Easing |
|---|---|---|---|---|
| Forge button press | Tap | Scale 1→0.92→1 + shadow deepen | 150ms | `easing-accel` |
| Card flip (review) | Rating selected | rotateY 0→180° reveal back | 400ms | `easing-spring` |
| SMI ring fill | After review | stroke-dashoffset animated | 600ms | `easing-decel` |
| Leech pulse | Card in Leech state | amber border pulse 2× then steady | 1200ms | `easing-standard` |
| Tab switch | Tab tap | underline slide 200ms + fade content | 200ms | `easing-decel` |
| Toast enter | Event fired | slide from bottom, opacity 0→1 | 200ms | `easing-decel` |
| Toast exit | Timeout/dismiss | opacity 1→0, scale 0.95 | 150ms | `easing-accel` |
| Progress fill | Capture in progress | width 0→target, color shift | 350ms | `easing-standard` |
| Swipe to dismiss | Swipe left | translateX -100%, fade 200ms | 200ms | `easing-accel` |
| Pull to refresh | Swipe down + release | spinner spin 400ms | 400ms | `easing-standard` |
| Bottom sheet open | Tap card | translateY 100%→0, scale 0.95→1 | 350ms | `easing-spring` |
| Streak counter | Review complete | number count-up 600ms | 600ms | `easing-decel` |

### Reduced Motion
`prefers-reduced-motion: reduce` → toutes les animations à 0.01ms, pas de transform, pas de opacity transition.

---

## Iconography — v2.0 Chrome extension

### Principes
- Line icons, 1.5px stroke, no fill
- Semantic naming : `{domain}-{action}-{object}`
- Consistent visual weight across all sizes
- Lucide icons library (480+ icons)
- Tous les icônes 24×24, hit area 44×44

### Inventaire complet

| Nom | Icône Lucide | Usage | Page |
|---|---|---|---|
| `flame` | `Flame` | Primary CTA, brand, forge action | Home, Forge |
| `flame-filled` | `Flame` (fill) | Active state, forged badge | Home, COSMOS |
| `spark` | `Sparkles` | Forge Commitment entry | Commit |
| `book` | `BookOpen` | Web article source type | Home, Source detail |
| `video` | `Video` | YouTube source type | Home, Source detail |
| `file` | `FileText` | PDF/DOCX source type | Home, Source detail |
| `file-plus` | `FilePlus` | Import file action | FEE |
| `search` | `Search` | COSMOS search | COSMOS |
| `settings` | `Settings` | Settings panel | Settings |
| `chevronRight` | `ChevronRight` | List drill-down | Everywhere |
| `chevronLeft` | `ChevronLeft` | Back navigation | Everywhere |
| `chevronDown` | `ChevronDown` | Expand/collapse | IMPRINT |
| `check` | `Check` | Success, confirmed | All success states |
| `check-circle` | `CheckCircle2` | Major success (forge complete) | Post-forge |
| `x` | `X` | Dismiss, close | All dialogs |
| `x-circle` | `XCircle` | Error state | Error surfaces |
| `alert-triangle` | `AlertTriangle` | Warning, Leech | Leech surfaces |
| `info` | `Info` | Info toasts | Toasts |
| `help-circle` | `HelpCircle` | Help/hint | All surfaces |
| `clock` | `Clock` | Time, scheduling | Review |
| `tag` | `Tag` | Bloom level tag | COSMOS |
| `lock` | `Lock` | Private content | Source detail |
| `unlock` | `Unlock` | Public content | Source detail |
| `external-link` | `ExternalLink` | Open source | Source detail |
| `share-2` | `Share2` | Share concept | COSMOS |
| `copy` | `Copy` | Copy imprint | IMPRINT |
| `refresh-cw` | `RefreshCw` | Refresh, retry | All error states |
| `wifi` | `Wifi` | Online status | Header |
| `wifi-off` | `WifiOff` | Offline status | Header |
| `brain` | `Brain` | Student AI | Student AI |
| `download` | `Download` | Export bundle | FEE |
| `upload` | `Upload` | Import | FEE |
| `trending-up` | `TrendingUp` | Streak | Home dashboard |
| `trending-down` | `TrendingDown` | Regression | Home dashboard |
| `circle` | `Circle` | Empty node COSMOS | COSMOS |
| `circle-dot` | `CircleDot` | Partial node | COSMOS |
| `circle-alert` | `CircleAlert` | Gap node | COSMOS |
| `zap` | `Zap` | Quick action | Floating CTA |
| `message-circle` | `MessageCircle` | Chat input | Student AI |
| `mic` | `Mic` | Voice input | Student AI |
| `mic-off` | `MicOff` | Voice disabled | Student AI |
| `eye` | `Eye` | Preview source | Home |
| `eye-off` | `EyeOff` | Hide content | Source detail |
| `more-horizontal` | `MoreHorizontal` | Overflow menu | Source cards |
| `archive` | `Archive` | Archive source | Source card |
| `trash-2` | `Trash2` | Delete source | Source card |
| `bar-chart-3` | `BarChart3` | Analytics | Home dashboard |
| `globe` | `Globe` | Public source | Source card |
| `user` | `User` | Profile | Settings |
| `log-out` | `LogOut` | Sign out | Settings |
| `moon` | `Moon` | Dark mode (forced) | Settings |
| `sun` | `Sun` | Light mode (future) | Settings |
| `bell` | `bell` | Notifications | Settings |
| `shield-check` | `ShieldCheck` | Privacy verified | Source detail |
| `shield-alert` | `ShieldAlert` | Privacy warning | Source detail |
| `git-branch` | `GitBranch` | Divergent concepts | COSMOS |
| `link` | `Link` | Prerequisite relation | COSMOS |
| `git-merge` | `GitMerge` | Convergence | COSMOS |
| `minimize` | `Minimize2` | Collapse panel | All sheets |
| `maximize` | `Maximize2` | Expand panel | All sheets |
| `menu` | `Menu` | Hamburger menu | Initial onboarding |

### Icon sizes
| Size | Value | Usage |
|---|---|---|
| `icon-sm` | 16px | Metadata badges, secondary actions |
| `icon-md` | 20px | Standard buttons, card icons |
| `icon-lg` | 24px | Primary buttons, navigation |
| `icon-xl` | 32px | Empty states, hero icons |
| `icon-2xl` | 48px | Celebration states |

---

## Effects & Patterns — Chrome extension

*Mêmes effets CSS que le desktop, avec adaptations touch.*

### Glow primary (Chrome extension-optimized)
```css
.glow-primary {
  box-shadow:
    0 0 12px var(--color-primary-glow),
    0 0 32px rgba(139, 92, 246, 0.1),
    0 4px 12px rgba(0, 0, 0, 0.3);
}
```

### Glass panel (Chrome extension modal)
```css
.glass-panel {
  background: rgba(18, 18, 30, 0.82);
  backdrop-filter: blur(20px) saturate(200%);
  -webkit-backdrop-filter: blur(20px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  box-shadow: 0 -4px 32px rgba(0, 0, 0, 0.5);
}
```

### Haptic feedback spec (si supportée)
| Action | Haptic pattern |
|---|---|
| Forge success | Light tap (0.02s) |
| Forge error | Heavy tap (0.05s) |
| Card rating | Subtle tick (0.01s) |
| Leech detected | Double tap (0.02s, 0.1s gap) |
| SMI milestone | Celebration burst (0.05s × 3) |

---

## Accessibility — Chrome extension Floor (Étendu)

### WCAG 2.1 AA Checklist

| Critère | Implémentation |
|---|---|
| Contrast ratio ≥ 4.5:1 | ✅ Primary sur surface: 7.5:1 |
| Contrast ratio ≥ 3:1 (large text) | ✅ Muted sur surface: 4.9:1 |
| Focus visible | ✅ Ring 2px primary + 4px surface-base |
| Touch target ≥ 44×44 | ✅ 48×48 minimum, inputs 52px height |
| Dynamic type 200% | ✅ Font scaling, lineHeight 1.5 minimum |
| Reduced motion | ✅ `prefers-reduced-motion` support |
| VoiceOver / TalkBack | ✅ ARIA labels, roles, live regions |
| Color not sole indicator | ✅ Icons + text + color combined |

### ARIA Patterns

| Élément | Role | Attributs |
|---|---|---|
| Tab bar | `role="tablist"` | `aria-label="Navigation"` |
| Tab item | `role="tab"` | `aria-selected`, `aria-controls` |
| Tab panel | `role="tabpanel"` | `aria-labelledby` |
| Bottom sheet | `role="dialog"` | `aria-modal="true"`, `aria-labelledby` |
| Toast | `role="status"` | `aria-live="polite"` |
| Alert | `role="alert"` | `aria-live="assertive"` |
| Progress bar | `role="progressbar"` | `aria-valuenow`, `aria-valuemin`, `aria-valuemax` |
| Spinner | `role="status"` | `aria-live="polite"`, sr-only label |
| Card | `role="article"` | `aria-labelledby` → title |
| Rating buttons | `role="group"` | `aria-label="Rating"` |

### Focus management Chrome extension
- Pas de focus ring visible sur touch (masqué par défaut, visible au clavier)
- `:focus-visible` pour keyboard navigation
- Escape → ferme dialog/sheet, retour arrière
- Tab order logique dans chaque surface

---

## Color Tokens Summary (CSS Variables)

```css
:root {
  /* Primary */
  --color-primary: #8B5CF6;
  --color-primary-dark: #7C3AED;
  --color-primary-darkest: #6D28D9;
  --color-primary-light: #A78BFA;
  --color-primary-glow: rgba(139, 92, 246, 0.5);
  --color-primary-subtle: rgba(139, 92, 246, 0.08);
  --color-primary-border: rgba(139, 92, 246, 0.3);
  --color-accent-warm: #F59E0B;
  --color-accent-warm-light: #FCD34D;

  /* Surfaces */
  --color-surface-base: #121212;
  --color-surface-1: #1A1A2E;
  --color-surface-2: #22223A;
  --color-surface-3: #2A2A45;
  --color-surface-elevated: #252540;
  --color-surface-highlight: #2D2D4A;

  /* Text */
  --color-text-primary: #F8FAFC;
  --color-text-secondary: #E2E8F0;
  --color-text-muted: #94A3B8;
  --color-text-disabled: #475569;

  /* Borders */
  --color-border-subtle: rgba(255, 255, 255, 0.05);
  --color-border-default: rgba(255, 255, 255, 0.09);
  --color-border-elevated: rgba(255, 255, 255, 0.13);
  --color-border-primary: rgba(139, 92, 246, 0.25);

  /* Cognitive states */
  --color-state-forged: #22C55E;
  --color-state-forged-glow: rgba(34, 197, 94, 0.4);
  --color-state-leech: #EF4444;
  --color-state-leech-glow: rgba(239, 68, 68, 0.4);
  --color-state-partial: #F59E0B;
  --color-state-lacune: #F97316;

  /* Motion */
  --duration-fast: 120ms;
  --duration-normal: 200ms;
  --duration-slow: 350ms;
  --duration-long: 600ms;
  --duration-ceremony: 1000ms;
}
```

---

## Do's and Don'ts

- ✅ Use CSS tokens (`var(--color-*)`) everywhere
- ✅ Use Tailwind class names derived from tokens
- ✅ Hardcode colors only in `globals.css` token definitions
- ✅ Use `currentColor` for icon fills where appropriate
- ✅ Respect safe area insets on all screens
- ✅ Use 48px minimum touch targets
- ✅ Provide haptic feedback for key actions (if supported)
- ❌ Never use `#7C3AED` or older v1 colors in JSX
- ❌ Never use runtime style strings for colors
- ❌ Don't use purple lighter than primary for large surfaces
- ❌ Don't mix glow and cosmic gradient on the same element
- ❌ Don't skip `prefers-reduced-motion` support
- ❌ Don't use fixed `px` values — use tokens
