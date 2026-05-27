/**
 * Deadlock rank tier definitions.
 *
 * Tier numbering: 0 = unranked (hidden), 1–11 = Initiate through Eternus.
 * Badge level encoding: badge = tier × 10 + subtier (0–6).
 * API params: min_average_badge / max_average_badge (range 0–116).
 *
 * Source: /v1/assets/ranks (12 tiers, tiers 0–11).
 * Ordered from lowest (Initiate) to highest (Eternus) as confirmed by game data.
 */

export interface RankDef {
  tier: number;
  name: string;
  badgeMin: number;
  badgeMax: number;
}

export const RANKS: readonly RankDef[] = [
  { tier:  1, name: 'Initiate',  badgeMin:  10, badgeMax:  19 },
  { tier:  2, name: 'Seeker',    badgeMin:  20, badgeMax:  29 },
  { tier:  3, name: 'Alchemist', badgeMin:  30, badgeMax:  39 },
  { tier:  4, name: 'Arcanist',  badgeMin:  40, badgeMax:  49 },
  { tier:  5, name: 'Ritualist', badgeMin:  50, badgeMax:  59 },
  { tier:  6, name: 'Emissary',  badgeMin:  60, badgeMax:  69 },
  { tier:  7, name: 'Archon',    badgeMin:  70, badgeMax:  79 },
  { tier:  8, name: 'Oracle',    badgeMin:  80, badgeMax:  89 },
  { tier:  9, name: 'Phantom',   badgeMin:  90, badgeMax:  99 },
  { tier: 10, name: 'Ascendant', badgeMin: 100, badgeMax: 109 },
  { tier: 11, name: 'Eternus',   badgeMin: 110, badgeMax: 116 },
] as const;
