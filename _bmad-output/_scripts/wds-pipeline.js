const fs = require('fs');
const path = require('path');

const project_root = 'C:/Users/joyda/ZCodeProject/NainoForge';
const output_folder = project_root + '/_bmad-output';

// Ensure directories
['A-Product-Brief', 'B-Trigger-Map/personas', 'C-UX-Scenarios', 'D-Design-System/components', '_progress', 'design-artifacts'].forEach(function(dir) {
  fs.mkdirSync(path.join(output_folder, dir), { recursive: true });
});

console.log('WDS Pipeline for NainoForge starting...');

// ============ PHASE 1: Product Brief ============
var productBrief = '# NainoForge — Product Brief\n\n' +
  '> **Version:** 1.0 | **Crée:** 2026-08-03 | **Source:** PRD v0.1.0 + DESIGN.md Neuro-Technical\n\n' +
  '---\n\n' +
  '## 1. Projet\n\n' +
  '- **Type:** Extension Chrome (MV3) — pas une application mobile\n' +
  '- **Contexte:** Three rendering contexts — Popup · Side Panel · App Mode\n' +
  '- **Public cible:** Professionnels, ingenieurs, chercheurs, autodidactes techniques\n' +
  '- **Langue:** Anglais (prioritaire), Francais (S2)\n\n' +
  '## 2. Probleme\n\n' +
  'Les professionnels passent des heures à **consommer** du contenu (articles, vidéos, PDFs). La plupart n\'est jamais transforme en connaissance durable.\n\n' +
  '## 3. Vision\n\n' +
  '**NainoForge transforme la consommation passive en forge active.**\n\n' +
  'Pipeline: Capture → Forge (IMPRINT) → Review (FSRS) → Master (COSMOS)\n\n' +
  '## 4. Positionnement\n\n' +
  '| Avant | Avec NainoForge |\n' +
  '|---|---|\n' +
  '| Consommer sans transformer | Écrire → mesurer → réviser optimisé |\n' +
  '| Notes non évaluees | IQS + Cran IMPRINT mesurés automatiquement |\n' +
  '| Anki/SM-2 standard | FSRS (état de l\'art) |\n' +
  '| Pas de vue sur lacunes | COSMOS (arbre sémantique + Gap Detection) |\n\n' +
  '## 5. Modeles Économiques\n\n' +
  '| Tier | Prix/mois | Cible |\n' +
  '|---|---|---|\n' +
  '| Starter | $10 | Étudiants |\n' +
  '| Pro | $20 | Professionnels |\n' +
  '| Power | $49 | Recherecheurs |\n\n' +
  '## 6. Success Criteria\n\n' +
  '| Métrique | Cible J+180 |\n' +
  '|---|---|\n' +
  '| Installs CWS | 2,000,000 |\n' +
  '| Conversion install→paid | 10% |\n' +
  '| Revenue mensuel | $200,000 |\n' +
  '| Retention J+30 | ≥35% |\n' +
  '| NPS | ≥60 |\n' +
  '| SMI moyen | ≥68% |\n\n' +
  '## 7. Contraintes\n\n' +
  '### Techniques\n' +
  '- Chrome Extension MV3 | IndexedDB source de vérité | FSRS WASM | Offline-first\n\n' +
  '### Design\n' +
  '- Dark mode only | Neuro-Technical aesthetic | Monochromatic palette (white accent)\n' +
  '- 3 contextes: Popup (400×600), Side Panel (320-560px), App Mode (≥800px)\n' +
  '- Inter font, aucune couleur hardcodée en JSX\n\n' +
  '### Compliance\n' +
  '- RGPD, CCPA/CPRA | 3 niveaux confidentialité | Clés API dans Chrome Secret Storage\n\n' +
  '## 8. Technologies\n\n' +
  '| Couche | Choix |\n' +
  '|---|---|\n' +
  '| Framework | React 19 + Vite 8 |\n' +
  '| CSS | Tailwind CSS v4 + @theme |\n' +
  '| Composants | shadcn/ui + CVA |\n' +
  '| Animations | tw-animate-css |\n' +
  '| Ikonnes | Lucide React |\n' +
  '| Éditeur | BlockNote (IMPRINT) |\n' +
  '| Chat | assistant-ui (Student AI) |\n' +
  '| Graphe | React Flow (COSMOS) |\n' +
  '| FSRS | wasm-pack (Rust) |\n' +
  '| State | Zustand |\n';

fs.writeFileSync(path.join(output_folder, 'A-Product-Brief', 'product-brief.md'), productBrief);
console.log('✅ A-Product-Brief/project-brief.md');

// ============ PHASE 2: Trigger Map ============
var triggerMap = '# NainoForge — Trigger Map\n\n> **Genere depuis PRD** — 2026-08-03\n\n' +
  '## Business Goals\n\n' +
  '### Primary (P0)\n1. Atteindre 2M installs CWS dans 6 mois\n2. Conversion 10% install→paid ($200k MRR)\n3. DAU/Install ratio ≥35% à J+180\n\n' +
  '### Secondary (P1)\n1. SMI moyen ≥68% sur concepts forgés\n2. NPS ≥60\n3. Cards reviewed/user/jour ≥15\n\n' +
  '### Tertiary (P2)\n1. 50% activation (1er IMPRINT dans 7j)\n2. Temps-to-forge <60s\n3. Support multi-langue EN/FR\n\n' +
  '## Personas\n\n' +
  '### Primary: Mary — Technical Professional\n' +
  '**Role:** Ingenieure backend, 30 ans, US/Canada\n' +
  '**Wants:** Maitriser rapidement, base durable, gagner du temps\n' +
  '**Fears:** Oublier en 2 semaines, consommer sans transformer, lacunes non detectées\n\n' +
  '### Secondary: Alex — Self-Taught Developer\n' +
  '**Role:** Autodidacte, 25 ans\n' +
  '**Wants:** Structurer l\'apprentissage, verifier comprehension, identifier lacunes\n' +
  '**Fears:** Surtaper sans comprendre, Dunning-Kruger, abandonner\n\n' +
  '### Tertiary: Dr. Chen — Researcher\n' +
  '**Role:** Chercheur en IA, 40 ans\n' +
  '**Wants:** Synthetiser la litterature, connector concepts, partager avec precision\n' +
  '**Fears:** Perdre des insights, contradictions entre sources, dependre du cloud\n\n' +
  '## Feature Impact\n\n' +
  '| Feature | Mary | Alex | Chen | Goal |\n' +
  '|---|---|---|---|---|\n' +
  '| Web capture | High | High | Low | P0-1 |\n' +
  '| YouTube capture | High | High | Low | P0-1 |\n' +
  '| PDF import | Medium | Low | High | P0-1 |\n' +
  '| IMPRINT + Cran | High | High | High | P1-1 |\n' +
  '| FSRS | High | High | Medium | P1-2 |\n' +
  '| Student AI | Medium | High | Medium | P1-1 |\n' +
  '| COSMOS | Medium | Medium | High | P1-1 |\n' +
  '| Daily Briefing | High | Medium | Low | P0-3 |\n' +
  '| Knowledge Bundle | Low | Low | High | P0-2 |\n\n' +
  '## Golden Circle\n\n' +
  '**WHY:** Transform passive consumption into active, durable knowledge.\n' +
  '**HOW:** Measured reformulation (IMPRINT), cognitive feedback (Cran/IQS), optimized review (FSRS + COSMOS).\n' +
  '**WHAT:** Chrome extension with capture, editor, FSRS review, Student AI, semantic graph.';

fs.writeFileSync(path.join(output_folder, 'B-Trigger-Map', 'trigger-map.md'), triggerMap);

// Personas
fs.writeFileSync(path.join(output_folder, 'B-Trigger-Map', 'personas', '02-Mary-TechnicalProfessional.md'),
  '# Persona: Mary\n\n**Role:** Ingenieure backend, 30 ans, US/Canada\n\n' +
  '**Wants:** Maitriser rapidement, base durable, gagner du temps\n' +
  '**Fears:** Oublier, consommer sans transformer, lacunes non detectées\n' +
  '**Quote:** "Je lis beaucoup mais je retiens peu."\n' +
  '**JTBD:** Forge immediately, get exactly what to review, find gaps early\n');

fs.writeFileSync(path.join(output_folder, 'B-Trigger-Map', 'personas', '03-Alex-SelfTaughtDeveloper.md'),
  '# Persona: Alex\n\n**Role:** Autodidacte, 25 ans, Canada\n\n' +
  '**Wants:** Structurer l\'apprentissage, verifier comprehension, identifier lacunes\n' +
  '**Fears:** Surtaper sans comprendre, Dunning-Kruger, abandonner\n' +
  '**Quote:** "J\'ai l\'impression de savoir plein de choses mais je bloque à l\'explication."\n');

fs.writeFileSync(path.join(output_folder, 'B-Trigger-Map', 'personas', '04-DrChen-Researcher.md'),
  '# Persona: Dr. Chen\n\n**Role:** Chercheur en IA, 40 ans, US\n\n' +
  '**Wants:** Synthetiser la litterature, connector concepts, partager avec precision\n' +
  '**Fears:** Perdre des insights, contradictions, dependre du cloud\n' +
  '**Quote:** "J\'ai des milliers de PDFs sauvés mais je ne les consulte jamais."\n');

console.log('✅ B-Trigger-Map/ (trigger-map + 3 personas)');

// ============ PHASE 3: UX Scenarios ============
var scenarios = '# NainoForge — UX Scenarios\n\n> **Genere depuis PRD + Trigger Map** — 2026-08-03\n\n' +
  '## Scenario Index\n\n' +
  '| # | Scenario | Persona | Pages |\n' +
  '|---|----------|---------|-------|\n' +
  '| 01 | Article Capture | Mary | SCR-01→02→03→04→05 |\n' +
  '| 02 | YouTube Capture | Mary | SCR-01→02→03→04→05 |\n' +
  '| 03 | Daily Review | Mary | SCR-11→06→07 |\n' +
  '| 04 | Student AI | Alex | SCR-10→08 |\n' +
  '| 05 | PDF Import | Chen | SCR-13→02→03→04→05 |\n' +
  '| 06 | COSMOS Exploration | Chen | SCR-09→10 |\n\n';

// Detailed scenarios
var s1 = '## FL-01: Article Capture (Mary)\n\n' +
  '**Goal:** Forger un article Medium sur les embeddings | **Outcome:** IMPRINT valide + 3 flashcards\n\n' +
  '1. Badge NainoForge apparaît (≥3/5 signaux detection)\n' +
  '2. Click → SCR-02 SourceDetail\n' +
  '3. Click "Forge" → SCR-03 ForgeCommit (3s, flame pulse)\n' +
  '4. SCR-04 ImprintEditor (two-panel, Cran indicator)\n' +
  '5. Save → SCR-05 PostForgeSnapshot (flame ignition 1000ms)\n' +
  '6. Click "View in COSMOS" → SCR-09\n\n' +
  '**Metrics:** Time-to-forge <60s, capture→IMPRINT ≥70%\n';

var s2 = '## FL-02: YouTube Auto-Capture (Mary)\n\n' +
  '**Goal:** Capturer automatiquement une conférence YouTube sur RAG\n\n' +
  '1. MutationObserver détecte ytInitialPlayerResponse\n' +
  '2. Badge "Forge cette vidéo" apparaît\n' +
  '3. Click → SCR-02 avec transcript structuré par chapitres\n' +
  '4. Même flow FL-01 à partir de l’étape 5\n\n' +
  '**Edge Cases:** No subtitles → 3 options. Multi-language → priority order.';

var s3 = '## FL-03: Daily Review Session (Mary)\n\n' +
  '**Goal:** Réviser 5 cartes du jour\n\n' +
  '1. Notification push: "5 cartes · 1 Leech"\n' +
  '2. Ouvre extension → SCR-11 DailyBriefing\n' +
  '3. Tap "Démarrer la révision" → SCR-06 ReviewScreen\n' +
  '4. Card: tap to reveal → rating "Solide" → card flip 400ms spring\n' +
  '5. Haptic tick, SMI ring fills 600ms\n' +
  '6. Session terminée → SCR-07 ReviewResult\n\n' +
  '**Session Types:** Micro (5min/5cards), Standard (15min/15cards), Deep (30min/all)';

var s4 = '## FL-04: Student AI Teach-Back (Alex)\n\n' +
  '**Goal:** Comprendre Attention Mechanisms via teach-back\n\n' +
  '1. Tap nœud "Attention Mechanisms" (SMI 55%, Partiel)\n' +
  '2. "Student AI" → SCR-08\n' +
  '3. Confidence calibration: 4/5\n' +
  '4. Persona: "Classmate" (SMI 40-70%)\n' +
  '5. Alex tape/parle son explication\n' +
  '6. 4 analyseurs → Coverage 65%, Cran 2, misconception détectée\n' +
  '7. "⚠️ Lacune — confusion attention vs self-attention"\n' +
  '8. Dunning-Kruger alert → nœud COSMOS mis à jour\n\n' +
  '### Personas by SMI\n| SMI | Persona | Tone |\n|---|---|---|\n| <40% | Curious beginner | "I don\'t understand..."\n| 40-70% | Classmate | "Wait, does X imply Y?"\n| 70-85% | Skeptic | "When doesn\'t this apply?"\n| ≥86% | Challenger | "You\'re simplifying. What nuance?"';

var s5 = '## FL-05: PDF Import & Forge (Dr. Chen)\n\n' +
  '**Goal:** Importer un PDF technique et le forger\n\n' +
  '1. Drag & drop PDF → SCR-13 ImportScreen\n' +
  '2. Format detection + pdf.js WASM\n' +
  '3. privacy_level = "personal" → local embeddings only\n' +
  '4. SCR-02 SourceDetail avec contenu chunké\n' +
  '5. Même flow FL-01 à partir de l’étape 5\n\n' +
  '**Privacy:** Personal/Enterprise ne quitte jamais la machine. Bundle chiffré AES-256.';

var s6 = '## FL-06: COSMOS Exploration (Dr. Chen)\n\n' +
  '**Goal:** Explorer le graphe sémantique, identifier les gaps\n\n' +
  '1. Onglet COSMOS → SCR-09 CosmosScreen\n' +
  '2. Graphe centré sur dernier concept forgé\n' +
  '3. Zoom/pan interactif\n' +
  '4. Tap nœud → SCR-10 Node detail (SMI radar 5D)\n' +
  '5. Actions: "Student AI" → FL-04, "Forger" → FL-01\n' +
  '6. Nœud passe à Forged si SMI ≥70%\n\n' +
  '### Node States\n| State | Visual | SMI |\n|---|---|---|\n| Forged | vert plein | ≥70%|\n| Partial | jaune semi-rempli | 40-70%|\n| Gap | rouge vide | 0 IMPRINT|\n| Not visited | contour | Source only|';

scenarios += s1 + '\n---\n\n' + s2 + '\n---\n\n' + s3 + '\n---\n\n' + s4 + '\n---\n\n' + s5 + '\n---\n\n' + s6;
fs.writeFileSync(path.join(output_folder, 'C-UX-Scenarios', '00-ux-scenarios.md'), scenarios);

var scenarioDirs = [
  ['01-ArticleCapture', '## Scenario 01: Article Capture\n\n**Persona:** Mary | **Goal:** Forger un article Medium\n\n1. Badge apparaît (≥3/5 signaux)\n2. Click → SCR-02 SourceDetail\n3. Click "Forge" → SCR-03 ForgeCommit (3s)\n4. SCR-04 ImprintEditor (two-panel, Cran)\n5. Save → SCR-05 PostForgeSnapshot (flame ignition)\n6. Click "View in COSMOS" → SCR-09\n\n**Screens:** SCR-01→02→03→04→05→09'],
  ['02-YouTubeCapture', '## Scenario 02: YouTube Auto-Capture\n\n**Persona:** Mary | **Goal:** Capturer une conférence YouTube\n\n1. MutationObserver détecte ytInitialPlayerResponse\n2. Badge "Forge cette vidéo" apparaît\n3. Click → SCR-02 avec transcript structuré\n4. Même flow FL-01 à partir de l’étape 5\n\n**Edge Cases:** No subtitles → 3 options. Multi-language → priority order.'],
  ['03-DailyReview', '## Scenario 03: Daily Review Session\n\n**Persona:** Mary | **Goal:** Réviser 5 cartes du jour\n\n1. Notification push: "5 cartes · 1 Leech"\n2. SCR-11 DailyBriefing\n3. Tap "Démarrer la révision" → SCR-06 ReviewScreen\n4. Card flip 400ms spring, rating, SMI ring fill\n5. SCR-07 ReviewResult: "+3 maîtrisées · Série: 8 jours"\n\n**Session Types:** Micro (5min), Standard (15min), Deep (30min)'],
  ['04-StudentAITeachBack', '## Scenario 04: Student AI Teach-Back\n\n**Persona:** Alex | **Goal:** Comprendre Attention Mechanisms\n\n1. Tap nœud (SMI 55%, Partiel)\n2. "Student AI" → SCR-08\n3. Confidence calibration: 4/5\n4. Persona: "Classmate"\n5. 4 analyseurs → Coverage 65%, Cran 2, misconception\n6. "⚠️ Lacune" → questions socratiques\n7. Dunning-Kruger alert → COSMOS mis à jour'],
  ['05-PDFImport', '## Scenario 05: PDF Import & Forge\n\n**Persona:** Dr. Chen | **Goal:** Importer un PDF technique\n\n1. Drag & drop PDF → SCR-13 ImportScreen\n2. pdf.js WASM extraction\n3. privacy_level = "personal" → local only\n4. SCR-02 SourceDetail avec contenu chunké\n5. Même flow FL-01 à partir de l’étape 5\n\n**Privacy:** Contenu ne quitte jamais la machine. Bundle AES-256.'],
  ['06-COSMOSExploration', '## Scenario 06: COSMOS Exploration\n\n**Persona:** Dr. Chen | **Goal:** Explorer le graphe sémantique\n\n1. Onglet COSMOS → SCR-09 CosmosScreen\n2. Graphe centré sur dernier concept forgé\n3. Zoom/pan interactif\n4. Tap nœud → SCR-10 Node detail (SMI radar 5D)\n5. Actions: "Student AI" → FL-04, "Forger" → FL-01\n6. Nœud passe à Forged si SMI ≥70%'],
];

scenarioDirs.forEach(function(file) {
  fs.mkdirSync(path.join(output_folder, 'C-UX-Scenarios', file[0]), { recursive: true });
  fs.writeFileSync(path.join(output_folder, 'C-UX-Scenarios', file[0], '01-' + file[0] + '.md'), file[1]);
});
console.log('✅ C-UX-Scenarios/ (6 scenarios)');

// ============ PHASE 4: Design Delivery ============
var designDelivery = '# NainoForge — Design Delivery Summary\n\n> **Genere depuis DESIGN.md** — 2026-08-03\n\n' +
  '## Design System Source\n\n| Fichier | Rôle |\n|---|---|\n| DESIGN.md | Tokens, components, motion |\n| globals.css | CSS custom properties |\n| tailwind.config.ts | Tailwind token mapping |\n\n' +
  '## Screen Specifications (15 screens)\n\n| ID | Screen | Contextes | États | PRD refs |\n|---|---|---|---|---|\n| SCR-01 | HomeScreen | All | 6 | FR-CAP, FR-BRIEF |\n| SCR-02 | SourceDetail | All | 5 | FR-CAP, FR-DEDUP |\n| SCR-03 | ForgeCommit | All | 1 | FR-COMMIT |\n| SCR-04 | ImprintEditor | All | 6 | FR-IMP, FR-IQS |\n| SCR-05 | PostForgeSnapshot | All | 2 | FR-SNAP |\n| SCR-06 | ReviewScreen | All | 6 | FR-FSRS |\n| SCR-07 | ReviewResult | All | 2 | FR-FSRS |\n| SCR-08 | StudentAIScreen | All | 7 | FR-STUD |\n| SCR-09 | CosmosScreen | All | 6 | FR-COS |\n| SCR-10 | CosmosNode | All | 4 | FR-COS, FR-BLOOM |\n| SCR-11 | DailyBriefing | Popup+Panel | 2 | FR-BRIEF |\n| SCR-12 | Settings | All | 3 | FR-GEN |\n| SCR-13 | ImportScreen | All | 5 | FR-CAP, FR-PRIV |\n| SCR-14 | Onboarding | All | 4 | FR-GEN |\n| SCR-15 | FreeTrial | All | 2 | FR-PRIV |\n\n' +
  '## Adaptive Layout\n\n| Rule | Popup | Side Panel | App Mode |\n|---|---|---|---|\n| Header | 48px | 64px | 64px |\n| Max title | headline-2 (24px) | headline-1 if >450px | display (42px) |\n| Sidebar | Tab bar | Icon rail ~56px | 240px |\n| Content width | 100%-32px | 100%-gutters | 720px |\n| Margin metadata | Never | <800px: none | ≥1100px: 120px |';

fs.writeFileSync(path.join(output_folder, 'design-artifacts', 'design-delivery-summary.md'), designDelivery);
console.log('✅ design-artifacts/design-delivery-summary.md');

// ============ PHASE 7: Design System ============
var tokens = '# NainoForge — Design Tokens\n\n> **Source:** DESIGN.md Neuro-Technical | **Mode:** shadcn/ui | **2026-08-03\n\n' +
  '## Colors (MD3 Monochromatic)\n\n' +
  '| Token | Value | Usage |\n|---|---|---|\n| --nf-bg | #141313 | Canvas |\n| --nf-on-bg | #e5e2e1 | Text on bg |\n| --nf-surface-low | #1c1b1b | Level 1 (nav) |\n| --nf-surface | #201f1f | Level 2 (modals) |\n| --nf-surface-high | #2a2a2a | Level 2b |\n| --nf-surface-highest | #353434 | Level 3 (floating) |\n| --nf-on-surface | #e5e2e1 | Body text |\n| --nf-on-surface-variant | #c4c7c8 | Secondary text |\n| --nf-primary | #ffffff | Buttons, icons, focus |\n| --nf-on-primary | #2f3131 | Text on primary |\n| --nf-primary-container | #e2e2e2 | Container |\n| --nf-secondary-container | #484646 | Chips, tags |\n| --nf-on-secondary-container | #b8b4b4 | Text on container |\n| --nf-error-container | #93000a | Error bg |\n| --nf-on-error | #690005 | Text on error |\n\n' +
  '## Typography\n\n| Token | Size | Weight | Line-height | Usage |\n|---|---|---|---|---|\n| display | 42px | 400 | 1.15 | Hero (App only) |\n| h1 | 32px | 400 | 1.20 | Page titles |\n| h2 | 24px | 400 | 1.25 | Section titles |\n| h3 | 18px | 500 | 1.35 | Card titles |\n| body-lg | 16px | 300 | 1.65 | Body text |\n| body | 14px | 300 | 1.60 | Body small |\n| caption | 12px | 500 | 1.50 | Uppercase labels |\n| code | 13px | 400 | 1.70 | Technical labels |\n\n' +
  '## Spacing\n\n| Token | Value |\n|---|---|\n| xxs | 4px |\n| xs | 8px |\n| sm | 12px |\n| md | 16px |\n| lg | 24px |\n| xl | 32px |\n| 2xl | 48px |\n| 3xl | 64px |\n\n' +
  '## Radius\n\n| Token | Value |\n|---|---|\n| sm | 2px |\n| md | 6px |\n| lg | 8px |\n| xl | 12px |\n| full | 9999px |\n\n' +
  '## Motion\n\n| Token | Value |\n|---|---|\n| snap | 80ms |\n| fast | 120ms |\n| normal | 200ms |\n| slow | 350ms |\n| long | 600ms |\n\n' +
  '## Component Tokens\n\n### Button\n| Variant | Bg | Text |\n|---|---|---|\n| primary | --nf-primary | --nf-on-primary |\n| secondary | --nf-secondary-container | --nf-on-secondary-container |\n| ghost | transparent | --nf-on-surface |\n| destructive | --nf-error-container | --nf-on-error |\n\n### Card\n| State | Bg | Border |\n|---|---|---|\n| default | --nf-surface-low | --nf-outline-variant |\n| hover | --nf-surface | --nf-outline |\n| elevated | --nf-surface-high | --nf-outline |';

fs.writeFileSync(path.join(output_folder, 'D-Design-System', 'design-tokens.md'), tokens);

var comps = {
  Button: '# Button [COMP-001]\n\n**Type:** Atom | **Library:** shadcn Button\n\n## Variants: primary, secondary, ghost, destructive\n## States: default, hover, active, disabled, loading\n## Focus Ring: `0 0 0 2px var(--nf-bg), 0 0 0 4px var(--nf-primary)`',
  Card: '# Card [COMP-002]\n\n**Type:** Molecule | **Library:** shadcn Card\n\n## States: default (surface-low), hover (tonal lift), elevated (glassmorphism)',
  Badge: '# Badge [COMP-003]\n\n**Type:** Atom | **Library:** shadcn Badge\n\n## Variants: forge, privacy-public, count, status-dot',
  ConfidenceMarker: '# ConfidenceMarker [COMP-004]\n\n**Type:** Atom | **Library:** Custom\n\n## Props: cran (1-5), size (sm/md/lg 32/40/48px)\n## Colors: 1=inverse-primary, 2=outline, 3=secondary, 4=on-surface, 5=primary+flame',
  Toast: '# Toast [COMP-005]\n\n**Type:** Molecule | **Library:** Custom\n\n## Variants: success, error, info, warning\n## Duration: 4000ms auto-dismiss\n## Max stacked: 3',
  Spinner: '# Spinner [COMP-006]\n\n**Type:** Atom | **Library:** Custom\n\n## Sizes: sm (16px), md (20px), lg (24px)\n## Reduced motion: instant opacity pulse, no rotation',
};

Object.keys(comps).forEach(function(name) {
  fs.writeFileSync(path.join(output_folder, 'D-Design-System', 'components', name + '.md'), comps[name]);
});
console.log('✅ D-Design-System/ (tokens + 6 components)');

// ============ DESIGN LOG ============
var designLog = '# Design Log — NainoForge\n\n> **Project:** NainoForge Chrome Extension | **Mode:** Neuro-Technical (MD3)\n> **Last Updated:** 2026-08-03\n\n' +
  '---\n\n## Backlog\n- [ ] Phase 4: Generate HTML mockups for key screens\n- [ ] Phase 6: Asset generation (icons, illustrations)\n- [ ] Phase 8: Product evolution loop setup\n\n## Current\n- [x] Phase 1: Product Brief generated\n- [x] Phase 2: Trigger Map with 3 personas\n- [x] Phase 3: 6 UX Scenarios documented\n- [x] Phase 4: Design delivery summary created\n- [x] Phase 7: Design tokens + 6 components extracted\n\n## Design Loop Status\n\n| Scenario | Page | Status | Updated |\n|----------|------|--------|---------|\n' +
  ['SCR-01','SCR-02','SCR-03','SCR-04','SCR-05','SCR-06','SCR-07','SCR-08','SCR-09','SCR-10','SCR-11','SCR-12','SCR-13','SCR-14','SCR-15'].map(function(s) { return '| 0' + (parseInt(s.slice(-1)) <= 6 ? '1' : parseInt(s.slice(-1)) <= 8 ? '4' : parseInt(s.slice(-1)) <= 10 ? '6' : '3') + ' | ' + s + ' | spec-complete | 2026-08-03 |'; }).join('\n') + '\n\n## Log\n### 2026-08-03\n' +
  '- Generated Product Brief from PRD + DESIGN.md\n' +
  '- Created Trigger Map with 3 personas (Mary, Alex, Dr. Chen)\n' +
  '- Documented 6 UX scenarios with error paths\n' +
  '- Generated Design Delivery Summary (15 screen specs)\n' +
  '- Extracted 6 components to Design System\n' +
  '- Updated DESIGN.md to Neuro-Technical (monochromatic MD3)\n' +
  '- Updated globals.css + tailwind.config.ts\n' +
  '- Removed redundant files';

fs.writeFileSync(path.join(output_folder, '_progress', '00-design-log.md'), designLog);
console.log('✅ _progress/00-design-log.md');

console.log('\n=== WDS PIPELINE COMPLETE ===');
console.log('A-Product-Brief/project-brief.md');
console.log('B-Trigger-Map/trigger-map.md + 3 personas');
console.log('C-UX-Scenarios/00-ux-scenarios.md + 6 dirs');
console.log('D-Design-System/design-tokens.md + 6 components');
console.log('design-artifacts/design-delivery-summary.md');
console.log('_progress/00-design-log.md');
