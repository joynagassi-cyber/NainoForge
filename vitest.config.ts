import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
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
    exclude: ['**/dist/**'],
    resolve: {
      alias: {
        '../pkg/fsrs_bindings': new URL('packages/fsrs/src/pkg/fsrs_bindings', import.meta.url).pathname,
      },
    },
  },
});
