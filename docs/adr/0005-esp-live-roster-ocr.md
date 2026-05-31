# ADR-0005 : Roster live par OCR de l'écran (worker « ESP »)

**Statut :** Accepté
**Date :** 2026-05-31
**Voir aussi :** glossaire `CONTEXT.md` (terme *ESP (Live Roster OCR)*),
`docs/ESP_FINAL/OCR_WORKER.md` (détails d'implémentation), [[adr-0004]] (bulk metadata),
[[adr-0003]] (overlay).

## Contexte

Le Live Dashboard et l'overlay Item Suggestions ont besoin du **roster d'une partie EN
COURS** (qui joue, quel héros, ami ou ennemi). Or aucune source réseau ne le fournit en
direct (établi en conditions réelles, voir `GAME_DETECTION.md` §8 et [[live-roster-availability]]) :

| Source | Roster live ? |
| --- | --- |
| `console.log` local | ❌ (donne le `match_id`, pas le roster) |
| `/v1/matches/{id}/metadata` (+ bulk) | ❌ ingestion **post-partie** |
| `/v1/matches/active` | ⚠️ top 200 seulement → vide en partie normale |

La **seule** information disponible pendant la partie est ce qui est **affiché à l'écran**
du joueur : l'écran `ESC › PLAYERS` liste `MY TEAM` et `ENEMY TEAM` avec, par joueur, un
**pseudo Steam** + une ligne **`<Héros> Level <N>`** + un portrait. D'où la décision de
lire cet écran par OCR.

Contrainte dure découverte pendant la conception : un pseudo Steam affiché (`personaname`)
**n'est pas résolvable en `account_id`** (pas unique ; aucun endpoint Steam/deadlock-api de
recherche par nom d'affichage ; `ResolveVanityURL` ne résout que le *slug* d'URL, pas le
nom). Donc l'OCR **ne peut pas** alimenter les stats par compte (MMR/rang/activité) du
PlayerCard. Les héros, eux, forment un **vocabulaire fermé (~28 noms)** → mappables de façon
fiable vers `hero_id`.

## Décision

Nous ajoutons un **worker Python** (`ocr-worker/main.py`) qui lit l'écran `ESC › PLAYERS`
et émet le roster live. Décisions clés :

1. **Périmètre.** L'OCR extrait le **héros → `hero_id`** (fiable, fuzzy-match) et le
   **pseudo Steam → texte best-effort, affichage seulement** (jamais de stats par compte).
   Pas de `lane`/`slot` (absents de cet écran).
2. **Moteur OCR : EasyOCR + thefuzz** (et **non** Tesseract). EasyOCR lit le panneau brut en
   **un seul appel in-process**, renvoie boîtes + confiance, et donne **100 % des héros
   (12/12) de façon déterministe** sur la capture de référence, **sans pré-traitement**.
3. **Séparation des équipes RELATIVE au joueur** : `myTeam` / `enemyTeam` (et non `team` 0/1
   de l'API), split sur l'ancre `ENEMY TEAM`. C'est exactement la forme attendue par
   l'overlay Item Suggestions (`enemy_hero_ids`).
4. **Communication : NDJSON sur stdout** (une ligne JSON par scan), diagnostics sur
   **stderr**. Pas de WebSocket/port réseau (cohérent avec `python-runner.ts`).
5. **Cycle de vie piloté par Electron** : spawn sur `GAME_IN_MATCH` **et** toggle « ESP »
   activé ; kill sur `match-ended` / `GAME_MENU` / `GAME_CLOSED` (calqué sur l'overlay). Le
   worker ne détecte pas le jeu lui-même.
6. **Capture : Spectacle** (KDE, compatible **Wayland**). `mss`/X11 renvoie un **écran noir**
   sur Wayland (vérifié) → gardé uniquement en fallback X11/Windows.
7. **Déclencheur : `poll`** (défaut, **aucune permission**, avec *anchor-gating* — n'émet que
   si `MY TEAM`/`ENEMY TEAM` est visible) ou **`evdev`** (touche ESC, nécessite le groupe
   `input`). `pynput`/hooks X11 ne fonctionnent pas sur Wayland.

## Conséquences

- ✅ On obtient enfin un **roster live** pour l'overlay et des tuiles live réduites, là où
  l'API est aveugle.
- ✅ Pré-traitement nul (EasyOCR sur image brute) → moins de code, robuste à la résolution
  (parsing par texte + coordonnées, agnostique 6v6/4v4).
- ⚠️ **Dépendance lourde** : EasyOCR tire PyTorch (venv ≈ **1,5 Go**, torch CPU-only).
  Bundling PyInstaller = multi-Go → traité comme TODO distribution (voir `OCR_WORKER.md`).
  Modèles EasyOCR (~64 Mo) téléchargés dans `~/.EasyOCR` au 1er lancement.
- ⚠️ **Pseudos best-effort** : certains noms (mono-caractère, ou très stylisés) ne sont pas
  lus → champ `steamName` vide (jamais volé au voisin, grâce au *gap-pairing* adaptatif).
- ⚠️ **VAC** : lecture d'écran + capture uniquement, **aucune** lecture mémoire/injection →
  même posture VAC-safe que l'overlay ([[adr-0003]]).
- ⚠️ **Prérequis utilisateur** : Spectacle installé ; pour le mode `evdev`,
  `usermod -aG input` + reconnexion. Le mode `poll` évite ce prérequis.
- 🔜 **Reste à faire (hors de cet ADR)** : intégration Electron (spawn/kill + lecteur NDJSON
  en flux), toggle « ESP » dans les Paramètres, câblage vers l'overlay + tuiles live.

## Alternatives écartées

- **Tesseract + OpenCV (HSV white-mask + seuillage + segmentation par lignes).** Approche
  initiale du prompt. Le seuil Otsu simple échoue (texte clair sur fond translucide) ; un
  masque HSV « pixels proches du blanc » + CLAHE rend le texte lisible. **Mais** la
  segmentation impose ~24 spawns `tesseract` par scan, **fragiles sous charge CPU** :
  mesuré **0/12 puis 12/12** sur la *même* image selon la charge. Non déterministe → écarté.
- **Template-matching des portraits (OpenCV).** Identifier le héros par son icône. Écarté :
  icônes circulaires stylisées, états variables (mort, micro actif), multi-résolution →
  fragile ; l'OCR texte est plus robuste sur un vocabulaire fermé.
- **Résolution nom Steam → `account_id`.** Permettrait des tuiles complètes. **Impossible** :
  pas de lookup inverse par nom d'affichage (voir Contexte).
- **WebSocket `ws://localhost:8080`.** Proposé au départ. Surdimensionné pour 1 producteur →
  1 consommateur local (port, prompt firewall Windows, dépendance `ws`). stdout NDJSON suffit.
- **Parseur de broadcast Source 2 (haste/demofile-net).** Vrai live mais rate-limit 2 req/h
  + complexité élevée → hors périmètre (déjà identifié dans `GAME_DETECTION.md`).
