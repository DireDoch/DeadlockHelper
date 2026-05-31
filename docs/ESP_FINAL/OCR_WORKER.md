# Worker OCR « ESP » — Roster live par lecture d'écran

> **But de ce document.** Contexte complet et auto-suffisant pour reprendre le travail sur le
> worker OCR dans une prochaine conversation, **sans relire tout l'historique**. Décisions
> techniques, état réel du code, résultats de tests mesurés, pièges, et ce qu'il reste à faire.
> Document de référence ; les décisions « pourquoi » sont dans `docs/adr/0005-esp-live-roster-ocr.md`
> et le terme de glossaire est *ESP (Live Roster OCR)* dans `CONTEXT.md`.

---

## 0. TL;DR pour l'agent suivant

- **Ce qui marche, validé, déterministe :** `ocr-worker/main.py` (moteur **EasyOCR + thefuzz**)
  lit `src/assets/Images/NameSearch.png` et sort **12/12 héros (100 %)** + 10/12 pseudos.
  Commande de vérif : `./ocr-worker/venv/bin/python ocr-worker/main.py --image src/assets/Images/NameSearch.png`
- **Sortie = NDJSON sur stdout**, diagnostics sur stderr. Forme `{myTeam:[...], enemyTeam:[...]}`,
  chaque joueur = `{steamName, heroId, heroName, heroScore}`.
- **Ce qui reste à faire = l'intégration Electron** (spawn/kill du worker + lecteur de flux
  NDJSON + toggle « ESP » dans Paramètres + câblage overlay/tuiles). **Rien n'est encore câblé
  côté `src/`.**
- **Environnement de dev confirmé : Wayland + KDE.** Conséquences majeures : capture via
  **Spectacle** (pas `mss`), déclencheur clavier via **evdev** (pas `pynput`).
- **Dépendance lourde assumée :** venv ≈ **1,5 Go** (PyTorch via EasyOCR).

---

## 1. Pourquoi ce worker existe

Le roster d'une **partie en cours** n'est exposé par **aucune** source réseau (voir
`GAME_DETECTION.md` §8) : `/metadata` est post-partie, `/matches/active` est limité au top 200
(vide en partie normale), `console.log` ne donne que *mon* compte + le `match_id`. La seule
donnée live est **à l'écran**.

L'écran ciblé : **`ESC › PLAYERS`** (onglet PLAYERS, **persistant par défaut** d'après
l'utilisateur). Référence visuelle : `src/assets/Images/NameSearch.png` (1914×940). Sur la
droite, deux blocs `MY TEAM` / `ENEMY TEAM`. Par joueur : portrait rond, icône micro (bruit),
**pseudo Steam** (gros) et **`<Héros> Level <N>`** (petit, dessous). Headers de faction présents :
`The Hidden King` (mon équipe) / `The Archmother` (ennemis).

---

## 2. Contraintes dures (à ne pas re-découvrir)

### 2.1 Le mur de l'`account_id`
Un **pseudo Steam affiché** (`personaname`) **n'est pas résolvable en `account_id`** :
- non unique ;
- aucun endpoint Steam ni deadlock-api de recherche « nom d'affichage → SteamID » ;
- `ResolveVanityURL` résout le *slug* d'URL `/id/<slug>`, **pas** le nom affiché en jeu ;
- `src/main/steam-logic.ts` ne fait que `steamId64 → personaname` (sens direct uniquement).

**Conséquence définitive :** l'OCR fournit le pseudo **uniquement pour l'affichage**. Il ne
peut PAS piloter les stats par compte du PlayerCard (MMR/rang/winrate/activité). Ne pas
réessayer cette voie.

### 2.2 Les héros sont fiables
Vocabulaire **fermé d'environ 28 héros** → OCR + fuzzy-match donne `hero_id` de façon fiable.
C'est la vraie valeur du worker : il **comble le trou « roster live »** pour l'overlay
*Item Suggestions* (`enemy_hero_ids`) et pour des tuiles live réduites (nom + héros + winrate
du héros vs composition, sans stats par compte).

### 2.3 Contradiction de glossaire à connaître
Le jeu affiche **« The Hidden King » / « The Archmother »** comme noms de faction. Or
`CONTEXT.md` (terme *The Amber Hand / The Sapphire Flame*) les déclare « non-canoniques » et
les a remplacés. **Non bloquant** pour l'OCR (on split sur `MY TEAM`/`ENEMY TEAM`, relatif au
joueur), mais à trancher dans le glossaire un jour. `myTeam`/`enemyTeam` du worker sont
**relatifs au joueur**, PAS les `team` 0/1 de l'API.

---

## 3. Choix du moteur : EasyOCR (et pas Tesseract) — avec preuves

On a réellement testé les deux sur `NameSearch.png` :

| Approche | Pré-traitement | Résultat héros | Déterminisme |
| --- | --- | --- | --- |
| Tesseract + OpenCV | grayscale → Otsu (prompt initial) | **garbage** (seuls les gros titres) | — |
| Tesseract + OpenCV | **HSV white-mask + CLAHE** + segmentation lignes + `--psm 7` | jusqu'à 12/12 **mais 0/12 sous charge** | ❌ instable |
| **EasyOCR + thefuzz** | **aucun** (image brute) | **12/12 (100 %)** | ✅ stable (RAW == CLAHE, runs répétés) |

**Pourquoi Tesseract a perdu :** la segmentation impose ~24 spawns `tesseract` par scan
(un par ligne). Sous charge CPU (ou si OpenMP part en busy-wait, cf. §7.1) ces sous-process
renvoient du bruit → mesuré **0/12 puis 12/12 sur la même image**. Non fiable pour une démo.

**Pourquoi EasyOCR gagne :** un **seul** appel `readtext()` in-process sur l'image brute,
renvoie `(box, text, conf)`. La détection HSV/CLAHE qu'on avait dû inventer pour Tesseract
**n'est plus nécessaire** (RAW et CLAHE donnent le même 12/12). Coût : PyTorch (lourd, §6).

### Fragments EasyOCR réels (référence pour calibrer un parseur)
```
'FRIENDS' 1.00 | 'PLAYERS' 1.00 | 'MY TEAM' 0.67 | 'The Hidden King' 0.94
'SergeaJTK' 0.63 | 'Victor Level 0' 0.89 | 'PapaCarlo' 0.99 | 'Vindicta Level 0' 0.94
'Tales' 0.93 | 'Shiv Level 0' 0.55 | 'EarleS2' 0.59 | 'Lash Level 0' 0.91
'Impossible' 0.75 | 'Wraith Level 0' 0.91 | 'Mikaels' 0.98 | 'Holliday Level 0' 0.99
'ENEMY TEAM' 1.00 | 'The Archmother' 0.99 | 'Ibo' 1.00 | 'Bllly Level 0' 0.72
'ddlakes' 1.00 | 'Grey Talon Level 0' 0.93 | 'T.TVISHAWBH LIVE RN' 0.59 | 'Seven Level 0' 0.88
'Yamato Level 0' 0.89 | 'Paradox Level 0' 0.92 | 'Screndo' 0.63 | 'Mirage Level 0' 0.99
```
Note : les pseudos `I7` et `c` (mono/biscaractère) **ne sont pas lus** par EasyOCR → leurs
tuiles ont `steamName: ""`. C'est **voulu** (cf. §4.3).

---

## 4. Pipeline d'implémentation (état réel de `ocr-worker/main.py`)

### 4.1 Vue d'ensemble
```
capture (Spectacle) ──▶ crop panneau droit (DEFAULT_REGION = x:70%→99.9%, y:6%→99.8%)
   ──▶ EasyOCR readtext() (image brute) ──▶ fragments (top_y, text, conf), triés par y
   ──▶ anchor-gating (présence de "MY TEAM"/"ENEMY TEAM") ──▶ parse_roster()
   ──▶ NDJSON sur stdout
```

### 4.2 Table des héros (`HERO_MAP`)
- Source : `GET https://api.deadlock-api.com/v1/assets/heroes`.
- Filtre : **tous les héros `disabled == false`**. ⚠️ **NE PAS** filtrer sur
  `in_development` : **Victor (31)** et **Infernus (1)** sont marqués `in_development` mais
  jouent en vraie partie (Victor est dans la capture de référence). Filtrer comme la Hero
  Library produirait des `unknown_hero` à tort.
- Table **figée en dur** dans `main.py` (0 réseau sur le chemin chaud). Refresh best-effort :
  `--refresh-heroes` (⚠️ met un `User-Agent: Mozilla/5.0`, sinon **403 Cloudflare** sur
  `urllib` par défaut — piège rencontré).
- `hero_id` connus utiles : Victor 31, Vindicta 19, Shiv 51, Lash 16, Wraith 8, Holliday 35,
  Billy 63, Grey Talon 25, Seven 4, Yamato 21, Paradox 22, Mirage 53.

### 4.3 Parsing (`parse_roster`)
- **Split équipes** sur le `y` du fragment contenant `enemy` : au-dessus = `myTeam`, en
  dessous = `enemyTeam`.
- **Ligne de héros** = contient `lev*` (EasyOCR lit « Level » proprement) OU score thefuzz
  ≥ 70 (`HERO_LINE_THRESHOLD`).
- **Appariement nom↔héros (gap adaptatif) :** le pseudo d'un héros est le fragment
  non-header/non-héros **juste au-dessus**, MAIS seulement si l'écart vertical ≤ `1.8 × ligne`
  (la hauteur de ligne médiane est calculée sur les fragments → robuste à la résolution). Si
  trop loin → `steamName: ""` plutôt que **voler** le pseudo du voisin. Un fragment-pseudo
  déjà consommé (`used`) n'est pas réutilisé. **Validé** : `Yamato`/`Paradox` sortent avec nom
  vide au lieu de dupliquer `T.TVISHAWBH LIVE RN`.
- **fuzzy_hero** : `thefuzz.process.extractOne(..., scorer=fuzz.ratio)`, scores **0–100**.
  Seuils : `HERO_EMIT_THRESHOLD = 60` (sinon `heroId=null`, `heroName="unknown_hero"`),
  `HERO_LINE_THRESHOLD = 70`. `strip_level()` retire le suffixe « Level X » (tolérant OCR).

### 4.4 Modes CLI
| Commande | Usage |
| --- | --- |
| `main.py` | live, déclencheur **poll** (défaut, aucune permission) |
| `main.py --trigger evdev` | live, **touche ESC** (groupe `input` requis) |
| `main.py --image FICHIER.png` | **calibration** : parse une image, JSON sur stdout (+ `--debug` = fragments sur stderr + crop `/tmp/ocr_panel.png`) |
| `main.py --selftest` | diagnostic EasyOCR / Spectacle / Wayland / capture |
| `main.py --refresh-heroes` | rafraîchit `HERO_MAP` via l'API (sinon table figée) |

Flags : `--capture {auto,spectacle,mss}`, `--interval <s>` (poll, défaut 1.5).

---

## 5. Contrat de sortie (IPC)

**stdout = NDJSON pur** (une ligne JSON par scan). **stderr = diagnostics** (`[ocr-worker] …`)
et messages `{"type":"status",...}`. Ne jamais mélanger : Electron parse stdout en JSON strict.

```json
{"type":"roster","ts":1730000000,"source":"ocr",
 "myTeam":[{"steamName":"SergeaJTK","heroId":31,"heroName":"Victor","heroScore":100}],
 "enemyTeam":[{"steamName":"Ibo","heroId":63,"heroName":"Billy","heroScore":80}]}
```
- `myTeam`/`enemyTeam` **relatifs au joueur** (≠ team 0/1 API).
- `heroId=null` & `heroName="unknown_hero"` si score < 60.
- `steamName=""` si l'OCR n'a pas lu de pseudo lisible (jamais volé au voisin).
- Émission **dédupliquée** : ne ré-émet que si le roster change (signature JSON triée).
- **anchor-gating** : aucune émission si `MY TEAM`/`ENEMY TEAM` absent (ESC fermé, mauvais onglet…).

---

## 6. Dépendances & environnement (tout est DÉJÀ installé en dev)

- **Session : Wayland + KDE** (`XDG_SESSION_TYPE=wayland`, `XDG_CURRENT_DESKTOP=KDE`). Vérifié.
- **Capture : Spectacle** (`/usr/bin/spectacle`, présent, capture Wayland OK ~3,6 Mo PNG).
  `mss` testé : **capture noire** sur Wayland (`nonBlackPixels=0`) → inutilisable, gardé en
  fallback X11/Windows seulement. `grim`/`qdbus` (v5) absents ; `qdbus6` présent.
- **Clavier (mode evdev) :** l'utilisateur **n'est pas** dans le groupe `input` et
  `/dev/input/event0` n'est **pas** lisible → `evdev` retombe automatiquement sur `poll`.
  Pour activer : `sudo usermod -aG input $USER` puis reconnexion. `pynput` (X11) ne marche
  pas sous Wayland → ignoré.
- **Python venv : `ocr-worker/venv` ≈ 1,5 Go.** Paquets clés (cf. `requirements.txt`) :
  `easyocr==1.7.2`, `thefuzz==0.22.1`, `python-Levenshtein==0.27.3`, `torch==2.12.0+cpu`,
  `torchvision==0.27.0+cpu`, `opencv-python(-headless)==4.13.0.92`, `numpy==2.4.6`,
  `pillow==12.2.0`, `mss==10.2.0`, `evdev==1.9.3`, + transitifs (scikit-image, scipy, shapely,
  pyclipper, ninja).
- EasyOCR télécharge ses **modèles (~64 Mo)** dans `~/.EasyOCR` au **1er** lancement.
- Installer système minimal ailleurs : `sudo pacman -S --needed spectacle` (pas besoin de
  Tesseract : OCR 100 % Python).

**Perf mesurée (CPU) :** init EasyOCR ≈ 3,7 s (une fois) ; `readtext()` ≈ 5 s par scan. → en
mode poll, garder un intervalle ≥ 1.5 s et précharger le reader au démarrage (déjà fait).

---

## 7. Pièges rencontrés (et corrigés)

### 7.1 libgomp / OpenMP busy-wait à 100 % CPU
Sans bride, OpenCV/leptonica via OpenMP partent en **busy-wait à 100 % CPU** (process Python
fantômes qui ont faussé des tests). Corrigé en tête de `main.py` : `OMP_NUM_THREADS=1` **avant**
d'importer cv2, + `cv2.setNumThreads(0)`. À conserver.

### 7.2 403 Cloudflare sur `urllib`
`GET /v1/assets/heroes` via `urllib` par défaut → **403**. Mettre
`User-Agent: Mozilla/5.0`. C'est pour ça que la table héros est figée en dur (réseau évité).

### 7.3 mss = écran noir sur Wayland
Ne pas « réparer » mss sous Wayland : c'est une limite de sécurité Wayland, pas un bug. Spectacle.

### 7.4 Le `main.py` a été ré-écrit plusieurs fois
Historique : (1) stub `tester_tesseract`, (2) version Tesseract complète que j'avais livrée,
(3) **l'utilisateur l'a remplacée par un essai EasyOCR**, (4) version EasyOCR finale actuelle.
**L'état actuel sur disque = version EasyOCR complète.** Ne pas confondre avec d'anciennes captures.

---

## 8. Reste à faire — intégration Electron (NON commencé)

Aucun fichier de `src/` ne référence encore le worker. Plan pressenti (à valider) :

1. **Toggle « ESP »** dans `src/renderer/pages/Parametres/Configuration.ts` (clé electron-store,
   ex. `espOcrEnabled`). ⚠️ L'utilisateur veut **garder le nom « ESP »** malgré l'ambiguïté
   (école / wallhack) — assumé.
2. **Spawn/kill** dans `src/main/main.ts`, calqué sur l'overlay (`overlay-window.ts`) :
   spawn sur `GAME_IN_MATCH` **et** toggle ON ; kill sur `match-ended`/`GAME_MENU`/`GAME_CLOSED`.
   ⚠️ `python-runner.ts` actuel est **one-shot** (`runPython` attend la fin du process + parse
   tout stdout) — **inadapté** à un worker long-vécu. Écrire un **nouveau lecteur de flux**
   (spawn persistant, lecture ligne par ligne de stdout = NDJSON, stderr → logs).
3. **Canal IPC** vers le renderer (ex. `ocr:roster-updated`) pour pousser `{myTeam,enemyTeam}`.
4. **Câblage consommateurs** :
   - Overlay *Item Suggestions* : `enemy_hero_ids` = `enemyTeam[].heroId` →
     `GET /v1/analytics/item-stats?hero_ids={mon_héros}&enemy_hero_ids={...}` (cf. [[adr-0003]] §6).
   - Tuiles live réduites sur le Live Dashboard quand le roster API est indisponible
     (nom + héros + winrate du héros vs compo ; **pas** de stats par compte — cf. §2.1).
5. **Chemin du script** : prévoir packaging (extraResources) comme `getDataProcessorScriptPath`,
   et l'exécutable Python du venv (`ocr-worker/venv/bin/python` en dev).

**Rappels projet (mémoire) :** rester en **vanilla TS** (pas de React) ; **toute modif du
Main process = redémarrer `npm start`** (pas de HMR du main) ; **documenter chaque fetch API**
(endpoint + flux de données en commentaire).

---

## 9. Packaging (futur) — ⚠️ lourd

EasyOCR = PyTorch → bundle PyInstaller **multi-Go**. Pour la démo (machine de dev) : sans
impact, le venv existe. Pour distribuer : torch **CPU-only** (slim), embarquer les modèles
EasyOCR (`EASYOCR_MODULE_PATH`, déjà géré dans `resolve_bundle_paths()` quand `sys.frozen`),
ou livrer le venv. Si le poids devient bloquant, **re-considérer Tesseract bundlé** (binaire
+ `eng.traineddata` légers) au prix de la robustesse (§3) — décision à rouvrir si besoin.

---

## 10. Fichiers concernés

| Fichier | Rôle |
| --- | --- |
| `ocr-worker/main.py` | worker complet (EasyOCR) — **état actuel = version finale** |
| `ocr-worker/requirements.txt` | dépendances Python (commentées) |
| `ocr-worker/README.md` | install + usage + contrat de sortie |
| `ocr-worker/venv/` | environnement (≈1,5 Go) — **git-ignoré** |
| `src/assets/Images/NameSearch.png` | capture de référence (ground truth 12 joueurs) |
| `docs/adr/0005-esp-live-roster-ocr.md` | décision (le « pourquoi ») |
| `CONTEXT.md` → *ESP (Live Roster OCR)* | terme de glossaire |
| `src/main/` (à créer) | intégration Electron — **non commencée** |
