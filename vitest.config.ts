import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      thresholds: {
        lines: 30,
        functions: 30,
        branches: 20,
        statements: 20,
      },
      include: ['packages/*/src/**/*.ts'],
      exclude: ['**/dist/**', '**/*.test.ts', '**/*.spec.ts'],
    },
    resolve: {
      alias: {
        // fsrs: ../pkg/fsrs_bindings -> packages/fsrs/src/pkg/fsrs_bindings (wasm artifacts)
        '../pkg/fsrs_bindings': new URL('packages/fsrs/src/pkg/fsrs_bindings', import.meta.url).pathname,
      },
    },
  },
});
