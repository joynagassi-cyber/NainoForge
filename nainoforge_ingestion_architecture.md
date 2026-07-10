# NAINOFORGE — INGESTION ENGINE SPEC
## Architecture complète d'ingestion : Web, YouTube, Fichiers locaux
**Version** : 1.0 | **Contexte** : Chrome Extension MV3 — zéro proxy serveur, client-first  
**Référence SCYForge** : `scy_youtube_core_plan.md` + `scy_web_article_core_plan.md` (adaptés)

---

## PRINCIPE FONDATEUR DE L'INGESTION NAINOFORGE

SCYForge fait tourner `yt-dlp`, `ffmpeg`, `Whisper` et `Scrapling` côté serveur dans des conteneurs Docker. NainoForge est une extension Chrome. Il n'y a pas de conteneur, pas de proxy, pas de serveur d'ingestion.

**L'avantage stratégique de l'extension Chrome est précisément celui que SCYForge ne peut pas avoir** : l'extension vit à l'intérieur du navigateur. Elle accède directement au DOM rendu, aux objets JavaScript de la page, aux ressources réseau interceptées, sans jamais avoir besoin d'un proxy. La page est déjà chargée. Le contenu est déjà là.

Ce principe gouverne toute l'architecture d'ingestion :

| SCYForge (serveur) | NainoForge (extension) |
|--------------------|----------------------|
| Scrapling Docker + Chromium headless | Content Script sur la page déjà chargée |
| yt-dlp + ffmpeg | `ytInitialPlayerResponse` JS accessible depuis la page |
| Whisper-tiny ONNX CPU | Transcript déjà présent dans le DOM YouTube |
| Pipeline Mastra TypeScript backend | Background Service Worker MV3 |
| PostgreSQL + Zilliz | IndexedDB local + API cloud optionnelle |

---

## ARCHITECTURE UNIFIÉE D'INGESTION

Tous les types de sources passent par le même pipeline après extraction. La différence n'est que dans l'extracteur d'entrée.

```
┌─────────────────────────────────────────────────────────┐
│                  INGESTION SOURCES                      │
├──────────────┬──────────────────┬───────────────────────┤
│  WEB ARTICLE │    YOUTUBE       │   FICHIER LOCAL        │
│  Core        │    Core          │   Core                 │
│  (Content    │  ┌─ URL Mode     │  (PDF / DOCX / MD /   │
│   Script +   │  └─ Auto-Capture │   TXT / EPUB)          │
│   Readability│    Mode          │   Forge Extract Engine │
└──────┬───────┴────────┬─────────┴──────────┬────────────┘
       │                │                    │
       └────────────────┴────────────────────┘
                              │
                              ▼
                ┌─────────────────────────┐
                │   DEDUP CACHE CHECK     │
                │   (IndexedDB            │
                │    content_hash SHA-256)│
                └────────────┬────────────┘
                        Hit  │  Miss
                     (skip)  │  (continuer)
                             ▼
                ┌─────────────────────────┐
                │    CLEANING ENGINE      │
                │  • Normalisation        │
                │  • Suppression nav/ads  │
                │  • Extraction metadata  │
                └────────────┬────────────┘
                             ▼
                ┌─────────────────────────┐
                │    CHUNKING ENGINE      │
                │  • 300-500 tokens/chunk │
                │  • Overlap 50 tokens    │
                │  • Préservation §       │
                └────────────┬────────────┘
                             ▼
                ┌─────────────────────────┐
                │  DOCUMENT CANONICAL     │
                │  MODEL (DCM)            │
                │  (interface unifiée)    │
                └────────────┬────────────┘
                             ▼
                ┌─────────────────────────┐
                │   AI SUMMARIZER         │
                │  • Condensé Pareto      │
                │  • Concepts-clés        │
                │  • Privacy check avant  │
                │    envoi API            │
                └────────────┬────────────┘
                             ▼
                ┌─────────────────────────┐
                │   INDEXEDDB + BUNDLE    │
                │   (stockage local)      │
                │  + EMBEDDING (si public)│
                └─────────────────────────┘
```

---

## CORE 1 — WEB ARTICLE INGESTION

### Vue d'ensemble

L'extension Chrome est sur la page. Elle a déjà accès au DOM rendu, après JavaScript, après anti-bot, après lazy loading. Pas besoin de Scrapling. Pas besoin de Chromium headless. Le navigateur fait le travail à notre place.

### Architecture du flux

```
[Utilisateur sur une page web]
            │
            ▼
[Content Script NainoForge injecté]
            │
            ├─► [Détection automatique : est-ce un article lisible ?]
            │         │
            │         ├─► Oui → badge "Forge cet article" affiché
            │         └─► Non → pas de badge (page trop dynamique / app)
            │
            ▼
[Utilisateur clique sur "Capturer" ou sélectionne du texte]
            │
            ├─► MODE A : Capture de la page entière
            │         │
            │         ▼
            │   [Readability.js] (Mozilla — exécuté dans Content Script)
            │         │
            │         ▼
            │   [Extraction nettoyée]
            │   • title (h1 ou <title>)
            │   • byline (auteur)
            │   • content (HTML nettoyé → Markdown)
            │   • excerpt (résumé natif si présent)
            │   • siteName, publishedTime
            │   • OpenGraph meta (og:title, og:description, og:image)
            │
            ├─► MODE B : Capture de la sélection
            │         │
            │         ▼
            │   [window.getSelection().toString()]
            │   + [contexte : titre de la page + URL + date]
            │
            └─► MODE C : Capture via URL fournie (page non ouverte)
                      │
                      ▼
              [Background Service Worker]
                      │
                      ▼
              [chrome.tabs.create({ url, active: false })]
                puis injection content script + extraction
                puis fermeture de l'onglet silencieux
```

### Readability.js — Configuration

```typescript
import { Readability } from '@mozilla/readability';
import DOMPurify from 'dompurify';

interface WebArticleExtraction {
  title: string;
  byline: string | null;
  content_html: string;
  content_markdown: string;
  excerpt: string | null;
  site_name: string | null;
  published_time: string | null;
  url: string;
  og_image: string | null;
  word_count: number;
  extraction_confidence: number; // 0-1 (Readability score)
}

async function extractWebArticle(doc: Document, url: string): Promise<WebArticleExtraction> {
  // Clone le document (Readability modifie le DOM)
  const cloned = doc.cloneNode(true) as Document;

  // Extraction Readability
  const reader = new Readability(cloned, {
    charThreshold: 500,        // minimum 500 chars pour être considéré article
    keepClasses: false,        // supprimer les classes CSS
    disableJSONLD: false,      // garder les métadonnées structurées
  });

  const article = reader.parse();
  if (!article) throw new Error('READABILITY_PARSE_FAILED');

  // Sanitisation XSS
  const clean_html = DOMPurify.sanitize(article.content, {
    ALLOWED_TAGS: ['p','h1','h2','h3','h4','h5','h6','ul','ol','li',
                   'blockquote','code','pre','strong','em','a','img'],
    ALLOWED_ATTR: ['href','src','alt'],
  });

  // Conversion HTML → Markdown
  const markdown = htmlToMarkdown(clean_html); // turndown.js

  // OpenGraph extraction
  const og = extractOpenGraph(doc);

  return {
    title: article.title,
    byline: article.byline,
    content_html: clean_html,
    content_markdown: markdown,
    excerpt: article.excerpt,
    site_name: article.siteName,
    published_time: og.published_time,
    url,
    og_image: og.image,
    word_count: article.length,
    extraction_confidence: article.length > 1000 ? 0.9 : 0.6,
  };
}
```

### Détection de lisibilité

Avant d'afficher le badge "Forge cet article", l'extension vérifie silencieusement si la page est extractable :

```typescript
function isArticlePage(doc: Document): boolean {
  const signals = [
    !!doc.querySelector('article'),           // balise <article> présente
    !!doc.querySelector('[itemprop="articleBody"]'),  // Schema.org
    !!doc.querySelector('meta[property="og:type"][content="article"]'), // OG article
    doc.querySelectorAll('p').length > 5,     // au moins 5 paragraphes
    getTextLength(doc) > 500,                 // au moins 500 chars de texte
  ];
  return signals.filter(Boolean).length >= 3; // 3/5 signaux = article détecté
}
```

### Dépendances (toutes côté client)

| Package | Usage | Bundle size |
|---------|-------|-------------|
| `@mozilla/readability` | Extraction article | ~22KB |
| `dompurify` | Sanitisation XSS | ~18KB |
| `turndown` | HTML → Markdown | ~15KB |
| Natif Chrome | DOM, OpenGraph, meta | 0KB |

**Total ajouté au Content Script** : ~55KB gzippé

### Tables IndexedDB impactées

```typescript
// nf_sources
{
  id: uuid_v7(),
  source_type: 'web_article',
  privacy_level: 'public',
  url: string,
  content_hash: sha256(content_markdown), // déduplication
  title: string,
  byline: string | null,
  content_markdown: string,
  excerpt: string | null,
  og_image: string | null,
  word_count: number,
  captured_at: unix_timestamp,
  dcm_id: uuid_v7(),   // lien vers le Document Canonical Model
  status: 'captured' | 'summarized' | 'imprinted',
}
```

---

## CORE 2 — YOUTUBE INGESTION

YouTube est le cas le plus puissant de l'extension Chrome. Le navigateur a déjà téléchargé et exécuté la page YouTube. L'objet `ytInitialPlayerResponse` — qui contient TOUTES les métadonnées de la vidéo, les chapitres, les pistes de sous-titres — est accessible directement depuis le Content Script.

Aucun `yt-dlp`. Aucun `ffmpeg`. Aucun `Whisper`. La donnée est déjà là.

### Deux modes d'ingestion

```
MODE A : URL fournie                    MODE B : Auto-capture en lecture
─────────────────────                   ──────────────────────────────
Utilisateur colle une URL YouTube       Utilisateur regarde une vidéo
dans le panel NainoForge                YouTube → extension détecte →
         │                              badge "Forger cette vidéo" apparaît
         ▼                                       │
[Background Service Worker]                      ▼
  crée onglet silencieux              [Content Script sur youtube.com]
  injecte content script                détecte ytInitialPlayerResponse
         │                                       │
         └──────────────┬──────────────────────┘
                        ▼
              [YouTube Extraction Engine]
```

### YouTube Extraction Engine — Flux détaillé

```
[Content Script sur youtube.com]
            │
            ▼
[Lecture de ytInitialPlayerResponse depuis window]
            │
            ├─► video_id
            ├─► title
            ├─► description
            ├─► channel name
            ├─► duration
            ├─► publish_date
            ├─► chapters (si présents)
            └─► captions.playerCaptionsTracklistRenderer
                    │
                    ▼
            [CAPTION TRACKS disponibles ?]
                    │
         ┌──────────┴──────────────┐
         ▼ OUI                     ▼ NON
[Sélection de la piste]     [Signal à l'utilisateur]
 Priority:                  "Pas de sous-titres disponibles
 1. fr (manuel)              pour cette vidéo."
 2. fr (auto-généré)         → Proposer : coller transcript
 3. en (manuel)                manuellement
 4. en (auto-généré)         → Proposer : résumer description
 5. autre langue              uniquement
         │
         ▼
[Fetch du fichier timedtext via l'API YouTube]
 URL : https://www.youtube.com/api/timedtext
       ?v={video_id}&lang={lang}&fmt=json3
         │
         ▼
[Parsing JSON3 → Transcript structuré]
  [{start_ms, dur_ms, text}, ...]
         │
         ▼
[Fusion intelligente des segments]
  • Regroupement par phrases (ponctuation)
  • Regroupement par chapitres (si disponibles)
  • Timestamp conservé par bloc
         │
         ▼
[Format Markdown structuré]
  # Titre de la vidéo
  **Chaîne** : [channel_name]
  **Durée** : [duration]
  **Chapitres détectés** : [N]

  ## Chapitre 1 — [00:00] Titre
  [transcript du chapitre 1]

  ## Chapitre 2 — [03:45] Titre
  [transcript du chapitre 2]
         │
         ▼
[Document Canonical Model (DCM)]
```

### Auto-capture en cours de lecture

Le Content Script surveille l'état du player YouTube et propose l'ingestion au bon moment :

```typescript
class YouTubeAutoCapture {
  private observer: MutationObserver;
  private currentVideoId: string | null = null;

  init() {
    // Surveille les changements de navigation YouTube (SPA)
    this.observer = new MutationObserver(() => {
      const newVideoId = this.extractVideoId(window.location.href);
      if (newVideoId && newVideoId !== this.currentVideoId) {
        this.currentVideoId = newVideoId;
        this.onVideoChanged(newVideoId);
      }
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  private async onVideoChanged(videoId: string) {
    // Attendre que ytInitialPlayerResponse soit chargé
    await this.waitForPlayerResponse();

    const metadata = this.extractMetadata(window.ytInitialPlayerResponse);
    const hasCaptions = this.checkCaptionsAvailability(metadata);

    // Afficher le badge NainoForge
    this.showForgeButton({
      videoId,
      title: metadata.title,
      duration: metadata.duration,
      hasCaptions,
      chaptersCount: metadata.chapters?.length ?? 0,
    });
  }

  private waitForPlayerResponse(): Promise<void> {
    return new Promise((resolve) => {
      const check = () => {
        if (window.ytInitialPlayerResponse?.videoDetails) {
          resolve();
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  }
}
```

### Extraction du transcript via `ytInitialPlayerResponse`

```typescript
interface YouTubeTranscriptSegment {
  start_ms: number;
  end_ms: number;
  text: string;
  chapter_title?: string;
}

async function extractYouTubeTranscript(
  playerResponse: any,
  preferredLang: string = 'fr'
): Promise<YouTubeTranscriptSegment[]> {

  // 1. Récupérer les pistes disponibles
  const tracks = playerResponse
    ?.captions
    ?.playerCaptionsTracklistRenderer
    ?.captionTracks ?? [];

  if (tracks.length === 0) throw new Error('NO_CAPTIONS_AVAILABLE');

  // 2. Sélectionner la meilleure piste
  const track = selectBestTrack(tracks, preferredLang);
  // Priority: manual > auto-generated, preferred lang > english > other

  // 3. Fetch du transcript (même domaine, pas de CORS)
  const url = `${track.baseUrl}&fmt=json3`;
  const response = await fetch(url);
  const data = await response.json();

  // 4. Parser les événements JSON3
  const segments: YouTubeTranscriptSegment[] = [];
  for (const event of data.events) {
    if (!event.segs) continue;
    const text = event.segs.map((s: any) => s.utf8).join('').trim();
    if (!text) continue;
    segments.push({
      start_ms: event.tStartMs,
      end_ms: event.tStartMs + (event.dDurationMs ?? 0),
      text,
    });
  }

  // 5. Associer aux chapitres si disponibles
  return assignChapters(segments, playerResponse);
}
```

### Cas sans sous-titres disponibles

```
[Aucun sous-titre détecté]
            │
            ▼
[Panel NainoForge affiche 3 options]

┌─────────────────────────────────────────┐
│  ⚠️ Pas de sous-titres pour cette vidéo │
│                                         │
│  [Option 1] Résumer la description      │
│   → ingère titre + description + tags   │
│     → qualité faible mais rapide        │
│                                         │
│  [Option 2] Coller le transcript        │
│   → champ texte pour paste manuel       │
│   → quand disponible via transcription  │
│     externe (Whisper local, Rev, etc.)  │
│                                         │
│  [Option 3] Ignorer cette vidéo         │
└─────────────────────────────────────────┘
```

### Tables IndexedDB impactées

```typescript
// nf_sources (type youtube)
{
  id: uuid_v7(),
  source_type: 'youtube',
  privacy_level: 'public',
  url: `https://youtube.com/watch?v=${videoId}`,
  content_hash: sha256(transcript_markdown),
  title: string,
  channel_name: string,
  duration_seconds: number,
  publish_date: string,
  chapters: Chapter[],         // [{start_ms, title}]
  transcript_lang: string,     // 'fr', 'en', etc.
  transcript_type: 'manual' | 'auto',
  transcript_markdown: string, // contenu complet
  word_count: number,
  captured_at: unix_timestamp,
  dcm_id: uuid_v7(),
  status: 'captured' | 'summarized' | 'imprinted',
}
```

---

## CORE 3 — LOCAL FILE INGESTION (FORGE EXTRACT ENGINE)

### Vue d'ensemble

Le Forge Extract Engine (FEE) traite tous les documents privés. Il tourne entièrement dans le Service Worker ou dans un Offscreen Document MV3. Aucun fichier ne quitte la machine.

### Architecture du flux

```
[Utilisateur drague un fichier sur le panel NainoForge]
  ou [clic sur "Importer un fichier"]
            │
            ▼
[File API — FileReader dans l'extension]
            │
            ▼
[FORMAT DETECTOR]
  • Extension du fichier
  • Magic bytes (4 premiers octets)
  • MIME type
            │
     ┌──────┴─────────────────────────────────────┐
     │              │              │               │
     ▼              ▼              ▼               ▼
  [PDF Parser] [DOCX Parser] [MD/TXT Parser] [EPUB Parser]
  pdf.js WASM  mammoth.js    native TextDec  epub.js
     │              │              │               │
     └──────────────┴──────────────┴───────────────┘
                              │
                              ▼
                   [CLEANING ENGINE]
                   • Suppression headers/footers récurrents
                   • Normalisation des espaces
                   • Suppression numéros de page
                   • Fusion paragraphes coupés
                              │
                              ▼
                   [CHUNKING ENGINE]
                   • 300-500 tokens par chunk
                   • Overlap 50 tokens
                   • Préservation des titres de section
                   • Détection de la structure (h1/h2/h3)
                              │
                              ▼
                   [DOCUMENT CANONICAL MODEL]
                   • privacy_level: 'personal' TOUJOURS
                   • Les embeddings restent locaux
                   • Jamais envoyé au serveur
```

### PDF Parser — pdf.js en Offscreen Document

MV3 interdit WebAssembly dans les Service Workers. Solution : Offscreen Document.

```typescript
// offscreen.ts (exécuté dans un document offscreen caché)
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL('pdf.worker.js');

async function extractPDF(arrayBuffer: ArrayBuffer): Promise<string> {
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    // Reconstruction des lignes (pdf.js retourne des fragments individuels)
    const lines = reconstructLines(content.items as TextItem[]);
    pages.push(lines.join('\n'));
  }

  return pages.join('\n\n---\n\n'); // séparateur de page
}

function reconstructLines(items: TextItem[]): string[] {
  // Groupement par position Y (même ligne = même Y ± 2px)
  const lineMap = new Map<number, string[]>();
  for (const item of items) {
    const y = Math.round(item.transform[5] / 2) * 2; // arrondi à 2px
    if (!lineMap.has(y)) lineMap.set(y, []);
    lineMap.get(y)!.push(item.str);
  }
  // Tri de bas en haut (PDF coordinate system est inversé)
  return [...lineMap.entries()]
    .sort(([a], [b]) => b - a)
    .map(([, texts]) => texts.join(' ').trim())
    .filter(Boolean);
}
```

### DOCX Parser — mammoth.js

```typescript
import mammoth from 'mammoth';

async function extractDOCX(arrayBuffer: ArrayBuffer): Promise<string> {
  const result = await mammoth.convertToMarkdown({ arrayBuffer });

  // Avertissements (images non extraites, styles complexes ignorés)
  if (result.messages.length > 0) {
    console.warn('DOCX extraction warnings:', result.messages);
  }

  return result.value;
}
```

### Markdown / TXT Parser

```typescript
function extractMarkdown(arrayBuffer: ArrayBuffer): string {
  const decoder = new TextDecoder('utf-8');
  return decoder.decode(arrayBuffer); // Markdown est du texte brut
}

function extractTXT(arrayBuffer: ArrayBuffer): string {
  const decoder = new TextDecoder(); // auto-détection encoding
  return decoder.decode(arrayBuffer);
}
```

### Chunking Engine

```typescript
interface Chunk {
  index: number;
  content: string;
  token_count: number;
  section_title: string | null; // titre h1/h2/h3 parent si détecté
  start_char: number;
  end_char: number;
}

function chunkDocument(text: string, targetTokens: number = 400): Chunk[] {
  const chunks: Chunk[] = [];
  const sentences = splitIntoSentences(text); // segmentation par phrase
  let currentChunk: string[] = [];
  let currentTokens = 0;
  let currentSection: string | null = null;
  let charOffset = 0;

  for (const sentence of sentences) {
    // Détection de titre de section
    if (/^#{1,3}\s/.test(sentence)) {
      currentSection = sentence.replace(/^#+\s/, '').trim();
    }

    const tokens = estimateTokens(sentence); // ~4 chars/token
    if (currentTokens + tokens > targetTokens && currentChunk.length > 0) {
      // Sauvegarder le chunk courant
      const content = currentChunk.join(' ');
      chunks.push({
        index: chunks.length,
        content,
        token_count: currentTokens,
        section_title: currentSection,
        start_char: charOffset - content.length,
        end_char: charOffset,
      });
      // Overlap : garder les 2 dernières phrases
      currentChunk = currentChunk.slice(-2);
      currentTokens = currentChunk.reduce((sum, s) => sum + estimateTokens(s), 0);
    }
    currentChunk.push(sentence);
    currentTokens += tokens;
    charOffset += sentence.length + 1;
  }

  // Dernier chunk
  if (currentChunk.length > 0) {
    chunks.push({
      index: chunks.length,
      content: currentChunk.join(' '),
      token_count: currentTokens,
      section_title: currentSection,
      start_char: charOffset - currentChunk.join(' ').length,
      end_char: charOffset,
    });
  }

  return chunks;
}
```

### Dépendances (toutes côté client)

| Package | Usage | Bundle size |
|---------|-------|-------------|
| `pdfjs-dist` | Extraction PDF (WASM) | ~300KB (lazy load) |
| `mammoth` | Extraction DOCX | ~180KB (lazy load) |
| `epub.js` | Extraction EPUB | ~120KB (lazy load) |
| Natif | TXT, Markdown, HTML | 0KB |

**Chargement lazy** : ces packages sont chargés uniquement quand un fichier du type correspondant est importé. Le bundle initial de l'extension n'en est pas alourdi.

### Tables IndexedDB impactées

```typescript
// nf_sources (type file)
{
  id: uuid_v7(),
  source_type: 'pdf' | 'docx' | 'txt' | 'md' | 'epub',
  privacy_level: 'personal',  // TOUJOURS pour les fichiers locaux
  url: null,                  // pas d'URL — c'est un fichier local
  file_name: string,
  file_size_bytes: number,
  content_hash: sha256(content), // déduplication
  content_markdown: string,
  chunks: Chunk[],
  section_structure: Section[], // [{level, title, start_chunk}]
  word_count: number,
  language_detected: string,
  captured_at: unix_timestamp,
  dcm_id: uuid_v7(),
  status: 'captured' | 'summarized' | 'imprinted',
  // JAMAIS envoyé au backend
  // Uniquement dans le bundle local
}
```

---

## DEDUP CACHE — Éviter les ré-ingestions

Commun à tous les cores. Inspiré de `mfg_shared_content_cache` de SCYForge, mais en local.

```typescript
interface DedupCache {
  content_hash: string;    // SHA-256 du contenu extrait
  source_id: string;       // UUID de la source déjà ingérée
  source_type: string;
  url?: string;
  captured_at: number;
}

async function checkDedupCache(contentHash: string): Promise<DedupCache | null> {
  const cache = await indexedDB.get('nf_dedup_cache', contentHash);
  if (cache) {
    // Signal discret : "Tu as déjà forgé ce contenu le [date]. Revoir ?"
    return cache;
  }
  return null;
}
```

Si la source a déjà été ingérée, le système propose deux options :
- **Revoir le contenu forgé** → ouvre l'IMPRINT existant
- **Forger à nouveau** → crée une nouvelle note sur le même contenu (approche différente)

---

## AI SUMMARIZER — Politique de confidentialité avant appel API

Avant tout appel à l'API IA (résumé Pareto, extraction concepts), le système vérifie le niveau de confidentialité :

```typescript
async function summarizeWithAI(dcm: DocumentCanonicalModel): Promise<AIOutput> {

  // RÈGLE ABSOLUE : jamais envoyer un document personnel à l'API
  if (dcm.privacy_level !== 'public') {
    // Option 1 : résumé local via modèle léger (futur)
    // Option 2 (MVP) : résumé désactivé, IMPRINT directement sur le texte brut
    return {
      pareto_summary: null,
      key_concepts: [],
      warning: 'DOCUMENT_PRIVATE_NO_CLOUD_SUMMARIZATION',
    };
  }

  // Source publique → appel API autorisé
  const response = await callAnthropicAPI({
    model: 'claude-sonnet-4-6',
    system: PARETO_SUMMARIZER_PROMPT,
    user: dcm.chunks.slice(0, 10).map(c => c.content).join('\n\n'),
    // Max 10 chunks = ~4000 tokens max en entrée
  });

  return parseAIOutput(response);
}
```

**Comportement MVP pour les fichiers privés** :
- Pas de résumé IA automatique
- L'utilisateur voit le contenu brut chunké dans l'IMPRINT
- Il peut lire, naviguer entre chunks, et écrire sa note manuellement
- C'est cohérent avec la philosophie IMPRINT : la forge commence par la lecture personnelle

---

## ARCHITECTURE MV3 — RESPONSABILITÉS PAR COMPOSANT

```
CONTENT SCRIPT (injecté sur chaque page)
├── Détection d'article (isArticlePage)
├── Auto-capture YouTube (YouTubeAutoCapture)
├── Extraction Readability (Web Article Core)
├── Extraction ytInitialPlayerResponse (YouTube Core)
└── Affichage du badge NainoForge

SERVICE WORKER (background.js)
├── EventBus (coordination des agents)
├── Gestion des onglets silencieux (URL mode)
├── Appels API IA (Anthropic/OpenAI)
├── Dédup cache lookup
└── Routage vers IndexedDB

OFFSCREEN DOCUMENT (offscreen.html)
├── pdf.js WASM (extraction PDF)
├── mammoth.js (extraction DOCX)
└── epub.js (extraction EPUB)
  [Note: Offscreen Documents MV3 permettent WASM
         là où le Service Worker ne le peut pas]

SIDE PANEL (sidepanel.html)
├── Interface utilisateur principale
├── Panel d'import de fichiers
├── Prévisualisation du contenu extrait
└── Déclenchement du mode IMPRINT
```

---

## TABLEAU DES SOURCES SUPPORTÉES — MVP vs V1

| Source | Mode | MVP | V1 | Notes |
|--------|------|-----|----|-------|
| Article web (page ouverte) | Content Script + Readability | ✅ | ✅ | Core feature |
| YouTube (vidéo en lecture) | Auto-capture ytInitialPlayerResponse | ✅ | ✅ | Core feature |
| YouTube (URL fournie) | URL mode + onglet silencieux | ✅ | ✅ | Core feature |
| PDF (import local) | Offscreen Document + pdf.js | ✅ | ✅ | Forge Extract Engine |
| TXT / Markdown | Service Worker + TextDecoder | ✅ | ✅ | Trivial |
| DOCX | Offscreen Document + mammoth | ✅ | ✅ | Forge Extract Engine |
| EPUB | Offscreen Document + epub.js | ❌ | ✅ | Post-MVP |
| Sélection de texte | window.getSelection() | ✅ | ✅ | Le plus simple |
| URL quelconque non ouverte | Onglet silencieux + Readability | ❌ | ✅ | UX complexe |
| GitHub README | Content Script sur github.com | ❌ | ✅ | Spécifique |
| Documentation (MDN, etc.) | Content Script standard | ✅ | ✅ | Via mode article |

---

## COMPARAISON FINALE SCYForge vs NainoForge

| Composant | SCYForge | NainoForge | Avantage |
|-----------|---------|-----------|---------|
| Scraping web | Scrapling (Docker Chromium headless) | Content Script (navigateur déjà là) | NainoForge : 0 infra, 0 anti-bot |
| YouTube transcript | yt-dlp + ffmpeg + Whisper | ytInitialPlayerResponse + API timedtext | NainoForge : 0 coût, temps réel |
| PDF extraction | Serveur Python + Docling | pdf.js WASM Offscreen Document | NainoForge : 100% local, privé |
| DOCX extraction | Serveur Python + Docling | mammoth.js | NainoForge : 100% local, privé |
| Coût infra ingestion | Docker + GPU Whisper + Scrapling | $0 | NainoForge : aucun |
| Confidentialité | Fichiers envoyés au serveur | Jamais envoyés | NainoForge : RGPD natif |
| Anti-bot / paywall | Scrapling bypass | Accès direct DOM (déjà derrière auth) | NainoForge : invisible |
| Offline | Non | Oui (hors appel IA) | NainoForge : +++ |
