# NainoForge — Veille & stack recommandée

## 1\. Résumé exécutif
NainoForge, tel que décrit dans le PRD enrichi fourni en pièce jointe, vise une ambition claire : transformer une simple capture de contenu en **forge cognitive réelle**. Le produit n’est pas une extension de prise de notes ; c’est une **Chrome Extension d’apprentissage actif**, centrée sur IMPRINT, FSRS, Student AI, COSMOS, la confidentialité des documents privés et une logique offline-first.

Les priorités dominantes qui ressortent du PRD sont :
*   **rigueur cognitive** avant l’effet gadget ;
*   **confidentialité forte** pour les contenus privés ;
*   **faible coût d’infrastructure** sur les briques cœur ;
*   **rapidité de livraison MVP** sans casser la trajectoire long terme vers SCYForge ;
*   **architecture modulaire** pour pouvoir faire évoluer les moteurs sans réécrire tout le produit.
*   /
### Recommandation synthétique
Je recommande un **socle pragmatique hybride** :
*   **Extension** : WXT + React + TypeScript + Tailwind + shadcn/ui
*   **Stockage local** : Dexie/IndexedDB comme source de vérité du client
*   **Moteur offline critique** : FSRS en Rust/WASM
*   **Backend MVP** : Supabase (Auth + Postgres + Edge Functions + Storage)
*   **IA** : architecture duale
    *   cloud pour les sources publiques et les traitements où la qualité prime,
    *   local dans le navigateur pour les contenus privés et certaines tâches d’embedding/extraction
*   **Vecteurs** : pas de grosse vector DB dédiée au MVP ; `pgvector` seulement pour les cas cloud/publics utiles
*   **Observabilité IA** : Langfuse self-host ou cloud selon phase
*   **CI/CD** : GitHub Actions + environnements dev/stage/prod
### 5 décisions techniques clés
1. **Ne pas faire un backend full Rust dès le MVP** : garder Rust là où il crée un vrai avantage (FSRS/WASM, éventuellement extracteurs), mais utiliser Supabase/TypeScript pour livrer plus vite.
2. **Faire du local-first réel** : IndexedDB n’est pas un cache, c’est la base primaire côté extension.
3. **Traiter la confidentialité par chemins distincts** : public, personnel, entreprise ne doivent pas passer dans la même pipeline IA.
4. **Garder le “moteur cognitif” modulaire** : events + contrats + modules isolés, pour préparer l’absorption future dans SCYForge.
5. **Être prudent sur l’IA locale** : embeddings locaux oui, petits modèles locaux ciblés oui ; LLM local généralisé seulement comme option expérimentale.
### Équilibre prudence / innovation
*   **Prudence** : WXT/React/TypeScript, Dexie, Supabase, Postgres, GitHub Actions, Langfuse.
*   **Innovation maîtrisée** : FSRS en WASM, pipeline local pour documents privés, dual-path IA cloud/local, event-driven modulaire.
*   **Exploratoire** : WebLLM pour certaines fonctions privées avancées, moteur d’extraction plus ambitieux en WASM, graphes conceptuels plus riches dans COSMOS.

* * *
## 2\. Stack recommandée
### Vue d’ensemble compacte

| Couche | Recommandation | Pourquoi |
| ---| ---| --- |
| Extension shell | WXT + React + TypeScript | DX rapide, MV3 propre, trajectoire multi-browser possible |
| UI | Tailwind CSS + shadcn/ui + Radix primitives | vitesse, cohérence, composants accessibles |
| État client | Zustand + Zod | simple, léger, typé |
| Persistance locale | Dexie sur IndexedDB | vrai offline-first, transactions, migrations |
| Moteur FSRS | Rust + WASM | performance, coût infra nul, offline complet |
| Backend MVP | Supabase Edge Functions + Postgres | vitesse de mise en marché, auth/storage/RLS intégrés |
| Sync distante | Supabase Postgres + RLS | sync sélective, posture startup réaliste |
| Auth | Supabase Auth | simple à intégrer avec extension + backend |
| Fichiers | Bundle local + Supabase Storage pour artefacts non sensibles | respecte la séparation privé/public |
| IA publique | Provider API abstrait (Anthropic/OpenAI ou équivalent) | meilleure qualité pour résumés/teach-back publics |
| IA privée locale | Transformers.js pour embeddings/extraction légère | compatible navigateur, privacy-first |
| IA privée avancée | WebLLM en mode optionnel/bêta | intéressant mais trop dépendant du hardware pour devenir la base MVP |
| Vecteurs cloud | pgvector | le plus simple si Postgres est déjà là |
| Observabilité produit | Sentry ou alternative équivalente | maturité élevée côté extension runtime |
| Observabilité IA | Langfuse | open source, prompts/evals/traces |
| Analytics produit | PostHog (ou alternative simple) | usage, funnel, rétention |
| CI/CD | GitHub Actions | standard, économique, souple |
| Design | Figma | adoption, vitesse, collaboration |
| Documentation | ClickUp Docs + ADRs Markdown | aligné avec le workspace existant |

### Ce qui est core & stable
*   modèle local-first basé sur IndexedDB ;
*   FSRS en local/WASM ;
*   séparation stricte public / privé / entreprise ;
*   backend Postgres + auth + fonctions ;
*   architecture modulaire par événements.
### Ce qui est expérimental ou facilement remplaçable
*   WebLLM local ;
*   choix exact du provider LLM cloud ;
*   niveau de sophistication de COSMOS ;
*   stratégie vectorielle avancée ;
*   moteur d’extraction documentaire avancé au-delà du MVP.

* * *
## 3\. Détail par couche
### 3.1 Produit & contraintes lues dans le PRD
À partir du document fourni, je retiens les **contraintes dures** suivantes :
*   produit prioritairement pensé comme **Chrome Extension** ;
*   **documents privés ne doivent pas quitter la machine** ;
*   **FSRS doit fonctionner offline**, idéalement sans coût serveur ;
*   l’état du produit doit être **réimportable** via bundle ;
*   l’architecture doit rester **préparable à une intégration future dans SCYForge**.

**Préférences explicites ou implicites** :
*   architecture modulaire / event-driven ;
*   monorepo ;
*   goût pour Rust/WASM ;
*   priorité à la qualité cognitive plutôt qu’à la pure simplicité UX ;
*   préférence implicite pour des briques open source et contrôlables.

**Zones ouvertes** :
*   volume cible d’utilisateurs à 12–24 mois ;
*   besoin réel de sync multi-device dès MVP ;
*   budget API IA ;
*   niveau d’exigence mobile / cross-browser ;
*   niveau de sophistication attendu pour les graphes COSMOS au lancement.

* * *
### 3.2 Frontend / Extension
#### Recommandation
**WXT + React + TypeScript** pour la structure d’extension, avec :
*   **Side Panel** comme surface principale ;
*   **content scripts** pour la capture sur pages web / YouTube ;
*   **service worker MV3** pour orchestration, alarms, sync, notifications ;
*   **offscreen document** uniquement quand nécessaire pour certains traitements spécifiques.
#### Pourquoi ce choix
WXT est aujourd’hui un très bon compromis entre productivité, contrôle et trajectoire multi-browser. Il évite une partie de la friction Manifest V3 tout en restant plus “sobre” qu’une abstraction très magique. Pour un produit qui devra probablement évoluer vite, le couple **WXT + React + TypeScript** est plus prudent qu’un setup trop custom, et plus flexible qu’un framework qui cache trop le runtime extension.

La recherche web confirme des points utiles :
*   WXT met l’accent sur MV3, TypeScript et un DX rapide ([wxt.dev](https://wxt.dev/)).
*   L’API Side Panel de Chrome en fait une surface naturelle pour une extension de travail cognitif persistant ([](https://developer.chrome.com/docs/extensions/reference/api/sidePanel)).
*   MV3 impose un service worker éphémère, donc il ne faut **jamais** faire reposer l’état critique sur la mémoire du worker ([](https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/lifecycle)).
#### UI recommandée
*   **Tailwind CSS** pour itérer vite ;
*   **shadcn/ui** + primitives Radix pour composants accessibles ;
*   **Zustand** pour l’état UI court terme ;
*   **Zod** pour valider les contrats front/back et front/local.
#### Alternative sérieuse
**Plasmo** est une alternative crédible si la priorité absolue est la rapidité d’onboarding sur extension. Avantage : beaucoup d’abstractions prêtes. Inconvénient : moins de contrôle fin à long terme, et une sensation parfois plus “framework enfermant”.
#### Risque fort
Le vrai risque n’est pas le framework UI ; c’est la **mauvaise compréhension de MV3**. Si le produit suppose un worker quasi permanent, l’architecture souffrira. Il faut donc designer en assumant que le worker meurt souvent.

* * *
### 3.3 Stockage local & offline-first
#### Recommandation
Faire de **Dexie/IndexedDB** la **source de vérité locale** pour :
*   sources capturées ;
*   notes IMPRINT ;
*   cartes ;
*   événements de review ;
*   état COSMOS ;
*   files d’attente de sync ;
*   préférences locales ;
*   embeddings locaux si activés.
#### Pourquoi ce choix
Le PRD veut un vrai comportement offline, pas un simple mode dégradé. Dexie est un excellent choix pour rendre IndexedDB exploitable proprement : schéma déclaratif, transactions, migrations, requêtes plus lisibles. C’est beaucoup plus réaliste qu’un bricolage direct IndexedDB natif pour un produit qui va vite grossir.

Veille utile :
*   Dexie est spécifiquement pensé pour simplifier IndexedDB, avec schémas et transactions ([Dexie docs](https://dexie.org/docs/)).
*   En MV3, IndexedDB est accessible depuis le service worker, mais il faut penser persistance et reprise propre, car le worker s’arrête fréquemment ([](https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/lifecycle)).
#### Décision d’architecture clé
**Le local doit être le primaire, le cloud le secondaire.**

Autrement dit :
*   l’utilisateur forge localement ;
*   les review events s’enregistrent localement immédiatement ;
*   la sync est asynchrone et rattrapable ;
*   le produit reste utile sans réseau.
#### Alternative
`chrome.storage.local` ou un stockage plus simple peut suffire pour un petit prototype, mais devient vite insuffisant pour un produit avec historique, graphes, bundles et index locaux. Je ne le recommande pas comme base.

* * *
### 3.4 Backend / API
#### Recommandation
Pour le MVP : **Supabase Edge Functions + Postgres + Auth + Storage**.
#### Pourquoi ce choix
Le PRD imagine une architecture Rust hexagonale complète. C’est cohérent intellectuellement, mais trop ambitieux comme base MVP si l’objectif est de sortir vite une extension crédible. En revanche, **Supabase** couvre rapidement les besoins suivants :
*   authentification ;
*   base Postgres ;
*   fonctions serveur ;
*   stockage ;
*   RLS pour sécuriser les données ;
*   vitesse de mise en place.

La documentation officielle confirme l’intégration native Edge Functions / Auth / Storage ([](https://supabase.com/docs/guides/functions)).
#### Recommandation d’équilibre
*   **Backend produit / sync / auth / admin** : TypeScript sur Edge Functions.
*   **Moteurs algorithmiques critiques** : Rust/WASM ou modules isolés.

C’est le bon équilibre entre prudence et vision long terme.
#### Quand passer à plus “bas niveau”
Un backend Rust plus massif devient pertinent si :
*   la charge serveur IA augmente fortement ;
*   vous devez exécuter beaucoup de pipelines cognitifs côté serveur ;
*   vous voulez un contrôle maximal de perf/coût ;
*   vous transformez NainoForge en plateforme plus large.
#### Alternative
*   **Cloudflare Workers + D1/R2** : très intéressant si vous voulez full edge/open-ish et distribution mondiale. Mais l’écosystème Postgres/Auth de Supabase est plus simple pour un fondateur qui doit livrer vite.
*   **Full Rust backend dès le départ** : plus élégant, moins rapide à exécuter côté business.

* * *
### 3.5 Moteur FSRS
#### Recommandation
Garder l’idée du PRD : **FSRS en Rust compilé en WASM**.
#### Pourquoi ce choix
Ici, le PRD est juste. C’est une brique à haute valeur et faible ambiguïté :
*   besoin offline natif ;
*   coût infra nul ;
*   calcul déterministe ;
*   bonne séparation moteur / UI.

La veille confirme :
*   FSRS a un écosystème actif et multi-langage ([Open Spaced Repetition](https://open-spaced-repetition.github.io/)).
*   Le crate Rust `fsrs` est une base crédible pour porter ce moteur dans le navigateur ([docs.rs/fsrs](https://docs.rs/fsrs/latest/fsrs/)).
#### Bon design
Le moteur FSRS doit rester :
*   **purement fonctionnel** autant que possible ;
*   indépendant du stockage ;
*   indépendant de l’UI ;
*   consommé via une couche d’adaptation JS/TS.
#### Alternative
Faire tout FSRS en TypeScript/JavaScript est plus simple au début, mais offre moins de garanties de robustesse/performance si le moteur devient plus riche. Pour cette brique précise, Rust/WASM est un bon pari.

* * *
### 3.6 IA : cloud, local et confidentialité
#### Recommandation centrale
Mettre en place **deux chemins IA explicites** :

1. **Chemin public / cloud**
    *   sources publiques ;
    *   meilleurs modèles API pour qualité de résumé / synthèse / teach-back ;
    *   embeddings cloud possibles.
2. **Chemin privé / local**
    *   documents personnels / entreprise ;
    *   contenu jamais envoyé ;
    *   embeddings et certains traitements faits localement ;
    *   LLM local avancé seulement si le device le supporte.
#### Stack IA recommandée
**Pour local léger et robuste** :
*   **Transformers.js** pour embeddings, classification, extraction légère, modèles ONNX/WebGPU lorsque possible ([](https://huggingface.co/docs/transformers.js/main/en/index)).

**Pour local avancé mais optionnel** :
*   **WebLLM** pour certains cas de génération/explication locale sur machines compatibles WebGPU ([WebLLM docs](https://www.webllm.org/docs)).

**Pour cloud** :
*   une **couche provider-agnostic** côté serveur pour pouvoir brancher Anthropic, OpenAI ou un autre provider sans verrou fort.
#### Pourquoi cette approche
Le PRD veut une confidentialité forte sur les documents privés. Cela impose de ne pas dépendre exclusivement d’un LLM cloud. Mais il serait risqué de faire reposer toute l’expérience produit sur du LLM local navigateur : la compatibilité hardware, la consommation mémoire et l’expérience utilisateur seraient trop variables.

Donc :
*   **embeddings locaux** : oui, recommandé ;
*   **petits traitements locaux ciblés** : oui ;
*   **génération locale lourde par défaut** : non au MVP.
#### Alternative
*   **Tout cloud** : plus simple, mais incompatible avec la promesse forte “les docs privés ne quittent jamais la machine”.
*   **Tout local** : cohérent idéologiquement, mais trop risqué pour la qualité et la compatibilité MVP.
#### Risque fort
Le plus grand risque ici est de promettre trop tôt une “IA privée locale” indistinguable d’une API cloud haut de gamme. Mieux vaut segmenter clairement les modes d’usage.

* * *
### 3.7 Data, sync et vecteurs
#### Recommandation
Utiliser une architecture de données en 3 étages :

1. **Local canonique** : Dexie/IndexedDB
2. **Cloud transactionnel** : Postgres Supabase
3. **Vecteurs cloud limités aux cas utiles** : `pgvector`
#### Pourquoi `pgvector`
Si Postgres est déjà au cœur du backend, `pgvector` est le choix le plus sobre : même base, même sécurité, même outillage. Pour un MVP, c’est plus prudent que d’ajouter une nouvelle brique vectorielle spécialisée.

La veille suggère bien ce compromis : `pgvector` est très logique quand Postgres est déjà là, tandis que LanceDB brille davantage dans des contextes edge/embarqués ou multimodaux plus spécialisés.
#### Pourquoi ne pas mettre LanceDB au cœur du MVP
LanceDB est intéressant, surtout pour du local/embedded ou des workflows plus data-heavy. Mais pour NainoForge MVP extension-first, ce serait une couche supplémentaire à opérer, comprendre et maintenir. Je le classe comme **alternative à surveiller**, pas comme socle initial.
#### Recommandation pratique
*   **pas de vector DB séparée au MVP** si les cas d’usage sémantiques restent modestes ;
*   activer `pgvector` seulement quand les parcours le justifient ;
*   pour le privé local, privilégier une indexation locale ciblée plutôt qu’une énorme couche vectorielle complexe.

* * *
### 3.8 Event-driven / modules métier
#### Recommandation
Je valide fortement l’intuition du PRD : **couplage faible par événements**.

Concrètement :
*   capture publie `SourceCaptured` ;
*   moteur connaissance publie `ImprintValidated`, `FlashcardsGenerated` ;
*   moteur Student AI publie `TeachBackCompleted`, `MisconceptionDetected` ;
*   review engine publie `CardReviewed`, `LeechDetected`, `SMIUpdated`.
#### Pourquoi
C’est exactement ce qui permet de :
*   remplacer un moteur sans réécrire le reste ;
*   tester les composants séparément ;
*   préserver une trajectoire SCYForge ;
*   gérer des enrichissements progressifs sans effet domino.
#### Prudence
Je recommande un **event bus simple dans le client**, pas une sur-ingénierie façon microservices internes. Le piège serait de trop “architecturer” avant d’avoir le bon usage réel.

* * *
### 3.9 DevOps & livraison
#### Recommandation
*   **Monorepo** : pnpm ou Turborepo
*   **CI/CD** : GitHub Actions
*   **Environnements** : dev / stage / prod
*   **Qualité** : ESLint, Prettier, TypeScript strict, tests unitaires sur moteurs, Playwright pour flows critiques extension
*   **Releases** : packaging auto extension + versionnement sémantique
#### Pourquoi
C’est la pile la plus pragmatique pour garder de la vitesse sans perdre la maîtrise.
#### À automatiser tôt
*   build extension ;
*   tests de régression sur flows capture → imprint → cards → review ;
*   migrations IndexedDB et Postgres ;
*   validation bundle import/export ;
*   smoke tests sur sync.

* * *
### 3.10 Observabilité & monitoring
#### Recommandation
Séparer 3 besoins :

1. **erreurs produit extension** : Sentry ou équivalent mature
2. **observabilité IA / prompts / evals** : Langfuse
3. **analytics produit** : PostHog ou analytics léger équivalent
#### Pourquoi
*   OpenTelemetry JS côté browser reste encore partiellement expérimental pour certains usages browser/instrumentation avancés ([](https://opentelemetry.io/docs/languages/js/)).
*   Langfuse a une posture open source/self-host utile pour un produit IA qui va itérer sur prompts et analyses ([Langfuse self-hosting](https://langfuse.com/self-hosting)).
#### Lecture architecturale
Ne mélange pas “observabilité LLM” et “monitoring produit”. Ce sont deux problèmes différents.

* * *
### 3.11 Sécurité & confidentialité
#### Recommandation
Appliquer une politique claire, techniquement enforceable :
*   **Public** : cloud autorisé
*   **Personnel** : local-only par défaut
*   **Entreprise** : local-only + chiffrement bundle + logs minimaux
#### Décisions importantes
*   chiffrement des bundles sensibles ;
*   journal d’audit minimal des exports/imports ;
*   opt-in clair si un traitement quitte la machine ;
*   aucune ambiguïté UI sur la destination des données.
#### Risque fort
Si le produit promet “tes documents privés ne quittent jamais la machine”, il faudra être capable de le démontrer techniquement et narrativement. C’est une promesse produit majeure, pas un détail d’implémentation.

* * *
### 3.12 Design & collaboration
#### Recommandation
*   **Figma** pour design UI/flows
*   **ClickUp Docs** pour PRDs, architecture notes, ADRs
*   **Storybook** pour documenter les composants si l’UI grossit vite
#### Alternative open source
*   **Penpot** est une bonne alternative si la souveraineté outil devient un sujet.
#### Mon avis
Pour un fondateur qui veut avancer vite, Figma reste aujourd’hui le choix le plus pragmatique ; Penpot est intéressant si le critère de souveraineté devient plus fort ensuite.

* * *
## 4\. Analyse forces / faiblesses / risques
### Forces de la proposition
*   très bon alignement avec le PRD ;
*   stack cohérente avec une extension offline-first ;
*   confidentialité traitée comme contrainte d’architecture, pas comme patch ;
*   coût infra contenu grâce à FSRS local et à une vectorisation sélective ;
*   trajectoire long terme préservée grâce au découplage modulaire.
### Faiblesses / coûts cachés
*   l’IA locale fiable dans le navigateur reste limitée selon les machines ;
*   Chrome MV3 impose une vraie discipline d’architecture ;
*   sync local/cloud + bundle + offline = vraie complexité produit ;
*   COSMOS peut devenir un gros consommateur de temps produit si on le rend trop ambitieux trop tôt.
### Risques majeurs
1. **Risque de surconstruction**
    *   vouloir livrer trop de sophistication cognitive dès le MVP.
2. **Risque UX**
    *   trop de rigueur cognitive peut tuer l’usage quotidien si la friction devient trop haute.
3. **Risque IA locale**
    *   promesse privée trop ambitieuse par rapport aux capacités réelles du device.
4. **Risque sync / data integrity**
    *   bugs subtils entre local, remote, bundle, import/export, events immuables.
5. **Risque d’architecture prématurée**
    *   un backend Rust ou une surabondance de modules pourrait ralentir le produit sans gain immédiat.

* * *
## 5\. Alternatives et scénarios possibles
### Scénario A — Très prudent / MVP rapide
**Choix**
*   WXT + React + TypeScript
*   Dexie
*   Supabase
*   FSRS en TS ou WASM simple
*   IA cloud pour public
*   local privé limité à extraction + embeddings simples

**Avantages**
*   time-to-market maximal ;
*   moins de dette d’intégration ;
*   plus simple à recruter / maintenir.

**Inconvénients**
*   moins différenciant sur la promesse privacy-native ;
*   moins de profondeur architecturale pour SCYForge.

**Quand le choisir**
*   si l’objectif immédiat est de tester la traction utilisateur en quelques semaines.

* * *
### Scénario B — Recommandé / équilibre prudence-innovation
**Choix**
*   WXT + React + TypeScript
*   Dexie local-first
*   FSRS Rust/WASM
*   Supabase backend MVP
*   pipeline IA dual cloud/local
*   pgvector limité aux usages nécessaires
*   events métier découplés

**Avantages**
*   meilleur équilibre entre vitesse et fondations ;
*   respecte la vision du PRD sans tout industrialiser trop tôt ;
*   laisse une bonne option d’évolution vers SCYForge.

**Inconvénients**
*   plus complexe qu’un MVP ultra-simple ;
*   demande de la rigueur sur la data locale et les contrats.

**Quand le choisir**
*   si vous voulez un MVP sérieux, différenciant, mais encore pilotable par une petite équipe.

* * *
### Scénario C — Plus innovant / privacy-native maximaliste
**Choix**
*   forte IA locale
*   WebLLM plus central
*   extracteurs documentaires plus lourds en WASM
*   backend plus fin / éventuellement Rust plus tôt
*   vectorisation locale plus sophistiquée

**Avantages**
*   promesse privacy et autonomie produit très forte ;
*   différenciation technique importante.

**Inconvénients**
*   risque hardware/compatibilité ;
*   plus long à stabiliser ;
*   qualité d’expérience moins homogène selon les devices.

**Quand le choisir**
*   si la confidentialité locale absolue est la proposition de valeur n°1 et justifie une exécution plus difficile.

* * *
## 6\. Questions ouvertes / points à clarifier
1. **Le MVP doit-il synchroniser plusieurs devices dès le départ ?**
    *   Si non, on peut simplifier beaucoup. oUI
2. **Le mode “documents privés ne quittent jamais la machine” est-il obligatoire pour tous les plans ?**
    *   Ou seulement pour un plan premium / enterprise ? Cela est obligatoire pour les entrepsiese tpour ceux qui choissisent cela.
3. **Quel niveau de qualité est attendu pour Student AI sur contenu privé local ?**
    *   “utile mais imparfait” ou “quasi cloud-grade” ?Quasi cloud
4. **Quel est le budget mensuel cible pour l’IA cloud au MVP ?**
    *   Cela change fortement le design de certains flux.
5. **Le produit cible-t-il seulement Chrome desktop, ou Edge/Brave/Firefox ensuite ?**
    *   Cela impacte le choix des APIs et la roadmap framework.
6. **Le bundle sert-il seulement à l’export utilisateur, ou aussi à la sauvegarde / migration / backup ?**
    *   Les exigences de fiabilité changent selon la réponse.
7. **COSMOS est-il une vitrine forte du MVP ou un différenciateur V1 ?**
    *   S’il devient central trop tôt, il peut ralentir le reste.
8. **Quel est le vrai cœur d’adoption au lancement ?**
    *   IMPRINT ? Student AI ? flashcards ? graph de maîtrise ?
    *   Cette réponse doit guider la profondeur technique par module.

* * *
## Recommandation finale, en une phrase
**Je recommande de construire NainoForge comme une extension local-first sobre et très disciplinée, avec FSRS en WASM, backend Supabase pour aller vite, et une IA duale cloud/local qui respecte réellement la confidentialité — plutôt qu’un système full Rust/full local trop ambitieux dès le MVP.**

* * *
## Sources clés utilisées
### Source workspace
*   PRD fourni en pièce jointe du fil DM :
### Références de veille
*   [](https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/lifecycle)
*   [](https://developer.chrome.com/docs/extensions/reference/api/sidePanel)
*   [Dexie documentation](https://dexie.org/docs/)
*   [WXT](https://wxt.dev/)
*   [Plasmo docs](https://docs.plasmo.com/)
*   [Open Spaced Repetition / FSRS](https://open-spaced-repetition.github.io/)
*   [Rust fsrs crate](https://docs.rs/fsrs/latest/fsrs/)
*   [](https://huggingface.co/docs/transformers.js/main/en/index)
*   [WebLLM docs](https://www.webllm.org/docs)
*   [](https://supabase.com/docs/guides/functions)
*   [Langfuse self-hosting](https://langfuse.com/self-hosting)
*   [](https://opentelemetry.io/docs/languages/js/)

# NainoForge — Roadmap MVP 2 à 4 semaines

## Objectif de cette roadmap
Cette roadmap part d’un principe simple : **livrer vite le cœur différenciant**, sans essayer de construire tout SCYForge dès la V1.

Le cœur du MVP NainoForge n’est pas :
*   un graphe COSMOS ultra sophistiqué ;
*   un backend complexe ;
*   une IA locale générative parfaite.

Le cœur du MVP est :

1. **capturer une source** ;
2. **forcer un IMPRINT utile** ;
3. **générer des cartes pertinentes** ;
4. **réviser via FSRS offline** ;
5. **donner un premier feedback cognitif crédible**.

* * *
## Résultat attendu à la fin du MVP
Un utilisateur doit pouvoir :
*   capturer un contenu web ou importer un document léger ;
*   écrire un IMPRINT ;
*   obtenir un score/cran simple ;
*   générer des cartes typées ;
*   lancer une session de review ;
*   voir une progression minimale par concept ;
*   retrouver ses données localement même sans connexion ;
*   synchroniser les données non sensibles si connecté.

* * *
## Hypothèses de cadrage
### Inclus au MVP
*   Chrome desktop uniquement
*   Side panel principal
*   Sources web + YouTube transcript + Markdown/TXT/PDF léger
*   IMPRINT avec crans 1–5
*   IQS v1
*   cartes B01/B02/B04 au minimum
*   B03/B05 si le flux est stable
*   FSRS local/WASM
*   sessions Micro + Standard
*   Student AI v1 sur chemin cloud pour sources publiques
*   local-first avec Dexie
*   sync backend basique
*   bundle export v1
### Reporté post-MVP
*   graph COSMOS riche
*   contradictions multi-sources avancées
*   WebLLM central
*   mobile
*   multi-browser large
*   enterprise hardening complet
*   relations conceptuelles avancées

* * *
## Sprint 0 — 2 à 3 jours de fondation
### Objectif
Mettre en place le squelette technique pour éviter les retours en arrière coûteux.
### Livrables
*   monorepo initial
*   WXT + React + TypeScript configurés
*   Tailwind + UI kit de base
*   Dexie initialisé
*   Supabase projet dev/stage
*   pipeline CI GitHub Actions
*   contrat d’événements métier v1
*   schéma de données v1 local + remote
### Tâches clés
*   créer le monorepo (`apps/extension`, `packages/shared`, `packages/fsrs`, `packages/domain`)
*   configurer lint, format, typecheck, tests
*   définir les events métier de base
*   définir conventions de versionnement IndexedDB
*   définir stratégie secrets/env
### Critère de sortie
Un développeur peut cloner, lancer et builder l’extension sans friction.

* * *
## Semaine 1 — Capturer, forger, stocker
### Objectif produit
Avoir le **premier flux complet de forge**, même sans sophistication totale.
### Livrables produit
*   side panel fonctionnel
*   capture manuelle de source web
*   import Markdown/TXT/PDF simple
*   stockage local des sources
*   écran IMPRINT
*   calcul Cran v1
*   calcul IQS v1
*   génération de cartes minimale
*   persistance locale intégrale
### Modules à livrer
#### 1\. Capture
*   content script pour récupérer URL, titre, texte principal
*   capture YouTube transcript si disponible
*   import de fichiers simples
*   normalisation vers un format canonique
#### 2\. IMPRINT
*   éditeur de note
*   signaux Cran v1 : longueur, connecteurs, exemples, couverture de concepts-clés
*   badge utilisateur simple : légère / solide / profonde
#### 3\. Cartes
*   générateur B02 + B04 minimum
*   B01 à la première apparition du concept
*   mapping IMPRINT → cartes
#### 4\. Local-first
*   tables Dexie créées
*   queue locale de sync créée
*   récupération au redémarrage OK
### Critères de succès
*   un utilisateur peut capturer une source et produire un IMPRINT stocké localement
*   les cartes sont générées et réaffichées après reload
*   aucune dépendance serveur critique pour continuer le flux local
### Risques à surveiller
*   parsing de pages web trop fragile
*   UI IMPRINT trop complexe trop tôt
*   surqualité du scoring avant validation réelle de l’usage

* * *
## Semaine 2 — Review engine & première valeur répétable
### Objectif produit
Rendre l’expérience **répétable au quotidien**.
### Livrables produit
*   FSRS en WASM branché
*   session Micro
*   session Standard
*   review events immuables
*   scheduling local
*   leech detection v1
*   écran daily review minimal
*   post-forge snapshot
### Modules à livrer
#### 1\. FSRS
*   wrapper TS autour du module WASM
*   calcul d’intervalle après review
*   stockage `fsrs_state_before` / `fsrs_state_after`
#### 2\. Review UX
*   écran review card
*   4 ratings : again / hard / good / easy
*   feedback visuel de prochaine révision
#### 3\. Leech management v1
*   compteur de lapses
*   tag `leech`
*   suspension simple
*   CTA : refaire un IMPRINT
#### 4\. Daily routine
*   briefing simple
*   nombre de cartes dues
*   concepts bloqués / leeches
### Critères de succès
*   un utilisateur peut effectuer une session complète offline
*   la planification survit au redémarrage navigateur
*   les review events sont réutilisables pour analytics futurs
### Risques à surveiller
*   intégration WASM / extension worker
*   erreurs d’horodatage ou de timezone
*   dette technique sur les transitions d’état des cartes

* * *
## Semaine 3 — Student AI v1, sync et bundle
### Objectif produit
Ajouter la **boucle d’explication / recalibration** et la première portabilité sérieuse.
### Livrables produit
*   Student AI v1
*   confidence declared
*   coverage / coherence / depth v1
*   statut final simple : maîtrisé / partiel / lacune / IMPRINT requis
*   sync Supabase v1
*   export bundle v1
*   auth basique
### Modules à livrer
#### 1\. Student AI v1
*   appel provider cloud sur sources publiques
*   prompt structuré pour teach-back
*   extraction de signaux : couverture, cohérence, profondeur
*   retour utilisateur en 4 états
#### 2\. Sync backend
*   auth user
*   sync sélective des données non sensibles
*   politique de non-envoi pour documents privés
#### 3\. Bundle export
*   export JSON/ZIP v1
*   sources + imprints + cards + reviews
*   checksum simple
### Critères de succès
*   un utilisateur connecté peut retrouver ses données non sensibles sur un autre poste
*   un utilisateur hors ligne peut exporter son bundle
*   Student AI améliore la boucle produit sans casser la vitesse UX
### Risques à surveiller
*   coût des appels IA
*   ambiguïté sur données privées vs publiques
*   conflit entre sync et local-first

* * *
## Semaine 4 — Finition, instrumentation, mini-COSMOS
### Objectif produit
Transformer le prototype fonctionnel en MVP montrable et testable par de vrais utilisateurs.
### Livrables produit
*   mini dashboard conceptuel
*   vue synthétique par concept
*   progression simple (pas encore COSMOS complet)
*   observabilité erreurs + IA
*   polish UX principal
*   onboarding rapide
*   packaging release candidate
### Modules à livrer
#### 1\. Mini-COSMOS MVP
*   liste ou arbre simple de concepts
*   densité minimale : sources / imprints / cards / score approx.
*   statut visuel : non visité / partiel / forgé
#### 2\. Observabilité
*   erreurs runtime
*   traces IA essentielles
*   analytics d’usage clés
#### 3\. Qualité & release
*   tests e2e des flows critiques
*   tests import/export
*   tests review loop
*   bundle de release signé
### Critères de succès
*   le produit est démontrable à un utilisateur externe
*   les flows cœur sont mesurables
*   les bugs principaux sont traçables

* * *
## Priorisation ferme
### P0 — non négociable MVP
*   capture source
*   IMPRINT
*   cartes minimales
*   FSRS local
*   Dexie / local-first
*   review loop
*   bundle export minimal
### P1 — très important
*   Student AI v1
*   sync basique
*   leech detection
*   dashboard concept simple
### P2 — post-MVP proche
*   COSMOS riche
*   relations conceptuelles
*   contradictions multi-sources
*   persona adaptatif poussé
*   WebLLM avancé

* * *
## Répartition équipe recommandée
### Si équipe très petite (1 fondateur + 1 dev)
*   **Dev 1 / fullstack produit** : extension, Dexie, Supabase, UX flows
*   **Dev 2 / moteur** : FSRS WASM, scoring IMPRINT, Student AI orchestration
*   **Fondateur** : UX, PRD, tests utilisateurs, prompts, arbitrages produit
### Si solo fondateur technique
Ordre de construction :

1. capture + IMPRINT
2. cartes + review loop
3. FSRS WASM
4. Student AI v1
5. sync
6. bundle
7. mini-COSMOS

* * *
## Jalons de démonstration
### Démo fin Semaine 1
“Je capture un article, j’écris un IMPRINT, j’obtiens mes premières cartes.”
### Démo fin Semaine 2
“Je révise offline, le moteur planifie, l’historique persiste.”
### Démo fin Semaine 3
“Je fais du teach-back, j’ai un feedback IA, j’exporte/synchronise.”
### Démo fin Semaine 4
“J’ai un MVP cohérent, montrable, avec boucle cognitive complète.”

* * *
## KPIs MVP à suivre
### Produit
*   % de captures qui mènent à un IMPRINT complété
*   % d’IMPRINT qui génèrent des cartes utilisées
*   taux de retour à J+1 / J+7
*   nb moyen de reviews par utilisateur actif
### Cognitif
*   distribution des Crans IMPRINT
*   % de cartes qui passent `good/easy`
*   nb de leeches par concept
*   part des sessions Student AI finissant en “IMPRINT requis”
### Technique
*   temps moyen capture → cartes
*   taux d’erreur parsing source
*   taux d’échec sync
*   temps de démarrage side panel

* * *
## Recommandation finale sur la roadmap
Si tu veux tenir **4 semaines réalistes**, il faut accepter ceci :
*   **MVP ≠ COSMOS complet**
*   **MVP ≠ IA locale parfaite**
*   **MVP = boucle de forge complète, répétable, crédible**

Le bon MVP de NainoForge n’est pas celui qui impressionne par la quantité. C’est celui qui prouve que la forge cognitive fonctionne déjà sur un petit périmètre.

# NainoForge — Architecture technique détaillée (modules & tables)

## Objectif architectural
Cette architecture vise 4 choses en même temps :

1. **livrer vite** un MVP extension-first ;
2. **garder le moteur cognitif modulaire** ;
3. **protéger les données privées** ;
4. **préparer une montée en puissance vers SCYForge** sans réécriture massive.

Le principe directeur est le suivant :
*   **local d’abord** ;
*   **événements métier plutôt que couplage direct** ;
*   **contrats de données stricts** ;
*   **cloud seulement quand il apporte une vraie valeur**.

* * *
## 1\. Vue d’ensemble
### Couches principales
1. **Extension Chrome (WXT + React)**
    *   UI side panel
    *   capture web
    *   import local
    *   review loop
2. **Runtime local**
    *   Dexie / IndexedDB
    *   queue de sync
    *   bundle engine
    *   moteur de scoring local
    *   FSRS WASM
3. **Backend léger**
    *   Supabase Auth
    *   Postgres
    *   Edge Functions
    *   Storage
4. **Services IA**
    *   chemin cloud pour public
    *   chemin local pour privé

* * *
## 2\. Modules fonctionnels
### 2.1 Capture Module
### Rôle
Transformer une page web, une transcription ou un fichier en **source canonique** exploitable par le reste du système.
### Entrées
*   DOM de page web
*   URL active
*   transcript YouTube
*   fichier Markdown/TXT/PDF/DOCX
### Sorties
*   `SourceCaptured`
*   `DocumentParsed`
*   `SourceClassified`
### Responsabilités
*   détection du type de source
*   extraction du texte principal
*   nettoyage minimal
*   calcul checksum
*   classification privacy level
*   création du `DocumentCanonicalModel`
### Sous-modules
*   `webCapture`
*   `youtubeTranscript`
*   `fileImport`
*   `privacyClassifier`
*   `documentCanonicalizer`
### Contrat conseillé

```plain
interface CaptureResult {
  sourceId: string
  sourceType: 'web' | 'youtube' | 'pdf' | 'docx' | 'md' | 'txt'
  privacyLevel: 'public' | 'personal' | 'enterprise'
  title: string
  rawText: string
  canonical: DocumentCanonicalModel
}
```

* * *
### 2.2 Knowledge / IMPRINT Module
### Rôle
Faire passer la source du statut “capturée” au statut “forgée partiellement”.
### Entrées
*   `SourceCaptured`
*   `DocumentParsed`
*   texte d’IMPRINT utilisateur
### Sorties
*   `ImprintSaved`
*   `ImprintValidated`
*   `ConceptsExtracted`
*   `ImprintScored`
### Responsabilités
*   gestion du brouillon IMPRINT
*   calcul Cran 1–5
*   calcul IQS
*   bloom tagging
*   concept coverage
*   flags cohérence/contradiction simples
### Sous-modules
*   `imprintEditorState`
*   `cranScorer`
*   `iqsCalculator`
*   `bloomTagger`
*   `claimValidator`
### Décision importante
Le module IMPRINT ne doit pas connaître FSRS, ni la sync, ni le rendu review. Il publie des événements métier et s’arrête là.

* * *
### 2.3 Flashcards Module
### Rôle
Générer et maintenir les cartes d’apprentissage à partir des IMPRINT et des concepts.
### Entrées
*   `ImprintValidated`
*   `ConceptsExtracted`
*   état de cartes existantes
### Sorties
*   `FlashcardsGenerated`
*   `CardUpdated`
*   `LeechDetected`
### Responsabilités
*   génération B01/B02/B03/B04/B05
*   déduplication légère
*   liaison concept ↔ cartes
*   suivi lapse\_count
*   statut leech
### Sous-modules
*   `cardFactory`
*   `cardTypingRules`
*   `cardDeduplicator`
*   `leechPolicy`

* * *
### 2.4 FSRS / Review Module
### Rôle
Planifier les révisions et enregistrer l’historique immuable de review.
### Entrées
*   `FlashcardsGenerated`
*   `CardReviewed`
*   action utilisateur sur rating
### Sorties
*   `ReviewScheduled`
*   `ReviewRecorded`
*   `ReviewSessionCompleted`
*   `LeechDetected`
### Responsabilités
*   wrapper JS/TS du moteur WASM
*   calcul intervalles
*   priorisation cartes dues
*   session Micro/Standard/Deep
*   review events immuables
### Sous-modules
*   `fsrsAdapter`
*   `reviewQueueBuilder`
*   `sessionPlanner`
*   `reviewEventStore`
### Contrat conseillé

```plain
interface ReviewInput {
  cardId: string
  rating: 'again' | 'hard' | 'good' | 'easy'
  reviewedAt: number
  elapsedSeconds: number
}
```

* * *
### 2.5 Student AI Module
### Rôle
Évaluer l’explication libre de l’utilisateur sur un concept et recalibrer la perception de maîtrise.
### Entrées
*   `ImprintValidated`
*   `TeachBackStarted`
*   source publique ou privée
*   confidence déclarée
*   explication utilisateur
### Sorties
*   `TeachBackCompleted`
*   `MisconceptionDetected`
*   `ImprintRequired`
*   `ConfidenceGapDetected`
### Responsabilités
*   concept coverage
*   coherence check
*   depth estimation
*   misconception detection
*   état final utilisateur
### Sous-modules
*   `studentAiPromptBuilder`
*   `coverageAnalyzer`
*   `coherenceAnalyzer`
*   `depthAnalyzer`
*   `misconceptionAnalyzer`
*   `confidenceCalibrator`
### Décision clé
Le module doit pouvoir basculer entre :
*   provider cloud
*   provider local navigateur

via une interface unique.

* * *
### 2.6 COSMOS Module (MVP simplifié)
### Rôle
Fournir une lecture synthétique de la progression par concept.
### Entrées
*   `ImprintScored`
*   `TeachBackCompleted`
*   `ReviewRecorded`
*   `ConceptRelationDetected`
### Sorties
*   `SMIUpdated`
*   `GapDetected`
### Responsabilités
*   calcul SMI simplifié
*   densité de concept
*   statut visuel concept
*   relations conceptuelles basiques si disponibles
### Sous-modules
*   `smiCalculator`
*   `conceptProjection`
*   `gapDetector`
*   `relationProjector`
### Prudence
Au MVP, COSMOS doit être une **projection** des événements existants, pas un moteur autonome lourd.

* * *
### 2.7 Sync Module
### Rôle
Synchroniser les données autorisées vers le cloud sans casser la logique local-first.
### Entrées
*   événements locaux persistés
*   statut auth
*   disponibilité réseau
### Sorties
*   `SyncQueued`
*   `SyncSucceeded`
*   `SyncFailed`
### Responsabilités
*   sélection des objets syncables
*   exclusions privacy
*   retry/backoff
*   résolution de conflits simple
### Sous-modules
*   `syncQueue`
*   `syncSerializer`
*   `conflictResolver`
*   `networkMonitor`

* * *
### 2.8 Bundle Module
### Rôle
Exporter / réimporter l’état utile du produit.
### Entrées
*   tables locales
*   préférences utilisateur
*   métadonnées version
### Sorties
*   `.nfbundle`
*   `BundleExported`
*   `BundleImported`
### Responsabilités
*   sérialisation
*   checksum
*   compression
*   chiffrement optionnel
*   restauration contrôlée
### Sous-modules
*   `bundleManifest`
*   `bundleExporter`
*   `bundleImporter`
*   `bundleChecksum`
*   `bundleEncryption`

* * *
## 3\. Event bus métier
### Pourquoi
L’event bus permet d’éviter le couplage direct entre modules.
### Événements cœur recommandés
*   `SourceCaptured`
*   `DocumentParsed`
*   `ConceptsExtracted`
*   `ImprintSaved`
*   `ImprintValidated`
*   `ImprintScored`
*   `FlashcardsGenerated`
*   `CardReviewed`
*   `ReviewRecorded`
*   `TeachBackCompleted`
*   `MisconceptionDetected`
*   `SMIUpdated`
*   `BundleExported`
*   `SyncSucceeded`
### Exemple de forme

```plain
interface DomainEvent<TPayload> {
  id: string
  type: string
  aggregateId: string
  occurredAt: number
  version: number
  payload: TPayload
}
```

### Règle
Les événements servent à **notifier**. Ils ne doivent pas devenir un prétexte à rendre la logique opaque. Les cas critiques gardent des use-cases explicites.

* * *
## 4\. Modèle de données — vue d’ensemble
Je recommande de distinguer :

1. **tables locales de travail** ;
2. **tables syncables** ;
3. **journal immuable d’événements** ;
4. **projections de lecture**.

* * *
## 5\. Tables principales recommandées
### 5.1 `nf_users`
### Rôle
Profil produit minimal.
### Champs

| Champ | Type | Notes |
| ---| ---| --- |
| id | UUID | PK, lié auth |
| email | TEXT | nullable selon auth |
| display\_name | TEXT |  |
| created\_at | TIMESTAMP |  |
| updated\_at | TIMESTAMP |  |
| onboarding\_completed | BOOLEAN |  |
| default\_privacy\_mode | TEXT | public/personal/enterprise |
| settings\_json | JSONB | préférences diverses |

* * *
### 5.2 `nf_sources`
### Rôle
Objet source principal, avant ou après canonisation.
### Champs

| Champ | Type | Notes |
| ---| ---| --- |
| id | UUID | PK |
| user\_id | UUID | FK |
| source\_type | TEXT | web, youtube, pdf, docx, md, txt |
| privacy\_level | TEXT | public, personal, enterprise |
| url | TEXT | nullable |
| title | TEXT |  |
| language | TEXT |  |
| raw\_text | TEXT | peut être local-only selon privacy |
| checksum | TEXT | dédup/intégrité |
| word\_count | INTEGER |  |
| status | TEXT | captured, parsed, archived |
| created\_at | TIMESTAMP |  |
| updated\_at | TIMESTAMP |  |
| is\_syncable | BOOLEAN | règle privacy |

### Index recommandés
*   `(user_id, created_at desc)`
*   `(user_id, checksum)`
*   `(user_id, privacy_level)`

* * *
### 5.3 `nf_source_chunks`
### Rôle
Découpage canonique de la source.
### Champs

| Champ | Type | Notes |
| ---| ---| --- |
| id | UUID | PK |
| source\_id | UUID | FK |
| chunk\_index | INTEGER | ordre |
| content | TEXT |  |
| token\_count | INTEGER |  |
| embedding\_ref | TEXT | local ref ou remote ref |
| created\_at | TIMESTAMP |  |

### Note
Pour les sources privées, le contenu peut rester uniquement local et ne jamais être synchronisé.

* * *
### 5.4 `nf_concepts`
### Rôle
Concepts extraits ou stabilisés.
### Champs

| Champ | Type | Notes |
| ---| ---| --- |
| id | UUID | PK |
| user\_id | UUID | FK |
| canonical\_name | TEXT |  |
| slug | TEXT |  |
| description | TEXT | nullable |
| first\_source\_id | UUID | FK nullable |
| mastery\_status | TEXT | unvisited, partial, forged |
| created\_at | TIMESTAMP |  |
| updated\_at | TIMESTAMP |  |

### Index recommandés
*   `(user_id, slug)` unique logique
*   `(user_id, mastery_status)`

* * *
### 5.5 `nf_source_concepts`
### Rôle
Table de liaison source ↔ concepts.
### Champs

| Champ | Type | Notes |
| ---| ---| --- |
| id | UUID | PK |
| source\_id | UUID | FK |
| concept\_id | UUID | FK |
| confidence\_score | REAL | 0-1 |
| is\_primary | BOOLEAN |  |
| created\_at | TIMESTAMP |  |

* * *
### 5.6 `nf_imprint_notes`
### Rôle
Notes IMPRINT produites par l’utilisateur.
### Champs

| Champ | Type | Notes |
| ---| ---| --- |
| id | UUID | PK |
| user\_id | UUID | FK |
| source\_id | UUID | FK |
| concept\_id | UUID | FK nullable |
| note\_markdown | TEXT |  |
| status | TEXT | draft, submitted, validated |
| imprint\_cran | INTEGER | 1-5 |
| iquality\_score | REAL | 0-100 |
| bloom\_level | TEXT | remember → evaluate |
| concept\_coverage\_pct | REAL | 0-100 |
| reformulation\_score | REAL | 0-100 |
| length\_adequacy\_score | REAL | 0-100 |
| has\_example | BOOLEAN |  |
| has\_analogy | BOOLEAN |  |
| contradiction\_flagged | BOOLEAN |  |
| created\_at | TIMESTAMP |  |
| updated\_at | TIMESTAMP |  |
| submitted\_at | TIMESTAMP | nullable |

### Index recommandés
*   `(user_id, created_at desc)`
*   `(concept_id, submitted_at desc)`
*   `(source_id, status)`

* * *
### 5.7 `nf_flashcards`
### Rôle
Carte unitaire de révision.
### Champs

| Champ | Type | Notes |
| ---| ---| --- |
| id | UUID | PK |
| user\_id | UUID | FK |
| concept\_id | UUID | FK |
| source\_id | UUID | FK nullable |
| imprint\_note\_id | UUID | FK nullable |
| card\_type | TEXT | exposition, definition, mcq, short\_answer, application |
| front\_content | TEXT |  |
| back\_content | TEXT |  |
| distractors\_json | JSONB | pour MCQ |
| status | TEXT | active, suspended, archived |
| is\_leech | BOOLEAN | default false |
| lapse\_count | INTEGER | default 0 |
| initial\_cran | INTEGER |  |
| created\_at | TIMESTAMP |  |
| updated\_at | TIMESTAMP |  |

* * *
### 5.8 `nf_card_fsrs_state`
### Rôle
État courant FSRS de chaque carte.
### Champs

| Champ | Type | Notes |
| ---| ---| --- |
| card\_id | UUID | PK/FK |
| stability | REAL |  |
| difficulty | REAL |  |
| retrievability | REAL |  |
| last\_reviewed\_at | TIMESTAMP | nullable |
| next\_review\_at | TIMESTAMP | nullable |
| reps | INTEGER |  |
| lapses | INTEGER |  |
| state\_json | JSONB | compat moteur |
| updated\_at | TIMESTAMP |  |

### Remarque
L’état courant est mutable, mais il doit être dérivable des review events si nécessaire.

* * *
### 5.9 `nf_apex_reviews`
### Rôle
Journal immuable des reviews.
### Champs

| Champ | Type | Notes |
| ---| ---| --- |
| id | UUID | PK |
| user\_id | UUID | FK |
| card\_id | UUID | FK |
| rating | TEXT | again, hard, good, easy |
| elapsed\_seconds | INTEGER |  |
| fsrs\_state\_before | JSONB |  |
| fsrs\_state\_after | JSONB |  |
| reviewed\_at | TIMESTAMP |  |
| device\_id | TEXT | nullable |
| session\_id | UUID | nullable |

### Règle
Aucun `UPDATE` ou `DELETE` métier autorisé.

* * *
### 5.10 `nf_review_sessions`
### Rôle
Regrouper les reviews en sessions utilisateur.
### Champs

| Champ | Type | Notes |
| ---| ---| --- |
| id | UUID | PK |
| user\_id | UUID | FK |
| session\_type | TEXT | micro, standard, deep |
| started\_at | TIMESTAMP |  |
| ended\_at | TIMESTAMP | nullable |
| cards\_seen | INTEGER |  |
| cards\_completed | INTEGER |  |
| mode\_source | TEXT | manual, reminder, auto |

* * *
### 5.11 `nf_student_ai_sessions`
### Rôle
Session teach-back sur un concept donné.
### Champs

| Champ | Type | Notes |
| ---| ---| --- |
| id | UUID | PK |
| user\_id | UUID | FK |
| source\_id | UUID | FK |
| concept\_id | UUID | FK |
| card\_id | UUID | FK nullable |
| confidence\_declared | INTEGER | 1-5 |
| explanation\_text | TEXT | peut être local-only selon privacy |
| concept\_coverage\_pct | REAL |  |
| coherence\_score | REAL |  |
| depth\_score | REAL |  |
| misconception\_detected | BOOLEAN |  |
| final\_state | TEXT | mastered, partial, gap, imprint\_required |
| score\_evaluated | INTEGER | 1-5 |
| dunning\_kruger\_alert | BOOLEAN |  |
| provider\_mode | TEXT | cloud, local |
| session\_at | TIMESTAMP |  |

* * *
### 5.12 `nf_concept_relations`
### Rôle
Relations entre concepts pour COSMOS.
### Champs

| Champ | Type | Notes |
| ---| ---| --- |
| id | UUID | PK |
| source\_concept\_id | UUID | FK |
| target\_concept\_id | UUID | FK |
| relation\_type | TEXT | prerequisite, related, example\_of, contradicts, part\_of |
| weight | REAL |  |
| auto\_generated | BOOLEAN |  |
| evidence\_source\_id | UUID | nullable |
| created\_at | TIMESTAMP |  |
| updated\_at | TIMESTAMP |  |

* * *
### 5.13 `nf_cosmos_metrics`
### Rôle
Projection de lecture de la maîtrise d’un concept.
### Champs

| Champ | Type | Notes |
| ---| ---| --- |
| concept\_id | UUID | PK/FK |
| retention\_score | REAL |  |
| depth\_score | REAL |  |
| teaching\_score | REAL |  |
| metacognition\_score | REAL |  |
| coherence\_score | REAL |  |
| smi\_global | REAL |  |
| density\_score | REAL |  |
| gap\_status | TEXT | gap, partial, forged, unvisited |
| updated\_at | TIMESTAMP |  |

### Remarque
Je conseille d’en faire une **projection recalculable**, pas une vérité primaire.

* * *
### 5.14 `nf_sync_queue`
### Rôle
File d’attente locale des mutations à synchroniser.
### Champs

| Champ | Type | Notes |
| ---| ---| --- |
| id | UUID | PK |
| aggregate\_type | TEXT | source, imprint, card, review, etc. |
| aggregate\_id | UUID |  |
| operation | TEXT | create, update, upsert |
| payload\_json | JSONB |  |
| sync\_status | TEXT | pending, processing, synced, failed |
| retry\_count | INTEGER |  |
| last\_error | TEXT | nullable |
| created\_at | TIMESTAMP |  |
| updated\_at | TIMESTAMP |  |

* * *
### 5.15 `nf_bundle_exports`
### Rôle
Historique d’exports bundle.
### Champs

| Champ | Type | Notes |
| ---| ---| --- |
| id | UUID | PK |
| user\_id | UUID | FK |
| bundle\_version | TEXT |  |
| schema\_version | TEXT |  |
| checksum | TEXT |  |
| encrypted | BOOLEAN |  |
| storage\_mode | TEXT | local, local\_encrypted |
| created\_at | TIMESTAMP |  |

* * *
## 6\. Tables locales-only vs syncables
### Local-only recommandé
*   raw\_text de documents privés
*   chunks de documents privés
*   embeddings privés
*   explications privées longues si promesse privacy stricte
*   logs techniques sensibles
### Syncables recommandés
*   métadonnées source non sensibles
*   imprints publics / autorisés
*   cartes
*   états FSRS courants
*   review events si l’utilisateur est connecté
*   cosmos metrics dérivées si utiles

* * *
## 7\. Use-cases applicatifs recommandés
### 7.1 `CaptureSourceUseCase`
Étapes :

1. recevoir input
2. classifier privacy
3. extraire texte
4. normaliser DCM
5. persister source
6. publier `SourceCaptured`
### 7.2 `SubmitImprintUseCase`
Étapes :

1. valider texte
2. calculer cran
3. calculer IQS
4. extraire concepts clés
5. persister note
6. publier `ImprintValidated`
### 7.3 `GenerateCardsUseCase`
Étapes :

1. charger note + concepts
2. choisir types de cartes
3. générer contenu
4. éviter doublons simples
5. persister cartes
6. publier `FlashcardsGenerated`
### 7.4 `ReviewCardUseCase`
Étapes :

1. charger état courant FSRS
2. appliquer rating
3. créer review event immuable
4. mettre à jour état courant
5. marquer leech si besoin
6. publier `ReviewRecorded`
### 7.5 `RunTeachBackUseCase`
Étapes :

1. charger concept/source
2. déterminer provider local/cloud
3. exécuter analyseurs
4. calculer état final
5. persister session
6. publier `TeachBackCompleted`

* * *
## 8\. Architecture de packages recommandée

```plain
apps/
  extension/

packages/
  domain/
  shared/
  capture/
  imprint/
  cards/
  fsrs/
  review/
  student-ai/
  cosmos/
  sync/
  bundle/
  ai-providers/
  db-contracts/
```

### Description rapide
*   `domain` : entités, events, value objects
*   `shared` : utilitaires, ids, dates, errors
*   `capture` : parsing + canonicalization
*   `imprint` : cran, IQS, bloom, validation
*   `cards` : card factory + rules
*   `fsrs` : wrapper moteur Rust/WASM
*   `review` : orchestration sessions
*   `student-ai` : teach-back
*   `cosmos` : projections maîtrise
*   `sync` : queue + transport
*   `bundle` : export/import
*   `ai-providers` : abstraction cloud/local
*   `db-contracts` : schémas Zod / DTOs

* * *
## 9\. Interfaces techniques clés
### Provider IA

```plain
interface AiProvider {
  summarize(input: SummarizeInput): Promise<SummarizeOutput>
  extractConcepts(input: ExtractConceptsInput): Promise<ExtractConceptsOutput>
  runTeachBack(input: TeachBackInput): Promise<TeachBackOutput>
  embed?(input: EmbedInput): Promise<EmbedOutput>
}
```

### Bundle Engine

```plain
interface BundleEngine {
  exportBundle(input: ExportBundleInput): Promise<ExportBundleResult>
  importBundle(input: ImportBundleInput): Promise<ImportBundleResult>
}
```

### Sync Transport

```plain
interface SyncTransport {
  push(records: SyncRecord[]): Promise<SyncPushResult>
  pull(cursor?: string): Promise<SyncPullResult>
}
```

* * *
## 10\. Sécurité et garde-fous
### Règles non négociables
1. les documents privés ne sont pas envoyés au cloud ;
2. les review events sont immuables ;
3. l’état critique existe localement avant toute sync ;
4. toute donnée syncée doit respecter une policy privacy explicite ;
5. les migrations de schéma local doivent être versionnées et testées.

* * *
## 11\. Décisions de simplification recommandées pour le MVP
### À garder simples au début
*   conflict resolution : last-write-wins sur certains objets non critiques
*   relations conceptuelles : seulement `related` et `prerequisite` si vraiment utile
*   COSMOS : projection simple, pas graphe temps réel complexe
*   Student AI : une seule chaîne d’analyse structurée, pas quatre services séparés
*   sync : unidirectionnelle puis bidirectionnelle ensuite si nécessaire
### À ne pas simplifier excessivement
*   séparation privacy
*   journal review immuable
*   local-first réel
*   contrat DCM
*   frontières de modules

* * *
## 12\. Recommandation finale d’architecture
Le bon niveau d’architecture pour NainoForge aujourd’hui est :
*   **modulaire mais pas baroque** ;
*   **event-driven mais lisible** ;
*   **local-first mais syncable** ;
*   **privacy-first mais pas anti-cloud dogmatique** ;
*   **suffisamment structuré pour évoluer vers SCYForge**.

En pratique, cela veut dire :
*   extension + Dexie comme noyau produit ;
*   Supabase comme backend MVP ;
*   Rust/WASM pour FSRS ;
*   tables claires et projections recalculables ;
*   IA branchable via interfaces ;
*   bundle comme vraie brique de portabilité.

C’est, à mon avis, la meilleure architecture pour maximiser à la fois **vitesse**, **cohérence produit** et **trajectoire long terme**.

# NainoForge — Ajustement business model & lancement autofinancé

## Nouveau contexte business
Tu as précisé plusieurs points très importants qui changent utilement la lecture de la roadmap :
*   le produit doit être **autofinancé par les premiers clients payants** ;
*   tu veux être **transparent** sur le fait qu’il n’y a pas encore de nom de domaine au lancement ;
*   **Student AI n’arrive pas au jour 1**, mais **en semaine 2 après lancement** ;
*   Student AI sera réservé au début à **10 clients premium**, afin que leurs paiements financent l’API ;
*   tu ne veux **pas de free tier au départ**, faute de budget initial ;
*   tu veux aussi créer un **blog de contenu** pour partager tes meilleures méthodes de mémorisation et de transformation des connaissances.

Mon avis : **ce positionnement est cohérent**. En réalité, il simplifie même le MVP si on l’assume clairement.

* * *
## 1\. Ce que cela change dans la stratégie produit
### Avant
La première lecture du projet pouvait laisser penser à une montée progressive produit-first, avec possibilité d’élargir ensuite.
### Maintenant
Le projet devient clairement :
*   **un produit premium dès le départ** ;
*   **un lancement artisanal mais assumé** ;
*   **une montée en gamme pilotée par le cash des premiers clients** ;
*   **une IA payante et contrôlée**, pas une feature ouverte à tout le monde.
### Conséquence stratégique
Le vrai objectif du lancement n’est plus seulement :
> “Montrer que la forge cognitive marche.”
C’est aussi :
> “Montrer qu’un petit groupe de clients reconnaît la valeur et accepte de financer la suite.”
C’est très différent, et plus sain dans ton contexte.

* * *
## 2\. Décision recommandée : lancer en “paid pilot”, pas en “public launch”
Je te recommande de formuler le lancement comme un **paid pilot** ou une **cohorte fondatrice premium**.
### Pourquoi c’est le bon angle
*   tu n’as pas besoin de supporter une base large ;
*   tu peux onboarder manuellement ;
*   tu peux parler directement avec chaque client ;
*   tu peux réserver les coûts API aux utilisateurs qui paient ;
*   tu transformes l’absence de budget initial en **discipline produit**, pas en faiblesse.
### Positionnement conseillé
Exemple d’idée de message produit :
*   “Accès fondateur limité”
*   “Cohorte premium privée”
*   “10 places premium avec Student AI activé”
*   “Lancement artisanal, transparent, évolution construite avec les premiers clients”

Cette posture est beaucoup plus crédible que de prétendre lancer une plateforme complète trop tôt.

* * *
## 3\. Impact direct sur la roadmap
## Phase 1 — Lancement initial sans Student AI
### Ce qui doit être présent au lancement
*   capture de source
*   IMPRINT
*   scoring simple (Cran / qualité)
*   flashcards
*   review FSRS offline
*   bundle export minimal
*   auth simple
*   espace premium / accès contrôlé
### Ce qui peut attendre 1 à 2 semaines après lancement
*   Student AI
*   prompts avancés
*   calibrage de confiance
*   monitoring IA plus riche
*   quotas API plus précis
### Conclusion
**Student AI ne doit plus être vu comme une condition du lancement.**
Il doit être vu comme :
*   une **upgrade premium réelle** ;
*   un **levier de monétisation** ;
*   une feature à coût variable que tu déclenches seulement quand le revenu le justifie.

* * *
## 4\. Ce que cela change dans la stack recommandée
## 4.1 Billing et accès deviennent prioritaires plus tôt
Puisque tu veux lancer payant dès le départ, il faut monter d’un cran la priorité de :
*   gestion des comptes ;
*   contrôle d’accès ;
*   feature flags ;
*   statut premium ;
*   activation sélective de Student AI.
### Recommandation technique
Ajouter très tôt dans le backend :
*   un champ `plan` (`founder`, `premium`, `future_free`) ;
*   un champ `student_ai_enabled` ;
*   un champ `ai_quota_monthly` ou `ai_usage_budget` ;
*   un journal simple de consommation IA.

Autrement dit, l’architecture doit être prête à dire :
*   cet utilisateur paie ;
*   cet utilisateur peut appeler Student AI ;
*   cet utilisateur a consommé X appels ;
*   si besoin, on coupe ou on ralentit proprement.

* * *
## 4.2 Student AI doit être conçu comme une feature flaggée
Je recommande fortement que Student AI soit :
*   **désactivé par défaut** ;
*   **activable par utilisateur** ;
*   **mesurable** ;
*   **facile à couper** si les coûts explosent.
### Cela implique
*   pas de dépendance produit totale à Student AI pour les flows de base ;
*   fallback propre si la feature est désactivée ;
*   UX claire : “fonction premium activée” / “bientôt disponible” / “quota atteint”.

C’est extrêmement important pour une startup autofinancée.

* * *
## 4.3 Le modèle “no free at start” simplifie aussi le produit
En réalité, ne pas faire de gratuit au départ t’aide sur plusieurs fronts :
*   moins d’abus ;
*   moins de support ;
*   moins de coûts imprévus ;
*   moins de pression à scaler trop tôt ;
*   onboarding plus qualitatif.
### Ce que cela impose en échange
*   proposition de valeur très claire ;
*   onboarding plus humain ;
*   promesse très compréhensible ;
*   preuves rapides de valeur dès les premiers jours d’usage.

Donc, sans free tier, tu ne peux pas te permettre un produit “flou”. Il faut que le bénéfice soit vite visible.

* * *
## 5\. Impact sur l’ordre de construction
## Priorité 1 — Preuve de valeur payante
Construire ce qui permet à un client de dire :
> “Oui, cet outil m’aide déjà à mieux mémoriser et structurer ce que j’apprends.”
Donc priorité à :
*   capture
*   IMPRINT
*   cartes
*   review loop
*   UX de progression simple
## Priorité 2 — Monétisation et contrôle
Très tôt, ajouter :
*   accès privé
*   statut premium
*   activation de fonctionnalités
*   suivi des coûts IA par utilisateur
## Priorité 3 — Student AI premium
Ensuite seulement :
*   Student AI pour 10 clients premium
*   feature flag
*   instrumentation usage/coût
*   retour qualitatif rapproché

* * *
## 6\. Recommandation business/produit sur le lancement
## 6.1 L’absence de domaine n’est pas grave si elle est assumée
Tu as raison d’être transparent.

Le vrai problème n’est pas “ne pas avoir de domaine”.
Le vrai problème serait de **donner une impression d’improvisation confuse**.
### Donc il faut compenser par :
*   un message clair ;
*   une page simple mais propre ;
*   une explication honnête du stade du produit ;
*   une relation directe avec les premiers clients.

Le lancement peut être artisanal, mais il doit paraître **sérieux**.

* * *
## 6.2 Les 10 premium clients doivent être traités comme un groupe fondateur
Je te conseille de ne pas les voir comme de simples acheteurs, mais comme :
*   des **clients fondateurs** ;
*   une **cohorte test premium** ;
*   les premiers financeurs du moteur IA.
### Avantage
Cela crée une logique saine :
*   eux paient ;
*   toi tu livres un service premium ;
*   tu apprends vite ;
*   tu finances Student AI sans brûler du cash au hasard.

* * *
## 6.3 Ton blog est un très bon levier d’acquisition
Le blog est cohérent avec le produit pour 3 raisons :

1. il prouve ton expertise ;
2. il attire des gens déjà sensibles à l’apprentissage profond ;
3. il crée de la confiance avant la vente.
### Surtout
Ton blog ne doit pas être un blog générique sur la productivité.
Il doit être un **blog de méthode**, centré sur :
*   mémorisation active ;
*   apprentissage profond ;
*   transformation de ce qu’on lit en connaissance durable ;
*   erreurs classiques de révision ;
*   bonnes pratiques IMPRINT / recall / teach-back.

En clair : le blog doit préparer le marché à comprendre pourquoi NainoForge mérite d’être payé.

* * *
## 7\. Ajustement de la roadmap en 3 temps
## Temps 1 — Pré-lancement payant
### Objectif
Avoir un produit assez solide pour vendre les premières places.
### À livrer
*   MVP sans Student AI
*   accès privé
*   statut premium
*   message de lancement transparent
*   page simple de présentation
*   onboarding manuel
## Temps 2 — Semaine 2 après lancement
### Objectif
Activer Student AI uniquement pour les 10 premium.
### À livrer
*   feature flag par utilisateur
*   tracking coût IA
*   quota / budget d’usage
*   prompt v1 Student AI
*   feedback qualitatif structuré
## Temps 3 — Après validation
### Objectif
Décider si tu élargis :
*   plus de clients premium ;
*   version standard sans IA ;
*   futur free tier limité ;
*   montée en puissance du blog et du contenu.

* * *
## 8\. Ce que je recommande maintenant, très concrètement
### Produit
*   lancer **sans attendre Student AI** ;
*   vendre la valeur cœur : capture → forge → cartes → review ;
*   présenter Student AI comme une **couche premium** activée ensuite.
### Technique
*   ajouter dès maintenant les champs de plan, quota et activation IA ;
*   prévoir un système simple de feature flag ;
*   tracer le coût par utilisateur premium.
### Business
*   parler de **cohorte fondatrice payante** ;
*   assumer publiquement le stade early ;
*   transformer la transparence en signal de sérieux.
### Acquisition
*   démarrer le blog très tôt ;
*   publier des articles qui montrent la méthode avant de vendre l’outil ;
*   faire du blog un moteur de confiance, pas juste de trafic.

* * *
## 9\. Recommandation finale
Avec ce nouveau contexte, je recommande de repositionner NainoForge comme :
> **un produit premium, artisanal, transparent, autofinancé par une première cohorte de clients qui paient pour une vraie méthode de forge cognitive — puis une montée progressive vers Student AI réservé aux comptes premium.**
C’est plus crédible, plus soutenable financièrement, et probablement plus fort qu’un faux lancement “gratuit pour tout le monde” que tu ne pourrais pas financer.

En bref :
*   **pas de free au départ** = bonne décision dans ton contexte ;
*   **Student AI en semaine 2 pour 10 premium** = excellente logique de contrôle des coûts ;
*   **blog méthode + transparence** = bon moteur de confiance et d’acquisition ;
*   **architecture produit** doit maintenant intégrer explicitement plan premium, quotas IA et feature flags.

# NainoForge — Plan d’offre premium (lancement fondateur)

## Objectif de l’offre
L’offre de lancement de NainoForge ne doit pas essayer de plaire à tout le monde.
Elle doit faire une chose simple :
> convaincre un petit nombre de clients que ton produit les aide déjà à mieux mémoriser, mieux comprendre et mieux transformer ce qu’ils apprennent.
Ton contexte impose une règle saine :
*   **pas de free au départ** ;
*   **pas de promesse trop large** ;
*   **pas d’IA ouverte à tous** ;
*   **une offre premium, claire, crédible et rentable dès les premiers clients**.

* * *
## 1\. Positionnement recommandé
### Phrase de positionnement simple
**NainoForge est une extension premium de forge cognitive qui aide à transformer ce que l’on lit, regarde et apprend en connaissances réellement retenues et réutilisables.**
### Ce qu’on vend vraiment
Tu ne vends pas seulement :
*   des flashcards ;
*   des notes ;
*   un outil IA.

Tu vends :
*   une **méthode d’apprentissage actif** ;
*   une **discipline de transformation cognitive** ;
*   une **meilleure mémorisation dans le temps** ;
*   une **capacité à reconstruire et expliquer ce qu’on apprend**.
### Cible initiale la plus crédible
Je recommande de viser d’abord des utilisateurs qui :
*   apprennent beaucoup seuls ;
*   lisent, regardent, prennent des notes ;
*   sont frustrés par l’oubli rapide ;
*   acceptent de payer pour un outil sérieux ;
*   n’ont pas besoin d’un produit “grand public simplifié”.

Exemples :
*   autodidactes ambitieux ;
*   créateurs / consultants / indépendants ;
*   étudiants avancés ;
*   professionnels qui se forment en continu ;
*   profils “knowledge workers” très engagés.

* * *
## 2\. Structure d’offre recommandée au lancement
## Offre unique au départ
Je recommande **une seule offre payante au lancement**.

Pourquoi :
*   tu simplifies la vente ;
*   tu simplifies l’onboarding ;
*   tu simplifies le support ;
*   tu simplifies la perception de valeur.
### Nom conseillé
Quelques angles possibles :
*   **Accès Fondateur**
*   **Cohorte Fondatrice**
*   **Premium Founding Access**
*   **NainoForge Premium — Early Access**

Mon préféré pour ton contexte :

**NainoForge — Accès Fondateur Premium**

C’est simple, cohérent, et ça justifie le caractère limité et artisanal.

* * *
## 3\. Ce qui est inclus en semaine 1
### Offre de base au lancement
Le client premium obtient :
*   accès au produit privé ;
*   capture de contenus ;
*   IMPRINT ;
*   scoring simple de qualité / profondeur ;
*   génération de cartes ;
*   review FSRS offline ;
*   progression initiale ;
*   export bundle ;
*   onboarding guidé ou manuel ;
*   accès anticipé à l’évolution du produit.
### Formulation recommandée
Ne dis pas :
*   “le produit n’est pas fini”
*   “il manque beaucoup de choses”

Dis plutôt :
*   “tu entres dans la cohorte fondatrice”
*   “tu as accès au cœur de la forge cognitive dès maintenant”
*   “les premières améliorations premium arrivent avec les membres fondateurs”

* * *
## 4\. Ce qui arrive en semaine 2
## Student AI comme upgrade premium réelle
En semaine 2 après lancement, tu ajoutes :
*   Student AI pour les 10 premium ;
*   analyse d’explication ;
*   retour sur couverture / profondeur / cohérence ;
*   meilleure boucle d’apprentissage.
### Comment le présenter
Student AI ne doit pas être présenté comme :
*   une rustine ;
*   un simple chatbot ;
*   un bonus gadget.

Il doit être présenté comme :
> **le coach cognitif premium de NainoForge**
### Message conseillé
“Les 10 premiers membres premium financent et débloquent l’accès à Student AI, la couche de feedback cognitif avancé de NainoForge.”

Cela transforme le coût API en histoire produit compréhensible.

* * *
## 5\. Ce qu’il faut éviter dans l’offre
### Ne pas promettre trop tôt
Évite de promettre dès la vente :
*   plateforme complète ;
*   IA illimitée ;
*   accompagnement infini ;
*   synchronisation parfaite multi-device si elle n’est pas encore stable ;
*   roadmap trop détaillée et rigide.
### Ne pas vendre “de l’IA”
Le produit n’est pas “un outil IA”.
Le produit est un **système de forge cognitive**.

L’IA doit être présentée comme :
*   une couche d’accélération ;
*   une couche de feedback ;
*   une couche premium sélective.

Pas comme le produit lui-même.

* * *
## 6\. Proposition de valeur par niveau de maturité
## Semaine 1 — Valeur cœur
Promesse :
*   mieux capturer ;
*   mieux reformuler ;
*   mieux retenir.
## Semaine 2 — Valeur premium renforcée
Promesse :
*   mieux expliquer ;
*   mieux détecter ses lacunes ;
*   mieux corriger ses angles morts.
## Plus tard — Valeur élargie
Promesse :
*   construire un véritable système personnel de connaissance ;
*   relier concepts, mémoire, compréhension et progression dans le temps.

* * *
## 7\. Mécanique d’offre recommandée
## Option la plus saine : places limitées
Je recommande de lancer avec :
*   un **nombre limité de places** ;
*   un onboarding manuel ;
*   une communication directe ;
*   un statut de “fondateur”.
### Pourquoi
Parce que tu n’es pas en train de scaler un SaaS stable.
Tu es en train de faire entrer un petit groupe dans une version premium artisanale, sérieuse, construite avec eux.
### Effets positifs
*   plus de rareté ;
*   plus de proximité ;
*   plus de compréhension des usages ;
*   moins de support à vide ;
*   meilleure maîtrise du coût.

* * *
## 8\. Packaging de l’offre
### Ce que le client doit comprendre en 10 secondes
1. **à quoi ça sert**
2. **pour qui c’est**
3. **ce qui est inclus maintenant**
4. **ce qui arrive bientôt**
5. **pourquoi c’est payant dès le départ**
### Exemple de structure de page de vente simple
#### Bloc 1 — Problème
“Tu apprends beaucoup, mais tu oublies vite. Tu captures, tu notes, mais tu ne forges pas vraiment.”
#### Bloc 2 — Solution
“NainoForge transforme ce que tu apprends en notes actives, cartes de révision et boucle de mémorisation durable.”
#### Bloc 3 — Ce que tu obtiens maintenant
*   Capture
*   IMPRINT
*   Flashcards
*   Révision FSRS offline
*   Progression structurée
#### Bloc 4 — Ce que les membres fondateurs débloquent
*   Student AI en semaine 2
*   évolution produit plus rapide
*   accès premium prioritaire
#### Bloc 5 — Transparence
*   lancement artisanal
*   encore sans domaine propre si nécessaire
*   accès limité
*   développement financé par les premiers membres
#### Bloc 6 — Appel à l’action
“Rejoindre la cohorte fondatrice premium”

* * *
## 9\. Tarification : logique, pas chiffre figé
Je ne vais pas inventer un prix arbitraire sans ton contexte marché exact.

Mais je te recommande une logique de prix basée sur :
*   la rareté ;
*   l’accès anticipé ;
*   la proximité ;
*   la valeur premium ;
*   le coût IA futur réservé à un petit groupe.
### Ce que le prix doit signaler
Le prix doit dire :
*   ce n’est pas un gadget gratuit ;
*   ce n’est pas un produit grand public “cheap” ;
*   c’est une expérience premium fondatrice.
### Erreur à éviter
Sous-pricer pour “rassurer”.

Si le produit vise des gens qui reconnaissent vraiment la valeur du travail cognitif, un prix trop bas peut affaiblir la perception du produit.

* * *
## 10\. Gestion des plans plus tard
## Au lancement
*   **1 plan**
## Plus tard
Tu pourras évoluer vers :
*   **Plan Standard** : cœur du produit sans Student AI
*   **Plan Premium** : Student AI + fonctions avancées
*   **Plan Free limité** : quand la machine économique sera plus solide

Mais pas maintenant.

Pour l’instant, la clarté vaut plus que la segmentation.

* * *
## 11\. Ce que l’architecture doit supporter dès maintenant
L’offre premium doit être visible dans le système via des champs et règles clairs.
### Champs recommandés
*   `plan`
*   `premium_since`
*   `student_ai_enabled`
*   `ai_usage_budget`
*   `ai_usage_current`
*   `founding_member`
*   `onboarding_status`
### Règles produit
*   Student AI désactivé par défaut
*   activation manuelle pour premium
*   suivi de consommation
*   affichage clair des capacités du plan

* * *
## 12\. Message marketing recommandé
### Version courte
**NainoForge est une extension premium de forge cognitive pour celles et ceux qui veulent enfin transformer ce qu’ils apprennent en connaissance durable.**
### Version plus directe
**Tu n’as pas besoin de plus de notes. Tu as besoin d’un système pour forger, réviser et réutiliser ce que tu apprends.**
### Version fondatrice
**Rejoins la cohorte fondatrice premium de NainoForge : un accès limité pour les premiers utilisateurs qui veulent construire une vraie mémoire de travail durable — et débloquer Student AI en avant-première.**

* * *
## 13\. Recommandation finale sur l’offre
Le meilleur plan pour ton contexte est :
*   **une seule offre premium** ;
*   **accès fondateur limité** ;
*   **valeur cœur disponible dès le lancement** ;
*   **Student AI activé en semaine 2 pour les 10 premium** ;
*   **transparence forte** sur le stade du produit ;
*   **blog de méthode** comme moteur de confiance.

En clair :
> ne vends pas un “outil pas fini”.  
> vends un **accès fondateur premium à une méthode de forge cognitive déjà utile, en train de monter en puissance**.

# NainoForge — Roadmap launch-to-revenue sur 30 jours

## Objectif des 30 prochains jours
Passer de :
*   produit encore artisanal,
*   pas encore de domaine,
*   budget limité,
*   lancement contrôlé,

à :
*   **premiers clients premium actifs**,
*   **première preuve de revenu**,
*   **Student AI activé seulement pour les comptes rentables**,
*   **narratif produit clair**,
*   **base de confiance via le contenu**.

Le but n’est pas de “faire du volume”.
Le but est de créer :
> **une petite machine crédible qui transforme l’intérêt en premiers paiements.**
* * *
## Vision simple
### Jours 1–10
Rendre le produit vendable.
### Jours 11–20
Trouver les premiers clients et onboarder les bons profils.
### Jours 21–30
Convertir, activer Student AI pour les premium, et stabiliser la boucle revenu → usage → amélioration.

* * *
## KPI principal
Le KPI central des 30 jours n’est pas le trafic.

C’est :

**nombre de clients premium actifs qui utilisent réellement le cœur du produit.**
### KPIs à suivre
*   nombre de conversations qualifiées
*   nombre de démos / onboardings
*   nombre de paiements
*   nombre de clients premium actifs à J+7
*   nombre d’IMPRINT créés par client
*   nombre de reviews réalisées
*   coût IA par client premium (quand Student AI s’active)

* * *
## Phase 1 — Jours 1 à 5
## Rendre l’offre vendable
### Objectif
Avoir une proposition de valeur claire, un produit montrable, et un discours cohérent.
### À faire
#### Produit
*   verrouiller le flow minimum : capture → IMPRINT → cartes → review
*   retirer tout ce qui brouille la démo
*   préparer un onboarding simple
*   vérifier que l’expérience marche sans Student AI
#### Offre
*   définir le nom d’offre : Accès Fondateur Premium
*   lister précisément ce qui est inclus maintenant
*   lister ce qui arrive en semaine 2
*   clarifier que Student AI est réservé aux premium activés
#### Communication
*   écrire un texte simple de présentation
*   préparer un message de transparence sur le stade du produit
*   assumer publiquement l’absence de domaine si nécessaire
### Livrables attendus
*   1 page de présentation simple
*   1 script court de présentation orale/écrite
*   1 démonstration claire en quelques minutes
### Critère de succès
Quelqu’un peut comprendre en 60 secondes :
*   ce que fait NainoForge,
*   pour qui c’est,
*   pourquoi c’est payant,
*   pourquoi ça vaut le coup maintenant.

* * *
## Phase 2 — Jours 6 à 10
## Préparer la confiance et la demande
### Objectif
Ne pas lancer “dans le vide”. Commencer à faire émerger l’intérêt.
### À faire
#### Blog / contenu
Publier 2 à 3 contenus très utiles, très ciblés.
### Angles recommandés
1. pourquoi on oublie presque tout ce qu’on consomme
2. pourquoi prendre des notes ne suffit pas
3. comment transformer ce qu’on apprend en mémoire durable
#### Réseaux / messages directs
*   contacter les profils les plus susceptibles de comprendre la valeur
*   montrer le produit à quelques personnes qualifiées
*   ne pas viser la masse ; viser les bons premiers utilisateurs
#### Produit
*   finaliser auth simple
*   prévoir statut premium
*   préparer gating Student AI
### Livrables attendus
*   2 à 3 posts/articles
*   10 à 20 conversations ciblées
*   3 à 5 retours réels sur le pitch et la démo
### Critère de succès
Tu identifies les phrases qui font réagir positivement, et celles qui n’accrochent pas.

* * *
## Phase 3 — Jours 11 à 15
## Ouvrir la cohorte fondatrice
### Objectif
Passer de l’intérêt à une première vente claire.
### À faire
#### Offre
*   ouvrir les places fondatrices
*   annoncer que le nombre est limité
*   expliquer ce que paient les clients
*   expliquer ce qu’ils débloquent
#### Ventes
*   faire des onboardings manuels
*   vendre par échange direct si nécessaire
*   privilégier qualité des clients > quantité
#### Produit
*   suivre activation des premiers comptes
*   mesurer où les gens bloquent
*   corriger immédiatement les points de friction critiques
### Livrables attendus
*   premiers paiements
*   premiers clients connectés
*   premiers usages réels sur le flow cœur
### Critère de succès
Tu obtiens les 1ers clients qui paient non pas “par soutien symbolique”, mais parce qu’ils perçoivent une vraie valeur.

* * *
## Phase 4 — Jours 16 à 20
## Activer et retenir les premiers premium
### Objectif
Transformer les premiers paiements en usage réel et en confiance produit.
### À faire
#### Onboarding premium
*   accompagnement rapproché
*   aide à la première capture
*   aide au premier IMPRINT
*   aide à la première review
#### Mesure
*   vérifier que les utilisateurs passent le cap du premier usage utile
*   repérer les abandons
*   comprendre les objections réelles
#### Produit
*   améliorer ce qui bloque le cœur de la forge
*   ne pas disperser l’effort sur des features secondaires
### Livrables attendus
*   comptes activés
*   premières routines d’usage
*   premiers témoignages / formulations utilisateur
### Critère de succès
Au moins une partie des clients premium revient naturellement dans le produit après la première session.

* * *
## Phase 5 — Jours 21 à 25
## Déployer Student AI pour les premium rentables
### Objectif
Activer la couche IA uniquement là où elle est économiquement et produitivement justifiée.
### À faire
#### Technique
*   activer `student_ai_enabled` pour les premium ciblés
*   mettre en place quota simple
*   tracer la consommation API
*   préparer fallback si coût ou usage dérape
#### Produit
*   présenter Student AI comme une amélioration premium
*   l’intégrer dans des cas d’usage précis
*   ne pas ouvrir à tous
#### Feedback
*   demander un retour structuré
*   mesurer valeur perçue vs coût réel
### Livrables attendus
*   Student AI actif pour un petit groupe
*   premiers usages qualifiés
*   premiers chiffres de consommation
### Critère de succès
Tu peux répondre clairement à cette question :
> “Est-ce que Student AI augmente suffisamment la valeur perçue pour justifier son coût sur ce segment premium ?”
* * *
## Phase 6 — Jours 26 à 30
## Stabiliser la boucle revenu → usage → contenu
### Objectif
Ne pas juste “avoir lancé”, mais commencer à créer une machine simple et répétable.
### À faire
#### Produit
*   corriger les problèmes remontés
*   clarifier les flows premium
*   préparer la suite roadmap
#### Business
*   formaliser ce qui a le mieux converti
*   identifier le profil client le plus réceptif
*   décider si tu ouvres plus largement ou restes encore en cohorte limitée
#### Contenu
*   publier un retour d’expérience ou un article fort
*   transformer les apprentissages du lancement en contenu d’autorité
### Livrables attendus
*   synthèse des retours client
*   décision sur la suite du pricing / cohortes
*   base de message marketing plus solide
### Critère de succès
Tu finis le mois avec :
*   des clients actifs,
*   un début de revenu,
*   une meilleure compréhension du marché,
*   une boucle de progression produit crédible.

* * *
## Calendrier condensé

| Période | Objectif | Résultat attendu |
| ---| ---| --- |
| J1–J5 | Rendre le produit vendable | offre claire + démo claire |
| J6–J10 | Créer confiance et demande | contenus + conversations qualifiées |
| J11–J15 | Ouvrir la cohorte fondatrice | premiers paiements |
| J16–J20 | Activer et retenir | premiers usages réguliers |
| J21–J25 | Activer Student AI premium | usage IA ciblé et contrôlé |
| J26–J30 | Stabiliser la machine | base revenu + feedback + traction initiale |

* * *
## Les 3 erreurs à éviter absolument
### 1\. Attendre que tout soit parfait pour vendre
Mauvaise logique.
Dans ton contexte, tu as besoin de vendre dès que la valeur cœur est crédible.
### 2\. Ouvrir Student AI trop tôt à trop de monde
Cela peut tuer le modèle économique dès le départ.
### 3\. Trop parler de l’outil, pas assez de la transformation
Les gens n’achètent pas “une extension”.
Ils achètent la promesse de :
*   retenir mieux,
*   comprendre mieux,
*   réutiliser mieux.

* * *
## Message de lancement recommandé
### Version simple
“Je lance NainoForge en cohorte fondatrice premium. L’objectif est simple : aider un petit groupe de personnes à transformer ce qu’elles apprennent en connaissance durable. Le cœur du produit est déjà utilisable. Student AI arrive ensuite pour les premiers premium, afin de financer proprement le coût API et construire le produit sans faux gratuit ni promesses creuses.”

* * *
## Recommandation finale sur les 30 jours
Ton objectif du mois ne doit pas être :
*   faire du bruit,
*   avoir beaucoup d’inscrits,
*   sembler plus gros que tu ne l’es.

Ton objectif doit être :
> **obtenir quelques clients premium qui paient, utilisent vraiment le produit, et te donnent la preuve que la forge cognitive mérite d’être développée plus loin.**
Si tu obtiens ça, le mois est réussi.
Même avec peu de monde.
Même sans domaine au départ.
Même avec un lancement artisanal.

Parce que tu auras construit la chose la plus rare :

**une preuve initiale de valeur payée.**

# NainoForge — Analyse coûts IA cloud, quotas free et rentabilité pour 20 clients premium

## Contexte de l’analyse
Tu veux tester un plan **quasi zéro budget** pour l’IA cloud en combinant 3 accès API, puis voir si avec **20 clients premium à 20$** l’activité peut financer durablement les appels API.

Tu as mentionné :
*   **ZenMux / StepFun 3.7 Flash**
*   **“quio”** — j’interprète cela comme **QwQ** (à confirmer)
*   **Gemini 3.1 Flash Lite Preview**

Mon avis global :
*   **oui, économiquement cela peut tenir**, mais
*   **non, il ne faut pas baser la promesse premium sur du “free tier farming” multi-comptes**.

Le bon usage du gratuit est :
*   buffer de démarrage,
*   test de charge limitée,
*   expérimentation,

et non :
*   socle contractuel pour des clients payants.

* * *
## 1\. Ce que la veille confirme vraiment
### 1.1 Gemini
Les docs officielles Google confirment plusieurs points très importants :
*   il existe un **Free Tier** sur Gemini API ;
*   les quotas sont gérés par **projet**, pas simplement par clé API ;
*   les limites sont mesurées notamment en **RPM**, **TPM** et **RPD** ;
*   le modèle **Gemini 3.1 Flash-Lite Preview** a été **déprécié et arrêté le Sun May 25, 2026** ; il ne faut donc **pas** le prendre comme base de production.

Références officielles :
*   [](https://ai.google.dev/gemini-api/docs/billing)
*   [](https://ai.google.dev/gemini-api/docs/pricing)
*   You don't have access to this Doc
*   [](https://ai.google.dev/gemini-api/docs/rate-limits)
### Conséquence
Si tu veux utiliser Gemini, il faut **remplacer le Preview** par une version **stable** disponible au moment du build.

* * *
### 1.2 ZenMux / StepFun 3.7 Flash
La page officielle ZenMux confirme surtout :
*   l’existence du modèle ;
*   un **contexte jusqu’à 256k tokens** ;
*   un positionnement multimodal.

Référence officielle :
*   [ZenMux StepFun](https://zenmux.ai/stepfun)

En revanche, dans la recherche publique récupérée ici, **je n’ai pas pu valider proprement une page officielle ZenMux exposant noir sur blanc un quota gratuit mensuel stable et public**.
### Conséquence
Je considère donc le **free tier ZenMux comme non suffisamment vérifié** pour bâtir une promesse commerciale dessus.

* * *
### 1.3 QwQ / “quio”
Ici aussi, les résultats publics récupérés montrent qu’il existe des accès et des prix variables selon les providers, mais **je n’ai pas récupéré dans cette session une page officielle suffisamment nette permettant de valider un quota gratuit mensuel stable et exploitable**.
### Conséquence
Je garde QwQ comme **option potentiellement très économique**, mais **pas comme source garantie sans vérification dashboard / doc officielle**.

* * *
## 2\. Le point stratégique le plus important
### Multi-clés ≠ vraie capacité de production
Pour Gemini au moins, les docs officielles disent que les quotas sont **par projet**, pas simplement par clé.

Donc :
*   plusieurs clés sur un même projet **n’augmentent pas** la capacité ;
*   plusieurs comptes séparés peuvent créer de la capacité additionnelle, **mais** cela devient vite :
    *   fragile,
    *   difficile à opérer,
    *   potentiellement contraire à l’esprit ou aux règles des providers,
    *   non sérieux pour des clients payants.
### Ma recommandation
Tu peux utiliser plusieurs accès gratuits pour :
*   expérimenter,
*   comparer les modèles,
*   absorber un peu de trafic au tout début,

mais **pas** comme fondation durable de l’offre premium.

* * *
## 3\. Hypothèses de calcul
Comme les quotas free exacts des 3 services ne sont pas complètement validés ici, je vais raisonner de la manière la plus saine :

1. **le gratuit = bonus éventuel**, non garanti ;
2. **la vraie question = est-ce que le modèle reste rentable même en payant les appels ?**
### Revenu cible
*   **20 clients premium × 20$ = 400$ / mois**
### Cible de prudence
Je te recommande de viser au début :
*   **budget IA total mensuel ≤ 80$ à 120$**

Cela représente :
*   **20% à 30% du revenu** consacré aux appels modèles

C’est un plafond raisonnable pour garder de la marge pour :
*   backend,
*   erreurs,
*   support,
*   outils,
*   paiements,
*   imprévus.

* * *
## 4\. Hypothèses de prix indicatives utilisées pour la simulation
⚠️ Ces chiffres ne doivent pas être lus comme une “vérité contractuelle officielle” pour tous les providers. Ce sont des **ordres de grandeur publics récupérés pendant la veille**, utiles pour modéliser la rentabilité.
### Hypothèses indicatives

| Modèle | Input / 1M | Output / 1M | Note |
| ---| ---| ---| --- |
| StepFun 3.7 Flash | 0.20$ | 1.15$ | prix public indexé durant la veille |
| QwQ (hypothèse) | 0.20$ | 0.60$ | hypothèse prudente pour modèle économique |
| Gemini Flash Lite stable / équivalent | 0.25$ | 1.50$ | ordre de grandeur public récupéré durant la veille |

### Lecture importante
Même si ces prix évoluent un peu, ils restent **suffisamment bas** pour rendre possible une offre à 20$ **à condition de limiter proprement l’usage**.

* * *
## 5\. Répartition recommandée des modèles
Je te conseille une **orchestration par usage**, pas un routage aléatoire.
### Répartition cible
#### 1\. QwQ / modèle le moins cher
À utiliser pour :
*   scoring initial ;
*   classification ;
*   extraction simple ;
*   premiers passages de Student AI ;
*   tâches où la qualité “suffisante” suffit.
### Part cible
**50% à 60%** des appels

* * *
#### 2\. StepFun 3.7 Flash
À utiliser pour :
*   cas multimodaux ;
*   traitement plus riche de source ;
*   cas où tu veux plus de nuance que le modèle cheap.
### Part cible
**25% à 35%** des appels

* * *
#### 3\. Gemini Flash Lite stable
À utiliser pour :
*   fallback ;
*   longues entrées / stabilité ;
*   traitements où l’écosystème Google t’aide ;
*   éventuel secours si les autres routes saturent.
### Part cible
**10% à 20%** des appels

* * *
## 6\. Coût moyen pondéré recommandé
En prenant un mix prudent de volume :
*   **50% QwQ**
*   **30% StepFun**
*   **20% Gemini**

on obtient environ :
*   **input moyen ≈ 0.21$ / 1M tokens**
*   **output moyen ≈ 0.945$ / 1M tokens**

C’est ce coût moyen que je prends pour la simulation.

* * *
## 7\. Simulation de rentabilité pour 20 clients premium
## Scénario A — Usage léger
Par client / mois :
*   **2M input**
*   **0.5M output**
### Coût par client
*   input : 2 × 0.21 = **0.42$**
*   output : 0.5 × 0.945 = **0.4725$**
*   **total ≈ 0.89$ / client / mois**
### Coût total pour 20 clients
*   **≈ 17.85$ / mois**
### Lecture
Très rentable.

* * *
## Scénario B — Usage équilibré
Par client / mois :
*   **5M input**
*   **1M output**
### Coût par client
*   input : 5 × 0.21 = **1.05$**
*   output : 1 × 0.945 = **0.945$**
*   **total ≈ 2.00$ / client / mois**
### Coût total pour 20 clients
*   **≈ 39.90$ / mois**
### Lecture
Encore très sain.

* * *
## Scénario C — Usage intensif mais contrôlé
Par client / mois :
*   **10M input**
*   **2M output**
### Coût par client
*   input : 10 × 0.21 = **2.10$**
*   output : 2 × 0.945 = **1.89$**
*   **total ≈ 3.99$ / client / mois**
### Coût total pour 20 clients
*   **≈ 79.80$ / mois**
### Lecture
Toujours compatible avec 400$ de revenu mensuel.

* * *
## Scénario D — Usage trop libre / dangereux
Par client / mois :
*   **20M input**
*   **4M output**
### Coût par client
*   input : 20 × 0.21 = **4.20$**
*   output : 4 × 0.945 = **3.78$**
*   **total ≈ 7.98$ / client / mois**
### Coût total pour 20 clients
*   **≈ 159.60$ / mois**
### Lecture
Toujours pas catastrophique, mais là tu commences à manger une partie bien plus importante de la marge.

* * *
## 8\. Conclusion financière simple
### Revenu mensuel
*   **400$**
### Zone de coût IA saine
*   **20$ à 80$ / mois** = très confortable
*   **80$ à 120$ / mois** = encore correct
*   **120$ à 160$ / mois** = à surveiller
*   **\> 160$ / mois** = tu dois resserrer le produit ou le quota
### Conclusion nette
**Oui, 20 clients premium à 20$ peuvent financer les appels API**, même sans compter sur le gratuit, **à condition de cadrer Student AI**.

* * *
## 9\. Ce que tu dois absolument faire dans le produit
## 9.1 Ne jamais proposer “chat illimité” au début
Student AI doit être un **workflow borné**, pas un chat sans fin.
### Bon format
*   explication utilisateur courte ;
*   analyse structurée ;
*   retour limité ;
*   relance ciblée ;
*   fin de session.
### Mauvais format
*   conversation ouverte infinie ;
*   longues sorties non plafonnées ;
*   usage sans quota ;
*   pas de mesure par utilisateur.

* * *
## 9.2 Mettre des plafonds dès le départ
Je recommande pour le début :
*   limite de longueur d’entrée ;
*   limite de longueur de sortie ;
*   nombre de sessions Student AI plafonné par mois ;
*   dégradation douce quand le quota est atteint.
### Exemple de posture produit
*   “Student AI inclus dans l’accès premium fondateur avec usage raisonnable”
*   pas “IA illimitée”.

* * *
## 9.3 Suivre le coût par utilisateur
Tu dois stocker au minimum :
*   `user_id`
*   `model_used`
*   `input_tokens`
*   `output_tokens`
*   `estimated_cost`
*   `feature_name`
*   `timestamp`

Sans ça, tu voles à l’aveugle.

* * *
## 10\. Répartition recommandée pour 20 clients
### Si tu veux rester très prudent
Fixe une cible par client / mois autour de :
*   **5M input**
*   **1M output**
### Ce que cela donne
*   coût AI ≈ **2$ / client**
*   coût total ≈ **40$ / mois** pour 20 clients
### Lecture
C’est probablement **la meilleure zone de départ**.

Tu gardes ainsi une énorme marge pour :
*   erreurs de pricing ;
*   pics d’usage ;
*   test de prompts ;
*   outils annexes.

* * *
## 11\. Ma recommandation finale
### Décision produit
*   **oui**, ton abonnement à **20$** peut tenir pour 20 clients premium ;
*   **oui**, le gratuit peut aider au démarrage ;
*   **non**, il ne faut pas dépendre d’un empilement de free tiers multi-comptes pour servir durablement des clients payants.
### Décision technique
*   remplacer **Gemini 3.1 Flash Lite Preview** par un modèle **stable** ;
*   considérer les free tiers comme **bonus**, pas comme base ;
*   mettre du **routing par modèle** ;
*   imposer des **quotas d’usage Student AI** ;
*   mesurer le **coût par client** dès le jour 1.
### Décision business
À 20 clients × 20$ :
*   ton offre est **potentiellement rentable au niveau API** ;
*   la clé n’est pas le prix unitaire des modèles ;
*   la clé est le **design du produit et des quotas**.

* * *
## 12\. Réponse courte à ta question
**Oui : avec 20 clients premium à 20$, tu peux payer les clés API et rester rentable si Student AI est conçu comme un flux borné, mesuré, et non comme une conversation illimitée.**

Et surtout :

**le vrai risque n’est pas le prix du token ; le vrai risque, c’est un produit sans garde-fous d’usage.**

# NainoForge — Plan de bascule gratuit → payant en 3 phases

## Objectif
Construire une trajectoire réaliste où :
*   tu lances **sans cash initial** ;
*   tu utilises une **stack gratuite temporaire** pendant 1 à 2 semaines ;
*   tu signes les premiers clients premium ;
*   tu réinjectes rapidement les premiers revenus dans des **clés payantes plus stables** ;
*   tu gardes une architecture qui ne casse pas au moment de la bascule.

Le bon état d’esprit n’est pas :
> “comment rester gratuit le plus longtemps possible ?”
Le bon état d’esprit est :
> “comment utiliser le gratuit comme rampe de lancement très courte, puis sécuriser le produit avec une base payante rentable ?”
* * *
## Vue d’ensemble
### Phase 1 — Bootstrap gratuit ultra-court
Durée cible : **7 à 14 jours**
### Phase 2 — Transition financée par les premiers premium
Durée cible : **dès les premiers paiements**, idéalement sans attendre la fin du mois
### Phase 3 — Stabilisation payante et optimisation coût / qualité
Durée cible : **après les premiers 100$+ réinjectés**

* * *
## Phase 1 — Bootstrap gratuit ultra-court
## Objectif
Tenir le lancement initial sans budget, avec un volume faible, un produit borné, et une consommation IA strictement contrôlée.
### Ce que tu fais
*   tu branches plusieurs providers gratuits ou quasi gratuits ;
*   tu mets **LiteLLM** comme routeur unique ;
*   tu n’ouvres pas Student AI à tout le monde ;
*   tu limites très fortement les usages ;
*   tu te sers du gratuit comme **pont temporaire**, pas comme fondation business.
### Règles à imposer dès cette phase
1. **Entrée bornée**
    *   taille max par session
    *   taille max par source si nécessaire
2. **Sortie bornée**
    *   réponses courtes
    *   pas de génération verbeuse inutile
3. **Sessions limitées**
    *   pas de chat illimité
    *   pas de boucle ouverte
4. **Feature gating**
    *   Student AI réservé à un périmètre restreint
5. **Mesure systématique**
    *   tokens input/output
    *   provider choisi
    *   coût estimé
    *   erreurs / fallback
### Ce que tu cherches dans cette phase
*   valider le flow ;
*   éviter les coûts immédiats ;
*   observer la consommation réelle ;
*   obtenir les premiers retours et les premiers paiements.
### Ce qu’il ne faut surtout pas faire
*   promettre une disponibilité robuste “comme un vrai SaaS mature” ;
*   ouvrir le système à trop d’utilisateurs ;
*   rendre Student AI central à tout le produit ;
*   créer des usages longs, bavards ou non plafonnés.
### Critère de sortie de Phase 1
Tu as :
*   un produit qui tourne ;
*   les premiers premium en approche ou déjà onboardés ;
*   un minimum de données de consommation ;
*   une architecture prête à recevoir des clés payantes sans refonte.

* * *
## Phase 2 — Transition financée par les premiers premium
## Objectif
Passer d’un mode “survie intelligente” à un mode “service premium sérieux”.
### Déclencheur conseillé
Dès que tu atteins environ :
*   **5 à 10 clients premium**,
*   ou l’équivalent d’un premier budget API que tu peux immobiliser,
*   ou ton premier seuil de confiance produit.

Tu n’as pas besoin d’attendre une échelle massive.
### Ce que tu fais
*   tu ajoutes tes **premières clés payantes** ;
*   tu choisis un provider principal rentable, potentiellement **ZenMux** si l’offre promotionnelle est réellement avantageuse ;
*   tu gardes LiteLLM comme couche d’orchestration ;
*   tu transformes les providers gratuits en **fallback** plutôt qu’en socle principal.
### Architecture cible pendant cette phase
*   **provider principal payant** = route par défaut
*   **provider(s) gratuit(s)** = secours / comparaison / tests
*   **quotas utilisateur** = déjà actifs
*   **tracking coût** = obligatoire
### Ce que cela change produitivement
Le produit devient plus sérieux sur :
*   la stabilité ;
*   la latence ;
*   la cohérence de réponse ;
*   la capacité à servir les premium sans dépendre d’un free tier fragile.
### Décision importante
À ce stade, il faut considérer que :
*   le gratuit n’est plus ta stratégie ;
*   le gratuit est un **coussin tactique**.
### Critère de sortie de Phase 2
Tu peux dire :
*   “même si les free tiers changent demain, le cœur premium continue de fonctionner.”

Et ça, c’est le vrai seuil de professionnalisation.

* * *
## Phase 3 — Stabilisation payante et optimisation
## Objectif
Transformer la couche IA en système rentable, piloté et durable.
### Ce que tu fais
*   tu consolides le provider principal ;
*   tu optimises la répartition coût / qualité ;
*   tu réserves les modèles plus chers aux tâches qui le justifient vraiment ;
*   tu gardes LiteLLM pour router proprement ;
*   tu ajustes les quotas par utilisateur ou par plan.
### Principes de cette phase
#### 1\. Route par type de tâche
*   scoring simple → provider cheap
*   feedback Student AI standard → provider principal rentable
*   fallback / cas sensibles → provider plus stable ou plus qualitatif
#### 2\. Budget mensuel IA explicite
Tu fixes un plafond clair :
*   global,
*   par utilisateur,
*   par feature.
#### 3\. Feature flags
Tu peux activer / désactiver :
*   Student AI,
*   certains providers,
*   certains flux coûteux,

sans toucher à l’architecture de base.
#### 4\. Révision régulière du routage
Tous les 7 à 14 jours au début, tu regardes :
*   le coût réel ;
*   la qualité réelle ;
*   les erreurs ;
*   les retours utilisateur ;
*   la stabilité des providers.
### Critère de réussite Phase 3
Tu as :
*   un coût IA prévisible ;
*   une marge saine ;
*   une bonne expérience premium ;
*   une dépendance réduite aux promos et aux quotas gratuits.

* * *
## Plan de bascule concret
## Étape 1 — Dès aujourd’hui
Prépare l’architecture **comme si** le payant arrivait demain.
### Donc il faut déjà avoir
*   LiteLLM comme couche unique ;
*   une config provider-agnostic ;
*   des variables d’environnement par provider ;
*   du logging coût / tokens ;
*   un système de priorité / fallback.
### Erreur à éviter
Coder un système “gratuit-only” que tu devras démolir ensuite.

* * *
## Étape 2 — Pendant la fenêtre gratuite
Utilise les providers gratuits pour :
*   tests réels contrôlés ;
*   montée très légère ;
*   comparaison des réponses ;
*   observation du coût futur probable.
### Mais
Même dans cette phase, tu dois te comporter mentalement comme si les appels coûtaient déjà quelque chose.

Autrement dit :
*   pas de gaspillage ;
*   pas d’usage infini ;
*   pas de prompts trop longs sans justification.

* * *
## Étape 3 — Dès les premiers revenus
Injecte vite une première enveloppe API.
### Pourquoi
Parce qu’une fois que des clients payent :
*   tu ne veux pas dépendre d’un quota gratuit qui saute ;
*   tu veux contrôler la qualité ;
*   tu veux sécuriser la continuité de service.
### Recommandation
Le premier argent premium doit prioritairement servir à :

1. sécuriser les clés API ;
2. sécuriser la qualité/stabilité ;
3. réduire le risque opérationnel.

* * *
## Répartition recommandée par phase

| Phase | Provider gratuit | Provider payant | Rôle de LiteLLM |
| ---| ---| ---| --- |
| Phase 1 | principal | absent ou minimal | router + fallback + logs |
| Phase 2 | fallback | principal | orchestrateur central |
| Phase 3 | secondaire / tactique | socle de production | optimisation coût / qualité |

* * *
## Seuils de décision recommandés
### Basculer vers le payant dès qu’un de ces signaux apparaît
*   premiers clients premium actifs ;
*   plus de 50% des usages critiques reposent encore sur des free tiers ;
*   erreur ou saturation fréquente d’un provider gratuit ;
*   besoin de stabilité plus forte ;
*   premiers retours clients où la qualité de réponse compte réellement.
### Ne pas attendre
*   100 utilisateurs ;
*   une grosse croissance ;
*   “d’être parfaitement prêt”.

La bascule payante n’est pas une question d’échelle. C’est une question de **fiabilité produit**.

* * *
## Ce que ce plan protège
Ce plan te protège contre 4 erreurs classiques :

1. **s’enfermer dans le gratuit**
2. **surconstruire trop tôt le payant**
3. **lancer sans logs de coût**
4. **faire une bascule douloureuse plus tard**

* * *
## Recommandation finale
Le meilleur chemin pour toi est :
*   **Phase 1** : survivre intelligemment avec le gratuit pendant 1 à 2 semaines ;
*   **Phase 2** : sécuriser très vite une première base payante grâce aux premiers premium ;
*   **Phase 3** : optimiser le routage et faire de ZenMux ou d’un provider équivalent ton socle rentable.

En une phrase :
> **n’utilise pas le gratuit pour éviter le payant ; utilise le gratuit pour atteindre le payant dans de bonnes conditions.**

# NainoForge — Architecture de transition LiteLLM + ZenMux

## Objectif de cette architecture
Construire une architecture qui permet :
*   de démarrer avec des providers gratuits ou quasi gratuits ;
*   de router intelligemment les appels IA ;
*   de fallback automatiquement si un provider est limité ou indisponible ;
*   de basculer ensuite vers **ZenMux comme provider principal payant** ;
*   de garder la même colonne vertébrale technique avant et après la bascule.

L’idée centrale est simple :
> **LiteLLM ne sert pas seulement à “router des clés”. Il sert à séparer le produit de la dépendance à un provider unique.**
* * *
## 1\. Principe directeur
### Le produit ne doit jamais appeler directement un provider
Le frontend ou les Edge Functions ne doivent pas appeler :
*   ZenMux directement,
*   Gemini directement,
*   QwQ directement.

Ils doivent appeler **une seule porte d’entrée IA interne**.
### Cette porte d’entrée peut être
*   une Edge Function dédiée,
*   ou un petit service backend léger,
*   ou un routeur API protégé.

Cette porte d’entrée parle ensuite à **LiteLLM**, qui parle aux providers.

* * *
## 2\. Architecture cible

```plain
Chrome Extension / Side Panel
        │
        ▼
Backend léger / Edge Function IA
        │
        ▼
LiteLLM Router
        │
        ├── Provider A gratuit / cheap
        ├── Provider B gratuit / cheap
        ├── Provider C gratuit / cheap
        └── ZenMux (payant, futur provider principal)
```

### Lecture
*   le produit parle à **un endpoint interne stable** ;
*   LiteLLM choisit le provider ;
*   les providers peuvent changer sans casser le produit ;
*   ZenMux peut devenir principal sans refonte de l’extension.

* * *
## 3\. Composants recommandés
### 3.1 Extension
### Rôle
*   collecte la requête utilisateur ;
*   envoie une demande structurée au backend ;
*   n’expose jamais les clés API ;
*   affiche la réponse.
### À éviter
*   appels directs depuis l’extension vers les providers externes ;
*   stockage de clés API côté client ;
*   logique de fallback dans le frontend.

* * *
### 3.2 Edge Function / Backend IA Gateway
### Rôle
C’est la couche de contrôle métier.
### Responsabilités
*   authentifier l’utilisateur ;
*   vérifier son plan ;
*   vérifier ses quotas ;
*   déterminer le type de tâche ;
*   appeler LiteLLM avec la bonne stratégie ;
*   logger tokens, coût estimé, provider utilisé, temps de réponse.
### Cette couche décide notamment
*   si l’utilisateur a droit à Student AI ;
*   quel budget de tokens reste disponible ;
*   si on doit appeler un provider cheap, ZenMux, ou fallback.

* * *
### 3.3 LiteLLM Router
### Rôle
*   uniformiser l’appel aux providers ;
*   gérer fallback, priorités, timeouts ;
*   offrir une interface standardisée ;
*   faciliter le passage du gratuit au payant.
### Pourquoi LiteLLM est utile ici
Parce qu’il permet de garder :
*   une config centralisée ;
*   des stratégies de routing ;
*   des modèles interchangeables ;
*   une bonne base de monitoring.

* * *
### 3.4 Providers
### Au démarrage
*   2 à 3 providers gratuits ou peu coûteux
*   1 ZenMux prêt mais pas forcément principal
### Après bascule
*   ZenMux devient principal
*   les autres restent fallback / backup / comparaison / test

* * *
## 4\. Logique de routing recommandée
Je recommande un routing **par type de tâche**, pas seulement “par provider disponible”.

* * *
## Route 1 — Tâches cheap / simples
### Exemples
*   classification
*   extraction de concepts simple
*   score de profondeur simple
*   reformulation courte
*   vérification légère
### Stratégie
*   provider le moins cher ou gratuit
*   timeout court
*   fallback automatique si échec
### Objectif
Économiser le budget premium.

* * *
## Route 2 — Student AI standard
### Exemples
*   analyse d’explication utilisateur
*   retour structuré sur couverture / cohérence / profondeur
### Stratégie
*   provider principal prévu pour ce flux
*   au départ : gratuit/cheap si contrôlé
*   après transition : **ZenMux de préférence** si rentable et stable
### Objectif
Faire du premium sur la vraie valeur perçue.

* * *
## Route 3 — Fallback / secours qualité
### Exemples
*   provider principal saturé
*   réponse vide
*   erreur fournisseur
*   cas délicat ou tâche plus longue
### Stratégie
*   deuxième provider ;
*   éventuellement Gemini stable ;
*   ou ZenMux selon la phase de vie.

* * *
## 5\. Ordre recommandé de fallback
## Phase bootstrap
1. provider gratuit A
2. provider gratuit B
3. provider gratuit C
4. ZenMux si activé en secours payant
## Phase transition
1. ZenMux
2. provider gratuit le plus fiable
3. autre provider secondaire
4. dernier fallback stable
## Phase stabilisée
1. ZenMux principal
2. fallback économique
3. fallback qualité
4. arrêt propre si quota atteint
### Point important
Le fallback ne doit pas être “invisible” si la qualité baisse fortement. Tu peux garder ça transparent côté produit si nécessaire.

* * *
## 6\. Règles de décision côté gateway
La gateway doit pouvoir répondre à ces questions avant chaque appel :

1. quel est le type de tâche ?
2. quel est le plan utilisateur ?
3. Student AI est-il activé ?
4. combien de tokens / budget cet utilisateur a-t-il déjà consommé ?
5. quel provider est prioritaire aujourd’hui ?
6. quel provider est disponible ?
7. quel est le fallback autorisé ?

Sans cette couche, LiteLLM seul ne suffit pas à faire un produit premium piloté.

* * *
## 7\. Exemple de politique de routing
### Politique simple

```plain
if feature != student_ai:
  route -> cheap_pool

if feature == student_ai and user.plan == premium and user.student_ai_enabled == true:
  route -> primary_premium_pool

if primary_premium_pool fails:
  route -> fallback_pool

if user.quota_exceeded:
  deny or degrade gracefully
```

### Traduction métier
*   fonctionnalités simples → coût minimum
*   Student AI → pool premium
*   panne ou saturation → fallback
*   quota dépassé → arrêt ou dégradation contrôlée

* * *
## 8\. Pools recommandés
### `cheap_pool`
Usage :
*   classification
*   enrichissement léger
*   scoring simple
*   tâches internes peu visibles
### `premium_pool`
Usage :
*   Student AI
*   feedback utilisateur premium
*   flux à forte valeur perçue
### `fallback_pool`
Usage :
*   continuité de service
*   secours en cas de limite ou panne
### `experimental_pool`
Usage :
*   tests A/B
*   comparaison de qualité
*   bench provider

C’est très utile si tu veux faire évoluer le routing sans casser la prod.

* * *
## 9\. Ce qu’il faut logger
### Par appel
*   `user_id`
*   `feature_name`
*   `provider_requested`
*   `provider_used`
*   `model_name`
*   `input_tokens`
*   `output_tokens`
*   `estimated_cost`
*   `response_time_ms`
*   `fallback_triggered`
*   `error_code`
*   `timestamp`
### Pourquoi c’est indispensable
Parce que c’est ce qui te permettra de savoir :
*   si ZenMux est réellement rentable ;
*   si les free tiers tiennent le choc au bootstrap ;
*   quel provider te coûte trop cher ;
*   où la qualité baisse ;
*   quand basculer plus vite vers le payant.

* * *
## 10\. Sécurité
### Règles non négociables
*   clés API jamais exposées au client ;
*   clés stockées uniquement côté backend ;
*   rotation des clés centralisée ;
*   quotas contrôlés côté serveur ;
*   logs de sécurité minimaux mais présents.
### Erreur à éviter
Faire porter la logique de provider ou de clé par le frontend.

* * *
## 11\. Bascule vers ZenMux
### Quand faire de ZenMux le principal
Dès que :
*   tu as du revenu premium ;
*   la promo est économiquement intéressante ;
*   le coût réel est bon ;
*   la stabilité te convient.
### Ce qui change techniquement
Presque rien dans le produit, si l’architecture est bien faite.

Tu modifies surtout :
*   les priorités LiteLLM ;
*   la config des pools ;
*   les secrets côté backend ;
*   les règles de fallback.
### C’est précisément ce qu’on veut
Une bascule économique et stratégique, **pas une réécriture**.

* * *
## 12\. Exemple de séquence de vie
### Semaine 1
*   cheap\_pool = principal
*   ZenMux = standby
*   quotas stricts
*   faible trafic
### Semaine 2
*   premiers premium
*   ZenMux activé sur Student AI
*   cheap\_pool conserve les tâches de support
### Semaine 3+
*   ZenMux principal sur premium flows
*   cheap\_pool en économie / secours
*   fallback stable configuré

* * *
## 13\. Ce que cette architecture t’apporte
### 1\. Vitesse de démarrage
Tu peux lancer sans budget important.
### 2\. Bascule propre
Tu peux investir 100$+ en clés sans refondre le produit.
### 3\. Contrôle du coût
Tu peux router selon la valeur métier.
### 4\. Résilience
Si un provider casse, le produit ne tombe pas immédiatement.
### 5\. Vision long terme
Tu prépares une stack sérieuse sans sur-ingénierie excessive.

* * *
## 14\. Recommandation finale
La bonne architecture pour ton cas est :
*   **LiteLLM comme colonne vertébrale de routage** ;
*   **une gateway backend métier** qui contrôle plans, quotas et choix de route ;
*   **ZenMux comme futur provider principal** une fois les premiers revenus obtenus ;
*   **les providers gratuits comme tremplin puis fallback**, pas comme fondation permanente.

En une phrase :
> **construis dès maintenant une architecture qui sait vivre avec le gratuit, mais qui est déjà prête à gagner en sérieux le jour où ZenMux devient ton socle payant.**

# NainoForge — Ajustement produit : Web App complète + Extension

## Changement de direction produit
Tu viens de préciser un point **très important** :

NainoForge ne doit **pas** être pensé comme une simple extension avec un side panel comme surface principale.

Tu veux un produit à **double surface** :

1. une **extension** pour capturer, injecter le produit dans le contexte du navigateur et déclencher certaines actions ;
2. une **web app complète**, plus riche, plus premium, plus polie, qui porte l’expérience principale — un peu dans l’esprit d’un produit comme Monica, mais avec ta logique de forge cognitive.

Mon avis : **c’est une meilleure direction produit**.

* * *
## 1\. Ce que cela change dans la vision du produit
### Avant
La lecture précédente était :
*   extension-first ;
*   side panel comme cœur de l’expérience ;
*   web surtout optionnel ou secondaire.
### Maintenant
La bonne lecture devient :
*   **web app comme produit principal** ;
*   **extension comme bras d’acquisition, de capture et de contextualisation** ;
*   side panel utile, mais **pas unique surface d’expérience**.
### Pourquoi c’est plus fort
Parce que certaines expériences ont besoin de :
*   plus d’espace visuel ;
*   meilleure hiérarchie typographique ;
*   vraie profondeur d’interface ;
*   confort de lecture et d’écriture ;
*   sentiment premium.

Et tu as raison :
*   **IMPRINT** ne doit pas ressembler à un simple champ de texte étroit ;
*   **Student AI** ne doit pas ressembler à un gadget de side panel ;
*   la carte ou l’espace de travail doit être **stylé, propre, immersif, lisible, sérieux**.

* * *
## 2\. Répartition recommandée des surfaces
## 2.1 Extension
### Rôle
L’extension sert à :
*   capturer une page, vidéo, source ou contexte ;
*   envoyer rapidement vers NainoForge ;
*   afficher des actions contextuelles rapides ;
*   ouvrir l’expérience complète dans la web app ;
*   offrir un side panel léger si utile.
### Ce qu’elle ne doit pas porter seule
*   les longues sessions IMPRINT ;
*   les sessions Student AI les plus riches ;
*   les dashboards complexes ;
*   la navigation profonde dans COSMOS.
### En une phrase
L’extension est le **point d’entrée contextuel**, pas la totalité du produit.

* * *
## 2.2 Web App
### Rôle
La web app devient la **surface premium principale**.

Elle porte :
*   IMPRINT long et confortable ;
*   Student AI en espace de travail riche ;
*   dashboards de progression ;
*   sessions de review structurées ;
*   bundle / historique / paramètres ;
*   plus tard COSMOS et les graphes conceptuels.
### Pourquoi c’est la bonne surface
Parce que la web app peut offrir :
*   une largeur utile ;
*   une meilleure mise en page ;
*   des composants plus riches ;
*   un niveau de polish beaucoup plus fort ;
*   une sensation de vrai produit premium.

* * *
## 3\. Recommandation produit par feature
## 3.1 Capture
### Surface principale
*   **Extension**
### Surface secondaire
*   web app pour retrouver / organiser / relancer les captures
### Logique
La capture doit rester frictionless, donc l’extension est le bon endroit.

* * *
## 3.2 IMPRINT
### Surface principale
*   **Web app**
### Surface secondaire
*   side panel pour brouillon rapide ou transition
### Raisons
Tu as entièrement raison ici :

IMPRINT a besoin de :
*   confort d’écriture ;
*   vraie densité visuelle ;
*   feedback lisible ;
*   style premium ;
*   sensation d’atelier, pas de mini-widget.
### Recommandation d’UX
Traiter IMPRINT comme une **carte de forge** ou un **workspace d’écriture guidée**, pas comme un simple chat ni un textarea banal.

* * *
## 3.3 Student AI
### Surface principale
*   **Web app**
### Surface secondaire
*   side panel pour notifications ou relances courtes
### Logique produit
Student AI n’est pas un assistant qui “fait à la place”.

Dans ton concept, l’utilisateur devient **celui qui explique à l’IA**. Donc l’interface doit soutenir :
*   la prise de parole écrite ;
*   la confrontation douce ;
*   le feedback structuré ;
*   le rythme d’un échange de compréhension.
### Conclusion UX
Cela ressemble plus à :
*   un **workspace d’explication guidée**,

qu’à :
*   un petit chat banal dans une colonne étroite.

* * *
## 3.4 Review / flashcards
### Surface recommandée
*   les deux peuvent exister
### Extension
*   micro review rapide
*   rappels
*   sessions très courtes
### Web app
*   vraie session de review
*   historique
*   progression
*   gestion plus confortable

* * *
## 3.5 COSMOS / dashboard
### Surface principale
n
*   **Web app**
### Pourquoi
COSMOS a besoin de place, de clarté et de respiration visuelle. C’est une feature de profondeur produit, donc elle doit vivre dans une interface large.

* * *
## 4\. Architecture produit recommandée
## Modèle cible

```text
Extension Chrome
  ├─ Capture contextuelle
  ├─ Actions rapides
  ├─ Side panel léger
  └─ Ouverture vers Web App

Web App
  ├─ IMPRINT workspace
  ├─ Student AI workspace
  ├─ Review dashboard
  ├─ Progression / metrics
  ├─ Settings / billing
  └─ Plus tard : COSMOS complet
```

### Lecture stratégique
*   l’extension attire et ancre l’usage ;
*   la web app transforme l’usage en expérience premium complète.

* * *
## 5\. Implication stack
Ce changement pousse fortement vers une architecture **web app + extension unifiées**.
### Recommandation stack frontend
*   **Next.js** ou framework web React sérieux pour la web app
*   **WXT** pour l’extension
*   **shared design system** commun
*   **shared domain packages** entre web app et extension
### Pourquoi
Tu veux maintenant :
*   deux surfaces cohérentes ;
*   mêmes entités métier ;
*   même logique produit ;
*   même identité visuelle ;
*   même auth et même backend.
### Architecture recommandée

```text
apps/
  web/
  extension/

packages/
  ui/
  domain/
  student-ai/
  imprint/
  review/
  shared/
```

Cela devient encore plus pertinent que dans la version purement extension-first.

* * *
## 6\. Implication business
C’est aussi meilleur pour le premium.
### Pourquoi
Un utilisateur qui paie 20$ par mois attend plus facilement :
*   une vraie interface ;
*   un espace de travail propre ;
*   une impression de produit sérieux ;
*   un confort d’usage supérieur.

Une simple extension, surtout si elle repose trop sur un side panel, peut parfois paraître trop étroite pour soutenir une perception premium forte.

La web app corrige ça.

* * *
## 7\. Recommandation UX très concrète
## IMPRINT
Ne pas le dessiner comme :
*   un chat ;
*   un panneau étroit ;
*   un bloc gris standard.

Le dessiner comme :
*   une **carte immersive de forge** ;
*   une interface d’écriture premium ;
*   une page ou modal large avec typographie soignée, aides contextuelles, feedback clair et rythme visuel fort.
## Student AI
Ne pas le dessiner comme :
*   un assistant qui parle trop ;
*   une zone banale de questions/réponses.

Le dessiner comme :
*   un **espace d’explication active** ;
*   l’utilisateur au centre ;
*   l’IA comme miroir, contradicteur doux, révélateur de lacunes.

Tu as raison : la posture produit doit être visible dans l’interface.

* * *
## 8\. Recommandation finale
Je valide fortement cette nouvelle direction :
*   **web app complète comme produit principal** ;
*   **extension comme point d’entrée contextuel et canal de capture** ;
*   **side panel utile mais secondaire** ;
*   **IMPRINT et Student AI portés par une interface large, polie, premium et pensée comme workspace**.

En une phrase :
> **NainoForge ne doit pas ressembler à une petite extension augmentée, mais à un vrai produit premium de forge cognitive, dont l’extension est la porte d’entrée — pas la prison de l’expérience.**

# NainoForge — Student AI : ce qu’il faut encore ajouter pour devenir vraiment disruptif

## Contexte
Tu m’as demandé de lire tes deux fichiers sur STUDENT AI / Teach-Back et de répondre à une question précise :
> **Est-ce qu’il manque encore des choses pour que Student AI atteigne un niveau réellement disruptif — au point que l’utilisateur ne se dise pas “je peux juste refaire ça avec un prompt ChatGPT” ?**
Ma réponse courte est :

**oui, tes bases sont déjà très fortes, mais il manque encore plusieurs briques décisives pour franchir ce cap.**

Et le point important est le suivant :
> le niveau “disruptif” ne viendra pas surtout d’un meilleur prompt.  
> Il viendra d’un **système interactif, stateful, instrumenté, incarné et enraciné dans les traces réelles de l’utilisateur**.
* * *
## 1\. Ce que tes fichiers font déjà très bien
D’abord, il faut être juste : ce que tu as écrit est déjà **au-dessus d’un simple prompt engineering**.
### Tes vraies forces actuelles
#### 1\. Séparation pédagogie / LLM
C’est probablement l’une des décisions les plus importantes.

Le fait que :
*   la stratégie pédagogique soit déterministe,
*   le LLM ne fasse “que rédiger”,
*   l’analyse cognitive soit ailleurs,

crée déjà un vrai fossé avec une approche naïve “je mets un prompt dans ChatGPT”.
#### 2\. Passage d’une évaluation binaire à une évaluation structurelle
Avec :
*   **MSS**,
*   **profondeur conceptuelle 0–7**,
*   **profils d’explication**,
*   **confidence gap**,
*   **FSRS étendu**,

tu bascules d’un tuteur IA “qui note une réponse” vers un moteur qui tente de modéliser **comment la compréhension est organisée dans l’esprit**.

C’est beaucoup plus sérieux.
#### 3\. Intégration avec le reste du système
Le fait que Student AI soit relié à :
*   IMPRINT,
*   COSMOS,
*   FSRS,
*   les traces d’autonomie,
*   les priorités de remédiation,

crée une vraie valeur système. Là encore, ce n’est déjà plus un simple “chat intelligent”.
#### 4\. Positionnement pédagogique fort
La philosophie teach-back est bonne.

Le fait que l’utilisateur **explique à l’IA**, au lieu d’être évalué passivement, change réellement la relation au savoir.

* * *
## 2\. Malgré cela, qu’est-ce qui manque encore pour être vraiment “disruptif” ?
Voici mon verdict net :

Aujourd’hui, ton moteur est déjà **très bon conceptuellement**, mais il lui manque encore 6 briques pour devenir :
*   difficile à copier,
*   émotionnellement crédible,
*   cognitivement plus profond,
*   clairement supérieur à un “prompt de student envoyé à ChatGPT”.

* * *
## 3\. Brique manquante n°1 — Une vraie sensation de présence relationnelle
### Problème actuel
Même avec une excellente stratégie pédagogique, l’utilisateur peut encore se dire :
> “c’est un moteur d’analyse qui me pose des questions.”
Mais toi, tu veux qu’il sente :
> “j’explique à quelqu’un.”
Et ça change tout.
### Ce qu’il manque
Il manque une couche de **présence relationnelle persistante**.

Pas forcément un avatar 3D. Pas forcément de la voix dès le MVP.

Mais il faut au minimum :
*   une **persona cohérente et mémorisée** ;
*   une façon stable d’être surpris, hésitant, convaincu, confus, rassuré ;
*   des **réactions conversationnelles qui dépendent vraiment de ce que l’utilisateur vient de dire** ;
*   des **callbacks** vers les explications précédentes ;
*   un sentiment que l’interlocuteur “a suivi” et “a retenu”.
### Ce qu’il faut ajouter
Créer un composant du type :

**`RelationalStateEngine`**

Qui maintient pour chaque session :
*   niveau de compréhension perçue du “student” ;
*   points de confusion encore ouverts ;
*   tonalité de la relation (curieux, prudent, sceptique, débloqué, impressionné) ;
*   mémoire locale de la conversation en tant qu’expérience, pas juste historique brut.
### Pourquoi c’est disruptif
Parce qu’un prompt ChatGPT standard ne te donne pas naturellement cette **continuité affective et cognitive d’un interlocuteur**.

* * *
## 4\. Brique manquante n°2 — Un moteur d’interruptions intelligentes en temps réel
### Problème actuel
Tes docs parlent beaucoup d’analyse, d’évaluation, de stratégie… mais encore pas assez de la **mise en scène interactive** du moment où l’utilisateur explique.

Or ce qui donne l’impression d’expliquer à une personne, ce n’est pas seulement la qualité de la question.

C’est aussi le fait que l’autre :
*   interrompe au bon moment,
*   dise “attends”,
*   demande une clarification précise,
*   manifeste une incompréhension localisée,
*   reformule ce qu’il croit avoir compris,
*   te fasse sentir que ton explication a un effet sur lui.
### Ce qu’il faut ajouter
Un composant du type :

**`TurnInterruptionEngine`**

Avec des primitives comme :
*   `clarify_here`
*   `slow_down`
*   `define_term`
*   `give_example`
*   `i_lost_the_thread`
*   `what_follows_from_that`
*   `why_should_i_believe_this`
### Ce que ça change
Au lieu d’un flux :
*   explication longue,
*   analyse,
*   question,

on obtient un flux plus vivant :
*   explication,
*   micro-réaction,
*   interruption ciblée,
*   reprise,
*   reformulation,
*   challenge.
### Pourquoi c’est crucial
Sans cela, Student AI restera fort analytiquement, mais pas encore **incarné interactionnellement**.

* * *
## 5\. Brique manquante n°3 — Un ancrage fort dans les artefacts réels de l’utilisateur
### Problème actuel
Tes specs relient Student AI au système global, ce qui est bien. Mais il faut aller encore plus loin :

l’utilisateur doit sentir que Student AI ne parle **pas d’un concept abstrait**, mais de **son propre travail cognitif**.
### Ce qu’il faut ajouter
Student AI doit être explicitement branché sur :
*   le dernier IMPRINT exact ;
*   les concepts mal reliés dans COSMOS ;
*   les erreurs passées de teach-back ;
*   les leeches ;
*   les cartes revues ou ratées ;
*   les formulations déjà utilisées par l’utilisateur ;
*   les métaphores qui fonctionnent le mieux pour lui.
### Ajout recommandé
Un composant du type :

**`LearnerEvidencePack`**

qui assemble avant chaque session :
*   artefacts d’apprentissage récents,
*   concepts fragiles,
*   erreurs récurrentes,
*   profils d’explication,
*   zones d’illusion de compétence,
*   historique de remédiation.
### Pourquoi c’est différenciant
Parce qu’un simple prompt ChatGPT n’a généralement pas cette **mémoire structurée et exploitable du passé réel de l’apprenant**.

* * *
## 6\. Brique manquante n°4 — Des “modes d’épreuve” variés, pas seulement un dialogue
### Problème actuel
Teach-back reste encore principalement pensé comme :
*   l’utilisateur explique,
*   le moteur analyse,
*   l’IA relance.

C’est déjà bien, mais encore insuffisant pour rendre le système difficile à imiter.
### Ce qu’il faut ajouter
Créer plusieurs **formats d’épreuve cognitive**.

Exemples :
#### Mode 1 — Explain straight
L’utilisateur explique librement.
#### Mode 2 — Rebuild from fragments
L’IA donne 3 éléments dispersés et l’utilisateur doit reconstruire la logique.
#### Mode 3 — Teach to a confused student
L’IA simule une incompréhension réaliste et persistante.
#### Mode 4 — Contrast duel
L’utilisateur doit distinguer deux concepts très proches.
#### Mode 5 — Transfer under pressure
L’utilisateur doit réappliquer l’idée dans un nouveau contexte.
#### Mode 6 — Minimal explanation
L’utilisateur doit expliquer avec une contrainte forte : 3 phrases, un exemple, une analogie.
### Pourquoi c’est fort
Parce que là, tu ne vends plus “une conversation IA”.
Tu vends un **moteur de mise à l’épreuve cognitive**.

* * *
## 7\. Brique manquante n°5 — Une dramaturgie de session
### Problème actuel
Même un système très intelligent peut sembler mécanique si la session n’a pas de rythme.
### Ce qu’il faut ajouter
Une session Student AI doit avoir une **dramaturgie**.

Exemple :

1. ouverture
2. première explication
3. point de friction
4. tentative de clarification
5. question plus profonde
6. moment de bascule
7. synthèse
8. point d’amélioration ciblé
### Ajout recommandé
Un orchestrateur du type :

**`SessionArcEngine`**

avec des états comme :
*   `opening`
*   `probe`
*   `confusion`
*   `repair`
*   `transfer`
*   `reflection`
*   `closure`
### Pourquoi c’est important
Cela donne au produit une sensation d’expérience construite, et non de simple échange question-réponse.

* * *
## 8\. Brique manquante n°6 — Un vrai moat anti-copiage
### Problème actuel
Même si ton architecture est meilleure qu’un prompt ChatGPT, un utilisateur très malin pourrait encore dire :
> “je peux bricoler quelque chose qui ressemble.”
### La vraie réponse
Il faut que la valeur de Student AI dépende de choses qu’un prompt seul ne possède pas.
### Le moat doit venir de 5 couches combinées
1. **le Learner Model persistant**
2. **les traces d’usage réelles**
3. **les évaluations déterministes et scores propriétaires**
4. **les modes d’épreuve variés**
5. **la projection dans le reste du système** (FSRS, COSMOS, remédiation, bundle, roadmap cognitive)
### Donc la phrase produit implicite doit devenir
> “Tu ne parles pas à un chatbot. Tu interagis avec un système qui connaît ta trajectoire d’apprentissage, détecte tes schémas de compréhension, et te confronte de manière adaptive.”
Là, on sort vraiment du simple prompt.

* * *
## 9\. Ce que j’ajouterais concrètement IN\_MVP
Si je devais prioriser ce qu’il faut vraiment ajouter vite, sans surcharger le MVP, je prendrais ceci :
### IN\_MVP — Priorité très haute
#### A. `RelationalStateEngine`
Pour donner une sensation de continuité de personne.
#### B. `LearnerEvidencePack`
Pour ancrer chaque session dans les vraies traces du user.
#### C. `TurnInterruptionEngine`
Pour casser l’effet “chatbot passif”.
#### D. `SessionArcEngine`
Pour donner un rythme et une progression à la session.
#### E. 3 à 4 formats d’épreuve distincts
Pas seulement l’explication libre.

* * *
## 10\. Ce que je mettrais en V1 / post-MVP proche
### V1
*   détection émotionnelle légère dans le ton de la session ;
*   mémoire des formulations pédagogiques efficaces ;
*   générateur de confusion ciblée plus réaliste ;
*   visualisation de progression de la qualité d’enseignement ;
*   remédiation personnalisée entre sessions.
### Plus tard
*   voix / audio / présentation orale ;
*   mode interlocuteur plus incarné ;
*   présence semi-avatarisée ;
*   intelligence collective plus avancée.

* * *
## 11\. Ce que je ne recommande pas comme premier différenciateur
Je ne recommande pas de croire que la disruption viendra d’abord de :
*   la voix,
*   un avatar,
*   un skin visuel spectaculaire,
*   un prompt encore plus “smart”.

Ce sont des amplificateurs.
Pas le noyau de différence.

Le noyau, c’est :
*   **la mémoire pédagogique**,
*   **les interruptions intelligentes**,
*   **les preuves cognitives accumulées**,
*   **l’adaptation structurée**,
*   **les épreuves variées**,
*   **l’intégration système**.

* * *
## 12\. Recommandation finale
### Mon verdict honnête
Tes fichiers sont déjà **très solides**.
Ils vont déjà plus loin qu’un “chat IA un peu mieux prompté”.

Mais pour atteindre le niveau où l’utilisateur se dit réellement :
> “je suis en train d’expliquer à quelqu’un, et ce quelqu’un me fait progresser d’une manière que je ne peux pas reproduire avec un simple prompt”,
il faut encore ajouter :

1. **une présence relationnelle persistante** ;
2. **des interruptions intelligentes** ;
3. **un ancrage fort dans les traces réelles de l’utilisateur** ;
4. **des formats d’épreuve multiples** ;
5. **une dramaturgie de session** ;
6. **un moat basé sur le learner model, pas sur le prompt**.
### En une phrase
> **La vraie disruption de Student AI ne viendra pas du fait qu’il parle bien, mais du fait qu’il agit comme un interlocuteur stateful, instrumenté, adaptatif et enraciné dans la trajectoire cognitive unique de l’utilisateur.**

# NainoForge — Student AI : Spécification finale complète

## Statut du document
**Document de synthèse final** combinant :
*   les deux documents source fournis sur STUDENT AI / Teach-Back ;
*   les améliorations architecturales déjà identifiées ;
*   les ajouts nécessaires pour faire de Student AI une expérience **réellement disruptive**, difficile à reproduire par un simple prompt externe.

L’objectif de cette version finale est de poser une vision unifiée, exploitable comme **spécification produit + architecture conceptuelle**.

* * *
## 1\. Vision produit
STUDENT AI n’est pas un chatbot pédagogique.

Ce n’est pas non plus un moteur qui “teste” l’utilisateur avec des questions plus ou moins bien promptées.

STUDENT AI doit devenir :
> **un interlocuteur cognitif stateful qui pousse l’utilisateur à enseigner, reconstruire, clarifier, défendre et transférer sa compréhension jusqu’à produire une preuve de maîtrise difficile à falsifier.**
La différence fondamentale avec une conversation classique avec ChatGPT est la suivante :
*   ChatGPT peut simuler un étudiant ;
*   STUDENT AI doit devenir un **système d’épreuve, de mémoire, de remédiation et de progression**.

Autrement dit :
*   il ne doit pas seulement “parler comme un étudiant” ;
*   il doit **se comporter comme un apprenant cohérent, situé, persistant et relié aux traces réelles de l’utilisateur**.

* * *
## 2\. Philosophie pédagogique
### 2.1 Teach-back comme cœur du moteur
Le principe central reste intact :
*   l’utilisateur apprend en **enseignant** ;
*   la qualité de la compréhension se révèle dans la capacité à :
    *   structurer,
    *   expliquer,
    *   illustrer,
    *   distinguer,
    *   justifier,
    *   réutiliser.
### 2.2 Inversion du paradigme tutoriel
STUDENT AI n’est pas un professeur qui “récite puis vérifie”.

C’est un **miroir cognitif actif** qui :
*   écoute ;
*   interrompt ;
*   demande de clarifier ;
*   met en tension la compréhension ;
*   révèle les angles morts ;
*   teste la transférabilité de ce qui est enseigné.
### 2.3 But réel
Le but n’est pas seulement :
*   de savoir si l’utilisateur “connaît” le concept.

Le but est de savoir :
*   comment le concept est organisé dans son esprit ;
*   s’il peut le transmettre sans notes ;
*   s’il peut le relier à d’autres idées ;
*   s’il peut le défendre sous friction ;
*   s’il peut l’appliquer dans un autre contexte ;
*   s’il surestime ou sous-estime sa maîtrise.

* * *
## 3\. Ce que STUDENT AI mesure déjà très bien
Les deux documents source posent déjà une base puissante. Elle doit être conservée.
### 3.1 Mental Structure Score (MSS)
Le MSS est une dimension centrale. Il permet de mesurer :
*   ordre logique ;
*   hiérarchie ;
*   causalité ;
*   dépendances ;
*   raisonnement progressif.
### 3.2 Profondeur conceptuelle (0–7)
La profondeur conceptuelle est une amélioration excellente, car elle remplace le présent/absent par une graduation réelle :

1. absent
2. cité
3. défini
4. expliqué
5. relié
6. illustré
7. justifié
8. réutilisé
### 3.3 Séparation pédagogie / LLM
Cette décision est essentielle et doit rester **non négociable**.
*   l’analyse pédagogique est déterministe ;
*   la stratégie est choisie par un moteur interne ;
*   le LLM ne sert qu’à formuler / rendre / styliser l’interaction.
### 3.4 Boucle métacognition
La métacognition doit rester intégrée au système :
*   ce que l’utilisateur pense avoir compris ;
*   ce qu’il aurait changé en refaisant son explication ;
*   où il sent lui-même ses zones d’incertitude.
### 3.5 Recalibration FSRS étendue
Très bon choix : la session Teach-Back ne doit pas seulement produire un rapport, mais aussi ajuster :
*   stabilité ;
*   difficulté ;
*   confiance ;
*   besoin de remédiation ;
*   priorité pédagogique.
### 3.6 Profils d’explication
La reconnaissance de profils d’explication est importante pour personnaliser l’interaction. Il faut la garder.
### 3.7 Visualisation COSMOS
La projection dans COSMOS est une vraie force systémique, à condition qu’elle reste lisible et utile.

* * *
## 4\. Ce qu’il faut ajouter pour franchir le cap disruptif
C’est ici que se joue la différence décisive.

Les documents source rendent Student AI **fort analytiquement**.

Mais pour devenir **disruptif**, il faut ajouter une couche de :
*   présence ;
*   interaction ;
*   mémoire ;
*   dramaturgie ;
*   diversité d’épreuves.

Je recommande d’ajouter 5 nouveaux moteurs IN\_MVP ou V1 proche.

* * *
## 5\. Nouveau moteur A — RelationalStateEngine
### Rôle
Créer la sensation qu’il y a **quelqu’un en face**, et pas seulement un moteur analytique.
### Problème adressé
Sans cela, même une bonne stratégie peut encore ressembler à :
*   une série de questions très intelligentes,
*   mais pas à une vraie présence relationnelle.
### Ce moteur maintient
*   niveau de compréhension perçue du “student” ;
*   zones de confusion encore ouvertes ;
*   niveau de confiance du student ;
*   tonalité de l’échange ;
*   souvenirs locaux de la session ;
*   callbacks vers ce qui a déjà été expliqué.
### États relationnels possibles
*   curieux
*   perdu
*   presque convaincu
*   confus sur un point précis
*   sceptique bienveillant
*   rassuré
*   impressionné mais pas encore aligné
### Effet produit
L’utilisateur sent que l’interlocuteur :
*   suit vraiment ;
*   retient ce qu’il vient d’entendre ;
*   réagit de manière cohérente ;
*   évolue dans sa compréhension.

* * *
## 6\. Nouveau moteur B — TurnInterruptionEngine
### Rôle
Produire des **interruptions intelligentes** pendant l’explication.
### Pourquoi c’est crucial
Une vraie personne ne laisse pas toujours l’autre faire un long monologue propre jusqu’au bout.

Elle :
*   coupe ;
*   demande une précision ;
*   exprime une incompréhension localisée ;
*   revient sur un mot ;
*   réclame un exemple ;
*   reformule ce qu’elle croit avoir compris.
### Types d’interruption
*   `clarify_term`
*   `slow_down`
*   `give_example`
*   `define_difference`
*   `i_lost_the_thread`
*   `why_should_i_believe_this`
*   `show_me_application`
*   `restate_simply`
### Effet produit
Le moteur sort du schéma :
*   explication
*   analyse
*   question suivante

pour entrer dans un schéma plus vivant :
*   explication
*   réaction immédiate
*   clarification ciblée
*   reprise
*   nouvelle tension.

* * *
## 7\. Nouveau moteur C — LearnerEvidencePack
### Rôle
Assembler avant chaque session les **preuves réelles de la trajectoire d’apprentissage** de l’utilisateur.
### Contenu recommandé
*   dernier IMPRINT ;
*   IMPRINT de mauvaise qualité récents ;
*   cartes liées au concept ;
*   review events ;
*   leeches ;
*   concepts fragiles dans COSMOS ;
*   profil d’explication ;
*   confidence gap ;
*   précédentes sessions Teach-Back ;
*   remédiations déjà tentées.
### Effet produit
STUDENT AI ne parle plus d’un savoir abstrait.
Il parle du **travail réel déjà effectué par l’utilisateur**.
### Différence avec un prompt externe
Un prompt isolé n’a pas naturellement ce pack d’évidence structuré et mis à jour.

* * *
## 8\. Nouveau moteur D — SessionArcEngine
### Rôle
Donner une **dramaturgie** à la session.
### Pourquoi c’est important
Une bonne session ne doit pas donner l’impression d’être un moteur qui enchaîne mécaniquement les questions.

Elle doit avoir un rythme.
### Arc recommandé
1. `opening`
2. `initial_explanation`
3. `probe`
4. `friction`
5. `repair`
6. `transfer`
7. `metacognition`
8. `closure`
### Effet produit
La session devient :
*   plus mémorable,
*   plus crédible,
*   plus émotionnellement engageante,
*   plus proche d’une vraie interaction humaine structurée.

* * *
## 9\. Nouveau moteur E — AssessmentModesEngine
### Rôle
Multiplier les **modes d’épreuve cognitive** au-delà de la simple explication libre.
### Modes recommandés IN\_MVP / V1
#### 1\. Teach-back libre
L’utilisateur explique librement.
#### 2\. Reconstruction guidée
L’IA donne des fragments et l’utilisateur doit reconstruire la logique.
#### 3\. Contraste
L’utilisateur distingue deux concepts proches.
#### 4\. Transfer
L’utilisateur applique le concept dans un contexte nouveau.
#### 5\. Cas limite
L’utilisateur doit défendre la validité ou la limite du concept sous pression.
#### 6\. Minimal explanation
L’utilisateur doit expliquer avec contrainte (3 phrases, 1 exemple, 1 analogie).
### Effet produit
Le moteur devient un **système d’épreuves cognitives**, et non plus seulement une conversation tutorielle.

* * *
## 10\. Architecture finale recommandée
## 10.1 Principe général

```plain
LearnerEvidencePack
        │
        ▼
Performance Analyzer
        │
        ├── calcule MSS
        ├── calcule conceptDepth
        ├── détecte profile d'explication
        ├── calcule confidence gap
        └── alimente FSRS étendu
        │
        ▼
PedagogicalStrategyResolver (déterministe)
        │
        ├── choisit stratégie
        ├── choisit mode d’épreuve
        ├── choisit niveau de friction
        └── choisit objectif de tour
        │
        ▼
SessionArcEngine
        │
        ├── détermine le moment de la session
        └── appelle TurnInterruptionEngine si nécessaire
        │
        ▼
RelationalStateEngine
        │
        └── maintient l’état de l’interlocuteur
        │
        ▼
LLM Rendering Layer
        │
        └── rédige la formulation dans le bon ton
```

* * *
## 10.2 Rôle exact du LLM
Le LLM ne décide pas :
*   de la pédagogie ;
*   de la structure de session ;
*   du calcul des scores ;
*   du choix des remédiations prioritaires.

Le LLM sert à :
*   incarner la réaction ;
*   styliser la formulation ;
*   rendre la présence plus naturelle ;
*   produire la question finale ;
*   reformuler dans le registre voulu.

C’est très important pour garder un moat produit.

* * *
## 11\. Structures de données recommandées
### 11.1 `RelationalState`

```plain
interface RelationalState {
  sessionId: string
  learnerId: string
  studentState:
    | 'curious'
    | 'lost'
    | 'skeptical'
    | 'half_convinced'
    | 'reassured'
    | 'impressed'
  unresolvedConfusions: string[]
  resolvedPoints: string[]
  confidenceLevel: number
  lastCallbackPoints: string[]
}
```

### 11.2 `LearnerEvidencePack`

```plain
interface LearnerEvidencePack {
  learnerId: string
  conceptId: string
  latestImprint?: string
  previousTeachBackSummaries: string[]
  weakConcepts: string[]
  leechCards: string[]
  conceptDepth: number
  mss?: number
  explanationProfile?: string
  confidenceDeclared?: number
  confidenceMeasured?: number
  remediationFlags: string[]
}
```

### 11.3 `SessionArcState`

```plain
type SessionArcState =
  | 'opening'
  | 'initial_explanation'
  | 'probe'
  | 'friction'
  | 'repair'
  | 'transfer'
  | 'metacognition'
  | 'closure'
```

### 11.4 `AssessmentMode`

```plain
type AssessmentMode =
  | 'free_teach_back'
  | 'reconstruction'
  | 'contrast'
  | 'transfer'
  | 'edge_case'
  | 'minimal_explanation'
```

* * *
## 12\. Ce qui doit rester IN\_MVP
Je recommande comme scope IN\_MVP :
### Déjà présents et à conserver
*   MSS
*   profondeur conceptuelle 0–7
*   séparation pédagogie / LLM
*   métacognition
*   FSRS étendu
*   profils d’explication
*   visualisation COSMOS minimale
### Nouveaux ajouts prioritaires
*   `LearnerEvidencePack`
*   `RelationalStateEngine`
*   `TurnInterruptionEngine`
*   `SessionArcEngine`
*   3 à 4 `AssessmentModes`

* * *
## 13\. Ce qui peut attendre POST\_MVP proche
*   mode présentation oral riche ;
*   intelligence collective avancée ;
*   voix / audio ;
*   avatarisation ;
*   public virtuel ;
*   analyse émotionnelle plus fine ;
*   orchestration multi-agent sophistiquée.

Ces éléments peuvent amplifier la disruption plus tard, mais ne sont pas le noyau indispensable du premier vrai avantage produit.

* * *
## 14\. Ce qui fera que l’utilisateur ne dira pas “je peux le refaire avec ChatGPT”
La différence ne viendra **pas** d’un prompt plus long ou plus malin.

Elle viendra du fait que STUDENT AI combine :

1. **une mémoire réelle de son apprentissage** ;
2. **des scores propriétaires** ;
3. **une stratégie pédagogique déterministe** ;
4. **une présence relationnelle persistante** ;
5. **des interruptions intelligentes** ;
6. **des formats d’épreuve variés** ;
7. **une projection dans tout le système** (IMPRINT, FSRS, COSMOS, remédiation).

Là, on ne parle plus d’un prompt.
On parle d’un **moteur cognitif propriétaire**.

* * *
## 15\. Recommandation finale
### Verdict honnête
Les documents source étaient déjà très bons.
Ils posent une architecture analytique robuste.

Mais la version finale vraiment forte doit maintenant assumer ceci :
> STUDENT AI ne doit pas seulement savoir analyser une explication.  
> Il doit savoir **se comporter comme un interlocuteur cognitif persistant, challengeant et relié à la trajectoire réelle de l’utilisateur**.
### En une phrase
> **La vraie disruption de Student AI ne viendra pas du prompt, mais du fait qu’il devient un système stateful de présence, de friction, de mémoire, d’épreuve et de remédiation personnalisé.**

# NainoForge — Briques open source pour assembler la web app sans repartir de zéro

## Objectif
Trouver des **briques open source personnalisables** pour construire la web app de NainoForge sans tout coder à la main.

Le but n’est pas de trouver un produit magique “clé en main”.
Le bon objectif est de trouver un **stack d’assemblage** qui te fait gagner énormément de temps sur :
*   l’app shell ;
*   les composants premium ;
*   le chat / l’interface Student AI ;
*   l’éditeur IMPRINT ;
*   les graphes / COSMOS ;
*   les écrans dashboard / settings / auth.

* * *
## Verdict rapide
**Oui, tu peux éviter de coder toute l’interface depuis zéro.**

Mais il faut distinguer 3 types de briques :

1. **briques produit externes premium** → adaptées à NainoForge
2. **briques headless / frameworks** → excellentes pour accélérer sans enfermer le design
3. **briques low-code internes** → utiles pour back-office, mais pas idéales pour le cœur du produit client

* * *
## 1\. Ma recommandation d’ensemble
Si je devais te recommander **le meilleur assemblage réaliste** pour NainoForge, ce serait :
*   **App shell / composants UI** : [shadcn/ui](https://ui.shadcn.com/)
*   **Interface Student AI / chat premium** : [assistant-ui](https://www.assistant-ui.com/)
*   **Éditeur IMPRINT bloc / riche** : [BlockNote](https://www.blocknotejs.org/) ou [Tiptap](https://tiptap.dev/)
*   **Graphes / COSMOS** : [React Flow](https://reactflow.dev/)
*   **Écrans data-heavy / admin / settings** : [Refine](https://refine.dev/)
*   **Back-office interne rapide si besoin** : [Appsmith](https://www.appsmith.com/) ou [ToolJet](https://www.tooljet.com/)
### En une phrase
**shadcn/ui + assistant-ui + BlockNote/Tiptap + React Flow + Refine** est probablement le meilleur socle open source assemblable pour créer NainoForge vite sans sacrifier l’identité produit.

* * *
## 2\. Les meilleures briques, catégorie par catégorie
## 2.1 App shell & design system — shadcn/ui
### Pourquoi c’est fort
La doc et l’écosystème montrent que shadcn/ui fournit des composants React accessibles et très customisables, avec une logique importante : **tu copies le code dans ton projet**, donc tu gardes le contrôle du design.

Référence : [shadcn/ui](https://ui.shadcn.com/)
### Ce que ça t’apporte
*   app shell premium
*   sidebar / topbar / cards / dialogs / command palette
*   formulaires
*   tables
*   thèmes dark/light
*   design system cohérent
### Pourquoi c’est très adapté à NainoForge
Tu veux un produit premium, stylé, personnalisable. Tu ne veux pas une lib figée où tu passes ton temps à contourner les styles.
### Mon avis
**Très fortement recommandé**.

* * *
## 2.2 Interface Student AI / chat premium — assistant-ui
### Pourquoi c’est intéressant
Assistant UI fournit des primitives React pour construire des interfaces de type assistant/chat avec streaming, interruptions, conversations multi-tours, etc.

Référence : [assistant-ui](https://www.assistant-ui.com/)
### Ce que ça peut t’éviter de coder
*   structure de conversation
*   streaming de réponses
*   états d’échange
*   base d’UI de chat moderne
*   comportement d’interface assistant
### Pourquoi c’est utile pour NainoForge
Même si Student AI ne doit pas être “juste un chat”, cette brique peut te donner une excellente base pour :
*   la structure du dialogue ;
*   les tours de parole ;
*   les réactions ;
*   l’habillage premium.

Ensuite, tu peux la tordre pour créer ton expérience Teach-Back plus originale.
### Mon avis
**Très utile comme base**, à condition de ne pas te limiter à son UX par défaut.

* * *
## 2.3 Éditeur IMPRINT — BlockNote
### Pourquoi c’est fort
BlockNote est un éditeur bloc moderne de type Notion-like pour React.

Référence : [BlockNote](https://www.blocknotejs.org/)
### Ce qu’il t’apporte
*   édition bloc riche
*   slash menu
*   toolbar
*   drag and drop
*   expérience d’écriture moderne
*   base très crédible pour un espace IMPRINT premium
### Pourquoi c’est adapté
Tu veux qu’IMPRINT ressemble à une vraie carte / workspace premium, pas à un textarea banal. BlockNote t’aide à franchir ce cap plus vite.
### Mon avis
**Excellent si tu veux un IMPRINT visuellement riche rapidement.**

* * *
## 2.4 Éditeur IMPRINT — Tiptap
### Pourquoi c’est fort
Tiptap est plus headless et plus flexible.

Référence : [Tiptap](https://tiptap.dev/)
### Ce qu’il t’apporte
*   énorme flexibilité
*   architecture extensible
*   très bonne intégration React / Next.js
*   possibilité de construire une expérience très sur-mesure
### Différence avec BlockNote
*   **BlockNote** : plus rapide pour un bloc editor poli
*   **Tiptap** : plus flexible si tu veux une UX très spécifique
### Mon avis
Si tu veux aller vite : **BlockNote**.
Si tu veux une expérience IMPRINT extrêmement custom : **Tiptap**.

* * *
## 2.5 Graphes / COSMOS — React Flow
### Pourquoi c’est fort
React Flow est une brique open source robuste pour les interfaces basées sur des nœuds et des graphes.

Référence : [React Flow](https://reactflow.dev/)
### Ce qu’il t’apporte
*   nœuds custom
*   edges custom
*   zoom/pan
*   sélection
*   layouts interactifs
*   bonnes bases pour arbre sémantique / graphe de concepts
### Pourquoi c’est parfait pour NainoForge
Si COSMOS doit devenir un graphe ou arbre vivant, tu ne veux pas coder ça depuis zéro.
### Mon avis
**Le meilleur choix évident pour COSMOS.**

* * *
## 2.6 Framework data-heavy / dashboards — Refine
### Pourquoi c’est intéressant
Refine est un framework React headless pour construire vite des dashboards, pages admin, CRUD, settings, data-driven apps.

Référence : [Refine](https://refine.dev/)
### Ce qu’il t’apporte
*   logique d’app data-heavy
*   auth / navigation / data hooks
*   rapidité pour settings / admin / vues de gestion
*   ne t’impose pas une UI fermée
### Pourquoi ce n’est pas le cœur visuel de NainoForge
Refine est très fort pour accélérer les parties :
*   dashboard interne,
*   settings,
*   admin,
*   back-office,
*   vues de données.

Mais pour IMPRINT ou Student AI, il ne suffit pas seul.
### Mon avis
**Très bon accélérateur secondaire**, pas la brique émotionnelle centrale du produit.

* * *
## 2.7 Low-code interne — Appsmith
### Pourquoi en parler
Appsmith est open source et très utile pour construire rapidement des outils internes.

Référence : [Appsmith](https://www.appsmith.com/)
### Là où c’est utile
*   dashboards internes
*   panel de modération
*   console admin
*   outils internes d’analyse / support / ops
### Là où ce n’est pas idéal
*   le cœur de l’interface produit premium client
### Mon avis
**Très bon pour le back-office**, pas pour l’âme de NainoForge.

* * *
## 2.8 Low-code interne — ToolJet
### Pourquoi en parler
Même logique qu’Appsmith, avec une orientation internal tools.

Référence : [ToolJet](https://www.tooljet.com/)
### Mon avis
Utile si tu veux aller vite sur des outils internes, mais pas comme base de la web app premium NainoForge.

* * *
## 3\. Ce que je te recommande concrètement de ne PAS faire
### Ne pas partir d’un seul “template miracle”
Parce que tu risques :
*   d’être bloqué par ses choix d’UX,
*   d’avoir un produit qui ressemble à un dashboard générique,
*   de perdre l’identité premium de NainoForge.
### Ne pas choisir un outil low-code interne comme cœur du produit
Appsmith / ToolJet sont utiles, mais si tu bases tout NainoForge dessus, l’interface risque de sentir “outil interne”, pas “produit premium cognitif”.
### Ne pas faire du sur-mesure intégral trop tôt
Parce que tu as justement besoin d’économiser du temps, du crédit API et de l’énergie de build.

* * *
## 4\. Stack d’assemblage que je te recommande
## Option recommandée
### Front principal
*   **Next.js** pour la web app
*   **shadcn/ui** pour le design system
*   **assistant-ui** pour la couche conversationnelle Student AI
*   **BlockNote** pour IMPRINT rapide et premium
*   **React Flow** pour COSMOS
### Accélération data / admin
*   **Refine** pour certaines vues de gestion / settings / dashboards data-heavy
### Back-office interne
*   **Appsmith** ou **ToolJet** si tu veux éviter de développer des outils ops internes trop tôt

* * *
## 5\. Traduction directe pour NainoForge
### IMPRINT
*   base : BlockNote ou Tiptap
*   design : shadcn/ui
*   logique métier : ton moteur IMPRINT
### Student AI
*   base conversationnelle : assistant-ui
*   design : shadcn/ui
*   logique interactive : tes engines (RelationalState, Interruption, SessionArc, etc.)
### COSMOS
*   base visuelle : React Flow
*   design : shadcn/ui
*   logique : ton moteur COSMOS / MSS / profondeur conceptuelle
### Dashboard / Settings / Billing
*   base : shadcn/ui + éventuellement Refine

* * *
## 6\. Priorisation si tu veux aller vite
### Si tu dois choisir maintenant
#### Choix 1 — indispensable
*   [shadcn/ui](https://ui.shadcn.com/)
#### Choix 2 — pour Student AI
*   [assistant-ui](https://www.assistant-ui.com/)
#### Choix 3 — pour IMPRINT
*   [BlockNote](https://www.blocknotejs.org/) **ou** [Tiptap](https://tiptap.dev/)
#### Choix 4 — pour COSMOS
*   [React Flow](https://reactflow.dev/)
#### Choix 5 — pour les écrans de gestion
*   [Refine](https://refine.dev/)

* * *
## 7\. Ma conclusion nette
**Oui, tu peux largement assembler NainoForge à partir de briques open source solides sans tout coder à zéro.**

La meilleure logique pour toi n’est pas de trouver un seul template géant.
La meilleure logique est de prendre :
*   une brique pour le shell,
*   une brique pour le chat/assistant,
*   une brique pour l’éditeur,
*   une brique pour les graphes,
*   une brique pour les vues data.
### En une phrase
> **Pour NainoForge, la meilleure approche est un assemblage modulaire : shadcn/ui + assistant-ui + BlockNote/Tiptap + React Flow + Refine, plutôt qu’un développement from scratch ou un outil low-code unique.**

# NainoForge — Vérification licences, gratuité et usage commercial des briques open source

## Objectif
Vérifier clairement, pour chaque brique proposée précédemment :

1. si elle est **gratuite** ;
2. si elle est **accessible librement** ;
3. si elle est **personnalisable** ;
4. si elle est **commercialisable sans gros problème** dans un contexte **SaaS** comme NainoForge ;
5. comment tu devrais **l’utiliser concrètement**.

* * *
## Réponse courte
Toutes les briques proposées ne sont **pas équivalentes**.

Certaines sont excellentes pour un SaaS commercial fermé.
D’autres sont utilisables, mais avec des **restrictions ou risques de licence**.
D’autres encore sont plutôt faites pour des **outils internes**, pas pour le cœur d’un produit client premium.

* * *
## Tableau de décision rapide

| Outil | Gratuit ? | Open source ? | Commercial SaaS fermé ? | Verdict |
| ---| ---| ---| ---| --- |
| shadcn/ui | Oui | Oui | Oui | Excellent |
| assistant-ui | Oui (core) | Oui | Oui | Excellent |
| BlockNote | Oui (core) | Oui | Oui pour le core, attention aux XL | Bon avec vigilance |
| Tiptap | Oui (core) | Oui | Oui pour le core, attention aux services/platform | Excellent |
| React Flow | Oui | Oui | Oui | Excellent |
| Refine | Oui | Oui | Oui | Très bon |
| Appsmith | Oui | Oui | Oui, mais mieux pour back-office | Utile surtout en interne |
| ToolJet | Oui | Oui | Risque/contrainte AGPL | À éviter pour le cœur du SaaS |

* * *
## 1\. shadcn/ui
### Ce que j’ai pu vérifier
*   le cœur de `shadcn/ui` est présenté comme open source ;
*   les résultats retrouvés pointent vers une **licence MIT** ;
*   les blocs premium/pro additionnels peuvent avoir d’autres conditions.

Références :
*   [shadcn/ui](https://ui.shadcn.com/)
*   [shadcn-ui/ui repository](https://github.com/shadcn-ui/ui)
### Lecture pratique
*   **Oui**, le core est utilisable gratuitement.
*   **Oui**, il est personnalisable très librement.
*   **Oui**, il est compatible avec un SaaS commercial fermé.
### Comment tu dois l’utiliser
Utilise-le pour :
*   le shell global de la web app ;
*   les composants premium (cards, dialogs, menus, layout, inputs, buttons, command palette, tabs, etc.) ;
*   ton design system partagé entre web app et extension.
### Verdict
**À garder absolument.**

* * *
## 2\. assistant-ui
### Ce que j’ai pu vérifier
*   le core open source ressort comme **MIT** ;
*   il existe aussi une offre cloud/managée séparée.

Références :
*   [assistant-ui](https://www.assistant-ui.com/)
*   [assistant-ui repository](https://github.com/assistant-ui/assistant-ui)
### Lecture pratique
*   **Oui**, le core est gratuit.
*   **Oui**, il est open source.
*   **Oui**, tu peux l’utiliser dans un SaaS commercial fermé.
*   **Oui**, il est personnalisable.
### Attention
Le cœur open source est libre, mais les services managés autour peuvent être payants.
### Comment tu dois l’utiliser
Utilise-le pour :
*   la base d’interface conversationnelle de Student AI ;
*   le streaming ;
*   les états de messages ;
*   la structure des tours de parole.

Mais ne te contente pas de son rendu par défaut :
*   ajoute ton propre moteur de session ;
*   tes interruptions ;
*   ton RelationalState ;
*   ton habillage premium.
### Verdict
**Très bon choix pour Student AI.**

* * *
## 3\. BlockNote
### Ce que j’ai pu vérifier
*   le **core** est open source ;
*   la doc/licensing publique récupérée indique un **MPL-2.0** pour le core ;
*   les packages **XL** avancés sont sous une logique plus restrictive / commerciale pour un usage closed-source.

Référence :
*   [BlockNote pricing / license model](https://www.blocknotejs.org/pricing)
### Lecture pratique
*   **Oui**, le core est gratuit.
*   **Oui**, tu peux l’utiliser dans un projet commercial fermé.
*   **Mais** : attention à ne pas dépendre des modules XL payants si tu veux rester 100% libre côté coût/licence.
### Comment tu dois l’utiliser
Utilise BlockNote si tu veux aller vite pour :
*   IMPRINT ;
*   une surface d’écriture bloc premium ;
*   un effet “Notion-like” moderne.
### Quand éviter
Si tu sais dès maintenant que tu vas avoir besoin des fonctionnalités avancées XL payantes et que tu veux éviter cette dépendance.
### Verdict
**Bon choix, mais avec vigilance.**

* * *
## 4\. Tiptap
### Ce que j’ai pu vérifier
*   le **core** est open source et ressort comme **MIT** ;
*   la plateforme / services / extensions avancées peuvent être commerciales.

Référence :
*   [Tiptap open source to platform](https://tiptap.dev/open-source-to-platform)
### Lecture pratique
*   **Oui**, le core est gratuit.
*   **Oui**, il est compatible avec un SaaS commercial fermé.
*   **Oui**, il est extrêmement personnalisable.
### Comment tu dois l’utiliser
Si tu veux une expérience IMPRINT très sur-mesure, Tiptap est probablement le meilleur choix long terme.

Utilise-le pour :
*   une vraie carte IMPRINT premium ;
*   une interface d’écriture totalement custom ;
*   des comportements spéciaux liés à la forge cognitive.
### Verdict
**Très bon choix, surtout si tu veux du contrôle.**

* * *
## 5\. React Flow
### Ce que j’ai pu vérifier
*   le core ressort comme **MIT** ;
*   il existe une offre Pro séparée, mais non obligatoire.

Références :
*   [React Flow](https://reactflow.dev/)
*   [React Flow licensing info via repo/site](https://reactflow.dev/)
### Lecture pratique
*   **Oui**, le core est gratuit.
*   **Oui**, il est compatible avec un SaaS commercial fermé.
*   **Oui**, il est très personnalisable.
### Comment tu dois l’utiliser
Utilise-le pour :
*   COSMOS ;
*   graphe de concepts ;
*   nœuds de connaissance ;
*   visualisation de structure, dépendances, liens.
### Verdict
**À garder sans hésiter pour COSMOS.**

* * *
## 6\. Refine
### Ce que j’ai pu vérifier
*   `refinedev/refine` ressort comme **MIT**.

Références :
*   [Refine](https://refine.dev/)
*   [refinedev/refine repository](https://github.com/refinedev/refine)
### Lecture pratique
*   **Oui**, gratuit.
*   **Oui**, open source.
*   **Oui**, compatible SaaS commercial fermé.
*   **Oui**, personnalisable.
### Comment tu dois l’utiliser
Ne l’utilise pas pour l’âme visuelle de NainoForge.
Utilise-le pour accélérer :
*   settings ;
*   vues data-heavy ;
*   admin ;
*   gestion utilisateur ;
*   pages de back-office / analytics / opérations.
### Verdict
**Très bon accélérateur secondaire.**

* * *
## 7\. Appsmith
### Ce que j’ai pu vérifier
*   Appsmith ressort comme **Apache 2.0**.

Références :
*   [Appsmith](https://www.appsmith.com/)
*   [appsmithorg/appsmith repository](https://github.com/appsmithorg/appsmith)
### Lecture pratique
*   **Oui**, gratuit en open source.
*   **Oui**, commercialisable.
*   **Oui**, personnalisable.
### Mais
Son meilleur usage reste les :
*   outils internes,
*   dashboards internes,
*   consoles back-office,
*   ops/support.
### Comment tu dois l’utiliser
Utilise Appsmith uniquement si tu veux éviter de développer ton back-office interne.

Exemples :
*   panel support ;
*   supervision des comptes premium ;
*   suivi coûts IA ;
*   console interne pour inspecter les sessions Student AI.
### Verdict
**Bon outil interne, pas le cœur du produit client.**

* * *
## 8\. ToolJet
### Ce que j’ai pu vérifier
*   ToolJet ressort comme **AGPL-3.0**.

Références :
*   [ToolJet](https://www.tooljet.com/)
*   [ToolJet repository](https://github.com/ToolJet/ToolJet)
### Lecture pratique
*   **Oui**, c’est open source et accessible.
*   **Oui**, c’est gratuit dans sa version open.
*   **Mais** : AGPL est beaucoup plus contraignante pour un usage SaaS, surtout si tu modifies/intègres profondément l’outil.
### Pourquoi je suis prudent
L’AGPL peut t’obliger à ouvrir certains éléments si ton usage est considéré comme un dérivé/usage réseau concerné par la licence.
### Comment tu dois l’utiliser
Honnêtement :
*   **n’en fais pas le cœur de NainoForge** ;
*   si tu veux l’utiliser, fais-le uniquement de façon très périphérique, et seulement après vérification juridique si nécessaire.
### Verdict
**Je te déconseille ToolJet pour le cœur du SaaS NainoForge.**

* * *
## 9\. Recommandation finale très claire
## Les briques que tu peux utiliser tranquillement pour NainoForge
### Socle recommandé
*   **shadcn/ui** → oui
*   **assistant-ui** → oui
*   **Tiptap** → oui
*   **React Flow** → oui
*   **Refine** → oui
### Option utilisable avec vigilance
*   **BlockNote** → oui pour le core, attention aux packages XL/commerciaux
### Option pour back-office interne uniquement
*   **Appsmith** → oui, mais pas comme cœur produit
### Option à éviter pour le cœur du SaaS
*   **ToolJet** → non recommandé à cause de la contrainte AGPL

* * *
## 10\. Stack finale recommandée pour toi
Si tu veux une réponse la plus simple et la plus sûre possible :
### Pour le produit client NainoForge
*   **shadcn/ui** pour le shell et le design system
*   **assistant-ui** pour Student AI
*   **Tiptap** (ou BlockNote core si tu veux aller plus vite) pour IMPRINT
*   **React Flow** pour COSMOS
*   **Refine** pour dashboards data-heavy / settings / admin UI technique
### Pour les outils internes éventuels
*   **Appsmith** si tu veux gagner du temps sur le back-office
### À éviter
*   **ToolJet** au cœur du produit client

* * *
## 11\. En une phrase
> **Oui, la majorité des briques que je t’ai proposées sont bien gratuites, accessibles librement, personnalisables et compatibles avec un SaaS commercial fermé — sauf ToolJet que je déconseille pour le cœur du produit, et BlockNote qui demande de bien distinguer le core libre des modules avancés payants.**

# NainoForge — Roadmap S2 détaillée en sprints concrets

## Objectif de S2
S2 ne doit pas être pensée comme :
*   “on implémente tous les packages stubés” ;
*   “on remplit le monorepo” ;
*   “on ouvre 8 fronts en parallèle”.

S2 doit être pensée comme une suite de **vertical slices** qui augmentent à la fois :
*   la testabilité ;
*   la robustesse CI ;
*   la valeur visible ;
*   la profondeur du cœur produit.

La bonne séquence est :

1. **testability**
2. **visible AI value**
3. **core learning loop**
4. **student-ai / cosmos / reste du noyau**

* * *
## Vue d’ensemble
### Sprint S2.1
**But** : débloquer totalement la boucle test + CI.
### Sprint S2.2
**But** : faire émerger le premier moteur visible : `@nainoforge/ai`.
### Sprint S2.3
**But** : implémenter la première boucle d’apprentissage réelle : IMPRINT + FSRS.
### Sprint S2.4
**But** : préparer la montée vers Student AI, COSMOS, vector et bundle sans rouvrir le chaos.

* * *
## Sprint S2.1 — Testability & burn-in
### Objectif stratégique
Sortir du mode “ça compile” pour entrer dans le mode “on peut modifier sans casser en aveugle”.
### Résultat attendu en fin de sprint
*   un test runner câblé ;
*   les premiers tests verts ;
*   le burn-in activé dans le script local ;
*   les artifacts CI produits proprement ;
*   la doc pipeline minimale écrite.
### Livrables
#### 1\. Test runner principal
Recommandation :
*   **Vitest** pour packages et logique utilitaire
*   **Playwright** ensuite pour quelques flows critiques

Le sprint doit au minimum finaliser **Vitest**.
#### 2\. Premiers tests unitaires extension
Priorité haute :
*   article detector
*   youtube detector
*   cleaner
*   chunker
*   event-bus minimal si pertinent
#### 3\. Burn-in stage
Activer le burn-in stage dans `.githscripts/ci-local.sh`.
#### 4\. Artifacts CI
*   reports de tests
*   logs utiles
*   structure simple et reproductible
#### 5\. Documentation pipeline
Créer `docs/ci.md` avec :
*   comment lancer les tests
*   comment lire les artifacts
*   comment utiliser le burn-in local
*   quelles gates bloquent quoi
### Critère de sortie
Un changement sur un module critique peut être validé par un cycle court :
*   test local
*   CI
*   burn-in minimal
### Risque à éviter
Chercher la perfection du système de test au lieu d’obtenir rapidement un signal fiable minimal.

* * *
## Sprint S2.2 — Première valeur visible : @nainoforge/ai
### Objectif stratégique
Créer le premier package métier qui donne une **valeur utilisateur visible** à partir d’une capture existante.
### Résultat attendu en fin de sprint
Flux minimal :
*   source capturée
*   texte nettoyé
*   résumé court généré
*   concepts extraits
*   résultat exploitable côté produit
### Scope recommandé
#### `@nainoforge/ai`
Implémenter seulement :
*   `summarizer`
*   `conceptExtractor`
*   contrats d’entrée/sortie propres
*   parsing robuste du retour modèle
*   fallback simple si le LLM répond mal
### Ce qu’il ne faut pas faire encore
*   moteur AI trop large
*   orchestration complexe multi-provider
*   sophistication prématurée sur Student AI
*   dépendances trop profondes avec 5 autres packages
### Tests à écrire
*   test de contrat summarizer
*   test de parsing concept extractor
*   test de fallback format invalide
*   test de normalisation réponse
### Critère de sortie
Tu peux montrer un flux concret :
> capture → summary → concepts
Et ce flux est testé.
### Pourquoi ce sprint compte beaucoup
Parce qu’il transforme la structure déjà en place en **première intelligence visible**.

* * *
## Sprint S2.3 — Cœur produit : IMPRINT + FSRS
### Objectif stratégique
Faire émerger le premier noyau cognitif réel de NainoForge.
### Résultat attendu en fin de sprint
Un flux minimal crédible :
*   source capturée
*   résumé/concepts
*   IMPRINT soumis
*   scoring minimal
*   cartes générées ou concept préparé
*   scheduling FSRS basique
### Packages à ouvrir
#### `@nainoforge/imprint`
Scope recommandé :
*   contrat IMPRINT input/output
*   Cran minimal ou score de profondeur v1
*   quality score simple
*   mapping concept source → imprint output
#### `@nainoforge/fsrs`
Scope recommandé :
*   wrapper scheduler
*   état minimal carte/review
*   première planification stable
*   interface propre pour brancher plus tard les recalibrations avancées
### Décision importante
Ces deux packages doivent être construits comme un **binôme**.

Ne pas les traiter comme deux routes indépendantes.
### Tests à écrire
*   IMPRINT scoring minimal
*   validation inputs/outputs
*   FSRS state transition simple
*   first scheduling scenarios
*   intégration légère IMPRINT → FSRS trigger si applicable
### Critère de sortie
Tu disposes du premier embryon de :
> capture → compréhension active → planification de révision
Et là, on commence à toucher la vraie différenciation produit.

* * *
## Sprint S2.4 — Consolidation avant Student AI lourd
### Objectif stratégique
Préparer les packages suivants sans se disperser.
### Résultat attendu en fin de sprint
*   fondations claires pour Student AI
*   base COSMOS légère
*   contrats vector/bundle/extract mieux cadrés
*   architecture plus stable qu’au début de S2
### Packages à ouvrir en priorité relative
#### `@nainoforge/student-ai`
Seulement le socle :
*   contrats session
*   inputs/output teach-back
*   placeholders analytiques minimum
*   learner evidence pack initial si possible
#### `@nainoforge/cosmos`
Seulement :
*   projection minimale des concepts
*   structure de nœuds
*   état de lecture simple
#### `@nainoforge/vector`
Seulement si déjà nécessaire à un flux réel.
Sinon, le garder cadré mais non prioritaire.
#### `@nainoforge/bundle`
Préparer :
*   format manifest
*   export minimal futur
#### `@nainoforge/extract`
Vu que tu as déjà des briques S1, ici il s’agit surtout de consolider en package métier propre.
#### `@nainoforge/api`
Doit rester léger au début :
*   edge functions nécessaires,
*   pas de backend surconstruit.
### Critère de sortie
Tu n’as pas tout fini, mais tu as :
*   un cœur produit vivant,
*   des packages suivants mieux cadrés,
*   une direction beaucoup plus exécutable pour S3.

* * *
## Découpage recommandé du temps
### Si tu travailles en séquence courte
*   **S2.1** : 2 à 4 jours
*   **S2.2** : 3 à 5 jours
*   **S2.3** : 4 à 6 jours
*   **S2.4** : 3 à 5 jours
### Si tu es solo et très contraint
L’ordre absolu doit rester :

1. tests
2. AI visible
3. IMPRINT + FSRS
4. le reste

* * *
## Ce qu’il faut absolument reporter si nécessaire
Si le temps manque, reporte sans regret :
*   notifications CI sophistiquées
*   vector trop tôt
*   student-ai complet trop tôt
*   bundle avancé trop tôt
*   cosmos riche trop tôt

Le danger de S2 est de diluer l’énergie sur des briques importantes mais pas encore vitales.

* * *
## KPI de réussite pour S2
### Tech
*   temps moyen pour valider un changement réduit
*   tests unitaires utiles sur les briques critiques
*   burn-in exploitable
*   CI plus informative
### Produit
*   flux `capture → summary → concepts` démontrable
*   flux `capture → imprint → review seed` démontrable
*   premiers packages métier réellement utilisables
### Architecture
*   moins de stubs “vides” sans direction
*   plus de contrats stabilisés
*   ouverture de Student AI sur fondations plus propres

* * *
## Recommandation finale
### La règle à ne pas oublier
> **S2 n’est pas une phase de remplissage de packages. C’est une phase de transformation du monorepo en système testable, visible, puis cognitivement utile.**
### En une phrase
Le bon enchaînement S2 est :

**Vitest + burn-in → AI visible → IMPRINT + FSRS → seulement ensuite Student AI/COSMOS/vector/bundle/api.**

# NainoForge — Tickets S2 priorisés package par package

## Objectif
Transformer la vision S2 en **tickets d’exécution concrets**, package par package, dans un ordre qui évite la dispersion.

Je classe ici les tickets selon une logique simple :
*   **P0** = bloque ou débloque le reste
*   **P1** = apporte une valeur visible ou structure le cœur produit
*   **P2** = important mais peut attendre après la boucle principale

* * *
## 1\. Global / repo / CI
### P0 — Test runner minimal utile
#### Ticket G-01 — Installer et configurer Vitest au niveau monorepo
**But** : exécuter des tests unitaires rapidement dans les packages et utilities.

**Done quand** :
*   commande test unifiée disponible ;
*   Vitest tourne sur au moins un package et un module extension ;
*   config CI compatible.
#### Ticket G-02 — Ajouter scripts pnpm de test standardisés
**But** : uniformiser l’exécution locale.

**Done quand** :
*   `pnpm test`
*   `pnpm test:watch`
*   `pnpm test:ci`

existent et fonctionnent.
#### Ticket G-03 — Câbler coverage minimal
**But** : disposer d’un premier signal simple sur ce qui est couvert.

* * *
### P0 — Burn-in & artifacts
#### Ticket G-04 — Activer burn-in stage dans `.githscripts/ci-local.sh`
**But** : rendre le stage réellement exécutable.
#### Ticket G-05 — Produire artifacts de test et de burn-in dans CI
**But** : garder les sorties utiles après exécution.
#### Ticket G-06 — Rédiger `docs/ci.md`
**But** : documenter pipeline, tests et burn-in.

* * *
### P1 — Notifications CI
#### Ticket G-07 — Brancher scaffold notifications Slack/email
**But** : sortir du statut “scaffold seulement”.

**Note** : utile, mais après runner + burn-in.

* * *
## 2\. Extension — tests prioritaires
### P0 — tests unitaires extension
#### Ticket E-01 — Tester `article-detector`
#### Ticket E-02 — Tester `youtube-detector`
#### Ticket E-03 — Tester `cleaner`
#### Ticket E-04 — Tester `chunker`
#### Ticket E-05 — Tester logique de dédup source repo si facile à isoler
### Pourquoi ces tickets sont prioritaires
Parce que ce sont les briques déjà vivantes du produit. Si elles ne sont pas protégées, tu casses la base à chaque itération.

* * *
## 3\. Package `@nainoforge/ai`
### P1 — Premier moteur visible
#### Ticket AI-01 — Définir contrats `SummarizeInput` / `SummarizeOutput`
#### Ticket AI-02 — Définir contrats `ExtractConceptsInput` / `ExtractConceptsOutput`
#### Ticket AI-03 — Implémenter `summarizer` v1
#### Ticket AI-04 — Implémenter `conceptExtractor` v1
#### Ticket AI-05 — Ajouter parsing robuste des réponses LLM
#### Ticket AI-06 — Ajouter fallback quand la réponse ne respecte pas le format attendu
#### Ticket AI-07 — Exposer une API de package simple (`summarize`, `extractConcepts`)
### Tests P1
#### Ticket AI-08 — Tests unitaires summarizer
#### Ticket AI-09 — Tests unitaires concept extractor
#### Ticket AI-10 — Tests de parsing/fallback sur sorties invalides
### Pourquoi ce package vient tôt
Parce qu’il donne la première valeur visible :
> capture → résumé → concepts
* * *
## 4\. Package `@nainoforge/imprint`
### P1 — Premier moteur de forge active
#### Ticket IM-01 — Définir contrats `ImprintInput` / `ImprintEvaluation`
#### Ticket IM-02 — Implémenter scoring minimal de Cran v1
#### Ticket IM-03 — Implémenter quality score minimal
#### Ticket IM-04 — Mapper concepts/source → résultat IMPRINT
#### Ticket IM-05 — Exposer API simple du package
### Tests P1
#### Ticket IM-06 — Tests scoring Cran
#### Ticket IM-07 — Tests quality score
#### Ticket IM-08 — Tests validation entrées/sorties
### Pourquoi ce package est critique
C’est la première vraie matérialisation de la promesse de “forge cognitive”.

* * *
## 5\. Package `@nainoforge/fsrs`
### P1 — Premier scheduler utile
#### Ticket FS-01 — Définir contrat d’état carte minimal
#### Ticket FS-02 — Définir contrat d’événement de review minimal
#### Ticket FS-03 — Implémenter wrapper scheduler FSRS v1
#### Ticket FS-04 — Implémenter transition de review simple
#### Ticket FS-05 — Implémenter calcul de prochaine révision
#### Ticket FS-06 — Exposer API simple du package
### Tests P1
#### Ticket FS-07 — Tests transitions de review
#### Ticket FS-08 — Tests scheduling de base
#### Ticket FS-09 — Tests edge cases (again/hard/good/easy)
### Pourquoi il doit avancer avec IMPRINT
FSRS sans IMPRINT n’exprime pas ta singularité produit.
IMPRINT sans FSRS perd vite sa profondeur pratique.

* * *
## 6\. Package `@nainoforge/student-ai`
### P2 — À ouvrir après AI + IMPRINT + FSRS
#### Ticket SA-01 — Définir contrat session teach-back
#### Ticket SA-02 — Définir contrat input/output d’évaluation
#### Ticket SA-03 — Définir structure minimale `LearnerEvidencePack`
#### Ticket SA-04 — Définir types des scores Student AI v1
#### Ticket SA-05 — Implémenter squelette `teachBackEngine`
### Tests P2
#### Ticket SA-06 — Tests de validation des contrats
#### Ticket SA-07 — Tests du pipeline de session minimal
### Pourquoi ce n’est pas P1 immédiat
Parce que Student AI dépend fortement de la qualité des fondations posées par AI + IMPRINT + FSRS.

* * *
## 7\. Package `@nainoforge/cosmos`
### P2 — Projection, pas complexité maximale
#### Ticket CO-01 — Définir modèle minimal de nœud conceptuel
#### Ticket CO-02 — Définir projection lecture concept → état
#### Ticket CO-03 — Implémenter vue minimale des concepts solides/fragiles
#### Ticket CO-04 — Préparer structure compatible avec profondeur conceptuelle future
### Tests P2
#### Ticket CO-05 — Tests de projection conceptuelle
* * *
## 8\. Package `@nainoforge/vector`
### P2 — À retarder tant que non nécessaire
#### Ticket VE-01 — Définir contrat embedding provider
#### Ticket VE-02 — Définir contrat stockage/référence embedding
#### Ticket VE-03 — Implémenter stub propre compatible future intégration
### Pourquoi le retarder
Le package vector est important, mais il n’apporte pas la prochaine valeur visible immédiate si S2 est encore contrainte.

* * *
## 9\. Package `@nainoforge/bundle`
### P2 — Portabilité, mais après cœur produit
#### Ticket BU-01 — Définir `manifest.json` du bundle
#### Ticket BU-02 — Définir structure export minimale
#### Ticket BU-03 — Implémenter export stub lisible/testable
### Tests P2
#### Ticket BU-04 — Tests de structure de manifest
* * *
## 10\. Package `@nainoforge/extract`
### P2 — Consolider l’existant S1
#### Ticket EX-01 — Extraire les briques S1 dans package `extract` propre
#### Ticket EX-02 — Définir contrat `DocumentCanonicalModel`
#### Ticket EX-03 — Uniformiser article / youtube / pdf vers une interface commune
### Tests P2
#### Ticket EX-04 — Tests de canonicalisation
* * *
## 11\. Package `@nainoforge/api`
### P2 — Rester léger
#### Ticket AP-01 — Définir edge function minimale pour summarizer/concept extractor
#### Ticket AP-02 — Définir contrat de sécurité/auth minimal
#### Ticket AP-03 — Préparer routage provider-agnostic simple
### Pourquoi rester léger
Le backend doit servir le produit, pas devenir un projet parallèle.

* * *
## 12\. Ordre d’exécution recommandé
## Bloc 1 — Débloquer
*   G-01
*   G-02
*   G-03
*   E-01 à E-04
*   G-04
*   G-05
*   G-06
## Bloc 2 — Première valeur visible
*   AI-01 à AI-07
*   AI-08 à AI-10
## Bloc 3 — Cœur produit
*   IM-01 à IM-08
*   FS-01 à FS-09
## Bloc 4 — Élargissement contrôlé
*   SA-01 à SA-07
*   CO-01 à CO-05
*   EX-01 à EX-04
*   BU-01 à BU-04
*   VE-01 à VE-03
*   AP-01 à AP-03
*   G-07

* * *
## 13\. Tickets à ne pas ouvrir trop tôt
Pour éviter la dispersion, je te conseille de ne pas ouvrir immédiatement :
*   tous les tickets Student AI avancés ;
*   vector avancé ;
*   bundle riche ;
*   cosmos riche ;
*   notifications CI sophistiquées.

Tant que les 3 blocs suivants ne sont pas solides :

1. runner + tests
2. AI visible
3. IMPRINT + FSRS

* * *
## 14\. Recommandation finale
### Si tu veux un principe simple
> **Chaque ticket S2 doit soit réduire le risque de casse, soit augmenter la valeur visible, soit renforcer le cœur cognitif. S’il ne fait aucun des trois, il attend.**
### En une phrase
Le bon ordre package par package est :

**global CI/tests → extension tests → ai → imprint → fsrs → student-ai → cosmos → extract/bundle/vector/api → notifications secondaires.**

# NainoForge — Sprints design/UX détaillés pour intégrer et personnaliser les briques open source

## Objectif
Tu as raison : maintenant qu’on a identifié des briques open source solides, il faut aller plus loin que “les utiliser”.

Il faut planifier **comment les intégrer, les tordre, les habiller et les aligner** avec :
*   l’identité NainoForge ;
*   ton branding ;
*   la sensation premium du produit ;
*   la philosophie cognitive du produit ;
*   une UX qui ne ressemble ni à un dashboard générique, ni à un clone brut d’un composant open source.

Autrement dit :
> **le vrai travail n’est pas seulement d’assembler des briques. C’est de les faire disparaître derrière l’identité NainoForge.**
* * *
## Principe directeur
Les briques open source sont là pour :
*   accélérer le build,
*   économiser du temps,
*   réduire le code from scratch,
*   offrir une base robuste.

Mais elles ne doivent jamais rester visibles comme “des briques tierces collées ensemble”.

La bonne méthode consiste à avancer en 4 couches :

1. **fondation visuelle**
2. **composants personnalisés**
3. **surfaces produit signatures**
4. **raffinement de l’expérience émotionnelle**

* * *
## Stack de base à personnaliser
### Briques retenues
*   **shadcn/ui** → shell, primitives, design system
*   **assistant-ui** → base de Student AI
*   **Tiptap** ou **BlockNote** → base IMPRINT
*   **React Flow** → base COSMOS
*   **Refine** → vues de gestion / settings / admin data-heavy
### Règle produit
Ces briques sont des **matières premières**.
Le livrable final doit donner l’impression d’un produit cohérent, pas d’un assemblage de libs.

* * *
## Sprint UX-01 — Fondation de marque et design system NainoForge
### Objectif
Créer la couche visuelle et sémantique qui servira de filtre à toutes les briques intégrées.
### Résultat attendu
Un **design system NainoForge** suffisamment défini pour que tous les composants tiers puissent être re-skinnés proprement.
### Travaux à faire
#### 1\. Définir le branding de base
*   palette principale
*   palette secondaire
*   couleurs de statut cognitif
*   style sombre / clair
*   tokens de couleur premium
#### 2\. Définir la typographie
*   police principale UI
*   police d’écriture / contenu si différente
*   hiérarchie de titres
*   style de texte pour feedback cognitif
#### 3\. Définir les primitives de style
*   radius
*   ombres
*   espacement
*   densité
*   animations
*   styles de cartes
*   styles d’états interactifs
#### 4\. Définir le vocabulaire visuel produit
Exemples :
*   à quoi ressemble une “forge card” ?
*   à quoi ressemble un état “lacune” ?
*   à quoi ressemble une “zone de friction” ?
*   comment visualiser “profondeur”, “stabilité”, “clarification”, “transfert” ?
### Livrables
*   mini style guide
*   tokens UI/Tailwind
*   composants de base rebrandés
*   règles d’iconographie
### Pourquoi ce sprint est fondamental
Si tu ne fais pas ça d’abord, tu vas intégrer les briques une par une, et l’interface donnera une impression patchwork.

* * *
## Sprint UX-02 — App shell premium et navigation NainoForge
### Objectif
Transformer `shadcn/ui` en **shell NainoForge**.
### Résultat attendu
Une web app qui ne ressemble plus à un template admin générique.
### Travaux à faire
#### 1\. Personnaliser le shell principal
*   sidebar
*   header
*   zone centrale
*   layout mobile/tablette si prévu plus tard
*   transitions entre espaces
#### 2\. Définir la navigation produit
*   Capture / Inbox
*   IMPRINT
*   Student AI
*   Review
*   COSMOS
*   Settings
#### 3\. Personnaliser les primitives critiques
*   Button
*   Card
*   Tabs
*   Input
*   Dialog
*   Sheet
*   Command palette
*   Empty states
*   Skeletons
#### 4\. Définir les états d’expérience
*   loading
*   processing
*   cognitive feedback
*   success
*   ambiguity
*   blocked
### Livrables
*   app shell complet NainoForge
*   librairie de composants re-skinnés
*   navigation premium cohérente
### Objectif caché
Faire en sorte qu’un utilisateur qui ouvre la web app ne pense pas :
> “j’ai déjà vu ce dashboard ailleurs”
mais plutôt :
> “ce produit a un univers et une intention.”
* * *
## Sprint UX-03 — IMPRINT comme workspace premium
### Objectif
Prendre Tiptap ou BlockNote et le transformer en **espace IMPRINT NainoForge**.
### Résultat attendu
IMPRINT ne ressemble plus à un éditeur générique, mais à un **atelier de forge cognitive**.
### Travaux à faire
#### 1\. Personnaliser la surface d’écriture
*   largeur
*   rythme vertical
*   padding
*   ambiance visuelle
*   style du curseur et de la zone active
#### 2\. Construire les blocs NainoForge
Exemples :
*   bloc idée clé
*   bloc exemple
*   bloc analogie
*   bloc tension/contraste
*   bloc application
*   bloc teach-back seed
#### 3\. Ajouter feedback cognitifs intégrés
*   cran perçu
*   signaux de profondeur
*   couverture de concepts
*   flags de contradiction légère
*   suggestion de clarification
#### 4\. Définir la carte IMPRINT finale
*   style premium
*   sensation de “forge card”
*   export visuel cohérent
### Livrables
*   surface IMPRINT rebrandée
*   blocs personnalisés
*   feedback intégrés dans l’édition
*   esthétique premium lisible
### Point crucial
IMPRINT doit devenir une signature produit. Si cette surface est forte, NainoForge commence à avoir une vraie identité.

* * *
## Sprint UX-04 — Student AI comme espace d’explication active
### Objectif
Prendre `assistant-ui` et le transformer en **espace Student AI NainoForge**, c’est-à-dire un lieu où l’utilisateur sent qu’il explique à quelqu’un.
### Résultat attendu
Une interface qui ne ressemble plus à un chat standard.
### Travaux à faire
#### 1\. Repenser la structure de conversation
*   place de la parole utilisateur
*   réaction du student
*   interruptions visibles
*   moments de tension
*   synthèse de session
#### 2\. Définir les composants signatures
*   Student Card
*   interruption bubble
*   clarification cue
*   confidence marker
*   “tu m’as perdu ici” state
*   transfer challenge block
#### 3\. Mettre en scène la session
*   ouverture
*   explication
*   friction
*   clarification
*   transfert
*   clôture
#### 4\. Personnaliser totalement l’habillage
*   bulles
*   espaces
*   styles de réaction
*   feedback structurés
*   micro-animations de présence
### Livrables
*   Student AI workspace premium
*   composants de session propres à NainoForge
*   interaction moins “chatbot”, plus “interlocuteur cognitif”
### But réel
Faire disparaître visuellement l’origine assistant-ui.

* * *
## Sprint UX-05 — COSMOS comme visualisation premium du savoir
### Objectif
Prendre React Flow et le transformer en expérience COSMOS cohérente avec le reste du produit.
### Résultat attendu
Un espace de visualisation qui paraît nativement NainoForge.
### Travaux à faire
#### 1\. Définir le langage visuel des nœuds
*   concept solide
*   concept fragile
*   lacune
*   zone isolée
*   nœud maître
*   relation active
#### 2\. Définir le langage visuel des liens
*   relation de dépendance
*   relation secondaire
*   tension
*   transfert
*   contradiction potentielle
#### 3\. Ajouter overlays cognitifs
*   profondeur
*   MSS
*   confiance
*   densité
*   remédiation
#### 4\. Créer les vues COSMOS
*   vue globale
*   vue focus concept
*   heatmap des fragilités
*   trajectoire d’évolution
### Livrables
*   thème COSMOS personnalisé
*   librairie de nœuds NainoForge
*   overlays cognitifs cohérents
### Point important
COSMOS ne doit pas ressembler à un outil de graph générique. Il doit ressembler à une cartographie vivante de la compréhension.

* * *
## Sprint UX-06 — Dashboard, Review et surfaces secondaires
### Objectif
Harmoniser toutes les surfaces moins “glamour” mais essentielles.
### Résultat attendu
Le produit reste cohérent même hors des surfaces signatures.
### Travaux à faire
#### 1\. Dashboard d’accueil
*   activité récente
*   concepts à revoir
*   progression
*   zones de faiblesse
*   streak / routine
#### 2\. Review UX
*   session Micro
*   session Standard
*   signaux premium
*   transitions lisibles
*   feedback après review
#### 3\. Settings / billing / plan / quotas
*   clarté
*   cohérence visuelle
*   ton premium
#### 4\. Admin / data-heavy views
*   intégrer Refine si utile
*   le garder visuellement aligné
### Livrables
*   dashboard premium cohérent
*   review flows harmonisés
*   settings et surfaces de gestion non négligées

* * *
## Sprint UX-07 — Polishing, motion, détails émotionnels
### Objectif
Faire passer le produit de “solide” à “désirable”.
### Résultat attendu
Une sensation de produit vraiment premium.
### Travaux à faire
#### 1\. Motion design léger
*   transitions d’écran
*   apparition de feedback
*   interactions sur cartes
*   passages entre états cognitifs
#### 2\. Microcopy UX
*   ton cohérent
*   messages d’encouragement
*   états d’erreur
*   états d’incertitude
*   wording de Student AI / IMPRINT / COSMOS
#### 3\. États vides et états intermédiaires
*   empty states inspirants
*   waiting states intelligents
*   fallback states élégants
#### 4\. Qualité perçue
*   alignements
*   finesse des espacements
*   cohérence des icônes
*   hiérarchie typographique finale
### Livrables
*   polish visuel
*   UX plus émotionnelle
*   expérience plus mémorable

* * *
## Répartition recommandée par brique

| Brique | Usage recommandé | Niveau de personnalisation requis |
| ---| ---| --- |
| shadcn/ui | shell, primitives, design system | Très élevé |
| assistant-ui | base Student AI | Très élevé |
| Tiptap / BlockNote | base IMPRINT | Très élevé |
| React Flow | base COSMOS | Élevé |
| Refine | settings/admin/data views | Moyen |

* * *
## Priorisation si tu dois aller vite
### Priorité absolue
1. Sprint UX-01
2. Sprint UX-02
3. Sprint UX-03
4. Sprint UX-04
### Ensuite
1. Sprint UX-05
2. Sprint UX-06
3. Sprint UX-07
### Pourquoi
Parce que les surfaces qui créent l’identité perçue de NainoForge sont d’abord :
*   le shell global,
*   IMPRINT,
*   Student AI.

COSMOS est important, mais il peut venir après si le temps est contraint.

* * *
## Règle finale de design
À chaque sprint, pose cette question :
> **Si j’enlève le logo NainoForge, est-ce que cette interface ressemble encore à un template open source ?**
Si la réponse est oui, alors la personnalisation n’est pas encore suffisante.

* * *
## Recommandation finale
Le vrai travail de design/UX de NainoForge ne consiste pas à “brancher des libs”.

Il consiste à :
*   prendre des briques robustes,
*   les absorber,
*   les re-sémantiser,
*   les re-styler,
*   et les faire servir une expérience cognitive singulière.
### En une phrase
> **La bonne roadmap n’est pas “intégrer shadcn, assistant-ui, Tiptap et React Flow”, mais “transformer ces briques en surfaces signatures NainoForge : shell, IMPRINT, Student AI et COSMOS”.**