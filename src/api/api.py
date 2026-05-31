"""
Deadlock API client — wrapper HTTP centralisé pour DeadlockHelper.

Points d'entrée :
  api.deadlock-api.com   — données match / joueur / analytics
  assets.deadlock-api.com — assets héros / items

Toutes les fonctions publiques retournent des dicts/listes JSON-sérialisables.
Elles lèvent requests.RequestException (et sous-classes) en cas d'erreur réseau.
"""

import os
import requests
from typing import Any, Dict, List, Optional

_API_BASE    = "https://api.deadlock-api.com"
_ASSETS_BASE = "https://assets.deadlock-api.com"
_TIMEOUT     = int(os.environ.get("DEADLOCK_API_TIMEOUT", "5"))

# User-Agent obligatoire — urllib brut reçoit 403 Cloudflare (cf. ocr-worker §7.2)
_HEADERS: Dict[str, str] = {
    "Accept": "application/json",
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64)",
}


def _get(url: str, params: Optional[Dict[str, Any]] = None) -> Any:
    """GET interne → JSON parsé. Lève HTTPError sur 4xx/5xx."""
    r = requests.get(url, params=params, headers=_HEADERS, timeout=_TIMEOUT)
    r.raise_for_status()
    return r.json()


# ── Santé ─────────────────────────────────────────────────────────────────────

def health_check() -> Dict[str, Any]:
    """
    Ping léger contre GET /v2/heroes.
    Retourne {"success": bool, "status": str, "status_code": int}.
    Ne lève jamais : toutes les erreurs réseau sont capturées.
    """
    try:
        r = requests.get(
            f"{_ASSETS_BASE}/v2/heroes",
            headers=_HEADERS,
            timeout=_TIMEOUT,
        )
        if r.status_code == 200:
            return {"success": True, "status": "healthy", "status_code": 200}
        return {
            "success": False,
            "status": "api_error",
            "code": r.status_code,
            "status_code": r.status_code,
        }
    except requests.Timeout:
        return {"success": False, "status": "api_error", "code": 503, "error": "timeout"}
    except requests.RequestException as exc:
        return {"success": False, "status": "api_error", "code": 503, "error": str(exc)}


# ── Assets ────────────────────────────────────────────────────────────────────

def fetch_heroes() -> List[Dict[str, Any]]:
    """
    GET https://api.deadlock-api.com/v1/assets/heroes
    Retourne la liste de tous les héros (id, name, disabled, in_development, …).

    ⚠️  NE PAS filtrer sur in_development : Victor (31) et Infernus (1) sont
        marqués in_development mais jouent en partie normale.
    """
    return _get(f"{_API_BASE}/v1/assets/heroes")  # type: ignore[return-value]


def fetch_item(item_id: int) -> Dict[str, Any]:
    """
    GET https://api.deadlock-api.com/v1/assets/items/{item_id}
    Retourne le dict item (id, name, shop_image_webp, …).
    """
    return _get(f"{_API_BASE}/v1/assets/items/{item_id}")  # type: ignore[return-value]


def fetch_items() -> List[Dict[str, Any]]:
    """
    GET https://assets.deadlock-api.com/v2/items
    Retourne la liste de tous les items.
    """
    return _get(f"{_ASSETS_BASE}/v2/items")  # type: ignore[return-value]


# ── Match ─────────────────────────────────────────────────────────────────────

def fetch_match_metadata(match_id: int) -> Dict[str, Any]:
    """
    GET https://api.deadlock-api.com/v1/matches/{match_id}/metadata
    Données post-partie complètes (players, duration_s, winning_team, …).
    Disponible uniquement APRÈS la fin de la partie.
    """
    return _get(f"{_API_BASE}/v1/matches/{match_id}/metadata")  # type: ignore[return-value]


def fetch_active_match(account_id: int) -> Optional[Dict[str, Any]]:
    """
    GET https://api.deadlock-api.com/v1/matches/active?account_id={account_id}
    Retourne le premier match actif visible, ou None.

    ⚠️  Limité au top-200 — retourne None pour la quasi-totalité des parties normales.
        Source fiable : console.log local (cf. log-watcher.ts).
    """
    data = _get(f"{_API_BASE}/v1/matches/active", params={"account_id": account_id})
    if isinstance(data, list):
        return data[0] if data else None
    matches = data.get("active_matches") if isinstance(data, dict) else []
    return matches[0] if matches else None


# ── Analytics ─────────────────────────────────────────────────────────────────

def fetch_item_stats(
    hero_id: int,
    enemy_hero_ids: Optional[List[int]] = None,
) -> List[Dict[str, Any]]:
    """
    GET https://api.deadlock-api.com/v1/analytics/item-stats
      ?hero_ids={hero_id}&enemy_hero_ids={e1,e2,…}
    Retourne [{item_id, wins, losses, matches, …}].
    Utilisé par l'overlay Item Suggestions (enemyTeam[].heroId de l'OCR worker).
    """
    params: Dict[str, Any] = {"hero_ids": hero_id}
    if enemy_hero_ids:
        params["enemy_hero_ids"] = ",".join(str(h) for h in enemy_hero_ids)
    return _get(f"{_API_BASE}/v1/analytics/item-stats", params=params)  # type: ignore[return-value]


# ── Joueurs ───────────────────────────────────────────────────────────────────

def fetch_player_hero_stats(account_id: int) -> List[Dict[str, Any]]:
    """
    GET https://api.deadlock-api.com/v1/players/{account_id}/hero-stats
    Retourne [{hero_id, matches_played, wins, kills, deaths, assists, last_played}].
    """
    return _get(f"{_API_BASE}/v1/players/{account_id}/hero-stats")  # type: ignore[return-value]


def fetch_player_mmr(account_ids: List[int]) -> List[Dict[str, Any]]:
    """
    GET https://api.deadlock-api.com/v1/players/mmr?account_ids={id1,id2,…}
    Retourne [{account_id, match_id, rank, division, division_tier}] — dernier MMR par joueur.
    rank encoding : tier = rank // 10, subrank = rank % 10.
    """
    return _get(  # type: ignore[return-value]
        f"{_API_BASE}/v1/players/mmr",
        params={"account_ids": ",".join(str(i) for i in account_ids)},
    )


def fetch_player_match_history(account_id: int) -> List[Dict[str, Any]]:
    """
    GET https://api.deadlock-api.com/v1/players/{account_id}/match-history
    Retourne la liste des dernières parties (résumé par match).
    """
    return _get(f"{_API_BASE}/v1/players/{account_id}/match-history")  # type: ignore[return-value]
