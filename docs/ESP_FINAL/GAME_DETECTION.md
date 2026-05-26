# Détection de partie et états du Live Dashboard

Ce document décrit le pipeline de détection du jeu Deadlock et la machine à états qui pilote l'interface du Live Dashboard.

---

## 1. Vue d'ensemble

Le Main process tourne un service de surveillance en arrière-plan qui interroge l'OS toutes les **7 secondes** pour savoir si Deadlock est ouvert, et l'API communautaire toutes les **20 secondes** (quand le jeu est ouvert) pour savoir si le joueur est en partie active. Le résultat est un état parmi trois valeurs possibles, diffusé au Renderer via IPC.

```
OS (pgrep / tasklist)          API Deadlock
       │  toutes les 7 s               │  toutes les 20 s (si jeu ouvert)
       ▼                               ▼
  Main process  ──── game:state-changed ────▶  Renderer
  (deadlock-detector.ts / main.ts)            (app.ts → LiveDashboard.ts)
```

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

## 3. Détection de la partie active (couche API)

Si le processus est détecté, le Main process interroge l'endpoint :

```
GET https://api.deadlock-api.com/v1/matches/active?account_ids={accountId}
```

L'`accountId` est dérivé du `steamId64` stocké dans electron-store (`steam-profile`) par la formule `accountId = steamId64 - 76561197960265728`.

La réponse est un tableau de matchs actifs. Le code vérifie que le joueur (`account_id`) figure bien dans la liste des joueurs du match avant de valider l'état `GAME_IN_MATCH`.

Ce check est **throttlé à 20 secondes** via `lastApiCheckAt` pour éviter de saturer l'API (limite IP : 200 req/min sur les endpoints partagés).

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
- La transition `GAME_CLOSED → GAME_MENU` se produit au **premier cycle** de 7 s où le processus est détecté, sans attendre le check API.
- La transition `GAME_MENU → GAME_IN_MATCH` n'intervient qu'après le **premier check API réussi** (délai max 20 s après l'ouverture du jeu).
- La fermeture du jeu (`GAME_IN_MATCH` ou `GAME_MENU` → `GAME_CLOSED`) est immédiate au prochain cycle de 7 s.
- L'état n'est émis **que si la valeur change** (pas de rafraîchissements redondants).

### Variables de suivi dans `main.ts`

| Variable | Rôle |
|----------|------|
| `lastGameRunning` | Booléen indiquant si le processus était actif au dernier cycle. |
| `lastKnownMatchId` | Identifiant du match actif (`null` si hors match). |
| `lastApiCheckAt` | Timestamp du dernier appel API (throttle 20 s). |
| `lastGameState` | Dernier `GameState` émis (évite les doublons). |

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

#### `GAME_IN_MATCH` — Grille 6×2
Affiche les 12 cartes joueurs organisées par lane (jaune / bleue / verte) et par équipe (ligne 0 = alliés, ligne 1 = ennemis). Les données sont chargées via le script Python (`executePython('match', matchId)`).

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
| Check API match actif | 20 s (throttle) | `main.ts` → `checkDeadlockAndMatchStatus` |
| Timeout requête API | 5 s | `deadlock-detector.ts` → `findActiveMatchByAccountId` |
| Durée du fondu de transition | 300 ms | `LiveDashboard.ts` → `transitionToState` |
| Healthcheck de l'API (Python) | 5 min | `main.ts` → `startHeartbeat` |
