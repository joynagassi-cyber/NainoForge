const fs = require('fs');
const path = require('path');

const root = __dirname;

function write(file, content) {
    const fullPath = path.join(root, file);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
}

// package.json
write('package.json', JSON.stringify({
  "name": "nainoforge-monorepo",
  "private": true,
  "scripts": {
    "build": "pnpm -r run build",
    "lint": "eslint . --ext .ts,.tsx",
    "typecheck": "tsc --build tsconfig.json"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "eslint": "^8.57.0",
    "@typescript-eslint/parser": "^7.0.0",
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "prettier": "^3.2.0"
  }
}, null, 2));

// pnpm-workspace.yaml
write('pnpm-workspace.yaml', `
packages:
  - 'packages/*'
`);

// tsconfig.base.json
write('tsconfig.base.json', JSON.stringify({
  "compilerOptions": {
    "target": "ESNext",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "declaration": true,
    "composite": true,
    "sourceMap": true
  }
}, null, 2));

// tsconfig.json (root)
const packages = [
  'core', 'shared', 'ai', 'imprint', 'fsrs', 'student-ai', 
  'cosmos', 'vector', 'bundle', 'extract', 'api', 'extension'
];

write('tsconfig.json', JSON.stringify({
  "files": [],
  "references": packages.map(pkg => ({ path: `./packages/${pkg}` }))
}, null, 2));

// .eslintrc.cjs
write('.eslintrc.cjs', `
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  env: {
    browser: true,
    node: true,
    es2024: true
  },
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
  },
  ignorePatterns: ['dist', 'node_modules']
};
`);

// .prettierrc
write('.prettierrc', JSON.stringify({
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}, null, 2));

// .gitignore
write('.gitignore', `
node_modules/
dist/
.env
*.wasm
.DS_Store
`);

// Generic packages
packages.forEach(pkg => {
  if (pkg === 'extension') return; // handled separately

  write(`packages/${pkg}/package.json`, JSON.stringify({
    "name": `@nainoforge/${pkg}`,
    "version": "0.1.0",
    "main": "dist/index.js",
    "types": "dist/index.d.ts",
    "scripts": {
      "build": "tsc",
      "typecheck": "tsc --noEmit"
    },
    "dependencies": {},
    "devDependencies": {}
  }, null, 2));

  write(`packages/${pkg}/tsconfig.json`, JSON.stringify({
    "extends": "../../tsconfig.base.json",
    "compilerOptions": {
      "outDir": "./dist",
      "rootDir": "./src"
    },
    "include": ["src/**/*"]
  }, null, 2));

  let indexContent = '// TODO: stub';
  if (pkg === 'core') {
    indexContent = 'export type TODO = any;\n';
  } else if (pkg === 'shared') {
    indexContent = 'export class EventBus {}\nexport const uuidv7 = () => "uuid";\n';
  }
  
  write(`packages/${pkg}/src/index.ts`, indexContent);
});

// Extension package
const extPkg = 'extension';
write(`packages/${extPkg}/package.json`, JSON.stringify({
  "name": `@nainoforge/${extPkg}`,
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "build": "tsc",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@nainoforge/core": "workspace:*",
    "@nainoforge/shared": "workspace:*"
  },
  "devDependencies": {
    "@types/chrome": "^0.0.268"
  }
}, null, 2));

write(`packages/${extPkg}/tsconfig.json`, JSON.stringify({
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "references": [
    { "path": "../core" },
    { "path": "../shared" }
  ]
}, null, 2));

write(`packages/${extPkg}/manifest.json`, JSON.stringify({
  "manifest_version": 3,
  "name": "NainoForge",
  "version": "0.1.0",
  "description": "Forge cognitive et répétition espacée",
  "permissions": [
    "activeTab",
    "sidePanel",
    "storage",
    "offscreen"
  ],
  "background": {
    "service_worker": "dist/background.js",
    "type": "module"
  },
  "content_scripts": [
    {
      "matches": ["*://*.youtube.com/*", "<all_urls>"],
      "js": ["dist/content.js"]
    }
  ],
  "side_panel": {
    "default_path": "src/sidepanel/sidepanel.html"
  }
}, null, 2));

write(`packages/${extPkg}/src/background.ts`, `console.log('NainoForge Background Service Worker initialized.');`);
write(`packages/${extPkg}/src/content.ts`, `console.log('NainoForge Content Script injected.');`);

write(`packages/${extPkg}/src/sidepanel/sidepanel.html`, `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>NainoForge</title>
</head>
<body>
  <h1>NainoForge</h1>
  <script type="module" src="../../dist/sidepanel/sidepanel.js"></script>
</body>
</html>`);
write(`packages/${extPkg}/src/sidepanel/sidepanel.ts`, `console.log('Side panel loaded');`);

write(`packages/${extPkg}/src/offscreen/offscreen.html`, `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body>
  <script type="module" src="../../dist/offscreen/offscreen.js"></script>
</body>
</html>`);
write(`packages/${extPkg}/src/offscreen/offscreen.ts`, `console.log('Offscreen document loaded');`);

console.log('Scaffolding complete.');
