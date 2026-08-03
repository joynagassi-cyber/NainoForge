# NainoForge — Design Tokens

> **Source:** DESIGN.md Neuro-Technical | **Mode:** shadcn/ui | **2026-08-03

## Colors (MD3 Monochromatic)

| Token | Value | Usage |
|---|---|---|
| --nf-bg | #141313 | Canvas |
| --nf-on-bg | #e5e2e1 | Text on bg |
| --nf-surface-low | #1c1b1b | Level 1 (nav) |
| --nf-surface | #201f1f | Level 2 (modals) |
| --nf-surface-high | #2a2a2a | Level 2b |
| --nf-surface-highest | #353434 | Level 3 (floating) |
| --nf-on-surface | #e5e2e1 | Body text |
| --nf-on-surface-variant | #c4c7c8 | Secondary text |
| --nf-primary | #ffffff | Buttons, icons, focus |
| --nf-on-primary | #2f3131 | Text on primary |
| --nf-primary-container | #e2e2e2 | Container |
| --nf-secondary-container | #484646 | Chips, tags |
| --nf-on-secondary-container | #b8b4b4 | Text on container |
| --nf-error-container | #93000a | Error bg |
| --nf-on-error | #690005 | Text on error |

## Typography

| Token | Size | Weight | Line-height | Usage |
|---|---|---|---|---|
| display | 42px | 400 | 1.15 | Hero (App only) |
| h1 | 32px | 400 | 1.20 | Page titles |
| h2 | 24px | 400 | 1.25 | Section titles |
| h3 | 18px | 500 | 1.35 | Card titles |
| body-lg | 16px | 300 | 1.65 | Body text |
| body | 14px | 300 | 1.60 | Body small |
| caption | 12px | 500 | 1.50 | Uppercase labels |
| code | 13px | 400 | 1.70 | Technical labels |

## Spacing

| Token | Value |
|---|---|
| xxs | 4px |
| xs | 8px |
| sm | 12px |
| md | 16px |
| lg | 24px |
| xl | 32px |
| 2xl | 48px |
| 3xl | 64px |

## Radius

| Token | Value |
|---|---|
| sm | 2px |
| md | 6px |
| lg | 8px |
| xl | 12px |
| full | 9999px |

## Motion

| Token | Value |
|---|---|
| snap | 80ms |
| fast | 120ms |
| normal | 200ms |
| slow | 350ms |
| long | 600ms |

## Component Tokens

### Button
| Variant | Bg | Text |
|---|---|---|
| primary | --nf-primary | --nf-on-primary |
| secondary | --nf-secondary-container | --nf-on-secondary-container |
| ghost | transparent | --nf-on-surface |
| destructive | --nf-error-container | --nf-on-error |

### Card
| State | Bg | Border |
|---|---|---|
| default | --nf-surface-low | --nf-outline-variant |
| hover | --nf-surface | --nf-outline |
| elevated | --nf-surface-high | --nf-outline |