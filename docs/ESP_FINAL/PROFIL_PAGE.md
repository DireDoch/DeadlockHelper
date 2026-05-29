# Page Profil — Architecture, Données & Décisions Techniques

Ce document décrit l'architecture complète de la page Profil : pipeline de données, endpoints utilisés, algorithmes, décisions de conception et points de vigilance. Il couvre également le **panneau Match Detail** (les 5 onglets d'analyse détaillée d'une partie), ajouté après la mise en place initiale.

---

## 1. Vue d'ensemble du pipeline de données

```
ProfilPage.mount()  OU  ProfilPage.mountForPlayer(accountId)
        │
        ▼ Phase 1 — Résolution de compte (parallèle)
        ├─ window.api.steamGetProfile()              → steamId64 (Electron store)
        ├─ /v1/players/steam-search                  → account_id, last_team_avg_badge, matches_played_last_30d
        ├─ /v1/assets/heroes                         → Map<id, HeroAsset> (cache module-level)
        ├─ /v1/assets/items                          → Map<id, ItemData>  (cache module-level)
        └─ /v1/analytics/badge-distribution          → distribution pour calcul Top X%
        │
        ▼ Phase 2 — Historique de matchs
        └─ /v1/players/{account_id}/match-history    → PlayerMatchHistoryEntry[] (historique complet)
        │
        ▼  → render() : skeleton disparu, page affichée avec données de base
        │
        ▼ Phase 3 — Métadonnées (50 matchs en parallèle)
        └─ /v1/matches/{match_id}/metadata  × 50    → MatchMeta complet (build, équipes, badges,
               │                                        stats[], items[], assigned_lane…)
               │   ⚠️  damage_matrix est SUPPRIMÉ à la réception (mémoire) — inutile, les totaux
               │       sont dans stats[]
               ├─ Matchs 0-9   → Lignes de match (build 6×2, composition équipes, KP%)
               └─ Matchs 0-49  → Moving average du badge → mise à jour du banner rang
        │
        ▼ Phase 4 — Noms Steam (après métadonnées)
        ├─ player-names:get-many (IPC)               → lecture cache electron-store
        └─ /v1/players/steam?account_ids=...         → batch profiles (noms non cachés seulement)
               └─ player-names:set-many (IPC)        → écriture cache electron-store (TTL 7 jours)
```

**Principe fondamental :** Chaque phase commence dès que la précédente est terminée. La page est rendue à la fin de la Phase 2 avec un état de chargement partiel sur les lignes de match. Les phases 3 et 4 mettent à jour les composants ciblés sans re-render complet.

---

## 2. Endpoints détaillés

### 2.1 `/v1/players/steam-search` — Résolution du compte joueur

```
GET /v1/players/steam-search
  ?search_query={steamId64}
  &min_matches_played_last_30d=0
  &limit=1
```

**Pourquoi cette approche :** Le store Electron ne persiste que le `steamId64` (64 bits). L'API Deadlock travaille avec l'`account_id` (SteamID3, 32 bits). La conversion mathématique `steamId64 - 76561197960265728` est possible mais cet endpoint retourne en plus `last_team_avg_badge` et `matches_played_last_30d` en un seul appel — donc aucun appel supplémentaire n'est nécessaire.

| Champ | Usage |
|-------|-------|
| `account_id` | Identifiant Deadlock — utilisé pour tous les appels joueur suivants |
| `personaname` | Nom Steam affiché dans le banner |
| `avatarmedium` | Avatar affiché dans le banner (priorité sur le store Electron) |
| `last_team_avg_badge` | Badge estimé initial — affiché immédiatement, remplacé par la moving average |
| `matches_played_last_30d` | Carte "Activité 30j" — nombre de parties récentes |

**Limitation :** `min_matches_played_last_30d=0` est obligatoire. La valeur par défaut de l'API est 5, ce qui exclut les comptes inactifs ou nouveaux.

---

### 2.2 `/v1/players/steam` — Profil d'un joueur externe (vue autre joueur)

```
GET /v1/players/steam
  ?account_ids={accountId}
```

**Utilisé uniquement dans `mountForPlayer(accountId)`** — quand l'utilisateur clique sur le nom d'un adversaire dans l'historique de match. Fournit le même jeu de champs que `steam-search` mais par ID direct.

**Capacité batch :** Accepte jusqu'à 1000 `account_ids` séparés par virgule. Utilisé aussi en Phase 4 pour résoudre les noms Steam de tous les joueurs d'un match en un seul appel.

---

### 2.3 `/v1/players/{account_id}/match-history` — Historique complet

```
GET /v1/players/{account_id}/match-history
```

**Ce que ça retourne :** L'intégralité de l'historique (peut dépasser 2000 entrées). La réponse est stockée en mémoire dans `this.allMatches`. Seuls les `visibleCount` premiers (10 initialement) sont rendus — la pagination est entièrement côté UI.

| Champ | Usage |
|-------|-------|
| `match_id` | Clé pour fetch de métadonnées + identifiant d'affichage |
| `hero_id` | Résolution icône/nom via heroMap |
| `start_time` | Unix timestamp → calcul `timeAgo()` |
| `game_mode` | `1` = Normal (6v6), `4` = Street Brawl (4v4) |
| `player_team` | `0` ou `1` — équipe du joueur dans ce match |
| `player_kills / player_deaths / player_assists` | KDA de la ligne + calcul top héros |
| `match_duration_s` | Durée formatée `MM:SS` |
| `match_result` | Équipe gagnante (0 ou 1) — `match_result === player_team` → victoire |

---

### 2.4 `/v1/matches/{match_id}/metadata` — Métadonnées complètes de match

```
GET /v1/matches/{match_id}/metadata
```

Appelé en batch parallèle pour les 50 premiers matchs au chargement. L'objet `match_info` est conservé **intégralement en mémoire** (contrairement à l'implémentation initiale qui ne gardait qu'un sous-ensemble), à l'exception du champ `damage_matrix` qui est **supprimé immédiatement à la réception** pour économiser la mémoire — les totaux de dégâts sont recalculés depuis `stats[]`.

**Champs critiques pour le panneau Match Detail :**

| Champ | Usage |
|-------|-------|
| `players[].stats[]` | Série temporelle de snapshots cumulatifs (3/6/9/12/15/20/25/fin min) — source de toutes les métriques comparatives |
| `players[].items[]` | Log chronologique des achats (game_time_s, item_id, sold_time_s…) |
| `players[].assigned_lane` | Lane du joueur : `1` = bleu, `4` = jaune, `6` = vert |
| `players[].net_worth / last_hits / level` | Snapshot final directement sur le joueur |
| `winning_team` | Détermine les labels WINNER/LOSER des factions |
| `average_badge_team0/1` | Moving average du rang (50 matchs) |
| `duration_s` | Durée totale du match (pour DMG/min) |
| `game_mode` | Conditionne l'UI de Lane Stats (lanes en mode Normal, pas en Brawl) |

**Suppression de `damage_matrix` :**
```typescript
if (data?.match_info) {
  delete data.match_info.damage_matrix; // ~30-60 kB par match → inutile, totaux dans stats[]
  this.matchMetaMap.set(m.match_id, data.match_info);
}
```

**Rate limit :** `100req/s` depuis le cache. 50 requêtes parallèles restent dans les limites (matchs récents = cache chaud).

---

### 2.5 `/v1/analytics/ability-order-stats` — Ordre de compétences (fallback Items tab)

```
GET /v1/analytics/ability-order-stats
  ?hero_id={heroId}
  &min_matches=200
```

**Usage :** Uniquement dans l'onglet Items du Match Detail Panel. La métadonnée de match ne contient **aucun ordre de montée de compétences réel** (voir ADR 0001/0002). Ce endpoint retourne les séquences communautaires du patch courant. Seule la **#1 par nombre de matchs** est affichée, clairement labellisée "ordre communautaire (patch actuel) — pas celui de ce match".

**Cache module-level** (`_abilityCache`, `Map<heroId, AbilityData>`) : chargé à la demande à l'ouverture de l'onglet Items, persistant pour toute la session.

---

### 2.6 `/v1/assets/items/by-hero-id/{id}` — Icônes des compétences

```
GET /v1/assets/items/by-hero-id/{heroId}
```

Utilisé conjointement avec `ability-order-stats` pour résoudre les icônes (images) des 4 compétences signature d'un héros dans la grille Ability Build. Filtre identique à HeroDetails : exclut `Melee` et les noms contenant `_`, garde les 4 premières.

---

## 3. Inventaire de fin de match — Filtrage des items

Les `items[]` dans les métadonnées d'un joueur contiennent tous les achats de la partie (y compris items revendus, upgrades appliqués, abilities). Le filtrage pour obtenir le "build final" (grille 6×2) :

```typescript
function endGameItems(metaItems: MetaItem[], itemMap: Map<number, ItemData>): ItemData[] {
  const seen = new Set<number>();
  const result: ItemData[] = [];
  for (const mi of metaItems) {
    if (result.length >= 12) break;                          // grille 6×2 max
    if (mi.sold_time_s !== 0 && mi.sold_time_s !== null) continue; // item revendu
    if (seen.has(mi.item_id)) continue;                      // déduplique
    const item = itemMap.get(mi.item_id);
    if (!item?.shop_image_webp || !item.item_tier) continue; // shop items seulement
    seen.add(mi.item_id);
    result.push(item);
  }
  return result;
}
```

**Item Timeline (onglet Items)** : variante qui prend le **premier** `game_time_s` par `item_id` distinct, inclut les items vendus (affichés en semi-transparent), groupés par minute.

---

## 4. Algorithme d'estimation du rang

### 4.1 Stratégie

| Source | Disponibilité | Précision |
|--------|--------------|-----------|
| `last_team_avg_badge` (steam-search) | Immédiate (Phase 1) | Badge moyen du dernier match joué |
| Moving average sur 50 matchs metadata | Après Phase 3 (~5-10s) | Moyenne lissée sur 50 parties |

**Stratégie adoptée :** Affichage progressif en deux temps — valeur immédiate, puis remplacement silencieux par la moyenne.

### 4.2 Décodage badge → rang

```
badge = tier × 10 + subtier
tier    = Math.floor(badge / 10)   → 1-11 (Initiate à Eternus)
subtier = badge % 10               → 0-6  → affichés en chiffres romains (I-VI)
```

---

## 5. Cache des noms Steam (electron-store)

**TTL :** 7 jours. Les noms Steam changent rarement. Sans cache : jusqu'à 120 `account_id` uniques à résoudre pour 10 matchs visibles.

| Handler IPC | Signature |
|-------------|-----------|
| `player-names:get-many` | `(accountIds: number[]) → Record<number, string \| null>` |
| `player-names:set-many` | `(entries: {accountId, personaname, avatarmedium?}[]) → {success}` |

---

## 6. Navigation dynamique entre profils

```typescript
// Mode 1 : profil de l'utilisateur connecté
profilPage.mount(container)

// Mode 2 : profil d'un joueur externe (clic sur un adversaire)
profilPage.mountForPlayer(container, accountId)
```

Dispatché par les boutons de noms de joueurs dans les lignes de match et dans le panneau Match Detail :
```typescript
document.dispatchEvent(new CustomEvent('navigate-player', {
  detail: { accountId: number }
}));
```

Capté dans `App.setup()` → montage de `ProfilPage` sur le conteneur principal.

---

## 7. Système de badge de tier — Utilitaire partagé

Utilitaires centralisés dans `src/lib/utils/index.ts` :

```typescript
export function itemSlotColor(slotType?: string): string
// weapon → #f97316 (orange)
// spirit → #a855f7 (violet)
// vitality → #22c55e (vert)
// autre → #4b5563 (gris)

export function renderItemTierBadge(item: { item_tier?: number; item_slot_type?: string }): string
// Roman I/II/III/IV · couleur fond = itemSlotColor · position absolute top-0 right-0
```

**Tier scale :** Deadlock a 4 tiers (I–IV). Le spec initial mentionnait I–VI — **corrigé**, la valeur réelle de l'API confirme 4 niveaux.

**Pages utilisant ces utilitaires :** `HeroDetails.ts`, `ProfilPage`, `matchDetail/tabs.ts`.

---

## 8. Calcul des statistiques globales

### 8.1 KDA moyen du compte

```typescript
const avgKills   = total ? matches.reduce((s, m) => s + m.player_kills,   0) / total : 0;
const avgDeaths  = total ? matches.reduce((s, m) => s + m.player_deaths,  0) / total : 0;
const avgAssists = total ? matches.reduce((s, m) => s + m.player_assists, 0) / total : 0;
```

### 8.2 KDA par héros (Top 3 Most Played)

**Scope délibéré : 50 derniers matchs avec ce héros spécifique.**

```typescript
const kda = deaths > 0 ? (kills + assists) / deaths : kills + assists;
```

**Formule KDA :** `(Kills + Assists) / Deaths` — standard Deadlock.

### 8.3 Kill Participation (KP%)

```typescript
const teamKills = myTeam.reduce((s, p) => s + p.kills, 0);
const kp = ((m.player_kills + m.player_assists) / teamKills) * 100;
```

Si les métadonnées ne sont pas encore chargées : affiche `—` sans bloquer le rendu.

---

## 9. Structure de l'interface — Profil principal

```
┌─ Header (sticky) ────────────────────────────────────────────────────────────┐
│  [Avatar] [Nom]  [Badge rang] Phantom II · Top 24.07%                        │
└──────────────────────────────────────────────────────────────────────────────┘
┌─ Tab bar (sticky z-20) ──────────────────────────────────────────────────────┐
│  Overview  |  Heroes  |  Matches                                              │
└──────────────────────────────────────────────────────────────────────────────┘
┌─ Side-by-side row ─────────────────────────────────────────────────────────┐
│  ┌── 2×2 stat cards ──┐  ┌── Most Played Heroes (table) ──────────────────┐│
│  │ Win Rate  │ KDA     │  │ Hero | Matches | Win Rate | KDA (50 matchs)    ││
│  │ Total     │ Activité│  │  ×3 héros                                      ││
│  └────────────────────┘  └────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────────────────────┘
┌─ Match History ─────────────────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ [4px border] [Hero 64px] Mode·ID·durée·ago  │  Build 6×2 │ Équipes  │[↓]│
│  │              K/D/A  XX%KP                   │  (12 slots) │ 2 col.   │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│    └── Match Detail Panel (si expandé) ──────────────────────────────────┐  │
│       Overview · Lane Stats · Items · Economy · Damage                    │  │
│    └──────────────────────────────────────────────────────────────────────┘  │
│  × 10 lignes → [Charger 10 parties de plus]                                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Match Detail Panel — Architecture complète

Le panneau d'analyse par match est exposé via le chevron **▼** à droite de chaque ligne de match. Il se rend **inline** (pas de navigation) à l'intérieur de la ligne expandée.

### 10.1 Module source

```
src/renderer/pages/Profil/matchDetail/
├── types.ts     — Interfaces TypeScript (RichMatchMeta, RichMetaPlayer, StatSnapshot,
│                  MatchDetailState, DetailContext, AbilityData…)
├── helpers.ts   — Fonctions pures : formatage, accès données, donutChart SVG, cache
│                  ability-order, advantageBar, playerStatRow, itemTimeline…
├── tabs.ts      — Rendus des 5 onglets (fonctions pures de DetailContext)
└── index.ts     — MatchDetailController : état UI par match, listener délégué,
                   chargement async de l'ability-order
```

### 10.2 Gestion de l'état

L'état interactif (`MatchDetailState`) est conservé **hors du DOM** dans une `Map<matchId, MatchDetailState>` du contrôleur. Ceci est nécessaire car `refreshMatchRows()` re-génère le `innerHTML` complet de la liste de matchs à chaque mise à jour de métadonnées ou de noms Steam.

```typescript
interface MatchDetailState {
  tab: 'overview' | 'lane' | 'items' | 'economy' | 'damage';
  laneSnapshotIdx: number;       // -1 → snapshot final
  laneLeft: Set<number>;          // player_slots sélectionnés côté Amber Hand
  laneRight: Set<number>;         // player_slots sélectionnés côté Sapphire Flame
  itemsLeftSlot: number;          // joueur sélectionné Items (équipe 0)
  itemsRightSlot: number;         // joueur sélectionné Items (équipe 1)
  damageSubtab: 'hero' | 'total' | 'healing' | 'obj';
  damageSlot: number;             // joueur sélectionné → cartes Damage détail
  economySubtab: 'networth' | 'income' | 'deathloss';
  economySlot: number;            // joueur sélectionné → Income Breakdown
  initialized: boolean;
}
```

**Réinitialisation :** `matchDetail.reset()` est appelé dans `_resetState()` — garantit que les sélections par défaut (lane du joueur, etc.) sont recalculées à chaque changement de profil.

### 10.3 Événements — Délégation

Un seul `addEventListener('click', …)` par panneau ouvert, sur le `[data-detail-root]`. Les actions sont routées via `data-action` :

| `data-action` | Effet |
|---|---|
| `detail-tab` | Changement d'onglet |
| `lane-snap` | Sélection d'un snapshot temporel |
| `lane-preset` | Application d'un preset de lane (remplace la sélection) |
| `lane-toggle` | Ajout/retrait d'un héros de la sélection comparée |
| `items-pick` | Sélection du joueur affiché dans Items (gauche/droite) |
| `dmg-subtab` | Sous-onglet du graphe Damage |
| `dmg-pick` | Sélection du joueur → cartes Damage détail |
| `eco-subtab` | Sous-onglet Economy |
| `eco-pick` | Sélection du joueur → Income Breakdown |
| `navigate-player` | Bubble vers l'app-level `navigate-player` CustomEvent |

### 10.4 Onglet Overview

**Source des données :** Champs directs sur `RichMetaPlayer` + snapshot final de `stats[]`.

| Élément | Calcul / source |
|---------|----------------|
| Nom de faction + WINNER/LOSER | `TEAM_NAME[team]` + `match_info.winning_team` |
| Cumul K/D/A équipe | Somme sur les 6 joueurs de l'équipe |
| Hero icon + lien profil | `images.icon_hero_card_webp` + `navigate-player` event |
| Grille build 6×2 | `endGameBuild()` — mêmes règles que la ligne de match principale |
| Tooltip item | `itemTitle()` — natif `title=""` (résistant au `overflow-hidden` du parent) |
| KDA numérique | `(kills + assists) / deaths` ; `kills + assists` si `deaths === 0` |
| CS | `player.last_hits` (champ direct sur le joueur) |
| KP% | `((kills + assists) / teamKills) * 100`, formaté `X.X% KP` |
| Damage | `stats[final].player_damage` (hero damage uniquement) |

**Ordre des joueurs :** Mode Normal → tri fixe `yellow(4) → blue(1) → green(6)` puis `player_slot`. Mode Brawl → tri par `player_slot` uniquement.

### 10.5 Onglet Lane Stats

**Source :** `stats[]` snapshots cumulatifs. Timestamps réels de l'API (pas d'interpolation) : typiquement `3/6/9/12/15/20/25/fin min`. **Aucun snapshot à 0m.**

**Comportement selon le mode :**

| Mode | Lanes | Sélection par défaut |
|------|-------|----------------------|
| Normal (game_mode 1) | Pastilles colorées (jaune/bleu/vert), présentes dans la barre héros | Lane du joueur connecté (son 2v2) |
| Street Brawl (game_mode 4) | Aucune pastille ni bordure de lane | Toute l'équipe vs toute l'équipe |

**Métriques comparées (snapshot sélectionné) :**

| Métrique | Champ `StatSnapshot` |
|----------|----------------------|
| Kills | `kills` |
| Souls | `net_worth` |
| Last Hits | `creep_kills` |
| Denies | `denies` |
| Damage | `player_damage` |
| Obj Damage | `boss_damage` |
| Shots Hit % | `shots_hit / (shots_hit + shots_missed)` |
| Level | `level` |

**Comparaison asymétrique :** L'utilisateur peut sélectionner N joueurs côté gauche et M côté droit (N ≠ M). Les valeurs agrégées sont des sommes, sauf Level (moyenne).

### 10.6 Onglet Items

**Deux sections par joueur :**

**Item Timeline**
- Un icône par `item_id` distinct, placé à son **premier** `game_time_s`
- Filtre shop items uniquement (`shop_image_webp` + `item_tier` requis)
- Items vendus (`sold_time_s ≠ 0/null`) inclus mais grisés (`opacity-40`)
- Groupement par minute, séparés par `→`

**Ability Build (fallback communautaire)**
- La métadonnée de match ne contient aucun ordre de montée réel (champs `ability_stats`, `book_rewards`, `hero_equips` vides — vérifiés sur 153 clés de `CMsgMatchMetaDataContents`)
- Affiche la **#1 séquence par nombre de matchs** de `/v1/analytics/ability-order-stats`
- Icône `ability-learn.png` dans chaque case améliorée ; fond teinté de la couleur de la ligne
- Chargement async, cache module-level par `hero_id`
- Label obligatoire : *"Ordre communautaire (patch actuel) — pas celui de ce match"*
- Voir **ADR 0002** pour la décision complète

### 10.7 Onglet Economy

**Section 1 — Barres d'équipe** (4 métriques) :

| Métrique | Calcul |
|----------|--------|
| Net Worth | `Σ player.net_worth` |
| Total CS | `Σ player.last_hits` |
| Denies | `Σ stats[final].gold_denied` (**souls** refusées, pas le compteur de denies) |
| Death Loss | `Σ stats[final].gold_death_loss` |

> ⚠️ **Distinction importante :** La colonne "Denies" ici = `gold_denied` (souls en valeur monétaire), différent du compteur de deny affiché dans Lane Stats (`stats[].denies`). Valeurs de l'ordre de 1-2k (souls), non d'une centaine.

**Section 2 — Sous-onglets + Income Breakdown** :

Trois sous-onglets : **Net Worth** / **Income** / **Death Loss**. Chacun affiche une liste unique de 12 joueurs, triée par la métrique, avec icône héros à gauche et barre colorée par équipe.

- `Net Worth` → `player.net_worth`
- `Income` → somme des 5 sources : `gold_lane_creep(+_orbs)` + `gold_neutral_creep(+_orbs)` + `gold_player(+_orbs)` + `gold_boss(+gold_boss_orb)` + `gold_treasure`
- `Death Loss` → `stats[final].gold_death_loss`

**Income Breakdown** (joueur sélectionné, défaut = joueur connecté) :
Graphique **donut SVG** hand-rolled — 5 segments colorés + total au centre + légende à grande typographie.

| Catégorie | Champ `StatSnapshot` | Couleur |
|-----------|----------------------|---------|
| Lane Creeps | `gold_lane_creep + gold_lane_creep_orbs` | `#f59e0b` |
| Neutrals | `gold_neutral_creep + gold_neutral_creep_orbs` | `#22c55e` |
| Player Kills | `gold_player + gold_player_orbs` | `#ef4444` |
| Bosses | `gold_boss + gold_boss_orb` | `#a855f7` |
| Treasure | `gold_treasure` | `#38bdf8` |

### 10.8 Onglet Damage

**Section 1 — Barres d'équipe** (5 métriques) :

| Métrique | Champ `StatSnapshot` |
|----------|----------------------|
| Hero Damage | `player_damage` |
| Hero Healing | `player_healing` |
| Obj Damage | `boss_damage` |
| Damage Taken | `player_damage_taken` |
| Mitigated | `damage_mitigated` |

**Section 2 — Graphe unifié 12 joueurs** : tous les joueurs des deux équipes dans une **unique liste triée** (pas deux blocs séparés). Icône héros à gauche. 4 sous-onglets :

| Sous-onglet | Calcul |
|-------------|--------|
| Hero Damage | `player_damage` |
| Total Damage | `player_damage + creep_damage + neutral_damage + boss_damage` |
| Hero Healing | `player_healing` |
| Obj Damage | `boss_damage` |

**Section 3 — Cartes détail joueur** (clic sur une barre pour changer) :

- **Damage Breakdown** : donut SVG 4 segments (Heroes/Creeps/Neutrals/Objectives) + chips DMG/min, Team Share, DMG/Death
- **Accuracy** : Shots, Hits, Hit Rate (`shots_hit / (shots_hit + shots_missed)`)
- **Survivability** : Deaths, DMG Taken, Mitigated
- **Power** : Weapon Power, Spirit Power, Max HP

> `damage_matrix` n'est **pas** utilisé dans cet onglet. Tous les totaux viennent de `stats[final]`.

---

## 11. Visualisations graphiques — Donut SVG

Les breakdowns Income et Damage utilisent un graphique **donut SVG hand-rolled** (zéro dépendance externe), cohérent avec le pattern de RankDistribution.

```typescript
// Segments dessinés en sens horaire depuis 12h
// stroke-dasharray = longueur de l'arc, stroke-dashoffset = position de départ
const C = 2 * Math.PI * R; // circonférence
const dash  = frac * C - GAP;
const offset = -accBefore * C;
```

Animation d'entrée : `md-pop-in` (scale 0.88→1, définie dans `index.css`) + légende en cascade `md-rise` (translateY 6px→0, délai +55ms par ligne).

---

## 12. Décisions techniques (log des choix)

| Décision | Alternative rejetée | Raison du choix |
|----------|---------------------|-----------------|
| Conserver `match_info` complet en mémoire | Ne garder qu'un sous-ensemble (ancienne approche) | Le panneau Match Detail nécessite `stats[]`, `items[]`, `assigned_lane` — pas de deuxième fetch |
| Supprimer `damage_matrix` à la réception | Conserver tout le payload | `damage_matrix` fait ~30-60 kB par match ; les totaux sont dans `stats[]` ; inutile |
| État UI hors DOM (`Map<matchId, MatchDetailState>`) | Lire l'état depuis des attributs `data-*` dans le DOM | `refreshMatchRows()` reconstruit tout le `innerHTML` ; le DOM n'est pas stable entre updates |
| Délégation via `data-action` (1 listener par panneau) | Listeners individuels sur chaque bouton | Les boutons sont recréés à chaque re-render ; un seul listener survivant sur le root |
| Donut SVG hand-rolled | Librairie de charts (Chart.js, etc.) | Cohérence avec RankDistribution existant ; zéro dépendance supplémentaire |
| `title=""` natif pour les tooltips d'items | CSS `group-hover` tooltip | Le conteneur parent est `overflow-hidden` → clip des tooltips CSS |
| Ability Build = séquence communautaire #1 (ADR 0002) | Grille vide (ADR 0001 initial) | L'ordre réel du match est absent de toute l'API (153 clés vérifiées) ; le fallback offre de la valeur avec un label d'avertissement clair |
| Income "Denies" = `gold_denied` (souls) | `denies` count | Screenshot réel montre "1.8k" → impossiblement haut pour un compteur de deny → c'est une valeur monétaire |
| Ordre lanes fixe jaune→bleu→vert | Tri par `player_slot` | Aligne les partenaires de lane entre les deux équipes pour une lecture intuitive côte-à-côte |
| No TL Score tab | Inclure un 6e onglet | Aucun endpoint API ne fournit de TL Score ; toute valeur serait inventée |

---

## 13. ADRs liées

- **[ADR 0001](../adr/0001-match-ability-order-unavailable.md)** — La métadonnée de match ne contient pas l'ordre de compétences (superseded)
- **[ADR 0002](../adr/0002-match-ability-build-community-fallback.md)** — Fallback communautaire pour l'Ability Build (actif)
