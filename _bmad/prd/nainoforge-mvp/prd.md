# NainoForge — PRD
## Chrome Extension de "Knowledge Forging" par Répétition Espacée

**Version** : 0.1.0-draft
**Propriétaire** : joyda
**Statut** : final
**Créé** : 2026-07-10
**Mis à jour** : 2026-07-10

---

## 1 · Problème

Les professionnels et autodidactes passent des heures à **lire, regarder, ingérer** du contenu. Mais la plupart de ce qu'ils consomment n'est jamais transformé en connaissance durable :

- Un article lu → oublié en 24 h sans action de reformulation.
- Une vidéo YouTube → vue une fois, le contenu s'évapore.
- Un PDF technique → sauvegardé dans un dossier, jamais relu, jamais intégré.

Les outils actuels (Pocket, Notion, Anki, Obsidian) couvrent un pan seulement : capture, organisation, ou répétition espacée. Aucun ne **forge** la connaissance — c'est-à-dire ne mesure la profondeur de la reformulation de l'utilisateur, ne détecte les lacunes cognitives, et ne maximise pas la rétention à long terme.

**NainoForge transforme la consommation passive en forge active.**

---

## 2 · Opportunité

L'IA rend possible, côté client, ce qui nécessitait un serveur il y a 18 mois :

- Extraction automatique de contenu (Readability, ytInitialPlayerResponse, pdf.js WASM).
- Analyse cognitive de l'écriture de l'utilisateur (Crans, IQS, Bloom tagging, 4 analyseurs Student AI).
- Planification de révision optimale (FSRS, démontré scientifiquement supérieur à SM-2/Anki).

Le timing est favorable : le marché des extensions Chrome productivité est mature, mais aucun concurrent sérieux ne combine les trois piliers — **ingestion universelle + forge mesurée + répétition espacée optimale**.

---

## 3 · Valeur

| Avant NainoForge | Avec NainoForge |
|---|---|
| Consommer sans transformer | Écrire → mesurer → réviser optimisé |
| Notes non évaluées | IQS + Crans IMPRINT mesurés automatiquement |
| Flashcards génériques | Cartes typées B01–B05 adaptées au concept |
| Anki/SM-2 standard | FSRS (état de l'art, +~3 pts de rétention) |
| Pas de vue sur ses lacunes | COSMOS (arbre sémantique + Gap Detection) |
| Révision binaire (connais / connais pas) | 4-états : Maîtrisé, Partiel, Lacune, IMPRINT requis |

---

## 4 · Marché cible

- **Professionnels** qui doivent maîtriser du contenu technique (devs, ingénieurs, chercheurs, consultants).
- **Autodidactes** qui apprennent en ligne (cours, docs, vidéos YouTube, livres PDF).
- **Langue** : anglais prioritaire (États-Unis, Canada, Royaume-Uni). Interface entièrement en anglais.
- **Conformité** : RGPD pour les utilisateurs EU ; CCPA/CPRA pour les utilisateurs Californie. La distinction 3 niveaux (public/personnel/entreprise) couvre les deux frameworks.
- **Hors scope MVP** : marché francophone, support mobile, intégrations tierces (Notion, Obsidian) — V1+.

---

## 5 · Parcours utilisateur (UJ-N)

### UJ-1 — Capture Article (Mary, ingénieure backend, 30 ans)

Mary est sur Medium et lit un article sur les embeddings vectoriels.

1. Le badge NainoForge apparaît sur la page : "Forge this article".
2. Elle clique → capture instantanée via Readability, contenu nettoyé et chunké.
3. L'extension propose : "IMPRINT or Skip ?"
4. Elle choisit IMPRINT. L'écran **Forge Commitment** s'affiche 3 secondes (non-skippable) : *"Tu vas forger ce concept. Pas le sauvegarder. Le forger."*
5. L'éditeur IMPRINT s'ouvre. À sa droite, le condensé Pareto du LLM. À sa gauche, le texte brut chunké.
6. Elle écrit sa reformulation. Le système affiche discrètement son Cran (1-5) en temps réel — elle voit que sa note approche Cran 3 (Connexion).
7. Elle valide. **Post-Forge Snapshot** s'affiche 5 secondes : "Cran atteint : 3/5 · IQS : 67/100 · Cartes générées : 3 · Prochaine révision : dans 4 jours."
8. Trois flashcards B02, B04, B04 sont créées. Le nœud COSMOS "Embeddings" passe de ⚪ (Non visité) à 🟡 (Partiel).

### UJ-2 — Capture YouTube (Mary)

Mary regarde une conférence vidéo sur RAG.

1. L'auto-capture détecte `ytInitialPlayerResponse`, affiche le badge "Forge this video".
2. Elle clique. Le transcript est extrait via API timedtext, structuré par chapitres.
3. Même flux que l'article → IMPRINT → Cran → Flashcards.

### UJ-3 — Révision Quotidienne (Mary)

Le matin, une push notification : "5 cards to review today · 1 Leech detected."

1. Mary ouvre l'extension. **Daily Forge Briefing** s'affiche : 3 à réviser, 1 Leech (card Embeddings B02).
2. Elle lance la session Micro (5 min, 5 cartes).
3. FSRS WASM calcule les intervalles localement. Aucun appel serveur.
4. Elle répond à une carte B03 (MCQ) → rating "Good" → prochaine révision en 4 jours.
5. Session terminée. Le Leech reste suspendu avec un signal dans la prochaine briefing.

### UJ-4 — Student AI — Teach-Back (Mary)

Mary est sur le nœud "Attention Mechanisms" (SMI = 55%, Partiel).

1. Elle clique "Student AI" dans COSMOS.
2. Avant la session, la **Confidence Calibration** : "Sur 5, comment tu te sens sur ce concept ?" → elle répond 4/5.
3. L'interface affiche le concept. Mary explique librement (texte ou voix).
4. Les 4 analyseurs en cascade retournent : Coverage 65% · Depth = Cran 2 · Misconception détectée (confusion entre "attention" et "self-attention").
5. État affiché : **⚠️ Lacune**. Questions socratiques générées.
6. Après la session : score évalué = 2/5, confidence déclarée = 4/5 → **alerte Dunning-Kruger discrète** : "Tu sembles confiant sur ce sujet — voyons ça de plus près."
7. Le nœud COSMOS se met à jour.

### UJ-5 — Fichier local PDF (Mary)

Mary glisse un PDF technique sur le panel.

1. **Forge Extract Engine** (Offscreen Document) parse le PDF via pdf.js WASM.
2. DCM créé. `privacy_level = 'personal'` → embeddings locaux uniquement, jamais le cloud.
3. Le résumé IA est **désactivé** pour les fichiers personnels (MVP). Mary écrit son IMPRINT directement depuis le texte chunké.
4. Export possible via Knowledge Bundle chiffré.

---

## 6 · Exigences Fonctionnelles (FR)

Format : `FR-{module}-{NNN}` — identifiants stables, pas de traceabilité matrix.

### FR-GEN · Généralités

- **FR-GEN-001** : Toute l'application fonctionne **hors ligne** sauf les appels IA (condensé Pareto, analyse Student AI).
- **FR-GEN-002** : La source de vérité locale est **IndexedDB**. Toute donnée persistée en IndexedDB peut être exportée en Knowledge Bundle auto-suffisant (pas de dépendance serveur).
- **FR-GEN-003** : Aucun module n'appelle directement un autre module. Toute communication passe par l'**EventBus** (pub/sub).
- **FR-GEN-004** : Deux sources distinctes (URL différente, fichier différent) produisent deux DCM distincts. Le même contenu extrait ne crée pas de doublon (voir FR-DEDUP).

### FR-CAP · Capture Agent — Ingestion

#### Web Article

- **FR-CAP-001** : Le Content Script détecte automatiquement si la page est un article lisible via 5 signaux (`<article>`, Schema.org, `og:type=article`, >5 paragraphes, >500 chars). **Seuil : ≥3 signaux / 5**.
- **FR-CAP-002** : Si détecté, un badge cliquable "Forge this article" apparaît dans le DOM de la page.
- **FR-CAP-003** : Trois modes de capture :
  - **Mode A** — Page entière via `@mozilla/readability` (charsThreshold: 500). Extraction : title, byline, content_html, content_markdown, excerpt, site_name, published_time, og_image.
  - **Mode B** — Sélection utilisateur (`window.getSelection()`) + contexte (titre page + URL + date).
  - **Mode C** — URL saisie dans le panel. Le Service Worker ouvre un onglet silencieux, injecte le content script, extrait, ferme l'onglet.
- **FR-CAP-004** : Le HTML extrait est sanitizé via `dompurify` (allowed tags: p, h1-h6, ul, ol, li, blockquote, code, pre, strong, em, a, img). Converti en Markdown via `turndown`.
- **FR-CAP-005** : L'`extraction_confidence` (0–1) est calculée : 0.9 si `content.length > 1000`, sinon 0.6. Affiché dans le DCM uniquement.

#### YouTube

- **FR-CAP-006** : Un `MutationObserver` dans le Content Script détecte les changements de vidéo sur YouTube (SPA navigation). Attend que `ytInitialPlayerResponse` soit chargé avant extraction.
- **FR-CAP-007** : Extraction via `ytInitialPlayerResponse` : video_id, title, description, channel, duration, publish_date, chapters, captionTracks.
- **FR-CAP-008** : Sélection de la piste de sous-titres par ordre de priorité : `fr manual > fr auto > en manual > en auto > autre langue`.
- **FR-CAP-009** : Fetch du transcript via `https://www.youtube.com/api/timedtext?v={id}&lang={lang}&fmt=json3`. Parsing des événements JSON3 → segments `{start_ms, end_ms, text}`. Groupement par phrases, puis par chapitres.
- **FR-CAP-010** : Si aucune piste de sous-titres disponible, affichage de 3 options : (1) résumer la description, (2) coller transcript manuellement, (3) ignorer.

#### Fichier local (Forge Extract Engine)

- **FR-CAP-011** : L'utilisateur peut importer via drag-and-drop ou sélecteur de fichiers natif dans le Side Panel.
- **FR-CAP-012** : Format Detection : extension + magic bytes (4 premiers octets) + MIME type. Formats supportés MVP : PDF, DOCX, TXT, Markdown.
- **FR-CAP-013** : Extraction dans un **Offscreen Document** MV3 (WASM interdit dans le Service Worker) :
  - PDF : `pdfjs-dist` (lazy load, ~300KB)
  - DOCX : `mammoth` (lazy load, ~180KB)
  - TXT / MD : `TextDecoder` natif
- **FR-CAP-014** : `privacy_level = 'personal'` **toujours** pour les fichiers locaux. Les embeddings restent en local. Jamais envoyés au backend.
- **FR-CAP-015** : EPUB supporté en **V1 post-MVP** uniquement.

### FR-DEDUP · Déduplication

- **FR-DEDUP-001** : Avant ingestion, le système calcule un `content_hash = SHA-256(content_markdown)`.
- **FR-DEDUP-002** : Lookup dans `nf_dedup_cache` (IndexedDB). Si hit → signal discret à l'utilisateur : *"You already forged this content on [date]. Review or re-forge?"*
- **FR-DEDUP-003** : L'utilisateur peut choisir : (a) ouvrir l'IMPRINT existant, (b) créer un nouvel IMPRINT sur le même contenu.

### FR-DCM · Document Canonical Model

- **FR-DCM-001** : Interface unique exposée par le Forge Extract Engine vers tous les modules en aval. Le format d'origine (PDF, DOCX, etc.) est **inconnu des modules en aval**.
- **FR-DCM-002** : Le DCM contient : `id`, `title`, `source_type`, `privacy_level`, `language`, `word_count`, `chunks[]`, `key_concepts[]`, `pareto_summary`, `extracted_at`, `checksum`.
- **FR-DCM-003** : Chaque chunk contient : `index`, `content`, `token_count`, `section_title`, `start_char`, `end_char`, `embedding?`.

### FR-IMP · IMPRINT — Writing Engine

- **FR-IMP-001** : L'utilisateur écrit une reformulation du contenu source dans l'éditeur IMPRINT.
- **FR-IMP-002** : L'éditeur IMPRINT affiche le condensé Pareto du LLM à droite, le contenu chunké à gauche.
- **FR-IMP-003** : Un signal visuel discret indique le **Cran atteint** (1-5) en temps réel :
  - Cran 1 : Reformulation simple détectée.
  - Cran 2 : ≥80 mots + connecteurs logiques présents.
  - Cran 3 : ≥60% des concepts-clés couverts.
  - Cran 4 : Analogies ou exemples personnels présents.
  - Cran 5 : Style "enseignement à autrui" (implicite) ;
  - _(Les règles de détection sont heuristiques et légères — pas de LLM requis.)_
- **FR-IMP-004** : L'IMPRINT ne peut pas être validée sans Cran ≥1 (minimum : 20 mots).
- **FR-IMP-005** : Anti-Hallucination Validator (légère, non-bloquante) : si l'IMPRINT contient un fait absent/contradictoire avec la source, affichage discret : *"⚠️ This point seems to differ from your source. Verify?"* L'utilisateur peut ignorer ou corriger.

### FR-IQS · IMPRINT Quality Score

- **FR-IQS-001** : Après chaque IMPRINT, calcul silencieux du IQS sur 100 :
  ```
  IQS = (concept_coverage × 0.35) + (reformulation_score × 0.25) + (depth_signal × 0.25) + (length_adequacy × 0.15)
  ```
  - `concept_coverage` = % des concepts-clés de la source présents dans l'IMPRINT (exact match + fuzzy).
  - `reformulation_score` = 1 - cosine_similarity(imprint, source_summary). Plus l'IMPRINT est éloignée du résumé source, mieux c'est.
  - `depth_signal = cran_atteint / 5`.
  - `length_adequacy` = ratio mots_imprint / mots_source, borné [0, 1].
- **FR-IQS-002** : IQS n'est **pas affiché** à l'utilisateur en session. Visible dans COSMOS uniquement.
- **FR-IQS-003** : Si IQS < 30 sur **3 IMPRINT consécutifs** du même concept → Student AI auto-déclenché avec le message : *"Tu as noté ce concept 3 fois. Parlons-en différemment."*

### FR-BLOOM · Bloom Level Auto-Tagging

- **FR-BLOOM-001** : Chaque IMPRINT est taguée automatiquement avec un niveau Bloom (Remember / Understand / Apply / Analyze / Synthesize / Evaluate) basé sur des signaux textuels (définitions, reformulations, exemples, comparaisons, jugements).
- **FR-BLOOM-002** : Le tag alimente le coloriage des nœuds dans COSMOS.

### FR-CARD · Flashcards — 5 Types

- **FR-CARD-001** : Chaque IMPRINT valide génère minimum 1 B02 (Définition) + 1 B04 (Short Answer).
- **FR-CARD-002** : B03 (MCQ) et B05 (Application) générés si Cran IMPRINT ≥ 3.
- **FR-CARD-003** : B01 (Exposition) généré une seule fois par concept (1ère capture uniquement).
- **FR-CARD-004** : Les prompts de génération sont des templates LLM avec injection du DCM + de l'IMPRINT utilisateur. Une card = **un appel LLM** (MVP — optimisable par prompt batching en post-MVP).
- **FR-CARD-005** : Chaque card contient : `id`, `card_type`, `concept_id`, `front`, `back`, `initial_cran`, `fsrs_state`, `created_at`, `review_count`.

### FR-FSRS · Spaced Repetition — FSRS

- **FR-FSRS-001** : Le scheduler FSRS tourne **en WASM dans le navigateur** (compilé depuis Rust via wasm-pack). Aucun appel serveur.
- **FR-FSRS-002** : Planning local uniquement. L'utilisateur peut réviser 100% hors ligne (hors appel IA).
- **FR-FSRS-003** : Trois types de session (sélectionnés par l'utilisateur ou auto) :
  - **Micro** : 5 min, 5 cartes max — proposé par notification push.
  - **Standard** : 15 min, 15 cartes — ouverture normale.
  - **Deep** : 30 min, toutes les cartes en retard — choix explicite.

### FR-LEECH · Leech Detection

- **FR-LEECH-001** : Une card devient un **Leech** après **8 lapses** (rating "Again") sans consolidation par rating "Good" ou "Easy".
- **FR-LEECH-002** : Leech tagué `#leech`, suspendu du cycle normal.
- **FR-LEECH-003** : Signal dans la Daily Forge Briefing : *"This concept is resisting. Let's try something else."*
- **FR-LEECH-004** : Trois alternatives proposées automatiquement :
  1. Refaire un IMPRINT Cran ≥4 sur le concept.
  2. Passer une session Student AI sur ce concept uniquement.
  3. Revoir le contenu source original.
- **FR-LEECH-005** : Si, après re-IMPRINT, la card échoue à nouveau 5 fois → suggestion de changement de type de card (ex: B02 → B05).

### FR-REV · Immutable Review Event Sourcing

- **FR-REV-001** : Chaque review FSRS génère un événement immuable :
  ```
  nf_apex_review {
    id, card_id,
    rating ('again'|'hard'|'good'|'easy'),
    elapsed_seconds,
    fsrs_state_before (JSONB),
    fsrs_state_after (JSONB),
    reviewed_at
  }
  ```
- **FR-REV-002** : Aucun UPDATE, DELETE sur `nf_apex_reviews`. Contrainte DB (PostgreSQL) + garde applicative.

### FR-STUD · Student AI — Teach-Back Engine

- **FR-STUD-001** : 4 analyseurs en cascade (appel LLM unique avec structured output) :
  1. **Concept Coverage Tracker** — quels concepts-clés sont présents vs absents dans l'explication.
  2. **Coherence Detector** — contradictions internes, confusions entre deux concepts.
  3. **Depth Evaluator** — Cran atteint, présence d'exemples/analogies.
  4. **Misconception Detector** — croyances incorrectes, généralisations abusives.
- **FR-STUD-002** : Résultat affiché en 4 états : ✅ Maîtrised · 🔶 Partial · ⚠️ Gap · 🔁 IMPRINT requis.
- **FR-STUD-003** : Si `contradiction interne` détectée → état 🔁 IMPRINT requis → renvoi automatique vers l'IMPRINT du concept.
- **FR-STUD-004** : Confidence Calibration pré-session : *"On a scale of 1 to 5, how confident are you on this concept?"* `confidence_declared` enregistré.
- **FR-STUD-005** : Après analyse : `score_evaluated` (1-5). Si `confidence_declared ≥ 4` ET `score_evaluated ≤ 2` → alerte Dunning-Kruger discrète.
- **FR-STUD-006** : Persona adaptatif de Student AI selon SMI moyen du concept :

  | SMI équivalent | Persona |
  |---|---|---|
  | < 40% | Curious beginner — "I don't understand, explain from scratch" |
  | 40-70% | Classmate — "Wait, does X always imply Y?" |
  | 70-85% | Benevolent skeptic — "When doesn't this principle apply?" |
  | ≥ 86% | Challenger — "You're simplifying. What nuance are you missing?" |

  _(Le persona est injecté dans le prompt système LLM — aucune interface supplémentaire nécessaire.)_

### FR-COS · COSMOS — Semantic Knowledge Tree

- **FR-COS-001** : Arbre sémantique des concepts forgés par l'utilisateur. Chaque nœud = un concept.
- **FR-COS-002** : **SMI 5D** (Skill Mastery Index) — 5 dimensions agrégées par nœud :

  | Dimension | Poids | Source |
  |---|---|---|
  | Rétention | 35% | Score FSRS moyen sur les cards du concept |
  | Profondeur | 25% | Cran IMPRINT moyen |
  | Enseignement | 20% | Score Student AI |
  | Métacognition | 10% | Calibration confidence (déclaré vs évalué) |
  | Cohérence | 10% | Absence de contradictions dans IMPRINT |

- **FR-COS-003** : Un concept est considéré **"forgé"** si les 5 dimensions SMI dépassent 60%.
- **FR-COS-004** : Gap Detection — 4 états visuels par nœud :
  - 🟢 Forged : SMI ≥70% sur toutes dimensions, nœud plein.
  - 🟡 Partial : SMI 40-70%, nœud semi-rempli.
  - 🔴 Gap : concept dans l'arbre mais 0 IMPRINT, nœud vide + label "Gap".
  - ⚪ Not visited : source capturée mais pas forgée, nœud contour uniquement.
- **FR-COS-005** : Relations conceptuelles — 5 types auto-détectées via IA :
  - `prerequisite` (A est prérequis de B), `related`, `example_of`, `contradicts`, `part_of`.
- **FR-COS-006** : PIVOTIQ-Lite (V1 post-MVP) — quand 2+ sources existent sur le même concept, comparaison des embeddings. Détection contradicitons/perspectives différentes/redondances.
- **FR-COS-007** : SMI affiché comme radar 5D dans le panel COSMOS (SVG inline).

### FR-BRIEF · Daily Forge Briefing

- **FR-BRIEF-001** : À chaque ouverture de l'extension, un écran de 10 secondes affiche :
  - Nombre de concepts à réviser aujourd'hui.
  - Leechs détectés.
  - Gaps dans l'arbre COSMOS.
  - Streak jours consécutifs.
- **FR-BRIEF-002** : Deux CTA : "Démarrer la révision" · "Plus tard" (snooze 1h).

### FR-COMMIT · Forge Commitment Screen

- **FR-COMMIT-001** : Avant d'ouvrir IMPRINT, un écran de 3 secondes non-skippable affiche : *"You're about to forge this concept. Not save it. Not copy it. Forge it."*

### FR-SNAP · Post-Forge Snapshot

- **FR-SNAP-001** : Immédiatement après validation d'un IMPRINT, affichage 5 secondes :
  - Cran atteint, IQS, cartes générées, prochaine révision (date calquée sur FSRS).
  - CTA : "View in COSMOS".

### FR-CURVE · Forgetting Curve Preview

- **FR-CURVE-001** : Après chaque forge, courbe ASCII de rétention prédictive (stabilité FSRS initiale) affichée 2 secondes, puis se referme. Optionnel.

### FR-PRIV · Confidentialité — 3 Niveaux

- **FR-PRIV-001** : Toute source ingérée est classée dans un `privacy_level` :

  | Niveau | Types | IA autorisée | Embeddings |
  |---|---|---|---|
  | Public | Web article, YouTube, docs publiques | Oui (résumé LLM) | Cloud (Supabase pgvector) OK |
  | Personnel | PDF, DOCX, TXT, MD locaux | Non (MVP) | Local uniquement |
  | Entreprise | Documents internes confidentiels | Non, AES-256 | Bundle chiffré uniquement |

- **FR-PRIV-002** : `privacy_level` sélectionné par l'utilisateur avant import de fichier local. Par défaut = `personal`.
- **FR-PRIV-003** : Le contenu d'un document `personal` ou `enterprise` ne quitte jamais la machine. Affiché clairement dans l'UI au moment du choix de niveau.

### FR-BNDL · Knowledge Bundle

- **FR-BNDL-001** : Export en `.nfbundle` (ZIP chiffré optionnel AES-256) :
  ```
  nfbundle/
  ├── manifest.json
  ├── profile/user.json
  ├── sources/   (source_id.json)
  ├── imprints/  (note_id.json + cran + iqs + bloom)
  ├── cards/     (card_id.json + fsrs_state)
  ├── reviews/   (event log immuable, par mois)
  ├── student_ai/ (session_id.json)
  ├── cosmos/    (tree.json + communities.json)
  └── checksum.json
  ```
- **FR-BNDL-002** : Le bundle est **réimportable** et reconstruit l'état complet de l'extension sans dépendance serveur (hors embeddings cloud optionnels).
- **FR-BNDL-003** : Le dossier `embeddings/` est vide si l'utilisateur a choisi `no-cloud`. La recherche sémantique locale est désactivée mais tout le reste fonctionne.

### FR-NF · Règles Non-fonctionnelles

- **FR-NF-001** : Règle 8 — Un concept est forgé uniquement si SMI 5D ≥60% sur les 5 dimensions.
- **FR-NF-002** : Règle 9 — Une card Leech (≥8 lapses) ne peut être réactivée sans IMPRINT ou Student AI préalable.
- **FR-NF-003** : Règle 10 — Confidence déclarée obligatoire avant toute session Student AI si SMI < 70%.
- **FR-NF-004** : Règle 11 — Les reviews FSRS sont immuables. Aucune suppression ni modification autorisée.
- **FR-NF-005** : Règle 12 — Le Knowledge Bundle est autosuffisant. Aucune dépendance serveur requise pour la reconstruction.
- **FR-NF-006** : Règle 13 — IQS < 30 sur IMPRINT → génération limitée à B01 + B02 uniquement (pas de B03/B04/B05).
- **FR-NF-007** : Règle 14 — Documents privés ne quittent jamais la machine.
- **FR-NF-008** : Règle 15 — Forge Extract Engine est le **seul point d'entrée** pour fichiers locaux.
- **FR-NF-009** : Règle 16 — EventBus obligatoire. Aucun appel direct entre modules.
- **FR-NF-010** : Règle 17 — FSRS WASM uniquement. Aucun appel serveur pour la planification des révisions.
- **FR-NF-011** : Règle 18 — DCM est l'unique interface entre Forge Extract Engine et les modules en aval.

---

## 7 · Non-Functional Requirements (NFR)

### 7.1 Performance

| Métrique | Cible | Mesure |
|---|---|---|
| Bundle initial (Side Panel / Popup) | < 60 KB gzippé | Chrome DevTools Network |
| Web article capture | < 2 s | PerfomanceObserver |
| Création IMPRINT save | < 500 ms | User timing API |
| FSRS scheduling (1000 cards) | < 100 ms | WASM bench dans le SW |
| PDF extraction (50 pages) | < 10 s | PerfomanceObserver (Offscreen) |
| Time-to-forge (1er IMPRINT après install) | < 60 secondes | Analytics |

### 7.2 Stockage

- IndexedDB illimité en pratique (browser-dependant, mais ≥ 2 GB garanti sur tous les navigateurs modernes).
- Quota monitoring + alert si > 1 GB (suggérer export bundle + cleanup).

### 7.3 Offline

- Toutes les features fonctionnent hors ligne sauf :
  - AI Summarizer (appel LLM Claude)
  - Student AI analyse (appel LLM Claude)
  - Génération cards (appel LLM Claude)
  - Embeddings cloud (si activé)
- Files d'attente pour les appels IA : exécutés à la reconnexion automatiquement.

### 7.4 Sécurité

- XSS sanitization : `dompurify` systématique sur tout HTML provenant d'une source externe.
- Secrets : clés API Anthropic stockées dans **Chrome Secret Storage API** (`.secretStorage`), jamais en clair dans IndexedDB.
- AES-256 pour bundles `enterprise` : clé dérivée via PBKDF2 (mot de passe utilisateur, 100k iterations).
- Pas de PII scrubber MVP — les utilisateurs cibles sont des professionnels qui choisissent ce qu'ils forgent.

### 7.5 Chrome Web Store

- Permissions minimales : `activeTab`, `scripting`, `storage`, `sidePanel`, `alarms`, `offscreen`, `tabs` (URL mode).
- Content scripts déclarés uniquement pour les domaines d'ingestion (ou mode `run_at: document_idle`).
- Politique de confidentialité hébergée (page dédiée) — exigence CWS.

### 7.6 Évolutivité

- Architecture 4 agents + EventBus : chaque agent est testable et remplaçable indépendamment.
- Monorepo préparé pour absorption SCYForge (packages `ai/`, `fsrs/`, `cosmos/`, `vector/` réutilisables).

---

## 8 · Modèle Économique

### 8.1 Pricing

| Tier | Prix/mois | Cible | Accès |
|---|---|---|---|
| **Starter** | $10/mois | Étudiants, learners occasionnels | Web article, YouTube, IMPRINT basique, FSRS standard |
| **Pro** | $20/mois | Professionnels réguliers | + Forge Extract Engine (PDF/DOCX), Student AI, Leech detection, COSMOS avancé, Daily Briefing |
| **Power** | $49/mois | Autodidactes intensifs, chercheurs | + PIVOTIQ-lite, Embeddings cloud, Knowledge Bundle chiffré, Support prioritaire |

- **Paiement** : Stripe intégré dans l'extension (Stripe Elements dans le Side Panel). Aucun abonnement externe requis.
- **Essai** : 7 jours gratuits (pas de carte bancaire requise — période d'essai activée par un flag local, expiration après 7 jours).
- **Annual discount** : -20% (Stripe annual billing). $96, $192, $470/an.
- **Revenu cible** : $200 000/mois à 6 mois = ~5 000 Power users OU mix équilibré. Approx 2M users installés nécessaires si conversion moyenne 10% → $20 avg = $400k.

### 8.2 Coûts par utilisateur

| Coût | $10 user | $20 user | $49 user |
|---|---|---|---|
| Stripe fees (2.9% + $0.30) | $0.59 | $0.88 | $1.72 |
| LLM (Claude Sonnet, ~2k tokens/session) | ~$0.15 | ~$0.40 | ~$0.80 |
| Embeddings cloud (si activé) | — | ~$0.05 | ~$0.10 |
| **Total cost** | ~$0.74 | ~$1.33 | ~$2.62 |
| **Marge** | 93% | 93% | 95% |

À 200k$/mois avec 2M installs : conversion nécessaire ~5-10% selon mix.

---

## 9 · Architecture Technique — Vue d'Ensemble

### 9.1 Composants MV3

```
CONTENT SCRIPT
├── isArticlePage() detection + forge badge
├── YouTubeAutoCapture (MutationObserver + ytInitialPlayerResponse)
├── Readability extraction (Mode A/B/C)
└── OpenGraph / meta extraction

SERVICE WORKER (background.js)
├── EventBus (pub/sub, modules découplés)
├── Dédup cache lookup
├── Appels API LLM (Anthropic Claude)
├── Routage IndexedDB
├── Notifications push (Daily Briefing)
└── FSRS scheduling (via WASM)

OFFSCREEN DOCUMENT (offscreen.html)
├── pdf.js WASM (extraction PDF)
├── mammoth.js (extraction DOCX)
└── epub.js (V1 post-MVP)

SIDE PANEL (sidepanel.html)
├── Interface principale
├── Éditeur IMPRINT + Cran indicator + IQS (admin only? non — invisible)
├── Daily Forge Briefing
├── Forge Commitment Screen
├── Post-Forge Snapshot
├── COSMOS radar + Gap Detection
├── Student AI (Teach-Back session)
├── FEE import panel
└── Stripe payment (Pro/Power upgrade)

POPUP (popup.html)
└── Quick stats (cards due today, streak, Leech count)
```

### 9.2 4 Agents + EventBus

```
Capture Agent
│  Publie : SourceCaptured, DocumentParsed, YouTubeTranscriptReady
▼
Knowledge Agent
│  Publie : ImprintValidated, ConceptsExtracted, CardsGenerated, BloomTagged
▼
Student Agent
│  Publie : TeachBackCompleted, MisconceptionDetected, ImprintRequired, DunningKrugerAlert
▼
Review Agent
│  Publie : ReviewCompleted, LeechDetected, SMIUpdated, BundleExportReady
```

**Interface EventBus minimale** :
```typescript
type EventType = 
  | 'SourceCaptured' | 'DocumentParsed'
  | 'ImprintValidated' | 'ConceptsExtracted' | 'CardsGenerated'
  | 'TeachBackCompleted' | 'MisconceptionDetected'
  | 'ReviewCompleted' | 'LechDetected' | 'SMIUpdated';

interface Event {
  type: EventType;
  payload: Record<string, unknown>;
  ts: number;
}
```

### 9.3 FSRS WASM

- Crate Rust `fsrs` (v0.6+) compilée via `wasm-pack` → `fsrs_wasm.js` + `fsrs_wasm_bg.wasm`.
- Loadé dans le Service Worker MV3.
- Aucun fallback serveur. Si WASM échoue, bloquer + message d'erreur explicite.

### 9.4 Offline First

```
IndexedDB (source de vérité)
  ├── En ligne → sync queue → Supabase (embeddings public uniquement)
  └── Hors ligne → queue locale → retry auto à la reconnexion
```

### 9.5 Monorepo (packages)

```
packages/
├── shared/     Utilitaires, UUID v7, EventBus, validation, indexing
├── extract/    Forge Extract Engine (FEE) — parsers PDF/DOCX/MD/TXT
├── ai/         Summarizer, concept extractor, Student AI 4-analyseurs
├── imprint/    IMPRINT engine, IQS, Bloom tagger, Crans
├── fsrs/       FSRS WASM wrapper + card generator
├── cosmos/     Arbre sémantique, SMI 5D, gap detection, relations
├── bundle/     Export/import/compression/chiffrement
└── extension/  Chrome Extension MV3 — SW, CS, Side Panel, Popup, Offscreen
```

_(Pour MVP : `shared/`, `extract/`, `ai/`, `imprint/`, `fsrs/`, `extension/` suffisent. `cosmos/` et `bundle/` ajoutés en Semaine 2.)_

---

## 10 · Données — Tables IndexedDB / PostgreSQL

| Table | Scope | Notes |
|---|---|---|
| `nf_sources` | IDB | id, source_type, privacy_level, content_hash, dcm_id, title, content_markdown, captured_at, status |
| `nf_dedup_cache` | IDB | content_hash → source_id |
| `nf_imprint_notes` | IDB + PG | cran, iqs, bloom_level, concept_coverage_pct, contradiction_flagged |
| `nf_apex_cards` | IDB + PG | card_type (B01-B05), is_leech, lapse_count, fsrs_state, initial_cran |
| `nf_apex_reviews` | IDB + PG | immutable, rating, elapsed, fsrs_state_before/after, reviewed_at |
| `nf_student_ai_sessions` | IDB + PG | confidence_declared, score_evaluated, final_state, dunning_kruger_alert |
| `nf_concept_relations` | IDB + PG | source/target_concept, relation_type, weight |
| `nf_cosmos_nodes` | IDB + PG | concept_id, smi_5d (5 dimensions), gap_status, knowledge_density, bloom_tags |

---

## 11 · Métriques de Succès

| Métrique | Cible J+30 | Cible J+90 | Cible J+180 |
|---|---|---|---|
| Installs Chrome Web Store | 10,000 | 100,000 | 2,000,000 |
| Taux activation (1er IMPRINT dans 7j) | ≥40% | ≥45% | ≥50% |
| Daily Active Users (DAU) | 2,000 | 20,000 | 400,000 |
| Taux conversion (install → paid) | 8% | 10% | 10% |
| Revenue mensuel | $4,000 | $40,000 | $200,000 |
| Retention J+30 (DAU/Install) | ≥25% | ≥30% | ≥35% |
| NPS | ≥40 | ≥50 | ≥60 |
| Cards reviewed / user / jour | ≥5 | ≥10 | ≥15 |
| SMI moyen (concepts forgés) | ≥55% | ≥62% | ≥68% |

---

## 12 · Risques & Mitigations

| Risque | Impact | Mitigation |
|---|---|---|
| CWS rejette l'auto-capture YouTube | Élevé | Préparer un Mode C (URL saisie) comme fallback. Contacter CWS en amont. |
| Coût LLM non maîtrisé à grande échelle | Élevé | Cache les appels LLM par (concept_id + version_prompt). Compteur par utilisateur. Prompt batching. |
| FSRS WASM debugging difficile | Moyen | Tests Rust natifs en parallèle. Fallback SM-2 (JS pur) en cas d'échec build WASM. |
| Performance IndexedDB sur gros volumes | Moyen | Index systématiques sur `content_hash`, `concept_id`, `due_at`. Dexie.js pour abstraction. |
| Concurrence Anki + plugins Obsidian | Faible | Positionnement distinct : NainoForge = ingest + mesure cognitive, pas un simple SRS. |
| Équipe IA autonome → qualité variable | Moyen | Reviewer gate obligatoire sur chaque PR. Tests E2E ciblés. |

---

## 13 · Hors Scope MVP (V1 Post-MVP)

| Feature | Raison du report |
|---|---|
| EPUB support | Déjà au-delà du MVP (spec dit V1 post-MVP) |
| Recherche sémantique locale embeddings | Publique cloud embeddings d'abord; local à venir |
| PIVOTIQ-Lite contradictions multi-sources | Moyen effort, délègue à V1 |
| Relations conceptuelles COSMOS | Moyen effort, délègue à V1 |
| Résumé IA pour fichiers personnels | Nécessite modèle local (Llama WASM) — trop lourd MVP |
| Mobile / PWA | Chrome Extension desktop d'abord |
| GitHub README ingestion | Spécifique GitHub, marginal |
| Auth cloud multi-utilisateur | Supabase auth post-MVP |
| Intégrations tierces (Notion, Obsidian, Readwise) | Nice-to-have, canal distribution automatique |

---

*Document source : `nainoforge_ingestion_architecture.md` + `nainoforge_prd_enrichment_scyforge.md`*
*Dernière mise à jour : 2026-07-10*
