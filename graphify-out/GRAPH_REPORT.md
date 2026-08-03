# Graph Report - NainoForge  (2026-08-03)

## Corpus Check
- 253 files · ~234,629 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 681 nodes · 908 edges · 36 communities detected
- Extraction: 87% EXTRACTED · 13% INFERRED · 0% AMBIGUOUS · INFERRED: 118 edges (avg confidence: 0.8)
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
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]

## God Nodes (most connected - your core abstractions)
1. `write()` - 17 edges
2. `cn()` - 15 edges
3. `__wbg_get_imports()` - 14 edges
4. `Storage` - 11 edges
5. `FsrsCard` - 11 edges
6. `ReviewLogEntry` - 11 edges
7. `FsrsScheduler` - 10 edges
8. `resolve()` - 10 edges
9. `EngineBridge` - 9 edges
10. `Scheduler` - 9 edges

## Surprising Connections (you probably didn't know these)
- `SessionSummaryCard()` --calls--> `cn()`  [INFERRED]
  packages\extension\src\components\student-ai\SessionSummaryCard.js → packages\extension\src\lib\utils.ts
- `write()` --calls--> `append()`  [INFERRED]
  scaffold.js → _bmad\scripts\memlog.py
- `write()` --calls--> `load_toml()`  [INFERRED]
  scaffold.js → _bmad\scripts\resolve_config.py
- `write()` --calls--> `main()`  [INFERRED]
  scaffold.js → _bmad\scripts\resolve_config.py
- `write()` --calls--> `printUsage()`  [INFERRED]
  scaffold.js → _bmad\wds\scripts\wds-add-spacing.js

## Communities

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (26): addHeapObject(), _assertClass(), defaults(), dropObject(), FsrsCard, FsrsScheduler, getArrayJsValueFromWasm0(), getFloat64Memory0() (+18 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (13): ConceptGraph, EventBus, namespace(), EventBus, handleContentMessage(), loadImprints(), loadSources(), createOffscreen() (+5 more)

### Community 2 - "Community 2"
Cohesion: 0.05
Nodes (17): Badge(), Button(), Card(), CardContent(), CardFooter(), CardHeader(), CardTitle(), ImprintCard() (+9 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (12): ensureLoaded(), getScheduler(), parseRating(), Scheduler, Defaults, FsrsCard, FsrsScheduler, Rating (+4 more)

### Community 4 - "Community 4"
Cohesion: 0.06
Nodes (16): AutoHealPlugin, AntiCopyMoat, AssessmentEngine, LearnerEvidencePack, RelationalStateEngine, SessionArcEngine, TurnInterruptionEngine, summarizeWithFallback() (+8 more)

### Community 5 - "Community 5"
Cohesion: 0.11
Nodes (28): write(), buildObjectBlock(), deriveObjectId(), insertUnderSection(), main(), pageSlugFromPath(), parseArgs(), printUsage() (+20 more)

### Community 6 - "Community 6"
Cohesion: 0.1
Nodes (8): EngineBridge, formatDateString(), fr(), HomeSurface(), ImprintSurface(), SessionSummaryCard(), useImprint(), useSources()

### Community 7 - "Community 7"
Cohesion: 0.12
Nodes (16): countTextDepth(), hasOgbTypeArticle(), isArticlePage(), extractVideoId(), init(), isYouTubeWatchPage(), onReady(), waitForPlayerResponse() (+8 more)

### Community 8 - "Community 8"
Cohesion: 0.1
Nodes (7): hashMessage(), ApiClient, openDB(), SourceRepository, tx(), createSupabaseClient(), SyncQueueWorker

### Community 9 - "Community 9"
Cohesion: 0.12
Nodes (22): build(), append(), init(), main(), _now_iso(), Append-only memory log for BMad runs.  Usage:   uv run {project-root}/_bmad/scri, read(), deep_merge() (+14 more)

### Community 10 - "Community 10"
Cohesion: 0.12
Nodes (7): cleanHtml(), collapseWhitespace(), stripNodes(), dot(), norm(), VectorStore, PgVectorStore

### Community 11 - "Community 11"
Cohesion: 0.3
Nodes (7): ContradictsEdge, DefaultEdge(), PrerequisiteEdge, RelatedEdge, renderContradictsEdge(), renderPrerequisiteEdge(), renderRelatedEdge()

### Community 12 - "Community 12"
Cohesion: 0.32
Nodes (11): checkObjectContent(), countNavRows(), extractObjectIds(), extractSpacingIds(), formatResult(), getPageFiles(), main(), parseArgs() (+3 more)

### Community 13 - "Community 13"
Cohesion: 0.29
Nodes (1): BundleExporter

### Community 14 - "Community 14"
Cohesion: 0.24
Nodes (2): TestCase, TestRunner

### Community 15 - "Community 15"
Cohesion: 0.29
Nodes (6): loadExtensionAndOpenSidePanel(), clickNainoForgeIcon(), createTestReport(), loadExtension(), waitForNainoForge(), waitForSelectorWithRetry()

### Community 16 - "Community 16"
Cohesion: 0.24
Nodes (2): FormatDetector, TextExtractor

### Community 17 - "Community 17"
Cohesion: 0.28
Nodes (3): ToastProvider(), useToast(), useToastCustom()

### Community 18 - "Community 18"
Cohesion: 0.33
Nodes (3): bloomFromText(), evaluateCrank(), ImprintEngine

### Community 19 - "Community 19"
Cohesion: 0.46
Nodes (7): appendToSpacingSection(), buildSpacingBlock(), main(), pagePrefix(), pageSlugFromPath(), parseArgs(), printUsage()

### Community 20 - "Community 20"
Cohesion: 0.62
Nodes (5): estimateWordCount(), extractYouTubeTranscript(), parseJson3(), pickCaptionTrack(), toMs()

### Community 21 - "Community 21"
Cohesion: 0.73
Nodes (4): extractConceptPhrase(), generateCards(), makeId(), pushCards()

### Community 22 - "Community 22"
Cohesion: 0.33
Nodes (1): LiteLLMProvider

### Community 23 - "Community 23"
Cohesion: 0.8
Nodes (4): chunkText(), splitIntoChunks(), splitSections(), tokenCount()

### Community 24 - "Community 24"
Cohesion: 0.4
Nodes (1): extractTextFromPDF()

### Community 26 - "Community 26"
Cohesion: 0.5
Nodes (3): ContradictsEdge, PrerequisiteEdge, RelatedEdge

### Community 27 - "Community 27"
Cohesion: 0.5
Nodes (3): FsrsCard, FsrsScheduler, ReviewLogEntry

### Community 28 - "Community 28"
Cohesion: 0.83
Nodes (2): byteToHex(), uuidv7()

### Community 30 - "Community 30"
Cohesion: 1.0
Nodes (2): main(), runTestWithRetry()

### Community 31 - "Community 31"
Cohesion: 0.67
Nodes (1): AppShell()

### Community 32 - "Community 32"
Cohesion: 0.67
Nodes (1): SettingsDialog()

### Community 34 - "Community 34"
Cohesion: 0.67
Nodes (1): runWithAutoHealing()

### Community 37 - "Community 37"
Cohesion: 1.0
Nodes (1): Storage

### Community 43 - "Community 43"
Cohesion: 1.0
Nodes (1): EngineBridge

### Community 46 - "Community 46"
Cohesion: 1.0
Nodes (1): Scheduler

### Community 47 - "Community 47"
Cohesion: 1.0
Nodes (1): ImprintEngine

## Knowledge Gaps
- **14 isolated node(s):** `Storage`, `PrerequisiteEdge`, `RelatedEdge`, `ContradictsEdge`, `EngineBridge` (+9 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 13`** (10 nodes): `BundleExporter`, `.build()`, `.render()`, `.renderAnki()`, `.renderMarkdown()`, `.renderPdfPlaceholder()`, `contracts.ts`, `engine.js`, `engine.ts`, `engine.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (10 nodes): `test-orchestrator.js`, `TestCase`, `.constructor()`, `.run()`, `TestRunner`, `.addTestCase()`, `.checkExitCode()`, `.constructor()`, `.generateReport()`, `.run()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (10 nodes): `FormatDetector`, `.detectFromExtension()`, `.detectFromMime()`, `TextExtractor`, `.extract()`, `.#extractDocx()`, `.#extractPdf()`, `contracts.ts`, `engine.ts`, `engine.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (6 nodes): `LiteLLMProvider`, `.complete()`, `.constructor()`, `contracts.ts`, `engine.ts`, `engine.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (5 nodes): `isPDFPayload()`, `offscreen.ts`, `pdf.js`, `pdf.ts`, `extractTextFromPDF()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (4 nodes): `uuid.js`, `uuid.ts`, `byteToHex()`, `uuidv7()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 30`** (3 nodes): `test-runner.js`, `main()`, `runTestWithRetry()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 31`** (3 nodes): `AppShell()`, `AppShell.js`, `AppShell.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 32`** (3 nodes): `SettingsDialog.js`, `SettingsDialog.tsx`, `SettingsDialog()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 34`** (3 nodes): `runWithAutoHealing()`, `nainoforge-extension.spec.js`, `nainoforge-extension.spec.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (2 nodes): `storage.d.ts`, `Storage`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 43`** (2 nodes): `EngineBridge`, `engine-bridge.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 46`** (2 nodes): `Scheduler`, `index.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 47`** (2 nodes): `ImprintEngine`, `engine.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `EngineBridge` connect `Community 6` to `Community 1`?**
  _High betweenness centrality (0.136) - this node is a cross-community bridge._
- **Why does `append()` connect `Community 9` to `Community 5`?**
  _High betweenness centrality (0.119) - this node is a cross-community bridge._
- **Why does `_list_merge()` connect `Community 9` to `Community 1`?**
  _High betweenness centrality (0.119) - this node is a cross-community bridge._
- **Are the 16 inferred relationships involving `write()` (e.g. with `append()` and `load_toml()`) actually correct?**
  _`write()` has 16 INFERRED edges - model-reasoned connections that need verification._
- **Are the 14 inferred relationships involving `cn()` (e.g. with `SidePanelHeader()` and `InterruptionBubble()`) actually correct?**
  _`cn()` has 14 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `__wbg_get_imports()` (e.g. with `.get()` and `.set()`) actually correct?**
  _`__wbg_get_imports()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Storage`, `PrerequisiteEdge`, `RelatedEdge` to the rest of the system?**
  _14 weakly-connected nodes found - possible documentation gaps or missing edges._