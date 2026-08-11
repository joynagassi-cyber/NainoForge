# NainoForge

> **L'atelier du forgeur** — Extension de productivité pour étudiants, créateurs et professionnels.

NainoForge est une suite d'outils intégrée dans votre navigateur qui transforme votre espace de travail digital en un atelier de création assistée par IA. Construite comme une extension Chrome/Edge/Firefox/Safari, elle offre quatre surfaces principales :

- **Accueil** — Vue d'ensemble et navigation rapide
- **Révision** — Évaluation et amélioration de documents
- **COSMOS** — Visualisation conceptuelle en graphe interactif
- **IMPRINT** — Identité numérique et empreinte professionnelle
- **Student AI** — Assistant IA dédié aux étudiants

## 🚀 Démarrage rapide

```bash
# Installer les dépendances
pnpm install

# Lancer le développement
pnpm dev

# Builder pour production
pnpm build
```

## 📁 Architecture

```
packages/
├── extension/       # Extension navigateur (React + TypeScript)
│   ├── src/
│   │   ├── components/   # Composants UI (Home, Review, COSMOS, Imprint, StudentAI)
│   │   ├── lib/          # Utilitaires (design system, hooks, IndexedDB)
│   │   └── App.tsx       # Routing principal
│   └── manifest.json    # Manifest V3
├── docs/           # Documentation interne
└── graphify-out/   # Output de visualisation
```

## 🛠 Technologies

| Couche | Stack |
|--------|-------|
| Frontend | React 19 · TypeScript · Tailwind CSS |
| Graphes | React Flow 12 |
| Persistance | IndexedDB (COSMOS) |
| Build | Vite · pnpm workspaces |
| Cible | Chrome / Edge / Firefox / Safari |

## 📖 Documentation

- [UX Roadmap](./docs/UX-ROADMAP.md) — Feuille de route design
- [CI/CD](./docs/ci.md) — Pipeline de build et déploiement
- [InsForge SDK](https://docs.insforge.app) — Intégration backend (base de données, auth, storage)

## 🎯 Features

### COSMOS
Graphe conceptuel interactif avec persistance IndexedDB. Visualisez vos idées, dépendances et relations.

### Review Surface
Système de révision de documents avec scoring automatique et suggestions IA.

### Imprint
Gérez votre identité numérique et votre empreinte professionnelle en ligne.

### Student AI
Assistant IA spécialisé pour les étudiants — aide aux devoirs, résumés, explications.

## 📦 Build & Deployment

```bash
# Build toutes les extensions
pnpm build

# Build extension spécifique
cd packages/extension && pnpm build

# Lint & check
pnpm lint
pnpm typecheck
```

## 🤝 Contribuer

1. Fork le repository
2. Créer une branche (`git checkout -b feature/ma-feature`)
3. Committer (`git commit -am 'feat: ajouter ma feature'`)
4. Push (`git push origin feature/ma-feature`)
5. Ouvrir une Pull Request

## 📄 License

MIT — [joynagassi-cyber](https://github.com/joynagassi-cyber)
