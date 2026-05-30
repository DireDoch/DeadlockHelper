# Game Overlay — Architecture et sources de données

## Contexte

Ajout d'un overlay in-game (4 composants : Souls/min, Mid Boss timer, Urn timer, Item Suggestions) affiché par-dessus Deadlock pendant une partie. Environnement cible : Linux (CachyOS) avec Deadlock via Steam Proton.

## Décisions

### 1. Fenêtre overlay : second BrowserWindow Electron

Un second `BrowserWindow` (`overlayWindow`) est créé dans `main.ts` dès que `GAME_IN_MATCH` est détecté, et caché/détruit à `GAME_MENU` / `GAME_CLOSED`. Propriétés : `frame: false`, `transparent: true`, `alwaysOnTop: true`, `setIgnoreMouseEvents(true)` sauf sur les zones interactives (bouton Mid Boss).

**Alternatives écartées :**
- Couche Vulkan personnalisée — injecte dans le processus du jeu, risque VAC, complexité C++ hors scope.
- `<div>` flottant dans la fenêtre principale — reste dans l'app, n'apparaît pas au-dessus du jeu.

**Contrainte connue :** Sur Linux, `alwaysOnTop` ne passe pas au-dessus d'un jeu en fullscreen exclusif (limitiation Electron/X11/Wayland confirmée). Le jeu **doit** tourner en mode Borderless Windowed. Ce prérequis est documenté dans les Paramètres de l'app.

### 2. Source des données live — console.log avec `-condebug`

Deadlock ne supporte pas de GSI officiel (contrairement à CS2/Dota 2). La seule source VAC-safe de données in-game est le fichier `console.log` produit par l'option de lancement Steam `-condebug`, situé à `{steam_library}/steamapps/common/Deadlock/game/citadel/console.log`.

**Ce que le log contient :** `ChangeGameState: InProgress` → déclenche le game clock local. Hero selection. Connexion/déconnexion serveur.

**Ce que le log ne contient PAS :** Mort du Mid Boss, souls du joueur, pickup/livraison de l'Urn, game clock in-game en `MM:SS`.

Le chemin du log est auto-détecté en parsant `libraryfolders.vdf` (Linux en priorité, Windows en fallback). L'utilisateur peut corriger le chemin dans les Paramètres.

### 3. Composant Mid Boss timer — déclencheur manuel

La mort du Mid Boss n'est pas loggée. Le timer est déclenché manuellement via un bouton discret dans l'overlay. Cycle : 7min → 6min → 5min → 5min…

**Alternative écartée :** Lecture mémoire du processus — risque VAC, complexité élevée, hors scope.

### 4. Composant Souls/min — placeholder

Les souls du joueur ne sont disponibles dans aucune source accessible (ni console.log, ni API active match, ni GSI). Le composant affiche `-- SPM` avec un label "Donnée indisponible". Prévu pour une future itération si une source live devient disponible.

### 5. Composant Urn timer — déterministe

Premier spawn à 12:00 (game clock). Ensuite toutes les 6 minutes (18:00, 24:00…). Lane alternante fixe : Jaune à 12min, Verte à 18min, Jaune à 24min, etc. Aucune source live requise — calculé à partir du game clock local (dérivé de `ChangeGameState: InProgress`).

Le statut des Walkers (Favored/Unfavored) n'est pas inclus — non disponible sans source live.

### 6. Composant Item Suggestions — `item-stats` avec `enemy_hero_ids`

Endpoint : `GET /v1/analytics/item-stats?hero_ids={hero_joueur}&enemy_hero_ids={ids_ennemis}` qui retourne les items avec le meilleur winrate contre la composition adverse. Top 3 items affichés avec `winrate` et nom. Labellisés "vs composition ennemie" pour être transparent sur l'absence de filtrage par inventaire courant (inventaire live non disponible).

### 7. Renderer : vanilla TypeScript

Cohérent avec l'ensemble du codebase. Aucun pipeline JSX/React introduit.

## Conséquences

- L'utilisateur doit ajouter `-condebug` aux launch options Steam de Deadlock pour activer le game clock et les composants dépendants.
- L'utilisateur doit jouer en Borderless Windowed pour que l'overlay soit visible.
- Ces deux prérequis sont documentés et vérifiés au démarrage dans la page Paramètres.
- La mort du Mid Boss est une action manuelle — l'overlay ne peut pas la détecter automatiquement.
- Le composant Souls/min est un placeholder honnête, non une feature fonctionnelle.
