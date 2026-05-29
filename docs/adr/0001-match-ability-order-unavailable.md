# Match Detail "Ability Build" shows no in-match skill order

The Items tab of the [[match-detail-panel]] omits the per-level ability/skill-order grid seen in the design screenshots, showing only the Item Timeline plus a short "not provided by the match API" note.

We verified this against the live API: across **all 153 distinct keys** of a real `GET /v1/matches/{id}/metadata` response (`CMsgMatchMetaDataContents`), the only ability-related fields are a single total `ability_points`, plus `ability_stats` / `book_rewards` / `hero_equips` which were **empty** — there is no leveling order, and not even per-ability final levels. The only `ability_order` anywhere in the API is on *community builds* (`/v1/builds` → `BuildHeroDetailsAbilityOrder`), reachable per player only through `hero_build_id`, which (a) was absent on all 12 players in the verified sample ("enriched if available") and (b) has no `/v1/builds/{id}` fetch-by-id endpoint anyway. Showing the hero's aggregate/community order was rejected because, inside a specific match view, a reader would read it as that player's real choices.

## Status

superseded by ADR-0002 — the verification still holds (no real per-match order exists), but we now fill the section with a clearly-labeled community fallback instead of leaving it empty.

## Consequences

- The screenshots' skill-order grid is intentionally **not** implemented; future readers should not treat its absence as an unfinished feature.
- If Valve/the API later populates `ability_stats` with leveling data (or adds a build-by-id endpoint), revisit this — the Items tab already reserves the section.
