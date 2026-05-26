# Live Dashboard – Architecture, Mode Démo et Design des Cartes Joueur

Ce document décrit les décisions techniques et d'interface prises lors de la refonte du Live Dashboard : grille 6×2 de cartes joueur, pipeline d'enrichissement API, mode démo statique, et indicateurs visuels de lane.

---

## 1. Vue d'ensemble

Le Live Dashboard est la page centrale de l'application. Dès qu'une partie est détectée, elle affiche 12 cartes joueur (6 par équipe) chargées en temps réel depuis l'API communautaire Deadlock.

```
game:state-changed (INGAME)
        │
        ▼
LiveDashboard.ts (Renderer)
        │
        ├─ Python (IPC) ──→ data_processor.py ──→ /v1/match/{id}/metadata   (roster des 12 joueurs)
        │
        └─ Fetch direct (Renderer) ──→ 8 endpoints API   (enrichissement)
                │
                ├─ Steam profiles        /v1/players/steam?account_ids=…
                ├─ Hero assets           /v1/assets/heroes/{id}
                ├─ Hero stats            /v1/players/hero-stats?account_ids=…
                ├─ Player MMR            /v1/players/mmr?account_ids=…
                ├─ Rank distribution     /v1/players/mmr/distribution
                ├─ Rank assets           /v1/assets/ranks
                └─ Match histories (×12) /v1/players/{account_id}/match-history
```

---

## 2. Mode Démo Statique

### 2.1 Motivation

Pour les tests et la démonstration vidéo, il est impossible d'attendre qu'une vraie partie commence. Le mode démo remplace la détection réelle par des IDs de matchs connus, tout en gardant les vrais appels API (statistiques authentiques, pas de données générées aléatoirement).

### 2.2 Décision : supprimer le mode mock

L'ancien mode mock (`mockModeEnabled` en localStorage) générait des données aléatoires en Python, ce qui ne reflétait pas le comportement réel et rendait les tests peu représentatifs. Il a été **entièrement supprimé** et remplacé par le mode démo.

| Ancien mode mock | Nouveau mode démo |
|-----------------|------------------|
| Données aléatoires générées en Python | Vrais IDs de matchs réels |
| `generate_mock_match_data()` en Python | Liste fixe `DEMO_MATCH_IDS` en TypeScript |
| Comportement non représentatif | Statistiques et assets réels depuis l'API |
| Clé localStorage : `mockModeEnabled` | Clé localStorage : `demoModeEnabled` (migration automatique) |

### 2.3 Implémentation

**IDs de matchs utilisés** (depuis l'historique réel du développeur) :
```typescript
const DEMO_MATCH_IDS = [80659633, 84419762, 80457157] as const;
```

**Cycle** : un clic sur le bouton « Refresh » (visible uniquement en mode démo) incrémente l'index dans la liste et boucle :
```typescript
this.demoIndex = (this.demoIndex + 1) % DEMO_MATCH_IDS.length;
```

**Reset** : l'index repart à 0 à chaque ouverture de l'application (pas de persistance dans localStorage). Cela évite un état ambigu entre les sessions.

**Affichage du Match ID** : peu importe le mode (réel ou démo), le Match ID courant est toujours affiché dans l'en-tête du dashboard.

### 2.4 Avis et recommandations

**Avis** — Le mode démo basé sur de vrais matchs est bien supérieur au mock aléatoire : il permet de valider que chaque endpoint API répond correctement, que les données sont parsées sans erreur, et que l'interface affiche des cas réels (rangs variés, héros différents, activité disparate).

**Recommandation** — Pour aller plus loin, sauvegarder un snapshot JSON de ces trois matchs localement permettrait de fonctionner hors ligne. Mais pour une preuve de concept, les appels réseau en direct sont suffisants et plus honnêtes.

---

## 3. Pipeline d'enrichissement API (Renderer)

### 3.1 Principe

Le Python renvoie uniquement le **roster brut** : `account_id`, `hero_id`, `team`, `lane` pour chacun des 12 joueurs. Toutes les statistiques affichées dans les cartes sont récupérées **directement depuis le Renderer** en TypeScript, sans passer par Python, pour réduire la charge IPC.

### 3.2 Les 8 endpoints

| # | Endpoint | Données extraites | Méthode de batch |
|---|----------|-------------------|-----------------|
| 1 | `GET /v1/players/steam?account_ids=…` | `personaname`, `avatarfull`, `profileurl` | Tous les 12 IDs en une seule requête |
| 2 | `GET /v1/assets/heroes/{id}` | `name`, `images.icon_image_small_webp` | 1 requête par héros unique (mis en cache) |
| 3 | `GET /v1/players/hero-stats?account_ids=…` | `wins`, `losses`, `kills`, `deaths`, `assists` par héros | Tous les 12 IDs en une requête |
| 4 | `GET /v1/players/mmr?account_ids=…` | `badge_level` (MMR badge) | Tous les 12 IDs en une requête |
| 5 | `GET /v1/players/mmr/distribution` | Distribution globale des rangs (pour calculer le Top%) | 1 seule requête partagée |
| 6 | `GET /v1/assets/ranks` | `badge_level` → image URL + nom affiché | 1 seule requête partagée |
| 7 | `GET /v1/players/{account_id}/match-history` | Historique complet pour calculer activité 12H/30D | 12 requêtes parallèles (`Promise.all`) |

### 3.3 Calcul des statistiques héros

**Source** : `/v1/players/hero-stats` retourne un tableau par joueur. On filtre la ligne correspondant au `hero_id` de la partie courante.

```
heroWinrate      = wins / (wins + losses) × 100
heroAvgKills     = total_kills   / matches_played
heroAvgDeaths    = total_deaths  / matches_played
heroAvgAssists   = total_assists / matches_played
kdaRatio         = (avgKills + avgAssists) / max(avgDeaths, 0.1)
```

Le diviseur minimum `0.1` pour les deaths évite une division par zéro sur les joueurs qui ne meurent jamais dans leur historique avec ce héros.

### 3.4 Calcul du rang et du Top%

**Badge → Nom de rang** :
```
division = Math.floor(badge_level / 10)   // 0=Initiate, 1=Seeker, …, 11=Eternus
subrank  = badge_level % 10               // 1–6 → I, II, III, IV, V, VI
rankName = DIVISION_NAMES[division] + " " + ROMAN[subrank]
```

**Top% depuis la distribution globale** :
```
joueurs avec badge_level > ce joueur → players_above
topPercent = players_above / total_players × 100
```

Un joueur Gold I est dans le Top 35% si 35% des joueurs référencés ont un badge plus élevé.

### 3.5 Calcul de l'activité 12H / 30D

**Source** : `/v1/players/{account_id}/match-history` retourne les matchs triés par `start_time` (epoch secondes).

```
now        = Math.floor(Date.now() / 1000)
cutoff_12h = now - 12 × 3600
cutoff_30d = now - 30 × 86400

matches_12h = entries.filter(e => e.start_time >= cutoff_12h)
matches_30d = entries.filter(e => e.start_time >= cutoff_30d)

activity.games = matches.length
activity.wins  = matches.filter(m => m.match_result === 1).length
```

**Décision** : utiliser `Date.now()` réel plutôt qu'un timestamp arbitraire, même en mode démo. Cela signifie que l'activité d'un match vieux de 2 ans sera 0/0 — ce qui est correct et honnête.

### 3.6 Icône du héros — Résolution de l'URL correcte

**Problème rencontré** : l'URL `assets.deadlock-api.com/v2/heroes/{id}` retourne une redirection 301 non suivie par `fetch()` dans Electron, causant l'absence d'icône.

**Solution** : les assets de héros passent par le endpoint **principal** :
```
https://api.deadlock-api.com/v1/assets/heroes/{id}
```
Le champ `images.icon_image_small_webp` contient une URL complète vers `assets-bucket.deadlock-api.com`, qui elle s'affiche sans problème dans une balise `<img>`.

### 3.7 Avis et recommandations

**Avis** — Faire 12 requêtes parallèles pour les historiques est la bonne approche : l'API ne propose pas de batch sur cet endpoint, et `Promise.all` garantit que toutes les cartes sont enrichies en même temps plutôt que les unes après les autres.

**Recommandation** — Ajouter un cache en mémoire (`Map<accountId, MatchHistoryEntry[]>`) entre les cycles démo éviterait de re-fetcher 12 historiques identiques à chaque « Refresh ». Non implémenté en mode démo pour garantir la fraîcheur des données à chaque cycle.

---

## 4. Composant PlayerCard

### 4.1 Structure visuelle

Chaque carte est un conteneur vertical `flex-col` avec 7 sections :

```
┌──────────────────────────────────┐  ← border-l-4 (lane color)
│ [Steam username]          ● dot  │  Header
├──────────────────────────────────┤
│ [🎯 Hero icon]  as Wraith (23p) │  Hero identity
│                  52% Win         │
├──────────────────────────────────┤
│    14.5  /  5.9  /  7.1         │  KDA (K/D/A colorés)
│         KDA (3.5)               │  ratio (K+A)/D
├──────────────────────────────────┤
│ [🏆 rank img]  Arcanist II      │  Rang
│                Top 38%          │
├──────────────────────────────────┤
│  12H: 2 games · 1 win           │  Activité
│  30D: 24 games · 13 wins        │
├──────────────────────────────────┤
│  [placeholder tag futur]        │  Statut (WARMING UP…)
└──────────────────────────────────┘
```

### 4.2 Indicateurs de lane (couleur)

Les 6 joueurs de chaque équipe sont regroupés par lane pour permettre un scouting visuel immédiat des duos adverses.

| Numéro de lane (API) | Couleur | Tailwind |
|---------------------|---------|---------|
| `1` | Bleu | `border-l-blue-400` / `bg-blue-400` |
| `4` | Jaune | `border-l-yellow-400` / `bg-yellow-400` |
| `6` | Vert | `border-l-emerald-400` / `bg-emerald-400` |

La bordure gauche épaisse (`border-l-4`) et le point coloré dans le header permettent d'identifier la lane en un coup d'œil, même en mode liste dense.

### 4.3 Lien Steam profile

Le nom du joueur est un `<a>` cliquable qui ouvre le profil Steam dans le navigateur :

```typescript
// Prefer the profileurl field from /v1/players/steam (already a full URL).
// Fallback: derive SteamID64 from SteamID3 (account_id + 76561197960265728).
const steamProfileUrl = player.steamProfile?.profileurl
  ?? `https://steamcommunity.com/profiles/${BigInt(player.account_id) + BigInt('76561197960265728')}`;
```

**Décision** : utiliser `BigInt` pour la conversion SteamID3 → SteamID64. Les SteamID64 dépassent `Number.MAX_SAFE_INTEGER` (2⁵³), donc l'arithmétique entière standard produit des résultats incorrects.

### 4.4 Avis et recommandations

**Avis** — Le design actuel couvre toutes les informations utiles pour un scouting rapide avant la partie. Les couleurs de lane sont la décision la plus impactante visuellement : elles permettent de scanner la grille 6×2 en diagonale pour identifier ses adversaires directs.

**Recommandation** — Le placeholder tag en bas de carte (`WARMING UP / IN GAME / etc.`) est prévu pour être câblé depuis l'endpoint match-history dans une prochaine itération, en comparant le `start_time` du dernier match du joueur à l'instant courant.

---

## 5. Architecture de la grille 6×2

### 5.1 Layout Tailwind

```html
<div class="grid grid-cols-6 gap-4">
  <!-- Équipe 0 : 6 cartes triées par lane (yellow, blue, green) -->
  <!-- Équipe 1 : 6 cartes triées par lane (yellow, blue, green) -->
</div>
```

Les cartes sont triées par `laneOrder` avant insertion dans le DOM :
```typescript
const LANE_ORDER: Record<string, number> = { yellow: 0, blue: 1, green: 2 };
players.sort((a, b) => LANE_ORDER[a.laneColor ?? ''] - LANE_ORDER[b.laneColor ?? '']);
```

Résultat visuel : la colonne 1 (gauche) de l'équipe A fait face à la colonne 1 (gauche) de l'équipe B — les adversaires en lane jaune sont alignés visuellement dans la grille.

### 5.2 Séparation des équipes

Les deux équipes (`team === 0` et `team === 1`) occupent chacune **une rangée complète de 6 colonnes** dans la grille. Un bandeau séparateur « ÉQUIPE 0 » / « ÉQUIPE 1 » identifie chaque groupe.

### 5.3 Avis et recommandations

**Avis** — Le tri par lane avant affichage est la décision la plus utile pour le scouting : sans ce tri, les cartes seraient dans l'ordre arbitraire de l'API et il serait impossible d'identifier les duos en un coup d'œil.

**Recommandation** — Une future amélioration serait d'afficher une ligne de séparation visuelle horizontale entre les deux rangées plutôt qu'un simple label texte, pour renforcer la frontière équipe 0 / équipe 1 à la lecture rapide.

---

## 6. Détection réelle en production (rappel)

La détection automatique de partie repose sur la surveillance du processus `deadlock.exe` et de l'API Deadlock. Le mode démo court-circuite uniquement la détection — toute la logique d'enrichissement reste identique.

| Paramètre | Valeur |
|-----------|--------|
| Processus cible (Windows) | `deadlock.exe` |
| Arguments de lancement validés | `-steam -console` |
| Chemin typique | `S:\common\Deadlock\game\bin\win64\deadlock.exe` |
| Intervalle de polling processus | 7 secondes |
| Intervalle de polling API (jeu ouvert) | 20 secondes |
| Endpoint de détection de partie | `GET /v1/players/{account_id}/match-history` (dernier match `in_progress`) |

---

## 7. Résumé des décisions clés

| Décision | Alternative écartée | Raison du choix |
|----------|--------------------|-----------------| 
| Enrichissement API dans le Renderer | Tout en Python via IPC | Évite un spawn Python par requête ; le Renderer peut faire des fetch parallèles |
| Mode démo basé sur vrais matchs | Données aléatoires en Python | Test plus réaliste ; valide l'intégralité du pipeline API |
| `BigInt` pour SteamID64 | `Number` | Les SteamID64 dépassent `Number.MAX_SAFE_INTEGER` |
| `Promise.all` pour 12 historiques | Requêtes séquentielles | Réduit le temps de chargement de ~12× |
| URL `/v1/assets/heroes/{id}` | `assets.deadlock-api.com/v2/…` | Le sous-domaine assets retourne un 301 non suivi par Electron |
| Diviseur KDA minimum `0.1` | Division directe par deaths | Évite `Infinity` pour les joueurs à 0 mort dans leur historique |
| Tri des cartes par lane avant render | Ordre API | Aligne visuellement les adversaires directs dans la grille 6×2 |
