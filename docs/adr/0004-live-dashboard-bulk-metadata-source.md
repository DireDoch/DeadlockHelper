# Live Dashboard — source du roster via le bulk metadata endpoint

## Contexte

Le Live Dashboard affiche tous les joueurs d'un match sous forme de tuiles. Le **roster** (qui joue + héros + équipe + lane) provenait jusqu'ici du endpoint par-match `GET /v1/matches/{id}/metadata` (via Python `executePython('match', …)`), enrichi ensuite par des fetches par-joueur côté renderer.

Tests live (2026-05-30) sur cet endpoint :

| Constat | Mesure |
| --- | --- |
| Quota (sans clé API) | **3 requêtes / heure / IP** (`{"quota":{"limit":3,"period":3600}}`) |
| Dépendance Steam | retourne `503 "Failed to fetch data from Steam. Retry your request later."` de façon intermittente |
| Match Street Brawl `85818364` | 503 puis 429, jamais récupérable pendant la fenêtre de test |

Conséquence : le Demo Mode (rotation de 3 matchs + Street Brawl) épuise le budget de 3/h en 3 rafraîchissements et échoue dès que Steam renvoie 503. Le cycling de matchs voulu pour tester l'UI est donc cassé en pratique.

Découverte : `GET /v1/matches/metadata` (**Bulk Metadata**, backend Clickhouse) fournit le même roster avec un quota de **10 req/min (IP)** et **sans dépendance Steam**. Tests validés sur `80659633` (Normal 6v6, 12 joueurs) et `84553413` (Street Brawl 4v4, 8 joueurs) : tous les champs requis par la tuile sont présents (`account_id`, `player_slot`, `hero_id`, `team`, `assigned_lane`).

## Décision

Le **Live Dashboard** récupère son roster via le **bulk endpoint** `GET /v1/matches/metadata?match_ids={id}&include_info=true&include_player_info=true`, côté renderer (cohérent avec les autres fetches d'enrichissement déjà côté renderer), avec repli sur le cache `electron-store` existant (`cacheMatch` / `getCachedMatch`).

Le **Match Detail Panel du Profil conserve** le endpoint par-match `/v1/matches/{id}/metadata` : il a besoin des `stats[]` riches (timelines, dégâts, économie) que le bulk ne fournit pas dans la même forme.

### Normaliseur

Les deux endpoints ont des schémas différents ; un normaliseur unique convertit le bulk vers la forme attendue par le dashboard :

| Champ | Per-match (`/metadata`) | Bulk (`/matches/metadata`) | Forme cible |
| --- | --- | --- | --- |
| structure | imbriqué sous `match_info` | plat (racine) | `match_info` |
| `game_mode` | `1`, `4` (int) | `"Normal"`, `"StreetBrawl"` (string) | accepter les deux |
| `match_mode` | `1` (int) | `"Unranked"` (string) | non utilisé |
| `team` (joueur) | `0` / `1` (int) | `"Team0"` / `"Team1"` (string) | `0` / `1` |
| `winning_team` | `0` / `1` (int) | `"Team0"` / `"Team1"` (string) | `0` / `1` |

Détection Street Brawl robuste : `isStreetBrawl = (game_mode === 4 || game_mode === 'StreetBrawl')`.

## Alternatives écartées

- **Fixture JSON embarquée** — sauvegarder le metadata des matchs demo dans des fichiers livrés avec l'app. Robuste et hors-ligne, mais fige les données et nécessitait un premier fetch réussi (impossible pendant que `85818364` renvoyait 503).
- **Garder `/metadata` par-match + cache** — aucun nouveau code, mais le cycling demo reste cassé (3/h + 503) ; c'est le problème de départ.
- **Hybride (live par-match, repli bulk)** — plus de code pour un bénéfice nul, le bulk étant plus fiable de toute façon.

## Conséquences

- Le Demo Mode et les matchs historiques se chargent de façon fiable (10/min, pas de 503).
- Un **match live en cours** n'est dans aucun des deux endpoints (ingestion post-partie) : le dashboard tente `GET /v1/matches/active?account_ids=` (best-effort, souvent vide) puis affiche un état d'attente et recharge via le bulk une fois le match ingéré. Voir glossaire `Live Roster Availability`.
- Un normaliseur doit être maintenu tant que le dashboard tolère les deux schémas (utile pour le repli cache, qui peut contenir l'une ou l'autre forme).
- `match_mode` (Unranked/Ranked) n'est volontairement pas exploité — seul `game_mode` pilote l'UI.
