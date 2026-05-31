# ocr-worker — ESP Live Roster OCR

Lit le panneau **ESC › PLAYERS** de Deadlock (MY TEAM / ENEMY TEAM) par OCR et émet
le roster live en NDJSON sur **stdout** : pseudo Steam (best-effort) + héros mappé en
`hero_id`. Voir le glossaire `CONTEXT.md` (terme *ESP (Live Roster OCR)*) et l'ADR
`docs/adr/0005-*`.

> **Moteur : EasyOCR + thefuzz.** Précision mesurée : **100 % des héros (12/12)** sur
> `src/assets/Images/NameSearch.png`, de façon déterministe, sans pré-traitement
> (EasyOCR lit le panneau brut en un seul appel et renvoie boîtes + confiance).
> Les pseudos sont best-effort (affichage seulement — non résolvables en `account_id`).

## Dépendances

### Système (Arch / CachyOS)
```bash
sudo pacman -S --needed spectacle
```
- `spectacle` : capture d'écran **compatible Wayland/KDE**. `mss`/X11 renvoie un écran
  **noir** sur Wayland → on n'utilise pas mss ici (gardé en fallback X11/Windows).
- Pas besoin de Tesseract : l'OCR est 100 % Python (EasyOCR).

### Python (venv)
```bash
cd ocr-worker
python -m venv venv
./venv/bin/pip install -r requirements.txt    # tire torch (~3.9 Go) au 1er install
```
> EasyOCR télécharge ses modèles (~64 Mo) dans `~/.EasyOCR` au tout premier lancement.

### (Optionnel) déclencheur touche ESC via evdev
Le mode `poll` (défaut) ne demande **aucune** permission. Pour le mode `evdev`
(touche ESC, plus léger en CPU) il faut lire `/dev/input/*` :
```bash
sudo usermod -aG input $USER   # puis se déconnecter / reconnecter
```

## Utilisation

```bash
# Live, déclencheur poll (défaut, aucune permission) — n'émet que si le panneau est visible
./venv/bin/python main.py

# Live, touche ESC (après usermod input + reconnexion)
./venv/bin/python main.py --trigger evdev

# Calibration : parse une image statique, imprime le JSON (+ --debug = fragments + crop /tmp)
./venv/bin/python main.py --image ../src/assets/Images/NameSearch.png

# Diagnostic dépendances + test de capture
./venv/bin/python main.py --selftest
```

## Contrat de sortie (stdout, NDJSON — une ligne JSON par scan)

```json
{"type":"roster","ts":1730000000,"source":"ocr",
 "myTeam":[{"steamName":"SergeaJTK","heroId":31,"heroName":"Victor","heroScore":100}],
 "enemyTeam":[{"steamName":"Ibo","heroId":63,"heroName":"Billy","heroScore":100}]}
```

- `myTeam` / `enemyTeam` sont **relatifs au joueur** (pas les `team` 0/1 de l'API).
- `heroId` est `null` et `heroName` vaut `"unknown_hero"` si le score thefuzz < 60.
- `steamName` est **best-effort** ; vide (`""`) si l'OCR n'a pas lu de pseudo lisible.
- Diagnostics et statut (`{"type":"status",...}`) → **stderr** ; stdout reste 100 % JSON.

## Intégration Electron (à venir)

Le Main process spawn ce worker **uniquement** sur `GAME_IN_MATCH` + toggle ESP, et le
tue à `match-ended` / `GAME_MENU` / `GAME_CLOSED` (cycle de vie calqué sur l'overlay).
Electron lit les lignes NDJSON de stdout (**nouveau** lecteur en flux, distinct du
`runPython` one-shot actuel) et traite stderr comme des logs. Le roster alimente
l'overlay *Item Suggestions* (`enemy_hero_ids`) et des tuiles live réduites.

## Packaging (futur, PyInstaller) — ⚠️ lourd

EasyOCR = PyTorch : un bundle PyInstaller serait **multi-Go**. Pour le démo sur la
machine de dev c'est sans impact (le venv est déjà présent). Pour distribuer plus tard :
torch **CPU-only** (wheel slim), embarquer les modèles EasyOCR (`EASYOCR_MODULE_PATH`),
ou livrer le venv. `main.py` pointe déjà vers les modèles embarqués quand `sys.frozen`.
