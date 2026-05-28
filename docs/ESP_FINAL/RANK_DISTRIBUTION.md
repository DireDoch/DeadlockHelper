# Rank Distribution — Architecture, Logique de données et Choix techniques

Ce document décrit les décisions de conception et d'implémentation de la page Rank Distribution : flux de données depuis l'API Deadlock, rendu du graphique SVG sans bibliothèque externe, gestion des images de badge, tooltip interactif, et architecture du tableau hiérarchique.

---

## 1. Vue d'ensemble

La page Rank Distribution affiche deux sections complémentaires :

1. **Graphique en barres SVG** — 66 barres (11 rangs × 6 sous-rangs) montrant le volume de matchs joués à chaque niveau de badge Deadlock pour une période choisie.
2. **Tableau hiérarchique** — liste de tous les rangs et sous-rangs avec leur volume exact, pourcentage global, et un tooltip interactif détaillé au survol.

```
mount()
   │
   ├─ renderSkeleton()         ← affichage immédiat des placeholders animate-pulse
   │
   └─ fetchAndRender()         ← fetch parallèle
         │
         ├─ GET /v1/assets/ranks          → images de badge (tier + sous-rang)
         │
         └─ GET /v1/analytics/badge-distribution
               ?game_mode=normal
               [&min_unix_timestamp=…]    → volumes de matchs par badge_level
               │
               ▼
         mapDistribution()     ← filtre, mappe badge_level → (tier, sous-rang)
         normalizeTo66()       ← complète les entrées manquantes avec matchCount=0
               │
               ▼
         renderFull(data)      ← SVG chart + tableau + wireTooltips()
```

---

## 2. Encodage des badge_level et décodage (tier, sous-rang)

### 2.1 Schéma officiel de l'API

L'API Deadlock représente chaque niveau de badge via un entier `badge_level` :

```
tier    = Math.floor(badge_level / 10)   // 1 = Initiate … 11 = Eternus
subrank = badge_level % 10               // 1 = I … 6 = VI
```

| badge_level | Tier | Sous-rang | Rang affiché |
|-------------|------|-----------|--------------|
| 11 | 1 – Initiate | I | Initiate I |
| 16 | 1 – Initiate | VI | Initiate VI |
| 71 | 7 – Archon | I | Archon I |
| 116 | 11 – Eternus | VI | Eternus VI |

Les valeurs `subrank = 0` (ex. badge_level 10, 20…) représentent des états transitoires ou non classés et sont **filtrées** lors du traitement (`subrank < 1 || subrank > 6 → ignoré`).

### 2.2 Décision : filtrer sur subranks 1–6 uniquement

Parmi les valeurs `badge_level % 10`, seules 1 à 6 correspondent à des sous-rangs affichables. La valeur 0 et les valeurs 7–9 (réservées ou inexistantes dans le jeu) sont écartées pour garder exactement **66 barres** dans le graphique (11 × 6).

---

## 3. Endpoints API utilisés

### 3.1 `GET /v1/analytics/badge-distribution`

```
https://api.deadlock-api.com/v1/analytics/badge-distribution
  ?game_mode=normal
  [&min_unix_timestamp={epoch}]
  [&max_unix_timestamp={epoch}]
```

**Réponse** : `BadgeDistributionEntry[]`
```typescript
interface BadgeDistributionEntry {
  badge_level: number;    // entier selon l'encodage tier×10+subrank
  total_matches: number;  // volume de matchs joués à ce niveau
}
```

La **période** est traduite en timestamps Unix au moment de chaque appel :

```typescript
function periodToTimestamps(period: Period): { min?: number; max?: number } {
  const now = Math.floor(Date.now() / 1000);
  if (period === '24h') return { min: now - 86_400, max: now };
  if (period === '7d')  return { min: now - 7  * 86_400, max: now };
  if (period === '30d') return { min: now - 30 * 86_400, max: now };
  return {}; // 'All' → pas de filtre temporel
}
```

Chaque changement de filtre déclenche un **nouvel appel réseau** (pas de cache local) pour garantir des données fraîches.

### 3.2 `GET /v1/assets/ranks`

```
https://api.deadlock-api.com/v1/assets/ranks
```

**Réponse** : `Rank[]` → schema `RankImages` contenant des champs dédiés par sous-rang :

```typescript
interface RankAsset {
  tier: number;
  name: string;
  images: {
    small?: string;           // icône du rang principal
    small_webp?: string;
    small_subrank1?: string;  // icône spécifique Sous-rang I
    small_subrank1_webp?: string;
    // … jusqu'à small_subrank6_webp
    [key: string]: string | undefined;
  };
  color?: string;
}
```

**Décision** : cet appel est effectué **une seule fois** au chargement initial de la page (`fetchAndRender()`). Les images de badge sont stockées dans `this.rankAssets: Map<number, RankAsset>` et réutilisées lors des changements de période sans nouveau fetch.

---

## 4. Images de badge — Stratégie de priorité

Deux sources d'images coexistent avec des rôles distincts :

| Utilisation | Source principale | Fallback |
|-------------|-------------------|---------|
| **Icône du rang principal** (graphique X, tableau parent) | PNG local `src/assets/icons/RankBadge/*.png` importé via Vite (`?url`) | — (toujours disponible) |
| **Icône du sous-rang** (tableau grille) | `images.small_subrank{N}_webp` depuis l'API | `images.small_webp` puis PNG local du tier |

### 4.1 Pourquoi des PNG locaux pour les rangs principaux

Les images locales (`Initiator.png`, `Seekers.png`, …) sont importées avec l'annotation Vite `?url` :

```typescript
import initiatorBadge from '../../../assets/icons/RankBadge/Initiator.png?url';
```

Vite résout ces chemins au build et génère des URLs hashées (`/assets/Initiator-abc123.png`) garantissant un chargement instantané, sans aucun appel réseau. C'est le mécanisme utilisé partout dans le projet pour les assets statiques (cf. `HeroDetails.ts` pour `ability-learn.png`).

**Conséquence** : même si l'API `GET /v1/assets/ranks` échoue, les barres du graphique et les lignes parentes du tableau affichent toujours l'image correcte.

### 4.2 Résolution de l'image de sous-rang

```typescript
const imgUrl =
  asset?.images?.[`small_subrank${subrank}_webp`] ??
  asset?.images?.[`small_subrank${subrank}`] ??
  asset?.images?.small_webp ??
  asset?.images?.small ??
  '';
```

L'accès dynamique par clé (`images[`small_subrank${N}_webp`]`) est légal car `RankAsset.images` déclare `[key: string]: string | undefined` en plus des champs explicites.

---

## 5. Rendu du graphique — SVG natif sans bibliothèque

### 5.1 Décision : pas de Chart.js ni Recharts

L'ensemble du graphique est rendu via un `<svg>` généré en TypeScript pur, injecté dans un `innerHTML`. Cette approche :

- Évite d'ajouter une dépendance externe (Recharts nécessite React ; Chart.js implique un `<canvas>`).
- Donne un contrôle total sur les positions, les groupements de barres, et les lignes de repère.
- Reste cohérente avec le pattern `innerHTML` utilisé sur toutes les pages du projet.

### 5.2 Système de coordonnées fixe avec scaling horizontal

```typescript
const VW = 1100, VH = 490;         // espace de coordonnées du viewBox
const ML = 78, MT = 22, MB = 150, MR = 15; // marges

// L'axe Y est inversé en SVG : y=0 est en haut
const yOf = (v: number) => cBot - (v / maxVal) * cH;
```

Le SVG utilise `width="100%" height="490" viewBox="0 0 1100 490" preserveAspectRatio="none"`. L'attribut `none` permet au graphique de remplir exactement la largeur du conteneur ; les hauteurs des barres restent proportionnelles et visuellement correctes puisque seule la dimension horizontale est étirée.

### 5.3 Calcul de la disposition des barres

```
gW (largeur d'un groupe de tier) = (largeur totale − 10 × GROUP_GAP) / 11
bW (largeur d'une barre)         = (gW − 5 × BAR_GAP) / 6

GROUP_GAP = 12px  (séparation entre tiers)
BAR_GAP   = 2px   (séparation entre sous-rangs dans un même tier)
```

Résultat : ~12 px par barre pour une fenêtre Electron standard (~1100 px de contenu).

### 5.4 Lignes de repère horizontales dynamiques (`niceGridStep`)

Le pas de la grille s'adapte automatiquement à la période sélectionnée pour maintenir 4–7 lignes visibles :

```typescript
function niceGridStep(max: number): number {
  if (max <=  20_000) return  5_000;   // 24h et 7d
  if (max <=  60_000) return 10_000;   // 30d
  if (max <= 200_000) return 25_000;
  return 50_000;                        // All
}
```

**Décision** : un pas fixe de 5 000 convient pour la période 7 jours (max ~18 000) mais produirait 80+ lignes pour la période « All » (max ~400 000). Le pas dynamique évite ce problème sans configuration manuelle.

### 5.5 Lignes Min et Max

Deux lignes pointillées supplémentaires identifient les bornes exactes de la distribution :

| Ligne | Couleur | Signification |
|-------|---------|---------------|
| **Max** | `#5AFFC3` (mint) | Sous-rang avec le plus grand nombre de matchs |
| **Min** | `#EFD970` (ambre) | Sous-rang avec le moins de matchs (parmi ceux > 0) |

Ces couleurs correspondent aux CSS custom properties `--rank-color-11` (Eternus, mint) et `--rank-color-10` (Ascendant, ambre), créant une cohérence visuelle involontaire mais agréable avec la palette officielle.

---

## 6. Normalisation à 66 entrées (`normalizeTo66`)

L'API ne renvoie pas toujours les 66 combinaisons (tier, sous-rang). Pour garantir que le graphique affiche toujours 66 barres dans le bon ordre :

```typescript
private normalizeTo66(data: RankData[]): RankData[] {
  const byKey = new Map(data.map(d => [`${d.tier}-${d.subRank}`, d]));
  const result: RankData[] = [];
  for (const rank of RANKS) {             // tiers 1–11, dans l'ordre
    for (let sr = 1; sr <= 6; sr++) {     // sous-rangs I–VI
      result.push(byKey.get(`${rank.tier}-${sr}`) ?? {
        matchCount: 0,                    // barre de hauteur nulle
        // autres champs…
      });
    }
  }
  return result;
}
```

Les sous-rangs absents de la réponse API apparaissent comme des barres invisibles (hauteur 0) plutôt que d'être ignorés, ce qui préserve l'alignement visuel de tous les groupes.

---

## 7. Tooltip interactif — Event Delegation + AbortController

### 7.1 Problème avec les listeners par élément

L'approche naïve (un `addEventListener` par cellule `.rd-sr-cell`) présentait deux défauts :

1. **Stacking** : chaque appel à `wireTooltips()` (changement de période) ajoutait de nouveaux listeners sur les anciens éléments, sans retirer les précédents.
2. **Listeners orphelins** : après `innerHTML` remplacé par la mise à jour de période, les éléments précédents étaient supprimés du DOM mais leurs listeners restaient référencés.

### 7.2 Solution : délégation d'événements sur le conteneur

Un seul triplet de listeners est posé sur `#rd-list-wrapper`. La cible effective est déterminée au moment de chaque événement via `closest()` :

```typescript
lw.addEventListener('mouseover', (e) => {
  const cell = (e.target as HTMLElement)
    .closest<HTMLElement>('.rd-sr-cell, .rd-tier-row');
  // cell est null si le survol est hors d'une ligne cible
  if (cell === activeCell) return; // même cellule, rien à faire
  activeCell = cell ?? null;
  if (!cell) { tt.style.display = 'none'; return; }
  buildTooltip(cell);
  tt.style.display = 'block';
}, { signal });
```

**Avantage** : les éléments créés par un re-render de période (remplacement de `lw.innerHTML`) sont automatiquement couverts sans re-câblage, car le listener est sur le conteneur parent qui, lui, n'est pas remplacé.

### 7.3 AbortController pour éviter le stacking

```typescript
// Dans wireTooltips() :
this.tooltipController?.abort(); // supprime proprement l'ancien triplet
this.tooltipController = new AbortController();
const { signal } = this.tooltipController;
lw.addEventListener('mouseover', handler, { signal }); // lié au signal
```

`AbortController` est la technique recommandée pour retirer plusieurs listeners d'un coup sans stocker les références aux fonctions. Ici, chaque appel à `wireTooltips()` annule les listeners du cycle précédent avant d'en créer de nouveaux.

### 7.4 Données affichées dans le tooltip

Pour chaque ligne (rang principal ou sous-rang), le tooltip affiche :

| Champ | Source | Calcul |
|-------|--------|--------|
| **Nom** | `data-name` | ex. `"Archon IV"` |
| **Matches (Period X)** | `data-count` | `total_matches` de l'API |
| **Percentage** | `data-pct` | `matchCount / totalAll × 100` (2 décimales) |
| **From … to …** | `data-from` / `data-to` | Bande percentile cumulée (voir §8) |

### 7.5 `mouseleave` vs `mouseout`

`mouseout` se déclenche à chaque transition entre éléments enfants, ce qui provoque des fermetures intempestives du tooltip lors du déplacement à l'intérieur d'une cellule. `mouseleave` se déclenche **une seule fois** lorsque la souris quitte le conteneur `#rd-list-wrapper` dans son ensemble — comportement voulu.

---

## 8. Calcul de la bande percentile cumulée (From … to …)

Pour chaque sous-rang, le tooltip affiche sa position dans la distribution globale :

```
"From: 38.98% to 40.94%"
```

Ces bornes sont calculées lors du rendu du tableau, en une passe séquentielle sur les 66 entrées :

```typescript
let running = 0;
for (const item of data) {  // data trié : Initiate I → Eternus VI
  const fromPct = (running / totalAll) * 100;
  running += item.matchCount;
  const toPct   = (running / totalAll) * 100;
  cumulMap.set(item.subRankId, {
    from: fromPct.toFixed(2),
    to:   toPct.toFixed(2),
  });
}
```

**Interprétation** : un joueur classé Archon I se situe dans la bande `[from%, to%]` de la population totale des matchs analysés pour la période. Plus la bande est étroite, plus ce niveau est rare.

Pour les **rangs principaux** (lignes parentes), la bande couvre du premier au dernier sous-rang du tier :
```
from = cumulMap[tier.first_subrank].from
to   = cumulMap[tier.last_subrank].to
```

---

## 9. Architecture des composants CSS

### 9.1 CSS custom properties des couleurs de rang

Définies dans `src/renderer/index.css` sous `:root` :

```css
:root {
  --rank-color-1:  #774D22;  /* Tier  1 — Initiate  */
  --rank-color-2:  #8E445D;  /* Tier  2 — Seeker    */
  /* … */
  --rank-color-11: #5AFFC3;  /* Tier 11 — Eternus   */
}
```

Ces propriétés sont **réutilisables** sur toute page qui afficherait des informations de rang (ex. cartes joueur, leaderboard). Le nom de chaque rang correspond exactement aux valeurs du filtre de rang dans l'onglet Hero → Items, issues de la constante `RANKS` dans `src/lib/constants/ranks.ts`.

### 9.2 Disposition du tableau en grille 3 colonnes

Les 6 sous-rangs de chaque tier sont affichés sur **deux rangées de 3 colonnes** plutôt qu'une seule rangée de 6 :

```html
<div class="grid grid-cols-3 border-t border-grey-200/20 gap-px bg-grey-200/20">
  <!-- Sous-rang I, II, III -->
  <!-- Sous-rang IV, V, VI  -->
</div>
```

**Raison** : avec les icônes agrandies (`w-16 h-16`, 64 px) et le texte en `text-xl`, une rangée de 6 colonnes produirait des cellules trop étroites (~150 px chacune). Le découpage en 3 × 2 offre ~300 px par cellule, suffisant pour l'icône + le nom + les valeurs.

---

## 10. Pattern de chargement et gestion d'état

Le cycle de vie de la page suit le pattern uniforme de tous les composants du projet :

```
mount()
  ├─ renderSkeleton()    → innerHTML avec placeholders animate-pulse
  └─ fetchAndRender()    → async, fetch parallèle API
        └─ renderFull()  → innerHTML final + wireTooltips()

Changement de filtre :
  onPeriodChange()
    ├─ Skeleton partiel (chart + liste seulement, header inchangé)
    ├─ fetchDistribution()   → seul le tableau de distribution est re-fetché
    │                          (les assets de badge restent en cache mémoire)
    ├─ renderChart()         → nouveau SVG
    ├─ renderList()          → nouveau tableau
    └─ wireTooltips()        → AbortController renouvelle les listeners
```

**Décision** : lors d'un changement de période, seul `fetchDistribution()` est rappelé. Les assets de badge (`this.rankAssets`) restent en mémoire depuis le premier fetch — évitant une requête réseau superflue à chaque filtre.

---

## 11. Résumé des décisions clés

| Décision | Alternative écartée | Raison du choix |
|----------|--------------------|-----------------| 
| SVG natif généré en TS | Chart.js / Recharts | Pas de dépendance externe ; cohérent avec le pattern `innerHTML` du projet |
| `preserveAspectRatio="none"` | `meet` avec conteneur aspect-ratio | Remplit exactement la largeur disponible ; les hauteurs relatives des barres sont préservées |
| `niceGridStep` dynamique | Pas fixe à 5 000 | Évite 80+ lignes de grille pour la période « All » (max ~400 000) |
| PNG locaux pour rangs principaux | Images API uniquement | Disponibles sans réseau ; chargement instantané via Vite `?url` |
| Délégation d'événements + AbortController | Un listener par cellule | Aucun stacking, fonctionne sans re-câblage après chaque re-render de période |
| `mouseleave` sur le conteneur | `mouseout` | `mouseout` déclenche sur chaque sous-élément traversé, causant des fermetures parasites |
| `normalizeTo66` avec matchCount=0 | Ignorer les sous-rangs manquants | Préserve l'alignement des 66 barres dans le graphique |
| Re-fetch distribution uniquement au filtre | Re-fetch tout (assets + distribution) | Les assets de badge ne changent pas selon la période |
| Bande percentile cumulée (From/To) | Rang percentile simple | Permet de voir la largeur relative d'un niveau dans la population, pas seulement sa position |
