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

## 4. Contrainte : Borderless Windowed ~~obligatoire~~ → **levée** (voir §7)

> **Mise à jour (correctif §7).** Cette contrainte ne s'applique qu'à l'approche **`alwaysOnTop` seule**. Depuis la règle KWin `fullscreen=No` sur le jeu (§7.2, Règle 2), l'overlay reste visible **dans tous les Window Modes, y compris le plein écran** — confirmé par l'utilisateur. La règle empêche Deadlock d'entrer dans l'état fullscreen, donc KWin ne lui cède jamais le contrôle exclusif de l'affichage. Le reste de cette section décrit l'ancienne limite (conservée pour l'historique).

Sur Linux, `setAlwaysOnTop(true, 'screen-saver')` et `setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })` ne permettent **pas à eux seuls** à l'overlay de passer au-dessus d'un jeu en **fullscreen exclusif**. Le compositor cède le contrôle total de l'affichage au jeu.

En **Borderless Windowed** (`-windowed -noborder` dans les launch options), le compositor garde le contrôle de la composition et l'overlay reste visible — c'était le contournement avant le correctif KWin.

Launch options recommandées :
```
__NV_PRIME_RENDER_OFFLOAD=1 __GLX_VENDOR_LIBRARY_NAME=nvidia %command% -windowed -noborder -condebug
```
(`-condebug` reste utile pour le fallback game-clock via `console.log`. `-windowed -noborder` n'est plus *requis* pour la visibilité de l'overlay grâce à la Règle 2.)

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
| ~~KWin window rules pour épingler la position~~ | — | **✅ Implémenté — voir §7** (z-order, pas position) |

---

## 7. BYPASS #1 implémenté — Règle KWin `keepAbove` (correctif KDE/Wayland)

Le **vrai problème restant** (overlay qui passe *derrière* le jeu au lancement — un problème de **z-order**, pas de position) est désormais corrigé par une **règle de fenêtre KWin** forçant `keepAbove`, installable depuis la page Configuration.

### 7.1 Plan initial « 3 bypasses » — ce qui a été rejeté (et pourquoi)

Un plan généré (« Principal Engineer ») proposait 3 contournements. Confronté à l'environnement réel (CachyOS + **Plasma/KWin 6.6.5** + Wayland), l'essentiel ne tenait pas :

| Proposé | Réalité vérifiée sur la machine | Verdict |
|---|---|---|
| « Suite de détection d'environnement déjà en place » | Inexistante — `main.ts` ne testait que `!== 'darwin'`. | **À construire** (`desktop-environment.ts`). |
| BYPASS #2 : Python + `gtk-layer-shell` (`zwlr_layer_shell_v1`) | **KWin n'implémente pas** `wlr-layer-shell` (protocole wlroots : Hyprland/sway uniquement). Et le « moteur Python » est un CLI *one-shot*, pas un démon. | **Abandonné** — inopérant sur KWin. |
| BYPASS #4 : `dbus-next` « pousse des propriétés de fenêtre » sur KWin | Introspection de `org.kde.KWin` : **aucune méthode** pour énumérer les fenêtres ou poser `keepAbove`. Seul `/Scripting loadScript` existe (JS, fragile, API KF5≠KF6). Redondant avec la règle. | **Abandonné.** |
| `qdbus org.kde.KWin /KWin reconfigure` | `qdbus` **absent** ; c'est `qdbus6` sur Plasma 6. | Corrigé (`qdbus6`, fallback `qdbus` puis `busctl`). |
| Match `wmclass: 'deadlockhelper'` | Aucune `app_id` custom émise ; l'`app_id` est **partagée** par toutes les fenêtres du process → la règle frapperait aussi la **fenêtre principale**. | Remplacé par un **match sur le titre**. |
| Forcer `acceptfocus=false` + `fsplevel=4` | Résolvent le problème *inverse* (overlay volant le focus) ; `acceptfocus=false` risque de casser le drag handle / clic Mid Boss. | **Retirés** — `keepAbove` seul. |

### 7.2 Conception retenue

**Deux règles** sont installées ensemble par le bouton (voir §7.7 pour le *pourquoi* de la 2ᵉ) :

| Décision | Choix |
|---|---|
| Portée | **KDE/KWin Wayland uniquement** (détecté ; sinon le bloc UI est masqué) |
| Mécanisme | Règles statiques dans `~/.config/kwinrulesrc` + `qdbus6 … reconfigure` |
| Règle 1 — overlay | Match **titre** `Deadlock Overlay` (`titlematch=2`) → force `keepabove=true` (`aboverule=2`). Le titre est par-fenêtre, n'affecte pas la fenêtre principale. |
| Règle 2 — jeu | Match **wmclass** `steam_app_1422450` (`wmclassmatch=2`) → force `fullscreen=false` (`fullscreenrule=2`). Empêche KWin de promouvoir Deadlock en couche `Active` (qui masquerait l'overlay). |
| Propriétés écartées | `acceptfocus=false` + `fsplevel=4` (cassent le drag/clic, résolvent le mauvais problème) |
| Déclenchement | **Automatique** au lancement réel de Deadlock (détection process), retiré à la fermeture — en phase avec le cycle de vie du jeu, donc appliqué dans la vraie résolution / Window Mode. Toggle dans Configuration (activé par défaut, `autoKwinFix`). |
| Sûreté | Sauvegarde `kwinrulesrc.deadlockhelper.bak` avant 1ʳᵉ écriture ; écriture atomique ; `id` de groupes fixes (`deadlockhelper-overlay`, `deadlockhelper-game`) → idempotent + suppression triviale ; nettoyage best-effort sur `before-quit` |

### 7.3 Fichiers

```
src/main/desktop-environment.ts   ← détection OS / DE / Wayland (prérequis manquant)
src/main/kwin-overlay-rule.ts      ← lecture/écriture kwinrulesrc, install/remove/status, reconfigure (2 règles)
src/main/overlay-window.ts         ← (modif) title: 'Deadlock Overlay' = clé de match ; défaut autoKwinFix=true
src/main/main.ts                   ← (modif) 3 handlers IPC + syncKwinOverlayFix() auto sur lancement/fermeture + cleanup before-quit
src/preload/preload.ts             ← (modif) expose getKwinOverlayFixStatus / apply / remove
src/renderer/pages/Parametres/Configuration.ts ← (modif) toggle « automatique » + statut (visible si KDE+Wayland)
src/lib/types/index.ts             ← (modif) OverlaySettings.autoKwinFix
```

### 7.4 Règles générées (extrait de `kwinrulesrc`)

```ini
[General]
count=2
rules=deadlockhelper-overlay,deadlockhelper-game

[deadlockhelper-overlay]
Description=DeadlockHelper Overlay keep-above (auto-generated)
above=true
aboverule=2          ; 2 = Force
title=Deadlock Overlay
titlematch=2         ; 2 = Substring

[deadlockhelper-game]
Description=DeadlockHelper — Deadlock windowed, no fullscreen layer (auto-generated)
wmclass=steam_app_1422450
wmclassmatch=2
fullscreen=false
fullscreenrule=2     ; 2 = Force
```

> Encodages KWin : `*match` → 0=Unimportant 1=Exact **2=Substring** 3=RegExp ; `*rule` → 1=DontAffect **2=Force** 3=Apply 4=Remember…

### 7.5 Utilisation

Plus aucune action manuelle. Le toggle **« Correctif KDE / Wayland — automatique »** (Configuration → Overlay In-Game) est **activé par défaut** sur KDE+Wayland :

1. Lancer Deadlock dans **n'importe quel Window Mode** (Windowed, Borderless **ou Plein écran** — la Règle 2 neutralise le plein écran exclusif).
2. Dès que le process est détecté, l'app écrit les 2 règles + `qdbus6 … reconfigure` → l'overlay reste au premier plan.
3. À la fermeture du jeu, les règles sont **retirées automatiquement** (le `fullscreen=No` ne persiste donc pas pour une partie jouée sans l'app).

Désactiver le toggle nettoie immédiatement les règles. Le main process applique/retire via `syncKwinOverlayFix()` dans la boucle de détection `checkDeadlockAndMatchStatus()`.

### 7.6 Vérifié

- ✅ Build : `main.ts`, modules KWin et `Configuration.ts` compilent (esbuild, externals comme electron-forge) ; preload via Vite.
- ✅ Détection : `applicable=true` sur Plasma 6.6.5 / Wayland.
- ✅ Logique (test temp `XDG_CONFIG_HOME`) : install écrit **les 2 groupes** + préserve une règle utilisateur existante, crée la sauvegarde ; 2ᵉ install **idempotente** (un seul exemplaire de chaque groupe) ; remove restaure l'état initial.
- ✅ **Cycle de vie auto** (test 2 sessions launch/close) : 16/16 assertions — règles posées au lancement, retirées à la fermeture, règle utilisateur préservée à chaque cycle, `kwinrulesrc` revient à son état initial.
- ✅ Application au-dessus d'une vraie partie : **confirmée par l'utilisateur** (« cela fonctionne »).
- ✅ **Plein écran inclus** : confirmé par l'utilisateur — l'overlay reste visible **même en mode Plein écran**, la Règle 2 (`fullscreen=No`) empêchant Deadlock de prendre le contrôle exclusif de l'affichage. La contrainte Borderless du §4 est donc levée.

### 7.7 Pourquoi une 2ᵉ règle ? — couches de stacking KWin

Symptôme observé : avec `keepAbove` seul, l'overlay est visible en **ALT+TAB** mais **disparaît quand on clique sur l'onglet du jeu**.

Cause : KWin empile les fenêtres par **couches** — `Normal` < `Dock` (panel) < **`Above`** (keepAbove) < … < **`Active`** (fenêtre plein écran *active*). Tant que Deadlock n'est pas la fenêtre active plein écran, l'overlay (`Above`) passe dessus. Mais dès que le jeu devient **actif en plein écran**, KWin le promeut en couche **`Active`, au-dessus de `Above`** → l'overlay est masqué. **Aucune règle `keepAbove` ne peut battre une fenêtre plein écran active** (par conception ; confirmé sur les forums KDE/Ardour).

Solution : forcer `fullscreen=No` sur la fenêtre du jeu (Règle 2) → Deadlock reste en couche `Normal`, l'overlay `Above` gagne, **même quand le jeu est focus**.

**Observation clé** : cette règle ne *combat* pas une fenêtre plein écran — elle **empêche** la fenêtre d'entrer dans l'état fullscreen. Conséquence vérifiée en jeu : même quand l'utilisateur choisit **Plein écran** dans Deadlock, KWin refuse la transition, le jeu reste composité comme une fenêtre normale, et l'overlay reste visible. C'est ce qui fait fonctionner **tous les Window Modes**, y compris le plein écran exclusif — qui était réputé hors de portée sur Wayland pour une approche par simple stacking.

> `wmclass` de Deadlock relevé via `qdbus6 org.kde.KWin /KWin queryWindowInfo` (jeu lancé en Windowed) :
> `resourceClass = steam_app_1422450`, `caption = Deadlock`, `fullscreen = false`, `layer = 2` (Normal).
