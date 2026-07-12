---
name: nainoforge-design
description: NainoForge S1 visual identity and component specification
status: final
updated: 2026-07-12
---

# DESIGN — NainoForge

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
| space-6 | 24px |
| space-7 | 32px |
| space-8 | 40px |
| space-9 | 48px |
| space-10 | 64px |

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

| Token | Value |
|---|---|
| border_1px | 1px solid border-subtle |
| border_2px | 2px solid brand/state |

## Motion

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

### Icon

```typescript
type IconProps = {
  name: 'flame' | 'spark' | 'book' | 'search' | 'settings' | 'download' | 'play' | 'pause' | 'chevronDown' | 'chevronLeft' | 'chevronRight' | 'x' | 'check' | 'alertTriangle' | 'info' | 'helpCircle' | 'clock' | 'tag' | 'lock' | 'unlock' | 'externalLink' | 'share2' | 'copy' | 'refresh' | 'wifi' | 'wifiOff';
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'muted' | 'danger' | 'success';
  strokeWidth?: number;
};
```

Sizes: sm 16px, md 20px, lg 24px.
Colors: primary=#7C3AED, muted=#A5A0B8, danger=#EF4444, success=#22C55E.
Stroke width: 1.5 default.

---

### Badge

```typescript
type BadgeProps = {
  variant: 'forge' | 'privacy-public' | 'privacy-personal' | 'count' | 'status-dot';
  label?: string;
  count?: number;
  status?: 'online' | 'offline';
};
```

| Variant | bg | text | shape |
|---|---|---|---|
| forge | primary | surface-base | pill |
| privacy-public | surface-3 | text-muted | pill |
| privacy-personal | accent-warm | surface-base | pill |
| count | surface-3 | text-muted | rounded, count only |
| status-dot | 8px dot, online=state-forged / offline=state-leech | — | circle |

---

### Tag

```typescript
type TagProps = {
  label: string;
  removable?: boolean;
  onRemove?: () => void;
  variant?: 'default' | 'success' | 'warning';
};
```

Height 28px; padding 6px 10px; radius sm.
Default: surface-3 bg, text-muted.
Success: state-forged bg, surface-base text.
Warning: accent-warm bg, surface-base text.
Removable: x icon 14px right, hover bg surface-2.

---

### Spinner

```typescript
type SpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'muted';
  label?: string;
};
```

Sizes: sm 16px, md 20px, lg 24px.
Colors: primary border-top #7C3AED, white border-top #FFFFFF, muted border-top #A5A0B8.
Reduced motion: instant opacity pulse, no rotation.
Accessibility: parent has role status + aria-live polite; label sr-only.

---

### Divider

```typescript
type DividerProps = {
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'sm' | 'md';
  color?: 'subtle' | 'default';
};
```

Horizontal: 100% width, height border_1px.
Vertical: 1px width, height 100%.
Color: subtle=border-subtle, default=border-default.
Vertical spacing: sm=space-2, md=space-4.
Accessibility: role separator + aria-orientation, or aria-hidden if purely decorative.

---

### SourceCard

```typescript
type SourceCardProps = {
  id: string;
  sourceType: 'web_article' | 'youtube' | 'pdf';
  title: string;
  privacyLevel: 'public' | 'personal' | 'enterprise';
  status: 'captured' | 'summarized' | 'imprinted' | 'gap';
  wordCount?: number;
  capturedAt?: string;
  onForge?: () => void;
  onPreview?: () => void;
  compact?: boolean;
};
```

Layout 400px width:
```
┌─[icon 20px] [title h3 text-primary]─────[privacy dot 8px]─┐
│ [source_type · wordCount · captured_at body_sm muted]     │
│               [Forge primary] [Preview ghost]             │
└───────────────────────────────────────────────────────────┘
```

Radius md, elevation card, padding normal space-4 / compact space-3.
Hover: elevation elevated, actions row visible.
Loading: title shimmer sweep, Spinner 20px, meta hidden.
Error: top border 2px state-leech, inline message.
Accessibility: role article + aria-labelledby → title; privacy dot role img + aria-label.

---

### CaptureProgress

```typescript
type CaptureProgressProps = {
  current: number;
  total: number;
  statusText: string;
};
```

Bar height 3px; track bg border-subtle; fill bg primary.
Fill width = (current / total) × 100%.
Transition duration_slow 350ms easing_standard.

| State | Fill color | Text |
|---|---|---|
| Default | primary | statusText |
| Complete | state-forged | "Done" — visible 2000ms then fade out |
| Error | state-leech | "Extraction failed" — bar red shimmer once |

Accessibility: role progressbar + aria-valuenow/min/max + aria-label statusText; aria-live polite on status text.

---

### EmptyState

```typescript
type EmptyStateProps = {
  icon?: 'flame' | 'book' | 'search';
  headline: string;
  body: string;
  ctaLabel?: string;
  onCta?: () => void;
};
```

Centered, max-width 260px, padding space-5.
Icon 40px, text-muted.
Headline h3 text-muted, margin space-3 top.
Body body_sm text-muted, max 200 chars.
CTA ForgeButton, space-5 margin-top.
Accessibility: role status if informative.

---

### ErrorState

```typescript
type ErrorStateProps = {
  headline: string;
  body: string;
  ctaPrimary?: { label: string; onClick: () => void };
  ctaSecondary?: { label: string; onClick: () => void };
};
```

Icon 40px state-leech.
Headline h3 state-leech, margin space-3 top.
Body body_sm text-muted, max 220 chars.
CTA row space-2 gap; side-by-side ≥300px else stacked.

| CTA | Style |
|---|---|
| Primary (Retry) | button_secondary, hover tint state-leech 15% |
| Secondary (Dismiss) | ghost |

Accessibility: role alert; CTA Primary focusable; Escape closes if dismiss present.

---

### Toast

```typescript
type ToastVariant = 'info' | 'success' | 'warning' | 'leech';
type ToastProps = {
  id: string;
  message: string;
  variant: ToastVariant;
  onClose?: () => void;
};
```

| Variant | bg | left border | icon | text |
|---|---|---|---|---|
| info | surface-2 | primary | info 18px | text-primary |
| success | surface-2 | state-forged | check 18px | text-primary |
| warning | surface-2 | accent-warm | alertTriangle 18px | text-primary |
| leech | surface-2 | state-leech | x 18px | text-primary |

Height 44px; padding space-3 space-4; radius md; shadow card.
Enter: translateX(100%) → translateX(0) duration_normal easing_decel.
Hold: auto-dismiss 4000ms.
Exit: opacity 0 duration_normal easing_accel.
Queue: max 3 stacked, oldest dismissed on overflow.
Accessibility: role status + aria-live polite; close button aria-label "Dismiss notification".

---

### SidePanelHeader

```typescript
type SidePanelHeaderProps = {
  activeTab: 'home' | 'review' | 'cosmos';
  isOnline: boolean;
  queuedAI: number;
  onTabChange: (tab: 'home' | 'review' | 'cosmos') => void;
  onSettingsOpen: () => void;
};
```

Height 44px fixed; bg surface-1; border-bottom border_1px solid border-subtle.
Left: Flame 20px + "NainoForge" h3 text-primary, gap space-2.
Center tabs: inactive caption medium 500 text-muted no underline; active caption medium 500 primary-light underline 2px primary duration_fast; hover text-body underline 2px transparent.
Right: Settings2 18px text-muted ghost; network dot 8px badge shape green/red + optional caption count accent-warm.

Network dot: online → state-forged (#22C55E), offline → state-leech (#EF4444). If queuedAI > 0 → caption accent-warm count right of dot.
Accessibility: tabs role tablist/tab + aria-selected + aria-controls. Settings aria-label "Settings". Network dot aria-label "Online — n AI tasks queued" / "Offline".

---

### SourcesList

```typescript
type SourcesListProps = {
  sources: CapturedSource[];
  loading?: boolean;
  onSourceClick: (id: string) => void;
};
```

Header height 36px; typo h2 text-primary.
Count badge caption bg surface-3 text-muted padding space-1 horiz space-2.
List gap space-2 (8px); scroll overflow-y auto, padding-bottom space-5.

| State | Visual |
|---|---|
| Default | scrollable list, space-2 gap |
| Loading | 3 placeholder SourceCards shimmer surface-2 → surface-3 sweep duration_slow 350ms repeat 1.5s |
| Empty | EmptyState centered, "No sources captured yet. Browse to an article and click Forge." |

Accessibility: list role list, item role listitem. Loading container aria-busy true.

---

### SourceDetail

```typescript
type SourceDetailProps = {
  source: CapturedSource;
  onBack: () => void;
  onOpenImprint?: () => void;
  onGenerateCards?: () => void; // disabled if IQS < 30
};
```

Back CTA body_sm text-muted ghost.
Title h1 text-primary, space-4 bottom padding.
Badges gap space-2, tag shape.
Content pane bg surface-2, radius md, max-height 60vh, overflow-y scroll, padding space-4; typo body_sm text-body.
Actions row gap space-2, space-4 top margin.
Generate cards disabled reason: body_sm text-muted right "IQS {n} < 30 minimum".

| State | Visual |
|---|---|
| Default | content scrollable, Generate enabled |
| Loading | shimmer content placeholder |
| Error | state-leech inline, retry CTA |
| Disabled | actions dimmed, generate blocked |

Accessibility: main landmark; back button aria-label "Back to sources"; title aria-labelledby; actions sequential tab order.

Button

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
