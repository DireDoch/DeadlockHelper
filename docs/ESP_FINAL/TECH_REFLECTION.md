# Rapport de réflexion technique – Deadlock App (TP4)

Ce document analyse de manière factuelle quatre axes techniques de la preuve de concept, puis formule des avis et recommandations critiques et constructives.

---

## 1. Communication IPC : Main process (Node.js) ↔ script Python (child_process.spawn)

### 1.1 Mécanisme en place

Le passage de données entre le processus principal Electron et le moteur Python repose sur :

- **child_process.spawn** (`python-runner.ts`) : lancement du binaire `python` avec les arguments CLI (`--query`, `--param`, `--mock`, `--health-check`).
- **Entrée** : uniquement des arguments (pas de stdin utilisé). Les paramètres sont passés en ligne de commande.
- **Sortie** : le script Python écrit un **unique objet JSON sur stdout** ; le Main process accumule les chunks dans une chaîne, puis fait un `JSON.parse(stdout)` au `close` du processus.
- **Gestion d’erreurs** : code de sortie ≠ 0 ou échec de parsing JSON → rejet avec un objet structuré (`RunPythonError`), remonté au renderer via `ipcMain.handle('python:execute')`.

### 1.2 Latence

| Facteur | Impact |
|--------|--------|
| **Démarrage du processus Python** | Coût fixe à chaque appel (fork/exec, chargement de l’interpréteur et des modules). Typiquement **100–500 ms** selon la machine. |
| **Exécution du script** | Dépend de la requête : health-check (un GET API) ~200–1000 ms ; match (fetch + historiques + calcul des tags) **1–5 s** ou plus. |
| **Sérialisation JSON** | Payload match avec 12 joueurs et tags : sortie souvent **50–200 Ko**. Temps de `JSON.parse` côté Node négligeable (< 10 ms). |
| **Total perçu** | Pour un chargement de match : **1,5–6 s** (process + réseau + calcul). La latence dominante est l’exécution Python et l’API, pas l’IPC en soi. |

La « latence IPC » au sens strict (données Main ↔ process enfant) est faible : il n’y a pas de round-trip continu, seulement un flux stdout lu en une fois à la fin. Le goulot est le **coût d’un nouveau process par requête** et les appels réseau effectués par le script.

### 1.3 Fiabilité

- **Fiabilité du canal** : Tant que le process Python s’arrête proprement et écrit un JSON valide sur stdout, le flux est fiable. Les sorties de debug (ex. `print(..., file=sys.stderr)`) n’impactent pas le parse si tout le JSON va sur stdout.
- **Risques** :
  - **Python absent ou pas dans PATH** : `proc.on('error')` déclenché, message et `hint` renvoyés au renderer.
  - **Crash ou exit code ≠ 0** : stdout/stderr capturés et renvoyés ; le Main ne parse pas, évitant des états incohérents.
  - **JSON mal formé** (traceback imprimé, sortie mixte) : `JSON.parse` lance, rejet avec `Failed to parse Python output as JSON` et contenu stdout/stderr pour le debug.
- **Robustesse actuelle** : Une seule réponse JSON par invocation, pas de protocole multi-messages, ce qui limite les cas de parsing partiel. En revanche, tout log ou print oublié en Python peut casser le parse.

### 1.4 Avis et recommandations

**Avis**  
L’usage de spawn + JSON sur stdout est **simple et adapté à une preuve de concept** : pas de dépendance à un bus ou à un socket, un seul canal de sortie. La fiabilité est correcte si le script respecte la contrainte « un seul JSON sur stdout ». En revanche, **chaque requête paye le coût d’un nouveau process**, ce qui dégrade l’expérience sur des actions répétées (ex. rafraîchissements du dashboard).

**Recommandations**

1. **Isoler strictement la sortie JSON** : en Python, écrire la réponse uniquement sur stdout (pas de `print` debug sur stdout) ou utiliser un fichier temporaire + chemin en argument pour les réponses lourdes, et garder les logs sur stderr.
2. **Envisager un processus Python long-lived** : un seul process qui écoute sur stdin (lignes JSON de requêtes) et répond en JSON sur stdout. Le Main ouvrirait ce process au démarrage et enverrait les requêtes en évitant le coût de spawn à chaque appel. Complexité plus élevée mais latence et charge CPU améliorées.
3. **Exposer la durée côté renderer** : renvoyer `durationMs` (déjà calculé dans `RunPythonSuccess`) au front pour afficher un indicateur « chargement long » ou un timeout utilisateur au-delà de 5–10 s.

---

## 2. Packaging Python : inclusion des scripts et de rank_thresholds.json dans le build

### 2.1 Configuration actuelle

- **Electron Forge** (`forge.config.ts`) : `packagerConfig.extraResource: ['src/python']`.
- **Effet** : le dossier `src/python` est copié **tel quel** dans le répertoire des ressources du build (à côté de l’app.asar), généralement sous `resources/` (ou équivalent selon l’OS). Les fichiers ne sont **pas** inclus dans l’asar.
- **Résolution au runtime** : `getDataProcessorScriptPath(appPath, isPackaged)` retourne, en packagé, `path.join(process.resourcesPath, 'python', 'data_processor.py')`. Le répertoire de travail (`cwd`) passé au spawn est `path.dirname(scriptPath)`, donc le dossier contenant `data_processor.py` et **rank_thresholds.json**.

### 2.2 Complexité observée

| Aspect | Détail |
|--------|--------|
| **Structure attendue** | Dans `resources/`, le dossier doit s’appeler `python` et contenir `data_processor.py` et `rank_thresholds.json`. Avec `extraResource: ['src/python']`, le nom du dossier source (`src/python`) est conservé par Forge ; il faut vérifier que le chemin final est bien `resources/python/` (parfois le nom du dossier source est préservé, donc `resources/src/python/` — à valider selon la version de Forge). |
| **Répertoire de travail** | En packagé, `cwd` est `path.dirname(scriptPath)` : le script et le JSON doivent être dans le même dossier pour que `load_tag_config()` trouve `rank_thresholds.json` via `os.path.dirname(__file__)`. |
| **Python binaire** | Aucun Python embarqué : l’exécutable système (`python` ou `python3`) est utilisé. Sur une machine sans Python, l’appli échoue. |
| **Dépendances Python** | Les imports du script (stdlib uniquement dans l’état actuel) sont satisfaits par l’environnement système. L’ajout de dépendances (ex. `requests`) impose que l’utilisateur ait un venv ou un Python avec ces paquets, ou alors d’envisager un binaire PyInstaller/cx_Freeze livré en ressource. |

La complexité principale est **la cohérence des chemins** (source → ressource packagée → `process.resourcesPath`) et **l’environnement d’exécution** (Python + modules) sur chaque machine cible.

### 2.3 Avis et recommandations

**Avis**  
L’utilisation d’`extraResource` pour livrer le moteur Python et sa config est **adaptée à une preuve de concept** et évite d’embarquer un runtime Python complet. En contrepartie, le déploiement dépend du PATH et de l’installation Python côté utilisateur, et la structure des dossiers après packaging doit être vérifiée (nom du dossier copié).

**Recommandations**

1. **Vérifier le chemin packagé** : après `npm run package` ou `make`, inspecter le contenu de `out/<app>-win32-x64/resources/` (ou équivalent) et confirmer que `data_processor.py` et `rank_thresholds.json` sont bien dans le même dossier utilisé comme `cwd` par le runner. Ajuster `extraResource` (ou un script de copie personnalisé) si le nom du dossier diffère (ex. `resources/src/python` → adapter `getDataProcessorScriptPath` ou la config Forge).
2. **Documenter les prérequis** : dans le README ou l’installer, préciser « Python 3.10+ requis et disponible dans le PATH » pour éviter les erreurs « Failed to start Python process » en production.
3. **Évolution possible** : pour un produit distribué à des utilisateurs non techniques, envisager soit un wrapper installateur qui vérifie la présence de Python, soit une version du moteur compilée (PyInstaller) livrée comme ressource et invoquée comme binaire, pour ne plus dépendre du PATH.

---

## 3. Gestion OAuth / OpenID : Spotify vs Steam

### 3.1 Flux Spotify (Authorization Code + Refresh Tokens)

- **Ouverture** : `buildAuthorizeUrl(state)` construit l’URL d’autorisation (client_id, redirect_uri, scope, state). Pas de PKCE dans le code actuel ; l’échange de code contre token utilise **client_id + client_secret** (client confidentiel).
- **Callback** : serveur HTTP temporaire sur `redirect_uri` (ex. `http://127.0.0.1:30765/...`), écoute du paramètre `code` et validation du `state`.
- **Échange** : `exchangeCodeForToken(code)` → POST vers `/api/token` avec `grant_type=authorization_code`, code, redirect_uri, et en-tête Basic (client_id:client_secret). Réponse : access_token, refresh_token, expires_in.
- **Persistance** : electron-store (fichier `spotify-auth.json`) : accessToken, refreshToken, expiresAtMs, premium, displayName, etc.
- **Rafraîchissement** : avant chaque appel API, `getValidAccessToken()` vérifie si `Date.now() >= expiresAtMs - TOKEN_REFRESH_BUFFER_MS` (60 s) ; si oui, `refreshAccessToken()` (POST avec `grant_type=refresh_token`). En cas de 401 sur une requête API, un retry après refresh est effectué (`spotifyApiRequest(..., allowRetry)`).

**Difficulté** : Gestion d’un serveur de callback, validation state, échange de code, **cycle de vie des tokens** (expiration, refresh, retry 401), et persistance multi-champs. Surface de code importante (ordre de grandeur : plusieurs centaines de lignes dans `spotify-service.ts`).

### 3.2 Flux Steam (OpenID 2.0, redirection locale)

- **Ouverture** : URL OpenID vers `steamcommunity.com/openid/login` avec `openid.return_to` et `openid.realm` pointant vers un serveur local (ex. `http://localhost:30765/callback`). Steam n’accepte que HTTP/HTTPS pour return_to, d’où l’usage d’un serveur local plutôt qu’un custom protocol.
- **Callback** : serveur HTTP sur un port fixe (30765), écoute de GET ou POST ; extraction de `openid.claimed_id` (ou `openid.identity`). Pas d’échange de code : l’identifiant est **directement dans l’URL** (ou le body en POST).
- **Extraction** : `extractSteamId64(claimedId)` parse l’URL pour obtenir le SteamID64. Aucun token à stocker pour l’authentification ; optionnellement appel à l’API Steam (GetPlayerSummaries) pour avatar et personaname.
- **Persistance** : electron-store (`steam-profile`) : steamId64, avatarUrl, personaname.

**Difficulté** : Un serveur de callback et le parsing d’URL OpenID. Pas d’expiration de token ni de refresh : une fois le SteamID64 obtenu, il suffit pour les appels métier (ex. match actif). Moins de cas limites que Spotify.

### 3.3 Comparaison

| Critère | Spotify | Steam |
|--------|--------|--------|
| **Callback** | Serveur HTTP temporaire, port dédié | Serveur HTTP temporaire, port fixe |
| **Données sensibles** | Oui (tokens, client_secret) ; stockage persistant | Non (identifiant public) ; stockage minimal |
| **Cycle de vie** | Expiration, refresh, retry 401 | Aucun ; identifiant stable |
| **Surface de code** | Élevée (token exchange, refresh, profil, Premium) | Modérée (callback + parse + optionnel GetPlayerSummaries) |
| **Risques** | Fuite de refresh_token, mauvaise gestion d’expiration | Port déjà utilisé, réponse OpenID mal formée |

**Avis**  
Le flux Steam est **objectivement plus simple** : pas de notion de token expirant ni de refresh, et l’identifiant est dérivé directement de la redirection. Le flux Spotify est **plus complexe** en raison de la gestion des tokens (stockage, refresh, synchronisation avec les appels API) et des cas d’erreur (401, premium requis, timeout).

**Recommandations**

1. **Spotify** : documenter que le client est confidentiel (client_secret utilisé côté Main uniquement) et que les secrets ne doivent jamais être exposés au renderer. Pour un client public (ex. app sans backend), ajouter PKCE (code_verifier / code_challenge) en plus du state.
2. **Steam** : pour la production, envisager la vérification OpenID complète (POST vers l’endpoint de vérification Steam) pour s’assurer que la réponse n’a pas été forgée, au lieu de se fier uniquement au format de `claimed_id`.
3. **Port commun** : les deux flux utilisent un port local (ex. 30765). S’assurer qu’un seul des deux serveurs écoute à la fois (flux séquentiels) ou utiliser des ports différents si des callbacks simultanés étaient possibles.

---

## 4. Performance du cache (electron-store) vs appel API direct

### 4.1 Comportement actuel

- **Stockage** : electron-store (fichier JSON sur disque, par défaut dans `app.getPath('userData')`). Le cache des matchs est une clé par match : `matchCache.${matchId}` → `{ match_id, data: MatchData, cached_at }`.
- **Lecture** : `store.get('matchCache.${matchId}')` est **synchrone** ; pas d’appel réseau, pas de spawn Python.
- **Écriture** : `store.set(...)` après un retour réussi de `python:execute` pour un match ; le renderer peut aussi appeler `api:cache-match` après avoir reçu des données.

**Scénario sans cache (premier chargement ou cache miss)**  
Renderer → `executePython('match', matchId)` → Main spawn Python → Python appelle l’API Deadlock (match + historiques) → calcul des tags → JSON stdout → Main parse → retour IPC au renderer. Ensuite le Main (ou le renderer) écrit dans le store. Temps total : process + réseau + calcul (typiquement 1,5–6 s).

**Scénario avec cache hit (API en erreur ou fallback explicite)**  
En cas d’erreur API (ou `status === 'api_error'`), le handler `python:execute` lit `store.get('matchCache.${param}')` et renvoie `cachedMatch.data` avec `cached: true`. Le renderer peut aussi appeler `getCachedMatch(matchId)` si la réponse indique une erreur. Temps : **quelques millisecondes** (lecture fichier + IPC), sans spawn ni réseau.

### 4.2 Impact sur le temps de chargement du Live Dashboard

| Scénario | Latence typique | Composants sollicités |
|----------|------------------|------------------------|
| **API directe (succès)** | 1,5–6 s | spawn Python, requêtes HTTP depuis Python, calcul tags, JSON parse, store.set, IPC |
| **Cache hit (après erreur API ou fallback)** | &lt; 50 ms | store.get, IPC |
| **Cache miss + API en panne** | Échec après timeout Python / erreur réseau | Pas de réduction ; l’utilisateur voit une erreur ou le bandeau « Données en cache » s’il y avait un cache d’un match précédent réutilisé. |

L’impact est donc **très positif** lorsque le cache est utilisé : suppression du coût process + réseau, le dashboard affiche presque instantanément le dernier match connu. En revanche, le **premier chargement** (ou un nouveau match jamais mis en cache) ne bénéficie pas du cache ; la latence reste celle du pipeline Python + API.

### 4.3 Avis et recommandations

**Avis**  
L’utilisation d’electron-store pour le cache de match est **pertinente** : lecture/écriture synchrones, pas de dépendance réseau pour un hit, et intégration naturelle dans le flux IPC (fallback transparent quand l’API échoue). Le temps de chargement du Live Dashboard en cas de cache hit est **négligeable** par rapport à un appel API direct.

**Recommandations**

1. **TTL ou taille maximale** : sans politique d’éviction, le cache peut croître indéfiniment. Introduire soit un TTL (ex. invalider les entrées de plus de 24 h), soit un plafond du nombre d’entrées (ex. 10 derniers matchs) avec suppression des plus anciennes.
2. **Indicateur visuel** : le bandeau « Données en cache » est déjà en place ; s’assurer qu’il est bien visible et qu’un rafraîchissement manuel réessaie l’API pour mettre à jour quand le réseau revient.
3. **Mesure** : optionnellement, exposer dans le handler IPC ou dans les logs si la réponse provient du cache (`cached: true`) et le `cached_at`, pour analyser en conditions réelles la part des chargements servis par le cache.

---

## 5. Détection de partie : API communautaire vs journal local du jeu

### 5.1 Le problème constaté

La détection « en partie » reposait initialement sur l'endpoint `GET /v1/matches/active?account_ids={id}`. Un **logging temporaire ajouté en production** (module `detection-logger.ts`, écrivant chaque cycle dans un fichier) a permis de diagnostiquer en conditions réelles : sur une vraie partie, **159 appels consécutifs** à cet endpoint ont tous renvoyé un tableau vide, alors que le compte interrogé figurait bien dans le match. La documentation de l'API a confirmé la cause : `/matches/active` est *« fetched from the watch tab… limited to the **top 200 matches** »* — il ne couvre que les ~200 parties live les mieux classées, **jamais une partie normale**.

### 5.2 La solution : lire le `console.log` du jeu

Deadlock (lancé avec `-condebug`) écrit son journal en clair, qui contient le `match_id` dès la connexion au serveur (`Lobby <id> for Match <matchId> created`). Un `LogWatcher` lit le nouveau contenu et en émet des événements (`match-started` / `match-ended`). Deux écueils ont été corrigés :

- une **chaîne de détection erronée** (`InProgress` au lieu de `GameInProgress`) qui ne matchait jamais ;
- une dépendance à **`fs.watch`** non fiable pour un fichier écrit via Proton/Wine → ajout d'un **polling de secours (2 s)** et d'un garde de troncature pour `-conclearlog`.

Une variable `matchSource` (`'log' | 'api'`) garantit qu'un poll API vide ne peut pas clore une partie détectée localement. L'API est rétrogradée au rang de simple fallback.

### 5.3 Limite résiduelle : pas de roster live pour les parties normales

Le journal donne le `match_id` mais **pas** les 11 autres joueurs (ils transitent par des messages GC binaires). Le roster complet vient de `GET /v1/matches/{id}/metadata`, qui n'est disponible **qu'après** l'ingestion de la partie. La seule source réellement live (`/v1/matches/{id}/live/url`) exige un **parseur de diffusion Source 2** (haste / demofile-net) — piste identifiée mais hors périmètre.

### 5.4 Avis et recommandations

**Avis** — Le diagnostic par logging temporaire a été décisif : il a transformé une intuition (« l'API ne marche pas ») en preuve factuelle (159/159 vides, doc top-200), évitant de bâtir une solution sur une fondation invalide. Le pivot vers le journal local est la bonne décision : source fiable, instantanée, sans dépendance réseau ni quota.

**Recommandations**

1. **Retirer le logging temporaire** (`detection-logger.ts` + lignes `[TEMP DEBUG]`) une fois la détection stabilisée — il n'a de valeur qu'en phase de diagnostic.
2. **Détecter l'absence de `-condebug`** : si le `console.log` ne grossit pas alors que le jeu tourne, avertir l'utilisateur que les options de lancement sont manquantes plutôt que d'échouer silencieusement.
3. **Évolution « vrai live »** : pour afficher le roster pendant la partie (et pas seulement après), intégrer un parseur de broadcast Source 2 en *sidecar* alimenté par `/matches/{id}/live/url`.

> ⚠️ **Gotcha de développement** : le code du **processus principal** Electron ne se recharge pas à chaud (le HMR de Vite ne touche que le renderer). Toute modification de `main.ts` / `log-watcher.ts` exige un redémarrage complet de `npm start`, sous peine de tester un binaire périmé.

---

## Synthèse des recommandations prioritaires

| Priorité | Domaine | Action |
|----------|--------|--------|
| Haute | IPC / Python | Confiner toute sortie JSON sur stdout (ou fichier dédié) ; envisager un process long-lived si les appels sont fréquents. |
| Haute | Packaging | Vérifier la structure réelle sous `resources/` après build et documenter Python 3.10+ dans le PATH. |
| Moyenne | OAuth | Vérification OpenID complète pour Steam ; documentation sécurité (client_secret, PKCE si client public) pour Spotify. |
| Moyenne | Cache | TTL ou limite du nombre d’entrées en cache ; garder un indicateur clair « données en cache » et option de rafraîchissement. |
| Haute | Détection | Détection via le `console.log` local (l'API `/matches/active` est top-200 only) ; retirer le logging temporaire ; détecter l'absence de `-condebug`. |

Ce rapport reflète l’état du code et de la configuration au moment de la rédaction ; les mesures de latence sont des ordres de grandeur et peuvent varier selon l’environnement et la charge des APIs externes.
