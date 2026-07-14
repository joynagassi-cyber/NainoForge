import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
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
  },
});
