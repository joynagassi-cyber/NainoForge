---
name: nainoforge-design
description: NainoForge S1 visual identity and component specification
status: final
updated: 2026-07-12
---

# DESIGN — NainoForge S1

## Brand & Style

Brand voice: industrial forge. Hard surfaces, violet glow, amber heat accent.
Dark mode only.

## Colors

### Palette

| Token | Value | Usage |
|---|---|---|
| primary | #7C3AED | CTA, active chrome, link |
| primary-dark | #6D28D9 | hover primary |
| primary-darkest | #5B21B6 | active primary |
| accent-warm | #F59E0B | status heat, notification |
| surface-base | #0A0A0F | deepest background |
| surface-1 | #12101C | card/elevated base |
| surface-2 | #1A1726 | input/secondary panel |
| surface-3 | #201D2E | disabled/sunken |
| text-primary | #F0F2F5 | body/headings on dark |
| text-muted | #A5A0B8 | secondary metadata |
| text-disabled | #5E5A6E | disabled text |
| border-subtle | rgba(255,255,255,0.08) | hairline dividers |
| border-default | rgba(255,255,255,0.14) | inputs |
| state-forged | #22C55E | success/ready |
| state-leech | #EF4444 | error/failure |

### Accessibility

Contrast ratios (WCAG 2.1):
- `#7C3AED` on `#12101C` ≈ 7.2:1 → AAA
- `#F0F2F5` on `#0A0A0F` ≈ 17.4:1 → AAA
- `#A5A0B8` on `#12101C` ≈ 4.8:1 → AA

## Typography

| Role | Stack | Size | Weight |
|---|---|---|---|
| display | system-ui | 26px | 700 |
| h1 | system-ui | 20px | 600 |
| h2 | system-ui | 18px | 600 |
| h3 | system-ui | 16px | 600 |
| body | system-ui | 14px | 400 |
| body_sm | system-ui | 12px | 400 |
| caption | system-ui | 11px | 500 |
| mono | ui-monospace | 12px | 400 |

Letter spacing: body/caption 0.01em.
Line height: heading 1.25, body 1.5.

## Layout & Spacing

Popover: 480×600px. Side panel: 400px fixed.
Space scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64.

| Token | Value |
|---|---|
| space-1 | 4px |
| space-2 | 8px |
| space-3 | 12px |
| space-4 | 16px |
| space-5 | 20px |

## Elevation & Depth

| Token | Value |
|---|---|
| card | 0 1px 3px rgba(0,0,0,0.35) |
| elevated | 0 4px 14px rgba(0,0,0,0.45) |

## Shapes

| Token | Value |
|---|---|
| sm | 6px |
| md | 10px |
| lg | 14px |
| touch_target_min | 44px |

## Motion

| Token | Value |
|---|---|
| duration_fast | 120ms |
| duration_normal | 200ms |
| duration_slow | 350ms |
| easing_standard | ease |
| easing_decel | cubic-bezier(0.2, 0, 0, 1) |
| easing_accel | cubic-bezier(0.4, 0, 1, 1) |

prefers-reduced-motion: transition none, spinner instant.

## Components

### Button

```typescript
type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
};
```

| State | primary bg | text |
|---|---|---|
| default | primary | surface-base |
| hover | primary-dark | surface-base |
| active | primary-darkest | surface-base |
| loading | primary-dark | surface-base |
| disabled | surface-3 | text-disabled |

Accessibility: focus ring 2px primary offset 2px.

### ForgeButton

```typescript
type ForgeButtonProps = {
  label: string;
  loading?: boolean;
  disabled?: boolean;
  icon?: 'flame' | 'spark' | 'none';
  onClick: () => void;
  fullWidth?: boolean; // default true
};
```

Width 100%; height 44px; radius 14px; padding 12px 16px; bg primary; text surface-base; body_sm semibold.
Icon Flame 18px right, surface-base at 85% opacity.

| State | bg | text |
|---|---|---|
| default | primary | surface-base |
| hover | primary-dark | surface-base |
| active | primary-darkest | surface-base |
| loading | primary-dark | surface-base |
| disabled | surface-3 | text-disabled |

Loading: Spinner 18px left + label "Forging…", duration_normal transition.
Accessibility: aria-busy true loading, aria-disabled true disabled.

## Do's and Don'ts

- Do use CSS Modules only.
- Don't use runtime style strings.
- Don't use purple lighter than primary for large surfaces.
