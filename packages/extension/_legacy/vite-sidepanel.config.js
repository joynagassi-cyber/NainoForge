import { defineConfig } from "vite";
// Build config for the side panel entry
export default defineConfig({
    build: {
        outDir: "dist/sidepanel",
        emptyOutDir: true,
        rollupOptions: {
            input: "sidepanel/sidepanel.html",
            output: {
                entryFileNames: "assets/[name]-[hash].js",
                chunkFileNames: "assets/[name]-[hash].js",
                assetFileNames: "assets/[name]-[hash].[ext]",
            },
        },
    },
    resolve: {
        alias: {
            '@': '/src',
        },
        dedupe: ['react', 'react-dom'],
    },
    esbuild: {
        jsx: "react-jsx",
        jsxImportSource: "react",
    },
});
//# sourceMappingURL=vite-sidepanel.config.js.map