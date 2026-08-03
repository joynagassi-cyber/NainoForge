# UX Chrome — NainoForge v2.0 "Neuro-Technical"

> Pré-analyse et génération complète du workflow BMAD UX pour NainoForge Chrome Extension.
> Date : 2026-08-03
> Statut : final
> **Produit :** Extension Chrome (Popup · Side Panel · App Mode)

## Livrables générés

| Fichier | Description | Lignes |
|---|---|---|
| `DESIGN.md` | Design system Chrome extension étendu (tokens, motion, icônes, accessibilité) | ~350 |
| `EXPERIENCE.md` | Information architecture, journeys, affective design, microcopy | ~450 |
| `SPEC.md` | Mapping traçable PRD→FL→SC→SCR, specs écran par écran | ~300 |
| `mockups/SCR-01-HomeScreen.html` | Maquette interactive HomeScreen | — |
| `mockups/SCR-04-ImprintEditorScreen.html` | Maquette interactive IMPRINT Editor | — |
| `mockups/SCR-05-PostForgeSnapshotScreen.html` | Maquette interactive Post-Forge Snapshot | — |
| `mockups/SCR-06-ReviewScreen.html` | Maquette interactive Review Card + Flip | — |
| `mockups/SCR-08-StudentAIScreen.html` | Maquette interactive Student AI Chat | — |

## Résumé des extensions BMAD

### Gap 1 — Motion Design
- **Avant** : 3 durées (120/200/350ms) + 3 easing
- **Après** : 7 durées (80/120/200/350/600/1000ms) + 6 easing curves + 6 keyframes + 14 micro-interactions

### Gap 2 — Sensations/Émotions
- **Avant** : Absent
- **Après** : Section "Affective Design" avec 10 mappings écran→émotion→signal→haptique

### Gap 3 — Iconographie
- **Avant** : 25 icônes TypeScript
- **Après** : 52 icônes Lucide avec nomenclature sémantique, 5 tailles, 4 contextes

### Gap 4 — Accessibilité Chrome extension
- **Avant** : WCAG 2.1 AA desktop
- **Après** : WCAG 2.1 AA Chrome extension étendu (touch targets 48px, dynamic type 200%, haptics, safe area)

### Gap 5 — Micro-interactions
- **Avant** : Quelques transitions CSS
- **Après** : 14 interactions spec avec trigger, animation, duration, easing, haptique

## Écrans documentés

| ID | Écran | PRD refs | États |
|---|---|---|---|
| SCR-01 | HomeScreen | FR-CAP, FR-BRIEF, FR-LEECH | 6 états |
| SCR-02 | SourceDetailScreen | FR-CAP, FR-DEDUP | 5 états |
| SCR-03 | ForgeCommitScreen | FR-COMMIT | 1 état |
| SCR-04 | ImprintEditorScreen | FR-IMP, FR-IQS | 6 états |
| SCR-05 | PostForgeSnapshotScreen | FR-SNAP, FR-CURVE | 2 états |
| SCR-06 | ReviewScreen | FR-FSRS, FR-LEECH | 6 états |
| SCR-07 | ReviewResultScreen | FR-FSRS | 2 états |
| SCR-08 | StudentAIScreen | FR-STUD, FR-IQS | 7 états |
| SCR-09 | CosmosScreen | FR-COS | 6 états |
| SCR-10 | CosmosNodeScreen | FR-COS, FR-BLOOM, FR-CARD | 4 états |
| SCR-11 | DailyBriefingScreen | FR-BRIEF, FR-LEECH | 2 états |
| SCR-12 | SettingsScreen | FR-GEN, FR-BNDL | 3 états |
| SCR-13 | ImportScreen | FR-CAP, FR-PRIV | 5 états |
| SCR-14 | OnboardingScreen | FR-GEN | 4 étapes |
| SCR-15 | FreeTrialScreen | FR-PRIV | 2 états |

## User Flows

| ID | Flow | Screens | PRD refs |
|---|---|---|---|
| FL-01 | Article Capture | SCR-01→02→03→04→05 | FR-CAP-001→005 |
| FL-02 | YouTube Capture | SCR-01→02→03→04→05 | FR-CAP-006→010 |
| FL-03 | Daily Review | SCR-11→06→07 | FR-FSRS-001→003 |
| FL-04 | Student AI | SCR-10→08 | FR-STUD-001→006 |
| FL-05 | PDF Import | SCR-13→02→03→04→05 | FR-CAP-011→015 |
| FL-06 | COSMOS Exploration | SCR-09→10 | FR-COS-001→007 |

## Nomenclature traçable

```
PRD-REQ-FR-CAP-001 → FL-01 → SC-01 → SCR-01
PRD-REQ-FR-IMP-001 → FL-01 → SC-04 → SCR-04
PRD-REQ-FR-FSRS-001 → FL-03 → SC-06 → SCR-06
PRD-REQ-FR-STUD-001 → FL-04 → SC-08 → SCR-08
PRD-REQ-FR-COS-001 → FL-06 → SC-09 → SCR-09
```

## Open Questions (S2)

| ID | Question | Impact |
|---|---|---|
| OQ-01 | FSRS WASM tuning Chrome extension | Performance review |
| OQ-02 | Student AI prompt guardrails | Security |
| OQ-03 | COSMOS layout Chrome extension | Navigation |
| OQ-04 | Push notification timing | Daily Briefing |
| OQ-05 | PDF extraction size limit | Memory |
| OQ-06 | YouTube transcript language | Coverage |
| OQ-07 | Haptic API compatibility | UX consistency |
| OQ-08 | Voice input non-native speakers | Accessibility |
