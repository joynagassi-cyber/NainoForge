---
name: nainoforge-Chrome extension-spec
description: NainoForge Chrome extension — mapping traçable PRD→FL→SC→SCR, spécifications écran par écran
status: draft
updated: 2026-08-03
platform: Chrome extension
---

# SPEC — NainoForge Chrome extension v2.0

> Mapping traçable des exigences PRD vers les écrans et scénarios UX.
> Référence: DESIGN.md (visuel), EXPERIENCE.md (comportement).

## Nomenclature

| Niveau | Format | Exemple |
|---|---|---|
| PRD Requirement | `PRD-REQ-FR-{MODULE}-{NNN}` | `PRD-REQ-FR-CAP-001` |
| User Flow | `FL-{NNN}` | `FL-01` |
| Scenario | `SC-{NNN}` | `SC-04` |
| Screen | `SCR-{NNN}` | `SCR-04` |

---

## Mapping PRD → FL → SC → SCR

### Module CAP (Capture)

| PRD Requirement | User Flow | Scenario | Screen(s) |
|---|---|---|---|
| FR-CAP-001 (Article detection) | FL-01 | SC-01 | SCR-01 → SCR-02 |
| FR-CAP-002 (Forge badge) | FL-01 | SC-01 | SCR-01 (badge overlay) |
| FR-CAP-003 (Mode A/B/C) | FL-01, FL-02 | SC-01, SC-02 | SCR-02 |
| FR-CAP-004 (DOMPurify + Turndown) | FL-01 | — | — (backend) |
| FR-CAP-005 (extraction_confidence) | FL-01 | — | SCR-02 (metadata) |
| FR-CAP-006 (YouTube MutationObserver) | FL-02 | SC-02 | SCR-01 → SCR-02 |
| FR-CAP-007 (ytInitialPlayerResponse) | FL-02 | SC-02 | SCR-02 |
| FR-CAP-008 (subtitle priority) | FL-02 | SC-02 | SCR-02 |
| FR-CAP-009 (timedtext API) | FL-02 | SC-02 | — (backend) |
| FR-CAP-010 (fallback options) | FL-02 | SC-02b | SCR-02 (fallback modal) |
| FR-CAP-011 (drag-and-drop import) | FL-05 | SC-05 | SCR-13 |
| FR-CAP-012 (format detection) | FL-05 | SC-05 | SCR-13 |
| FR-CAP-013 (Offscreen Document) | FL-05 | SC-05 | — (backend) |
| FR-CAP-014 (privacy=personal) | FL-05 | SC-05 | SCR-13 (privacy selector) |
| FR-CAP-015 (EPUB V1 post-MVP) | — | — | — (hors scope) |

### Module DEDUP (Déduplication)

| PRD Requirement | User Flow | Scenario | Screen(s) |
|---|---|---|---|
| FR-DEDUP-001 (SHA-256 hash) | FL-01, FL-02, FL-05 | — | — (backend) |
| FR-DEDUP-002 (dedup notification) | FL-01, FL-02, FL-05 | SC-01b | SCR-02 (duplicate banner) |
| FR-DEDUP-003 (open existing or new) | FL-01, FL-02, FL-05 | SC-01b | SCR-02 (action row) |

### Module IMP (IMPRINT)

| PRD Requirement | User Flow | Scenario | Screen(s) |
|---|---|---|---|
| FR-IMP-001 (write reformulation) | FL-01, FL-02, FL-05 | SC-04 | SCR-04 |
| FR-IMP-002 (Pareto summary right, chunks left) | FL-01, FL-02, FL-05 | SC-04 | SCR-04 |
| FR-IMP-003 (Cran indicator real-time 1-5) | FL-01, FL-02, FL-05 | SC-04 | SCR-04 (Cran bar) |
| FR-IMP-004 (min Cran ≥ 1, 20 mots min) | FL-01, FL-02, FL-05 | SC-04 | SCR-04 (validate disabled) |
| FR-IMP-005 (anti-hallucination validator) | FL-01, FL-02, FL-05 | SC-04 | SCR-04 (warning banner) |

### Module COMMIT (Commitment Screen)

| PRD Requirement | User Flow | Scenario | Screen(s) |
|---|---|---|---|
| FR-COMMIT-001 (3s non-skippable) | FL-01, FL-02, FL-05 | SC-03 | SCR-03 |

### Module SNAP (Post-Forge Snapshot)

| PRD Requirement | User Flow | Scenario | Screen(s) |
|---|---|---|---|
| FR-SNAP-001 (5s snapshot) | FL-01, FL-02, FL-05 | SC-05 | SCR-05 |

### Module CURVE (Forgetting Curve)

| PRD Requirement | User Flow | Scenario | Screen(s) |
|---|---|---|---|
| FR-CURVE-001 (ASCII retention curve, optional) | FL-01, FL-02, FL-05 | SC-05b | SCR-05 (optional panel) |

### Module IQS (IMPRINT Quality Score)

| PRD Requirement | User Flow | Scenario | Screen(s) |
|---|---|---|---|
| FR-IQS-001 (IQS calculation) | FL-01, FL-02, FL-05 | SC-04 | — (calcul silencieux) |
| FR-IQS-002 (IQS not shown during session) | FL-01, FL-02, FL-05 | SC-04 | — |
| FR-IQS-003 (IQS < 30 × 3 → Student AI auto) | FL-01, FL-02, FL-05 | SC-04b | SCR-08 (auto-trigger) |

### Module BLOOM (Bloom Level Auto-Tagging)

| PRD Requirement | User Flow | Scenario | Screen(s) |
|---|---|---|---|
| FR-BLOOM-001 (auto-tag Bloom level) | FL-01, FL-02, FL-05 | — | SCR-10 (Bloom tag on node) |
| FR-BLOOM-002 (color COSMOS nodes) | FL-06 | — | SCR-09 (node colors) |

### Module CARD (Flashcards — 5 Types)

| PRD Requirement | User Flow | Scenario | Screen(s) |
|---|---|---|---|
| FR-CARD-001 (min 1 B02 + 1 B04) | FL-01, FL-02, FL-05 | SC-06 | SCR-10 (card list) |
| FR-CARD-002 (B03/B05 if Cran ≥ 3) | FL-01, FL-02, FL-05 | SC-06 | SCR-10 (card types) |
| FR-CARD-003 (B01 once per concept) | FL-01, FL-02, FL-05 | SC-06 | — (backend logic) |
| FR-CARD-004 (LLM prompt templates) | FL-01, FL-02, FL-05 | — | — (backend) |
| FR-CARD-005 (card data structure) | — | — | — |

### Module FSRS (Spaced Repetition)

| PRD Requirement | User Flow | Scenario | Screen(s) |
|---|---|---|---|
| FR-FSRS-001 (WASM scheduler) | FL-03 | SC-06 | SCR-06 (stateless, bg) |
| FR-FSRS-002 (100% offline review) | FL-03 | SC-06 | SCR-06 |
| FR-FSRS-003 (Micro/Standard/Deep sessions) | FL-03 | SC-06 | SCR-06 (session type selector) |

### Module LEECH (Leech Detection)

| PRD Requirement | User Flow | Scenario | Screen(s) |
|---|---|---|---|
| FR-LEECH-001 (8 lapses → Leech) | FL-03 | SC-06b | SCR-06 (leech card highlight) |
| FR-LEECH-002 (suspend from cycle) | FL-03 | SC-06b | SCR-06 |
| FR-LEECH-003 (Daily Briefing signal) | FL-03, FL-11 | SC-11 | SCR-11 (leech mention) |
| FR-LEECH-004 (3 auto-alternatives) | FL-03 | SC-06b | SCR-06 (alternatives sheet) |
| FR-LEECH-005 (re-IMPRINT → change card type) | FL-03 | SC-06b | SCR-10 (card type change) |

### Module REV (Immutable Review Events)

| PRD Requirement | User Flow | Scenario | Screen(s) |
|---|---|---|---|
| FR-REV-001 (event logging) | FL-03 | — | — (backend) |
| FR-REV-002 (no UPDATE/DELETE) | FL-03 | — | — (backend) |

### Module STUD (Student AI)

| PRD Requirement | User Flow | Scenario | Screen(s) |
|---|---|---|---|
| FR-STUD-001 (4 cascading analyzers) | FL-04 | SC-08 | SCR-08 |
| FR-STUD-002 (4 states display) | FL-04 | SC-08 | SCR-08 |
| FR-STUD-003 (contradiction → imprint redirect) | FL-04 | SC-08b | SCR-04 (redirect) |
| FR-STUD-004 (confidence calibration) | FL-04 | SC-08 | SCR-08 (pre-session) |
| FR-STUD-005 (Dunning-Kruger alert) | FL-04 | SC-08c | SCR-08 |
| FR-STUD-006 (persona adaptive) | FL-04 | SC-08 | SCR-08 |

### Module COS (COSMOS)

| PRD Requirement | User Flow | Scenario | Screen(s) |
|---|---|---|---|
| FR-COS-001 (semantic tree) | FL-06 | SC-09 | SCR-09 |
| FR-COS-002 (SMI 5D) | FL-06, FL-04 | SC-09, SC-10 | SCR-09, SCR-10 |
| FR-COS-003 (forged if all dims ≥ 60%) | FL-06 | — | SCR-09 (node status) |
| FR-COS-004 (4 visual states) | FL-06 | SC-09 | SCR-09 |
| FR-COS-005 (5 relation types) | FL-06 | SC-09 | SCR-09 (edge types) |
| FR-COS-006 (PIVOTIQ-Lite V1 post-MVP) | — | — | — (hors scope MVP) |
| FR-COS-007 (SMI radar 5D SVG) | FL-06 | SC-10 | SCR-10 |

### Module BRIEF (Daily Forge Briefing)

| PRD Requirement | User Flow | Scenario | Screen(s) |
|---|---|---|---|
| FR-BRIEF-001 (10s screen on open) | FL-03, FL-11 | SC-11 | SCR-11 |
| FR-BRIEF-002 (2 CTAs) | FL-03, FL-11 | SC-11 | SCR-11 |

### Module PRIV (Confidentiality — 3 Levels)

| PRD Requirement | User Flow | Scenario | Screen(s) |
|---|---|---|---|
| FR-PRIV-001 (public/personal/enterprise) | FL-01, FL-05 | SC-05, SC-13 | SCR-13 (privacy selector) |
| FR-PRIV-002 (user selects before import) | FL-05 | SC-05 | SCR-13 |
| FR-PRIV-003 (personal/enterprise never leave machine) | FL-05 | SC-05 | SCR-13 (privacy info) |

### Module BNDL (Knowledge Bundle)

| PRD Requirement | User Flow | Scenario | Screen(s) |
|---|---|---|---|
| FR-BNDL-001 (.nfbundle export) | — | SC-12b | SCR-12 (export action) |
| FR-BNDL-002 (re-importable) | — | — | — (backend) |
| FR-BNDL-003 (empty embeddings if no-cloud) | — | — | — |

---

## Screen Specifications — Detailed

### SCR-01 — HomeScreen
- **PRD refs:** FR-CAP-001, FR-CAP-002, FR-BRIEF-001, FR-LEECH-003
- **States:** Default, Loading, Empty, Error, Success, Offline
- **Key interactions:** Tab switch, SourceCard tap → SCR-02, FAB → SCR-13, Streak tap → SCR-11
- **Motion:** Tab switch 200ms fade, Card hover elevated, Loading shimmer 1.5s infinite

### SCR-02 — SourceDetailScreen
- **PRD refs:** FR-CAP-003, FR-CAP-005, FR-DEDUP-002, FR-DEDUP-003
- **States:** Default, Loading, Error, Success (already forged), Disabled (enterprise)
- **Key interactions:** Back → SCR-01, Forge → SCR-03, Preview → expand content, ⋯ → overflow menu
- **Motion:** Content reveal 200ms decel, Duplicate banner slide-in 200ms

### SCR-03 — ForgeCommitScreen
- **PRD refs:** FR-COMMIT-001
- **States:** Single (3s non-skippable)
- **Key interactions:** None (auto-advance)
- **Motion:** Flame pulse 1s loop, Countdown bar 3s linear, Haptic at 1s + 2s

### SCR-04 — ImprintEditorScreen
- **PRD refs:** FR-IMP-001, FR-IMP-002, FR-IMP-003, FR-IMP-004, FR-IMP-005, FR-IQS-001
- **States:** Default, Loading, Success (Cran flash), Error, Blocked (cran<1), Warning (hallucination)
- **Key interactions:** Save → SCR-05, Back → SCR-02, Swipe chunk nav, Auto-save 3s debounce
- **Motion:** Cran indicator color shift 120ms, Warning banner slide-in 200ms, Save flash 500ms

### SCR-05 — PostForgeSnapshotScreen
- **PRD refs:** FR-SNAP-001, FR-CURVE-001
- **States:** Default (showing), Dismissed (transition)
- **Key interactions:** "View in COSMOS" → SCR-09, "Continue" → SCR-01, Swipe down to dismiss
- **Motion:** Flame ignition 1000ms bounce, Particles burst, Snapshot fade-out 200ms

### SCR-06 — ReviewScreen
- **PRD refs:** FR-FSRS-001, FR-FSRS-002, FR-FSRS-003, FR-LEECH-001, FR-LEECH-002, FR-LEECH-004
- **States:** Default (question hidden), Flipped (answer visible), Rating selected, Loading, Empty, Leech detected
- **Key interactions:** Tap card to flip, Rating buttons → auto-next, Leech alternatives → sheet
- **Motion:** Card flip 400ms spring, Rating button press 150ms, SMI ring fill 600ms decel

### SCR-07 — ReviewResultScreen
- **PRD refs:** FR-FSRS-001 (result aggregation)
- **States:** Default, Transition-out
- **Key interactions:** "Review again" → SCR-06, "Home" → SCR-01
- **Motion:** CheckCircle scale-in 300ms spring, Stats count-up 600ms

### SCR-08 — StudentAIScreen
- **PRD refs:** FR-STUD-001, FR-STUD-002, FR-STUD-003, FR-STUD-004, FR-STUD-005, FR-STUD-006, FR-IQS-003
- **States:** Default, Analyzing, Gap detected, Mastered, Dunning-Kruger alert, Offline, Loading
- **Key interactions:** Send message, Voice input, "Re-forge" → SCR-04, "Back" → SCR-10
- **Motion:** AI typing cursor blink 500ms, Result card slide-up 350ms spring, Alert banner pulse 1200ms

### SCR-09 — CosmosScreen
- **PRD refs:** FR-COS-001, FR-COS-002, FR-COS-003, FR-COS-004, FR-COS-005
- **States:** Default, Loading, Empty, Gap highlighted, Selected, Offline
- **Key interactions:** Tap node → SCR-10, Search → filter, FAB → SCR-13, Pinch zoom, Pan
- **Motion:** Node pulse (gap/leech) 1200ms, Selection scale 200ms, Filter transition 200ms

### SCR-10 — CosmosNodeScreen
- **PRD refs:** FR-COS-002, FR-COS-005, FR-COS-007, FR-BLOOM-001, FR-CARD-001
- **States:** Default, Loading, Error, Student AI active
- **Key interactions:** Back → SCR-09, "Student AI" → SCR-08, "Forge" → SCR-04, Card tap → review
- **Motion:** SMI radar fill 600ms decel, Card list stagger 100ms each

### SCR-11 — DailyBriefingScreen
- **PRD refs:** FR-BRIEF-001, FR-BRIEF-002, FR-LEECH-003
- **States:** Default, Snoozed
- **Key interactions:** "Start review" → SCR-06, "Later (1h)" → dismiss + alarm
- **Motion:** Personalized greeting slide-in 350ms spring, Stats count-up 600ms

### SCR-12 — SettingsScreen
- **PRD refs:** FR-GEN-001, FR-BNDL-001
- **States:** Default, Loading (export), Confirm dialog (delete)
- **Key interactions:** Toggle notifications, Change language, Export bundle → file picker, Delete → confirm dialog
- **Motion:** Toggle switch 150ms, Export progress 350ms

### SCR-13 — ImportScreen (FEE)
- **PRD refs:** FR-CAP-011, FR-CAP-012, FR-CAP-013, FR-CAP-014, FR-PRIV-001, FR-PRIV-002, FR-PRIV-003
- **States:** Default, File selected, Processing, Error, Complete
- **Key interactions:** Drop/file select, Privacy selector (3 radio), Forge → SCR-02
- **Motion:** File drop zone highlight 120ms, Progress bar 350ms, Success check 300ms spring

### SCR-14 — OnboardingScreen
- **PRD refs:** FR-GEN-001 (first-run detection)
- **States:** Step 1 (welcome), Step 2 (how it works), Step 3 (permissions), Step 4 (first capture tutorial)
- **Key interactions:** Swipe between steps, "Start" → SCR-01, "Already have account" → auth
- **Motion:** Page swipe 300ms standard, Flame entrance 600ms spring

### SCR-15 — FreeTrialScreen
- **PRD refs:** FR-GEN-002 (trial flag)
- **States:** Default, Subscribed
- **Key interactions:** "Start trial" → SCR-01 (unlocked), "Maybe later" → SCR-01 (limited)
- **Motion:** Checkmark list stagger 100ms, CTA pulse 2s loop

---

## Open Questions (S2)

| ID | Question | Impact | Screen(s) |
|---|---|---|---|
| OQ-01 | FSRS algorithm tuning for Chrome extension WASM | Review accuracy + card scheduling | SCR-06 |
| OQ-02 | Student AI prompt injection guardrails | Security + content policy | SCR-08 |
| OQ-03 | COSMOS graph layout algorithm Chrome extension performance | Navigation + performance | SCR-09 |
| OQ-04 | Push notification timing (morning vs user preference) | Daily Briefing effectiveness | SCR-11 |
| OQ-05 | PDF extraction quality vs size limit on Chrome extension | Offscreen timeout + memory | SCR-13 |
| OQ-06 | YouTube transcript language fallback on Chrome extension | Coverage for multilingual | SCR-02 |
| OQ-07 | Haptic feedback API compatibility (iOS vs Android) | UX consistency | All screens |
| OQ-08 | Voice input accuracy for non-native English speakers | Student AI usability | SCR-08 |
