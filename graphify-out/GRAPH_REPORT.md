# Graph Report - NainoForge  (2026-07-17)

## Corpus Check
- 242 files · ~162,220 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 576 nodes · 724 edges · 25 communities detected
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 42 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 37|Community 37]]

## God Nodes (most connected - your core abstractions)
1. `write()` - 17 edges
2. `__wbg_get_imports()` - 14 edges
3. `FsrsCard` - 13 edges
4. `ReviewLogEntry` - 13 edges
5. `FsrsScheduler` - 12 edges
6. `getInt32Memory0()` - 10 edges
7. `getStringFromWasm0()` - 9 edges
8. `Scheduler` - 9 edges
9. `resolve()` - 9 edges
10. `main()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `write()` --calls--> `append()`  [INFERRED]
  scaffold.js → _bmad\scripts\memlog.py
- `write()` --calls--> `load_toml()`  [INFERRED]
  scaffold.js → _bmad\scripts\resolve_config.py
- `write()` --calls--> `main()`  [INFERRED]
  scaffold.js → _bmad\scripts\resolve_config.py
- `write()` --calls--> `printUsage()`  [INFERRED]
  scaffold.js → _bmad\wds\scripts\wds-add-object.js
- `write()` --calls--> `main()`  [INFERRED]
  scaffold.js → _bmad\wds\scripts\wds-add-object.js

## Communities

### Community 0 - "Community 0"
Cohesion: 0.09
Nodes (26): addHeapObject(), _assertClass(), defaults(), dropObject(), FsrsCard, FsrsScheduler, getArrayJsValueFromWasm0(), getFloat64Memory0() (+18 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (14): Defaults, FsrsCard, FsrsScheduler, Rating, ReviewLogEntry, set_defaults(), with_defaults(), estimateWordCount() (+6 more)

### Community 2 - "Community 2"
Cohesion: 0.1
Nodes (29): append(), init(), main(), _now_iso(), Append-only memory log for BMad runs.  Usage:   uv run {project-root}/_bmad/scri, read(), deep_merge(), _detect_keyed_merge_field() (+21 more)

### Community 3 - "Community 3"
Cohesion: 0.08
Nodes (12): AntiCopyMoat, AssessmentEngine, AntiCopyMoat, AssessmentEngine, LearnerEvidencePack, RelationalStateEngine, SessionArcEngine, TurnInterruptionEngine (+4 more)

### Community 4 - "Community 4"
Cohesion: 0.12
Nodes (27): write(), appendToSpacingSection(), buildSpacingBlock(), main(), pagePrefix(), pageSlugFromPath(), parseArgs(), printUsage() (+19 more)

### Community 5 - "Community 5"
Cohesion: 0.14
Nodes (15): countTextDepth(), hasOgbTypeArticle(), isArticlePage(), doc(), extractVideoId(), init(), isYouTubeWatchPage(), onReady() (+7 more)

### Community 6 - "Community 6"
Cohesion: 0.11
Nodes (5): ApiClient, ApiClient, createSupabaseClient(), SyncQueueWorker, SyncQueueWorker

### Community 7 - "Community 7"
Cohesion: 0.12
Nodes (8): cleanHtml(), collapseWhitespace(), stripNodes(), dot(), norm(), VectorStore, EventBus, namespace()

### Community 8 - "Community 8"
Cohesion: 0.15
Nodes (5): hashMessage(), SourceRepository, openDB(), SourceRepository, tx()

### Community 9 - "Community 9"
Cohesion: 0.18
Nodes (4): FormatDetector, TextExtractor, FormatDetector, TextExtractor

### Community 10 - "Community 10"
Cohesion: 0.15
Nodes (4): VectorStore, PgVectorStore, PgVectorStore, mockClient()

### Community 11 - "Community 11"
Cohesion: 0.32
Nodes (8): extractConcepts(), firstN(), freqMap(), properNounCandidates(), scoreCandidates(), sentences(), summarize(), tokenize()

### Community 12 - "Community 12"
Cohesion: 0.15
Nodes (2): ConceptGraph, ConceptGraph

### Community 13 - "Community 13"
Cohesion: 0.29
Nodes (4): ensureLoaded(), getScheduler(), parseRating(), Scheduler

### Community 14 - "Community 14"
Cohesion: 0.23
Nodes (2): BundleExporter, BundleExporter

### Community 15 - "Community 15"
Cohesion: 0.32
Nodes (11): checkObjectContent(), countNavRows(), extractObjectIds(), extractSpacingIds(), formatResult(), getPageFiles(), main(), parseArgs() (+3 more)

### Community 16 - "Community 16"
Cohesion: 0.22
Nodes (2): LiteLLMProvider, LiteLLMProvider

### Community 17 - "Community 17"
Cohesion: 0.31
Nodes (3): bloomFromText(), evaluateCrank(), ImprintEngine

### Community 19 - "Community 19"
Cohesion: 0.8
Nodes (4): chunkText(), splitIntoChunks(), splitSections(), tokenCount()

### Community 20 - "Community 20"
Cohesion: 0.33
Nodes (2): isPDFPayload(), extractTextFromPDF()

### Community 21 - "Community 21"
Cohesion: 0.6
Nodes (3): FsrsCard, FsrsScheduler, ReviewLogEntry

### Community 22 - "Community 22"
Cohesion: 0.83
Nodes (2): byteToHex(), uuidv7()

### Community 23 - "Community 23"
Cohesion: 0.67
Nodes (1): Scheduler

### Community 35 - "Community 35"
Cohesion: 1.0
Nodes (1): ImprintEngine

### Community 37 - "Community 37"
Cohesion: 1.0
Nodes (1): EventBus

## Knowledge Gaps
- **22 isolated node(s):** `LiteLLMProvider`, `ApiClient`, `SyncQueueWorker`, `BundleExporter`, `ConceptGraph` (+17 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 12`** (13 nodes): `ConceptGraph`, `.addConcept()`, `.addRelation()`, `.getConcept()`, `.getRelations()`, `.neighbors()`, `.topologicalSort()`, `ConceptGraph`, `contracts.ts`, `engine.d.ts`, `engine.js`, `engine.ts`, `engine.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (12 nodes): `BundleExporter`, `.build()`, `.render()`, `.renderAnki()`, `.renderMarkdown()`, `.renderPdfPlaceholder()`, `BundleExporter`, `contracts.ts`, `engine.d.ts`, `engine.js`, `engine.ts`, `engine.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (9 nodes): `LiteLLMProvider`, `LiteLLMProvider`, `.complete()`, `.constructor()`, `contracts.ts`, `engine.d.ts`, `engine.js`, `engine.ts`, `engine.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (6 nodes): `isPDFPayload()`, `offscreen.js`, `offscreen.ts`, `pdf.js`, `pdf.ts`, `extractTextFromPDF()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (4 nodes): `uuid.js`, `uuid.ts`, `byteToHex()`, `uuidv7()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (3 nodes): `Scheduler`, `index.d.ts`, `index.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 35`** (2 nodes): `ImprintEngine`, `engine.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (2 nodes): `EventBus`, `event-bus.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `_detect_keyed_merge_field()` connect `Community 2` to `Community 13`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Why does `write()` connect `Community 4` to `Community 2`, `Community 15`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `append()` connect `Community 2` to `Community 4`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Are the 16 inferred relationships involving `write()` (e.g. with `append()` and `load_toml()`) actually correct?**
  _`write()` has 16 INFERRED edges - model-reasoned connections that need verification._
- **What connects `LiteLLMProvider`, `ApiClient`, `SyncQueueWorker` to the rest of the system?**
  _22 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._