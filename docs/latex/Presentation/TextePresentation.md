# Script intégral révisé — Présentation orale ESP : DeadlockHelper
**Anthony Boily | 420-VC2-LP | Cégep de La Pocatière**
**Durée cible : 20 minutes | ~2750 mots | Débit : 130-140 mots/min**
**Version 2 — Enrichissement technique + balises actions Kdenlive**

---

## 0. Hook — Captiver l'attention (0:00 – 1:00)

`[Montage Kdenlive : Plein écran vidéo Anthony — bureau visible avec Deadlock en arrière-plan, Spotify ouvert, onglet de documentation dans un navigateur sur un second écran]`

*(Bureau visible : Deadlock occupe le moniteur principal, Spotify dans une fenêtre, la doc de l'API deadlock-api.com sur le second moniteur. Anthony regarde l'écran de jeu.)*

Bon. Je suis en train de jouer une partie de Deadlock. J'ai besoin de savoir quel objet acheter contre le héros adverse qui vient de me counter. Je fais un Alt+Tab. J'ouvre la documentation. Je cherche la section items. Pendant ce temps, ma musique Spotify s'est arrêtée toute seule parce que je suis passé à une autre fenêtre. Alt+Tab encore. Je règle Spotify. Alt+Tab encore. Je reviens au jeu.

*(Une notification pop-up apparaît en superposition : grande bannière rouge « VOUS ÊTES MORT »)*

Évidemment. Je suis mort. Parce que j'ai passé vingt secondes à jongler entre des fenêtres au lieu de jouer.

C'est exactement ce problème-là que j'ai voulu résoudre.

---

## 1. Introduction et Mise en contexte (1:00 – 2:30)

`[Montage Kdenlive : Plein écran vidéo Anthony]`

Bonjour, messieurs Forget et Demers. Je vous présente aujourd'hui mon projet de fin d'études ESP : **DeadlockHelper**.

Deadlock est un jeu de tir tactique multijoueur en ligne développé par Valve. C'est un jeu compétitif où les décisions d'achat d'objets, la connaissance des héros adverses et le suivi de ses propres statistiques de performance font une différence réelle sur le résultat d'une partie. Mais pour accéder à ces informations, un joueur doit constamment sortir du jeu, ouvrir un navigateur, chercher manuellement — ce qui crée exactement la situation que vous venez de voir.

DeadlockHelper est une application de bureau multiplateforme — elle fonctionne sur Windows et sur Linux — conçue pour fonctionner en arrière-plan pendant une partie. Elle agrège les données communautaires en temps réel, intègre un contrôleur musical Spotify, et propose un overlay transparent superposé directement par-dessus le jeu. Tout ça, sans jamais avoir besoin de sortir de la fenêtre de jeu.

L'application est distribuée gratuitement via GitHub Pages, sous forme d'un fichier AppImage pour Linux et d'un installateur EXE pour Windows.

---

## 2. Architecture Globale et Choix de la Stack (2:30 – 5:30)

`[Montage Kdenlive : Capture d'écran du diagramme d'architecture IPC + Incrustation vidéo Anthony en bas à droite]`

Rentrons dans le vif du sujet technique. Pourquoi avoir choisi Electron comme base de l'application ?

Electron permet de construire une application de bureau avec des technologies web — TypeScript, HTML, CSS — tout en ayant accès aux capacités système : lire des fichiers, lancer des sous-processus, gérer les fenêtres du système d'exploitation. C'est la technologie qui fait tourner VS Code, Slack, et Discord.

Dans le fond, l'application Electron fonctionne toujours en **deux processus séparés** :

Le **processus principal** — c'est lui qui tourne sous Node.js. Il a accès au système d'exploitation : il peut lire des fichiers, lancer des processus Python, créer des fenêtres, gérer des secrets. C'est le cerveau de l'application.

Le **processus de rendu** — c'est l'interface graphique qui tourne dans un moteur Chromium. Il n'a pas accès à Node.js. Il ne peut pas lire des fichiers directement, il ne peut pas parler à l'OS. C'est un navigateur web sécurisé.

Ces deux processus communiquent via un canal sécurisé appelé **IPC** — Inter-Process Communication. Le pont entre les deux, c'est le **Context Bridge**. Il est déclaré dans le fichier `preload.ts`. Voici ce que ça ressemble dans le code réel du projet :

```typescript
// preload.ts — pont de sécurité entre le processus principal et l'interface
contextBridge.exposeInMainWorld('api', {

  // Requête générique vers l'API communautaire (transitant par le main)
  request: (endpoint: string, options?: { method?: string; body?: any }) =>
    ipcRenderer.invoke('api:request', { endpoint, ...options }),

  // Authentification Steam (OpenID — secrets dans le processus principal)
  steamStartAuth: () =>
    ipcRenderer.invoke('steam:startAuth'),

  // Heartbeat de disponibilité de l'API Deadlock
  getApiAvailability: () =>
    ipcRenderer.invoke('api:get-availability'),

  // Push du main vers le renderer : alertes de santé de l'API
  onHealthStatusChange: (callback: (availability: number) => void) => {
    ipcRenderer.on('api:health-alert', (_event, availability: number) => {
      callback(availability);
    });
  },
});
```

Ce que vous voyez ici, c'est la liste blanche complète : `window.api` expose uniquement les fonctions autorisées. Le renderer peut appeler `window.api.steamStartAuth()` — mais il ne voit jamais Node.js, il ne voit jamais le système de fichiers directement. Si du code malveillant se glissait dans le renderer, il n'aurait aucun accès système.

Il y a cependant une distinction architecturale importante que je vais illustrer dans la prochaine section : certaines opérations — Steam, Spotify, la détection de match, les awards — transitent obligatoirement par IPC parce qu'elles nécessitent des secrets ou des accès système. D'autres — comme le chargement des données publiques de héros — peuvent aller directement du renderer vers l'API, sans passer par le main. C'est un choix délibéré de ne pas surcharger le canal IPC pour des données qui n'ont pas besoin de protection.

Pour le style, j'ai utilisé **Tailwind CSS** en mode JIT — Just-In-Time. Plutôt que de générer des centaines de classes CSS inutilisées, Tailwind analyse le code TypeScript à la compilation et ne génère que le CSS pour les classes effectivement utilisées dans le code. Résultat : un bundle minimal, et une cohérence visuelle garantie par un système de design en utilitaires atomiques.

Toute l'interface est en **Vanilla TypeScript pur** — pas de React, pas de Vue. Ce choix était délibéré pour démontrer une maîtrise des primitives du navigateur : manipulation directe du DOM, gestion des événements, cycle de vie des composants — sans la couche d'abstraction d'un framework.

---

## 3. Le Moteur de Traitement : Python et l'OCR (5:30 – 8:30)

`[Montage Kdenlive : Capture d'écran du code OCR Python + extrait NDJSON + Incrustation vidéo Anthony en bas à droite]`

Pour le traitement de données volumineuses et la reconnaissance d'image — deux opérations qui dépassent les capacités raisonnables du JavaScript — j'ai introduit un sous-processus **Python 3.12**.

L'idée est simple : depuis le processus principal Electron, un `child_process.spawn` lance un script Python dans un environnement virtuel isolé. Python fait son travail et envoie le résultat sur `stdout` en JSON. Electron lit ce flux ligne par ligne. Aucune communication réseau, aucun port TCP : uniquement le canal standard `stdout`.

Maintenant, parlons du **worker OCR**. Le problème que j'essayais de résoudre : identifier les héros et les pseudos des 12 joueurs d'une partie *pendant* qu'elle est en cours. J'ai testé trois approches successives.

**Première approche** : lire le fichier de log local de Deadlock, activé avec le flag `-condebug`. Ce log contient l'identifiant de la partie et quelques événements — mais pas les noms ni les héros des autres joueurs. Échec.

**Deuxième approche** : l'API communautaire. L'endpoint `/matches/active` ne retourne que les 200 parties les plus regardées au monde. Toute partie normale n'y apparaît jamais. Échec.

**Troisième approche** : un screenshot OCR. Quand le joueur appuie sur Échap en jeu, un écran de liste de joueurs apparaît. J'ai construit un worker Python qui capture cette zone et l'analyse.

Le premier moteur testé était **Tesseract + OpenCV**. Le problème : il nécessitait 24 spawns de sous-processus distincts par scan — un pour chaque fragment à analyser. Sous charge CPU, ces spawns étaient non déterministes : sur la même image, selon les conditions système, le résultat variait de 0 à 12 héros reconnus. Inutilisable.

Le moteur retenu est **EasyOCR**. Il traite l'image brute en un seul appel in-process, retournant une liste de boîtes de texte avec leur position, leur contenu et un score de confiance. Déterministe à 100 % sur l'image de référence.

Mais EasyOCR seul ne suffit pas. La police d'écriture in-game et la résolution d'affichage introduisent des erreurs de lecture systématiques. Par exemple, le zéro `'0'` est confondu avec la lettre `'O'` — ce qui donne `'Beb0p'` au lieu de `'Bebop'`. Des espaces sont insérés au mauvais endroit, des caractères spéciaux comme l'esperluette dans `'Mo & Krill'` peuvent être lus comme `'Mo &amp; Kri11'`. Ces erreurs sont prévisibles et structurées.

C'est là qu'intervient **thefuzz**. Cette bibliothèque implémente la **distance de Levenshtein** — un algorithme qui mesure combien de modifications caractère par caractère sont nécessaires pour passer d'un texte à un autre. Elle retourne un score de similarité entre 0 et 100. Je l'applique pour faire correspondre chaque fragment OCR avec le héros le plus proche dans mon vocabulaire fermé de 28 héros :

```python
def fuzzy_hero(text: str, threshold: int = HERO_EMIT_THRESHOLD):
    """Associe un texte OCR au héros le plus proche. -> (Nom, hero_id, score 0..100)."""
    from thefuzz import process, fuzz
    cand = strip_level(text)          # retire "Level 7" et le bruit de tête
    if not cand:
        return ("unknown_hero", None, 0)
    # fuzz.ratio() = distance de Levenshtein normalisée 0-100
    match, score = process.extractOne(cand, list(HERO_MAP.keys()), scorer=fuzz.ratio)
    if score >= threshold:            # HERO_EMIT_THRESHOLD = 60
        return (match, HERO_MAP[match], score)
    return ("unknown_hero", None, score)
```

Concrètement : `'Beb0p'` obtient un score de 80 avec `'Bebop'`, bien au-dessus du seuil de 60 — match confirmé. `'Mo & Kri11'` obtient un score de 88 avec `'Mo & Krill'` — match confirmé. Une chaîne aléatoire comme `'Level 7'` obtient un score de 30 — rejetée.

La sortie finale : chaque scan émet une ligne NDJSON sur `stdout` — une ligne JSON valide par événement, lue par Electron au fil de l'eau :

```python
result = {"type": "roster", "ts": int(time.time()), "source": "ocr",
          "myTeam": my_team, "enemyTeam": enemy_team}
sys.stdout.write(json.dumps(result, ensure_ascii=False) + "\n")
sys.stdout.flush()  # lu ligne par ligne par le canal IPC d'Electron
```

Résultat final : **12/12 héros identifiés** sur l'image de référence, 100 % de précision.

---

## 4. Démonstration en Direct (8:30 – 11:30)

`[Montage Kdenlive : Capture d'écran de l'application + Incrustation vidéo Anthony en bas à droite]`

Place à la démonstration. Je vais vous guider à travers les fonctionnalités principales de l'application.

---

**Authentification Steam.**

`[Action : Naviguer vers l'onglet Profil dans la barre latérale → Attendre le rendu de la page]`

`[Montage Kdenlive : Capture d'écran de la page Profil vide + Incrustation vidéo Anthony]`

Vous voyez la page Profil. Je clique sur « Se connecter avec Steam ».

`[Action : Cliquer sur le bouton « Se connecter avec Steam » → Attendre l'ouverture de la fenêtre OAuth Steam dans le navigateur système]`

L'application ouvre la page d'authentification officielle de Valve — c'est le protocole OpenID. Aucun mot de passe ne transite par mon application. Valve valide l'identité et retourne un `SteamID64` sécurisé. Cet appel passe obligatoirement par IPC — `window.api.steamStartAuth()` → `ipcMain.handle('steam:startAuth')` — parce que la clé API Steam est un secret stocké dans le processus principal et ne peut jamais être exposée au renderer.

`[Action : Compléter l'authentification Steam dans le navigateur → Revenir à l'application → Attendre 2 secondes que le profil se charge]`

`[Montage Kdenlive : Capture d'écran du profil Steam chargé (avatar + pseudo) + Incrustation vidéo Anthony]`

Mon profil Steam s'affiche maintenant : avatar, pseudo, SteamID. En dessous, l'historique de mes matchs récents — le héros joué, la durée, le résultat, les kills-décès-assists de chaque partie.

---

**Widget Spotify.**

`[Action : Observer le widget Spotify dans la barre latérale gauche → Cliquer sur « Connecter Spotify »]`

`[Montage Kdenlive : Capture d'écran de la sidebar avec le widget Spotify actif + Incrustation vidéo Anthony]`

Dans la barre latérale gauche, voici le widget Spotify. L'authentification utilise le flux OAuth PKCE — Authorization Code with Proof Key for Code Exchange. Aucun secret client n'est compilé dans l'application. Les jetons sont persistés localement via `electron-store`.

`[Action : Montrer les contrôles play/pause, piste suivante, et la pochette qui s'affiche]`

Une fois connecté : pochette de l'album en cours, titre, artiste, et les trois boutons de contrôle. L'état se synchronise toutes les 5 secondes. Je peux contrôler ma musique sans quitter l'application, sans quitter le jeu.

---

**Bibliothèque de héros — la grille.**

`[Action : Cliquer sur l'onglet « Héros » dans la navigation → Attendre 1 à 2 secondes le rendu de la grille]`

`[Montage Kdenlive : Capture d'écran de la grille des héros avec toutes les cartes visibles + Incrustation vidéo Anthony]`

L'onglet Héros liste tous les personnages jouables de Deadlock. Ces données viennent de l'endpoint `GET /v1/assets/heroes` filtré sur `player_selectable: true` et `disabled: false` — pour éliminer les héros retirés du jeu dont les données sont encore présentes dans l'API.

`[Action : Cliquer sur la carte d'un héros spécifique (ex: Haze) → Attendre l'animation de chargement « squelette »]`

`[Montage Kdenlive : Capture d'écran de l'animation squelette de chargement + Incrustation vidéo Anthony]`

Pendant le chargement, vous voyez un effet de **shimmer** — une animation CSS `animate-pulse` sur des rectangles en attente. C'est un retour visuel intentionnel : l'interface n'est pas gelée, elle attend les données.

`[Action : Attendre 1 à 2 secondes que la page de détail du héros se charge complètement]`

`[Montage Kdenlive : Capture d'écran de la page de détail héros avec les 5 onglets + Incrustation vidéo Anthony]`

La page de détail s'affiche avec ses cinq onglets : Builds, Items, Skill Path, Overview & Abilities, Lore.

`[Action : Pointer vers la barre d'onglets, puis cliquer sur « Builds »]`

L'onglet Builds affiche les trois configurations d'items les plus populaires de la semaine, enrichies de leur taux de victoire. Le build avec le meilleur winrate reçoit automatiquement le badge **Recommended**. La barre de répartition Dégâts Gun/Spirit/Vitalité est calculée en comptant les types d'items dans chaque catégorie du build.

`[Action : Survoler une icône d'item pour montrer le tooltip]`

Chaque item est cliquable et affiche un tooltip contextuel avec sa description et ses statistiques clés.

---

**Overlay en jeu.**

`[Action : Naviguer vers l'onglet Paramètres → Montrer le bouton d'activation de l'overlay]`

`[Montage Kdenlive : Capture d'écran de l'overlay transparent superposé au jeu + Incrustation vidéo Anthony]`

L'overlay est une seconde fenêtre Electron configurée avec `frame: false`, `transparent: true`, et `alwaysOnTop: true`. Il affiche un timer du Mid Boss, un timer de l'Urne calculé deterministement depuis l'heure de début de partie, des suggestions d'items contre la composition adverse, et le titre Spotify en cours.

---

## 4b. Deep Dive — Le Parcours Complet d'une Donnée : Du Clic au DOM (11:30 – 13:30)

`[Montage Kdenlive : Capture d'écran du code TypeScript HeroDetails.ts + Incrustation vidéo Anthony en bas à droite]`

Je vais maintenant vous démontrer ma compréhension de l'architecture asynchrone d'Electron en suivant le parcours complet d'une donnée — depuis le clic de l'utilisateur sur la carte d'un héros, jusqu'à l'affichage final dans l'interface. Six étapes.

---

**Étape 1 : L'événement déclencheur dans le Renderer.**

L'utilisateur clique sur la carte du héros Haze dans `HeroLibrary`. La classe TypeScript `HeroLibrary` intercepte ce clic et dispatche un `CustomEvent` natif du DOM :

```typescript
// HeroLibrary.ts — clic sur une carte héros
card.addEventListener('click', () => {
  document.dispatchEvent(new CustomEvent('navigate-hero', { detail: hero }));
});
```

`app.ts`, le routeur central de l'application, écoute cet événement et instancie la page de détail :

```typescript
// app.ts — routeur central
document.addEventListener('navigate-hero', (e: CustomEvent<HeroData>) => {
  heroDetailsPage.mountWithHero(container, e.detail);
});
```

---

**Étape 2 : Le choix architectural — fetch direct ou IPC ?**

`mountWithHero()` appelle immédiatement `renderSkeleton()` pour afficher l'animation de chargement, puis déclenche `fetchAll()`. Ici se trouve une décision architecturale importante : les données publiques de héros n'ont pas besoin de passer par IPC, parce qu'elles ne requièrent ni secret ni accès système. Le renderer appelle donc directement `fetch()` vers l'API communautaire :

```typescript
// HeroDetails.ts — fetchAll() : 5 requêtes parallèles
const [builds, stats, items, abilities, abilityOrder] = await Promise.all([
  // GET /v1/builds?hero_id=17&sort_by=weekly_favorites&limit=3&build_language=English
  fetch(`${API}/v1/builds?hero_id=${id}&sort_by=weekly_favorites&limit=3`)
    .then(r => r.ok ? r.json() : []),

  // GET /v1/analytics/hero-build-stats/17
  fetch(`${API}/v1/analytics/hero-build-stats/${id}`)
    .then(r => r.ok ? r.json() : []),

  // GET /v1/assets/items — catalogue global (~3 Mo), mis en cache au niveau du module
  fetchItemsCache(),

  // GET /v1/assets/items/by-hero-id/17 — compétences signature
  fetch(`${API}/v1/assets/items/by-hero-id/${id}`)
    .then(r => r.ok ? r.json() : []),

  // GET /v1/analytics/ability-order-stats?hero_id=17&min_matches=200
  fetch(`${API}/v1/analytics/ability-order-stats?hero_id=${id}&min_matches=200`)
    .then(r => r.ok ? r.json() : []),
]);
```

`Promise.all()` lance les cinq requêtes **en parallèle** et attend la plus lente — plutôt qu'en séquence, ce qui multiplierait le temps d'attente.

---

**Étape 3 : La forme de la donnée brute — l'API Payload.**

Voici à quoi ressemble le JSON brut retourné par l'API pour un héros :

```json
{
  "id": 17,
  "name": "Haze",
  "player_selectable": true,
  "disabled": false,
  "images": {
    "icon_hero_card_webp": "https://cdn.assets.deadlock-api.com/.../haze_card.webp",
    "background_image_webp": "https://cdn.assets.deadlock-api.com/.../haze_bg.webp"
  },
  "starting_stats": {
    "max_health": { "value": 550, "display_stat_name": "Max Health" },
    "max_move_speed": { "value": 7.0, "display_stat_name": "Move Speed" }
  },
  "items": {
    "weapon_primary": "citadel_weapon_base_pistol"
  }
}
```

Notez que `weapon_primary` est une `class_name` en chaîne de caractères — pas un identifiant numérique. Pour résoudre la statistique d'arme d'un héros, il faut scanner l'intégralité du catalogue d'items pour trouver celui dont le `class_name` correspond. C'est ce que fait `getWeaponItem()` dans `HeroDetails.ts`.

---

**Étape 4 : Le cache au niveau module.**

Le catalogue d'items complet fait environ 3 Mo. Je ne veux pas le re-télécharger à chaque navigation entre héros. La solution : deux variables à portée module, déclarées **en dehors** de la classe :

```typescript
// HeroDetails.ts — cache module-level (survit aux navigations entre héros)
let _itemsCache: Map<number, ItemData> | null = null;
let _itemsFetch: Promise<Map<number, ItemData>> | null = null;

function fetchItemsCache(): Promise<Map<number, ItemData>> {
  if (_itemsCache) return Promise.resolve(_itemsCache);  // déjà en cache
  if (_itemsFetch) return _itemsFetch;                   // requête en cours, pas de doublon
  _itemsFetch = fetch(`${API}/v1/assets/items`)
    .then(r => r.ok ? r.json() : [])
    .then((arr: ItemData[]) => {
      _itemsCache = new Map(arr.map(i => [i.id, i]));
      return _itemsCache;
    });
  return _itemsFetch;
}
```

Cette technique — appeler `_itemsFetch` si une requête est déjà en vol — s'appelle la **déduplication de promesses**. Si deux héros sont cliqués rapidement avant que le catalogue soit chargé, une seule requête réseau est émise.

---

**Étape 5 : Le rendu dynamique — du JSON au DOM.**

Une fois toutes les promesses résolues, `render()` génère l'HTML via des template literals et des boucles TypeScript :

```typescript
// HeroDetails.ts — génération de la barre d'onglets par boucle
private renderHeader(): string {
  return `
    <div class="sticky top-0 z-50">
      <!-- En-tête avec image de fond du héros -->
      <div style="background-image:url('${bgUrl}'); background-size:cover;">
        <h1 class="text-3xl font-bold text-white">${name}</h1>
      </div>
      <!-- Barre d'onglets générée dynamiquement -->
      <div class="flex px-8">
        ${TABS.map(t => `
          <button data-tab="${t.id}"
            class="hero-tab-btn px-5 py-3 text-sm font-medium
              ${this.currentTab === t.id
                ? 'text-dry-sage-400 border-dry-sage-400'   // onglet actif
                : 'text-grey-500 border-transparent'}">
            ${t.label}
          </button>`).join('')}
      </div>
    </div>`;
}
```

`TABS.map(t => ...)` génère les cinq boutons d'onglets avec leurs classes Tailwind conditionnelles selon l'état actif. Le `container.innerHTML = ...` remplace entièrement le DOM précédent, puis `bindEvents()` réattache les écouteurs d'événements sur les nouveaux nœuds.

Et c'est ici que les deux architectures convergent : pour les données qui **nécessitent** des secrets — Steam, Spotify, game detection, awards — tout passe par IPC. Pour les données publiques — héros, builds, items — le renderer fetch directement. C'est une séparation de responsabilités rigoureuse.

---

## 5. Logique Métier Avancée et Limitations Techniques (13:30 – 17:00)

`[Montage Kdenlive : Capture d'écran du code des Awards + arbre de décision + Incrustation vidéo Anthony en bas à droite]`

Parlons du moteur d'Awards — la logique algorithmique la plus intéressante du projet.

Après chaque partie terminée, l'application analyse les statistiques et attribue des médailles classées en cinq raretés : Épique, Rare, Peu Commun, Commun, Infâme. Il y a 48 awards définis. Voici la base :

```typescript
// Normalisation par durée de partie
function perMin(value: number, durationS: number): number {
  return durationS > 0 ? value / (durationS / 60) : 0;
}
```

Le `durationS > 0` est de la **programmation défensive** : si la durée est zéro ou absente dans les données API, on retourne zéro plutôt que provoquer une division par zéro qui ferait crasher l'interface.

L'award le plus complexe algorithmiquement est le **killstreak approximatif**. L'API ne fournit pas de compteur de kills consécutifs. La solution : analyser les intervalles temporels entre les morts du joueur.

```typescript
function approxKillstreak(player: RichMetaPlayer, durationS: number): number | null {
  if (!player.death_details) return null;       // donnée absente → null honnête
  if (player.death_details.length === 0) return player.kills;

  const deaths = [...player.death_details]
    .sort((a, b) => a.game_time_s - b.game_time_s);

  // Intervalles "sans mort" : [début, mort1], [mort1, mort2], ..., [dernière mort, fin]
  const intervals: Array<[number, number]> = [
    [0, deaths[0].game_time_s],
    ...deaths.slice(0, -1).map((d, i): [number, number] =>
      [d.game_time_s, deaths[i + 1].game_time_s]),
    [deaths[deaths.length - 1].game_time_s, durationS],
  ];

  let maxKills = 0;
  for (const [start, end] of intervals) {
    const w = (snapAtOrBefore(snaps, end)?.kills   ?? 0)
            - (snapAtOrBefore(snaps, start)?.kills ?? 0);
    if (w > maxKills) maxKills = w;
  }
  return maxKills;
}
```

C'est une approximation conservative — les snapshots sont espacés de 3 à 6 minutes — mais elle ne surreporte jamais la performance. Et pour les awards de Kill Participation où on divise par le total de kills de l'équipe : `Math.max(1, teamKills)` pour éviter une division par zéro si l'équipe n'a aucun kill. Programmation défensive systématique.

**Les limitations.**

Sur 48 awards définis, **21 ne peuvent pas être calculés**. J'ai vérifié sur 153 clés distinctes d'une vraie réponse API : les données pour les tirs à la tête, les parries, les dégâts par capacité individuelle — elles n'existent tout simplement pas dans le payload. Ces 21 awards affichent « Données indisponibles » avec une explication. Cette transparence est intentionnelle.

**La grande limitation : le Live Dashboard en mode MOCK.**

L'onglet Live Dashboard est présenté en mode simulation. Voici la chaîne complète des contraintes.

Mon plan initial : l'endpoint `/matches/active` de l'API. Il ne retourne que les 200 parties les plus regardées au monde. Toute partie normale n'y apparaît jamais.

L'endpoint unitaire `/v1/matches/{id}/metadata` : limité à **3 requêtes par heure**. Interroger 12 joueurs en séquence avec ce quota est mécaniquement impossible.

La solution retenue : le **bulk metadata endpoint** — `GET /v1/matches/metadata?match_ids={id}`. Une seule requête pour toutes les données de la partie, avec 10 requêtes par minute. C'est un facteur 200 d'amélioration. Mais le problème fondamental reste entier : Valve chiffre les données réseau de jeu en direct sur leurs serveurs. L'API n'expose les données d'une partie qu'après sa conclusion. C'est une contrainte externe totalement hors de ma portée.

La mitigation dans l'application : un mode MOCK dans les Paramètres pour simuler un match avec des données historiques, et le cache `electron-store` avec un TTL de 7 jours comme fallback dégradé honnête — les données du dernier chargement réussi s'affichent avec un indicateur visuel clair.

---

## 6. Bilan académique, Apprentissages et Conclusion (17:00 – 20:00)

`[Montage Kdenlive : Plein écran vidéo Anthony]`

Pour conclure, je veux faire le lien entre ce projet et ma formation.

Ce projet, c'est l'aboutissement de mon DEC en Techniques de l'informatique. Chaque module de la formation y trouve une application concrète.

**Développement web** (420-VBA-LP, 420-V88-LP) : l'interface Electron en TypeScript avec gestion d'événements asynchrones, routing SPA, manipulation directe du DOM.

**Programmation orientée objet** (420-V83-LP) : les interfaces TypeScript `AwardEntry`, `RichMatchMeta`, `GameState`, `OcrRoster` — chaque entité encapsulée, chaque module à responsabilité unique.

**Algorithmique et programmation avancée** (420-V80-LP, 420-VA9-LP) : le calcul du killstreak par intervalles temporels, les 27 métriques quantitatives des awards, la déduplication de promesses, le filtrage de l'API.

**Systèmes d'exploitation** (420-V89-LP) : l'adaptation cross-platform Windows ↔ Linux CachyOS avec Wayland, la détection du répertoire Steam via `libraryfolders.vdf`, les règles KWin pour l'overlay.

**Sécurité et automatisation** (420-VB6-LP) : le pipeline CI/CD GitHub Actions, la Content Security Policy en double couche, la séparation secrets build-time / runtime.

**Base de données** (420-V91-LP) : `electron-store` joue le rôle de base de données locale — tokens, cache de matchs, TTL de 7 jours, persistance des awards.

**Sur la gestion de projet.** Microsoft Planner comme Kanban, découpage en tâches MVP versus Backlog. Un vault Obsidian avec un diagramme Excalidraw dessiné sur une à deux semaines *avant* d'écrire la première ligne de code pour visualiser l'architecture globale, la navigation entre onglets, les flux de données entre APIs. Un PRD — Product Requirement Document — pour recenser toutes les sources externes. Cette phase de planification s'est révélée cruciale pour anticiper les dépendances techniques et livrer dans les délais.

**Sur les outils d'IA.** J'ai utilisé Cursor sur Windows et Claude Code en ligne de commande sur Linux. Ces outils m'ont aidé pour le boilerplate, la documentation et le débogage des situations complexes comme les problèmes CSP au build. Mais les décisions architecturales — quel endpoint utiliser, comment séparer IPC des fetch directs, comment concevoir le système d'awards — ces décisions sont miennes. L'IA est un accélérateur de productivité, pas un architecte.

`[Montage Kdenlive : Défilement dynamique du PDF de 24 pages rendu par LaTeX (Focus sur les diagrammes TikZ : architecture IPC, arbre de décision Awards, diagramme de classes — et les listings de code) + Voix off d'Anthony]`

Ce rapport de 24 pages a été entièrement rédigé en **LaTeX**. C'est une décision qui m'a demandé un investissement personnel réel. Apprendre la syntaxe de LaTeX — les environnements `lstlisting` pour les blocs de code typographiés, les diagrammes TikZ dessinés à la main nœud par nœud, la gestion des flottants pour les figures, la table des matières et la table des figures générées automatiquement — c'est une rigueur typographique de niveau ingénierie. Je suis fier de ce document. Il représente exactement ce qu'un rapport technique devrait être : structuré, précis, illustré, et produit avec les outils du métier.

`[Montage Kdenlive : Retour plein écran vidéo Anthony]`

**Le bilan honnête.** J'avais estimé 150 heures. Le projet en a demandé environ 175. Le surplus de 25 heures est attribuable à trois facteurs imprévus : l'instabilité de l'API communautaire avec ses endpoints qui changent, les problèmes de build CI/CD avec la CSP, et les trois itérations successives sur le roster live — log watching, OCR, post-partie. Ces 25 heures ne sont pas un échec de planification. Ce sont des apprentissages réels sur la gestion d'une dépendance externe non maîtrisée — exactement ce qu'on rencontre en milieu professionnel.

DeadlockHelper est un projet fonctionnel, distribué publiquement, que de vraies personnes téléchargent et utilisent. Il m'a appris à mener un projet logiciel complexe en solo sur plusieurs mois, à faire des choix d'architecture défendables et documentés dans des ADR — Architecture Decision Records — et à livrer malgré les obstacles techniques.

Messieurs Forget et Demers, je vous remercie pour votre attention, et je suis maintenant disponible pour vos questions.

---

*Fin du script — durée estimée : 19 à 21 minutes à débit naturel*
*Version 2 — 4 directives appliquées sur architecture réelle (HeroDetails.ts + ocr-worker/main.py + preload.ts)*
