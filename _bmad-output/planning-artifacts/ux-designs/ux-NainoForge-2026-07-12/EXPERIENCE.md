---
name: nainoforge-experience
description: NainoForge S1 information architecture, behavior, states, interactions, accessibility, journeys
status: final
updated: 2026-07-12
---

# EXPERIENCE — NainoForge S1

## Foundation

Form factor: Chrome Extension MV3.
UI system: custom CSS Modules in extension, shadow-free host-page badge.
Visual identity: DESIGN.md.
Theme: dark mode only.

## Information Architecture

Surfaces:
- Side Panel 400px
  - Tabs: Home / Review / Cosmos
  - Header with network status dot + queued AI count
- Content Script surfaces
  - Article badge fixed top-right
  - YouTube badge fixed top-right
- Offscreen Document
  - pdf.js extraction only
- Popup not shipped in S1

Global app states:
1. idle — no sources
2. capturing — extraction in flight
3. ready — source persisted in IndexedDB
4. error — extraction or storage failed
5. reviewing — FSRS review session in S2
6. imprinting — auto-imprint running in S2
7. cosmos — concept graph view in S2

## Voice and Tone

Forge vocabulary: capture → forge → imprint → review.
Copy tokens (English — i18n deferred to S2):
- CTA label: "Forge this page" / "Forge this video" / "Forge"
- Loading: "Forging…"
- Success: "Forged"
- Error: "Extraction failed"
- Empty: "No sources captured yet. Browse to an article and click Forge."

## Component Patterns

### States per screen

Default · Loading · Empty · Error · Success · Disabled

#### Article capture

```
[Document host page]
┌─[forge badge fixed top-right]─────────────────┐
│ [ForgeButton] label / loading / disabled        │
└────────────────────────────────────────────────┘
```

States:
- Default: badge visible, button ready
- Loading: spinner left + "Forging…", aria-busy true, disabled true
- Success: label returns, no spinner, event `nf:article:captured` dispatched
- Error: label returns, console debug logged
- Disabled: not exposed in article flow (no pre-conditions)
- Duplicate dedup: silent skip, log `[nf-repo] dedup skip hash=...`

#### YouTube capture

```
[YouTube watch page]
┌─[forge badge fixed top-right]─────────────────┐
│ [ForgeButton] "Forger cette vidéo"             │
│ loading → event nf:youtube:captured             │
└────────────────────────────────────────────────┘
```

States: same as article, distinct label.
SPA navigation: MutationObserver on body childList+subtree, URL regex `v=VIDEO_ID`, poll `ytInitialPlayerResponse` 100ms max 5s.

#### Side Panel empty

```
┌─ Side Panel 400px ─────────────────────────┐
│ [Header: brand / tabs / network / settings] │
│                                             │
│        [EmptyState flame 40px]              │
│        "No sources captured yet"            │
│        "Browse to an article and click Forge"│
│        [ForgeButton]                        │
└─────────────────────────────────────────────┘
```

#### Side Panel list

```
┌─ Side Panel 400px ─────────────────────────┐
│ [Header]                                    │
│ Sources [count badge]                       │
│ ┌─[SourceCard]─────────[privacy dot]───────┐│
│ │ title h3                                  ││
│ │ source_type · wordCount · time body_sm    ││
│ │ [Forge primary] [Preview ghost]           ││
│ └──────────────────────────────────────────┘│
│ ┌─[SourceCard] ...                         ┐│
│ └──────────────────────────────────────────┘│
│ ...                                         │
└─────────────────────────────────────────────┘
```

List states:
- Default: scrollable list, space-2 gap, hover shows actions
- Loading: shimmer SourceCards ×3
- Empty: EmptyState centered
- Error: top border 2px state-leech, inline message
- Success: status transitions to ready, card updates
- Disabled: actions row hidden on cards not owned

#### Offscreen PDF

States:
- Default: waiting message
- Loading: CaptureProgress bar 3px, status text
- Complete: progress reaches 100%, color state-forged 2000ms then fades
- Error: bar red shimmer once, status "Extraction failed"
- Disabled: N/A for S1

## State Patterns

### Cran indicator

5 levels: 1 discovery · 2 capture · 3 clean · 4 imprint · 5 review.
Color mapping:
1 → text-muted
2 → accent-warm
3 → primary
4 → state-forged
5 → state-forged + flame icon

### Source status flow

pending → processing → ready → error
Transitions:
- capture starts → processing
- extraction done → ready
- extraction/persist fails → error

### Side Panel global states

- online/offline dot: green/red 8px badge shape
- queuedAI > 0: caption accent-warm count right of dot

## Interaction Primitives

- ForgeButton: click → loading 120ms → success/error → reset 200ms
- SourceCard hover: elevation card → elevated, actions row visible
- Tab switch: underline 2px primary duration_fast
- Loading shimmer: surface-2 → surface-3 sweep duration_slow 350ms repeat 1.5s
- Progress bar: width transition duration_slow 350ms easing_standard

Keyboard:
- Tab order within viewport only
- Focus moves to first interactive element on tab switch
- Escape dismisses error state if dismiss CTA present
- ForgeButton: Enter/Space activates
- SourcesList: arrow up/down moves focus between cards

## Accessibility Floor

- Tabs: role tablist/tab, aria-selected, aria-controls
- Network dot: aria-label "Online — n AI tasks queued" / "Offline"
- SourceCard: role article, aria-labelledby → title
- Privacy dot: role img, aria-label privacyLevel
- Loading container: aria-busy true
- Progressbar: aria-valuenow/min/max, aria-label statusText, aria-live polite
- EmptyState: role status if informative
- ErrorState: role alert
- Reduced motion: @media (prefers-reduced-motion: reduce) → transition none, spinner instant bar

Focus management:
- Focus ring: 0 0 0 2px primary, 0 0 0 4px surface-base
- Focus visible only, never outline removal without replacement

## Key Flows

### UJ-1 — Article

1. User opens article on Medium/Substack/news
2. Content script detects isArticlePage ≥3/5 signals
3. Badge "Forger cette page" fixed top-right
4. User clicks badge
5. Loading: spinner + "Forging…" + aria-busy
6. Readability extracts + Turndown converts → DCM
7. SHA-256 hash computed; dedup check
8. CapturedSource inserted into nf_sources
9. Event `nf:article:captured` dispatched
10. Badge resets to default
11. User opens Side Panel → source appears in SourcesList

### UJ-2 — YouTube

1. User navigates to youtube.com/watch?v=ID
2. YouTubeAutoCapture starts; MutationObserver watches body
3. Poll ytInitialPlayerResponse 100ms/5s
4. Badge "Forger cette vidéo" injected same position
5. User clicks badge
6. Loading state
7. Event `nf:youtube:captured` dispatched with player_response
8. Background/offscreen path extracts transcript in S2
9. Source appears in Side Panel when persisted

### UJ-3 — Review (S2)

1. User opens Side Panel Review tab
2. Lists captured sources ready for review
3. Enters FSRS review session
4. Rating: again / hard / good / easy
5. SMI state updates: discovery → capture → clean → imprint → review

### UJ-4 — Student AI (S2)

1. User opens Cosmos tab
2. Imprint notes rendered as concept cards
3. AI tutoring via student-ai package
4. Bloom/cran levels drive question generation

### UJ-5 — PDF

1. User drops PDF into extension (S2)
2. Offscreen document receives message extract-pdf
3. pdfjs-dist parses page-by-page
4. DCM pdf returned, persisted to IndexedDB
5. Side Panel shows PDF source

## Concern Scan

- i18n: en/fr in S1; full l10n S2
- dark/light: dark mode only in S1; light mode S2
- notifications: none in S1; push/notify S2
- offline: indexedDB local only; sync S2
- input modality: mouse + keyboard; touch targets 44px
- density: side panel fixed 400px; padding 12–16px
- privacy: public/personal/enterprise selectable per source

## Open Questions S2

| ID | Question | Impact |
|---|---|---|
| OQ-01 | Side Panel Review tab FSRS algorithm tuning | Review scheduling + SM2 params |
| OQ-02 | Student AI prompt injection guardrails | Security + content policy |
| OQ-03 | Cosmos graph layout and interaction metaphor | Navigation + performance |
| OQ-04 | Sync provider choice (Supabase / custom) | Backend architecture |
| OQ-05 | PDF metadata extraction quality vs size limit | Offscreen timeout + memory |
| OQ-06 | YouTube transcript language fallback policy | Coverage for multilingual channels |
