# Design System — DeadlockHelper

Ce document est la référence authoritative du système de design de DeadlockHelper. Toute IA qui génère ou modifie de l'interface (pages, composants, widgets) DOIT respecter ces conventions. Ne jamais introduire d'opinions stylistiques extérieures sans justification explicite.

---

## 1. Direction artistique

**Registre** : Dark industrial / tactical — sobre, dense, efficace. L'application est un outil de scouting compétitif, pas un site de marketing. Chaque décision visuelle sert la lisibilité de l'information.

**Ce qui définit l'identité :**
- Fonds très sombres (presque noirs) avec une seule couleur d'accentuation chaude : l'ambre désaturé `dry-sage-400` (#b0a472).
- Densité contrôlée : les grilles sont serrées, les gaps réduits, sans jamais étouffer les données.
- Hiérarchie claire entre le contenu primaire (blanc pur), secondaire (gris chaud) et tertiaire (gris moyen).
- Aucune couleur décorative gratuite. Les seules couleurs vives sont sémantiques (kills = vert, deaths = rouge, assists = jaune, lanes).

**Ce qu'il ne faut JAMAIS faire :**
- Gradient violet/bleu sur fond blanc (cliché IA).
- Cartes avec ombre portée colorée ou glow excessif.
- Titres en Inter, Roboto, ou Arial.
- Utiliser `frosted-mint` ou `cream` comme couleur d'accent principale — elles sont réservées à des états fonctionnels très spécifiques (si utilisées).
- Fond blanc ou clair sur une page principale.

---

## 2. Palette de couleurs

Définie dans `src/renderer/index.css` via `@theme` (Tailwind v4). Toujours utiliser les tokens Tailwind, jamais les codes hexadécimaux bruts sauf pour des valeurs qui n't existent pas dans la palette (ex. `#1a1f24` pour les fonds de cartes PlayerCard).

### 2.1 Charcoal — Fond principal et surfaces

| Token | Hex | Usage |
|-------|-----|-------|
| `charcoal-100` | `#121212` | Fond de toutes les pages (bg principal) |
| `charcoal-200` | `#252525` | Surface surélevée (hover background, card interior) |
| `charcoal-300` | `#373737` | État actif d'un élément nav (bg-charcoal-300) |
| `charcoal-400` | `#494949` | Bordures de cartes, séparateurs secondaires |
| `charcoal-500` | `#5b5b5b` | Icônes désactivées, placeholders |

`charcoal-600` à `charcoal-900` : rarement utilisés — éviter sauf cas très spécifique.

### 2.2 Grey — Texte et bordures structurelles

| Token | Hex | Usage |
|-------|-----|-------|
| `grey-200` | `#313130` | Bordures structurelles (sidebar border-r, dividers) |
| `grey-400` | `#636261` | Texte tertiaire, labels désactivés |
| `grey-500` | `#7d7c7a` | Placeholders, noms de héros au repos |
| `grey-600` | `#969594` | Texte de navigation au repos |
| `grey-700` | `#b0b0af` | Texte de navigation principal au repos |
| `grey-900` | `#e5e5e4` | Texte blanc chaud (alternative à `text-white`) |

### 2.3 Dry Sage — Couleur d'accentuation principale

| Token | Hex | Usage |
|-------|-----|-------|
| `dry-sage-400` | `#b0a472` | **Accent principal** : état actif nav, bordures hover, texte actif |
| `dry-sage-500` | `#c9c19f` | Sous-titres de page, descriptions |
| `dry-sage-300` | `#8b804e` | Variante plus sombre de l'accent |
| `dry-sage-100` | `#2e2b1a` | Fond teinté très subtil (ex. badge) |

`dry-sage-400` est **LA** couleur signature de l'application. Elle apparaît sur :
- La bandelette d'item actif dans la sidebar (`bg-dry-sage-400`)
- Le texte de l'item actif (`text-dry-sage-400`)
- Le survol des cartes héros (border + ring)
- Le survol du texte de nom de héros
- Le gradient décoratif du header de HeroLibrary

### 2.4 Couleurs sémantiques (non modifiables)

Ces couleurs correspondent à une sémantique de jeu :

| Usage | Token Tailwind |
|-------|---------------|
| Kills (KDA) | `text-emerald-400` |
| Deaths (KDA) | `text-red-400` |
| Assists (KDA) | `text-yellow-400` |
| Lane Jaune | `border-l-yellow-400`, `bg-yellow-400`, `text-yellow-400` |
| Lane Bleue | `border-l-blue-400`, `bg-blue-400`, `text-blue-400` |
| Lane Verte | `border-l-emerald-400`, `bg-emerald-400`, `text-emerald-400` |
| Lien Steam hover | `text-frosted-mint-400` |

---

## 3. Typographie

### 3.1 Font family

Le projet utilise la font stack système définie dans `body` de `index.css` :
```
-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif
```

Aucune Google Font n'est chargée actuellement. Si une font distinctive est ajoutée pour un titre ou un composant exceptionnel (ex. page de garde, landing), elle doit être :
- Caractérielle, pas générique (ex. un style condensed bold, monospace, ou serif inhabituel)
- Limitée aux titres ou aux éléments décoratifs — jamais au corps de texte
- Justifiée par le contexte du composant

### 3.2 Hiérarchie de taille

| Niveau | Tailwind | Usage |
|--------|---------|-------|
| Titre de page | `text-3xl font-bold text-white tracking-wide` | `<h1>` principal (ex. "Heroes") |
| Sous-titre de page | `text-sm text-dry-sage-500` | Description sous le `<h1>` |
| Titre de section | `text-lg font-semibold text-white` | En-têtes de sections dans une page |
| Corps principal | `text-sm text-[#c9d1d9]` ou `text-grey-700` | Contenu standard |
| Corps secondaire | `text-xs text-grey-500` ou `text-[#9ca3af]` | Métadonnées, labels |
| Micro-texte | `text-[10px]` ou `text-[11px]` | Labels de catégorie, indicateurs (ex. "12H", "30D") |
| Nav principale | `text-sm font-medium` | Labels de la sidebar |
| Nav sous-menu | `text-xs` | Items de sous-menu |

### 3.3 Règles typographiques

- `font-bold` est réservé aux titres et aux données clés (KDA, rang).
- `font-semibold` pour les noms de joueurs et les en-têtes de cartes.
- `font-medium` pour les labels de navigation et les catégories.
- `tracking-wide` uniquement sur les grands titres de page (`text-2xl+`).
- `whitespace-nowrap` obligatoire sur tous les labels qui ne doivent pas wrapper (nav, noms dans les petites cartes).
- `truncate` + `max-w-[X]` sur tous les textes variables (usernames, noms de héros) pour éviter les débordements.

---

## 4. Structure de layout

### 4.1 Layout global

```
┌────────────────────────────────────────────────────────┐
│  Sidebar (fixed left, w-16 / w-64)  │  Main content    │
│                                      │  ml-16 (64px)   │
│  - bg-charcoal-100                   │                 │
│  - border-r border-grey-200          │  p-8            │
│  - z-50                              │  bg-charcoal-100│
└────────────────────────────────────────────────────────┘
```

Le contenu principal a `margin-left: 4rem` (64px = `ml-16`) pour laisser place à la sidebar rétractée. La sidebar étendue (w-64) déborde sur le contenu — c'est intentionnel, c'est un overlay temporaire au hover.

### 4.2 Sidebar

- **Largeur rétractée** : `w-16` (64px) — icônes seules
- **Largeur étendue** : `w-64` (256px) — icônes + labels
- **Transition** : `transition-all duration-300 ease-in-out`
- **Déclencheur** : `mouseenter` (debounce 150ms) / `mouseleave` (debounce 100ms)
- **Item actif** : bandelette `w-0.5 bg-dry-sage-400` absolue sur le bord gauche + `bg-charcoal-300 text-dry-sage-400`
- **Item hover** : `hover:bg-charcoal-200 hover:text-white`
- **Sous-menu** : `text-xs pl-12`, point `w-1 h-1 rounded-full` à gauche
- **Widget Spotify** : `position: absolute; bottom: 0; left: 0; width: 256px` — hors du flux, toujours w-64

### 4.3 Pages

Chaque page suit ce patron :

```html
<div class="p-8 bg-charcoal-100 min-h-screen">
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-5">
      <h1 class="text-3xl font-bold text-white tracking-wide">Titre</h1>
      <p class="text-dry-sage-500 text-sm mt-1">Description de la page</p>
      <div class="mt-4 h-px bg-gradient-to-r from-dry-sage-400/50 via-charcoal-400 to-transparent"></div>
    </div>
    <!-- Contenu -->
  </div>
</div>
```

Le divider de header (`h-px` avec gradient) est la signature visuelle des pages HeroLibrary et ses dérivées. Le gradient part de `dry-sage-400/50` à gauche et se dissout vers la droite — ça ancre le titre visuellement sans tracer une ligne dure.

---

## 5. Composants

### 5.1 Cartes Hero (HeroLibrary)

```
┌─────────────┐
│  [portrait] │  w-[96px] h-[128px]
│             │  border border-charcoal-400
│             │  group-hover:border-dry-sage-400
│             │  rounded-lg overflow-hidden
└─────────────┘
  Hero Name      text-[11px] text-grey-500
                 group-hover:text-dry-sage-400
```

**Image** : `icon_hero_card_webp` (portrait plein) en priorité, fallback `icon_image_small_webp`.  
**Hover** : `scale-[1.06]` sur l'image (transition 300ms ease-out), border → dry-sage-400, shadow-lg.  
**Gap** : `gap-2` dans la grille (dense, pas de gap-4).  
**Filtrage** : n'afficher que `player_selectable === true && disabled === false && in_development === false`.

### 5.2 Cartes Joueur (PlayerCard)

Fond : `bg-[#1a1f24]` (légèrement plus chaud que charcoal-100).  
Bordure : `border border-[#2a2f35]` + `border-l-4` colorée par lane.  
Hover : `hover:border-[#3a4048]`.  
Dividers internes : `border-t border-[#2a2f35]`.  
Sous-surfaces (activity blocks) : `bg-[#111518]` (encore plus foncé).

Structure interne (dans l'ordre) :
1. **Header** : username Steam (lien) + dot de lane
2. **Hero** : icône ronde + nom + winrate
3. **Divider**
4. **KDA** : `K / D / A` centrés + ratio
5. **Divider**
6. **Rang** : badge image + nom + Top%
7. **Divider**
8. **Activité** : blocs 12H + 30D côte à côte
9. **Tag slot** : vide (réservé)

### 5.3 Skeleton loading

Utiliser `animate-pulse` avec des formes qui correspondent exactement à la taille finale du contenu :

```html
<!-- Pour une carte hero -->
<div class="w-[96px] h-[128px] rounded-lg bg-charcoal-300 border border-charcoal-400"></div>
<div class="h-2 w-16 rounded-full bg-charcoal-300"></div>
```

Le skeleton doit avoir le même nombre de colonnes et la même structure de grille que le vrai contenu.

### 5.4 État d'erreur

```html
<div class="flex flex-col items-center justify-center gap-3">
  <div class="w-12 h-12 rounded-full border-2 border-charcoal-400 flex items-center justify-center">
    <span class="text-grey-500 text-xl">!</span>
  </div>
  <p class="text-grey-500 text-sm">Message d'erreur.</p>
</div>
```

---

## 6. Conventions de spacing

| Contexte | Valeur |
|---------|--------|
| Padding de page | `p-8` (32px) |
| Gap entre cartes héros | `gap-2` (8px) |
| Gap grille PlayerCard | `gap-4` (16px) |
| Padding interne d'une carte | `px-3 py-3` |
| Padding d'un item nav | `pl-5 pr-4 py-2.5` |
| Padding d'un sous-item nav | `pl-12 pr-4 py-2` |
| Espace vertical entre sections | `mb-5` ou `mb-6` après le header |
| Divider de section interne | `border-t border-grey-200` ou `border-[#2a2f35]` |

**Règle de compacité** : les données de jeu doivent être denses. Un gap-4 entre des petits éléments (icônes, cartes) est trop aéré — préférer gap-2 ou gap-3. L'espace blanc est utilisé pour séparer des sections, pas pour décorer.

---

## 7. Grilles

### 7.1 Hero Library

```
grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 xl:grid-cols-9
gap-2
```

Cartes de 96px de large. Adapter le nombre de colonnes si la taille des cartes change.

### 7.2 Live Dashboard (PlayerCard)

```
style="grid-template-columns: repeat(N, minmax(0,1fr)); grid-template-rows: repeat(2, minmax(0,1fr))"
```

Colonnes **dynamiques** : `N = max(taille équipe 0, taille équipe 1)` → 6 pour 6v6 (12 joueurs), 4 pour 4v4 (8 joueurs). Chaque équipe occupe une rangée complète, triée par lane (yellow=0, blue=1, green=2) puis `player_slot`. Style inline car Tailwind ne génère pas de classe `grid-cols-N` dynamique.

### 7.3 Principe général

- Toujours définir au minimum `grid-cols-X` et `xl:grid-cols-Y` pour les grilles responsives.
- Ne pas utiliser de gap supérieur à `gap-4` pour des grilles de cartes. `gap-6` uniquement pour des sections editoriales.

---

## 8. Animations et transitions

### 8.1 Transitions CSS

| Élément | Transition |
|---------|-----------|
| Sidebar expand/collapse | `transition-all duration-300 ease-in-out` |
| Labels de navigation (opacity) | `transition-opacity duration-200` |
| Couleurs de navigation | `transition-colors duration-200` |
| Couleur de bordure de carte | `transition-all duration-250` |
| Scale d'image au hover | `transition-transform duration-300 ease-out` |
| Chevron (rotation) | `transition-transform duration-200` |

**Durées** : 200ms pour les couleurs simples, 250-300ms pour les transforms, 300ms pour les layouts.

### 8.2 Animations keyframes

Définies dans `index.css` :

- `animate-fade-in-down` : `opacity: 0, translateY(-10px)` → `opacity: 1, translateY(0)` — utilisé pour les transitions de page
- `animate-fade-out-up` : inverse — utilisé pour masquer une page
- `animate-pulse` : Tailwind built-in — utilisé pour tous les skeletons

**Transitions de page** : `opacity 0 → 300ms → swap innerHTML → opacity 1`. Ne pas animer le contenu individuel sauf cas exceptionnel.

### 8.3 Hover patterns

Trois patterns standardisés :

**Pattern A — Carte image (HeroLibrary)** :
```
group-hover:scale-[1.06] sur l'image (transform)
group-hover:border-dry-sage-400 sur le container (couleur)
group-hover:text-dry-sage-400 sur le label (couleur)
```

**Pattern B — Lien texte** :
```
hover:text-white (nav, étiquettes)
hover:text-frosted-mint-400 (liens Steam uniquement)
hover:text-dry-sage-400 (accent, hover dans les listes)
```

**Pattern C — Surface cliquable** :
```
hover:bg-charcoal-200 hover:text-white (nav items, boutons secondaires)
```

---

## 9. Bordures et séparateurs

| Usage | Style |
|-------|-------|
| Sidebar border-r | `border-r border-grey-200` |
| Dividers entre zones sidebar | `border-b border-grey-200` / `border-t border-grey-200` |
| Dividers internes de cartes PlayerCard | `border-t border-[#2a2f35] mx-3 mb-2` |
| Bordure de carte hero au repos | `border border-charcoal-400` |
| Bordure de carte hero au hover | `border-dry-sage-400` |
| Gradient divider de page header | `h-px bg-gradient-to-r from-dry-sage-400/50 via-charcoal-400 to-transparent` |
| Indicateur actif sidebar | `w-0.5 bg-dry-sage-400` (absolute left-0) |

Ne jamais utiliser `border-white` ou `border-grey-900` — trop contrasté pour ce thème.

---

## 10. Règles de filtrage du contenu API

### 10.1 Héros dépréciés

Toujours filtrer les héros avant affichage :
```typescript
heroes = all.filter(h =>
  h.player_selectable === true &&
  h.disabled === false &&
  h.in_development === false
);
```

Les héros comme Bomber, Cadence, Druid, Fathom ont `player_selectable: false` ou `disabled: true` dans l'API — ils ne doivent PAS apparaître dans la Hero Library.

### 10.2 Images de héros — priorité

```typescript
// Portrait plein (hero card) — image principale
const imgUrl = hero.images?.icon_hero_card_webp
            ?? hero.images?.icon_hero_card
            ?? hero.images?.icon_image_small_webp  // fallback icône
            ?? hero.images?.icon_image_small
            ?? '';
```

`icon_hero_card_webp` est le portrait utilisé dans l'écran de sélection — c'est l'image la plus complète et la plus reconnaissable.

---

## 11. Accessibilité et UX minimale

- `alt` obligatoire sur toutes les `<img>` avec le nom du héros ou du joueur.
- `title` obligatoire sur les cartes héros (nom complet, visible au hover).
- `truncate` + `max-w-[X]` sur tous les textes de longueur variable.
- `whitespace-nowrap` sur les labels de navigation.
- Les liens Steam doivent avoir `target="_blank" rel="noopener noreferrer"`.
- `cursor-pointer` explicite sur les éléments cliquables qui ne sont pas des `<a>` ou `<button>`.
- `shrink-0` sur les icônes et images dans des flex containers pour éviter la déformation.

---

## 12. Nommage et conventions de code

### 12.1 Structure d'une page

```typescript
export class XxxPage {
  private container: HTMLElement | null = null;

  mount(container: HTMLElement): void {
    this.container = container;
    this.renderSkeleton();
    this.fetchAndRender();
  }

  private renderSkeleton(): void { /* ... */ }
  private renderHeader(): string { /* retourne le HTML du header (title + subtitle + divider) */ }
  private async fetchAndRender(): Promise<void> { /* fetch + filter + inject HTML */ }
  private renderXxxCard(item: DataType): string { /* retourne le HTML d'une carte */ }
}
```

### 12.2 Commentaires sur les fetches API

Chaque méthode de fetch doit documenter l'endpoint utilisé et les champs extraits :

```typescript
/**
 * GET /v1/assets/heroes — liste complète des héros avec portraits CDN.
 * Filtre: player_selectable=true, disabled=false, in_development=false
 * Image: images.icon_hero_card_webp (portrait) > icon_image_small_webp (icône fallback)
 */
```

---

## 13. Ce qui peut évoluer (et ce qui ne peut pas)

### Peut évoluer
- Ajout de composants nouveaux si le patron existant est respecté
- Ajout d'une Google Font distinctive pour un titre exceptionnel, si justifié
- Grilles plus denses ou moins denses selon le type de contenu
- Couleurs sémantiques supplémentaires pour de nouveaux indicateurs de jeu

### Ne peut PAS changer sans refonte
- La palette `dry-sage-400` comme accent principal
- Le fond `charcoal-100` comme base universelle
- Le pattern header de page (h1 + subtitle + gradient divider)
- Le tri des PlayerCards par lane
- Le filtrage des héros dépréciés

---

*Rédigé à partir du code source au 2026-05-26. Mettre à jour ce document lorsqu'un composant majeur est ajouté ou qu'une convention existante est délibérément rompue.*
