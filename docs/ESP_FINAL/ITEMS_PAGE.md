# Item Statistics — Architecture, Logique de données et Choix techniques

Ce document décrit les décisions de conception et d'implémentation de la page **Item Statistics** (route `meta-items`) : flux de données depuis l'API Deadlock, contrainte de fenêtre temporelle sur les requêtes globales, calcul des taux d'usage, système de filtres, et comportement du tableau trié.

---

## 1. Vue d'ensemble

La page Item Statistics affiche un **tableau global** de tous les items Deadlock, agrégé sur l'ensemble des héros, avec des statistiques de popularité (usage) et de performance (win rate) comparées à la période précédente.

```
mount()
   │
   ├─ resetFilters()       ← état par défaut (latest patch, all ranks, T1–T4, sort: usage↓)
   ├─ renderSkeleton()     ← placeholders animate-pulse immédiats
   │
   └─ fetchAll()           ← fetch séquentiel puis parallèle
         │
         ├─ GET /v1/patches/big-days   → liste des dates de patch (cache module-level)
         │   (résout "latest" → patch récent dans la fenêtre des 28 j)
         │
         ├─ GET /v1/assets/items       → catalogue complet (cache module-level partagé)
         │
         ├─ GET /v1/analytics/item-stats (période courante)   ← sans hero_ids
         ├─ GET /v1/analytics/item-stats (période référence)  ← sans hero_ids
         ├─ GET /v1/analytics/hero-stats (période courante)
         └─ GET /v1/analytics/hero-stats (période référence)
               │
               ▼
         computeItemRows()   ← jointure cur/ref, calcul usage%, deltas
               │
               ▼
         renderPage()        ← tableau trié + barre de filtres
```

---

## 2. Différence fondamentale avec l'onglet Items de HeroDetails

L'onglet Items de `HeroDetails` filtre les données sur **un seul héros** via `hero_ids={id}`. La page Item Statistics ici est **globale** : aucun filtre `hero_ids` n'est envoyé, ce qui agrège les données sur l'ensemble des 27+ héros simultanément.

Cette différence entraîne deux conséquences importantes :

| Aspect | HeroDetails Items tab | MetaItemsPage (global) |
|--------|----------------------|------------------------|
| Paramètre URL | `hero_ids={id}` | _(absent)_ |
| Fenêtre temporelle supportée | Plusieurs mois | **28 jours maximum** |
| Dénominateur d'usage | Matchs totaux du héros ciblé | Somme de tous les matchs de tous les héros |
| Comportement si timestamp trop ancien | Données présentes | **HTTP 500** côté serveur |

---

## 3. Contrainte critique : fenêtre de 28 jours pour les requêtes globales

### 3.1 Problème rencontré

L'API retourne **HTTP 500** (Internal Server Error) lorsqu'une requête globale (sans `hero_ids`) utilise un `min_unix_timestamp` trop ancien :

```
GET /v1/analytics/item-stats?min_unix_timestamp=1773203980
→ 500 Internal Server Error
```

Le timestamp `1773203980` correspondait à la date du dernier patch connu (~10 mars 2026), soit environ **79 jours** avant la date courante. La documentation de l'API indique un `min_unix_timestamp` par défaut de `1777075200` (~25 avril 2026, soit ~34 jours avant le 29 mai 2026), révélant ainsi la limite réelle de rétention des données globales.

### 3.2 Solution : `clampToGlobalWindow()`

Une constante `MAX_GLOBAL_WINDOW_DAYS = 28` est appliquée sur tous les appels URL via une méthode dédiée :

```typescript
private static readonly MAX_GLOBAL_WINDOW_DAYS = 28;

private clampToGlobalWindow(minTs: number, maxTs: number): { safeMin: number; safeMax: number } {
  const now = Math.floor(Date.now() / 1000);
  const windowSecs = MetaItemsPage.MAX_GLOBAL_WINDOW_DAYS * 86400;
  const safeMax = maxTs > 0 ? Math.min(maxTs, now) : now;
  const earliestAllowed = safeMax - windowSecs;
  const safeMin = Math.max(minTs > 0 ? minTs : earliestAllowed, earliestAllowed);
  return { safeMin, safeMax };
}
```

Cette méthode est appliquée dans `buildItemStatsUrl()` et `buildHeroStatsUrl()` **avant** toute construction de l'URL. Elle garantit que :
- `min_unix_timestamp` ne dépasse jamais 28 jours dans le passé
- `max_unix_timestamp` est toujours fourni (jamais open-ended), bornant explicitement la fenêtre

### 3.3 Filtrage des patches dans le dropdown

Pour éviter d'afficher des patches trop anciens que l'utilisateur ne pourrait pas sélectionner valablement, la liste des patches est filtrée côté UI :

```typescript
const windowCutoff = new Date(
  Date.now() - MetaItemsPage.MAX_GLOBAL_WINDOW_DAYS * 86400 * 1000
).toISOString().slice(0, 10);
const recentPatches = this.patchDays.filter(d => d >= windowCutoff).slice(-7).reverse();
```

Si aucun patch ne tombe dans la fenêtre des 28 jours, le dropdown affiche directement `Last 7 Days` comme option par défaut.

### 3.4 Résolution du sentinel `'latest'`

Au chargement, le sentinel `itemsPeriod = 'latest'` est résolu en cherchant le **patch le plus récent dans la fenêtre des 28 jours** :

```typescript
const recentPatch = [...this.patchDays].reverse().find(d => d >= windowCutoff);
this.itemsPeriod = recentPatch ? recentPatch as ItemsPeriod : '7d';
```

Si le dernier patch connu (`patchDays.at(-1)`) est plus vieux que 28 jours, le fallback `'7d'` évite un 500. Ce comportement diffère de `HeroDetails` où la résolution de `'latest'` utilise le dernier patch sans contrainte de fenêtre.

---

## 4. Endpoints API utilisés

### 4.1 `GET /v1/patches/big-days` — Dates de patch

```
https://api.deadlock-api.com/v1/patches/big-days
```

**Réponse** : `string[]` — tableau de dates ISO (`"2026-04-15"`, `"2026-05-10"`, …) triées chronologiquement.

**Cache module-level :** Stocké dans `_patchDaysCache: string[] | null` à l'échelle du module. Un seul fetch par session, partagé entre `MetaItemsPage` et potentiellement d'autres pages.

**Usage :**
- Alimenter le dropdown de sélection de patch (filtré sur 28 j)
- Calculer les timestamps `curStart`, `curEnd`, `refStart`, `refEnd` dans `getPeriodTimestamps()`

---

### 4.2 `GET /v1/assets/items` — Catalogue des items

```
https://api.deadlock-api.com/v1/assets/items
```

**Cache module-level partagé avec `HeroDetails`** : les variables `_itemsCache` et `_itemsFetch` sont déclarées à l'échelle du module (pas de la classe), ce qui signifie que naviguer de la page Heroes à la page Items **n'entraîne aucun re-fetch** du catalogue.

**Champs utilisés :**

| Champ | Usage |
|-------|-------|
| `id` | Clé du `Map<number, ItemData>` — jointure avec `ApiItemStat.item_id` |
| `name` | Nom affiché dans la colonne Item |
| `item_slot_type` | `'weapon' \| 'spirit' \| 'vitality'` — couleur de bordure, strip bas |
| `item_tier` | `1 \| 2 \| 3 \| 4` — badge I/II/III/IV + filtre côté client |
| `cost` | Prix en souls — colonne Cost |
| `shop_image_webp` | Icône principale (fallback chain → `shop_image_small_webp → shop_image → image_webp → image`) |

**Chaîne de fallback des icônes (même logique que HeroDetails) :**
```
shop_image_webp → shop_image_small_webp → shop_image → shop_image_small → image_webp → image
```

---

### 4.3 `GET /v1/analytics/item-stats` — Statistiques d'items

```
GET /v1/analytics/item-stats
  ?min_unix_timestamp={epoch_28j_max}
  &max_unix_timestamp={epoch}
  [&min_average_badge={n}]
  [&max_average_badge={n}]
```

**Spécificité globale :** Aucun paramètre `hero_ids` — l'API agrège les données sur **tous les héros** simultanément. C'est la différence centrale avec l'appel de `HeroDetails`.

**Réponse** : `ApiItemStat[]`

```typescript
interface ApiItemStat {
  item_id: number;
  wins: number;
  losses: number;
  matches: number;   // nombre de fois où l'item a été acheté en match
  players: number;
  // + champs de timing (buy/sell) non utilisés ici
}
```

**Double appel** : l'endpoint est appelé deux fois en parallèle — une fois pour la **période courante** (`curStart` → `curEnd`) et une fois pour la **période de référence** (`refStart` → `refEnd`). Le delta entre les deux permet d'afficher les colonnes `WR Change` et `Usage Change`.

---

### 4.4 `GET /v1/analytics/hero-stats` — Total de matchs (dénominateur d'usage)

```
GET /v1/analytics/hero-stats
  ?min_unix_timestamp={epoch_28j_max}
  &max_unix_timestamp={epoch}
  [&min_average_badge={n}]
  [&max_average_badge={n}]
```

**Rôle** : fournir le dénominateur pour le calcul du taux d'usage des items.

**Réponse** : `AnalyticsHeroStat[]` — une entrée par héros avec son nombre de `matches`.

**Calcul du dénominateur :**
```typescript
this.totalMatchesCur = heroStatsCur
  .reduce((acc, s) => acc + s.matches, 0);
```

En sommant les `matches` de **tous** les héros, on obtient le nombre total de slots joueurs pour la période, ce qui constitue le dénominateur correct pour calculer l'usage global d'un item.

Également appelé deux fois (période courante et référence) pour calculer `usageChange`.

---

## 5. Calcul des lignes du tableau (`computeItemRows`)

### 5.1 Taux d'usage global

```typescript
const usagePct = totalMatchesCur > 0
  ? (cur.matches / totalMatchesCur) * 100
  : 0;
```

Contrairement à l'onglet HeroDetails où `usagePct = item.matches / heroMatches`, ici le dénominateur est la **somme de tous les matchs de tous les héros**. Cela traduit : « sur l'ensemble des parties jouées, dans quel pourcentage un joueur a-t-il acheté cet item ? »

### 5.2 Taux de victoire

```typescript
const winRate = cur.matches > 0 ? (cur.wins / cur.matches) * 100 : 0;
```

Identique à HeroDetails : `wins / matches` de la période courante.

### 5.3 Deltas (colonnes Change)

```typescript
winRateChange: ref ? winRate - refWinRate : 0,
usageChange:   ref ? usagePct - refUsagePct : 0,
```

Les deltas comparent la période courante à la période immédiatement précédente. Ils sont à **0** si l'item n'avait pas de données dans la période de référence (item nouveau ou trop rare).

**Code couleur des deltas :**

| Valeur | Classe CSS | Couleur |
|--------|-----------|---------|
| `≥ +5` | `text-emerald-500 font-semibold` | Vert vif (amélioration notable) |
| `> 0` | `text-green-400` | Vert (légère amélioration) |
| `0` | `text-grey-500` | Gris / `—` |
| `> -5` | `text-orange-400` | Orange (légère régression) |
| `≤ -5` | `text-red-600 font-bold` | Rouge gras (régression notable) |

### 5.4 Filtre par tier (côté client)

```typescript
const tier = item.item_tier ?? 0;
if (tier > 0 && !this.itemsTiers.has(tier)) continue;
```

Les items avec `item_tier = 0` (abilities, items non-achetables) sont **toujours exclus** de l'affichage (`!item?.item_slot_type` coupe en premier). Seuls les items des tiers 1–4 avec un `item_slot_type` valide apparaissent dans le tableau.

---

## 6. Système de filtres

### 6.1 Période (`itemsPeriod`)

| Type | Valeurs | Comportement |
|------|---------|--------------|
| Sentinel initial | `'latest'` | Résolu en patch récent (≤ 28 j) ou `'7d'` si aucun |
| Patch spécifique | `"2026-05-10"` | `curStart` = timestamp de la date, `curEnd` = timestamp du patch suivant |
| Relatif | `'7d'`, `'14d'`, `'30d'`, `'90d'` | Fenêtre relative depuis `now`, toujours bornée par `clampToGlobalWindow` |

**Décision — `curEnd` jamais à 0 pour les patches :** Contrairement à HeroDetails qui laisse `curEnd = 0` (open-ended) pour le patch le plus récent, la page globale force toujours `max_unix_timestamp`. Une requête open-ended sur l'ensemble des héros serait prohibitivement large.

### 6.2 Rang (`itemsRank`)

Trois modes :

| Mode | Paramètres URL | Signification |
|------|---------------|---------------|
| `all` | _(aucun)_ | Tous les rangs |
| `exact` | `min_average_badge` + `max_average_badge` | Tier exact uniquement |
| `plus` | `min_average_badge` uniquement | Ce tier et tous les rangs supérieurs |

Le tableau `RANKS` dans `src/lib/constants/ranks.ts` définit les `badgeMin` et `badgeMax` de chaque tier (badge = tier × 10 + sous-tier). Ce filtre **déclenche un re-fetch** car il modifie les paramètres URL.

### 6.3 Tiers d'items (`itemsTiers`)

Filtre **côté client uniquement** — les boutons T1/T2/T3/T4 modifient le `Set<number>` et appellent `renderPage()` sans aucune requête réseau. Les données sont déjà chargées ; seul le calcul de `computeItemRows()` est rejoué.

**Décision** : ne pas refetcher pour les tiers évite une requête réseau pour une opération de filtrage purement locale.

### 6.4 Bouton Refresh — réinitialisation complète

Le bouton Refresh a un comportement **différent** de celui de l'onglet Items de HeroDetails :

| Page | Comportement du Refresh |
|------|------------------------|
| HeroDetails Items tab | Re-fetch avec les filtres courants |
| MetaItemsPage | **Réinitialise tous les filtres** aux valeurs par défaut, puis re-fetch |

```typescript
this.container?.querySelector<HTMLButtonElement>('#gi-refresh-btn')
  ?.addEventListener('click', () => {
    if (!this.isFiltered()) return;
    this.resetFilters();   // ← remet période, rang, tiers, sort à leurs défauts
    this.loaded = false;
    this.currentStats = [];
    this.refStats = [];
    this.fetchAll();
  });
```

**Activation du bouton** : désactivé (`disabled` + `opacity-50`) tant que tous les filtres correspondent à leurs valeurs par défaut (latest patch dans la fenêtre, all ranks, T1+T2+T3+T4).

---

## 7. Tri bidirectionnel du tableau

### 7.1 Colonnes triables

| Colonne | Clé de tri | Tri par défaut |
|---------|------------|---------------|
| Item | `name` (alphabétique) | — |
| Cost | `cost` (numérique) | — |
| Win Rate | `winRate` | — |
| WR Change | `winRateChange` | — |
| **Usage** | `usage` | **Décroissant (défaut)** |
| Usage Change | `usageChange` | — |
| Win / Loss | `winloss` (`wins`) | — |

### 7.2 Logique de bascule

```typescript
// Clic sur la colonne active → inverse la direction
if (this.itemsSortCol === col) {
  this.itemsSortDir = this.itemsSortDir === 'desc' ? 'asc' : 'desc';
} else {
  // Nouvelle colonne → toujours commencer en décroissant
  this.itemsSortCol = col;
  this.itemsSortDir = 'desc';
}
this.renderPage(); // re-render côté client uniquement, pas de re-fetch
```

**Indicateur visuel :** La flèche dans l'en-tête de colonne change selon la direction :
- `↓` = décroissant
- `↑` = croissant
- `↕` = colonne inactive (triable)

Le tri est **côté client** — le tableau déjà chargé est trié par `computeItemRows()` et la page est re-rendue via `renderPage()` sans appel réseau.

---

## 8. Calcul des fenêtres temporelles (`getPeriodTimestamps`)

### 8.1 Périodes relatives

```typescript
const d = RELATIVE[this.itemsPeriod] * day;
return { curStart: now - d, curEnd: now, refStart: now - 2*d, refEnd: now - d };
```

La fenêtre de référence est une **fenêtre miroir** de même longueur juste avant la fenêtre courante. Pour `'7d'` : courante = [now-7j, now], référence = [now-14j, now-7j].

### 8.2 Patches spécifiques

```
Patches:   […] [ P_prev ]  [ P_target ]  [ P_next ]  […]
                   ↑             ↑             ↑
               refStart       curStart      curEnd
               (=refEnd)
```

Le delta de changement compare donc **le patch sélectionné au patch précédent** plutôt qu'à une fenêtre calendaire fixe — comparaison apples-to-apples entre deux périodes de jeu équivalentes.

### 8.3 Application de `clampToGlobalWindow` en dernier

`getPeriodTimestamps()` retourne des timestamps bruts qui **peuvent** dépasser la fenêtre de 28 jours. L'application du `clamp` se fait uniquement au niveau de `buildItemStatsUrl` et `buildHeroStatsUrl`. Cette séparation des responsabilités permet de conserver une logique de calcul de fenêtre lisible et de centraliser la contrainte API dans les builders d'URL.

---

## 9. Architecture du composant

### 9.1 État interne

```typescript
// Filtres
private itemsPeriod: ItemsPeriod     // période sélectionnée
private itemsRank: ItemsRankFilter   // filtre de rang { mode, tier }
private itemsTiers: Set<number>      // tiers d'items visibles (1–4)
private itemsSortCol: ItemsSortCol   // colonne de tri active
private itemsSortDir: ItemsSortDir   // 'asc' | 'desc'

// Données
private items: Map<number, ItemData>   // catalogue complet (partagé)
private currentStats: ApiItemStat[]    // stats période courante
private refStats: ApiItemStat[]        // stats période référence
private totalMatchesCur: number        // somme matchs tous héros (cur)
private totalMatchesRef: number        // somme matchs tous héros (ref)
private patchDays: string[]            // dates de patches disponibles

// États de cycle de vie
private loading: boolean
private loaded: boolean
private error: boolean
```

### 9.2 Cycle de render

```
mount() → resetFilters() → renderSkeleton() → fetchAll()
                                                    │
                          ┌─────────────────────────┤ loading = true
                          │  renderPage()            │ (table skeleton)
                          │                          ▼
                          │   [fetch parallèle API]
                          │                          │
                          └──────────────── loading = false
                                                    │
                                           renderPage()
                                           (table réelle)
                                           bindEvents()
```

Contrairement à un pattern « render puis bind séparément », `bindEvents()` est appelé à la fin de chaque `renderPage()`. Cela est nécessaire car chaque appel à `renderPage()` remplace l'intégralité du `innerHTML` du container, détruisant les anciens listeners DOM.

### 9.3 Re-renders sans re-fetch

Les actions qui ne déclenchent **pas** de requête réseau (tri de colonne, toggle de tier) appellent directement `renderPage()` → `computeItemRows()` → re-render du DOM. Les données déjà en mémoire (`currentStats`, `refStats`, `items`) suffisent.

Les actions qui **déclenchent** un re-fetch (changement de période, changement de rang) remettent `loaded = false`, vident `currentStats` et `refStats`, puis appellent `fetchAll()` qui affichera le skeleton pendant le chargement.

---

## 10. Résumé des décisions clés

| Décision | Alternative écartée | Raison du choix |
|----------|--------------------|-----------------| 
| `clampToGlobalWindow` à 28 jours | Laisser l'utilisateur choisir librement | L'API retourne HTTP 500 pour les timestamps > 28 j sans `hero_ids` |
| `max_unix_timestamp` toujours fourni | Open-ended (`curEnd = 0`) | Évite les requêtes non bornées sur l'ensemble des héros |
| Filtrage des patches dans le dropdown | Afficher tous les patches connus | Evite d'exposer des options qui causeraient un 500 |
| Fallback `'7d'` si aucun patch récent | Afficher une erreur | L'utilisateur voit des données plutôt qu'un état cassé |
| Dénominateur = somme de tous les héros | Dénominateur fixe ou par item | Reflète correctement la popularité globale d'un item en proportion des parties jouées |
| Refresh = réinitialisation complète | Re-fetch avec filtres courants | Cohérent avec l'usage attendu : « remettre à zéro » les filtres |
| Tiers = filtre client (sans re-fetch) | Appel API par tier | Les données sont déjà en mémoire ; pas de gain à refetcher |
| Cache module-level partagé pour `/v1/assets/items` | Cache par instance de classe | Survivre aux navigations entre Pages Heroes et Items sans re-télécharger 400 KB |
| Tri client-side seulement | Tri via paramètre API | L'API `item-stats` ne propose pas de tri ; toute la logique doit être client |
| `MAX_GLOBAL_WINDOW_DAYS` comme constante statique | Valeur hardcodée | Modifiable en un seul endroit si l'API étend sa rétention de données |
