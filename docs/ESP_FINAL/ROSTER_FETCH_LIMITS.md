# Pourquoi on ne peut pas fetch les stats des autres joueurs en partie

## Le mur fondamental : pseudo Steam ≠ account_id

Tout repose sur un seul fait : **le nom affiché en jeu (`personaname`) n'est pas résolvable en `account_id` (SteamID3)**. Sans `account_id`, aucun endpoint de la Deadlock API communautaire ne répond.

```
OCR lit : "SergeaJTK"
              ↓
    Pas de lookup Steam → SteamID64 possible
              ↓
    Impossible d'appeler /v1/players/{account_id}/hero-stats
```

- Le `personaname` est **non-unique** : n'importe qui peut s'appeler "SergeaJTK".
- Ce n'est **pas** le vanity URL slug (`/id/<slug>`) — les deux sont indépendants.
- Aucun endpoint Steam (ni deadlock-api, ni Steam Web API) n'expose de recherche « nom affiché → SteamID64 ».

---

## Ce que nous avons essayé

### 1. `ResolveVanityURL` (Steam Web API)
Résout `/id/<slug>` (l'URL personnalisée de profil) en SteamID64.  
**Résultat :** le vanity URL slug n'a aucun rapport avec le `personaname` affiché en jeu. Un joueur peut s'appeler "ProGamer99" sur son profil Steam et afficher "xXx_destroyer" en jeu. La fonction ne reçoit jamais le bon input.

### 2. `/v1/matches/active?account_ids={me}` (Deadlock API communautaire)
Endpoint de roster live. Renvoie `account_id + hero_id` des joueurs de la partie.  
**Résultat :** **limité au top 200 joueurs classés mondiaux.** En partie normale (ranked ou non), la réponse est vide à 100 % du temps. Vérifié en session de test réelle — 0 résultat, non fiable pour une démo.

### 3. `/v1/matches/{matchId}/live/url` (probe broadcast)
Tentative d'obtenir un flux Source 2 broadcast pour lire le roster en temps réel via le protocole spectateur.  
**Résultat :** réponse 404/vide sur toutes les parties normales testées. L'endpoint n'expose de données que pour les matches en cours dans un tournoi ou avec un spectateur actif déclaré — pas pour une partie publique ordinaire. Voir `probeLiveBroadcast()` dans `main.ts`.

### 4. OCR + résolution inverse Steam
Idée : lire le pseudo via OCR, puis chercher le SteamID64 correspondant via une API tierce ou Steam.  
**Résultat :** aucune API Steam ne propose de recherche par `personaname`. `GetPlayerSummaries` prend un SteamID64 en entrée (sens direct uniquement). La recherche textuelle Steam n'est pas exposée publiquement. Dead end confirmée.

### 5. `/v1/matches/metadata` (post-match)
L'endpoint qui contient le roster complet avec `account_id`, héros, stats.  
**Résultat :** **données uniquement disponibles après la fin de la partie.** En cours de partie, la réponse est vide ou renvoie une ancienne partie. Utilisé avec succès pour le Live Dashboard en mode historique/démo, pas en temps réel.

---

## Ce que l'OCR fournit réellement

| Donnée | Disponible via OCR | Utilisable pour les stats |
|---|---|---|
| Nom du héros | ✅ (12/12, 100 % déterministe) | ✅ → `hero_id` fiable |
| Pseudo Steam affiché | ✅ best-effort (10/12) | ❌ non résolvable |
| `account_id` | ❌ jamais visible à l'écran | — |
| `steamId64` | ❌ jamais visible à l'écran | — |

**Conclusion définitive :** l'OCR résout le problème du roster de héros (utile pour l'overlay Item Suggestions via `enemy_hero_ids`). Il ne résout pas et ne peut pas résoudre le problème des stats par joueur. Ce sont deux problèmes distincts.

---

## Ce qui est possible avec les données disponibles

- **Winrate du héros vs composition ennemie** → `GET /v1/analytics/item-stats?hero_ids={mon_hero}&enemy_hero_ids={...}` → fonctionne avec les `hero_id` OCR.
- **Stats globales d'un héros** (winrate toutes parties) → `GET /v1/analytics/hero-stats` → pas besoin d'`account_id`.
- **Stats du joueur local uniquement** → son `account_id` est connu via `steamId64` enregistré à la connexion.

Tout le reste (MMR, winrate individuel, historique) des 11 autres joueurs reste inaccessible pendant une partie en cours.
