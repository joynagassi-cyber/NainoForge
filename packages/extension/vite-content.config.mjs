/**
 * Vite config for content script only.
 *
 * Content scripts in Chrome are injected directly into the page context —
 * they CANNOT use `import` statements or reference external chunk files.
 * The bundle must be a self-contained IIFE.
 *
 * Heavy third-party libs (@mozilla/readability, turndown) are externalized
 * to keep the bundle small. The content script uses only local extractors
 * and browser APIs (document, window, chrome.*).
 */
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [],
  css: { postcss: { plugins: [] } },
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    manifest: true,
    rolldownOptions: {
      input: {
        content: resolve(__dirname, 'src/content.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',        // no hash — single flat file
        assetFileNames: '[name][extname]',
        format: 'iife',                     // self-contained, no imports
        name: 'NainoForgeContent',          // IIFE global name
        esModule: true,
      },
      external: [
        '@mozilla/readability',
        'turndown',
      ],
    },
    rollupOptions: {
      input: {
        content: resolve(__dirname, 'src/content.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name][extname]',
        format: 'iife',
        name: 'NainoForgeContent',
        esModule: true,
      },
      external: [
        '@mozilla/readability',
        'turndown',
      ],
    },
    target: 'chrome109',
    minify: false,
    sourcemap: true,
    cssCodeSplit: false,
  },
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },
  esbuild: { jsx: 'react-jsx', jsxImportSource: 'react' },
  server: { hmr: false },
});
