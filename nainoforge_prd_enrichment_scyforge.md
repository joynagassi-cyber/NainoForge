# NAINOFORGE — PRD Enrichissement Cognitif
## Micro-features inspirées de SCYForge, adaptées à l'échelle Chrome Extension
**Version** : 1.0 | **Statut** : Référence d'enrichissement du PRD principal  
**Principe** : Chaque feature ici ajoute de la rigueur cognitive sans ajouter de complexité technique majeure.

---

## POURQUOI CET ENRICHISSEMENT

Le PRD actuel de NainoForge pose les bons piliers (IMPRINT, FSRS, Student AI, COSMOS) mais les décrit à une granularité trop haute pour que l'objectif soit réellement atteint.

Le risque concret est le suivant : un utilisateur peut techniquement "compléter" un IMPRINT sans vraiment forger la connaissance, "valider" une carte FSRS sans comprendre, et voir une jauge COSMOS progresser sans que la maîtrise réelle soit vérifiée.

SCYForge résout ce problème avec une précision chirurgicale sur chaque étape. Ce document extrait les mécanismes les plus pertinents et les transpose à NainoForge.

---

## MODULE 1 — IMPRINT : ENRICHISSEMENTS

### 1.1 Système de Crans IMPRINT (5 niveaux)

**Problème actuel** : IMPRINT impose l'écriture mais ne mesure pas sa profondeur. Un utilisateur peut écrire deux phrases vides et "valider".

**Solution — 5 Crans de profondeur** :

| Cran | Nom | Critère de validation | Score qualité |
|------|-----|----------------------|---------------|
| 1 | Restitution | L'utilisateur a recopié en reformulant l'essentiel | 20/100 |
| 2 | Synthèse | L'utilisateur a extrait les idées clés avec ses propres mots | 40/100 |
| 3 | Connexion | L'utilisateur a relié le concept à une connaissance existante | 60/100 |
| 4 | Application | L'utilisateur a donné un exemple concret ou un cas d'usage | 80/100 |
| 5 | Teach-Back | L'utilisateur a expliqué comme s'il enseignait à quelqu'un | 100/100 |

Le système détecte automatiquement le Cran atteint via des règles légères :
- Présence de connecteurs logiques ("car", "donc", "par exemple", "contrairement à")
- Longueur adéquate (Cran 2 minimum = 80 mots)
- Couverture des concepts-clés extraits par l'IA (minimum 60% pour Cran 3+)
- Présence d'analogies ou d'exemples personnels (signaux Cran 4-5)

L'utilisateur ne voit pas les crans directement. Il voit uniquement un badge discret : "Forge légère", "Forge solide", "Forge profonde".

**Logique dans le FSRS** : Le Cran IMPRINT influe sur la stabilité initiale de la carte générée. Une carte née d'un Cran 5 démarre avec une stabilité 40% plus haute qu'une carte née d'un Cran 1.

---

### 1.2 IMPRINT Quality Score (IQS)

**Inspiré de** : Pedagogical Quality Score (PQS) de SCYForge.

Après la soumission de chaque IMPRINT, le système calcule silencieusement un score de qualité sur 100 :

```
IQS = (
  concept_coverage × 0.35   // % des concepts-clés de la source mentionnés
+ reformulation_score × 0.25 // Distance cosine entre note et source (+ = mieux reformulé)
+ depth_signal × 0.25        // Cran atteint / 5
+ length_adequacy × 0.15     // Note proportionnelle à la densité de la source
)
```

L'IQS n'est pas affiché à l'utilisateur pendant la session. Il apparaît uniquement dans COSMOS comme indicateur de santé d'un nœud de connaissance.

**Règle critique** : Si IQS < 30 sur 3 IMPRINT consécutifs du même concept → Student AI est automatiquement déclenché avec le message : *"Tu as noté ce concept 3 fois. Parlons-en différemment."*

---

### 1.3 Anti-Hallucination Validator

**Inspiré de** : Beth Trunk Validator de SCYForge.

Avant de valider un IMPRINT, le système vérifie une règle simple : la note de l'utilisateur ne doit pas contenir d'affirmation absente ou contradictoire par rapport à la source capturée.

Implémentation légère :
1. Extraction des claims factuels de la source (IA)
2. Comparaison avec les claims de la note IMPRINT
3. Si une contradiction détectée → affichage d'un signal discret : "⚠️ Ce point semble différer de ta source. Veux-tu vérifier ?"

Ce n'est pas un blocage. C'est une alerte légère. L'utilisateur peut ignorer ou corriger.

---

### 1.4 Bloom Level Auto-Tagging

Chaque IMPRINT est automatiquement étiqueté avec un niveau de taxonomie de Bloom :

| Bloom Level | Signal détecté dans la note |
|-------------|----------------------------|
| **Souvenir** | Définitions directes, listes de points |
| **Compréhension** | Reformulations, "c'est-à-dire" |
| **Application** | Exemples concrets, "par exemple" |
| **Analyse** | Comparaisons, "contrairement à", "la différence est" |
| **Synthèse** | Connexions inter-concepts, "cela rejoint" |
| **Évaluation** | Jugements, "je pense que", "la limite est" |

Ces tags alimentent COSMOS pour colorier les nœuds selon la profondeur de traitement atteinte.

---

## MODULE 2 — STUDENT AI : ENRICHISSEMENTS

### 2.1 Architecture Teach-Back 4 Composants

**Problème actuel** : Student AI produit un retour binaire (compris / à revoir). C'est trop simple pour détecter les vrais problèmes de compréhension.

**Solution — 4 analyseurs en cascade** (inspiré de l'architecture SCYForge §7.5.16) :

```
USER EXPLIQUE LIBREMENT
         ↓
┌─────────────────────────────────────────┐
│  1. CONCEPT COVERAGE TRACKER            │
│     Quels concepts-clés sont mentionnés │
│     vs. absents de l'explication ?      │
├─────────────────────────────────────────┤
│  2. COHERENCE DETECTOR                  │
│     Contradictions internes ?           │
│     Confusion entre deux concepts ?     │
├─────────────────────────────────────────┤
│  3. DEPTH EVALUATOR                     │
│     Superficiel vs profond ?            │
│     Présence d'exemples ? d'analogies ? │
├─────────────────────────────────────────┤
│  4. MISCONCEPTION DETECTOR              │
│     Croyances incorrectes détectées ?   │
│     Généralisations abusives ?          │
└─────────────────────────────────────────┘
         ↓
QUESTIONS SOCRATIQUES (jamais correctrices directement)
         ↓
RAPPORT + RECALIBRATION FSRS
```

Le résultat affiché à l'utilisateur reste simple (4 états) mais la détection derrière est précise :

| État affiché | Ce qui l'a déclenché |
|-------------|----------------------|
| ✅ Maîtrisé | Coverage > 80% + 0 contradiction + Depth ≥ Cran 3 |
| 🔶 Partiel | Coverage 50-80% ou Depth < Cran 3 |
| ⚠️ Lacune | Concept clé absent + Misconception détectée |
| 🔁 IMPRINT requis | Contradiction interne détectée → renvoi au mode IMPRINT |

---

### 2.2 Persona Adaptatif

**Inspiré du** : système de personas calibrés de Tactical AI dans SCYForge.

Le persona de Student AI s'adapte automatiquement au score FSRS moyen du concept :

| SMI équivalent FSRS | Persona Student AI |
|---------------------|--------------------|
| < 40% | Élève curieux et naïf — "Je comprends pas du tout, explique-moi depuis le début" |
| 40-70% | Camarade de cours — "Attends, tu veux dire que X implique forcément Y ?" |
| 70-85% | Sceptique bienveillant — "Et dans quel cas ce principe ne s'applique-t-il pas ?" |
| ≥ 86% | Challenger — "Tu simplifies. Quelle est la vraie nuance que tu n'as pas dite ?" |

Ce changement de persona ne nécessite aucune interface supplémentaire. Il s'effectue dans le prompt système injecté dans l'appel IA.

---

### 2.3 Confidence Calibration (Détection Dunning-Kruger)

Avant chaque session Student AI, l'utilisateur répond à une question unique :
*"Sur 5, comment tu te sens sur ce concept ?"*

Le système enregistre :
- `confidence_declared` (1-5, choisi par l'utilisateur)
- `score_evaluated` (1-5, calculé après l'explication par les 4 analyseurs)

Si `confidence_declared >= 4` et `score_evaluated <= 2` → alerte Dunning-Kruger discrète :
*"Tu sembles confiant sur ce sujet — voyons ça de plus près."*

Cette donnée alimente COSMOS pour montrer les zones où l'utilisateur surestime sa maîtrise.

---

## MODULE 3 — FLASHCARDS ET FSRS : ENRICHISSEMENTS

### 3.1 Types de Cartes B01-B05 (au lieu de cartes génériques)

**Problème actuel** : Les flashcards sont "générées depuis les notes". Sans typage précis, elles sont trop uniformes et ne couvrent pas les différentes dimensions de la connaissance.

**Solution — 5 types de cartes** (adaptés de SCYForge NEURON-CHAINS) :

| Type | Code | Description | Déclencheur |
|------|------|-------------|-------------|
| **Exposition** | B01 | Présentation du concept, contexte, à quoi ça sert | 1ère capture d'un concept |
| **Définition** | B02 | Question : "Définis X". Réponse : définition personnelle | Toujours généré |
| **MCQ** | B03 | QCM avec 4 choix, dont 3 distracteurs plausibles | Concepts avec distinctions importantes |
| **Short Answer** | B04 | Question courte, réponse attendue 1-3 phrases | Processus, étapes, mécanismes |
| **Application** | B05 | "Dans quel contexte utiliserais-tu X ?" | IMPRINT Cran 4+ |

Distribution automatique par IMPRINT : chaque forge génère minimum 1 B02 + 1 B04. Les B03 et B05 sont générés si le Cran IMPRINT ≥ 3. B01 est généré une seule fois par concept.

---

### 3.2 Leech Detection et Gestion

**Inspiré du** : leech detector de SCYForge (§13, APEX module).

Une carte devient un **Leech** si elle atteint 8 lapses (réponses "Again") sans consolidation.

Comportement déclenché :
1. Tag `#leech` ajouté à la carte
2. La carte est temporairement suspendue du cycle normal
3. L'utilisateur reçoit un signal dans sa Daily Review : *"Ce concept résiste. Essayons autrement."*
4. Trois alternatives proposées automatiquement :
   - Refaire un IMPRINT Cran 4+ sur ce concept
   - Passer une session Student AI sur ce concept uniquement
   - Voir le contenu source original

Si après le re-IMPRINT la carte réapparaît et échoue à nouveau 5 fois → le système suggère de changer le type de carte (B02 → B05 par exemple).

---

### 3.3 Session Types

**Inspiré des** : session types de SCYForge APEX.

Trois modes de révision, sélectionnés automatiquement selon le contexte :

| Type | Durée | Cartes | Déclencheur |
|------|-------|--------|-------------|
| **Micro** | 5 min | 5 cartes max | Notification push "5 cartes en retard" |
| **Standard** | 15 min | 15 cartes | Ouverture normale de l'extension |
| **Deep** | 30 min | Toutes les cartes en retard | Clic délibéré sur "Session complète" |

La session Micro est proposée en priorité dans les notifications pour maximiser la rétention quotidienne sans friction.

---

### 3.4 Forgetting Curve Preview

Après chaque forge, l'utilisateur voit brièvement une courbe de rétention prédictive basée sur la stabilité FSRS initiale :

```
Rétention prédite
100% ┤████████
 90% ┤         ████
 80% ┤              ████
 70% ┤                   ████
 60% ┤─────────────────────────────── ← seuil révision
     J+0  J+3  J+7  J+14  J+30
```

Ce visuel est optionnel (apparaît 2 secondes, puis se referme). Il ancre visuellement le concept du rappel espacé.

---

### 3.5 Event Sourcing des Reviews (Immuabilité)

Chaque review FSRS est immuable. Le système stocke :

```
review_event {
  card_id,
  rating,              // 'again' | 'hard' | 'good' | 'easy'
  elapsed_seconds,     // temps passé sur cette carte
  fsrs_state_before,   // état FSRS avant
  fsrs_state_after,    // état FSRS après (calculé)
  reviewed_at
}
```

Ces événements ne peuvent jamais être modifiés ou supprimés. Ils constituent le journal de la progression cognitive de l'utilisateur. Ils alimentent le Knowledge Bundle lors de l'export.

---

## MODULE 4 — COSMOS : ENRICHISSEMENTS

### 4.1 SMI 5-Dimensionnel (au lieu d'une jauge unique)

**Problème actuel** : COSMOS montre "une progression globale". Une seule dimension ne suffit pas à représenter la réalité de la maîtrise.

**Solution — Skill Mastery Index 5D** (adapté de SCYForge) :

| Dimension | Poids | Source de données |
|-----------|-------|------------------|
| **Rétention** | 35% | Score FSRS moyen sur les cartes du concept |
| **Profondeur** | 25% | Cran IMPRINT moyen atteint (1-5) |
| **Enseignement** | 20% | Score Student AI (Teach-Back) |
| **Métacognition** | 10% | Calibration confidence (déclaré vs évalué) |
| **Cohérence** | 10% | Absence de contradictions dans les IMPRINT |

Le SMI global s'affiche comme un radar dans COSMOS :

```
        Rétention
           ████
    ██████████████
Cohérence ████   Profondeur
    ██████████████
      ████████████
  Métacognition Enseignement
```

Un concept n'est considéré "forgé" que si **les 5 dimensions dépassent 60%**.

---

### 4.2 Gap Detection dans l'Arbre Sémantique

Pour chaque nœud de l'arbre COSMOS, le système maintient un indicateur de complétude :

| Signal | Condition | Affichage |
|--------|-----------|-----------|
| 🟢 Forgé | SMI ≥ 70% sur toutes dimensions | Nœud plein |
| 🟡 Partiel | SMI 40-70% | Nœud semi-rempli |
| 🔴 Gap | Concept présent dans l'arbre mais 0 IMPRINT | Nœud vide + signal "Gap" |
| ⚪ Non visité | Source capturée mais pas encore forgée | Nœud contour uniquement |

Les Gaps sont visibles dans un panel dédié : *"3 concepts capturés attendent d'être forgés."*

---

### 4.3 Relations Conceptuelles Auto-Détectées

Chaque nœud COSMOS peut avoir 5 types de relations avec d'autres nœuds :

| Relation | Exemple | Détection |
|----------|---------|-----------|
| `prerequisite` | "Les embeddings nécessitent de comprendre les vecteurs" | Extraite du résumé IA |
| `related` | "RAG est lié aux embeddings" | Cosine similarity > 0.75 |
| `example_of` | "ResNet est un exemple de CNN" | Détection de pattern IA |
| `contradicts` | "Dropout est parfois déconseillé en production" | PIVOTIQ-lite |
| `part_of` | "Backpropagation fait partie de l'entraînement" | Hiérarchie détectée |

Ces relations s'affichent en filtrant le graphe COSMOS. L'utilisateur peut voir : *"Voir les prérequis non maîtrisés"* → navigation vers les concepts bloquants.

---

### 4.4 PIVOTIQ-Lite : Détection de Contradictions Multi-Sources

**Inspiré du** : PIVOTIQ de SCYForge (§7.6.3).

Lorsque l'utilisateur capture 2+ sources sur le même concept :

1. Le système compare les condensés IA (cosine similarity des embeddings)
2. Si similarity > 0.75 (même sujet) mais divergence factuelle détectée :
   - **Contradiction majeure** → banner dans IMPRINT : *"⚠️ Ces 2 sources semblent contradictoires sur ce point. Laquelle est ta référence ?"*
   - **Perspective différente** → note dans le nœud COSMOS : *"2 angles sur ce concept"*
   - **Redondance** → suggestion de fusionner les deux sources

Cette feature coûte 0 appel IA supplémentaire si les embeddings sont déjà calculés.

---

### 4.5 Knowledge Density Score par Nœud

Chaque nœud COSMOS affiche un score de densité :

```
Concept : "Transformers"
───────────────────────
📄 Sources capturées : 3
✍️  IMPRINT réalisés : 2 (Cran moyen : 3.5)
🃏 Cartes générées : 8
✅ Cartes maîtrisées (FSRS ≥ Good) : 5
🎓 Sessions Student AI : 1
───────────────────────
Densité : 74/100 | SMI : 68%
```

Ce score aide l'utilisateur à identifier les concepts survolés vs les concepts réellement forgés.

---

## MODULE 5 — DONNÉES ET MODÈLE

### 5.1 Enrichissement du Modèle de Données

Tables supplémentaires ou champs additionnels par rapport au PRD initial :

**`nf_imprint_notes`** — champs ajoutés :
```
imprint_cran          INTEGER (1-5)
iquality_score        REAL (0-100)
bloom_level           TEXT ('remember'|'understand'|'apply'|'analyze'|'synthesize'|'evaluate')
concept_coverage_pct  REAL (0-100)
has_example           BOOLEAN
has_analogy           BOOLEAN
contradiction_flagged BOOLEAN
```

**`nf_apex_cards`** — champs ajoutés :
```
card_type             TEXT ('exposition'|'definition'|'mcq'|'short_answer'|'application')
is_leech              BOOLEAN DEFAULT false
lapse_count           INTEGER DEFAULT 0
is_suspended          BOOLEAN DEFAULT false
initial_cran          INTEGER -- Cran de l'IMPRINT source
```

**`nf_student_ai_sessions`** — table nouvelle :
```
id                    UUID
source_id             UUID
card_id               UUID (si lié à une carte spécifique)
confidence_declared   INTEGER (1-5)
concept_coverage_pct  REAL
coherence_score       REAL
depth_score           REAL
misconception_detected BOOLEAN
final_state           TEXT ('mastered'|'partial'|'gap'|'imprint_required')
score_evaluated       INTEGER (1-5)
dunning_kruger_alert  BOOLEAN
session_at            INTEGER
```

**`nf_concept_relations`** — table nouvelle :
```
id                    UUID
source_concept_id     UUID
target_concept_id     UUID
relation_type         TEXT ('prerequisite'|'related'|'example_of'|'contradicts'|'part_of')
weight                REAL DEFAULT 1.0
auto_generated        BOOLEAN DEFAULT true
```

**`nf_apex_reviews`** — Event Sourcing immuable :
```
id                    UUID
card_id               UUID
rating                TEXT ('again'|'hard'|'good'|'easy')
elapsed_seconds       INTEGER
fsrs_state_before     JSONB
fsrs_state_after      JSONB
reviewed_at           INTEGER
-- CONSTRAINT: immuable, aucun UPDATE ni DELETE autorisé
```

---

## MODULE 6 — KNOWLEDGE BUNDLE : ENRICHISSEMENTS

### 6.1 Structure Enrichie du Bundle

Le Knowledge Bundle `.nfbundle` exporte désormais également :

```
knowledge.nfbundle/
├── manifest.json
│     bundleVersion, schemaVersion, exportedAt, userId
│     extensionVersion, checksum, encrypted
├── profile/
│     user.json (préférences, stats globales)
├── sources/
│     [source_id].json (url, titre, transcript, condensé IA)
├── imprints/
│     [note_id].json (note, cran, IQS, bloom_level, timestamps)
├── cards/
│     [card_id].json (type, front, back, fsrs_state, lapse_count)
├── reviews/
│     [year-month].json (event log immuable par mois)
├── student_ai/
│     [session_id].json (scores, état final, dunning_kruger_alert)
├── cosmos/
│     tree.json (nœuds, relations, SMI par concept)
│     communities.json (clusters détectés)
├── embeddings/
│     (champs vides si l'utilisateur a choisi no-cloud)
│     ou référence aux vecteurs stockés en cloud
└── checksum.json
```

**Principe de portabilité** : les embeddings ne sont pas obligatoirement dans le bundle. Si l'utilisateur accepte le stockage cloud des vecteurs, ce dossier contient des références. Si non, il est vide — la recherche sémantique locale est désactivée mais tout le reste fonctionne.

---

## MODULE 7 — UX MICRO-FEATURES

### 7.1 Daily Forge Briefing

Au lancement quotidien de l'extension, un écran de 10 secondes affiche :

```
☀️ Bonjour

📚 3 concepts à réviser aujourd'hui
🔴 1 Leech détecté (Embeddings)
🟡 2 Gaps dans ton arbre
🔥 Streak : 7 jours

→ Démarrer la révision   → Plus tard
```

Ce briefing ancre la routine quotidienne sans être intrusif.

---

### 7.2 Forge Commitment (Friction d'engagement)

Avant d'ouvrir IMPRINT, l'utilisateur voit un écran de 3 secondes non-skippable :

```
Tu vas forger ce concept.

Pas le sauvegarder.
Pas le copier.
Le forger.

[ Commencer l'écriture ]
```

Cet écran est un rappel de la philosophie du produit. Il renforce l'intention délibérée.

---

### 7.3 Post-Forge Snapshot

Immédiatement après la validation d'un IMPRINT, l'utilisateur voit un snapshot de 5 secondes :

```
Concept forgé ✅

Cran atteint : 3/5
IQS : 67/100
Cartes générées : 3
Prochaine révision : dans 3 jours

[ Voir dans COSMOS ]
```

Ce feedback immédiat valide l'effort et ancre l'attente de la prochaine session.

---

### 7.4 Contradiction Banner dans IMPRINT

Lorsque PIVOTIQ-lite détecte une contradiction multi-sources, un banner non-bloquant s'affiche dans l'interface IMPRINT :

```
⚠️  Deux de tes sources semblent en désaccord sur ce point.
     Source A dit : "X"
     Source B dit : "Y"
     Laquelle est ta référence personnelle ?

[ Source A ] [ Source B ] [ Les deux ont raison selon le contexte ]
```

Le choix de l'utilisateur est enregistré dans le nœud COSMOS.

---

## MODULE 8 — FORGE EXTRACT ENGINE (INGESTION LOCALE PRIVÉE)

### 8.1 Principe de Confidentialité à 3 Niveaux

Toutes les sources ingérées ne sont pas équivalentes sur le plan de la confidentialité. Le PRD doit formaliser cette distinction :

| Niveau | Type de contenu | Traitement | Destination des embeddings |
|--------|----------------|------------|---------------------------|
| **Public** | Article web, YouTube, MDN, StackOverflow, documentation publique | Extraction locale → résumé IA → embedding cloud | Vector DB cloud autorisée |
| **Personnel** | PDF, DOCX, TXT, Markdown, notes perso, livres | Extraction locale → résumé IA local → embedding local | Bundle uniquement, jamais cloud |
| **Entreprise** | Documents internes, SOPs, rapports confidentiels | Extraction locale + chiffrement AES-256 | Bundle chiffré uniquement |

**Règle fondamentale** : le contenu d'un document privé ne quitte jamais la machine de l'utilisateur. Seuls les embeddings des sources publiques peuvent être envoyés en cloud, car le contenu est déjà public.

---

### 8.2 Forge Extract Engine — Architecture

Le Forge Extract Engine est le composant responsable de l'extraction universelle de tout document privé côté client. Il fonctionne entièrement dans le navigateur sans aucune dépendance serveur.

```
Input (PDF | DOCX | Markdown | TXT | EPUB | HTML)
                    │
                    ▼
           FORMAT DETECTOR
                    │
                    ▼
         EXTRACTION ENGINE
    ├── PDF Parser    (pdf.js — WASM)
    ├── DOCX Parser   (mammoth.js)
    ├── Markdown Parser (marked.js)
    ├── TXT Parser    (natif)
    ├── HTML Parser   (DOMParser natif)
    └── EPUB Parser   (epub.js)
                    │
                    ▼
          CLEANING ENGINE
       (suppression métadonnées,
        normalisation whitespace,
        déduplication paragraphes)
                    │
                    ▼
         CHUNKING ENGINE
       (découpage sémantique
        300-500 tokens/chunk)
                    │
                    ▼
         DOCUMENT CANONICAL MODEL (DCM)
       {title, chunks[], language,
        source_type, word_count,
        extracted_at, privacy_level}
                    │
                    ▼
         AI SUMMARIZER (condensé Pareto)
                    │
                    ▼
              IMPRINT → FSRS → COSMOS
                    │
                    ▼
           KNOWLEDGE BUNDLE
```

**Le reste de l'application ne connaît jamais le format d'origine.** Tous les modules consomment uniquement le Document Canonical Model (DCM). Si demain le moteur d'extraction est remplacé (Docling compilé en WASM, par exemple), aucun module en aval ne change.

---

### 8.3 Document Canonical Model (DCM)

Interface unique exposée par le Forge Extract Engine vers le reste de l'application :

```typescript
interface DocumentCanonicalModel {
  id: string;                    // UUID v7
  title: string;
  source_type: 'pdf' | 'docx' | 'md' | 'txt' | 'epub' | 'html' | 'youtube' | 'web';
  privacy_level: 'public' | 'personal' | 'enterprise';
  language: string;              // détecté automatiquement
  word_count: number;
  chunks: Chunk[];               // 300-500 tokens chacun
  key_concepts: string[];        // extraits par l'IA
  pareto_summary: string;        // condensé Pareto
  extracted_at: number;          // Unix timestamp
  checksum: string;              // intégrité du document source
}

interface Chunk {
  index: number;
  content: string;
  token_count: number;
  embedding?: Float32Array;      // local uniquement si privacy_level != 'public'
}
```

---

### 8.4 Stratégie WASM pour l'Extraction

Pour les documents PDF lourds, l'extraction via pdf.js (compilé en WASM) tourne directement dans le Service Worker de l'extension Chrome. Cela garantit :
- Zéro envoi de fichier au serveur
- Extraction dans un thread séparé (non bloquant)
- Compatibilité offline complète

Pour DOCX, mammoth.js est utilisé (bibliothèque JavaScript pure, aucun WASM requis).

---

## MODULE 9 — ARCHITECTURE TECHNIQUE COMPLÈTE

### 9.1 Architecture Cognitive — 4 Agents (au lieu de 18)

Là où SCYForge orchestre 13 à 18 agents, NainoForge n'en nécessite que 4. Chaque agent est un module isolé qui publie et consomme des événements via l'EventBus. Personne n'appelle directement un autre module.

```
CAPTURE AGENT
│  Responsable : capture DOM, transcript YouTube, parsing fichiers privés (FEE)
│  Publie : SourceCaptured, TranscriptExtracted, DocumentParsed
│
▼
KNOWLEDGE AGENT
│  Responsable : résumé Pareto, extraction concepts, IMPRINT, IQS, Bloom tagging
│  Consomme : SourceCaptured, DocumentParsed
│  Publie : ImprintValidated, ConceptsExtracted, FlashcardsGenerated
│
▼
STUDENT AGENT
│  Responsable : Student AI (4 analyseurs), confidence calibration, Dunning-Kruger
│  Consomme : ImprintValidated, ConceptsExtracted
│  Publie : TeachBackCompleted, MisconceptionDetected, ImprintRequired
│
▼
REVIEW AGENT
   Responsable : FSRS scheduler, session types, leech detection, COSMOS mise à jour
   Consomme : FlashcardsGenerated, TeachBackCompleted, CardReviewed
   Publie : ReviewSessionCompleted, LeechDetected, SMIUpdated, BundleExportReady
```

**Règle EventBus** : si un module A veut informer le module B, il publie un événement. Il ne connaît pas B. B s'abonne à l'événement. Ce couplage faible garantit que chaque module peut être développé, testé et remplacé indépendamment.

---

### 9.2 Monorepo — Structure des Packages

L'architecture monorepo permet de construire les fondations de SCYForge dès maintenant, même si seuls les packages core/imprint/fsrs/extension sont réellement utilisés dans le MVP.

```
packages/
├── core/          Entités domain, types partagés, contrats
├── shared/        Utilitaires, UUID v7, validation, EventBus
├── ai/            Summarizer, concept extractor, Student AI engine
├── imprint/       IMPRINT engine, IQS, Bloom tagger, Crans
├── fsrs/          Scheduler FSRS (Rust/WASM), leech detector, card generator
├── student-ai/    Teach-Back engine, 4 analyseurs, confidence calibration
├── cosmos/        Arbre sémantique, SMI 5D, gap detection, relations
├── vector/        Embeddings, chunking, recherche sémantique
├── bundle/        Bundle Engine (export/import/compression/chiffrement)
├── extract/       Forge Extract Engine (PDF/DOCX/MD/TXT parsers)
├── api/           Edge functions, auth, Dodo Payment
└── extension/     Chrome Extension MV3, Side Panel, content scripts
```

Dans 6 mois, lorsque SCYForge absorbera NainoForge, les packages `ai/`, `fsrs/`, `cosmos/` et `vector/` seront réutilisables sans réécriture.

---

### 9.3 Architecture Rust — Hexagonale

```
backend/
├── domain/
│   ├── entities/        (User, Source, ImprintNote, Flashcard, ConceptNode...)
│   ├── value_objects/   (SMIScore, ImprintCran, BloomLevel, CardType...)
│   ├── events/          (SourceCaptured, ImprintValidated, CardReviewed...)
│   └── contracts/       (Traits: SourceRepository, CardRepository...)
├── application/
│   ├── use_cases/       (CaptureSource, ForgeImprint, ScheduleReview...)
│   ├── commands/        (CreateImprint, ReviewCard, ExportBundle...)
│   └── queries/         (GetDueCards, GetCosmosTree, GetSMIScore...)
├── infrastructure/
│   ├── db/              (sqlx + PostgreSQL / SQLite local)
│   ├── ai/              (OpenAI/Anthropic providers via traits)
│   ├── vector/          (pgvector / LanceDB)
│   └── bundle/          (ZIP/AES-256 engine)
├── shared/
│   ├── event_bus.rs     (tokio broadcast channel)
│   ├── uuid_v7.rs
│   └── result.rs        (AppError, Result<T, AppError>)
└── providers/
    ├── openai.rs
    ├── anthropic.rs
    └── local_llm.rs     (futur)
```

**Patterns Rust retenus de SCYForge** :
- Typestate Pattern pour les états IMPRINT (Draft → Writing → Validated)
- Structs immuables avec builder pattern
- Traits pour les providers IA (swap sans réécriture)
- `Result<T, AppError>` systématique, jamais de `.unwrap()` en production
- Async Tokio avec Reactive Streams pour l'ingestion batch
- Validation Zod (React) + serde (Rust) : contrats fortement typés end-to-end
- UUID v7 (time-ordered) pour tous les identifiants

---

### 9.4 Architecture React — Frontend

```
extension/src/
├── features/
│   ├── capture/         (CapturePanel, YouTubeTranscript, ForgeButton)
│   ├── imprint/         (ImprintEditor, CranIndicator, IQSDisplay)
│   ├── review/          (DailyReview, FlashcardSession, LeechAlert)
│   ├── student-ai/      (TeachBackSession, ConfidenceSlider, FeedbackPanel)
│   └── cosmos/          (SemanticTree, SMIRadar, GapDetector)
├── components/
│   ├── ui/              (Button, Badge, Toast, Modal, Tooltip)
│   ├── forge/           (ForgeCommitmentScreen, PostForgeSnapshot)
│   └── bundle/          (BundleExportDialog, BundleImportDialog)
├── hooks/
│   ├── useEventBus.ts
│   ├── useFSRS.ts       (WASM scheduler)
│   ├── useIndexedDB.ts  (stockage local)
│   └── useBundle.ts
├── pages/
│   ├── Dashboard.tsx
│   ├── COSMOS.tsx
│   └── Settings.tsx
├── services/
│   ├── api.ts           (calls backend)
│   ├── forgeExtract.ts  (FEE — parsing local)
│   └── bundle.ts        (import/export)
└── state/
    ├── imprint.store.ts
    ├── review.store.ts
    └── cosmos.store.ts
```

---

### 9.5 FSRS en WASM — Coût serveur $0

Le scheduler FSRS tourne directement dans le navigateur via WebAssembly :

```
Rust (fsrs crate v0.6)
         │
         ▼
  wasm-pack build
         │
         ▼
  fsrs_wasm.js + fsrs_wasm_bg.wasm
         │
         ▼
  Chrome Extension Service Worker
         │
         ▼
  Planification des révisions en local
  Aucun appel serveur
  Fonctionne hors ligne
  Coût infrastructure : $0
```

Cela signifie que la fonctionnalité la plus critique du produit (la révision espacée) ne génère aucun coût d'infrastructure et fonctionne intégralement sans connexion.

---

### 9.6 Offline First — Stratégie IndexedDB

```
Action utilisateur
       │
       ▼
  IndexedDB (source de vérité locale)
       │
       ├── Si en ligne → sync queue → backend → confirmation
       │
       └── Si hors ligne → queue locale → retry automatique
                                          à la reconnexion
```

L'utilisateur peut forger, réviser, consulter COSMOS et exporter son bundle sans connexion internet. Seuls les appels IA (condensé Pareto, Student AI) nécessitent une connexion.

---

En complément des 7 règles existantes du PRD, ajouter :

**Règle 8** : Un concept n'est considéré "forgé" que si son SMI 5D dépasse 60% sur les 5 dimensions.

**Règle 9** : Une carte Leech (≥ 8 lapses) ne peut pas être réactivée sans passer par IMPRINT ou Student AI.

**Règle 10** : La confidence déclarée (Dunning-Kruger check) est obligatoire avant toute session Student AI de niveau SMI < 70%.

**Règle 11** : Les reviews FSRS sont immuables. Aucune suppression, aucune modification.

**Règle 12** : Le Knowledge Bundle doit pouvoir être réimporté et reconstruire l'intégralité de l'état de l'extension sans aucune dépendance serveur (hors embeddings cloud optionnels).

**Règle 13** : Chaque IMPRINT doit atteindre un IQS ≥ 30 pour générer des flashcards de type B04/B05. En dessous, seules B01 et B02 sont générées.

**Règle 14** : Un document privé (PDF, DOCX, TXT, Markdown) ne doit jamais quitter la machine de l'utilisateur. Seuls les embeddings des sources publiques peuvent être envoyés vers le cloud.

**Règle 15** : Le Forge Extract Engine est le seul point d'entrée pour tous les documents privés. Aucun autre module ne communique directement avec un fichier source.

**Règle 16** : Chaque module publie des événements via l'EventBus. Aucun module n'appelle directement un autre module. Le couplage direct est interdit.

**Règle 17** : Le scheduler FSRS s'exécute en WASM dans le navigateur. Il ne doit jamais nécessiter un appel serveur pour planifier ou évaluer une révision.

**Règle 18** : Le Document Canonical Model (DCM) est l'unique interface exposée par le Forge Extract Engine. Le format d'origine du document (PDF, DOCX, etc.) est inconnu des modules en aval.

---

## TABLEAU DE PRIORITÉ D'IMPLÉMENTATION

| Feature | Complexité | Impact cognitif | Phase |
|---------|-----------|-----------------|-------|
| 5 Types de cartes B01-B05 | Faible | Très élevé | MVP Semaine 1 |
| Crans IMPRINT (1-5) | Faible | Très élevé | MVP Semaine 1 |
| Leech Detection | Faible | Élevé | MVP Semaine 2 |
| Session Types (Micro/Standard/Deep) | Faible | Élevé | MVP Semaine 2 |
| Student AI 4-composants | Moyen | Très élevé | MVP Semaine 2 |
| IQS (IMPRINT Quality Score) | Moyen | Élevé | MVP Semaine 2 |
| SMI 5D dans COSMOS | Moyen | Très élevé | V1 post-MVP |
| Persona Adaptatif Student AI | Faible | Élevé | V1 post-MVP |
| Gap Detection COSMOS | Faible | Élevé | V1 post-MVP |
| Bloom Level Auto-Tagging | Faible | Moyen | V1 post-MVP |
| Confidence Calibration (DK) | Faible | Moyen | V1 post-MVP |
| PIVOTIQ-Lite | Moyen | Moyen | V1 post-MVP |
| Event Sourcing Reviews | Faible | Élevé (données) | MVP Semaine 2 |
| Forgetting Curve Preview | Faible | Moyen | V1 post-MVP |
| Knowledge Density Score | Faible | Moyen | V1 post-MVP |
| Relations conceptuelles COSMOS | Moyen | Élevé | V1 post-MVP |
| Daily Forge Briefing | Très faible | Élevé (habitude) | MVP Semaine 2 |
| Forge Commitment Screen | Très faible | Moyen | MVP Semaine 1 |
| Post-Forge Snapshot | Très faible | Moyen | MVP Semaine 1 |
| Bundle structure enrichie | Faible | Élevé (portabilité) | MVP Semaine 2 |
| FSRS en WASM (offline $0) | Moyen | Très élevé (coût/offline) | MVP Semaine 1 |
| Forge Extract Engine (FEE) | Moyen | Élevé (docs privés) | V1 post-MVP |
| Document Canonical Model | Faible | Élevé (architecture) | MVP Semaine 1 |
| 4 Agents + EventBus | Moyen | Élevé (architecture) | MVP Semaine 1 |
| Monorepo packages structure | Faible | Élevé (scalabilité) | MVP Semaine 1 |
| Offline First IndexedDB | Moyen | Élevé (UX) | MVP Semaine 2 |
| 3 niveaux confidentialité | Faible | Élevé (confiance) | MVP Semaine 2 |

---

## SYNTHÈSE

Ces enrichissements ne créent pas de nouveaux modules. Ils donnent de la chair aux modules existants.

**IMPRINT** passe d'un "bloc-notes sans copier-coller" à un **moteur de forge mesuré** avec profondeur, qualité, et cohérence évaluées.

**Student AI** passe d'un "quiz simple" à un **teach-back calibré** avec 4 analyseurs, persona adaptatif, et détection des biais cognitifs.

**FSRS** passe de "flashcards générées" à un **système de cartes typées**, avec gestion des leeches et event sourcing immuable.

**COSMOS** passe d'une "jauge de progression" à un **arbre sémantique vivant** avec SMI 5D, gaps visibles, relations conceptuelles, et densité mesurable.

**L'architecture** passe de "modules vaguement liés" à un **système event-driven propre** : 4 agents découplés via EventBus, monorepo évolutif, FSRS en WASM à $0 de coût serveur, IndexedDB offline-first.

**Le Forge Extract Engine** garantit que les documents privés ne quittent jamais la machine. Le Document Canonical Model unifie tous les formats en entrée. Les 3 niveaux de confidentialité donnent à l'utilisateur le contrôle total sur ses données.

La promesse de NainoForge — transformer l'apprentissage passif en apprentissage actif — n'est réellement tenue qu'avec ce niveau de rigueur sur chaque étape, et cette solidité architecturale est la base qui permettra à NainoForge de devenir la porte d'entrée de SCYForge sans réécriture.
