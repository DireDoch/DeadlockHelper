/**
 * Rank Distribution Page
 *
 * DATA FLOW — tier badge images (local, always available):
 *   src/assets/icons/RankBadge/{RankName}.png — used in chart X-axis and list parent rows.
 *
 * DATA FLOW — sub-rank images (from API, best-effort):
 *   GET https://api.deadlock-api.com/v1/assets/ranks
 *   → Rank[] { tier, name, color, images: { small_subrank{1-6}_webp, … } }
 *   Fallback to local tier badge when API sub-rank image is absent.
 *
 * DATA FLOW — match distribution:
 *   GET https://api.deadlock-api.com/v1/analytics/badge-distribution
 *     ?game_mode=normal
 *     [&min_unix_timestamp=…&max_unix_timestamp=…]
 *   → BadgeDistributionEntry[] { badge_level, total_matches }
 *   badge_level encoding: tier = floor(badge_level / 10), subrank = badge_level % 10
 *   We keep only subranks 1–6 for tiers 1–11.
 */

import type { RankAsset, BadgeDistributionEntry } from '../../../lib/types';
import { RANKS } from '../../../lib/constants/ranks';

// Local tier badge images — one PNG per rank, named after the badge in the game
import initiatorBadge  from '../../../assets/icons/RankBadge/Initiator.png?url';
import seekerBadge     from '../../../assets/icons/RankBadge/Seekers.png?url';
import alchemistBadge  from '../../../assets/icons/RankBadge/Alchemist.png?url';
import arcanistBadge   from '../../../assets/icons/RankBadge/Arcanist.png?url';
import ritualistBadge  from '../../../assets/icons/RankBadge/Ritualist.png?url';
import emissaryBadge   from '../../../assets/icons/RankBadge/Emissary.png?url';
import archonBadge     from '../../../assets/icons/RankBadge/Archon.png?url';
import oracleBadge     from '../../../assets/icons/RankBadge/Oracle.png?url';
import phantomBadge    from '../../../assets/icons/RankBadge/Phantom.png?url';
import ascendantBadge  from '../../../assets/icons/RankBadge/Ascendent.png?url';
import eternusBadge    from '../../../assets/icons/RankBadge/Eternus.png?url';

const LOCAL_RANK_BADGES: Record<number, string> = {
  1:  initiatorBadge,
  2:  seekerBadge,
  3:  alchemistBadge,
  4:  arcanistBadge,
  5:  ritualistBadge,
  6:  emissaryBadge,
  7:  archonBadge,
  8:  oracleBadge,
  9:  phantomBadge,
  10: ascendantBadge,
  11: eternusBadge,
};

const DEADLOCK_API = 'https://api.deadlock-api.com';

type Period = '24h' | '7d' | '30d' | 'all';

interface RankData {
  subRankId: string;
  subRankName: string;
  tier: number;
  subRank: number;         // 1–6
  matchCount: number;
  colorHex: string;
  subRankImageUrl: string; // sub-rank specific icon, or '' for fallback circle
}

// Official rank colors, tier 1 (Initiate) → tier 11 (Eternus)
const RANK_COLORS: Record<number, string> = {
  1:  '#774D22',
  2:  '#8E445D',
  3:  '#4A5C8E',
  4:  '#436C2C',
  5:  '#BC6020',
  6:  '#D04F5F',
  7:  '#A96BBE',
  8:  '#A66325',
  9:  '#BFBFBF',
  10: '#EFD970',
  11: '#5AFFC3',
};

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'] as const;

function periodToTimestamps(period: Period): { min?: number; max?: number } {
  const now = Math.floor(Date.now() / 1000);
  if (period === '24h') return { min: now - 86_400,      max: now };
  if (period === '7d')  return { min: now - 7  * 86_400, max: now };
  if (period === '30d') return { min: now - 30 * 86_400, max: now };
  return {}; // 'all' — no timestamp filter
}

// Returns a grid step that gives ~4–7 horizontal lines for any scale
function niceGridStep(max: number): number {
  if (max <=  20_000) return  5_000;
  if (max <=  60_000) return 10_000;
  if (max <= 200_000) return 25_000;
  return 50_000;
}

function fmtNum(n: number): string {
  return n.toLocaleString('en-US');
}

export class RankDistributionPage {
  private container: HTMLElement | null = null;
  private currentPeriod: Period = '7d';
  private rankAssets = new Map<number, RankAsset>(); // tier → full asset (images + color)
  private tooltipController: AbortController | null = null; // cleans up listeners on re-wire

  mount(container: HTMLElement): void {
    this.container = container;
    this.renderSkeleton();
    this.fetchAndRender();
  }

  private renderSkeleton(): void {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="p-8 bg-charcoal-100 min-h-screen">
        <div class="max-w-full">
          <div class="flex items-center gap-3 mb-5">
            <div class="h-5 w-14 bg-charcoal-300 rounded animate-pulse"></div>
            <div class="h-7 w-28 bg-charcoal-300 rounded animate-pulse"></div>
          </div>
          <div class="mb-5">
            <div class="h-8 w-96 bg-charcoal-300 rounded animate-pulse mb-2"></div>
            <div class="h-4 bg-charcoal-300 rounded animate-pulse" style="width:480px;max-width:100%;"></div>
          </div>
          <div class="bg-charcoal-200 rounded-lg border border-grey-200 p-4 mb-6 animate-pulse">
            <div class="bg-charcoal-300 rounded" style="width:100%;height:420px;"></div>
          </div>
          <div class="space-y-2">
            ${Array.from({ length: 6 }).map(() => `
              <div class="h-20 bg-charcoal-200 rounded-lg border border-grey-200 animate-pulse"></div>`).join('')}
          </div>
        </div>
      </div>`;
  }

  /**
   * Parallel fetch:
   *   1. GET /v1/assets/ranks     — badge images for all tiers + sub-ranks (cached, never re-fetched)
   *   2. GET /v1/analytics/badge-distribution — real match counts for the current period
   */
  private async fetchAndRender(): Promise<void> {
    if (!this.container) return;

    const [ranksResult, distResult] = await Promise.allSettled([
      this.fetchRanks(),
      this.fetchDistribution(this.currentPeriod),
    ]);

    if (ranksResult.status === 'fulfilled') {
      for (const a of ranksResult.value) {
        if (a.tier >= 1 && a.tier <= 11) this.rankAssets.set(a.tier, a);
      }
    }

    const data = distResult.status === 'fulfilled'
      ? this.normalizeTo66(distResult.value)
      : this.normalizeTo66([]);

    this.renderFull(data);
  }

  // GET /v1/assets/ranks — returns Rank[] with sub-rank image fields
  private async fetchRanks(): Promise<RankAsset[]> {
    const res = await fetch(`${DEADLOCK_API}/v1/assets/ranks`);
    if (!res.ok) throw new Error(`ranks ${res.status}`);
    return res.json();
  }

  // GET /v1/analytics/badge-distribution — match counts per badge_level
  private async fetchDistribution(period: Period): Promise<RankData[]> {
    const ts  = periodToTimestamps(period);
    const url = new URL(`${DEADLOCK_API}/v1/analytics/badge-distribution`);
    url.searchParams.set('game_mode', 'normal');
    if (ts.min !== undefined) url.searchParams.set('min_unix_timestamp', String(ts.min));
    if (ts.max !== undefined) url.searchParams.set('max_unix_timestamp', String(ts.max));

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`badge-distribution ${res.status}`);
    const raw: BadgeDistributionEntry[] = await res.json();
    return this.mapDistribution(raw);
  }

  // Maps raw BadgeDistributionEntry[] → RankData[], filters to subranks 1–6 of tiers 1–11
  private mapDistribution(raw: BadgeDistributionEntry[]): RankData[] {
    const result: RankData[] = [];

    for (const entry of raw) {
      const tier    = Math.floor(entry.badge_level / 10);
      const subrank = entry.badge_level % 10;
      if (tier < 1 || tier > 11 || subrank < 1 || subrank > 6) continue;

      const rankDef = RANKS.find(r => r.tier === tier);
      if (!rankDef) continue;

      const asset   = this.rankAssets.get(tier);
      const imgUrl  =
        asset?.images?.[`small_subrank${subrank}_webp`] ??
        asset?.images?.[`small_subrank${subrank}`] ??
        asset?.images?.small_webp ??
        asset?.images?.small ??
        '';

      result.push({
        subRankId:        `${rankDef.name.toLowerCase()}-${subrank}`,
        subRankName:      `${rankDef.name} ${ROMAN[subrank - 1]}`,
        tier,
        subRank:          subrank,
        matchCount:       entry.total_matches,
        colorHex:         RANK_COLORS[tier] ?? '#888888',
        subRankImageUrl:  imgUrl,
      });
    }

    return result;
  }

  // Ensures exactly 66 entries (11 tiers × 6 sub-ranks), filling missing ones with 0
  private normalizeTo66(data: RankData[]): RankData[] {
    const byKey = new Map(data.map(d => [`${d.tier}-${d.subRank}`, d]));
    const result: RankData[] = [];

    for (const rank of RANKS) {
      for (let sr = 1; sr <= 6; sr++) {
        const existing = byKey.get(`${rank.tier}-${sr}`);
        if (existing) {
          result.push(existing);
        } else {
          // Missing badge level — use 0 and attempt to get sub-rank image
          const asset  = this.rankAssets.get(rank.tier);
          const imgUrl =
            asset?.images?.[`small_subrank${sr}_webp`] ??
            asset?.images?.[`small_subrank${sr}`] ??
            asset?.images?.small_webp ??
            asset?.images?.small ?? '';
          result.push({
            subRankId:       `${rank.name.toLowerCase()}-${sr}`,
            subRankName:     `${rank.name} ${ROMAN[sr - 1]}`,
            tier:            rank.tier,
            subRank:         sr,
            matchCount:      0,
            colorHex:        RANK_COLORS[rank.tier] ?? '#888888',
            subRankImageUrl: imgUrl,
          });
        }
      }
    }

    return result;
  }

  // ─── Full page render ─────────────────────────────────────────────────────────

  private renderFull(data: RankData[]): void {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="p-8 bg-charcoal-100 min-h-screen">
        <div class="max-w-full">
          ${this.renderPageHeader()}
          <div id="rd-chart-wrapper" class="bg-charcoal-200 rounded-lg border border-grey-200 p-4 mb-6 overflow-hidden">
            ${this.renderChart(data)}
          </div>
          <div id="rd-list-wrapper">
            ${this.renderList(data)}
          </div>
        </div>
      </div>`;

    const sel = this.container.querySelector<HTMLSelectElement>('#rd-period-select');
    if (sel) {
      sel.value = this.currentPeriod;
      sel.addEventListener('change', () => this.onPeriodChange(sel));
    }

    this.wireTooltips();
  }

  private async onPeriodChange(sel: HTMLSelectElement): Promise<void> {
    this.currentPeriod = sel.value as Period;

    const cw = this.container?.querySelector('#rd-chart-wrapper');
    const lw = this.container?.querySelector('#rd-list-wrapper');
    if (cw) cw.innerHTML = `<div class="bg-charcoal-300 rounded animate-pulse" style="width:100%;height:420px;"></div>`;
    if (lw) lw.innerHTML = Array.from({ length: 4 }).map(() =>
      `<div class="h-20 bg-charcoal-200 rounded-lg border border-grey-200 animate-pulse mb-2"></div>`).join('');

    try {
      const raw  = await this.fetchDistribution(this.currentPeriod);
      const data = this.normalizeTo66(raw);
      if (cw) cw.innerHTML = this.renderChart(data);
      if (lw) lw.innerHTML = this.renderList(data);
      this.wireTooltips(); // re-wire after every list re-render
    } catch {
      if (cw) cw.innerHTML = `<div class="p-6 text-grey-500 text-sm">Failed to load distribution data.</div>`;
    }
  }

  // ─── Tooltip ──────────────────────────────────────────────────────────────────
  //
  // Uses event delegation on #rd-list-wrapper so every .rd-tier-row and
  // .rd-sr-cell — present or future — is covered with a single listener set.
  // AbortController ensures listeners from previous renders are always removed
  // before new ones are attached, preventing duplication.

  private wireTooltips(): void {
    if (!this.container) return;

    // Abort any existing listener set before creating a new one
    this.tooltipController?.abort();
    this.tooltipController = new AbortController();
    const { signal } = this.tooltipController;

    // Fresh tooltip element each time
    document.getElementById('rd-tooltip')?.remove();
    const tt = document.createElement('div');
    tt.id = 'rd-tooltip';
    tt.style.cssText = 'position:fixed;z-index:9999;pointer-events:none;min-width:240px;display:none;';
    document.body.appendChild(tt);

    const lw = this.container.querySelector<HTMLElement>('#rd-list-wrapper');
    if (!lw) return;

    let activeCell: HTMLElement | null = null;

    const buildTooltip = (cell: HTMLElement): void => {
      const name   = cell.dataset.name  ?? '';
      const count  = parseInt(cell.dataset.count ?? '0', 10);
      const pct    = cell.dataset.pct   ?? '0.00';
      const from   = cell.dataset.from  ?? '0.00';
      const to     = cell.dataset.to    ?? '0.00';
      const img    = cell.dataset.img   ?? '';
      const period = this.currentPeriod === 'all' ? 'All' : this.currentPeriod;

      tt.innerHTML = `
        <div style="background:#252525;border:1px solid #494949;border-radius:8px;
                    box-shadow:0 8px 32px rgba(0,0,0,0.6);overflow:hidden;">
          <div style="display:flex;align-items:center;gap:12px;padding:14px 16px 12px;">
            <img src="${img}" alt="${name}"
                 style="width:40px;height:40px;object-fit:contain;flex-shrink:0;"/>
            <span style="color:#fff;font-weight:700;font-size:18px;letter-spacing:0.04em;">
              ${name.toUpperCase()}
            </span>
          </div>
          <div style="border-top:1px solid #373737;padding:12px 16px;
                      display:flex;flex-direction:column;gap:8px;">
            <div style="display:flex;justify-content:space-between;align-items:baseline;gap:24px;">
              <span style="color:#7d7c7a;font-size:13px;">Matches (Period ${period}):</span>
              <span style="color:#fff;font-size:13px;font-weight:600;">${fmtNum(count)}</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:baseline;gap:24px;">
              <span style="color:#7d7c7a;font-size:13px;">Percentage:</span>
              <span style="color:#fff;font-size:13px;font-weight:600;">${pct}%</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:baseline;gap:24px;">
              <span style="color:#7d7c7a;font-size:13px;">From:</span>
              <span style="color:#fff;font-size:13px;font-weight:600;">${from}% to ${to}%</span>
            </div>
          </div>
        </div>`;
    };

    lw.addEventListener('mouseover', (e) => {
      const target = e.target as HTMLElement;
      const cell   = target.closest<HTMLElement>('.rd-sr-cell, .rd-tier-row');

      if (cell === activeCell) return; // still on same cell — nothing to do
      activeCell = cell ?? null;

      if (!cell) { tt.style.display = 'none'; return; }

      buildTooltip(cell);
      tt.style.display = 'block';
      this.positionTooltip(tt, e as MouseEvent);
    }, { signal });

    lw.addEventListener('mousemove', (e) => {
      if (activeCell) this.positionTooltip(tt, e as MouseEvent);
    }, { signal });

    lw.addEventListener('mouseleave', () => {
      activeCell = null;
      tt.style.display = 'none';
    }, { signal });
  }

  private positionTooltip(tt: HTMLElement, e: MouseEvent): void {
    const offset = 14;
    const tw = tt.offsetWidth  || 240;
    const th = tt.offsetHeight || 140;
    let left = e.clientX + offset;
    let top  = e.clientY - th - offset;
    if (left + tw > window.innerWidth  - 8) left = e.clientX - tw - offset;
    if (top < 8)                             top  = e.clientY + offset;
    tt.style.left = `${left}px`;
    tt.style.top  = `${top}px`;
  }

  private renderPageHeader(): string {
    return `
      <div class="mb-6">
        <div class="flex items-center gap-3 mb-4">
          <label class="text-grey-500 text-sm font-medium" for="rd-period-select">Period</label>
          <select id="rd-period-select"
            class="bg-charcoal-300 border border-grey-200 text-white text-sm rounded
                   px-3 py-1.5 focus:outline-none focus:border-dry-sage-400
                   cursor-pointer hover:border-grey-600 transition-colors">
            <option value="24h">24 hours</option>
            <option value="7d">7 days</option>
            <option value="30d">30 days</option>
            <option value="all">All</option>
          </select>
        </div>
        <h1 class="text-2xl font-bold text-white tracking-wide mb-1">
          Deadlock Match Rank Distribution
        </h1>
        <p class="text-grey-500 text-sm mb-4">
          This chart shows how many matches were played at each Deadlock badge level for the selected period.
        </p>
        <div class="border-b border-grey-200 pb-3">
          <span class="inline-block text-white text-sm font-medium pb-3 border-b-2 border-dry-sage-400">
            Ranks and Subranks
          </span>
          <p class="text-grey-500 text-xs mt-2">Explore all ranks, their subranks, and match distribution</p>
        </div>
      </div>`;
  }

  // ─── SVG Chart ────────────────────────────────────────────────────────────────

  private renderChart(data: RankData[]): string {
    const maxVal = Math.max(...data.map(d => d.matchCount), 1);
    const minVal = Math.min(...data.filter(d => d.matchCount > 0).map(d => d.matchCount), maxVal);
    const step   = niceGridStep(maxVal);

    // Coordinate system  (MB enlarged to fit 2× badge icons below the chart)
    const VW = 1100, VH = 490;
    const ML = 78, MT = 22, MB = 150, MR = 15;
    const cX = ML, cY = MT, cW = VW - ML - MR, cH = VH - MT - MB, cBot = cY + cH;

    const yOf = (v: number) => cBot - (v / maxVal) * cH;

    // Bar layout: 11 groups × 6 bars
    const GROUP_GAP = 12, BAR_GAP = 2;
    const gW = (cW - 10 * GROUP_GAP) / 11;
    const bW = (gW - 5 * BAR_GAP) / 6;
    const gX  = (t: number) => cX + t * (gW + GROUP_GAP);
    const bX  = (t: number, s: number) => gX(t) + s * (bW + BAR_GAP);
    const bdX = (t: number) => gX(t) + gW / 2;

    let out = `<defs>
      <clipPath id="rd-clip">
        <rect x="${cX}" y="${cY}" width="${cW}" height="${cH}"/>
      </clipPath>
    </defs>`;

    // Grid lines (every `step`)
    for (let v = 0; v <= Math.ceil(maxVal / step) * step; v += step) {
      const gy = yOf(v);
      if (gy < cY - 2) break;
      out += `
        <line x1="${cX}" y1="${gy.toFixed(1)}" x2="${cX + cW}" y2="${gy.toFixed(1)}"
              stroke="#2a2a2a" stroke-width="1" stroke-dasharray="4,4"/>
        <text x="${(cX - 6).toFixed(1)}" y="${(gy + 4).toFixed(1)}"
              text-anchor="end" font-size="11" fill="#636261" font-family="monospace">${fmtNum(v)}</text>`;
    }

    // Min dashed line (amber)
    const minY = yOf(minVal);
    out += `
      <line x1="${cX}" y1="${minY.toFixed(1)}" x2="${cX + cW}" y2="${minY.toFixed(1)}"
            stroke="#EFD970" stroke-width="1.5" stroke-dasharray="6,3" opacity="0.75"/>
      <text x="${(cX - 6).toFixed(1)}" y="${(minY - 3).toFixed(1)}"
            text-anchor="end" font-size="10" fill="#EFD970" font-weight="bold"
            font-family="monospace">${fmtNum(minVal)}</text>`;

    // Max dashed line (mint)
    const maxY = yOf(maxVal);
    out += `
      <line x1="${cX}" y1="${maxY.toFixed(1)}" x2="${cX + cW}" y2="${maxY.toFixed(1)}"
            stroke="#5AFFC3" stroke-width="1.5" stroke-dasharray="6,3" opacity="0.75"/>
      <text x="${(cX - 6).toFixed(1)}" y="${(maxY - 3).toFixed(1)}"
            text-anchor="end" font-size="10" fill="#5AFFC3" font-weight="bold"
            font-family="monospace">${fmtNum(maxVal)}</text>`;

    // Bars (clipped)
    out += `<g clip-path="url(#rd-clip)">`;
    for (const item of data) {
      const tIdx   = item.tier - 1;
      const sIdx   = item.subRank - 1;
      const x      = bX(tIdx, sIdx);
      const bH     = (item.matchCount / maxVal) * cH;
      const y      = cBot - bH;
      const opaque = (1 - sIdx * 0.04).toFixed(2); // 1.00 (I) → 0.80 (VI)
      out += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}"
                    width="${bW.toFixed(1)}" height="${bH.toFixed(1)}"
                    fill="${item.colorHex}" opacity="${opaque}" rx="1"/>`;
    }
    out += `</g>`;

    // Axes
    out += `
      <line x1="${cX}" y1="${cY}" x2="${cX}" y2="${cBot}" stroke="#3a3a3a" stroke-width="1"/>
      <line x1="${cX}" y1="${cBot}" x2="${cX + cW}" y2="${cBot}" stroke="#3a3a3a" stroke-width="1"/>
      <text x="${(cX - 6).toFixed(1)}" y="${(cBot + 4).toFixed(1)}"
            text-anchor="end" font-size="11" fill="#636261" font-family="monospace">0</text>`;

    // Tier badge icons (X-axis) — 2× larger than original (36 → 72)
    const iconSize = 72, iconY = cBot + 16;
    for (const rank of RANKS) {
      const tIdx   = rank.tier - 1;
      const cx     = bdX(tIdx);
      const imgUrl = LOCAL_RANK_BADGES[rank.tier] ?? '';
      out += `<image href="${imgUrl}"
                     x="${(cx - iconSize / 2).toFixed(1)}" y="${iconY.toFixed(1)}"
                     width="${iconSize}" height="${iconSize}" style="image-rendering:auto;"/>`;
    }

    return `<svg width="100%" height="${VH}" viewBox="0 0 ${VW} ${VH}" preserveAspectRatio="none">
      ${out}
    </svg>`;
  }

  // ─── Detailed list (grid layout) ─────────────────────────────────────────────

  private renderList(data: RankData[]): string {
    const totalAll = data.reduce((s, d) => s + d.matchCount, 0) || 1;

    // Cumulative percentile bands for each sub-rank (used in tooltip "From … to …")
    const cumulMap = new Map<string, { from: string; to: string }>();
    let running = 0;
    for (const item of data) {
      const fromPct = (running / totalAll) * 100;
      running += item.matchCount;
      const toPct = (running / totalAll) * 100;
      cumulMap.set(item.subRankId, {
        from: fromPct.toFixed(2),
        to:   toPct.toFixed(2),
      });
    }

    const byTier = new Map<number, RankData[]>();
    for (const item of data) {
      if (!byTier.has(item.tier)) byTier.set(item.tier, []);
      byTier.get(item.tier)!.push(item);
    }

    // Normalize progress bar to the highest-volume tier
    const maxTierTotal = Math.max(
      ...RANKS.map(r => (byTier.get(r.tier) ?? []).reduce((s, d) => s + d.matchCount, 0)), 1
    );

    const rows = RANKS.map(rank => {
      const tierItems = byTier.get(rank.tier) ?? [];
      const tierTotal = tierItems.reduce((s, d) => s + d.matchCount, 0);
      const tierPct   = ((tierTotal / totalAll) * 100).toFixed(2);
      const barW      = ((tierTotal / maxTierTotal) * 100).toFixed(1);
      const color     = RANK_COLORS[rank.tier] ?? '#888888';
      // Tier badge — 3× original w-8 (32px) → w-24 (96px)
      const tierImg   = LOCAL_RANK_BADGES[rank.tier] ?? '';
      const tierBadge = `<img src="${tierImg}" alt="${rank.name}" class="w-24 h-24 object-contain shrink-0"/>`;

      // Sub-ranks — 3-column grid (2 rows of 3), icons 3× original w-5 (20px) → w-16 (64px)
      const subGrid = `
        <div class="grid grid-cols-3 border-t border-grey-200/20 gap-px bg-grey-200/20">
          ${tierItems.map(sr => {
            const srPct  = ((sr.matchCount / totalAll) * 100).toFixed(2);
            const cumul  = cumulMap.get(sr.subRankId) ?? { from: '0.00', to: '0.00' };
            const srImg  = sr.subRankImageUrl || LOCAL_RANK_BADGES[sr.tier] || '';
            const srBadge = `<img src="${srImg}" alt="${sr.subRankName}"
                                  class="w-16 h-16 object-contain shrink-0"/>`;
            return `
              <div class="rd-sr-cell flex items-center gap-4 px-5 py-4
                          border-r border-grey-200/20 last:border-r-0 min-w-0
                          cursor-default hover:bg-charcoal-300 transition-colors duration-150"
                   data-name="${sr.subRankName}"
                   data-count="${sr.matchCount}"
                   data-pct="${srPct}"
                   data-from="${cumul.from}"
                   data-to="${cumul.to}"
                   data-img="${srImg}">
                ${srBadge}
                <div class="min-w-0">
                  <div class="text-grey-400 text-xl truncate">${sr.subRankName}</div>
                  <div class="text-white text-xl font-semibold">${fmtNum(sr.matchCount)}</div>
                  <div class="text-grey-500 text-lg">${srPct}%</div>
                </div>
              </div>`;
          }).join('')}
        </div>`;

      // Tier cumulative band: from start of first sub-rank to end of last sub-rank
      const firstSr = tierItems[0];
      const lastSr  = tierItems[tierItems.length - 1];
      const tierFrom = firstSr ? (cumulMap.get(firstSr.subRankId)?.from ?? '0.00') : '0.00';
      const tierTo   = lastSr  ? (cumulMap.get(lastSr.subRankId)?.to   ?? '0.00') : '0.00';

      return `
        <div class="bg-charcoal-200 rounded-lg border border-grey-200 overflow-hidden">
          <div class="rd-tier-row flex items-center gap-5 px-5 py-4
                      cursor-default hover:bg-charcoal-300 transition-colors duration-150"
               data-name="${rank.name}"
               data-count="${tierTotal}"
               data-pct="${tierPct}"
               data-from="${tierFrom}"
               data-to="${tierTo}"
               data-img="${tierImg}">
            ${tierBadge}
            <div class="flex-1 min-w-0">
              <span class="text-white font-semibold text-2xl">${rank.name}</span>
              <span class="text-grey-500 text-xl ml-3">— Matches: ${fmtNum(tierTotal)} (${tierPct}%)</span>
            </div>
            <div class="w-48 bg-charcoal-400 rounded-full h-2 shrink-0 overflow-hidden">
              <div class="h-2 rounded-full transition-all duration-500"
                   style="width:${barW}%;background-color:${color};"></div>
            </div>
          </div>
          ${subGrid}
        </div>`;
    });

    return `
      <div class="mb-4">
        <h2 class="text-white font-bold text-2xl">Deadlock Match Rank Distribution</h2>
        <p class="text-grey-500 text-sm mt-1">
          This chart shows how many matches were played at each Deadlock badge level for the selected period.
        </p>
      </div>
      <div class="space-y-4 pb-8">${rows.join('')}</div>`;
  }
}
