# Match Detail "Ability Build" uses the most-popular community order

The Items tab's Ability Build section shows the **#1 most-popular upgrade sequence (by match count) for the player's hero in the current patch**, from `GET /v1/analytics/ability-order-stats?hero_id={id}` — one grid per selected player — explicitly labeled "ordre communautaire (patch actuel) — pas celui de ce match."

This supersedes [ADR 0001](0001-match-ability-order-unavailable.md): the underlying fact is unchanged (the match metadata contains no real per-match skill order), but rather than leave the section empty we surface the community-recommended order as a useful, clearly-disclaimed fallback. The data is fetched lazily and cached per `hero_id`; while loading, the section shows a spinner.

## Status

accepted

## Consequences

- Readers see a plausible skill order, but it is **not** the player's actual choices — the label must stay to avoid misleading them.
- Adds two cached fetches per distinct hero shown in the Items tab (`by-hero-id` + `ability-order-stats`); both reuse a module-level cache.
- If the match API ever exposes the real order, prefer it and downgrade this to the fallback path.
