# Guide de contribution — DeadlockHelper

Merci de l'intérêt que vous portez au projet. Ce document définit les règles à respecter pour contribuer de façon efficace et cohérente, que ce soit pour signaler un bug, proposer une fonctionnalité ou soumettre du code.

---

## Table des matières

- [Code de conduite](#code-de-conduite)
- [Signaler un bug](#signaler-un-bug)
- [Proposer une fonctionnalité](#proposer-une-fonctionnalité)
- [Contribuer du code](#contribuer-du-code)
  - [Prérequis](#prérequis)
  - [Flux de travail Git](#flux-de-travail-git)
  - [Règles de code](#règles-de-code)
  - [Messages de commit](#messages-de-commit)
  - [Pull Request](#pull-request)
- [Questions](#questions)
- [English version](#english-version)

---

## Code de conduite

Ce projet est ouvert à toute personne souhaitant contribuer, quel que soit son niveau d'expérience. Les interactions doivent rester respectueuses, constructives et axées sur le technique. Tout commentaire irrespectueux, harcelant ou discriminatoire sera supprimé et entraînera le blocage du compte concerné.

---

## Signaler un bug

Avant d'ouvrir un ticket, vérifiez qu'un rapport similaire n'existe pas déjà dans les [Issues GitHub](https://github.com/DireDoch/DeadlockHelper/issues).

Un bon rapport de bug contient les éléments suivants :

**1. Environnement**
- Système d'exploitation et version (ex. : Arch Linux, Windows 11)
- Version de l'application (ex. : `v1.2.0` ou hash du commit)
- Version de Node.js (`node --version`) et de Python (`python3 --version`)

**2. Comportement observé**
Décrivez précisément ce qui se passe, étape par étape, pour reproduire le problème. Un bug impossible à reproduire est impossible à corriger.

**3. Comportement attendu**
Décrivez ce que vous attendiez à la place.

**4. Logs**
Ouvrez les DevTools Electron (`Ctrl+Shift+I`) et joignez les messages d'erreur de la console. Pour les erreurs du processus principal, les logs sont dans :
- Linux : `~/.config/DeadlockHelper/logs/`
- Windows : `%APPDATA%\DeadlockHelper\logs\`

**5. Captures d'écran** (si pertinent)
Une image vaut mieux qu'un long paragraphe pour les problèmes visuels.

---

## Proposer une fonctionnalité

Ouvrez une Issue avec le label `enhancement` et décrivez :

- **Le problème que vous cherchez à résoudre** — pas la solution, le besoin.
- **La solution envisagée** — comment vous imagineriez la fonctionnalité.
- **Les alternatives considérées** — pourquoi vous avez écarté d'autres approches.

Les fonctionnalités qui impliquent l'ajout d'un framework UI (React, Vue, Svelte, etc.) ou une dépendance Python lourde non justifiée seront déclinées — voir les [Règles de code](#règles-de-code).

---

## Contribuer du code

### Prérequis

Assurez-vous d'avoir suivi le guide d'installation complet dans le [README](README.md) avant de commencer. Vous devez avoir Node.js ≥ 18, Python 3.12 et un fork du dépôt configuré localement.

### Flux de travail Git

```bash
# 1. Forkez le dépôt sur GitHub, puis clonez votre fork
git clone https://github.com/VOTRE_PSEUDO/DeadlockHelper.git
cd DeadlockHelper

# 2. Ajoutez le dépôt original comme remote "upstream"
git remote add upstream https://github.com/DireDoch/DeadlockHelper.git

# 3. Créez une branche dédiée à partir de main (jamais directement sur main)
git checkout -b fix/nom-du-bug
# ou
git checkout -b feat/nom-de-la-fonctionnalite

# 4. Travaillez, committez, testez
npm start   # développement avec rechargement à chaud (renderer uniquement)
            # toute modification de src/main/ nécessite de relancer npm start

# 5. Synchronisez avec upstream avant de soumettre
git fetch upstream
git rebase upstream/main

# 6. Poussez et ouvrez une Pull Request
git push origin fix/nom-du-bug
```

**Nommage des branches :**

| Préfixe | Usage |
|---|---|
| `fix/` | Correction d'un bug |
| `feat/` | Nouvelle fonctionnalité |
| `docs/` | Documentation uniquement |
| `refactor/` | Refactoring sans changement fonctionnel |
| `chore/` | Maintenance (dépendances, config, CI) |

### Règles de code

Ces règles ne sont pas négociables — elles définissent l'identité technique du projet.

**TypeScript**

- Le renderer est en **Vanilla TypeScript pur**. N'introduisez pas React, Vue, Svelte ou tout autre framework UI. Chaque composant est une classe TypeScript qui manipule le DOM directement (`document.createElement`, `innerHTML`, `CustomEvent`).
- Documentez toutes les classes, fonctions et méthodes publiques avec **TSDoc** (`@param`, `@returns`, `@throws`). Consultez les fichiers existants comme modèles (`src/main/spotify-logic.ts`).
- Documentez chaque appel API avec l'URL complète de l'endpoint et le flux de données en commentaire — c'est une règle du projet, pas une suggestion.
- Pas de `any` implicite. Typez explicitement les payloads IPC et les réponses API dans `src/lib/types/`.

**Python**

- Respectez **PEP 257** pour les docstrings. Chaque fonction doit avoir une docstring décrivant son comportement, ses arguments et sa valeur de retour.
- Ne modifiez pas `ocr-worker/main.py` sans avoir lu `docs/adr/0005-esp-live-roster-ocr.md` et `docs/ESP_FINAL/OCR_WORKER.md`. Les contraintes (Wayland, evdev, table héros figée) y sont expliquées et ne doivent pas être ré-découvertes.

**IPC Electron**

- Chaque nouveau canal IPC doit suivre la convention `domaine:action` (ex. `spotify:play`).
- Déclarez les nouveaux canaux dans le préload (`src/preload/preload.ts`) **et** documentez-les dans le fichier `src/main/` correspondant avec un bloc JSDoc sur `setupXxxHandlers()`.

**Style**

- Tailwind CSS uniquement. N'ajoutez pas de fichier CSS personnalisé global ni de bibliothèque de composants (ShadCN, DaisyUI, etc.).
- Respectez la configuration Tailwind existante (`tailwind.config.ts`) — n'ajoutez pas de couleurs arbitraires hors de la palette définie.

**Tests**

Il n'y a pas encore de suite de tests automatisés. En attendant, testez manuellement le cas nominal et les cas limites de chaque fonctionnalité modifiée avant de soumettre.

### Messages de commit

Suivez la convention [Conventional Commits](https://www.conventionalcommits.org/) :

```
type(périmètre): description courte en impératif présent

Corps optionnel — expliquez le POURQUOI, pas le QUOI.
Le QUOI est déjà visible dans le diff.
```

**Types acceptés :** `fix`, `feat`, `docs`, `refactor`, `chore`, `style`, `perf`

**Exemples corrects :**
```
fix(spotify): relancer le refresh token après une erreur 401 persistante
feat(live-dashboard): ajouter l'onglet Economy avec DPM et souls par minute
docs(ocr-worker): compléter les docstrings PEP 257 sur parse_roster
```

**À éviter :**
```
fix bug          ← trop vague
WIP              ← ne commitez pas du code non fonctionnel sur main
mise à jour      ← sans contexte
```

Un commit = une modification logique cohérente. Découpez les gros changements en commits atomiques plutôt qu'un seul commit massif.

### Pull Request

- Ouvrez votre PR contre la branche `main`.
- Remplissez le template de PR : description du changement, étapes de test, captures d'écran si l'UI est modifiée.
- Une PR doit toucher un périmètre précis. Évitez les PRs qui mélangent bugfix, refactoring et nouvelle fonctionnalité.
- Les PRs qui modifient `src/main/` (processus principal Electron) doivent mentionner explicitement que le contributeur a relancé `npm start` et testé en conditions réelles — le HMR ne couvre pas le main process.
- Toute modification de l'architecture IPC ou de la détection de match doit référencer l'ADR concerné (`docs/adr/`).

---

## Questions

Pour une question générale sur le projet (pas un bug, pas une PR), ouvrez une [Discussion GitHub](https://github.com/DireDoch/DeadlockHelper/discussions) plutôt qu'une Issue. Les Issues sont réservées aux bugs et aux demandes de fonctionnalités actionnables.

---

---

# English version

## Contributing to DeadlockHelper

Thank you for your interest in the project. This document defines the rules for contributing effectively and consistently, whether you are reporting a bug, suggesting a feature, or submitting code.

---

### Code of Conduct

This project is open to anyone who wishes to contribute, regardless of experience level. All interactions must remain respectful, constructive, and technically focused. Disrespectful, harassing, or discriminatory comments will be removed and the account will be blocked.

---

### Reporting a Bug

Before opening an issue, check that a similar report does not already exist in the [GitHub Issues](https://github.com/DireDoch/DeadlockHelper/issues).

A good bug report includes:

**1. Environment** — OS and version, application version, Node.js and Python versions.

**2. Steps to reproduce** — Describe exactly what you did, step by step. A bug that cannot be reproduced cannot be fixed.

**3. Expected behavior** — What you expected to happen instead.

**4. Logs** — Open the Electron DevTools (`Ctrl+Shift+I`) and attach any console errors. Main process logs are in `~/.config/DeadlockHelper/logs/` (Linux) or `%APPDATA%\DeadlockHelper\logs\` (Windows).

**5. Screenshots** — For visual issues, a screenshot is worth more than a paragraph.

---

### Suggesting a Feature

Open an Issue with the `enhancement` label and describe the problem you are trying to solve (not the solution), your proposed approach, and any alternatives you considered. Features that require adding a UI framework (React, Vue, Svelte, etc.) or an unjustified heavy Python dependency will be declined.

---

### Contributing Code

#### Prerequisites

Follow the full installation guide in the [README](README.md) before starting. You need Node.js ≥ 18, Python 3.12, and a configured local fork of the repository.

#### Git Workflow

```bash
# 1. Fork the repo on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/DeadlockHelper.git

# 2. Add the original repo as "upstream"
git remote add upstream https://github.com/DireDoch/DeadlockHelper.git

# 3. Create a dedicated branch from main (never commit directly to main)
git checkout -b fix/bug-name
# or
git checkout -b feat/feature-name

# 4. Work, commit, test
npm start   # dev with hot reload (renderer only)
            # any change to src/main/ requires restarting npm start

# 5. Sync with upstream before submitting
git fetch upstream
git rebase upstream/main

# 6. Push and open a Pull Request
git push origin fix/bug-name
```

#### Code Rules

**TypeScript** — The renderer is **pure Vanilla TypeScript**. Do not introduce React, Vue, Svelte, or any other UI framework. Every component is a TypeScript class that manipulates the DOM directly. Document all public classes, functions, and methods with **TSDoc** (`@param`, `@returns`, `@throws`). Document every API call with the full endpoint URL and data flow in a comment.

**Python** — Follow **PEP 257** for docstrings. Read `docs/adr/0005-esp-live-roster-ocr.md` before modifying `ocr-worker/main.py` — the constraints (Wayland, evdev, frozen hero table) are explained there.

**IPC Electron** — Every new IPC channel must follow the `domain:action` convention and be declared in the preload (`src/preload/preload.ts`) and documented in the corresponding `src/main/` file.

**Style** — Tailwind CSS only. Do not add global CSS files or component libraries.

#### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): short description in present imperative tense

Optional body — explain WHY, not WHAT. The diff already shows what changed.
```

Accepted types: `fix`, `feat`, `docs`, `refactor`, `chore`, `style`, `perf`.

One commit = one coherent logical change. Split large changes into atomic commits.

#### Pull Requests

- Open your PR against the `main` branch.
- Fill in the PR template: description, test steps, screenshots if UI is affected.
- PRs that modify `src/main/` must explicitly confirm that `npm start` was restarted and the feature was tested end-to-end.
- Any change to IPC architecture or match detection must reference the relevant ADR in `docs/adr/`.

---

### Questions

For general questions (not a bug, not a PR), open a [GitHub Discussion](https://github.com/DireDoch/DeadlockHelper/discussions) rather than an Issue. Issues are reserved for actionable bugs and feature requests.
