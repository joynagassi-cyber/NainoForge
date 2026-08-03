#!/usr/bin/env node
/**
 * Script de build final pour NainoForge
 * Compile TypeScript puis prépare le package Chrome
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const SRC_DIR = "src";
const DIST_DIR = "./dist/popup";

console.log("🚀 Build Final NainoForge...\n");

// Nettoyer
if (fs.existsSync(DIST_DIR)) {
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
}

console.log("📦 Compilation TypeScript...");

// Compiler avec tsc
try {
  execSync(`npx tsc --module ESNext --target ES2020 --outDir "${DIST_DIR}/src" --jsx react-jsx --skipLibCheck --esModuleInterop`, {
    stdio: "inherit"
  });
  console.log("✓ TypeScript compilé\n");
} catch (error) {
  console.error("⚠️ Compilation TypeScript partiellement échouée, continuation...");
}

console.log("📋 Préparation du package Chrome...");

// Mettre à jour manifest pour pointer vers les fichiers JS
let manifestContent = fs.readFileSync("manifest.json", "utf-8");
let updatedManifest = manifestContent
  .replace(/"service_worker":\s*"[^"]+"/g, '"service_worker": "src/background.js"')
  .replace(/"default_path":\s*"src\/sidepanel\/sidepanel.html"/g, '"default_path": "src/sidepanel/sidepanel.html"')
  .replace(/"js":\s*\[\s*"dist\/content\.js"\s*\]/g, '"js": ["src/content.js"]');

fs.writeFileSync(path.join(DIST_DIR, "manifest.json"), updatedManifest);
console.log("✓ Manifest mis à jour");

// Copier index.html si présent
const srcIndexPath = path.join(SRC_DIR, "index.html");
const indexPath = path.join(DIST_DIR, "src", "index.html");
if (fs.existsSync(srcIndexPath)) {
  fs.mkdirSync(path.dirname(indexPath), { recursive: true });
  fs.copyFileSync(srcIndexPath, indexPath);
  console.log("✓ index.html copié");
}

// Copier appMode.html
const appModeSrc = path.join(SRC_DIR, "appMode.html");
const appModeDest = path.join(DIST_DIR, "src", "appMode.html");
if (fs.existsSync(appModeSrc)) {
  fs.mkdirSync(path.dirname(appModeDest), { recursive: true });
  fs.copyFileSync(appModeSrc, appModeDest);
  console.log("✓ appMode.html copié");
}

// Copier les fichiers statiques restants
if (fs.existsSync(path.join(SRC_DIR, "styles"))) {
  copyDirectory(path.join(SRC_DIR, "styles"), path.join(DIST_DIR, "src", "styles"));
}

console.log("\n✅ Build terminé!");
console.log(`\n📁 Dossier de l'extension: ${path.resolve(DIST_DIR)}`);
console.log("\n📌 Pour tester dans Chrome:");
console.log("   1. chrome://extensions/");
console.log("   2. Activer 'Mode développeur'");
console.log("   3. 'Charger l'extension non packagée'");
console.log("   4. Sélectionner: " + path.resolve(DIST_DIR));

function copyDirectory(src, dest) {
  if (fs.existsSync(src)) {
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });
    entries.forEach(entry => {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        copyDirectory(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    });
  }
}
