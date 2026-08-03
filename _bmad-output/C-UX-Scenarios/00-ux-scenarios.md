# NainoForge — UX Scenarios

> **Genere depuis PRD + Trigger Map** — 2026-08-03

## Scenario Index

| # | Scenario | Persona | Pages |
|---|----------|---------|-------|
| 01 | Article Capture | Mary | SCR-01→02→03→04→05 |
| 02 | YouTube Capture | Mary | SCR-01→02→03→04→05 |
| 03 | Daily Review | Mary | SCR-11→06→07 |
| 04 | Student AI | Alex | SCR-10→08 |
| 05 | PDF Import | Chen | SCR-13→02→03→04→05 |
| 06 | COSMOS Exploration | Chen | SCR-09→10 |

## FL-01: Article Capture (Mary)

**Goal:** Forger un article Medium sur les embeddings | **Outcome:** IMPRINT valide + 3 flashcards

1. Badge NainoForge apparaît (≥3/5 signaux detection)
2. Click → SCR-02 SourceDetail
3. Click "Forge" → SCR-03 ForgeCommit (3s, flame pulse)
4. SCR-04 ImprintEditor (two-panel, Cran indicator)
5. Save → SCR-05 PostForgeSnapshot (flame ignition 1000ms)
6. Click "View in COSMOS" → SCR-09

**Metrics:** Time-to-forge <60s, capture→IMPRINT ≥70%

---

## FL-02: YouTube Auto-Capture (Mary)

**Goal:** Capturer automatiquement une conférence YouTube sur RAG

1. MutationObserver détecte ytInitialPlayerResponse
2. Badge "Forge cette vidéo" apparaît
3. Click → SCR-02 avec transcript structuré par chapitres
4. Même flow FL-01 à partir de l’étape 5

**Edge Cases:** No subtitles → 3 options. Multi-language → priority order.
---

## FL-03: Daily Review Session (Mary)

**Goal:** Réviser 5 cartes du jour

1. Notification push: "5 cartes · 1 Leech"
2. Ouvre extension → SCR-11 DailyBriefing
3. Tap "Démarrer la révision" → SCR-06 ReviewScreen
4. Card: tap to reveal → rating "Solide" → card flip 400ms spring
5. Haptic tick, SMI ring fills 600ms
6. Session terminée → SCR-07 ReviewResult

**Session Types:** Micro (5min/5cards), Standard (15min/15cards), Deep (30min/all)
---

## FL-04: Student AI Teach-Back (Alex)

**Goal:** Comprendre Attention Mechanisms via teach-back

1. Tap nœud "Attention Mechanisms" (SMI 55%, Partiel)
2. "Student AI" → SCR-08
3. Confidence calibration: 4/5
4. Persona: "Classmate" (SMI 40-70%)
5. Alex tape/parle son explication
6. 4 analyseurs → Coverage 65%, Cran 2, misconception détectée
7. "⚠️ Lacune — confusion attention vs self-attention"
8. Dunning-Kruger alert → nœud COSMOS mis à jour

### Personas by SMI
| SMI | Persona | Tone |
|---|---|---|
| <40% | Curious beginner | "I don't understand..."
| 40-70% | Classmate | "Wait, does X imply Y?"
| 70-85% | Skeptic | "When doesn't this apply?"
| ≥86% | Challenger | "You're simplifying. What nuance?"
---

## FL-05: PDF Import & Forge (Dr. Chen)

**Goal:** Importer un PDF technique et le forger

1. Drag & drop PDF → SCR-13 ImportScreen
2. Format detection + pdf.js WASM
3. privacy_level = "personal" → local embeddings only
4. SCR-02 SourceDetail avec contenu chunké
5. Même flow FL-01 à partir de l’étape 5

**Privacy:** Personal/Enterprise ne quitte jamais la machine. Bundle chiffré AES-256.
---

## FL-06: COSMOS Exploration (Dr. Chen)

**Goal:** Explorer le graphe sémantique, identifier les gaps

1. Onglet COSMOS → SCR-09 CosmosScreen
2. Graphe centré sur dernier concept forgé
3. Zoom/pan interactif
4. Tap nœud → SCR-10 Node detail (SMI radar 5D)
5. Actions: "Student AI" → FL-04, "Forger" → FL-01
6. Nœud passe à Forged si SMI ≥70%

### Node States
| State | Visual | SMI |
|---|---|---|
| Forged | vert plein | ≥70%|
| Partial | jaune semi-rempli | 40-70%|
| Gap | rouge vide | 0 IMPRINT|
| Not visited | contour | Source only|