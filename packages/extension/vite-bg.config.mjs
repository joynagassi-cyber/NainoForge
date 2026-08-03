/**
 * Vite config for background, content scripts, and offscreen document.
 *
 * Output layout (all flat under dist/):
 *   background.js          — ESM (service worker, "type": "module")
 *   content.js             — IIFE (content script, single self-contained bundle)
 *   offscreen/offscreen.js — ESM (offscreen document)
 *   offscreen/pdf.js       — ESM (PDF worker)
 *
 * The content script entry uses `format: 'iife'` so Chrome injects it
 * directly into the page without needing <script type="module">.
 * Background/offscreen stay ESM for MV3 compliance.
 */
import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    // Disable PostCSS for this build — no CSS is needed for the service
    // worker and content script. Prevents Tailwind v3 interfering with
    // Tailwind v4's index.css when Rolldown resolves all dependencies.
    postcss: { plugins: [] },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: false, // popup build writes to dist/popup — don't clear it
    manifest: true,     // write .vite/manifest.json for the build script
    // Vite 8 uses Rolldown instead of Rollup. Options go into rolldownOptions
    // (which Vite forwards to the Rolldown binding).
    rolldownOptions: {
      input: {
        background:     resolve(__dirname, 'src/background.ts'),
        'offscreen/offscreen': resolve(__dirname, 'src/offscreen/offscreen.ts'),
        'offscreen/pdf': resolve(__dirname, 'src/offscreen/pdf.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        format: 'es',
        esModule: true,
      },
    },
    rollupOptions: {
      input: {
        background:     resolve(__dirname, 'src/background.ts'),
        'offscreen/offscreen': resolve(__dirname, 'src/offscreen/offscreen.ts'),
        'offscreen/pdf': resolve(__dirname, 'src/offscreen/pdf.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        format: 'es',
      },
    },
    // Chrome 109+ — modern JS, no legacy polyfills
    target: 'chrome109',
    minify: false,
    sourcemap: true,
    cssCodeSplit: false,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  esbuild: {
    jsx: 'react-jsx',
    jsxImportSource: 'react',
  },
  server: { hmr: false },
});
