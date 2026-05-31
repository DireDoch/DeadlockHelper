# Live Dashboard — Spécification fonctionnelle

> Issue de la session `grill-with-docs` du 2026-05-30. Termes définis dans [`CONTEXT.md`](../CONTEXT.md) ; décision de source de données dans [`docs/adr/0004`](./adr/0004-live-dashboard-bulk-metadata-source.md).

## 1. Objectif

Afficher, sous forme de **tuiles**, tous les joueurs du match courant (ou, à défaut de match live, du dernier match du joueur connecté), en supportant deux modes : **Normal** (6v6) et **Street Brawl** (4v4). Le mode est dérivé du champ API `game_mode` et affiché visiblement.

Terminologie canonique (corrige le brief) :
- On dit **`game_mode`**, pas « matchMode ». `game_mode` `1`/`"Normal"` = Normal ; `4`/`"StreetBrawl"` = Street Brawl. `match_mode` (Unranked/Ranked) est un autre axe, **non utilisé** par l'UI.
- On dit **Demo Mode**, pas « Mock » (le code a déjà migré `mockModeEnabled` → `demoModeEnabled`).

## 2. UI

- **Disposition** : 2 rangées (rangée haute = `team` 0, rangée basse = `team` 1). Le nombre de colonnes = taille d'équipe : **6** en Normal, **4** en Street Brawl. Les 8 tuiles d'un Street Brawl sont donc visibles simultanément, plus grandes que les 12 d'un Normal.
- **Tuile** : on **réutilise à l'identique** le composant `PlayerCard` du mode normal — mêmes champs, même mise en page. Champs affichés : nom (→ profil Steam), héros + parties jouées + win%, K/D/A moyens + ratio KDA, badge de rang + nom + Top%, activité 12H / 30D. Aucun champ ajouté ou retiré entre les modes.
- **Couleur de lane** : présente en Normal (bordure gauche + point colorés par lane), **supprimée en Street Brawl** (bordure neutre, pas de point). Raison : en Street Brawl tous les joueurs sont sur la même lane, mais `assigned_lane` reste rempli avec des valeurs trompeuses `[1,4,6]` (vérifié en live) — donc la suppression est branchée sur `game_mode`, **jamais** sur le nombre de lanes présentes.
- **Badge de mode** : dans le cluster gauche de l'en-tête, badge « Street Brawl » ou « Normal » (styles distincts), à côté du titre, du chip format `4v4 • 8 joueurs` et du Match ID.
- **Responsive** : la grille utilise des colonnes `1fr` et 2 rangées `1fr` sur la hauteur d'écran ; les tuiles se redimensionnent avec la fenêtre. Aucune information n'est tronquée (textes en `truncate`).
- **Bug corrigé** : le bouton `refresh-match-btn` est **déplacé dans le cluster gauche** de l'en-tête (à côté du titre / Match ID). Le coin haut-droit reste libre pour le badge global fixe `Deadlock lancé / non lancé` (`#game-status-sticky`, `fixed top-4 right-4 z-[70]`), qui le masquait.

## 3. Sources de données et flux

Le roster vient d'un endpoint **selon la liveness** ; l'enrichissement par-joueur est inchangé.

1. **Résolution du match_id**
   - Demo Mode → ID courant de la rotation.
   - Sinon match live détecté (`detectedMatchId`, via `console.log` / IPC `game:match-started`).
   - Sinon dernier match du joueur (`/v1/players/{id}/match-history`, `start_time` max).
2. **Roster**
   - Demo / historique → **bulk** `GET /v1/matches/metadata?match_ids={id}&include_info=true&include_player_info=true` (10/min, Clickhouse, pas de 503) → **normaliseur** (cf. ADR-0004) → forme `match_info`.
   - Live détecté → `GET /v1/matches/active?account_ids={me}` (best-effort). Si vide → état d'attente (cf. §4) + polling, puis bulk dès ingestion.
   - Repli : `getCachedMatch` (electron-store) si l'API échoue.
3. **Enrichissement par-joueur** (inchangé, côté renderer, endpoints à quotas larges) : `/v1/players/steam`, `/v1/assets/heroes/{id}`, `/v1/players/hero-stats`, `/v1/players/mmr`, `/v1/assets/ranks`, `/v1/players/mmr/distribution`, `/v1/players/{id}/match-history`.
4. **Cache** : un chargement réussi est écrit via `cacheMatch` (sauf rien à mettre en cache).

## 4. Machine à états (vue)

| État | Déclencheur | Affichage |
| --- | --- | --- |
| `LOADING` | mount / changement d'état | squelette de tuiles |
| `READY` | roster + enrichissement OK | grille de tuiles + badge de mode |
| `LIVE_PENDING` | match live détecté mais roster indisponible | « Partie détectée — données indisponibles en direct (l'API publie pendant/après la partie) » + polling |
| `CLOSED` | aucun match, pas connecté Steam | vue « No Active Game Detected » |
| `CACHED` | API down, cache présent | grille + bandeau « Données en cache » |

## 5. Contrat JSON

### 5.1 Signal de détection (IPC `main → renderer`)

Émis quand le match watcher (console.log / API) détecte le début d'un match.

```json
{
  "type": "match-started",
  "matchId": "84553413",
  "gameMode": "StreetBrawl",
  "detectedAt": 1748620800
}
```

`match-ended` : `{ "type": "match-ended", "matchId": "84553413" }`.

### 5.2 Contrat de rendu (`MatchData` normalisé alimentant les tuiles)

Forme cible après normalisation, quelle que soit la source (bulk, per-match, ou cache) :

```json
{
  "match_id": 84553413,
  "game_mode": 4,
  "game_mode_label": "Street Brawl",
  "duration_s": 741,
  "winning_team": 1,
  "players": [
    {
      "account_id": 126550849,
      "player_slot": 1,
      "hero_id": 12,
      "team": 0,
      "assigned_lane": 4
    }
  ]
}
```

> En Street Brawl, `assigned_lane` est conservé tel quel mais **ignoré** par l'UI (pas de couleur).

### 5.3 Schéma minimal (JSON Schema draft 2020-12)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "LiveDashboardMatchData",
  "type": "object",
  "required": ["match_id", "game_mode", "players"],
  "properties": {
    "match_id": { "type": "integer" },
    "game_mode": {
      "description": "1/Normal=6v6, 4/StreetBrawl=4v4. Accepte int ou string.",
      "oneOf": [
        { "type": "integer", "enum": [1, 4] },
        { "type": "string", "enum": ["Normal", "StreetBrawl"] }
      ]
    },
    "game_mode_label": { "type": "string", "enum": ["Normal", "Street Brawl"] },
    "duration_s": { "type": "integer", "minimum": 0 },
    "winning_team": {
      "oneOf": [
        { "type": "integer", "enum": [0, 1] },
        { "type": "string", "enum": ["Team0", "Team1"] }
      ]
    },
    "players": {
      "type": "array",
      "minItems": 8,
      "maxItems": 12,
      "items": {
        "type": "object",
        "required": ["account_id", "hero_id", "team"],
        "properties": {
          "account_id": { "type": "integer" },
          "player_slot": { "type": "integer" },
          "hero_id": { "type": "integer" },
          "team": {
            "oneOf": [
              { "type": "integer", "enum": [0, 1] },
              { "type": "string", "enum": ["Team0", "Team1"] }
            ]
          },
          "assigned_lane": { "type": ["integer", "null"] }
        }
      }
    }
  }
}
```

## 6. Demo Mode

Rotation de Match IDs réels (historiques, donc ingérés et fiables) chargés via le bulk endpoint. La rotation **inclut un Street Brawl** pour tester le 4v4 :

| Match ID | Mode | Format |
| --- | --- | --- |
| `80659633` | Normal | 6v6 |
| `84419762` | Normal | 6v6 |
| `80457157` | Normal | 6v6 |
| **`84553413`** | **Street Brawl** | **4v4** (vérifié) |

> Le brief mentionnait `85818364` ; il renvoie 503 (Steam). On utilise `84553413`, vérifié `game_mode "StreetBrawl"`, 8 joueurs, 4v4.

Le bouton Refresh avance d'un cran dans la rotation. Le texte de la section « Mode Démo » des Paramètres doit lister les 4 IDs (au lieu des 3 actuels) et mentionner le Street Brawl.

## 7. Critères d'acceptation

- ✅ Demo Mode affiche correctement un match **Normal** (6 tuiles/équipe) et un match **Street Brawl** (4 tuiles/équipe), avec le bon badge de mode.
- ✅ En Street Brawl, aucune couleur de lane n'est affichée ; en Normal, les couleurs de lane restent.
- ✅ Les tuiles 4v4 montrent exactement les mêmes champs que les tuiles 6v6.
- ✅ Le bouton Refresh est entièrement visible (plus masqué par le badge global).
- ⚠️ **Limite assumée** : « dès qu'une partie est détectée → afficher les joueurs » n'est garanti que pour les matchs demo/historiques. Pour un match **live réel**, le roster peut être indisponible jusqu'à l'ingestion post-partie ; l'UI affiche alors `LIVE_PENDING` puis se remplit automatiquement. Ce comportement est attendu, pas un bug.
