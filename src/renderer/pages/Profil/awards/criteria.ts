/**
 * Awards Criteria — match-level evaluation engine.
 *
 * Entry point: computeAwardsForMatch(accountId, meta) → AwardId[]
 *
 * Called by ProfilPage after Phase 3 (matchMetaMap is fully populated).
 * Data source: GET /v1/matches/{match_id}/metadata → RichMatchMeta.
 *
 * ── COMPUTABLE AWARDS (27 / 48) ────────────────────────────────────────────
 *
 * All metrics derived from the FINAL stats[] snapshot and player-level fields:
 *
 *   damage/min      = stats[final].player_damage    / (duration_s / 60)
 *   souls/min       = stats[final].net_worth         / (duration_s / 60)
 *     NOTE: net_worth is cumulative wealth at match end — the best proxy
 *     for souls farmed per minute available from the API.
 *   healing/min     = stats[final].player_healing    / (duration_s / 60)
 *   absorbed/min    = stats[final].damage_mitigated  / (duration_s / 60)
 *   objDmg/min      = stats[final].boss_damage       / (duration_s / 60)
 *   dmgTaken/min    = stats[final].player_damage_taken / (duration_s / 60)
 *   accuracy        = shots_hit / (shots_hit + shots_missed)
 *   KP%             = (kills + assists) / teamKills × 100
 *
 * Half-time metrics (Fell Off, Late Bloomer, Lane Dominator):
 *   Use the stats[] snapshot with the largest time_stamp_s ≤ duration_s / 2.
 *   killsAtHalf = that snapshot's cumulative kills value.
 *
 * ── KILLSTREAK APPROXIMATION (3 awards) ────────────────────────────────────
 *
 * Awards: Blaze of Glory (20), Heat Wave (15), On Fire (10).
 *
 * The API provides no per-kill timestamps, so we approximate:
 *   1. Collect death_details[].game_time_s → sort ascending.
 *   2. Build death-free intervals:
 *        [0 → first_death], [death_i → death_{i+1}], [last_death → match_end]
 *   3. For each interval, find the stats[] snapshots that bracket it:
 *        killsAtEnd   = stats[largest snap ≤ interval_end].kills
 *        killsAtStart = stats[largest snap ≤ interval_start].kills
 *        kills_in_window = killsAtEnd − killsAtStart
 *   4. maxKills = max across all intervals → approximate killstreak.
 *
 * LIMITATION: snapshots are spaced 3-6 min apart — short kill windows between
 * closely-spaced deaths are under-counted (conservative estimation).
 * If death_details is absent from a match, killstreak returns null and the
 * awards are skipped for that match.
 *
 * ── INDISPONIBLE AWARDS (21 / 48) ──────────────────────────────────────────
 *
 * The following fields are absent from CMsgMatchMetaDataContents (153 keys
 * verified in live API responses):
 *   • headshot count / accuracy  → Cranial Fixation, Skull Collector, Headhunter
 *   • parry attempts / hits      → Fisticuffs Firewall, Jab Jammer, Swiss Cheese Defense
 *   • antiheal dealt             → Toxic
 *   • per-ability damage         → Spammer
 *   • category scores            → 1v11, Did Everything, Specialist, Jack of All Trades
 *
 * These awards have computable: false in AWARD_DEFINITIONS and are never evaluated
 * here; the renderer displays them as "Données indisponibles".
 */

import type { RichMatchMeta, RichMetaPlayer, StatSnapshot } from '../matchDetail/types';
import type { AwardId } from '../../../../lib/awards';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** value / (duration_s / 60) — safe against zero duration. */
function perMin(value: number, durationS: number): number {
  return durationS > 0 ? value / (durationS / 60) : 0;
}

/** shots_hit / (shots_hit + shots_missed) — safe against zero denominator. */
function accuracy(snap: StatSnapshot): number {
  const total = snap.shots_hit + snap.shots_missed;
  return total > 0 ? snap.shots_hit / total : 0;
}

/** Last element of stats[], i.e. the end-of-match cumulative snapshot. */
function finalSnap(player: RichMetaPlayer): StatSnapshot | null {
  return player.stats.length > 0 ? player.stats[player.stats.length - 1] : null;
}

/**
 * Latest stats[] snapshot whose time_stamp_s does NOT exceed targetS.
 * Used for half-time comparisons (Fell Off, Late Bloomer, Lane Dominator).
 */
function snapAtOrBefore(stats: StatSnapshot[], targetS: number): StatSnapshot | null {
  const candidates = stats.filter(s => s.time_stamp_s <= targetS);
  return candidates.length > 0 ? candidates[candidates.length - 1] : null;
}

/**
 * Approximate the maximum consecutive-kills streak for this player.
 * Returns null when death_details is absent (data unavailable for this match).
 * See module-level JSDoc for the full approximation method.
 */
function approxKillstreak(player: RichMetaPlayer, durationS: number): number | null {
  if (!player.death_details) return null; // field absent — cannot estimate

  // No deaths at all → entire kill total forms a single streak
  if (player.death_details.length === 0) return player.kills;

  const snaps  = player.stats;
  if (!snaps.length) return null;

  const deaths = [...player.death_details].sort((a, b) => a.game_time_s - b.game_time_s);

  // Build contiguous intervals between deaths
  const intervals: Array<[number, number]> = [
    [0, deaths[0].game_time_s],
    ...deaths.slice(0, -1).map((d, i): [number, number] => [d.game_time_s, deaths[i + 1].game_time_s]),
    [deaths[deaths.length - 1].game_time_s, durationS],
  ];

  let maxKills = 0;
  for (const [start, end] of intervals) {
    const killsAtEnd   = snapAtOrBefore(snaps, end)?.kills   ?? 0;
    const killsAtStart = snapAtOrBefore(snaps, start)?.kills ?? 0;
    const window       = killsAtEnd - killsAtStart;
    if (window > maxKills) maxKills = window;
  }
  return maxKills;
}

// ── Main evaluation function ──────────────────────────────────────────────────

/**
 * Evaluate all computable awards for one match.
 * Returns the AwardIds earned by the given player in this match.
 *
 * @param accountId — identifies this player in meta.players
 * @param meta      — full RichMatchMeta from matchMetaMap
 */
export function computeAwardsForMatch(
  accountId: number,
  meta: RichMatchMeta,
): AwardId[] {
  const player = meta.players.find(p => p.account_id === accountId);
  if (!player) return [];

  const snap = finalSnap(player);
  if (!snap) return [];

  const earned: AwardId[] = [];
  const durationS = meta.duration_s;

  // ── Shared derived values ──────────────────────────────────────────────────

  // Team kill total for Kill Participation
  const teamKills  = meta.players
    .filter(p => p.team === player.team)
    .reduce((s, p) => s + p.kills, 0);
  const kpActions  = player.kills + player.assists; // absolute KP count
  const kpPercent  = teamKills > 0 ? (kpActions / teamKills) * 100 : 0;

  // Per-minute rates (all from final cumulative snapshot)
  const dmgPerMin      = perMin(snap.player_damage,       durationS);
  const soulsPerMin    = perMin(snap.net_worth,            durationS);
  const healPerMin     = perMin(snap.player_healing,       durationS);
  const absorbedPerMin = perMin(snap.damage_mitigated,     durationS);
  const objDmgPerMin   = perMin(snap.boss_damage,          durationS);
  const dmgTakenPerMin = perMin(snap.player_damage_taken,  durationS);
  const acc            = accuracy(snap);

  // Half-time kills (conservative — nearest snapshot at or before duration/2)
  const halfSnap          = snapAtOrBefore(player.stats, durationS / 2);
  const killsAtHalf       = halfSnap?.kills ?? 0;
  const killsSecondHalf   = player.kills - killsAtHalf;
  const halfRatio         = player.kills > 0 ? killsAtHalf / player.kills : 0;
  const secondHalfRatio   = player.kills > 0 ? killsSecondHalf / player.kills : 0;

  // Killstreak approximation (shared across 3 awards — computed once)
  const streak = approxKillstreak(player, durationS);

  // ── EPIC ──────────────────────────────────────────────────────────────────

  // Soul Reaper: 1.6k souls/min
  if (soulsPerMin >= 1600) earned.push('soul-reaper');

  // Immortal Bulwark: absorb 3k damage/min (damage_mitigated = total blocked/mitigated)
  if (absorbedPerMin >= 3000) earned.push('immortal-bulwark');

  // Military Industrial Complex: 1.5k damage AND 1.5k souls/min
  if (dmgPerMin >= 1500 && soulsPerMin >= 1500) earned.push('military-industrial-complex');

  // Damage Deity: 2k hero damage/min (player_damage = hero-only damage)
  if (dmgPerMin >= 2000) earned.push('damage-deity');

  // 1v11: computable: false — not evaluated

  // Blaze of Glory: 20 killstreak (approximated — may undercount, see module JSDoc)
  if (streak !== null && streak >= 20) earned.push('blaze-of-glory');

  // Accuracy God: 85% shot accuracy
  if (acc >= 0.85) earned.push('accuracy-god');

  // Angel: 1000 healing/min (player_healing includes ally + self heals)
  if (healPerMin >= 1000) earned.push('angel');

  // Boogey Man: 30 kills
  if (player.kills >= 30) earned.push('boogey-man');

  // City Flattener: 1.25k obj damage/min OR 40k+ total (boss_damage = buildings/objectives)
  if (objDmgPerMin >= 1250 || snap.boss_damage >= 40000) earned.push('city-flattener');

  // Cranial Fixation: computable: false — not evaluated

  // Full: 100k net_worth (cumulative souls accumulated over the match)
  if (snap.net_worth >= 100000) earned.push('full');

  // Omnipresent: 85%+ KP% AND 20+ KP actions
  if (kpPercent >= 85 && kpActions >= 20) earned.push('omnipresent');

  // ── RARE ──────────────────────────────────────────────────────────────────

  // Did Everything: computable: false — not evaluated

  // Soul Harvester: 1.4k souls/min
  if (soulsPerMin >= 1400) earned.push('soul-harvester');

  // Monster: 20 kills
  if (player.kills >= 20) earned.push('monster');

  // Heat Wave: 15 killstreak (approximated)
  if (streak !== null && streak >= 15) earned.push('heat-wave');

  // Field Commander: 75%+ KP% AND 20+ KP actions
  if (kpPercent >= 75 && kpActions >= 20) earned.push('field-commander');

  // Fortress: absorb 2.5k damage/min
  if (absorbedPerMin >= 2500) earned.push('fortress');

  // Lane Dominator: 15+ kills in the first half
  // killsAtHalf is cumulative kills at the snapshot closest to match midpoint —
  // conservative because kills between that snapshot and the true midpoint are missed.
  if (killsAtHalf >= 15) earned.push('lane-dominator');

  // Demolitionist: 1k obj damage/min OR 30k+ total
  if (objDmgPerMin >= 1000 || snap.boss_damage >= 30000) earned.push('demolitionist');

  // Hospital: 600 healing/min
  if (healPerMin >= 600) earned.push('hospital');

  // Precision Master: 80% accuracy
  if (acc >= 0.80) earned.push('precision-master');

  // ── UNCOMMON ──────────────────────────────────────────────────────────────

  // Damage Dreadnought: 1.5k damage/min
  if (dmgPerMin >= 1500) earned.push('damage-dreadnought');

  // On Fire: 10 killstreak (approximated)
  if (streak !== null && streak >= 10) earned.push('on-fire');

  // Fisticuffs Firewall: computable: false — not evaluated

  // Unkillable: no deaths
  if (player.deaths === 0) earned.push('unkillable');

  // Huge: 75k net_worth
  if (snap.net_worth >= 75000) earned.push('huge');

  // Medic: 400 healing/min
  if (healPerMin >= 400) earned.push('medic');

  // Sharpshooter: 70% accuracy
  if (acc >= 0.70) earned.push('sharpshooter');

  // Sieger: 750 obj damage/min
  if (objDmgPerMin >= 750) earned.push('sieger');

  // Skull Collector: computable: false — not evaluated

  // Team Player: 5× assists/kills AND 25+ assists
  // "5x as many assists as kills" → assists ≥ kills × 5 (kills=0 counts if assists ≥ 25)
  if (player.assists >= 25 && (player.kills === 0 || player.assists >= player.kills * 5)) {
    earned.push('team-player');
  }

  // Toxic: computable: false — not evaluated

  // ── COMMON ────────────────────────────────────────────────────────────────

  // Damage Powerhouse: 1k damage/min
  if (dmgPerMin >= 1000) earned.push('damage-powerhouse');

  // Farmer: 1.2k souls/min
  if (soulsPerMin >= 1200) earned.push('farmer');

  // Playmaker: 60%+ KP% AND 20+ KP actions
  if (kpPercent >= 60 && kpActions >= 20) earned.push('playmaker');

  // Iron Wall: absorb 2k damage/min
  if (absorbedPerMin >= 2000) earned.push('iron-wall');

  // Jab Jammer: computable: false — not evaluated
  // Spammer: computable: false — not evaluated
  // Specialist: computable: false — not evaluated
  // Jack of All Trades: computable: false — not evaluated

  // Supportive: 3× assists/kills AND 15+ assists
  if (player.assists >= 15 && (player.kills === 0 || player.assists >= player.kills * 3)) {
    earned.push('supportive');
  }

  // Pusher: 500 obj damage/min
  if (objDmgPerMin >= 500) earned.push('pusher');

  // Bubble Burster: 10+ denies (stats[final].denies = deny counter, not gold_denied)
  if (snap.denies >= 10) earned.push('bubble-burster');

  // Headhunter: computable: false — not evaluated

  // ── INFAMOUS ──────────────────────────────────────────────────────────────

  // Fell Off: 70% of kills in the first half — minimum 5 kills to avoid trivial cases
  if (player.kills >= 5 && halfRatio >= 0.70) earned.push('fell-off');

  // Preservationist: no objective damage
  if (snap.boss_damage === 0) earned.push('preservationist');

  // Swiss Cheese Defense: computable: false — not evaluated

  // AFK Jungler: <500 dmg/min AND <1.5k absorbed/min AND at least 1k net_worth
  // (1k net_worth threshold confirms the player was active, just not fighting)
  if (dmgPerMin < 500 && absorbedPerMin < 1500 && snap.net_worth >= 1000) {
    earned.push('afk-jungler');
  }

  // Coward: take less than 300 damage/min
  if (dmgTakenPerMin < 300) earned.push('coward');

  // Late Bloomer: 70% of kills in the second half — minimum 5 kills
  if (player.kills >= 5 && secondHalfRatio >= 0.70) earned.push('late-bloomer');

  // Nerf Gun: 400 damage/min or less
  if (dmgPerMin <= 400) earned.push('nerf-gun');

  // Feeder: 10+ deaths AND 3× deaths as kills
  if (player.deaths >= 10 && player.deaths >= player.kills * 3) earned.push('feeder');

  return earned;
}
