import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
    plugins: [react(), tailwindcss()],
    css: {
        // Disable PostCSS for this build — the root postcss.config.js uses
        // Tailwind v3 syntax which conflicts with @tailwindcss/vite (v4).
        postcss: { plugins: [] },
    },
    build: {
        outDir: "dist/popup",
        emptyOutDir: false, // let the build script handle cleanup order
        rollupOptions: {
            input: {
                // Bundle main.tsx as a JS entry; Vite will auto-generate the
                // HTML with the correct hashed script tag.
                popup: resolve(__dirname, "src/main.tsx"),
            },
            output: {
                entryFileNames: "assets/[name]-[hash].js",
                chunkFileNames: "assets/[name]-[hash].js",
                assetFileNames: "assets/[name]-[hash].[ext]",
            },
        },
        target: "chrome109",
        minify: false,
        sourcemap: true,
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
        dedupe: ['react', 'react-dom'],
    },
    esbuild: {
        jsx: "react-jsx",
        jsxImportSource: "react",
    },
    server: {
        port: 3001,
        strictPort: true,
        hmr: false,
    },
    experimental: {
        rollupInteractive: true,
    },
});
//# sourceMappingURL=vite.config.js.map