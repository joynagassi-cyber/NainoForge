#!/usr/bin/env node
/**
 * Build NainoForge - Version Simplifiée
 * Utilise esbuild pour compiler le code
 */

const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");

async function build() {
  console.log("🚀 Build NainoForge...\n");

  const DIST_DIR = "./dist/popup";
  const SRC_DIR = "./src";

  // Nettoyer
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(DIST_DIR, { recursive: true });
  console.log(`📁 Créé: ${DIST_DIR}\n`);

  // Copier les fichiers déjà compilés
  console.log("📋 Copie des fichiers existants...");
  const existingFiles = [
    "src/background.js",
    "src/content.js",
    "src/forge-badge.js",
    "src/offscreen/offscreen.js",
    "src/offscreen/pdf.js",
    "src/sidepanel/sidepanel.js"
  ];

  for (const file of existingFiles) {
    if (fs.existsSync(file)) {
      const destPath = path.join(DIST_DIR, path.basename(file));
      fs.copyFileSync(file, destPath);
      console.log(`  ✓ ${path.basename(file)}`);
    }
  }

  // Compiler les fichiers TSX avec esbuild
  console.log("\n📦 Compilation des fichiers TypeScript...");

  try {
    await esbuild.build({
      entryPoints: [path.join(SRC_DIR, "main.tsx")],
      bundle: true,
      outdir: DIST_DIR,
      outExtension: { ".js": ".js" },
      format: "esm",
      target: "chrome109",
      platform: "browser",
      minify: false,
      sourcemap: true,
      jsx: "transform",
      jsxImportSource: "react",
      // Configurer les extensions de résolution
      resolveExtensions: [".tsx", ".ts", ".jsx", ".js", ".mjs", ".cjs"],
      // Configuration des loaders
      loader: {
        ".tsx": "tsx",
        ".ts": "ts",
        ".jsx": "jsx",
        ".js": "jsx",
        ".mjs": "js",
        ".cjs": "js",
      },
      // Configuration des chemins
      absWorkingDir: process.cwd(),
      // Options de building
      logLevel: "error",
      keepNames: true,
      // Alias pour les imports
      alias: {
        // Mapping pour les imports relatifs
      },
    });
    console.log("  ✓ main.tsx compilé");
  } catch (error) {
    console.error("❌ Erreur de compilation:", error.message);
    process.exit(1);
  }

  // Copier manifest.json
  if (fs.existsSync("manifest.json")) {
    const manifest = fs.readFileSync("manifest.json", "utf-8");
    fs.writeFileSync(path.join(DIST_DIR, "manifest.json"), manifest);
    console.log("  ✓ manifest.json");
  }

  // Copier index.html
  const srcHtml = path.join(SRC_DIR, "index.html");
  const destHtml = path.join(DIST_DIR, "index.html");
  if (fs.existsSync(srcHtml)) {
    let html = fs.readFileSync(srcHtml, "utf-8");
    html = html.replace(/src="\/src\/main\.tsx"/, 'src="/main.js"');
    fs.writeFileSync(destHtml, html);
    console.log("  ✓ index.html");
  }

  // Copier appMode.html
  const srcAppMode = path.join(SRC_DIR, "appMode.html");
  const destAppMode = path.join(DIST_DIR, "appMode.html");
  if (fs.existsSync(srcAppMode)) {
    fs.copyFileSync(srcAppMode, destAppMode);
    console.log("  ✓ appMode.html");
  }

  console.log(`\n✅ Build terminé!`);
  console.log(`📁 Dossier: ${path.resolve(DIST_DIR)}`);
  console.log("\n📌 Pour tester dans Chrome:");
  console.log("   1. chrome://extensions/");
  console.log("   2. Mode développeur → Activer");
  console.log("   3. 'Charger l'extension non packagée'");
  console.log(`   4. Sélectionner: ${path.resolve(DIST_DIR)}`);
}

build().catch(console.error);
