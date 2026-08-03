#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');

function runVite(config) {
  console.log(`\n📦 Building ${config}...`);
  execSync(`pnpx vite build --config ${config}`, { stdio: 'inherit', cwd: ROOT });
  console.log('  ✓ Done');
}

console.log('🧹 Cleaning dist...');
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST);

runVite('vite-bg.config.mjs');
runVite('vite-content.config.mjs');
runVite('vite.config.ts');

const manifest = {
  manifest_version: 3,
  name: "NainoForge",
  version: "0.1.0",
  description: "Forge cognitive et répétition espacée",
  permissions: ["activeTab", "sidePanel", "storage", "offscreen"],
  action: {
    default_title: "NainoForge — Ouvrir le side panel",
    default_icon: {
      16: "icons/icon-16.png",
      24: "icons/icon-24.png",
      32: "icons/icon-32.png",
      48: "icons/icon-48.png"
    }
  },
  background: { service_worker: "background.js", type: "module" },
  content_scripts: [{ matches: ["*://*.youtube.com/*", "<all_urls>"], js: ["content.js"] }],
  side_panel: { default_path: "popup/index.html?mode=sidebar" },
  icons: {
    16: "icons/icon-16.png",
    48: "icons/icon-48.png",
    128: "icons/icon-128.png",
    256: "icons/icon-256.png",
    512: "icons/icon-512.png"
  }
};

fs.writeFileSync(path.join(DIST, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');

// Copy icons from public/icons
const srcIcons = path.join(ROOT, 'public', 'icons');
const destIcons = path.join(DIST, 'icons');
[16, 48, 128].forEach(sz => {
  const src = path.join(srcIcons, `icon-${sz}.png`);
  const dst = path.join(destIcons, `icon-${sz}.png`);
  if (fs.existsSync(src)) fs.copyFileSync(src, dst);
});

// Copy action icons (light/dark)
const actionSrc = path.join(ROOT, 'icons', 'action');
const actionDest = path.join(DIST, 'icons', 'action');
fs.readdirSync(actionSrc).forEach(dirName => {
  const dir = path.join(actionSrc, dirName);
  if (!fs.stat(dir).isDirectory()) return;
  fs.mkdirSync(path.join(actionDest, dirName), { recursive: true });
  fs.readdirSync(dir).forEach(f => {
    if (f.endsWith('.png')) {
      fs.copyFileSync(path.join(dir, f), path.join(actionDest, dirName, f));
    }
  });
});

console.log('\n✅ Build completed! Output: ' + DIST);
