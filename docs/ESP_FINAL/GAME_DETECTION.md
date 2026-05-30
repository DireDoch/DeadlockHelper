# Détection de partie et états du Live Dashboard

Ce document décrit le pipeline de détection du jeu Deadlock et la machine à états qui pilote l'interface du Live Dashboard.

---

## 1. Vue d'ensemble

Le Main process tourne un service de surveillance en arrière-plan qui combine **trois sources** :

1. **L'OS** (`pgrep` / `tasklist`), toutes les **7 s** : le jeu est-il ouvert ? → `GAME_CLOSED` / `GAME_MENU`.
2. **Le `console.log` local de Deadlock** (`LogWatcher`), en quasi temps réel : suis-je *réellement* entré en partie, et avec quel `match_id` ? → **source principale** de `GAME_IN_MATCH`.
3. **L'API communautaire** (`/v1/matches/active`), toutes les **20 s** : *fallback* best-effort (voir §3 — limité au top 200 des parties live).

```
OS (pgrep / tasklist)     console.log local (LogWatcher)     API /matches/active
   │  toutes les 7 s          │  événements fichier + poll 2 s     │  toutes les 20 s (fallback)
   ▼                          ▼                                    ▼
                       Main process  ──── game:state-changed ────▶  Renderer
                  (deadlock-detector.ts / log-watcher.ts / main.ts)   (app.ts → LiveDashboard.ts)
```

> **Pourquoi ce pivot ?** À l'origine, la détection « en partie » reposait à 100 % sur `/v1/matches/active`. Un diagnostic en conditions réelles (logging temporaire en production) a montré que **cet endpoint ne voit jamais les parties normales** : 159 appels consécutifs pendant un vrai match ont tous renvoyé un tableau vide, alors que le compte interrogé jouait bien dans ce match. La source fiable s'est avérée être le **journal local du jeu**, qui écrit le `match_id` en clair dès la connexion au serveur de partie.

---

## 2. Détection du processus (couche OS)

### Windows
```ts
tasklist /FI "IMAGENAME eq Deadlock.exe" /FO CSV /NH
```
Décodage de la sortie CSV pour chercher `"deadlock.exe"` (insensible à la casse).

### Linux / CachyOS (Proton)
```bash
pgrep -f "[Dd]eadlock.exe"
```
`pgrep -f` cherche dans la ligne de commande complète du processus, ce qui couvre le chemin Wine/Proton (ex. `.../steamapps/common/Deadlock/game/bin/win64/Deadlock.exe`). Le pattern `[Dd]` gère les deux casses. `pgrep` retourne un code de sortie 1 si aucun processus n'est trouvé → traité comme `running: false`.

Les deux chemins utilisent **`exec` asynchrone** (`util.promisify`) pour ne pas bloquer l'event loop du Main process.

---

## 3. Détection de la partie — source principale : le `console.log` local

Lancé avec l'option Steam `-condebug`, Deadlock écrit son journal dans :

```
~/.local/share/Steam/steamapps/common/Deadlock/game/citadel/console.log   (Linux/Proton)
…\steamapps\common\Deadlock\game\citadel\console.log                       (Windows)
```

Le `LogWatcher` (`log-watcher.ts`) lit uniquement le **nouveau contenu** ajouté et en extrait trois signaux par expressions régulières :

| Ligne du journal | Signal émis | Donnée |
|------------------|-------------|--------|
| `Lobby <id> for Match <matchId> created` | `match-started` | **le `match_id`** (dès la connexion au serveur) |
| `ChangeGameState: GameInProgress (7)` | `game-started` | timestamp réel du début de jeu (overlay) |
| `Lobby <id> for Match <matchId> destroyed` | `match-ended` | fin de partie |

C'est la ligne `… for Match <matchId> created` qui donne le `match_id` réel, sans aucune dépendance réseau et sans délai.

### 3.1 Deux bugs / limites corrigés

- **Chaîne erronée** : le code cherchait `ChangeGameState: InProgress` alors que la vraie ligne est `ChangeGameState: GameInProgress` → la condition ne matchait jamais (même pour l'overlay).
- **`fs.watch` non fiable** : les écritures du jeu via Proton/Wine ne déclenchent pas systématiquement d'événement `fs.watch`. Un **polling de secours toutes les 2 s** (`readNewContent`) garantit la lecture du nouveau contenu. Un garde de troncature (`size < lastSize → lastSize = 0`) gère le `-conclearlog`.

### 3.2 Prérequis utilisateur — `-condebug`

Sans `-condebug` dans les options de lancement Steam, le `console.log` **n'est pas écrit** et toute la détection locale est aveugle. Options recommandées :

```
-condebug -conclearlog        (ou, avec MangoHud : mangohud %command% -condebug -conclearlog)
```

---

## 3bis. Détection de la partie active (couche API — *fallback*)

Quand le processus est détecté, le Main process interroge aussi, **en repli** :

```
GET https://api.deadlock-api.com/v1/matches/active?account_ids={accountId}
```

L'`accountId` est dérivé du `steamId64` stocké dans electron-store (`steam-profile`) : `accountId = steamId64 - 76561197960265728`. Le check est **throttlé à 20 s** (`lastApiCheckAt`).

> ⚠️ **Limite majeure (documentée par l'API)** : `/v1/matches/active` est *« fetched from the watch tab in game, which is limited to the **top 200 matches** »*. Il ne renvoie donc que les ~200 parties live les mieux classées — **jamais une partie normale**. C'est pour cela qu'il sert seulement de fallback, et que la variable `matchSource` (`'log' | 'api'`) empêche un poll API vide de **terminer** une partie déjà détectée localement.

---

## 4. Machine à états

### États

| État | Signification |
|------|---------------|
| `GAME_CLOSED` | Le processus `Deadlock.exe` n'est pas détecté. |
| `GAME_MENU` | Le processus est en cours d'exécution, mais aucun match actif trouvé via l'API. |
| `GAME_IN_MATCH` | Le processus est ouvert **et** l'API confirme que le compte Steam est dans un match actif. |

### Transitions

```
            jeu détecté (pgrep/tasklist)
GAME_CLOSED ─────────────────────────────▶ GAME_MENU
    ▲                                           │
    │   jeu fermé                               │  API: match actif trouvé
    │◀──────────────────────────────────────────┤
    │                                           ▼
    │        match terminé (API: plus de match) │
    └───────────────────────────── GAME_IN_MATCH
```

**Règles importantes :**
- La transition `GAME_CLOSED → GAME_MENU` se produit au **premier cycle** de 7 s où le processus est détecté, sans attendre quoi que ce soit d'autre.
- La transition `GAME_MENU → GAME_IN_MATCH` est déclenchée **par le `console.log` local** (event `match-started` du `LogWatcher`) dès la ligne `… for Match <id> created` — typiquement quelques secondes après l'entrée en partie. L'API `/matches/active` ne sert que de repli (rarement utile pour une partie normale).
- La fin de partie vient de la ligne `… destroyed` (event `match-ended`). Un poll API vide **ne peut pas** clore une partie détectée localement (garde `matchSource !== 'log'`).
- La fermeture du jeu (`→ GAME_CLOSED`) est immédiate au prochain cycle de 7 s.
- L'état n'est émis **que si la valeur change** (pas de rafraîchissements redondants).

### Variables de suivi dans `main.ts`

| Variable | Rôle |
|----------|------|
| `lastGameRunning` | Booléen indiquant si le processus était actif au dernier cycle. |
| `lastKnownMatchId` | Identifiant du match actif (`null` si hors match). |
| `matchSource` | Origine du match courant : `'log'` (console.log, fiable) ou `'api'`. Empêche l'API de clore une détection locale. |
| `lastApiCheckAt` | Timestamp du dernier appel API (throttle 20 s). |
| `lastGameState` | Dernier `GameState` émis (évite les doublons). |

> Les écouteurs du `LogWatcher` (`match-started` / `game-started` / `match-ended`) sont câblés **une seule fois** au démarrage (`setupLogWatcherListeners`), pour éviter d'empiler un listener à chaque relance du jeu.

---

## 5. Contrat IPC

### Événement push : `game:state-changed`
Émis par le Main process à chaque **changement** d'état.

```ts
// Payload
{
  state: 'GAME_CLOSED' | 'GAME_MENU' | 'GAME_IN_MATCH';
  matchId?: number;   // présent seulement en GAME_IN_MATCH
  timestamp: number;
}
```

### Requête pull : `game:get-status`
Invocable par le renderer (ex. au montage d'une page) pour connaître l'état courant.

```ts
// Réponse
{
  state: 'GAME_CLOSED' | 'GAME_MENU' | 'GAME_IN_MATCH';
  isRunning: boolean;   // rétrocompatibilité
  inMatch: boolean;     // rétrocompatibilité
  matchId: number | null;
  timestamp: number;
}
```

### API renderer (`window.api`)
```ts
window.api.onGameStateChanged(callback)  // subscribe aux changements
window.api.getGameStatus()               // pull de l'état courant
```

---

## 6. Comportement du Renderer

### `app.ts` — Navigation automatique
L'écouteur `onGameStateChanged` dans `app.ts` déclenche :

| État reçu | Action |
|-----------|--------|
| `GAME_MENU` | Navigation automatique vers la page `live-dashboard` (si pas déjà dessus). |
| `GAME_IN_MATCH` | Navigation automatique vers `live-dashboard` + chargement des données du match. |
| `GAME_CLOSED` | Pas de navigation ; le dashboard reste visible avec l'écran "No Active Game Detected". |

Le `GameStatusIndicator` (badge en haut à droite) est rafraîchi à chaque changement d'état.

### `LiveDashboard.ts` — Vues par état

Chaque transition déclenche un fondu (opacity 0 → 300 ms → swap HTML → opacity 1).

#### `GAME_CLOSED` — Écran d'attente
Affiché quand le jeu n'est pas lancé ou lorsque l'utilisateur ouvre manuellement la page.

```
┌─────────────────────────────────────┐
│     [icône]                         │
│  No Active Game Detected            │
│  We're not detecting any live...    │
│                                     │
│  Why is this happening?             │
│  • You may not be in an active...   │
│  • The game client may not be...    │
│                                     │
│  What to do next:                   │
│  • Start a Deadlock match and...    │
│                                     │
│  This page will automatically...    │
└─────────────────────────────────────┘
```

#### `GAME_MENU` — Skeleton d'attente
Affiché dès que le processus est détecté, pendant l'attente du début de partie.

```
┌─────────────────────────────────────┐
│  ● Game Detected                    │
│  Waiting for Match to Start         │
│  Deadlock is running...             │
│                                     │
│  [░░] [░░] [░░] [░░] [░░] [░░]     │  ← grille fantôme 6×2
│  [░░] [░░] [░░] [░░] [░░] [░░]     │    (opacité 20%, animate-pulse)
└─────────────────────────────────────┘
```

#### `GAME_IN_MATCH` — Grille adaptative (2 rangées × N colonnes)
Affiche les cartes joueurs : ligne 0 = équipe 0, ligne 1 = équipe 1, triées par lane. Le **nombre de colonnes s'adapte au mode** (6 pour 6v6 → 12 joueurs, 4 pour 4v4 → 8 joueurs). Les données sont chargées via le script Python (`executePython('match', matchId)` → `/v1/matches/{id}/metadata`).

```
┌──────┬──────┬──────┬──────┬──────┬──────┐
│ J1   │ J2   │ J3   │ J4   │ J5   │ J6   │  ← équipe 0
├──────┼──────┼──────┼──────┼──────┼──────┤
│ J7   │ J8   │ J9   │ J10  │ J11  │ J12  │  ← équipe 1
└──────┴──────┴──────┴──────┴──────┴──────┘
  Yellow lane    Blue lane    Green lane
```

---

## 7. Résumé des intervalles et délais

| Opération | Intervalle | Fichier |
|-----------|-----------|---------|
| Détection du processus (OS) | 7 s | `main.ts` → `startDeadlockPolling` |
| Lecture du `console.log` (polling de secours) | 2 s | `log-watcher.ts` → `start` / `readNewContent` |
| Check API match actif (fallback) | 20 s (throttle) | `main.ts` → `checkDeadlockAndMatchStatus` |
| Timeout requête API | 5 s | `deadlock-detector.ts` → `findActiveMatchByAccountId` |
| Durée du fondu de transition | 300 ms | `LiveDashboard.ts` → `transitionToState` |
| Healthcheck de l'API (Python) | 5 min | `main.ts` → `startHeartbeat` |

---

## 8. Limites des sources de données (synthèse)

Pour une **partie normale**, le roster live des 12 joueurs n'est exposé par aucun endpoint JSON prêt-à-l'emploi :

| Source | Donne le `match_id` ? | Donne le roster ? | Dispo en live ? |
|--------|----------------------|-------------------|-----------------|
| `console.log` local | ✅ (fiable) | ❌ (seulement *mon* compte) | ✅ instantané |
| `/v1/matches/active` | ✅ | ✅ | ⚠️ **top 200 seulement** |
| `/v1/matches/{id}/metadata` | — | ✅ (12 joueurs) | ❌ **post-partie** |
| `/v1/matches/{id}/live/url` | — | ✅ (flux à parser) | ✅ mais nécessite un **parseur de diffusion Source 2** (haste / demofile-net) + rate limit 2 req/h |

→ Stratégie retenue : **détecter** via le `console.log` (`match_id` fiable), puis **enrichir** via `/metadata` (qui devient disponible une fois la partie ingérée). Le « vrai live » (parseur de broadcast) reste une piste future identifiée mais hors périmètre.
