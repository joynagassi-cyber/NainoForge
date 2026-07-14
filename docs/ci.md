# CI/CD

## Pipeline stages

| Stage   | Runs on          | Fails on                          |
|---------|------------------|-----------------------------------|
| `quality` | every push + PR | typecheck/build failure           |
| `burn-in`  | every push + PR | test failure or coverage < threshold |
| `notify`   | on failure only | —                                 |

## Prerequisites

- Node.js **20** (CI pins exact; local must match)
- pnpm **10.33.2** (matches root `package.json` `packageManager`)
- Git checkout with working tree clean

## Local commands

```bash
# Mirrors quality stage: build all workspace packages then tsc --build
pnpm build
pnpm typecheck

# Mirrors burn-in stage: vitest run + coverage
pnpm test:ci

# Interactive watch mode
pnpm test:watch
```

## Per-package test script

All 12 workspace packages now have a `test` script:

- `@nainoforge/extension` → `vitest run` (real tests)
- other 11 packages → no-op (`echo 'no tests yet' > /dev/null`) so `pnpm -r test` doesn't fail on stubs

## Artifacts

| Artifact            | Produced by | Retention | Contents                          |
|---------------------|-------------|-----------|-----------------------------------|
| `coverage-report`   | burn-in     | 14 days   | `coverage/index.html`, `coverage/coverage-summary.json` |

## Current coverage thresholds (S2 — intentionally permissive)

| Metric     | Threshold |
|------------|-----------|
| Lines      | 30%       |
| Functions  | 30%       |
| Branches   | 20%       |
| Statements | 20%       |

Thresholds will tighten as test coverage grows across packages.

## Failure triage

1. Quality fails first → burn-in skipped → `notify` fires.
2. Burn-in fails → coverage artifact still uploaded → use `coverage/index.html` to inspect uncovered files.
3. Burn-in is currently a single-run gate (no iterative flake loop).
   - Flaky retry loop tracked in `_bmad-output/test-artifacts/ci-pipeline-progress.md`.
   - Uncomment burn-in sharding/matrix when E2E runner (Playwright/Cypress/Vitest) is added.

## Runner details

- **Vitest 2.x** — root config at `vitest.config.ts`
- **Discovery** — auto (`**/*.{test,spec}.{js,ts}`), no packages glob
- **jsdom** — available via root workspace (extension uses it)
- **Coverage** — V8 provider (`@vitest/coverage-v8` is bundled with `vitest` in v2)
