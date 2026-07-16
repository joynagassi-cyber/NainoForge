"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("vitest/config");
exports.default = (0, config_1.defineConfig)({
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
                '../pkg/fsrs_bindings': new URL('packages/fsrs/src/pkg/fsrs_bindings', import.meta.url).pathname,
            },
        },
    },
});
//# sourceMappingURL=vitest.config.js.map