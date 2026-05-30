# Game Overlay In-Game — Architecture, Tests et Problèmes

Ce document décrit les décisions prises, ce qui a été testé, et les obstacles rencontrés lors de l'implémentation du module overlay in-game pour DeadlockHelper.

---

## 1. Architecture retenue

### Fenêtre overlay

Un second `BrowserWindow` Electron (`overlayWindow`) est créé dans `main.ts` dès que le processus `deadlock.exe` est détecté par `pgrep`. Il est détruit quand le jeu ferme.

| Propriété | Valeur | Raison |
|---|---|---|
| `frame` | `false` | Sans bordure |
| `transparent` | `true` | Fond transparent |
| `alwaysOnTop` | `true` + `'screen-saver'` | Niveau le plus haut d'Electron |
| `setVisibleOnAllWorkspaces` | `true, { visibleOnFullScreen: true }` | Maintien au-dessus des fenêtres fullscreen |
| `setIgnoreMouseEvents` | `true` par défaut | Les clics passent au jeu; désactivé on hover |

### Sources de données

| Composant | Source | Notes |
|---|---|---|
| Game clock | `durationS` de `GET /v1/matches/active` | Précis dès la première détection API (toutes les 20s) |
| Game clock (fallback) | `ChangeGameState: InProgress` dans `console.log` | Nécessite `-condebug` dans les launch options Steam |
| Hero IDs ennemis | `ActiveMatchPlayer.hero_id` + `team` de `/v1/matches/active` | Disponible dans la réponse active match |
| Mid Boss timer | **Bouton manuel** dans l'overlay | La mort du boss n'est pas loggée dans `console.log` |
| Urn timer | Calcul local déterministe | Premier spawn 12:00, puis toutes les 6 min |
| Souls/min | **Placeholder `-- SPM`** | Aucune source live VAC-safe disponible |
| Item suggestions | `GET /v1/analytics/item-stats?hero_ids=X&enemy_hero_ids=Y` | Top 3 par winrate vs composition ennemie |

### Fichiers créés

```
overlay.html                              ← entrée HTML du second BrowserWindow
vite.overlay-preload.config.ts            ← build config preload overlay
src/preload/overlay-preload.ts            ← expose overlayApi au renderer overlay
src/main/log-watcher.ts                   ← LogWatcher : tail console.log Deadlock
src/main/overlay-window.ts               ← gestion BrowserWindow overlay
src/renderer/overlay/overlay.ts           ← entry point renderer overlay
src/renderer/overlay/OverlayApp.ts        ← 4 composants overlay
```

---

## 2. Ce qui a été testé

### Fonctionnel ✓

- Build Electron Forge avec deux renderers (`main_window` + `overlay_window`) et trois preloads — compile sans erreur.
- Création automatique de la fenêtre overlay dès que `pgrep -f "[Dd]eadlock.exe"` retourne un résultat.
- Transmission des settings overlay (coin, opacité, toggles) via IPC au renderer overlay au chargement.
- Logs overlay visibles dans le terminal principal via `webContents.on('console-message')`.
- Les 4 composants s'affichent correctement (confirmé visuellement dans la capture `GameOverlayDebug.png`).
- Bouton "Lancer Deadlock" dans `GameStatusIndicator` (App ID **1422450** — vérifié via `appmanifest_1422450.acf`).
- Auto-détection du chemin `console.log` via parsing de `libraryfolders.vdf`.
- Settings overlay dans la page Configuration (coin, opacité, chemin log, toggles, OS détecté).
- Drag handle (`-webkit-app-region: drag`) fonctionnel — utilise le protocole Wayland natif.
- Sauvegarde automatique de la position après drag dans `overlay-settings.json`.

### Problème App ID ✗ → corrigé

L'App ID initial utilisé (`2016590`) a lancé Dark and Darker. L'App ID correct pour Deadlock est **1422450**, confirmé par `appmanifest_1422450.acf` dans la bibliothèque Steam.

### Erreur `process is not defined` ✗ → corrigée

`process.platform` utilisé dans `Configuration.ts` (renderer) — `process` est un global Node.js inaccessible dans les renderers sans `nodeIntegration`. Corrigé en l'exposant via le preload : `window.api.platform`.

---

## 3. Problème principal : positionnement sur Wayland

### Symptôme

Sur Wayland (environnement de l'utilisateur : CachyOS + KDE Plasma + NVIDIA PRIME), la fenêtre overlay apparaît au **centre de l'écran** malgré les coordonnées `x, y` définies dans `BrowserWindow` et `setPosition()`.

### Cause

Le protocole Wayland **interdit aux applications de se positionner elles-mêmes**. C'est le compositor (KWin dans ce cas) qui décide où placer chaque nouvelle fenêtre. Les appels `setPosition()` d'Electron sont ignorés silencieusement.

Cette limitation est documentée dans les issues Electron : [#10078](https://github.com/electron/electron/issues/10078).

### Tentative de contournement : forcer X11 ✗

Ajout de `app.commandLine.appendSwitch('ozone-platform', 'x11')` dans `main.ts` et `ELECTRON_OZONE_PLATFORM_HINT=x11` dans le script `npm start`. Sur X11 (via XWayland), `setPosition()` est respecté.

**Résultat : crash GPU** — `exit_code=139` (SIGSEGV) dans le processus GPU Chromium. La configuration NVIDIA PRIME de l'utilisateur (render offload avec `__NV_PRIME_RENDER_OFFLOAD=1 __GLX_VENDOR_LIBRARY_NAME=nvidia`) n'est pas compatible avec XWayland dans cette configuration CachyOS. Le flag a été revert.

### Solution de contournement en place

Une **drag handle** (barre grise en haut de l'overlay, marquée `⠿⠿⠿`) utilise `-webkit-app-region: drag`, qui déclenche le protocole natif Wayland `xdg-toplevel::_move`. Cela permet au compositor de déplacer la fenêtre correctement.

La position après drag est **sauvegardée automatiquement** dans `~/.config/deadlock-app/overlay-settings.json` (`lastX`, `lastY`) et restaurée au prochain lancement.

**Procédure pour l'utilisateur :**
1. Lancer Deadlock en Borderless Windowed (requis — voir ci-dessous)
2. Passer la souris sur l'overlay pour activer les événements souris
3. Cliquer-glisser la barre `⠿⠿⠿` vers le coin désiré
4. La position est mémorisée automatiquement

---

## 4. Contrainte : Borderless Windowed obligatoire

Sur Linux, `setAlwaysOnTop(true, 'screen-saver')` et `setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })` ne permettent pas à l'overlay de passer au-dessus d'un jeu en **fullscreen exclusif**. Le compositor cède le contrôle total de l'affichage au jeu.

En **Borderless Windowed** (`-windowed -noborder` dans les launch options), le compositor garde le contrôle de la composition et l'overlay reste visible.

Launch options recommandées (déjà configurées par l'utilisateur) :
```
__NV_PRIME_RENDER_OFFLOAD=1 __GLX_VENDOR_LIBRARY_NAME=nvidia %command% -windowed -noborder -condebug
```

---

## 5. Rafraîchissement alwaysOnTop

Pour contrer les compositors qui baissent le z-order d'une fenêtre quand une autre prend le focus, un `setInterval` de 2 secondes réaffirme :
```typescript
overlayWindow.setAlwaysOnTop(true, 'screen-saver');
overlayWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
```

Ce workaround est documenté comme nécessaire pour KDE Plasma + Wayland.

---

## 6. Pistes futures

| Piste | Complexité | Impact |
|---|---|---|
| Souls/min via OCR (Tesseract lisant le HUD) | Élevée | Permettrait d'afficher les vraies SPM |
| Mid Boss detection via log memory reading | Très élevée + risque VAC | Non recommandé |
| Configurer NVIDIA PRIME pour XWayland | Système — hors app | Débloquerait `setPosition()` |
| KWin window rules pour épingler la position | Configuration utilisateur | Alternatif à la drag handle |
