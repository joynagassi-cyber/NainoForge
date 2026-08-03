# NainoForge — Design Delivery Summary

> **Genere depuis DESIGN.md** — 2026-08-03

## Design System Source

| Fichier | Rôle |
|---|---|
| DESIGN.md | Tokens, components, motion |
| globals.css | CSS custom properties |
| tailwind.config.ts | Tailwind token mapping |

## Screen Specifications (15 screens)

| ID | Screen | Contextes | États | PRD refs |
|---|---|---|---|---|
| SCR-01 | HomeScreen | All | 6 | FR-CAP, FR-BRIEF |
| SCR-02 | SourceDetail | All | 5 | FR-CAP, FR-DEDUP |
| SCR-03 | ForgeCommit | All | 1 | FR-COMMIT |
| SCR-04 | ImprintEditor | All | 6 | FR-IMP, FR-IQS |
| SCR-05 | PostForgeSnapshot | All | 2 | FR-SNAP |
| SCR-06 | ReviewScreen | All | 6 | FR-FSRS |
| SCR-07 | ReviewResult | All | 2 | FR-FSRS |
| SCR-08 | StudentAIScreen | All | 7 | FR-STUD |
| SCR-09 | CosmosScreen | All | 6 | FR-COS |
| SCR-10 | CosmosNode | All | 4 | FR-COS, FR-BLOOM |
| SCR-11 | DailyBriefing | Popup+Panel | 2 | FR-BRIEF |
| SCR-12 | Settings | All | 3 | FR-GEN |
| SCR-13 | ImportScreen | All | 5 | FR-CAP, FR-PRIV |
| SCR-14 | Onboarding | All | 4 | FR-GEN |
| SCR-15 | FreeTrial | All | 2 | FR-PRIV |

## Adaptive Layout

| Rule | Popup | Side Panel | App Mode |
|---|---|---|---|
| Header | 48px | 64px | 64px |
| Max title | headline-2 (24px) | headline-1 if >450px | display (42px) |
| Sidebar | Tab bar | Icon rail ~56px | 240px |
| Content width | 100%-32px | 100%-gutters | 720px |
| Margin metadata | Never | <800px: none | ≥1100px: 120px |