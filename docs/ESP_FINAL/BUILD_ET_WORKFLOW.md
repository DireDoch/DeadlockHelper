# Build, Workflow GitHub et Décisions Techniques

Ce document explique comment DeadlockHelper passe du code source sur ton ordinateur à un fichier `.AppImage` ou `.exe` que quelqu'un peut télécharger et lancer. Il couvre le pipeline de build complet, le rôle de chaque outil, et les raisons derrière chaque décision importante.

---

## Vue d'ensemble : deux mondes séparés

L'application est divisée en deux environnements d'exécution très différents, et comprendre cette séparation est la clé pour comprendre tout le reste.

**Le Main Process** (processus principal) tourne dans Node.js, à l'intérieur d'Electron. C'est lui qui gère les fenêtres, qui parle à l'OS, qui appelle Python, qui communique avec Steam et Spotify. Il n'a pas d'interface visuelle — c'est le cerveau en coulisses.

**Le Renderer Process** (processus de rendu) est essentiellement un navigateur web embarqué (Chromium). C'est lui qui affiche l'interface : les pages de profil, le Live Dashboard, le widget Spotify. Il ne peut pas toucher directement au système — il doit passer par le Main Process via un mécanisme appelé IPC (Inter-Process Communication).

Cette séparation existe pour des raisons de sécurité. Si le Renderer était compromis (par exemple via une page malveillante chargée par erreur), il ne pourrait pas accéder aux fichiers du système ou exécuter des commandes. C'est une contrainte Electron, pas un choix arbitraire.

---

## Le workflow de développement (`npm start`)

Quand tu développes, tu lances `npm start`. Cela appelle **electron-forge**, qui orchestre tout automatiquement :

1. Il démarre un serveur de développement Vite pour le Renderer (avec rechargement à chaud).
2. Il compile le Main Process à la volée avec Vite.
3. Il lance Electron qui charge le tout.

En mode développement, Electron charge le Renderer depuis `http://localhost:XXXX` (un vrai serveur HTTP local). Vite injecte une variable globale `MAIN_WINDOW_VITE_DEV_SERVER_URL` que le Main Process utilise pour savoir où pointer la fenêtre.

**Pourquoi electron-forge pour le dev et electron-builder pour la prod ?** Electron-forge avec son plugin Vite est très bien intégré pour le développement — il gère le rechargement, les configs multiples, la coordination entre Main et Renderer. Mais pour produire les installateurs (`.AppImage`, `.exe`), electron-builder offre plus de contrôle sur la structure du paquet final, notamment la gestion des `extraResources` qui est essentielle pour PyInstaller.

---

## Le pipeline de build production

### Étape 1 : Déclencher le build avec un tag Git

Tout commence avec un tag Git. Le fichier `.github/workflows/release.yml` est configuré pour se déclencher uniquement quand un tag commençant par `v` est poussé :

```
on:
  push:
    tags:
      - 'v*'
```

Cela signifie que chaque `git tag v1.0.x && git push origin v1.0.x` déclenche automatiquement un build sur les serveurs de GitHub. Le code n'est jamais buildé "à la main" en production — le tag est la seule porte d'entrée.

### Étape 2 : La matrice de build — Linux et Windows en parallèle

GitHub Actions lance **deux machines virtuelles en parallèle** grâce à la configuration `matrix` :

- Une machine `ubuntu-latest` qui produit le **AppImage Linux**
- Une machine `windows-latest` qui produit l'**installateur Windows (NSIS)**

Les deux exécutent exactement les mêmes étapes, mais sur des systèmes d'exploitation différents. Le résultat (`.AppImage` ou `.exe`) dépend de la plateforme sur laquelle la build tourne. C'est élégant : un seul fichier de workflow, deux artefacts.

### Étape 3 : Synchroniser la version

```bash
npm version "${GITHUB_REF_NAME#v}" --no-git-tag-version
```

Cette ligne extrait la version du nom du tag (par exemple `v1.0.3` → `1.0.3`) et l'écrit dans `package.json`. C'est nécessaire parce que electron-builder lit la version dans `package.json` pour nommer les fichiers de sortie et trouver la release GitHub sur laquelle uploader. Sans cette synchronisation, electron-builder chercherait une release `v1.0.0` (la valeur par défaut) qui n't existe peut-être pas ou qui est déjà publiée.

### Étape 4 : Compiler Python avec PyInstaller

```bash
pip install pyinstaller
pyinstaller --onefile --distpath src/python/dist ...
```

C'est l'une des décisions les plus importantes du projet. `data_processor.py` appelle l'API Deadlock pour récupérer les données de matchs. Sur Linux, `python3` est presque toujours installé — pas de problème. Mais sur Windows, Python n'est pas présent par défaut. Demander aux utilisateurs de l'installer manuellement est une friction inacceptable.

**PyInstaller résout ce problème en compilant le script Python et l'interpréteur Python lui-même en un seul exécutable autonome.** Le résultat est :
- `data_processor` sur Linux (~8 MB)
- `data_processor.exe` sur Windows (~15 MB)

Ces binaires ne dépendent d'aucune installation Python sur la machine de l'utilisateur. PyInstaller crée le binaire sur la plateforme cible (Linux build → binaire Linux, Windows build → binaire Windows), ce qui est exactement ce qu'on veut.

L'option `--onefile` est cruciale : sans elle, PyInstaller crée un dossier avec des dizaines de fichiers, ce qui est difficile à distribuer. Avec `--onefile`, tout est dans un seul exécutable, même si le démarrage est légèrement plus lent (PyInstaller doit extraire les fichiers dans un répertoire temporaire à chaque lancement).

### Étape 5 : Compiler les bundles Vite

```bash
npm run build:vite
```

Cette commande lance **cinq compilations Vite** dans l'ordre :

| Config | Entrée | Sortie | Rôle |
|--------|--------|--------|------|
| `vite.main-window.config.mjs` | `index.html` | `.vite/renderer/main_window/` | Interface principale |
| `vite.overlay-window.config.mjs` | `overlay.html` | `.vite/renderer/overlay_window/` | Overlay in-game |
| `vite.main.config.ts` | `src/main/main.ts` | `.vite/build/main.mjs` | Processus principal Node.js |
| `vite.preload.config.ts` | `src/preload/preload.ts` | `.vite/build/` | Pont IPC fenêtre principale |
| `vite.overlay-preload.config.ts` | `src/preload/overlay-preload.ts` | `.vite/build/` | Pont IPC overlay |

**Pourquoi cinq compilations séparées et pas une seule ?** Parce que chaque cible a des contraintes différentes. Le Main Process doit être compilé pour Node.js (format ESM, modules Node externaux, pas de bundling des dépendances npm). Les Renderers doivent être compilés pour le navigateur (Tailwind, optimisation des assets, chemins relatifs). Les Preloads sont un cas intermédiaire — ils tournent dans Chromium mais ont accès aux APIs Node. Vite ne peut pas faire ça en un seul passage.

**Décision clé — `base: './'`** : Les configs des Renderers ont `base: './'`. Sans ça, Vite génère des chemins absolus dans `index.html` comme `/assets/index-xxx.js`. Dans un navigateur web normal, `/` pointe vers la racine du serveur. Dans Electron avec le protocole `file://`, `/` pointe vers la racine du filesystem — le fichier n'existe pas là. Le `./` force des chemins relatifs qui fonctionnent quel que soit l'endroit où le fichier est chargé.

**Décision clé — injection des credentials via `define`** : Le Main Process a besoin des credentials Spotify (`CLIENT_ID`, `CLIENT_SECRET`) et de la clé Steam API au runtime. En développement, ces valeurs viennent du fichier `.env`. En production, ce fichier n'existe pas — il est dans le `.gitignore`. La solution est d'utiliser le système `define` de Vite : pendant la compilation, Vite remplace littéralement `process.env.SPOTIFY_CLIENT_ID` par la valeur de la variable d'environnement du moment de la build. Le binaire final contient la valeur en dur, comme une constante. En CI, ces valeurs viennent des GitHub Secrets.

### Étape 6 : Packager avec electron-builder

```bash
npx electron-builder --linux AppImage --publish always
```

electron-builder prend tous les fichiers compilés et les assemble en un paquet distribuable. Voici ce qu'il fait concrètement :

**Le fichier ASAR** : electron-builder regroupe `.vite/**/*` et `package.json` dans une archive `.asar`. C'est essentiellement une archive TAR optimisée pour Electron. Elle contient tout le code compilé de l'application. L'archive est en lecture seule une fois créée — c'est important pour comprendre pourquoi on ne peut pas y écrire des fichiers au runtime.

**Les extraResources** : Le binaire PyInstaller (`data_processor` ou `data_processor.exe`) est copié *en dehors* de l'archive ASAR, dans le dossier `resources/python/`. C'est intentionnel : l'archive ASAR est en lecture seule, et Python doit pouvoir s'exécuter comme un binaire normal. `process.resourcesPath` dans le code pointe vers ce dossier `resources/`.

**Le format AppImage** : Sur Linux, l'AppImage est un format d'exécutable universel. L'application entière (Electron + code + ressources) est compressée dans un seul fichier. Quand l'utilisateur le lance, il se monte comme un système de fichiers virtuel dans `/tmp/`. C'est pour ça que le chemin dans les logs ressemblait à `/tmp/.mount_DeadloOqa2ZN/...` — c'est normal, c'est le point de montage temporaire. Ce dossier est en lecture seule, d'où l'erreur du logger temporaire qui tentait d'y écrire.

**Le format NSIS pour Windows** : NSIS génère un installateur traditionnel avec un wizard d'installation. L'utilisateur peut choisir où installer l'application, et un raccourci est créé dans le menu Démarrer.

### Étape 7 : Upload automatique vers GitHub Releases

`--publish always` demande à electron-builder d'uploader le résultat directement vers une GitHub Release. Le token `GH_TOKEN` (automatiquement fourni par GitHub Actions) lui donne la permission de créer et modifier des releases. La release est créée en mode **draft** (brouillon) — elle n'est pas publique tant qu'on ne la publie pas manuellement depuis l'interface GitHub. Ça permet de vérifier les fichiers avant de les rendre disponibles.

---

## La structure des secrets GitHub

Les credentials sensibles ne doivent jamais être dans le code source. Ils vivent dans `Settings → Secrets and variables → Actions` du repository GitHub. Quatre secrets sont nécessaires :

| Secret | Usage |
|--------|-------|
| `SPOTIFY_CLIENT_ID` | Identifiant de l'app Spotify (dashboard Spotify for Developers) |
| `SPOTIFY_CLIENT_SECRET` | Clé secrète Spotify pour le token refresh |
| `SPOTIFY_REDIRECT_URI` | URL de callback OAuth (`http://127.0.0.1:30765/spotify/callback`) |
| `STEAM_API_KEY` | Clé Steam Web API pour récupérer les profils joueurs |

Ces secrets sont passés comme variables d'environnement au step `Build Vite bundles`. Vite les lit via `process.env.*` dans `vite.main.config.ts` et les bake dans le bundle. Après la compilation, ces valeurs font partie du binaire — elles ne sont plus des variables d'environnement.

---

## Comment le Main Process trouve Python au runtime

C'est un des points les plus subtils de l'architecture. Le code dans `python-runner.ts` a deux comportements distincts selon que l'app est packagée ou non :

```
En développement (app.isPackaged = false) :
  → spawne : python3 src/python/data_processor.py --query items
  → Python doit être installé sur la machine du développeur

En production (app.isPackaged = true) :
  → spawne : /path/to/resources/python/data_processor (ou .exe)
  → Aucune installation Python requise — le binaire est autonome
```

La fonction `getDataProcessorPath()` retourne le bon chemin et un booléen `directExecutable` qui indique si on doit appeler un interpréteur Python ou exécuter le binaire directement. `runPython()` adapte la commande de spawn en conséquence.

---

## Comment relancer un build

Le workflow complet pour créer une nouvelle release :

```bash
# 1. S'assurer d'être à jour
git pull

# 2. Commiter les changements si nécessaire
git add ...
git commit -m "..."
git push

# 3. Supprimer l'ancien tag s'il existe déjà sur le même numéro
git tag -d v1.0.x
git push origin :refs/tags/v1.0.x

# 4. Créer le tag sur le dernier commit et le pousser
git tag v1.0.x
git push origin v1.0.x
```

Le push du tag déclenche automatiquement le workflow GitHub. Le build prend environ 5-10 minutes (PyInstaller est la partie la plus longue). La release draft apparaît ensuite dans l'onglet "Releases" du repository.

---

## Ce qui ne change pas entre dev et prod

Certaines choses fonctionnent identiquement dans les deux environnements et n'ont jamais été un problème :

- **La détection de partie** : le LogWatcher lit un fichier de log Deadlock sur le disque. Ça marche pareil packagé ou non.
- **electron-store** : la persistance des données (profil Steam, cache des matchs, settings overlay) utilise `app.getPath('userData')` — un dossier dans `~/.config/DeadlockHelper` sur Linux, `%APPDATA%\DeadlockHelper` sur Windows. Ce chemin est toujours accessible en écriture.
- **La fenêtre overlay** : créée et détruite dynamiquement par le Main Process selon l'état du jeu. La logique est la même packagée ou non.
- **L'IPC** : tous les canaux `ipcMain.handle` / `ipcRenderer.invoke` fonctionnent identiquement.
