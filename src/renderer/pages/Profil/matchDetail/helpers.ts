/**
 * Match Detail Panel — shared helpers (data access + small render primitives).
 * Mostly pure functions; also a module-level cache for the Items tab's
 * ability-order fallback (see loadAbilityData / getAbilityData).
 */

import type {
  AbilityData, AbilityOrderSeq, DetailItem, HeroAbility, HeroAsset,
  RichMatchMeta, RichMetaItem, RichMetaPlayer, StatSnapshot,
} from './types';

const API = 'https://api.deadlock-api.com';

// ── Faction / lane colors ───────────────────────────────────────────────────
export const TEAM0_COLOR = '#c8a04f'; // The Amber Hand (gold)
export const TEAM1_COLOR = '#5b86d6'; // The Sapphire Flame (blue)

export const TEAM_NAME: Record<number, string> = {
  0: 'THE AMBER HAND',
  1: 'THE SAPPHIRE FLAME',
};

/** assigned_lane → border color (1 = blue, 4 = yellow, 6 = green). */
export function laneColor(lane: number): string {
  if (lane === 1) return '#5b86d6';
  if (lane === 4) return '#e0c14a';
  if (lane === 6) return '#4cc66e';
  return '#6b7280';
}

export function teamColor(team: number): string {
  return team === 0 ? TEAM0_COLOR : TEAM1_COLOR;
}

/** Fixed lane display order in Normal mode: yellow (4) → blue (1) → green (6). */
export const LANE_ORDER = [4, 1, 6];

export function isNormalMode(gameMode: number): boolean {
  return gameMode === 1;
}

/**
 * Order players for display. In Normal mode, by fixed lane order (yellow→blue→green)
 * then player_slot so lane partners are adjacent and lanes align across teams.
 * In other modes (e.g. Street Brawl), plain player_slot order.
 */
export function orderPlayers<T extends { assigned_lane: number; player_slot: number }>(
  players: T[], gameMode: number,
): T[] {
  if (!isNormalMode(gameMode)) return [...players].sort((a, b) => a.player_slot - b.player_slot);
  const rank = (lane: number) => { const i = LANE_ORDER.indexOf(lane); return i < 0 ? LANE_ORDER.length : i; };
  return [...players].sort((a, b) => rank(a.assigned_lane) - rank(b.assigned_lane) || a.player_slot - b.player_slot);
}

/** Distinct lanes present, in fixed display order (yellow→blue→green). */
export function orderedLanes(players: { assigned_lane: number }[]): number[] {
  const present = new Set(players.map((p) => p.assigned_lane));
  return LANE_ORDER.filter((l) => present.has(l));
}

// ── Formatting ───────────────────────────────────────────────────────────────
/** 1234567 → "1.2M", 12345 → "12.3k", 999 → "999". */
export function fmtCompact(n: number): string {
  const v = Math.round(n);
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (Math.abs(v) >= 10_000)    return `${(v / 1000).toFixed(1)}k`;
  if (Math.abs(v) >= 1000)      return `${(v / 1000).toFixed(1)}k`;
  return `${v}`;
}

/** Raw integer with thin-space thousands grouping: 11254 → "11 254". */
export function fmtRaw(n: number): string {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function fmtMinute(s: number): string {
  return `${Math.round(s / 60)}m`;
}

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string
  ));
}

// ── Hero / item asset access ─────────────────────────────────────────────────
export function heroIcon(heroMap: Map<number, HeroAsset>, heroId: number): string {
  const h = heroMap.get(heroId);
  return h?.images?.icon_hero_card_webp ?? h?.images?.minimap_image_webp ?? '';
}
export function heroMini(heroMap: Map<number, HeroAsset>, heroId: number): string {
  const h = heroMap.get(heroId);
  return h?.images?.minimap_image_webp ?? h?.images?.icon_hero_card_webp ?? '';
}
export function heroName(heroMap: Map<number, HeroAsset>, heroId: number): string {
  return heroMap.get(heroId)?.name ?? `Hero #${heroId}`;
}
export function itemImg(item: DetailItem): string {
  return item.shop_image_webp ?? item.shop_image ?? item.image_webp ?? '';
}

export function playerName(
  nameMap: Map<number, string>, accountId: number,
): string {
  return nameMap.get(accountId) ?? `#${accountId}`;
}

// ── stats[] access ───────────────────────────────────────────────────────────
/** Distinct, sorted snapshot timestamps for the whole match (read off the first player with stats). */
export function snapshotStamps(meta: RichMatchMeta): number[] {
  const p = meta.players.find((pl) => pl.stats?.length);
  return p ? p.stats.map((s) => s.time_stamp_s) : [];
}

/** Snapshot at a timeline index (clamped); -1 or out of range → final snapshot. */
export function snapshotAt(player: RichMetaPlayer, idx: number): StatSnapshot | undefined {
  const st = player.stats;
  if (!st?.length) return undefined;
  if (idx < 0 || idx >= st.length) return st[st.length - 1];
  return st[idx];
}

// ── Income breakdown (5 categories) ──────────────────────────────────────────
export interface IncomeBreakdown {
  laneCreeps: number;
  neutrals: number;
  playerKills: number;
  bosses: number;
  treasure: number;
  total: number;
}
export function incomeBreakdown(s: StatSnapshot): IncomeBreakdown {
  const laneCreeps  = (s.gold_lane_creep ?? 0) + (s.gold_lane_creep_orbs ?? 0);
  const neutrals    = (s.gold_neutral_creep ?? 0) + (s.gold_neutral_creep_orbs ?? 0);
  const playerKills = (s.gold_player ?? 0) + (s.gold_player_orbs ?? 0);
  const bosses      = (s.gold_boss ?? 0) + (s.gold_boss_orb ?? 0);
  const treasure    = s.gold_treasure ?? 0;
  return {
    laneCreeps, neutrals, playerKills, bosses, treasure,
    total: laneCreeps + neutrals + playerKills + bosses + treasure,
  };
}

export function shotsHitPct(s: StatSnapshot): number {
  const total = (s.shots_hit ?? 0) + (s.shots_missed ?? 0);
  return total > 0 ? (s.shots_hit / total) * 100 : 0;
}

// ── End-game build (6×2 grid) ────────────────────────────────────────────────
/** First 12 distinct, unsold shop items in purchase order — matches the Profil build grid. */
export function endGameBuild(items: RichMetaItem[], itemMap: Map<number, DetailItem>): DetailItem[] {
  const seen = new Set<number>();
  const out: DetailItem[] = [];
  for (const mi of items) {
    if (out.length >= 12) break;
    if (mi.sold_time_s !== 0 && mi.sold_time_s !== null) continue;
    if (seen.has(mi.item_id)) continue;
    const item = itemMap.get(mi.item_id);
    if (!item?.shop_image_webp || !item.item_tier) continue;
    seen.add(mi.item_id);
    out.push(item);
  }
  return out;
}

/** Distinct shop items at FIRST acquisition time (Item Timeline). Includes sold (flagged). */
export interface TimelineEntry { item: DetailItem; gameTimeS: number; sold: boolean; }
export function itemTimeline(items: RichMetaItem[], itemMap: Map<number, DetailItem>): TimelineEntry[] {
  const firstSeen = new Map<number, RichMetaItem>();
  for (const mi of items) {
    const item = itemMap.get(mi.item_id);
    if (!item?.shop_image_webp || !item.item_tier) continue; // shop items only
    const prev = firstSeen.get(mi.item_id);
    if (!prev || mi.game_time_s < prev.game_time_s) firstSeen.set(mi.item_id, mi);
  }
  return [...firstSeen.values()]
    .sort((a, b) => a.game_time_s - b.game_time_s)
    .map((mi) => ({
      item: itemMap.get(mi.item_id)!,
      gameTimeS: mi.game_time_s,
      sold: mi.sold_time_s !== 0 && mi.sold_time_s !== null,
    }));
}

// ── Item tooltip (name + stats + I–IV tier) ──────────────────────────────────
function itemDescText(item: DetailItem): string {
  const d = item.description;
  if (!d) return '';
  if (typeof d === 'string') return d;
  return (d.desc ?? d.active ?? d.passive ?? '').replace(/<[^>]+>/g, '').trim();
}
function itemStatLines(item: DetailItem): string[] {
  const props = item.properties;
  if (!props || !item.tooltip_sections?.length) return [];
  const lines: string[] = [];
  for (const section of item.tooltip_sections) {
    for (const attr of section.section_attributes ?? []) {
      for (const propName of attr.important_properties ?? []) {
        const p = props[propName];
        if (!p || lines.length >= 5) continue;
        const label = p.label ?? propName;
        const val   = p.value ?? '';
        const pre   = p.prefix ?? '';
        const post  = p.postfix ?? p.display_units ?? '';
        if (val) lines.push(`${label}: ${pre}${val}${post}`);
      }
    }
    if (lines.length >= 5) break;
  }
  return lines;
}

/**
 * Native-title tooltip text for an item icon: "Name — Tier II" + stat lines.
 * Meant for a `title="..."` attribute — clip-proof, unlike a CSS tooltip that
 * the match-history card's `overflow-hidden` would clip. Quotes escaped.
 */
export function itemTitle(item: DetailItem): string {
  const roman = ['', 'I', 'II', 'III', 'IV'][item.item_tier ?? 0] ?? '';
  const head  = roman ? `${item.name} — Tier ${roman}` : item.name;
  const stats = itemStatLines(item);
  const body  = stats.length ? stats.join('\n') : itemDescText(item).slice(0, 200);
  return (body ? `${head}\n${body}` : head).replace(/"/g, '&quot;');
}

// ── Advantage bar (team-vs-team comparison row) ──────────────────────────────
/**
 * One Lane-Stats / Economy comparison row: left value · LABEL · right value,
 * with a proportional two-color gauge and the leading side bolded.
 */
export function advantageBar(
  label: string, left: number, right: number,
  fmt: (n: number) => string = fmtCompact,
): string {
  const sum = left + right;
  const leftPct = sum > 0 ? (left / sum) * 100 : 50;
  const leftLead  = left > right;
  const rightLead = right > left;
  return `
    <div class="py-1.5">
      <div class="flex items-center justify-between text-sm mb-1">
        <span class="${leftLead ? 'text-white font-bold' : 'text-grey-400'} tabular-nums">${fmt(left)}</span>
        <span class="text-grey-500 text-[11px] uppercase tracking-wider">${label}</span>
        <span class="${rightLead ? 'text-white font-bold' : 'text-grey-400'} tabular-nums">${fmt(right)}</span>
      </div>
      <div class="flex h-1.5 rounded-full overflow-hidden bg-charcoal-300">
        <div style="width:${leftPct}%;background:${TEAM0_COLOR};${leftLead ? '' : 'opacity:.55;'}"></div>
        <div style="width:${100 - leftPct}%;background:${TEAM1_COLOR};${rightLead ? '' : 'opacity:.55;'}"></div>
      </div>
    </div>`;
}

/**
 * A ranked per-player row used by the Damage chart and the Economy sub-tab lists:
 * [hero icon] · [bar with player name] · value · optional %. Clickable when `action` set.
 */
export function playerStatRow(opts: {
  iconUrl: string; name: string; value: number; maxValue: number; color: string;
  pct?: number; selected?: boolean; slot?: number; action?: string;
  valueFmt?: (n: number) => string;
}): string {
  const f = opts.valueFmt ?? fmtCompact;
  const w = opts.maxValue > 0 ? (opts.value / opts.maxValue) * 100 : 0;
  const click = opts.action ? `data-action="${opts.action}" data-slot="${opts.slot ?? ''}" role="button"` : '';
  return `
    <div class="flex items-center gap-2 py-0.5 ${opts.action ? 'cursor-pointer' : ''} ${opts.selected ? 'ring-1 ring-dry-sage-400 rounded' : ''}" ${click}>
      ${opts.iconUrl
        ? `<img src="${opts.iconUrl}" class="w-5 h-5 rounded object-cover flex-shrink-0 pointer-events-none" alt="">`
        : `<div class="w-5 h-5 rounded bg-grey-700 flex-shrink-0"></div>`}
      <div class="relative flex-1 h-5 rounded bg-charcoal-300 overflow-hidden pointer-events-none">
        <div class="absolute inset-y-0 left-0 rounded" style="width:${w}%;background:${opts.color};opacity:.85;"></div>
        <span class="absolute inset-0 flex items-center px-2 text-[11px] text-white truncate">${escapeHtml(opts.name)}</span>
      </div>
      <span class="w-14 text-right text-grey-200 text-xs tabular-nums pointer-events-none">${f(opts.value)}</span>
      ${opts.pct !== undefined ? `<span class="w-12 text-right text-grey-500 text-[10px] tabular-nums pointer-events-none">${opts.pct.toFixed(1)}%</span>` : ''}
    </div>`;
}

// ── Donut chart (breakdown panels) ───────────────────────────────────────────
/**
 * Hand-rolled SVG donut + legend for a category breakdown (income / damage).
 * Segments draw clockwise from 12 o'clock; the center shows a headline total.
 * Legend type is intentionally large (text-base) for readability.
 */
export function donutChart(opts: {
  segments: { label: string; value: number; color: string }[];
  centerValue: string;
  centerLabel: string;
}): string {
  const R = 42, SW = 16, CX = 60, CY = 60, GAP = 1.5;
  const C = 2 * Math.PI * R;
  const total = opts.segments.reduce((s, x) => s + x.value, 0) || 1;

  let accBefore = 0;
  const arcs = opts.segments.filter((s) => s.value > 0).map((s) => {
    const frac = s.value / total;
    const dash = Math.max(frac * C - GAP, 0.5);
    const offset = -accBefore * C;
    accBefore += frac;
    return `<circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="${s.color}" stroke-width="${SW}"
              stroke-dasharray="${dash.toFixed(2)} ${C.toFixed(2)}" stroke-dashoffset="${offset.toFixed(2)}"/>`;
  }).join('');

  const legend = opts.segments.map((s, i) => {
    const pct = (s.value / total) * 100;
    return `<div class="flex items-center gap-2.5 md-rise" style="animation-delay:${i * 55}ms">
        <span class="w-3.5 h-3.5 rounded-sm flex-shrink-0" style="background:${s.color};box-shadow:0 0 8px ${s.color}66;"></span>
        <span class="text-grey-300 text-base flex-1 leading-tight">${escapeHtml(s.label)}</span>
        <span class="text-white text-base font-bold tabular-nums leading-tight">${fmtRaw(s.value)}</span>
        <span class="text-grey-500 text-sm tabular-nums w-14 text-right leading-tight">${pct.toFixed(1)}%</span>
      </div>`;
  }).join('');

  return `
    <div class="flex items-center gap-6 flex-wrap">
      <div class="relative w-[124px] h-[124px] flex-shrink-0 md-pop-in">
        <svg viewBox="0 0 120 120" class="w-full h-full -rotate-90">
          <circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="#26262b" stroke-width="${SW}"/>
          ${arcs}
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span class="text-white text-2xl font-bold leading-none tabular-nums">${opts.centerValue}</span>
          <span class="text-grey-500 text-[10px] uppercase tracking-widest mt-1">${escapeHtml(opts.centerLabel)}</span>
        </div>
      </div>
      <div class="flex-1 min-w-[200px] space-y-2">${legend}</div>
    </div>`;
}

// ── Ability-order fallback cache (Items tab) ─────────────────────────────────
// The match metadata has no real per-match skill order (ADR 0002), so we show
// the most-popular community sequence for each hero. Cached per hero_id.
const _abilityCache = new Map<number, AbilityData>();
const _abilityInflight = new Set<number>();

export function getAbilityData(heroId: number): AbilityData | undefined {
  return _abilityCache.get(heroId);
}

/** Fetch + cache the 4 signature abilities and the #1 upgrade sequence (by matches) for a hero. */
export async function loadAbilityData(heroId: number): Promise<void> {
  if (_abilityCache.has(heroId) || _abilityInflight.has(heroId)) return;
  _abilityInflight.add(heroId);
  try {
    const [abilitiesRaw, orderRaw] = await Promise.all([
      // GET /v1/assets/items/by-hero-id/{id} — hero signature abilities
      fetch(`${API}/v1/assets/items/by-hero-id/${heroId}`).then((r) => (r.ok ? r.json() : [])).catch(() => []),
      // GET /v1/analytics/ability-order-stats?hero_id={id} — community upgrade sequences (current patch)
      fetch(`${API}/v1/analytics/ability-order-stats?hero_id=${heroId}&min_matches=200`).then((r) => (r.ok ? r.json() : [])).catch(() => []),
    ]);
    const abilities: HeroAbility[] = (Array.isArray(abilitiesRaw) ? abilitiesRaw : [])
      .filter((a: HeroAbility) => a.name !== 'Melee' && !a.name.includes('_'))
      .slice(0, 4);
    const topSeq = (Array.isArray(orderRaw) ? (orderRaw as AbilityOrderSeq[]) : [])
      .sort((a, b) => b.matches - a.matches)[0] ?? null;
    _abilityCache.set(heroId, { abilities, topSeq });
  } catch {
    _abilityCache.set(heroId, { abilities: [], topSeq: null });
  } finally {
    _abilityInflight.delete(heroId);
  }
}

export function abilityImg(a: HeroAbility): string {
  return a.image_webp ?? a.image ?? '';
}
