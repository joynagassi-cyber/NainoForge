---
name: nainoforge-Chrome extension-experience
description: NainoForge Chrome extension — information architecture, journeys, affective design, microcopy, micro-interactions
status: final
updated: 2026-08-03
platform: Chrome extension
---

# EXPERIENCE — NainoForge Chrome extension v2.0

> Ce document spécifie le comportement, les parcours et l'expérience utilisateur Chrome extension.
> Reference visuel : DESIGN.md (tokens, couleurs, typographie, motion, icônes).
> Nomenclature traçable : PRD-REQ → FL → SC → SCR.

## Foundation

**Form factor :** Chrome extension (iOS/Android), portrait principal, 375–430px width.
**UI system :** React Native / WebView Chrome extension, dark mode only.
**Theme :** Forge industrial, violet électrique, amber chaleur.
**Native constraints :** No CSS modules → tokens via `react-native-css-interop` ou tokensJS.

**Thématique cognitive (forge vocabulary) :**
- Capture → Forge → Imprint → Review → Master

### Principes de design Chrome extension
1. **One thumb friendly** : CTA principaux dans la zone accessible du pouce (bas de l'écran)
2. **Progressive disclosure** : Informations détaillées en overlay, surface principale épurée
3. **Forging仪式感** : Chaque forge est un moment — animation ceremony 1000ms, haptic feedback
4. **Offline first** : IndexedDB local, queue pour IA, notification quand reconnecté
5. **Cognitive load minimal** : Une action par écran, jamais plus de 2 CTA côte à côte

---

## Information Architecture

### Surfaces principales

```
┌─────────────────────────────────────┐
│  [Tab Bar — 4 tabs]                 │
│  🏠 Home  📖 Review  🌌 Cosmos  👤 Profile │
├─────────────────────────────────────┤
│                                     │
│  [Screen Content]                   │
│  (scrollable, bottom-sheet overlay) │
│                                     │
└─────────────────────────────────────┘
```

### Surface map

| ID | Surface | Description | Screen count |
|---|---|---|---|
| SCR-01 | `HomeScreen` | Dashboard, sources récentes, streak | 3 états |
| SCR-02 | `SourceDetailScreen` | Détail d'une source, actions forge | 4 états |
| SCR-03 | `ForgeCommitScreen` | 3s commitment screen | 1 état |
| SCR-04 | `ImprintEditorScreen` | Éditeur IMPRINT avec blocs | 4 états |
| SCR-05 | `PostForgeSnapshotScreen` | Snapshot post-forge 5s | 2 états |
| SCR-06 | `ReviewScreen` | Session de révision FSRS | 5 états |
| SCR-07 | `ReviewResultScreen` | Résumé session | 2 états |
| SCR-08 | `StudentAIScreen` | Teach-back session | 6 états |
| SCR-09 | `CosmosScreen` | Graphe sémantique | 4 états |
| SCR-10 | `CosmosNodeScreen` | Détail d'un nœud concept | 3 états |
| SCR-11 | `DailyBriefingScreen` | Briefing quotidien 10s | 2 états |
| SCR-12 | `SettingsScreen` | Paramètres | 3 états |
| SCR-13 | `ImportScreen` | FEE import fichier | 3 états |
| SCR-14 | `OnboardingScreen` | Premier usage | 4 étapes |
| SCR-15 | `FreeTrialScreen` | Essai 7 jours | 2 états |

### Global app states

| State | Description | Trigger |
|---|---|---|
| `idle` | Aucune source | App start |
| `capturing` | Extraction en cours | Click forge badge |
| `ready` | Source persistée | Extraction complète |
| `error` | Échec capture | Timeout ou parsing erreur |
| `reviewing` | Session FSRS active | Launch review |
| `imprinting` | IMPRINT en cours | Forge commit |
| `cosmos` | Vue graphe active | Tab cosmos |
| `student-ai` | Session teach-back | Tab student AI |
| `online` | Connecté | Network check |
| `offline` | Déconnecté | Network loss |
| `forging-ceremony` | Animation forge | IMPRINT validé |

---

## Voice and Tone — Microcopy (Étendu)

### Principes
- **Forge vocabulary** : capture → forge → imprint → review → master
- **Direct** : pas de "Bonjour", pas de formules policières
- **Encourageant mais factuel** : données, pas de flattery
- **French** (i18n en cours, target FR)

### Copy tokens par surface

| Context | Token | Valeur |
|---|---|---|
| CTA Forge | `forge.cta.primary` | "Forger" |
| CTA Forge loading | `forge.cta.loading` | "Forging…" |
| CTA Forge success | `forge.cta.success` | "Forgé ✓" |
| Loading | `common.loading` | "Forging…" |
| Error generic | `common.error` | "Échec de l'extraction" |
| Empty state | `home.empty` | "Aucune source capturée. Explorez une page et touchez Forger." |
| Retry | `common.retry` | "Réessayer" |
| Dismiss | `common.dismiss` | "Fermer" |
| Back | `common.back` | "Retour" |
| Save | `common.save` | "Enregistrer" |
| Cancel | `common.cancel` | "Annuler" |
| Confirm | `common.confirm` | "Confirmer" |
| Review again | `review.again` | "À revoir" |
| Review hard | `review.hard` | "Difficile" |
| Review good | `review.good` | "Solide" |
| Review easy | `review.easy` | "Maîtrisé" |
| Commit message | `commit.message` | "Vous allez forger ce concept. Pas le sauvegarder. Le forger." |
| Post-forge cran | `snapshot.cran` | "Cran atteint : {n}/5" |
| Post-forge iqs | `snapshot.iqs` | "IQS : {n}/100" |
| Post-forge cards | `snapshot.cards` | "Cartes générées : {n}" |
| Post-forge next | `snapshot.next` | "Prochaine révision : {date}" |
| Daily briefing cards | `briefing.cards` | "{n} cartes à réviser aujourd'hui" |
| Daily briefing leeches | `briefing.leeches` | "{n} concept(s) difficile(s)" |
| Daily briefing streak | `briefing.streak` | "Série : {n} jours" |
| Student AI prompt | `student.prompt` | "Expliquez-moi ce concept comme si j'étais nouveau." |
| Student AI gap | `student.gap` | "⚠️ Lacune détectée" |
| Student AI mastered | `student.mastered` | "✅ Concept maîtrisé" |
| Leech message | `leech.message` | "Ce concept résiste. Essayons autrement." |
| Gap message | `gap.message` | "Trou dans la connaissance — Forgez une IMPRINT" |
| Offline toast | `offline.toast` | "Hors ligne — les données IA ne seront pas disponibles" |
| Reconnected toast | `reconnected.toast` | "Reconnecté — synchronisation en cours" |
| Import success | `import.success` | "Source importée" |
| Import error | `import.error` | "Échec de l'import" |

---

## Component Patterns

### States per screen
**Standard :** Default · Loading · Empty · Error · Success · Disabled

### SCR-01 — HomeScreen

```
┌─────────────────────────────────┐
│ [🔥 NainoForge]      [●] [⚙]   │ ← Header 56px
├─────────────────────────────────┤
│                                 │
│  [Streak banner]                │ ← TrendingUp icon
│  "7 jours · 23 cartes"          │
│                                 │
│  [Today's Briefing Card]        │ ← CTA principal
│  "5 cartes à réviser"           │
│  [Démarrer la révision]         │
│                                 │
│  Sources récentes               │ ← Section header
│  ┌─────────────────────────────┐│
│  │ 🔥 Embeddings vectoriels     ││ ← SourceCard
│  │ web_article · 1 234 mots     ││
│  │  Il y a 2h                  ││
│  └─────────────────────────────┘│
│  ┌─────────────────────────────┐│
│  │ 📹 RAG Architecture          ││
│  │ youtube · 15 min             ││
│  │  Hier · ⚠️ Leech            ││
│  └─────────────────────────────┘│
│                                 │
│  [ + ] Importer fichier         │ ← FAB 56px
│                                 │
└─────────────────────────────────┘
```

**États :**
- **Default** : scrollable, sticky header, FAB bottom-right
- **Loading** : shimmer cards ×3, skeleton streak banner
- **Empty** : Flame icon 48px text-muted, "Aucune source", CTA "Explorer une page"
- **Error** : top border 2px state-leech, inline "Réessayer"
- **Success** : toast "Source forger ✓" (auto-dismiss 3s)
- **Disabled** : FAB disabled si offline + pas de retry buffer

### SCR-02 — SourceDetailScreen

```
┌─────────────────────────────────┐
│ [←]  [Title h2]        [⋯]     │ ← Header
├─────────────────────────────────┤
│ [Source type icon] [Title]      │
│ [web_article · 1 234 mots · 2h] │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ [Content preview scrollable] │ │
│ │ Lorem ipsum...               │ │
│ │ ...                          │ │
│ └─────────────────────────────┘ │
│                                 │
│ [🔥 Forger cette source]        │ ← Primary CTA
│ [👁 Aperçu]                     │ ← Ghost CTA
│                                 │
└─────────────────────────────────┘
```

**États :**
- **Default** : content scrollable, CTA primary visible
- **Loading** : shimmer content, spinner overlay
- **Error** : "Échec du chargement", Retry CTA
- **Success** : CTA "Forger" désactivé si déjà forgé, badge "Déjà forgé"
- **Disabled** : content read-only (privacy enterprise)
- **Duplicate** : "Ce contenu a déjà été forgé le {date}. Réviser ou reforguer ?"

### SCR-03 — ForgeCommitScreen

```
┌─────────────────────────────────┐
│                                 │
│                                 │
│         🔥 (flame pulsing)      │ ← 48px, glow-primary
│                                 │
│  "Vous allez forger ce concept" │ ← h2 text-primary
│                                 │
│  "Pas le sauvegarder.           │ ← body text-muted
│   Le forger."                   │
│                                 │
│  [3s countdown bar]             │ ← progress 3s
│                                 │
└─────────────────────────────────┘
```

**État unique (3s non-skippable) :**
- Flame icon pulse `easing-standard` 1s loop
- Countdown bar width 0→100% `duration-ceremony` `easing_standard`
- Haptic: light tap à 1s, double tap à 2s

### SCR-04 — ImprintEditorScreen

```
┌─────────────────────────────────┐
│ [←]  IMPRINT          [✓]      │ ← Header
├─────────────────────────────────┤
│                                 │
│ ┌─[Left panel: source chunk]──┐ │
│ │ Section title               │ │
│ │ Chunk text (scrollable)     │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─[Right panel: editor]───────┐ │
│ │ [BlockNote editor]          │ │
│ │ "Votre reformulation..."    │ │
│ │                             │ │
│ │ [+ Ajouter bloc]            │ │
│ └─────────────────────────────┘ │
│                                 │
│ [Cran indicator: ○○○○○]        │ ← ConfidenceMarker
│ [Mots : 47 / 80 min.]          │ ← body_sm text-muted
│                                 │
└─────────────────────────────────┘
```

**États :**
- **Default** : deux panneaux side-by-side (Chrome extension: stack vertical)
- **Loading** : shimmer editor, spinner left panel
- **Success** : Cran indicator flashes green 500ms
- **Error** : "Erreur de sauvegarde", Retry
- **Anti-hallucination** : "⚠️ Ce point semble différer de votre source. Vérifier ?"
- **Disabled** : Cran < 1, bouton ✓ disabled

**Interactions :**
- Swipe up sur le panneau gauche → voir chunk précédent/suivant
- Drag handle entre les deux panneaux (desktop only)
- Auto-save toutes les 3s (debounced)

### SCR-05 — PostForgeSnapshotScreen

```
┌─────────────────────────────────┐
│                                 │
│     🔥🔥🔥 (particles burst)    │ ← forge-ignition animation
│                                 │
│  "Concept forgé !"              │ ← h1 state-forged
│                                 │
│  ┌───────────────────────────┐  │
│  │ Cran atteint : 3/5        │  │
│  │ IQS : 67/100              │  │
│  │ Cartes générées : 3       │  │
│  │ Prochaine révision : 4j   │  │
│  └───────────────────────────┘  │
│                                 │
│  [🌌 Voir dans COSMOS]          │ ← Primary CTA
│  [📖 Continuer]                 │ ← Secondary CTA
│                                 │
└─────────────────────────────────┘
```

**États :**
- **Default** : snapshot affiché 5s, animations actives
- **Dismissed** : transition fade-out 200ms vers la destination

### SCR-06 — ReviewScreen

```
┌─────────────────────────────────┐
│  [📖 Révision]    [12/47]      │ ← Header + counter
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────────────┐│
│  │                             ││
│  │  [Question text h3]         ││
│  │  "Qu'est-ce qu'un embedding ?"││
│  │                             ││
│  │  ─────────────────────────  ││
│  │                             ││
│  │  [Réponse (flip revealed)]  ││
│  │  "Représentation vectorielle"││
│  │  du sens d'un mot...        ││
│  │                             ││
│  └─────────────────────────────┘│
│                                 │
│  [À revoir] [Difficile] [Solide] [Maîtrisé]│
│   🔴       🟡       🟢       🟢  │
│                                 │
│  ─────●────●────●────○────○───  │ ← Progress 12/47
│                                 │
└─────────────────────────────────┘
```

**États :**
- **Default** : question visible, réponse cachée (tap for reveal)
- **Flipped** : réponse visible, rating buttons appear
- **Rating selected** : card flip animation 400ms, SMI ring update
- **Loading** : shimmer card, spinner
- **Empty** : "Aucune carte à réviser" + streak banner
- **Session complete** : transition vers ReviewResultScreen

### SCR-07 — ReviewResultScreen

```
┌─────────────────────────────────┐
│                                 │
│         ✓                       │ ← CheckCircle2 48px
│                                 │
│  "Session terminée !"           │ ← h2
│                                 │
│  ┌───────────────────────────┐  │
│  │ +12 cartes révisées       │  │
│  │ +3 maîtrisées             │  │
│  │ Série : 8 jours 🔥        │  │
│  │ Prochaine : demain 9h     │  │
│  └───────────────────────────┘  │
│                                 │
│  [📖 Réviser encore]            │ ← Secondary
│  [🏠 Accueil]                   │ ← Ghost
│                                 │
└─────────────────────────────────┘
```

### SCR-08 — StudentAIScreen

```
┌─────────────────────────────────┐
│ [←]  Student AI    [⚙]         │ ← Header
├─────────────────────────────────┤
│                                 │
│ [Concept: Attention Mechanisms]  │ ← Badge state-partial
│ [SMI: 55% · Partiel]            │
│                                 │
│ ─────────────────────────────── │
│                                 │
│  [💬 Chat messages]             │
│  ┌─────────────────────────────┐│
│  │ AI: "Explique-moi           ││ ← persona: classmate
│  │     les attention...        ││
│  └─────────────────────────────┘│
│  ┌─────────────────────────────┐│
│  │ Vous: "Les attention...    ││ ← user input
│  │     permettent de...       ││
│  └─────────────────────────────┘│
│                                 │
│ ─────────────────────────────── │
│                                 │
│ [🎤] [Votre explication...] [➤]│ ← Input bar 52px
│                                 │
└─────────────────────────────────┘
```

**États :**
- **Default** : chat scrolling, input actif
- **Analyzing** : spinner sur le dernier message AI, "Analyse en cours…"
- **Gap detected** : "⚠️ Lacune détectée — Imprent requis" + CTA
- **Mastered** : "✅ Concept maîtrisé !" + transition
- **Dunning-Kruger** : "Vous semblez confiant — voyons cela de plus près."
- **Offline** : "Mode hors ligne — analyses IA désactivées"
- **Loading** : shimmer messages, spinner input

### SCR-09 — CosmosScreen

```
┌─────────────────────────────────┐
│ [🌌 COSMOS]         [🔍] [⚙]   │ ← Header
├─────────────────────────────────┤
│                                 │
│  [Search bar]                   │ ← Input 52px
│  "Rechercher un concept..."     │
│                                 │
│  ── Graphe interactif ──        │
│  (React Flow canvas)            │
│                                 │
│  🟢 Embeddings      78%         │ ← Legend
│  🟡 Attention       55%         │
│  🔴 RAG             23%         │
│  ⚪ Fine-tuning     0%          │
│                                 │
│  [🔥 Forger un nouveau concept]  │ ← FAB
│                                 │
└─────────────────────────────────┘
```

**États :**
- **Default** : graphe centré sur le concept actif
- **Loading** : skeleton nodes, spinner
- **Empty** : "Aucun concept forgé" + CTA
- **Gap highlighted** : nœud gap pulse rouge, tooltip "Trou de connaissance"
- **Selected** : node enlarged, detail panel slide-up
- **Offline** : graphe statique (pas de requête IA)

### SCR-10 — CosmosNodeScreen

```
┌─────────────────────────────────┐
│ [←]  [Concept name h2]         │ ← Header
├─────────────────────────────────┤
│                                 │
│  [SMI Radar 5D]                 │ ← SVG inline 200×200
│  Rétention  │  Profondeur       │
│  Enseignem. │  Métacogn.        │
│  Cohérence  │                   │
│                                 │
│  ─── Cartes associées ───       │
│  [Card 1: B02 Definition]       │ ← Card row
│  [Card 2: B04 Short Answer]     │
│  [Card 3: B03 MCQ]              │
│                                 │
│  ─── IMPRINTs ───               │
│  [IMPRINT 1 · Cran 4 · IQS 72]  │ ← Card row
│  [IMPRINT 2 · Cran 2 · IQS 45]  │
│                                 │
│  [🔥 Forger] [🤖 Student AI]    │ ← Actions row
│                                 │
└─────────────────────────────────┘
```

### SCR-11 — DailyBriefingScreen

```
┌─────────────────────────────────┐
│                                 │
│  🔥 Bonjour, Mary               │ ← h1 personalized
│                                 │
│  ┌───────────────────────────┐  │
│  │ Aujourd'hui                │  │
│  │ 5 cartes à réviser         │  │
│  │ 1 concept en difficulté    │  │
│  │ 2 gaps dans votre arbre    │  │
│  │ Série : 7 jours 🔥         │  │
│  └───────────────────────────┘  │
│                                 │
│  [📖 Démarrer la révision]      │ ← Primary CTA
│  [🕐 Plus tard (1h)]            │ ← Secondary
│                                 │
└─────────────────────────────────┘
```

### SCR-12 — SettingsScreen

```
┌─────────────────────────────────┐
│ [←]  Paramètres                │ ← Header
├─────────────────────────────────┤
│                                 │
│ ─── Compte ───                  │
│ [👤 Profil]                     │ ← List row
│ [🔑 Abonnement: Pro]            │ ← Badge state-forged
│                                 │
│ ─── Préférences ───             │
│ [🔔 Notifications]              │ ← Toggle on/off
│ [🌐 Langue: Français]           │ ← Picker
│ [📱 Haptique]                   │ ← Toggle
│                                 │
│ ─── Données ───                 │
│ [📦 Exporter Knowledge Bundle]  │ ← Destructive? non, info
│ [🗑 Supprimer toutes les données]│ ← Destructive red
│                                 │
│ ─── À propos ───                │
│ [v2.0.1 · Forge]               │ ← body_sm text-muted
│                                 │
└─────────────────────────────────┘
```

### SCR-13 — ImportScreen (FEE)

```
┌─────────────────────────────────┐
│ [←]  Importer un fichier       │ ← Header
├─────────────────────────────────┤
│                                 │
│  [📄 Drop zone]                 │ ← Dashed border, 200px height
│  "Glissez un fichier ici"       │
│  ou toucher pour sélectionner   │
│                                 │
│  Formats supportés:             │
│  PDF · DOCX · TXT · MD          │ ← body_sm text-muted
│                                 │
│  ─── Niveau de confidentialité ──│
│  [○ Public  ● Personnel  ○ Entreprise]│
│                                 │
│  [🔥 Forger ce fichier]         │ ← Disabled if no file
│                                 │
└─────────────────────────────────┘
```

### SCR-14 — OnboardingScreen

```
┌─────────────────────────────────┐
│                                 │
│         🔥                      │ ← Logo 72px
│                                 │
│  "Forgez votre connaissance"    │ ← h1
│  "Transformez ce que vous        │
│   lisez en savoir durable."      │
│                                 │
│  [Commencer]                    │ ← Primary CTA
│  [J'ai déjà un compte]          │ ← Ghost
│                                 │
└─────────────────────────────────┘
```

**Étapes :**
1. Welcome (screen ci-dessus)
2. "Comment ça marche" — 3 slides explicatives
3. Permission requests (notifications, storage)
4. First source capture tutorial

### SCR-15 — FreeTrialScreen

```
┌─────────────────────────────────┐
│                                 │
│  🔥 7 jours gratuits            │ ← h2
│                                 │
│  Débloquez :                    │
│  ✓ Imprent illimités            │
│  ✓ Student AI illimité          │
│  ✓ COSMOS complet               │
│  ✓ PDF/DOCX import              │
│  ✓ Knowledge Bundle export      │
│                                 │
│  [Commencer l'essai]            │ ← Primary
│  [Peut-être plus tard]          │ ← Ghost
│                                 │
│  7 jours · Pas de carte bancaire│ ← body_sm text-muted
│                                 │
└─────────────────────────────────┘
```

---

## Affective Design — Sensations & Émotions

| Écran | Sensation cible | Émotion | Signal visuel | Signal haptique |
|---|---|---|---|---|
| **ForgeCommit** | Solennel, engageant | Détermination | Violet glow pulsing, flame icon scale | Light tap à 1s, double à 2s |
| **IMPRINT Editor** | Focus, flow | Concentration | Surface-2 dimmed, typewriter cursor, cran indicator discret | Pas de haptique |
| **PostForge Snapshot** | Accomplissement | Fierté | Flame ignition 1000ms, green flash, particles | Celebration burst (3×0.05s) |
| **Review Session** | Progression | Motivation | Streak counter, SMI ring filling, card flip | Subtle tick à chaque rating |
| **COSMOS Gap** | Urgence légère | Curiosité | Red pulse sur nœud gap, "Gap" badge amber | Double tap si leech |
| **Leech Detection** | Empathie | Réassurance | Amber warning, "Essayons autrement" | Double tap (0.02s, 0.1s gap) |
| **Student AI Gap** | Défi bienveillant | Motivation | Persona adaptatif, "Voyons cela ensemble" | Pas de haptique |
| **Daily Briefing** | Routine, anticipation | Optimisme | Streak flame, personalized greeting | Light tap sur CTA |
| **Import success** | Satisfaction | Confiance | Green check, "Source importée" | Light tap |
| **Error state** | Frustration | Aide | Red border, "Réessayer" discret | Heavy tap (0.05s) |

---

## State Patterns — Transitions

### Source status flow
```
pending → capturing → ready → error
                 ↓
              (duplicate) → imprinting → forged
```

### Review session flow
```
idle → reviewing → card-flip → rating → next-card → ... → session-complete
                                              ↓
                                         (leech detected) → skip
```

### IMPRINT flow
```
idle → commit-screen (3s) → imprint-editor → saving → snapshot (5s) → cosmos/home
                              ↓
                         (anti-hallucination) → warning-banner → edit/dismiss
                              ↓
                         (cran < 1) → blocked → hint "Écrivez plus..."
```

### Student AI flow
```
idle → confidence-calibration (1-5) → teach-back-session → 4-analyzer → result
                                                                        ↓
                                                   mastered → cosmos-update
                                                   partial → suggestion
                                                   gap → imprint-required
                                                   contradiction → imprint-redirect
```

---

## Key Flows — User Journeys

### FL-01 — Article Capture (Mary, ingénieure backend)
**PRD-REQ:** FR-CAP-001 → FR-CAP-005

```
1. Mary lit un article Medium sur les embeddings
2. Badge NainoForge apparaît (content script)
3. Mary clique "Forger" → SCR-02 SourceDetail s'ouvre
4. Preview du contenu, Mary clique "Forger cette source"
5. SCR-03 ForgeCommitScreen: 3s, "Vous allez forger ce concept"
6. Haptic light tap à 1s, double à 2s
7. SCR-04 ImprintEditorScreen s'ouvre
8. Mary écrit sa reformulation, Cran indicator visible (1→3)
9. Anti-hallucination: discrète, Mary accepte
10. Sauvegarde → SCR-05 PostForgeSnapshotScreen
11. Particles flame ignition 1000ms, haptic celebration
12. "Cran 3/5 · IQS 67 · 3 cartes · révision dans 4 jours"
13. Mary clique "Voir dans COSMOS" → SCR-09
```

### FL-02 — YouTube Auto-Capture
**PRD-REQ:** FR-CAP-006 → FR-CAP-010

```
1. Mary regarde une vidéo YouTube sur RAG
2. MutationObserver détecte ytInitialPlayerResponse
3. Badge "Forger cette vidéo" apparaît
4. Click → SCR-02 avec transcript structuré par chapitres
5. Même flow FL-01 à partir de l'étape 4
```

### FL-03 — Daily Review Session
**PRD-REQ:** FR-FSRS-001 → FR-FSRS-003

```
1. Notification push: "5 cartes à réviser · 1 Leech"
2. Mary ouvre l'app → SCR-11 Daily Briefing
3. Elle tape "Démarrer la révision"
4. SCR-06 ReviewScreen: carte B02 par carte
5. Tap pour révéler la réponse
6. Rating: "Solide" → card flip 400ms spring
7. Haptic subtle tick
8. SMI ring fills 600ms decel
9. Progress bar 12/47
10. Session terminée → SCR-07 ReviewResult
11. "+3 maîtrisées · Série: 8 jours 🔥"
```

### FL-04 — Student AI Teach-Back
**PRD-REQ:** FR-STUD-001 → FR-STUD-006

```
1. Mary est sur le nœud "Attention Mechanisms" (SMI 55%)
2. Elle tape le nœud → SCR-10 → "Student AI"
3. SCR-08 StudentAIScreen s'ouvre
4. "Sur 5, à quel point vous sentez-vous sûr de ce concept ?"
5. Mary répond 4/5 → confidence_declared = 4
6. Persona adaptatif : "Classmate" (SMI 40-70%)
7. Mary tape son explication ou utilise la voix
8. 4 analyseurs en cascade → analyse 2s
9. Résultat: Coverage 65%, Cran 2, misconception détectée
10. "⚠️ Lacune — confusion entre attention et self-attention"
11. Questions socratiques générées
12. Post-session: score_evaluated = 2, confidence_declared = 4
13. Alert Dunning-Kruger: "Vous semblez confiant — voyons cela de plus près"
14. Nœud COSMOS mis à jour
```

### FL-05 — PDF Import & Forge
**PRD-REQ:** FR-CAP-011 → FR-CAP-015

```
1. Mary glisse un PDF technique sur le panel → SCR-13
2. Format detection: PDF → pdf.js WASM extraction
3. privacy_level = 'personal' → embeddings local uniquement
4. SCR-02 SourceDetail avec contenu chunké
5. Même flow FL-01 à partir de l'étape 4
```

### FL-06 — COSMOS Exploration
**PRD-REQ:** FR-COS-001 → FR-COS-007

```
1. Mary navigue vers l'onglet COSMOS → SCR-09
2. Graphe centré sur son dernier concept forgé
3. Elle zoom/pan sur le graphe
4. Tap sur un nœud 🟡 → SCR-10 Node detail
5. Radar 5D SMI visible, cartes associées listées
6. Elle tape "Student AI" → FL-04
7. Elle tape "Forger" → nouvelle IMPRINT sur le même concept
8. Le nœud passe à 🟢 Forged si SMI ≥70%
```

---

## Micro-interactions — Spec complète

| Interaction | Trigger | Animation | Duration | Easing | Haptique |
|---|---|---|---|---|---|
| Forge button press | Tap | Scale 1→0.92→1 + shadow deepen | 150ms | `easing-accel` | Light tap 0.02s |
| Card flip (review) | Rating selected | rotateY 0→180° reveal back | 400ms | `easing-spring` | Subtle tick |
| SMI ring fill | After review | stroke-dashoffset animated | 600ms | `easing-decel` | — |
| Leech pulse | Card in Leech state | amber border pulse 2× then steady | 1200ms | `easing-standard` | Double tap |
| Tab switch | Tab tap | underline slide 200ms + fade content | 200ms | `easing-decel` | Light tap |
| Toast enter | Event fired | slide from bottom, opacity 0→1 | 200ms | `easing-decel` | — |
| Toast exit | Timeout/dismiss | opacity 1→0, scale 0.95 | 150ms | `easing-accel` | — |
| Progress fill | Capture in progress | width 0→target, color shift | 350ms | `easing-standard` | — |
| Swipe to dismiss | Swipe left | translateX -100%, fade 200ms | 200ms | `easing-accel` | — |
| Pull to refresh | Swipe down + release | spinner spin 400ms | 400ms | `easing-standard` | — |
| Bottom sheet open | Tap card | translateY 100%→0, scale 0.95→1 | 350ms | `easing-spring` | — |
| Streak counter | Review complete | number count-up 600ms | 600ms | `easing-decel` | Celebration burst |
| Flame ignition | IMPRINT validé | scale 0.8→1.15→0.95→1 + particles | 1000ms | `easing-bounce` | Celebration burst ×3 |
| Commit countdown | Forge commit screen | progress bar 0→100% | 3000ms | `easing_standard` | Tap à 1s, double à 2s |
| Student AI typing | AI response streaming | cursor blink 500ms | — | — | — |
| Card shimmer | Loading state | surface-2→surface-3 sweep | 1500ms | `easing_standard` infinite | — |

---

## Accessibility — Chrome extension Floor (Étendu)

### WCAG 2.1 AA Checklist

| Critère | Implémentation | Statut |
|---|---|---|
| Contrast ≥ 4.5:1 | Primary sur surface: 7.5:1 | ✅ |
| Focus visible | Ring 2px primary + 4px surface-base | ✅ |
| Touch target ≥ 44×44 | 48×48 minimum, inputs 52px height | ✅ |
| Dynamic type 200% | Font scaling, lineHeight 1.5 min | ✅ |
| Reduced motion | `prefers-reduced-motion` → 0.01ms | ✅ |
| VoiceOver / TalkBack | ARIA labels, roles, live regions | ✅ |
| Color not sole indicator | Icons + text + color combined | ✅ |

### ARIA Patterns par surface

| Surface | Roles | Live regions |
|---|---|---|
| Home | `main`, `list`/`listitem` (sources) | `aria-live="polite"` (toast) |
| Review | `main`, `radiogroup` (ratings) | `aria-live="assertive"` (score) |
| Student AI | `main`, `log` (chat), `textbox` (input) | `aria-live="polite"` (AI typing) |
| COSMOS | `main`, `img` (nodes), `button` (actions) | `aria-live="polite"` (node status) |
| Settings | `main`, `list`/`listitem` | — |

### Focus management Chrome extension
- `:focus-visible` pour keyboard navigation (pas de ring au touch)
- Escape → ferme dialog/sheet, retour arrière
- Tab order logique dans chaque surface
- Deep link support: `nainoforge://review` → ouvre directement ReviewScreen

### Voice input support
- `aria-label="Voice input"` sur bouton micro
- `@react-native-voice/voice` pour reconnaissance
- Feedback: "Écoute active" → spinner + haptic tick

---

## Concern Scan

| Concern | Spécification | Impact |
|---|---|---|
| **i18n** | FR en S1, EN en S2; tokens de traduction dans `i18n/` | Tous les textes durcis |
| **Dark/Light** | Dark mode only S1; light mode S2 (tokens inversés) | — |
| **Notifications** | Push notifs pour Daily Briefing (S2) | FR-BRIEF-001 |
| **Offline** | IndexedDB local, queue IA, sync auto à reconnexion | FR-GEN-001 |
| **Input modality** | Touch + voice + keyboard (external) | — |
| **Touch targets** | 48px min pour tous les boutons | — |
| **Privacy** | 3 niveaux (public/personnel/entreprise) | FR-PRIV-001 |
| **Safe area** | env(safe-area-inset-*) sur tous les écrans | — |
| **Haptics** | Pattern spécifique par action (si supporté) | — |
| **Dynamic type** | Scale font jusqu'à 200% | — |

---

## Nomenclature traçable

```
PRD-REQ-FR-CAP-001 → FL-01 (User Flow: Article Capture)
PRD-REQ-FR-CAP-006 → FL-02 (User Flow: YouTube Capture)
PRD-REQ-FR-CAP-011 → FL-05 (User Flow: PDF Import)
PRD-REQ-FR-FSRS-001 → FL-03 (User Flow: Daily Review)
PRD-REQ-FR-STUD-001 → FL-04 (User Flow: Student AI Teach-Back)
PRD-REQ-FR-COS-001 → FL-06 (User Flow: COSMOS Exploration)

PRD-REQ-FR-IMP-001 → SC-04 (Scenario: IMPRINT Writing)
PRD-REQ-FR-CARD-001 → SC-06 (Scenario: Review Card Flip)
PRD-REQ-FR-BRIEF-001 → SC-11 (Scenario: Daily Briefing)
PRD-REQ-FR-COMMIT-001 → SC-03 (Scenario: Forge Commitment)
PRD-REQ-FR-SNAP-001 → SC-05 (Scenario: Post-Forge Snapshot)

PRD-REQ-FR-CAP-001 → SCR-01 (Screen: HomeDashboard)
PRD-REQ-FR-CAP-002 → SCR-02 (Screen: SourceDetail)
PRD-REQ-FR-COMMIT-001 → SCR-03 (Screen: ForgeCommit)
PRD-REQ-FR-IMP-001 → SCR-04 (Screen: ImprintEditor)
PRD-REQ-FR-SNAP-001 → SCR-05 (Screen: PostForgeSnapshot)
PRD-REQ-FR-FSRS-001 → SCR-06 (Screen: ReviewCard)
PRD-REQ-FR-FSRS-003 → SCR-07 (Screen: ReviewResult)
PRD-REQ-FR-STUD-001 → SCR-08 (Screen: StudentAI)
PRD-REQ-FR-COS-001 → SCR-09 (Screen: CosmosGraph)
PRD-REQ-FR-COS-002 → SCR-10 (Screen: CosmosNode)
PRD-REQ-FR-BRIEF-001 → SCR-11 (Screen: DailyBriefing)
PRD-REQ-FR-GEN-001 → SCR-12 (Screen: Settings)
PRD-REQ-FR-CAP-011 → SCR-13 (Screen: ImportFile)
PRD-REQ-FR-GEN-002 → SCR-14 (Screen: Onboarding)
PRD-REQ-FR-PRIV-001 → SCR-15 (Screen: FreeTrial)
```
