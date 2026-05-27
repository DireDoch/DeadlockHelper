# Hero Details — Endpoints, Items & Builds

Ce document décrit l'architecture de la page Hero Details : quels endpoints sont appelés, dans quel ordre, pourquoi, et les particularités importantes du modèle de données items/builds de l'API Deadlock.

---

## 1. Vue d'ensemble du pipeline de données

```
HeroDetailsPage.mountWithHero(hero)
        │
        ▼
fetchAll() — 5 requêtes en parallèle (Promise.all)
        │
        ├─ /v1/builds                        → 3 builds les plus favoris cette semaine
        ├─ /v1/analytics/hero-build-stats    → WR + nombre de matchs par build_id
        ├─ /v1/assets/items                  → TOUS les items du jeu (cache module-level)
        ├─ /v1/assets/items/by-hero-id/{id}  → Abilities signature du héros
        └─ /v1/analytics/ability-order-stats → Séquences d'upgrade les plus jouées
```

Tout est chargé en une seule vague parallèle au montage. Aucune requête séquentielle — le skeleton loader s'affiche pendant ce temps.

---

## 2. Endpoints détaillés

### 2.1 `/v1/builds` — Builds communautaires

```
GET /v1/builds
  ?hero_id={id}
  &sort_by=weekly_favorites
  &limit=3
  &only_latest=true
  &build_language=English
```

**Ce que ça retourne :** Les 3 builds publiés par la communauté les plus favorisés cette semaine pour le héros ciblé, en anglais uniquement.

**Champs utilisés :**

| Champ | Usage |
|-------|-------|
| `hero_build.hero_build_id` | Clé de jointure avec l'endpoint analytics |
| `hero_build.name` | Nom affiché dans le sélecteur de build |
| `hero_build.details.mod_categories[]` | Catégories d'items (Early, Mid, Late, etc.) |
| `hero_build.details.mod_categories[].mods[].ability_id` | ID d'un item dans le shop |
| `hero_build.details.ability_order.currency_changes[].ability_id` | ID d'une ability dans l'ordre d'unlock |
| `num_weekly_favorites` | Nombre de favoris cette semaine — détermine le build « Rec » |

**Décision `build_language=English` :** Sans ce filtre, l'API retourne les builds les plus favoris toutes régions confondues, ce qui inclut des builds en chinois, coréen, etc. Le filtre `English` cible les builds NA/EU, plus représentatifs pour un public occidental.

**Décision `only_latest=true` :** Exclut les anciennes versions d'un même build (un auteur peut republier plusieurs fois). Seule la version la plus récente de chaque build est conservée.

---

### 2.2 `/v1/analytics/hero-build-stats/{hero_id}` — Statistiques par build

```
GET /v1/analytics/hero-build-stats/{hero_id}
```

**Ce que ça retourne :** Pour chaque `hero_build_id` détecté en match (analyse de démos), le nombre de victoires, défaites, matchs totaux et joueurs uniques.

**Champs utilisés :**

| Champ | Usage |
|-------|-------|
| `hero_build_id` | Clé de jointure avec les builds communautaires |
| `wins` / `matches` | Calcul du win rate affiché |
| `matches` | Nombre de matchs affiché sous le WR |

**Limitation importante :** Cet endpoint ne couvre que les builds qui ont été activement utilisés en match **analysé par démo**. Un build populaire sur le site (beaucoup de `num_weekly_favorites`) peut ne pas apparaître ici s'il est trop récent ou si les démos n'ont pas encore été analysées. C'est pourquoi le build « Recommandé » est basé sur `num_weekly_favorites` et non sur ce endpoint.

**Note sur `hero_build_id` :** L'ID représente le **premier build sélectionné par le joueur au début du match**. Si le joueur change de build en cours de partie, ça ne se reflète pas dans les stats.

---

### 2.3 `/v1/assets/items` — Catalogue complet des items

```
GET /v1/assets/items
```

**Ce que ça retourne :** Tous les items achetables du shop, les abilities de héros, et les upgrades. Environ 300–400 entrées.

**Cache module-level :** Ce fetch est partagé entre toutes les navigations héros via `_itemsCache` et `_itemsFetch`. La première navigation charge la liste une fois ; toutes les navigations suivantes utilisent le cache en mémoire sans refetch.

**Champs utilisés :**

| Champ | Type | Usage |
|-------|------|-------|
| `id` | `number` | Clé du Map — résout `ability_id` des builds |
| `name` | `string` | Nom affiché dans les listes et tooltips |
| `item_slot_type` | `'weapon' \| 'spirit' \| 'vitality'` | Catégorie de dégâts — détermine la couleur et le Damage Split |
| `item_tier` | `1 \| 2 \| 3 \| 4` | Tier de l'item — affiché comme badge I/II/III/IV |
| `cost` | `number` | Prix en souls — affiché sous l'icône et dans le tooltip |
| `shop_image_webp` | `string` | Icône principale (shop thumbnail) |
| `shop_image_small_webp` | `string` | Fallback 1 |
| `shop_image` | `string` | Fallback 2 |
| `image_webp` | `string` | Fallback pour les abilities héros (pas de shop image) |
| `description.desc` | `string` | Texte du tooltip (priorité 1) |
| `description.active` | `string` | Texte du tooltip si pas de `desc` (item actif) |
| `description.passive` | `string` | Texte du tooltip si pas de `desc` ni `active` |
| `tooltip_sections[].section_attributes[].important_properties` | `string[]` | Noms des stats à afficher dans le tooltip |
| `properties[statName].label/value/prefix/postfix` | — | Valeurs formatées des stats |

**Chaîne de fallback des icônes (ordre de priorité) :**
```
shop_image_webp → shop_image_small_webp → shop_image → shop_image_small → image_webp → image
```
Les shop thumbnails sont préférés car ils correspondent aux icônes du shop in-game. Les abilities héros n'ont pas de `shop_image_*`, donc elles tombent sur `image_webp`.

---

### 2.4 `/v1/assets/items/by-hero-id/{id}` — Abilities du héros

```
GET /v1/assets/items/by-hero-id/{hero_id}
```

**Ce que ça retourne :** La liste des abilities propres au héros, dans l'ordre de la roue d'abilities in-game. Inclut les abilities normales, l'ultimate, ET des entrées parasites.

**Entrées parasites à filtrer :**

| Type | Exemple | Identifiant |
|------|---------|-------------|
| Melee universel | `{ name: "Melee" }` | `name === 'Melee'` |
| Class name brut (slide héros-spécifique) | `{ name: "ability_hero_slide" }` | `name.includes('_')` |

Après filtrage, `.slice(0, 4)` garde les 4 vraies abilities signature. Si une ability n'apparaît dans aucune séquence d'upgrade analytique, sa rangée dans le Skill Path reste visible mais vide — l'API retourne toujours 4 abilities réelles par héros.

**Champs utilisés :**

| Champ | Usage |
|-------|-------|
| `id` | Clé pour résoudre les `ability_id` des séquences d'upgrade |
| `name` | Affiché dans les tooltips et utilisé pour le filtre |
| `image_webp` / `image` | Icône de l'ability dans Skill Path et Unlock Order |

---

### 2.5 `/v1/analytics/ability-order-stats` — Séquences d'upgrade

```
GET /v1/analytics/ability-order-stats
  ?hero_id={id}
  &min_matches=200
```

**Ce que ça retourne :** Les séquences d'upgrade d'abilities les plus jouées, filtrées sur les séquences avec au moins 200 matchs (évite les outliers statistiquement non représentatifs).

**Top 5 par match count :** Les résultats sont triés par `matches` décroissant et limités aux 5 premières variations. Chaque variation représente un profil de joueur différent (aggressif, défensif, utility-first, etc.).

**Champs utilisés :**

| Champ | Usage |
|-------|-------|
| `abilities[]` | Séquence ordonnée des `ability_id` upgradés (step 1, 2, 3…) |
| `wins` / `matches` | Win rate de la variation |
| `matches` | Nombre de parties jouées avec cette séquence |

**Grille Skill Path :** Chaque ligne = 1 ability. Chaque colonne = 1 step. Une cellule est remplie (icône `ability-learn`) si l'ability de cette ligne est celle upgradée à ce step.

---

## 3. Modèle des items — Points importants

### 3.1 Système de types (`item_slot_type`)

Les items sont divisés en 3 catégories correspondant aux 3 colonnes du shop in-game :

| `item_slot_type` | Couleur | Signification |
|-----------------|---------|---------------|
| `weapon` | Orange `#f97316` | Dégâts par balle, cadence, rechargement |
| `spirit` | Violet `#a855f7` | Puissance des abilities, cooldown, tech power |
| `vitality` | Vert `#22c55e` | Vie, régénération, résistances, mobilité |

Ces couleurs sont utilisées de façon cohérente dans toute l'interface : bordure des icônes, strip bas des icônes, badge de tier, header de catégorie, et barre Damage Split.

### 3.2 Tiers d'items (`item_tier`)

Les 4 tiers correspondent aux tranches de prix :

| Tier | Prix typique | Badge |
|------|-------------|-------|
| 1 | 500 souls | `I` |
| 2 | 1 250 souls | `II` |
| 3 | 3 000 souls | `III` |
| 4 | 6 200 souls | `IV` |

La valeur `item_tier = 0` est ignorée (pas de badge affiché). Le badge est positionné en haut à droite de l'icône avec la couleur du `item_slot_type` comme fond.

### 3.3 Damage Split — calcul

Le Damage Split d'un build est calculé en comptant les items par `item_slot_type` dans toutes les catégories (`mod_categories`) :

```typescript
let wep = 0, spr = 0, vit = 0;
mods.forEach(mod => {
  const item = items.get(mod.ability_id);
  if (item?.item_slot_type === 'weapon')   wep++;
  if (item?.item_slot_type === 'spirit')   spr++;
  if (item?.item_slot_type === 'vitality') vit++;
});
const total = wep + spr + vit || 1;
```

**Limitation :** Certains items (`item_slot_type` absent ou autre valeur) ne sont pas comptabilisés. La barre représente donc la répartition relative des items typés, pas 100% de tous les items du build.

### 3.4 `ability_id` dans les builds = ID d'un item du catalogue

Dans le contexte des builds (`mod_categories[].mods[].ability_id`), le nom du champ est trompeur : malgré le suffixe `_id`, il s'agit bien d'un **ID d'item du shop** (upgrades achetables), pas d'une ability de héros. La résolution se fait via le Map chargé par `/v1/assets/items`.

Dans le contexte des `ability_order.currency_changes[].ability_id`, c'est effectivement un **ID d'ability de héros**, résolu via les données de `/v1/assets/items/by-hero-id/{id}`.

---

## 4. Décisions techniques

### 4.1 Cache module-level pour les items

`/v1/assets/items` retourne ~300 items et fait environ 200–400 KB. Ce catalogue ne change pas entre les navigations dans une même session. Le cache est maintenu dans deux variables module-level :

```typescript
let _itemsCache: Map<number, ItemData> | null = null;
let _itemsFetch: Promise<Map<number, ItemData>> | null = null;
```

Le pattern avec `_itemsFetch` évite les **double-fetch** : si deux héros sont ouverts rapidement en parallèle, le second attend la même promesse au lieu de lancer un deuxième fetch réseau.

### 4.2 Pourquoi `num_weekly_favorites` pour le « Recommandé »

L'endpoint analytics (`hero-build-stats`) ne couvre que les builds effectivement utilisés en match analysé. Des builds très récents ou très populaires peuvent avoir un `hero_build_id` sans correspondance dans les stats. Utiliser `num_weekly_favorites` comme critère de recommandation est plus robuste car ce champ est directement sur l'objet build retourné par `/v1/builds`.

### 4.3 Filtrage des abilities parasites

L'endpoint `by-hero-id` retourne systématiquement :
- Une entry `"Melee"` (le punch universel partagé par tous les héros)
- Parfois des abilities de mobilité héros-spécifiques dont le `name` est encore un class name interne (contient `_`)

Ces deux règles de filtrage sont robustes et n'ont pas besoin de maintenir une liste d'IDs hardcodés.
