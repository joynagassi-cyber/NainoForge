# Graph Report - NainoForge  (2026-07-15)

## Corpus Check
- 62 files · ~111,472 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 293 nodes · 487 edges · 19 communities detected
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 35 edges (avg confidence: 0.8)
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

## God Nodes (most connected - your core abstractions)
1. `write()` - 17 edges
2. `__wbg_get_imports()` - 14 edges
3. `FsrsCard` - 13 edges
4. `ReviewLogEntry` - 13 edges
5. `FsrsScheduler` - 12 edges
6. `getInt32Memory0()` - 10 edges
7. `getStringFromWasm0()` - 9 edges
8. `resolve()` - 9 edges
9. `main()` - 9 edges
10. `main()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `append()` --calls--> `write()`  [INFERRED]
  _bmad\scripts\memlog.py → scaffold.js
- `load_toml()` --calls--> `write()`  [INFERRED]
  _bmad\scripts\resolve_config.py → scaffold.js
- `main()` --calls--> `write()`  [INFERRED]
  _bmad\scripts\resolve_config.py → scaffold.js
- `printUsage()` --calls--> `write()`  [INFERRED]
  _bmad\wds\scripts\wds-add-object.js → scaffold.js
- `main()` --calls--> `write()`  [INFERRED]
  _bmad\wds\scripts\wds-add-object.js → scaffold.js

## Communities

### Community 0 - "Community 0"
Cohesion: 0.16
Nodes (24): addHeapObject(), _assertClass(), defaults(), dropObject(), FsrsScheduler, getArrayJsValueFromWasm0(), getFloat64Memory0(), getInt32Memory0() (+16 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (12): Defaults, FsrsCard, FsrsScheduler, Rating, ReviewLogEntry, set_defaults(), with_defaults(), estimateWordCount() (+4 more)

### Community 2 - "Community 2"
Cohesion: 0.12
Nodes (15): countTextDepth(), hasOgbTypeArticle(), isArticlePage(), extractVideoId(), init(), isYouTubeWatchPage(), onReady(), waitForPlayerResponse() (+7 more)

### Community 3 - "Community 3"
Cohesion: 0.16
Nodes (20): write(), buildTemplate(), main(), parseArgs(), printUsage(), toSlug(), buildReadme(), main() (+12 more)

### Community 4 - "Community 4"
Cohesion: 0.12
Nodes (2): FsrsCard, ReviewLogEntry

### Community 5 - "Community 5"
Cohesion: 0.18
Nodes (14): append(), init(), main(), _now_iso(), Append-only memory log for BMad runs.  Usage:   uv run {project-root}/_bmad/scri, read(), _list_merge(), load_toml() (+6 more)

### Community 6 - "Community 6"
Cohesion: 0.19
Nodes (4): hashMessage(), openDB(), SourceRepository, tx()

### Community 7 - "Community 7"
Cohesion: 0.32
Nodes (11): checkObjectContent(), countNavRows(), extractObjectIds(), extractSpacingIds(), formatResult(), getPageFiles(), main(), parseArgs() (+3 more)

### Community 8 - "Community 8"
Cohesion: 0.29
Nodes (8): extractConcepts(), firstN(), freqMap(), properNounCandidates(), scoreCandidates(), sentences(), summarize(), tokenize()

### Community 9 - "Community 9"
Cohesion: 0.27
Nodes (2): ensureLoaded(), Scheduler

### Community 10 - "Community 10"
Cohesion: 0.42
Nodes (8): buildObjectBlock(), deriveObjectId(), insertUnderSection(), main(), pageSlugFromPath(), parseArgs(), printUsage(), toSlug()

### Community 11 - "Community 11"
Cohesion: 0.46
Nodes (7): deep_merge(), _detect_keyed_merge_field(), extract_key(), load_toml(), main(), _merge_arrays(), _merge_by_key()

### Community 12 - "Community 12"
Cohesion: 0.46
Nodes (7): appendToSpacingSection(), buildSpacingBlock(), main(), pagePrefix(), pageSlugFromPath(), parseArgs(), printUsage()

### Community 13 - "Community 13"
Cohesion: 0.38
Nodes (3): bloomFromText(), evaluateCrank(), ImprintEngine

### Community 14 - "Community 14"
Cohesion: 0.29
Nodes (1): EventBus

### Community 15 - "Community 15"
Cohesion: 0.6
Nodes (3): FsrsCard, FsrsScheduler, ReviewLogEntry

### Community 16 - "Community 16"
Cohesion: 0.8
Nodes (4): chunkText(), splitIntoChunks(), splitSections(), tokenCount()

### Community 17 - "Community 17"
Cohesion: 0.6
Nodes (3): cleanHtml(), collapseWhitespace(), stripNodes()

### Community 19 - "Community 19"
Cohesion: 1.0
Nodes (2): byteToHex(), uuidv7()

## Knowledge Gaps
- **4 isolated node(s):** `Append-only memory log for BMad runs.  Usage:   uv run {project-root}/_bmad/scri`, `Resolve BMad customization: merge base/team/user TOML layers and emit JSON for t`, `Load a TOML file, return empty dict if missing.`, `Merge two lists.     - Arrays of tables keyed by `code`/`id`: replace matching,`
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 4`** (18 nodes): `FsrsCard`, `.__destroy_into_raw()`, `.difficulty()`, `.free()`, `.lastReviewAt()`, `.nextReviewAt()`, `.reps()`, `.stability()`, `.__wrap()`, `.free()`, `ReviewLogEntry`, `.__destroy_into_raw()`, `.free()`, `.intervalAfter()`, `.intervalBefore()`, `.reviewedAt()`, `.stabilityAfter()`, `.stabilityBefore()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 9`** (11 nodes): `ensureLoaded()`, `getScheduler()`, `parseRating()`, `Scheduler`, `.all()`, `.constructor()`, `.createCard()`, `.due()`, `.retrievability()`, `.reviewCard()`, `index.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (7 nodes): `EventBus`, `.emit()`, `.off()`, `.on()`, `.removeAll()`, `namespace()`, `event-bus.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (3 nodes): `uuid.ts`, `byteToHex()`, `uuidv7()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `_detect_keyed_merge_field()` connect `Community 11` to `Community 9`?**
  _High betweenness centrality (0.149) - this node is a cross-community bridge._
- **Why does `write()` connect `Community 3` to `Community 5`, `Community 7`, `Community 10`, `Community 11`, `Community 12`?**
  _High betweenness centrality (0.132) - this node is a cross-community bridge._
- **Why does `main()` connect `Community 11` to `Community 3`, `Community 5`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Are the 16 inferred relationships involving `write()` (e.g. with `append()` and `load_toml()`) actually correct?**
  _`write()` has 16 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Append-only memory log for BMad runs.  Usage:   uv run {project-root}/_bmad/scri`, `Resolve BMad customization: merge base/team/user TOML layers and emit JSON for t`, `Load a TOML file, return empty dict if missing.` to the rest of the system?**
  _4 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._