#!/usr/bin/env python3
"""
ESP OCR Worker — DeadlockHelper  (moteur: EasyOCR + thefuzz)
============================================================

Lit le panneau « ESC > PLAYERS » de Deadlock (listes MY TEAM / ENEMY TEAM) et en
extrait le roster live : pseudo Steam (best-effort, affichage seulement) + héros
mappé vers son `hero_id` officiel via fuzzy-match.

Pourquoi ce worker existe
-------------------------
Aucune source de l'API communautaire ne donne le roster d'une partie EN COURS
(metadata = post-partie, /matches/active = top 200 — voir docs/ESP_FINAL/GAME_DETECTION.md).
La seule donnée live est ce qui est affiché à l'écran → OCR.
Le héros (vocabulaire fermé d'environ 28 noms) est mappé de façon fiable (100 %
validé sur src/assets/Images/NameSearch.png) ; le pseudo Steam reste best-effort
(non résolvable en account_id → aucune stat par compte).

Choix moteur : EasyOCR (et non Tesseract)
-----------------------------------------
EasyOCR lit le panneau brut en UN SEUL appel in-process (pas de pré-traitement HSV,
pas de 24 spawns `tesseract` fragiles sous charge), renvoie boîtes + confiance, et
s'est révélé 100 % sur les héros de façon déterministe. Coût : dépendance PyTorch
(bundling plus lourd — voir README).

Architecture (décidée en session grill-with-docs)
-------------------------------------------------
- Communication : NDJSON sur **stdout** (une ligne JSON par scan). Aucun port réseau.
  Tous les diagnostics vont sur **stderr** (stdout reste 100 % JSON pur).
- Cycle de vie : Electron spawn/kill ce worker (sur GAME_IN_MATCH + toggle « ESP »).
- Capture : **Spectacle** (compatible Wayland/KDE). `mss` (X11) = écran noir sur Wayland.
- Déclencheur : `poll` (défaut, aucune permission) ou `evdev` (touche ESC, groupe `input`).

Modes
-----
  python main.py                       # live, déclencheur poll (défaut)
  python main.py --trigger evdev       # live, touche ESC (groupe input requis)
  python main.py --image FICHIER.png   # calibration : parse une image, JSON + debug
  python main.py --selftest            # vérifie EasyOCR / capture / table héros
"""

# ── Durcissement threads AVANT cv2/torch (anti busy-wait libgomp à 100 % CPU) ──
import os
os.environ.setdefault("OMP_NUM_THREADS", "1")

import sys
import re
import json
import time
import argparse
import tempfile
import subprocess

import cv2  # noqa: E402
cv2.setNumThreads(0)

import numpy as np  # noqa: E402


# ─────────────────────────────────────────────────────────────────────────────
# 1. Table des héros (name -> hero_id)
#    Source: GET https://api.deadlock-api.com/v1/assets/heroes
#    Filtre: TOUS les héros non-désactivés (disabled == false).
#    On NE filtre PAS sur in_development : Victor (31) et Infernus (1) sont marqués
#    in_development mais apparaissent en vraie partie. Figée pour 0 réseau sur le
#    chemin chaud ; refresh best-effort via --refresh-heroes.
# ─────────────────────────────────────────────────────────────────────────────
HERO_MAP = {
    "Abrams": 6, "Bebop": 15, "Billy": 63, "Calico": 52, "Dynamo": 11,
    "Grey Talon": 25, "Haze": 17, "Holliday": 35, "Infernus": 1, "Ivy": 20,
    "Kelvin": 12, "Lady Geist": 13, "Lash": 16, "McGinnis": 18, "Mirage": 53,
    "Mo & Krill": 10, "Paradox": 22, "Pocket": 50, "Seven": 4, "Shiv": 51,
    "Sinclair": 58, "Victor": 31, "Vindicta": 19, "Viscous": 23, "Vyper": 60,
    "Warden": 27, "Wraith": 8, "Yamato": 21,
}
HEROES_ENDPOINT = "https://api.deadlock-api.com/v1/assets/heroes"

# thefuzz renvoie des scores 0..100.
HERO_EMIT_THRESHOLD = 60   # en dessous -> hero_id null ("unknown_hero")
HERO_LINE_THRESHOLD = 70   # un texte sans "Level" mais >= ce score est traité comme héros

# Région du panneau (fraction de l'écran). Le panneau « PLAYERS » est à droite.
# Le parsing s'appuie sur le texte + les coordonnées (agnostique au mode 6v6/4v4).
DEFAULT_REGION = (0.70, 0.06, 0.999, 0.998)  # (x0, y0, x1, y1)

HEADER_KEYWORDS = ("my team", "players", "friends", "hidden king", "archmother", "enemy team")

# Reader EasyOCR (chargé une seule fois — coûteux ~1-2 s).
_READER = None


def log(*args):
    """Diagnostics -> stderr uniquement (stdout reste du JSON pur)."""
    print("[ocr-worker]", *args, file=sys.stderr, flush=True)


def emit(payload: dict):
    """Émet une ligne NDJSON sur stdout (canal IPC lu par Electron)."""
    sys.stdout.write(json.dumps(payload, ensure_ascii=False) + "\n")
    sys.stdout.flush()


def get_reader():
    """Initialise EasyOCR une fois (CPU, pour ne pas voler de ressources au jeu)."""
    global _READER
    if _READER is None:
        import easyocr
        t = time.time()
        _READER = easyocr.Reader(["en"], gpu=False, verbose=False)
        log(f"EasyOCR initialisé en {time.time() - t:.1f}s")
    return _READER


# ─────────────────────────────────────────────────────────────────────────────
# 2. Fuzzy-match héros (thefuzz)
# ─────────────────────────────────────────────────────────────────────────────
def fuzzy_hero(text: str, threshold: int = HERO_EMIT_THRESHOLD):
    """Associe un texte OCR au héros le plus proche. -> (Nom, hero_id, score 0..100)."""
    from thefuzz import process, fuzz
    cand = strip_level(text)
    if not cand:
        return ("unknown_hero", None, 0)
    match, score = process.extractOne(cand, list(HERO_MAP.keys()), scorer=fuzz.ratio)
    if score >= threshold:
        return (match, HERO_MAP[match], score)
    return ("unknown_hero", None, score)


def strip_level(text: str) -> str:
    """Retire le suffixe « Level X » (tolérant aux erreurs OCR) et le bruit de tête."""
    s = re.sub(r"\s*lev[e3]?l?\s*\S*\s*$", "", text, flags=re.I)
    return re.sub(r"^[^A-Za-z]+", "", s).strip()


# ─────────────────────────────────────────────────────────────────────────────
# 3. Résolution dépendances embarquées (PyInstaller) — best-effort
# ─────────────────────────────────────────────────────────────────────────────
def resolve_bundle_paths():
    """En binaire gelé, pointe les modèles EasyOCR embarqués via EASYOCR_MODULE_PATH."""
    if getattr(sys, "frozen", False):
        base = getattr(sys, "_MEIPASS", os.path.dirname(sys.executable))
        models = os.path.join(base, "easyocr_models")
        if os.path.isdir(models):
            os.environ.setdefault("EASYOCR_MODULE_PATH", base)


def refresh_hero_map():
    """Refresh best-effort de la table héros (User-Agent navigateur => évite 403 Cloudflare)."""
    import urllib.request
    try:
        req = urllib.request.Request(
            HEROES_ENDPOINT, headers={"User-Agent": "Mozilla/5.0", "Accept": "application/json"})
        with urllib.request.urlopen(req, timeout=8) as r:
            data = json.load(r)
        new_map = {h["name"]: h["id"] for h in data if isinstance(h, dict) and not h.get("disabled")}
        if new_map:
            HERO_MAP.clear()
            HERO_MAP.update(new_map)
            log(f"table héros rafraîchie ({len(HERO_MAP)} héros)")
    except Exception as e:  # noqa: BLE001 — jamais bloquant
        log(f"refresh héros ignoré (fallback table figée): {e}")


# ─────────────────────────────────────────────────────────────────────────────
# 4. OCR + parsing roster (EasyOCR renvoie boîtes -> tri par y, robuste)
# ─────────────────────────────────────────────────────────────────────────────
def crop_region(bgr: np.ndarray, region=DEFAULT_REGION) -> np.ndarray:
    """Crop a BGR image to the given fractional region (x0, y0, x1, y1 in [0, 1])."""
    h, w = bgr.shape[:2]
    x0, y0, x1, y1 = region
    return bgr[int(h * y0): int(h * y1), int(w * x0): int(w * x1)]


def _top_y(box):
    """Return the minimum y coordinate of an EasyOCR bounding box (top edge)."""
    return min(p[1] for p in box)


def _is_header(text: str) -> bool:
    """Return True if `text` is a panel header keyword (MY TEAM, ENEMY TEAM, etc.)."""
    low = text.lower()
    return any(k in low for k in HEADER_KEYWORDS)


def _is_hero_text(text: str) -> bool:
    """Return True if `text` is likely a hero line (contains 'Level' or strong fuzzy match)."""
    # Ligne de héros = contient « Level » (EasyOCR le lit proprement) OU match fort.
    return bool(re.search(r"lev", text, re.I)) or fuzzy_hero(text)[2] >= HERO_LINE_THRESHOLD


def ocr_fragments(bgr_panel: np.ndarray):
    """Renvoie [(top_y, text, conf)] triés du haut vers le bas."""
    raw = get_reader().readtext(bgr_panel)  # [(box, text, conf), ...]
    frags = [(_top_y(box), txt.strip(), float(conf)) for box, txt, conf in raw if txt.strip()]
    frags.sort(key=lambda f: f[0])
    return frags


def has_anchor(frags) -> bool:
    """Anchor-gating : n'émettre que si le panneau joueurs est réellement visible."""
    joined = " ".join(t for _, t, _ in frags).lower()
    return ("enemy team" in joined) or ("my team" in joined)


def parse_roster(frags):
    """
    Transforme les fragments OCR en {myTeam, enemyTeam}.
    - Sépare les équipes sur le y de « ENEMY TEAM » (avant = mon équipe, après = ennemis).
      myTeam/enemyTeam sont RELATIFS au joueur (pas team 0/1 de l'API) — exactement ce
      dont l'overlay (enemy_hero_ids) a besoin.
    - Pour chaque ligne de héros, le pseudo = le fragment non-en-tête/non-héros juste au-dessus.
    """
    enemy_y = next((y for y, t, _ in frags if "enemy" in t.lower()), None)
    my_team, enemy_team = [], []
    # Écart vertical typique entre deux fragments (adaptatif à la résolution) :
    # sert à refuser un pseudo « trop loin » au-dessus d'un héros (= pseudo non détecté).
    ys = sorted(y for y, _, _ in frags)
    diffs = sorted(b - a for a, b in zip(ys, ys[1:]) if b - a > 2)
    row = diffs[len(diffs) // 2] if diffs else 30
    max_gap = row * 1.8
    used = set()
    for i, (y, text, conf) in enumerate(frags):
        if _is_header(text) or not _is_hero_text(text):
            continue
        name = ""
        for j in range(i - 1, -1, -1):
            if j in used:
                continue
            yj, tj, _ = frags[j]
            if _is_header(tj) or _is_hero_text(tj):
                continue
            if y - yj > max_gap:   # pseudo absent (non lu par l'OCR) -> on laisse vide plutôt que voler le voisin
                break
            name = re.sub(r"^[^A-Za-z0-9]+", "", tj).strip()
            used.add(j)
            break
        hero_name, hero_id, score = fuzzy_hero(text)
        player = {
            "steamName": name,        # best-effort, affichage seulement (pas d'account_id)
            "heroId": hero_id,        # null si non reconnu
            "heroName": hero_name,
            "heroScore": score,
        }
        (enemy_team if (enemy_y is not None and y > enemy_y) else my_team).append(player)
    return {"myTeam": my_team, "enemyTeam": enemy_team}


def extract_roster(bgr: np.ndarray, region=DEFAULT_REGION):
    """Capture brute -> roster. Renvoie (roster|None, frags)."""
    frags = ocr_fragments(crop_region(bgr, region))
    if not has_anchor(frags):
        return None, frags
    return parse_roster(frags), frags


# ─────────────────────────────────────────────────────────────────────────────
# 5. Capture (Spectacle sur Wayland/KDE ; mss en fallback X11/Windows)
# ─────────────────────────────────────────────────────────────────────────────
def capture_spectacle() -> np.ndarray:
    """Capture the full screen using KDE Spectacle (Wayland-compatible).

    Writes to a temporary PNG file, reads it with OpenCV, then removes the file.
    Spectacle is the only reliable capture method on Wayland — mss returns a black
    screen on Wayland sessions (verified: nonBlackPixels == 0).

    Returns:
        BGR ndarray of the full screen.

    Raises:
        RuntimeError: if Spectacle exits without producing a readable image.
    """
    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
        path = tmp.name
    try:
        subprocess.run(["spectacle", "-b", "-n", "-f", "-o", path], check=True, timeout=15,
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        img = cv2.imread(path)
        if img is None:
            raise RuntimeError("Spectacle n'a pas produit d'image lisible")
        return img
    finally:
        try:
            os.remove(path)
        except OSError:
            pass


def capture_mss() -> np.ndarray:
    """Fallback X11/Windows. Sur Wayland renvoie un écran NOIR (inutilisable)."""
    import mss
    with mss.mss() as sct:
        shot = sct.grab(sct.monitors[1])
        return cv2.cvtColor(np.array(shot), cv2.COLOR_BGRA2BGR)


def make_capturer(method: str):
    """Return the appropriate capture callable based on `method`.

    'spectacle' → capture_spectacle (Wayland/KDE)
    'mss'       → capture_mss (X11/Windows fallback)
    'auto'      → spectacle if found on PATH, otherwise mss
    """
    if method == "spectacle":
        return capture_spectacle
    if method == "mss":
        return capture_mss
    from shutil import which
    return capture_spectacle if which("spectacle") else capture_mss


# ─────────────────────────────────────────────────────────────────────────────
# 6. Boucle live — déclencheurs poll / evdev
# ─────────────────────────────────────────────────────────────────────────────
def scan_and_emit(capture, region, last_signature):
    """Capture one frame, extract the roster, and emit it on stdout if it changed.

    De-duplicates output by comparing the current roster JSON signature against
    the previous one — only truly changed rosters produce a new NDJSON line.

    Args:
        capture:        Callable returning a BGR ndarray (spectacle or mss).
        region:         Fractional crop coordinates (x0, y0, x1, y1).
        last_signature: JSON string of the previously emitted roster, or None.

    Returns:
        Updated signature string if a new roster was emitted, else last_signature.
    """
    try:
        bgr = capture()
    except Exception as e:  # noqa: BLE001
        log(f"capture échouée: {e}")
        return last_signature
    roster, _ = extract_roster(bgr, region)
    if not roster or (not roster["myTeam"] and not roster["enemyTeam"]):
        return last_signature  # panneau non visible -> rien (anchor-gating)
    signature = json.dumps(roster, sort_keys=True)
    if signature == last_signature:
        return last_signature  # roster identique -> pas de spam
    emit({"type": "roster", "ts": int(time.time()), "source": "ocr", **roster})
    log(f"roster émis: {len(roster['myTeam'])} alliés / {len(roster['enemyTeam'])} ennemis")
    return signature


def run_poll(capture, region, interval: float):
    """Live loop with periodic capture trigger (default every 1.5 s).

    Pre-loads the EasyOCR model before the first scan so the initial response
    is fast. Emits only when the PLAYERS panel is visible (anchor-gating).

    Args:
        capture:  Screen capture callable.
        region:   Fractional crop region.
        interval: Seconds between scans.
    """
    log(f"mode poll (intervalle {interval}s). N'émet que si MY TEAM/ENEMY TEAM est visible.")
    get_reader()  # pré-charge le modèle pour que le 1er scan soit rapide
    emit({"type": "status", "state": "ready", "trigger": "poll"})
    last = None
    while True:
        last = scan_and_emit(capture, region, last)
        time.sleep(interval)


def run_evdev(capture, region):
    """Touche ESC via evdev (niveau noyau, Wayland-OK). Nécessite le groupe `input`."""
    from evdev import InputDevice, list_devices, ecodes
    keyboards = []
    for path in list_devices():
        try:
            dev = InputDevice(path)
            if ecodes.KEY_ESC in dev.capabilities().get(ecodes.EV_KEY, []):
                keyboards.append(dev)
        except (PermissionError, OSError):
            continue
    if not keyboards:
        log("evdev: aucun clavier accessible (groupe 'input' manquant ?). "
            "sudo usermod -aG input $USER puis reconnexion. Bascule en poll.")
        return run_poll(capture, region, 1.5)

    get_reader()
    log(f"mode evdev sur {len(keyboards)} clavier(s). Appuie sur ESC en partie.")
    emit({"type": "status", "state": "ready", "trigger": "evdev"})
    import select
    last = None
    fd_map = {d.fd: d for d in keyboards}
    while True:
        r, _, _ = select.select(fd_map, [], [], None)
        for fd in r:
            for event in fd_map[fd].read():
                if event.type == ecodes.EV_KEY and event.code == ecodes.KEY_ESC and event.value == 1:
                    time.sleep(0.30)  # laisse le menu se rendre
                    last = scan_and_emit(capture, region, last)


# ─────────────────────────────────────────────────────────────────────────────
# 7. Modes calibration / selftest
# ─────────────────────────────────────────────────────────────────────────────
def mode_image(path: str, region, debug: bool):
    """Calibration mode: parse a static PNG and print the roster JSON to stdout.

    With --debug, also saves the cropped panel to /tmp/ocr_panel.png and logs
    all OCR fragments (y, confidence, text) to stderr for tuning thresholds.

    Args:
        path:   Path to the reference PNG image.
        region: Fractional crop region.
        debug:  If True, write the panel crop and fragment details to stderr.
    """
    bgr = cv2.imread(path)
    if bgr is None:
        emit({"type": "error", "error": f"image illisible: {path}"})
        sys.exit(1)
    frags = ocr_fragments(crop_region(bgr, region))
    roster = parse_roster(frags) if has_anchor(frags) else {"myTeam": [], "enemyTeam": []}
    if debug:
        cv2.imwrite("/tmp/ocr_panel.png", crop_region(bgr, region))
        log("debug: /tmp/ocr_panel.png")
        for y, t, c in frags:
            log(f"   y={int(y):4} conf={c:.2f}  {t!r}")
    print(json.dumps(
        {"type": "roster", "source": "image", "file": path, "anchor": has_anchor(frags), **roster},
        ensure_ascii=False, indent=2))


def mode_selftest(region):
    """Diagnostic mode: verify EasyOCR, Spectacle, Wayland session, and capture.

    Outputs a JSON report to stdout with keys: heroes (count), spectacle (bool),
    wayland (bool), easyocr ('ok' or error string), capture (shape + nonBlackPixels).
    A nonBlackPixels count of 0 indicates a black screen (mss on Wayland).
    """
    report = {"type": "selftest"}
    from shutil import which
    report["heroes"] = len(HERO_MAP)
    report["spectacle"] = bool(which("spectacle"))
    report["wayland"] = os.environ.get("XDG_SESSION_TYPE") == "wayland"
    try:
        get_reader()
        report["easyocr"] = "ok"
    except Exception as e:  # noqa: BLE001
        report["easyocr"] = f"ERREUR: {e}"
    try:
        bgr = make_capturer("auto")()
        nonblack = int((bgr.sum(axis=2) > 20).sum())
        report["capture"] = {"ok": True, "shape": list(bgr.shape), "nonBlackPixels": nonblack}
        if nonblack == 0:
            report["capture"]["warning"] = "écran noir (capture X11 sur Wayland ?) — utilise Spectacle"
    except Exception as e:  # noqa: BLE001
        report["capture"] = {"ok": False, "error": str(e)}
    print(json.dumps(report, ensure_ascii=False, indent=2))


# ─────────────────────────────────────────────────────────────────────────────
# 8. Entrée
# ─────────────────────────────────────────────────────────────────────────────
def main():
    """Entry point — parse CLI arguments and dispatch to the appropriate mode.

    Modes:
        (default)          Live polling loop (poll trigger, Spectacle capture).
        --trigger evdev    Live loop triggered by the ESC key via evdev.
        --image PNG        Calibration on a static image; JSON output to stdout.
        --selftest         Diagnostic report for the local environment.
        --refresh-heroes   Refresh HERO_MAP from the community API before running.
    """
    p = argparse.ArgumentParser(description="ESP OCR Worker — roster live Deadlock (EasyOCR)")
    p.add_argument("--trigger", choices=["poll", "evdev"], default="poll")
    p.add_argument("--capture", choices=["auto", "spectacle", "mss"], default="auto")
    p.add_argument("--interval", type=float, default=1.5, help="intervalle du mode poll (s)")
    p.add_argument("--image", metavar="PNG", help="mode calibration sur une image statique")
    p.add_argument("--selftest", action="store_true", help="diagnostic dépendances/capture")
    p.add_argument("--refresh-heroes", action="store_true", help="rafraîchit la table héros via l'API")
    p.add_argument("--debug", action="store_true", help="sauve crop + fragments OCR sur stderr")
    args = p.parse_args()

    resolve_bundle_paths()
    if args.refresh_heroes:
        refresh_hero_map()

    region = DEFAULT_REGION
    if args.image:
        return mode_image(args.image, region, args.debug)
    if args.selftest:
        return mode_selftest(region)

    capture = make_capturer(args.capture)
    try:
        if args.trigger == "evdev":
            run_evdev(capture, region)
        else:
            run_poll(capture, region, args.interval)
    except KeyboardInterrupt:
        log("arrêt demandé")


if __name__ == "__main__":
    main()
