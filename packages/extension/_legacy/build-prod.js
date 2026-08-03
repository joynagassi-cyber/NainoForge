#!/usr/bin/env node
/**
 * Build Production NainoForge - Version Simplifiée
 */

const fs = require("fs");
const path = require("path");

const DIST_DIR = "./dist/popup";

console.log("🚀 Build Production NainoForge...\n");

// Nettoyer et créer
if (fs.existsSync(DIST_DIR)) {
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
}
fs.mkdirSync(DIST_DIR, { recursive: true });
console.log(`📁 Créé: ${DIST_DIR}\n`);

// Copier les fichiers essentiels
function copyFile(src, dest) {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(DIST_DIR, dest || path.basename(src)));
    console.log(`✓ ${dest || path.basename(src)}`);
  }
}

console.log("📋 Copie des fichiers...");

// Fichiers JS déjà compilés
const jsFiles = [
  "background.js", "content.js", "forge-badge.js",
  "offscreen.js", "pdf.js", "sidepanel.js"
];
for (const file of jsFiles) {
  copyFile(file);
}

// Manifest
copyFile("manifest.json", "manifest.json");

// HTML
copyFile("src/index.html", "index.html");
copyFile("src/appMode.html", "appMode.html");

console.log("\n✅ Build terminé!");
console.log(`📁 Dossier: ${path.resolve(DIST_DIR)}`);
console.log("\n📌 Pour tester dans Chrome:");
console.log("   1. chrome://extensions/");
console.log("   2. Mode développeur → Activer");
console.log("   3. 'Charger l'extension non packagée'");
console.log(`   4. Sélectionner: ${path.resolve(DIST_DIR)}`);

