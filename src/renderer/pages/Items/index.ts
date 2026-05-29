/**
 * Item Statistics — Global Items Page
 *
 * DATA FLOW:
 *   GET /v1/patches/big-days
 *     → string[] — ISO patch date strings (cached module-level)
 *   GET /v1/analytics/item-stats?min_unix_timestamp=...&max_unix_timestamp=...
 *     → ApiItemStat[] — wins/losses/matches per item across ALL heroes for the period
 *   GET /v1/analytics/hero-stats?min_unix_timestamp=...&max_unix_timestamp=...
 *     → AnalyticsHeroStat[] — per-hero match totals; summed to get global usage denominator
 *   GET /v1/assets/items (module-level cache shared with HeroDetailsPage)
 *     → ItemData[] — full item catalogue: name, icon, tier, cost, slot type
 */

import type {
  ItemData,
  ItemsPeriod,
  ItemsRankFilter,
  ApiItemStat,
  AnalyticsHeroStat,
  ItemStatRow,
} from '../../../lib/types';
import { RANKS } from '../../../lib/constants/ranks';
import { renderItemTierBadge, itemSlotColor } from '../../../lib/utils';

const API = 'https://api.deadlock-api.com';

// ── Module-level caches ───────────────────────────────────────────────────────
// Shared with HeroDetailsPage so navigating between the two pages doesn't
// re-download the ~3 MB items payload.
let _itemsCache: Map<number, ItemData> | null = null;
let _itemsFetch: Promise<Map<number, ItemData>> | null = null;

// GET /v1/assets/items — full item catalogue
function fetchItemsCache(): Promise<Map<number, ItemData>> {
  if (_itemsCache) return Promise.resolve(_itemsCache);
  if (_itemsFetch) return _itemsFetch;
  _itemsFetch = fetch(`${API}/v1/assets/items`)
    .then(r => (r.ok ? r.json() : Promise.resolve([])))
    .then((arr: ItemData[]) => {
      _itemsCache = new Map(arr.map(i => [i.id, i]));
      return _itemsCache;
    })
    .catch(() => {
      _itemsFetch = null;
      return new Map<number, ItemData>();
    });
  return _itemsFetch;
}

let _patchDaysCache: string[] | null = null;

// GET /v1/patches/big-days — cached after first fetch
async function fetchPatchDays(): Promise<string[]> {
  if (_patchDaysCache) return _patchDaysCache;
  const raw = await fetch(`${API}/v1/patches/big-days`)
    .then(r => (r.ok ? r.json() : Promise.resolve([])))
    .catch(() => []);
  _patchDaysCache = Array.isArray(raw) ? (raw as string[]).sort() : [];
  return _patchDaysCache;
}

/** Best icon URL for a shop item. Falls back through all known CDN fields. */
function itemImg(item: ItemData): string {
  return item.shop_image_webp
    ?? item.shop_image_small_webp
    ?? item.shop_image
    ?? item.shop_image_small
    ?? item.image_webp
    ?? item.image
    ?? '';
}

// ── Sort types ────────────────────────────────────────────────────────────────
type ItemsSortCol = 'name' | 'cost' | 'winRate' | 'winRateChange' | 'usage' | 'usageChange' | 'winloss';
type ItemsSortDir = 'asc' | 'desc';

// ── Default filter state ──────────────────────────────────────────────────────
const DEFAULT_PERIOD: ItemsPeriod = 'latest';
const DEFAULT_RANK: ItemsRankFilter = { mode: 'all', tier: 0 };
const DEFAULT_TIERS = new Set([1, 2, 3, 4]);
const DEFAULT_SORT_COL: ItemsSortCol = 'usage';
const DEFAULT_SORT_DIR: ItemsSortDir = 'desc';

export class MetaItemsPage {
  private container: HTMLElement | null = null;

  // ── Filter state ─────────────────────────────────────────────────────────────
  private itemsPeriod: ItemsPeriod = DEFAULT_PERIOD;
  private itemsRank: ItemsRankFilter = { ...DEFAULT_RANK };
  private itemsTiers: Set<number> = new Set(DEFAULT_TIERS);
  private itemsSortCol: ItemsSortCol = DEFAULT_SORT_COL;
  private itemsSortDir: ItemsSortDir = DEFAULT_SORT_DIR;

  // ── Data state ────────────────────────────────────────────────────────────────
  private items: Map<number, ItemData> = new Map();
  private currentStats: ApiItemStat[] = [];
  private refStats: ApiItemStat[] = [];
  private totalMatchesCur = 0;
  private totalMatchesRef = 0;
  private patchDays: string[] = [];
  private loading = false;
  private loaded = false;
  private error = false;

  // ─── Public API ──────────────────────────────────────────────────────────────

  mount(container: HTMLElement): void {
    this.container = container;
    this.resetFilters();
    this.renderSkeleton();
    this.fetchAll();
  }

  // ─── Data fetching ────────────────────────────────────────────────────────────

  /**
   * Parallel fetch: item catalogue + patch days, then item-stats + hero-stats.
   * Item-stats has no hero_ids filter → returns global stats across all heroes.
   * Hero-stats sums all heroes to get total match count (usage denominator).
   */
  private async fetchAll(): Promise<void> {
    if (this.loading) return;
    this.loading = true;
    this.error = false;
    this.renderPage();

    try {
      // Resolve patch days first (needed for timestamp calculation)
      this.patchDays = await fetchPatchDays();

      // Resolve 'latest' to the newest patch within the global data window (28 days).
      // Older patches cause 500 on the no-hero_ids endpoint — fall back to "7d" if
      // no recent patch exists.
      if (this.itemsPeriod === 'latest') {
        const windowCutoff = new Date(
          Date.now() - MetaItemsPage.MAX_GLOBAL_WINDOW_DAYS * 86400 * 1000
        ).toISOString().slice(0, 10);
        const recentPatch = [...this.patchDays].reverse().find(d => d >= windowCutoff);
        this.itemsPeriod = recentPatch ? (recentPatch as ItemsPeriod) : '7d';
      }

      const { curStart, curEnd, refStart, refEnd } = this.getPeriodTimestamps();
      const toArr = (r: Response): Promise<unknown[]> => (r.ok ? r.json() : Promise.resolve([]));

      const [itemsCatalogue, curItems, refItems, heroStatsCur, heroStatsRef] = await Promise.all([
        // GET /v1/assets/items — module-level cached
        fetchItemsCache(),
        // GET /v1/analytics/item-stats — no hero_ids = all heroes aggregated
        fetch(this.buildItemStatsUrl(curStart, curEnd)).then(toArr),
        fetch(this.buildItemStatsUrl(refStart, refEnd)).then(toArr),
        // GET /v1/analytics/hero-stats — sum all heroes for usage denominator
        fetch(this.buildHeroStatsUrl(curStart, curEnd)).then(toArr),
        fetch(this.buildHeroStatsUrl(refStart, refEnd)).then(toArr),
      ]);

      this.items = itemsCatalogue;
      this.currentStats = Array.isArray(curItems) ? (curItems as ApiItemStat[]) : [];
      this.refStats     = Array.isArray(refItems)  ? (refItems  as ApiItemStat[]) : [];

      // Sum all hero matches as global usage denominator
      this.totalMatchesCur = (Array.isArray(heroStatsCur) ? heroStatsCur as AnalyticsHeroStat[] : [])
        .reduce((acc, s) => acc + s.matches, 0);
      this.totalMatchesRef = (Array.isArray(heroStatsRef) ? heroStatsRef as AnalyticsHeroStat[] : [])
        .reduce((acc, s) => acc + s.matches, 0);

      this.loaded = true;
    } catch {
      this.error = true;
    } finally {
      this.loading = false;
      this.renderPage();
    }
  }

  // ── URL builders ──────────────────────────────────────────────────────────────

  /**
   * The global item-stats endpoint (no hero_ids) only retains data for ~30 days.
   * Sending timestamps older than that causes 500 errors on the server.
   * We clamp min_unix_timestamp to at most MAX_GLOBAL_WINDOW_DAYS days ago,
   * and always supply max_unix_timestamp so the query window is bounded.
   */
  private static readonly MAX_GLOBAL_WINDOW_DAYS = 28;

  // GET /v1/analytics/item-stats — global (no hero_ids filter)
  private buildItemStatsUrl(minTs: number, maxTs: number): string {
    const { safeMin, safeMax } = this.clampToGlobalWindow(minTs, maxTs);
    const p = new URLSearchParams();
    p.set('min_unix_timestamp', String(safeMin));
    p.set('max_unix_timestamp', String(safeMax));
    this.appendBadgeParams(p);
    return `${API}/v1/analytics/item-stats?${p}`;
  }

  // GET /v1/analytics/hero-stats — used to compute total match count denominator
  private buildHeroStatsUrl(minTs: number, maxTs: number): string {
    const { safeMin, safeMax } = this.clampToGlobalWindow(minTs, maxTs);
    const p = new URLSearchParams();
    p.set('min_unix_timestamp', String(safeMin));
    p.set('max_unix_timestamp', String(safeMax));
    this.appendBadgeParams(p);
    return `${API}/v1/analytics/hero-stats?${p}`;
  }

  /**
   * Clamps a [minTs, maxTs] window so it never exceeds MAX_GLOBAL_WINDOW_DAYS.
   * maxTs defaults to now if 0 (open-ended).
   * minTs is raised if it would be older than the allowed window.
   */
  private clampToGlobalWindow(minTs: number, maxTs: number): { safeMin: number; safeMax: number } {
    const now = Math.floor(Date.now() / 1000);
    const windowSecs = MetaItemsPage.MAX_GLOBAL_WINDOW_DAYS * 86400;
    const safeMax = maxTs > 0 ? Math.min(maxTs, now) : now;
    // The minimum start is safeMax minus the allowed window
    const earliestAllowed = safeMax - windowSecs;
    const safeMin = Math.max(minTs > 0 ? minTs : earliestAllowed, earliestAllowed);
    return { safeMin, safeMax };
  }

  /**
   * Appends min_average_badge / max_average_badge to URL params.
   * 'plus' mode omits max to include all ranks above the selected tier.
   */
  private appendBadgeParams(p: URLSearchParams): void {
    if (this.itemsRank.mode === 'all') return;
    const rank = RANKS.find(r => r.tier === this.itemsRank.tier);
    if (!rank) return;
    p.set('min_average_badge', String(rank.badgeMin));
    if (this.itemsRank.mode === 'exact') p.set('max_average_badge', String(rank.badgeMax));
  }

  /**
   * Converts the current period selection into two Unix-timestamp windows.
   * curStart–curEnd = the selected period.
   * refStart–refEnd = the immediately preceding period (change delta denominator).
   *
   * NOTE: clampToGlobalWindow() is applied later in buildItemStatsUrl /
   * buildHeroStatsUrl, so these raw timestamps can exceed 28 days — the clamping
   * happens at the URL-build level.
   */
  private getPeriodTimestamps(): { curStart: number; curEnd: number; refStart: number; refEnd: number } {
    const now = Math.floor(Date.now() / 1000);
    const day = 86400;

    const RELATIVE: Record<string, number> = { '7d': 7, '14d': 14, '30d': 30, '90d': 90 };
    if (RELATIVE[this.itemsPeriod] !== undefined) {
      const d = RELATIVE[this.itemsPeriod] * day;
      return { curStart: now - d, curEnd: now, refStart: now - 2 * d, refEnd: now - d };
    }

    const targetDate = this.itemsPeriod === 'latest'
      ? (this.patchDays[this.patchDays.length - 1] ?? null)
      : this.itemsPeriod;

    if (!targetDate) {
      return { curStart: now - 14 * day, curEnd: now, refStart: now - 28 * day, refEnd: now - 14 * day };
    }

    const dateIdx  = this.patchDays.indexOf(targetDate);
    const curStart = Math.floor(new Date(targetDate).getTime() / 1000);
    const curEnd   = dateIdx >= 0 && dateIdx < this.patchDays.length - 1
      ? Math.floor(new Date(this.patchDays[dateIdx + 1]).getTime() / 1000)
      : now;
    const refDate  = dateIdx > 0 ? this.patchDays[dateIdx - 1] : null;
    const refStart = refDate
      ? Math.floor(new Date(refDate).getTime() / 1000)
      : curStart - 14 * day;

    return { curStart, curEnd, refStart, refEnd: curStart };
  }

  // ── Computed rows ─────────────────────────────────────────────────────────────

  /**
   * Joins current and reference period stats into display rows.
   * Usage = item matches / total matches across all heroes.
   * Skips items without a slot type (abilities, passives).
   */
  private computeItemRows(): ItemStatRow[] {
    const curMap = new Map<number, ApiItemStat>(this.currentStats.map(s => [s.item_id, s]));
    const refMap = new Map<number, ApiItemStat>(this.refStats.map(s => [s.item_id, s]));
    const rows: ItemStatRow[] = [];

    for (const [itemId, cur] of curMap) {
      const item = this.items.get(itemId);
      if (!item?.item_slot_type) continue;

      const tier = item.item_tier ?? 0;
      if (tier > 0 && !this.itemsTiers.has(tier)) continue;

      const ref         = refMap.get(itemId);
      const winRate     = cur.matches > 0 ? (cur.wins / cur.matches) * 100 : 0;
      const refWinRate  = ref && ref.matches > 0 ? (ref.wins / ref.matches) * 100 : 0;
      const usagePct    = this.totalMatchesCur > 0 ? (cur.matches / this.totalMatchesCur) * 100 : 0;
      const refUsagePct = ref && this.totalMatchesRef > 0 ? (ref.matches / this.totalMatchesRef) * 100 : 0;

      rows.push({
        itemId,
        wins: cur.wins,
        losses: cur.losses,
        matches: cur.matches,
        winRate,
        winRateChange: ref ? winRate - refWinRate : 0,
        usagePct,
        usageChange: ref ? usagePct - refUsagePct : 0,
      });
    }

    rows.sort((a, b) => {
      let diff = 0;
      switch (this.itemsSortCol) {
        case 'name':
          diff = (this.items.get(a.itemId)?.name ?? '').localeCompare(this.items.get(b.itemId)?.name ?? '');
          break;
        case 'cost':
          diff = (this.items.get(a.itemId)?.cost ?? 0) - (this.items.get(b.itemId)?.cost ?? 0);
          break;
        case 'winRate':       diff = a.winRate - b.winRate; break;
        case 'winRateChange': diff = a.winRateChange - b.winRateChange; break;
        case 'usage':         diff = a.usagePct - b.usagePct; break;
        case 'usageChange':   diff = a.usageChange - b.usageChange; break;
        case 'winloss':       diff = a.wins - b.wins; break;
      }
      return this.itemsSortDir === 'desc' ? -diff : diff;
    });

    return rows;
  }

  // ── Filter helpers ────────────────────────────────────────────────────────────

  private resetFilters(): void {
    this.itemsPeriod  = DEFAULT_PERIOD;
    this.itemsRank    = { ...DEFAULT_RANK };
    this.itemsTiers   = new Set(DEFAULT_TIERS);
    this.itemsSortCol = DEFAULT_SORT_COL;
    this.itemsSortDir = DEFAULT_SORT_DIR;
  }

  /** Returns true when any filter deviates from the default state. */
  private isFiltered(): boolean {
    const latestPatch = this.patchDays.length > 0 ? this.patchDays[this.patchDays.length - 1] : '';
    const periodChanged = this.itemsPeriod !== latestPatch && this.itemsPeriod !== 'latest';
    const rankChanged   = this.itemsRank.mode !== 'all';
    const tierChanged   = this.itemsTiers.size !== 4 || ![1, 2, 3, 4].every(t => this.itemsTiers.has(t));
    return periodChanged || rankChanged || tierChanged;
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  private renderSkeleton(): void {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="p-8 bg-charcoal-100 min-h-screen animate-pulse">
        <div class="max-w-7xl mx-auto space-y-5">
          <div class="h-8 w-48 rounded bg-charcoal-300"></div>
          <div class="h-4 w-96 rounded bg-charcoal-300/60"></div>
          <div class="h-px bg-charcoal-400 w-full"></div>
          <div class="flex gap-3">
            <div class="h-9 w-40 rounded-lg bg-charcoal-300"></div>
            <div class="h-9 w-36 rounded-lg bg-charcoal-300"></div>
            <div class="flex gap-1">
              ${[1, 2, 3, 4].map(() => `<div class="h-9 w-12 rounded bg-charcoal-300"></div>`).join('')}
            </div>
          </div>
          <div class="rounded-xl border border-charcoal-400 overflow-hidden">
            <div class="bg-charcoal-300 h-10 w-full border-b border-charcoal-400"></div>
            ${Array.from({ length: 10 }).map((_, i) => `
              <div class="flex items-center gap-4 px-4 py-3 border-b border-charcoal-400 ${i % 2 === 0 ? 'bg-charcoal-100' : 'bg-charcoal-200/40'}">
                <div class="w-9 h-9 rounded bg-charcoal-300 shrink-0"></div>
                <div class="h-3 w-32 rounded bg-charcoal-300"></div>
                <div class="ml-auto flex items-center gap-6">
                  ${Array.from({ length: 5 }).map(() => `<div class="h-3 w-14 rounded bg-charcoal-300"></div>`).join('')}
                </div>
              </div>`).join('')}
          </div>
        </div>
      </div>`;
  }

  private renderPage(): void {
    if (!this.container) return;

    const rows = this.loaded ? this.computeItemRows() : [];

    this.container.innerHTML = `
      <div class="p-8 bg-charcoal-100 min-h-screen">
        <div class="max-w-7xl mx-auto space-y-5">

          <!-- Header -->
          <div>
            <h1 class="text-3xl font-bold text-white tracking-wide">Item Statistics</h1>
            <p class="text-dry-sage-500 text-sm mt-1">
              Analyze the meta trends for all Deadlock items, filtering by rank bracket, item type,
              item cost, and date range to uncover which items are most popular and how well they perform.
            </p>
            <div class="mt-4 h-px bg-gradient-to-r from-dry-sage-400/50 via-charcoal-400 to-transparent"></div>
          </div>

          <!-- Filter bar -->
          ${this.renderFilters()}

          <!-- Content -->
          ${this.error
            ? this.renderError()
            : this.loading
              ? this.renderTableSkeleton()
              : this.renderTable(rows)}

        </div>
      </div>`;

    this.bindEvents();
  }

  // ── Filter bar ────────────────────────────────────────────────────────────────

  private renderFilters(): string {
    const rankOpts = RANKS.map(r => `
      <option value="${r.tier}"  ${this.itemsRank.mode === 'exact' && this.itemsRank.tier === r.tier ? 'selected' : ''}>${r.name}</option>
      <option value="${r.tier}+" ${this.itemsRank.mode === 'plus'  && this.itemsRank.tier === r.tier ? 'selected' : ''}>${r.name} +</option>
    `).join('');

    // Only show patches within the last MAX_GLOBAL_WINDOW_DAYS days — older patches
    // cause 500 errors on the global item-stats endpoint (no data retention beyond that).
    const windowCutoff = new Date(
      Date.now() - MetaItemsPage.MAX_GLOBAL_WINDOW_DAYS * 86400 * 1000
    ).toISOString().slice(0, 10);
    const recentPatches = this.patchDays
      .filter(d => d >= windowCutoff)
      .slice(-7)
      .reverse();
    const patchOpts = recentPatches.length > 0
      ? `<optgroup label="Patches (last ${MetaItemsPage.MAX_GLOBAL_WINDOW_DAYS} days)">
          ${recentPatches.map((date, i) => `
            <option value="${date}" ${this.itemsPeriod === date ? 'selected' : ''}>
              ${date}${i === 0 ? ' — Latest Patch' : ''}
            </option>`).join('')}
         </optgroup>`
      : `<option value="7d" selected>Last 7 Days</option>`;

    const filtered = this.isFiltered();

    return `
      <div class="flex items-center gap-3 flex-wrap">

        <!-- Patch / period selector -->
        <select id="gi-period-select"
          class="bg-charcoal-200 border border-charcoal-400 text-grey-300 text-sm rounded-lg px-3 py-2
                 cursor-pointer hover:border-charcoal-300 focus:outline-none focus:border-dry-sage-400 transition-colors">
          ${patchOpts}
          <optgroup label="Relative Period">
            <option value="7d"  ${this.itemsPeriod === '7d'  ? 'selected' : ''}>Last 7 Days</option>
            <option value="14d" ${this.itemsPeriod === '14d' ? 'selected' : ''}>Last 14 Days</option>
            <option value="30d" ${this.itemsPeriod === '30d' ? 'selected' : ''}>Last Month</option>
            <option value="90d" ${this.itemsPeriod === '90d' ? 'selected' : ''}>3 Last Months</option>
          </optgroup>
        </select>

        <!-- Rank selector -->
        <select id="gi-rank-select"
          class="bg-charcoal-200 border border-charcoal-400 text-grey-300 text-sm rounded-lg px-3 py-2
                 cursor-pointer hover:border-charcoal-300 focus:outline-none focus:border-dry-sage-400 transition-colors">
          <option value="all" ${this.itemsRank.mode === 'all' ? 'selected' : ''}>All Ranks</option>
          ${rankOpts}
        </select>

        <!-- Tier toggle buttons -->
        <div class="flex items-center gap-1">
          ${[1, 2, 3, 4].map(t => `
            <button data-tier="${t}"
              class="gi-tier-btn px-3 py-1.5 text-sm font-semibold rounded border transition-colors
                ${this.itemsTiers.has(t)
                  ? 'bg-dry-sage-400/20 border-dry-sage-400 text-dry-sage-400'
                  : 'bg-charcoal-200 border-charcoal-400 text-grey-500 hover:border-charcoal-300 hover:text-grey-300'}">
              T${t}
            </button>`).join('')}
        </div>

        <!-- Refresh — resets all filters to default -->
        <button id="gi-refresh-btn" ${filtered ? '' : 'disabled'}
          class="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded border transition-colors
            ${filtered
              ? 'bg-dry-sage-400/20 border-dry-sage-400 text-dry-sage-400 hover:bg-dry-sage-400/30 cursor-pointer'
              : 'bg-charcoal-200 border-charcoal-400 text-grey-600 cursor-not-allowed opacity-50'}">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
               stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M4 4v5h5M20 20v-5h-5M4.93 14A8 8 0 1020 12"/>
          </svg>
          Refresh
        </button>

      </div>`;
  }

  // ── Table ─────────────────────────────────────────────────────────────────────

  private renderTableSkeleton(): string {
    return `
      <div class="overflow-x-auto rounded-xl border border-charcoal-400 animate-pulse">
        <div class="bg-charcoal-300 h-10 w-full border-b border-charcoal-400 rounded-t-xl"></div>
        ${Array.from({ length: 10 }).map((_, i) => `
          <div class="flex items-center gap-4 px-4 py-3 border-b border-charcoal-400
                      ${i % 2 === 0 ? 'bg-charcoal-100' : 'bg-charcoal-200/40'}">
            <div class="w-9 h-9 rounded bg-charcoal-300 shrink-0"></div>
            <div class="h-3 w-32 rounded bg-charcoal-300"></div>
            <div class="ml-auto flex items-center gap-6">
              ${Array.from({ length: 5 }).map(() => `<div class="h-3 w-14 rounded bg-charcoal-300"></div>`).join('')}
            </div>
          </div>`).join('')}
      </div>`;
  }

  private renderError(): string {
    return `
      <div class="flex flex-col items-center justify-center gap-4 py-24 text-grey-500">
        <div class="w-10 h-10 rounded-full border border-charcoal-400 flex items-center justify-center text-lg">!</div>
        <p class="text-sm">Failed to load item statistics.</p>
        <button id="gi-retry-btn"
          class="px-4 py-2 bg-charcoal-300 hover:bg-charcoal-200 text-grey-300 text-sm rounded-lg
                 border border-charcoal-400 transition-colors">
          Retry
        </button>
      </div>`;
  }

  private renderTable(rows: ItemStatRow[]): string {
    if (rows.length === 0) {
      return `
        <div class="flex flex-col items-center justify-center gap-3 py-16 text-grey-500">
          <p class="text-sm">No item data available for the selected filters.</p>
        </div>`;
    }

    return `
      <div class="overflow-x-auto rounded-xl border border-charcoal-400">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="bg-charcoal-300 border-b border-charcoal-400">
              ${this.sortTh('Item',          'name',          'left')}
              ${this.sortTh('Cost',          'cost',          'right')}
              ${this.sortTh('Win Rate',      'winRate',       'left')}
              ${this.sortTh('WR Change',     'winRateChange', 'right')}
              ${this.sortTh('Usage',         'usage',         'left')}
              ${this.sortTh('Usage Change',  'usageChange',   'right')}
              ${this.sortTh('Win / Loss',    'winloss',       'right')}
            </tr>
          </thead>
          <tbody>
            ${rows.map((row, i) => this.renderRow(row, i)).join('')}
          </tbody>
        </table>
      </div>`;
  }

  private sortTh(label: string, col: ItemsSortCol, align: 'left' | 'right'): string {
    const active   = this.itemsSortCol === col;
    const arrow    = active ? (this.itemsSortDir === 'desc' ? '↓' : '↑') : '↕';
    const color    = active ? 'text-dry-sage-400' : 'text-grey-500 hover:text-grey-300';
    const arrowCls = active ? 'text-dry-sage-400' : 'text-grey-700';
    return `
      <th class="px-4 py-3 ${align === 'right' ? 'text-right' : 'text-left'}">
        <button data-sort="${col}"
          class="gi-sort-btn flex items-center gap-1 text-[10px] uppercase tracking-widest font-medium
                 transition-colors whitespace-nowrap ${color} ${align === 'right' ? 'ml-auto' : ''}">
          ${label}
          <span class="${arrowCls} text-[11px]">${arrow}</span>
        </button>
      </th>`;
  }

  private renderRow(row: ItemStatRow, idx: number): string {
    const item    = this.items.get(row.itemId);
    const imgUrl  = item ? itemImg(item) : '';
    const name    = item?.name ?? `#${row.itemId}`;
    const cost    = item?.cost ?? null;
    const slotCol = itemSlotColor(item?.item_slot_type ?? undefined);

    return `
      <tr class="border-b border-charcoal-400
                 ${idx % 2 === 0 ? 'bg-charcoal-100' : 'bg-charcoal-200/40'}
                 hover:bg-charcoal-300/50 transition-colors">

        <!-- Item: icon + tier badge + name -->
        <td class="px-4 py-3">
          <div class="flex items-center gap-3">
            <div class="relative shrink-0" style="width:36px;height:36px;">
              <div class="w-full h-full rounded border bg-charcoal-300 overflow-hidden"
                   style="border-color:${slotCol}55;">
                ${imgUrl ? `<img src="${imgUrl}" alt="${name}" class="w-full h-full object-cover"/>` : ''}
                <div class="absolute bottom-0 left-0 right-0 h-0.5" style="background:${slotCol};"></div>
                ${item ? renderItemTierBadge({ item_tier: item.item_tier ?? undefined, item_slot_type: item.item_slot_type ?? undefined }) : ''}
              </div>
            </div>
            <span class="text-grey-900 text-sm font-medium">${name}</span>
          </div>
        </td>

        <!-- Cost -->
        <td class="px-4 py-3 text-right">
          ${cost !== null ? `
            <span class="inline-flex items-center gap-1.5 justify-end">
              <span class="w-2.5 h-2.5 rounded-full shrink-0"
                    style="background:#3b82f6;box-shadow:0 0 4px #3b82f655;"></span>
              <span class="text-blue-400 font-semibold text-xs">${cost.toLocaleString()}</span>
            </span>` : `<span class="text-grey-600 text-xs">—</span>`}
        </td>

        <!-- Win Rate -->
        <td class="px-4 py-3">
          <div class="flex flex-col gap-1" style="min-width:100px;">
            <span class="text-white text-sm font-semibold">${row.winRate.toFixed(2)}%</span>
            <div class="h-1 rounded-full bg-charcoal-400" style="width:100px;">
              <div class="h-full rounded-full bg-green-500 transition-all"
                   style="width:${Math.min(row.winRate, 100).toFixed(1)}%;"></div>
            </div>
          </div>
        </td>

        <!-- Win Rate Change -->
        <td class="px-4 py-3 text-right">
          <span class="${this.changeClass(row.winRateChange)} text-sm">
            ${this.formatChange(row.winRateChange)}
          </span>
        </td>

        <!-- Usage -->
        <td class="px-4 py-3">
          <div class="flex flex-col gap-1" style="min-width:100px;">
            <span class="text-white text-sm font-semibold">${row.usagePct.toFixed(2)}%</span>
            <div class="h-1 rounded-full bg-charcoal-400" style="width:100px;">
              <div class="h-full rounded-full bg-dry-sage-400 transition-all"
                   style="width:${Math.min(row.usagePct, 100).toFixed(1)}%;"></div>
            </div>
          </div>
        </td>

        <!-- Usage Change -->
        <td class="px-4 py-3 text-right">
          <span class="${this.changeClass(row.usageChange)} text-sm">
            ${this.formatChange(row.usageChange)}
          </span>
        </td>

        <!-- Win / Loss -->
        <td class="px-4 py-3 text-right">
          <span class="text-grey-400 text-xs font-medium whitespace-nowrap">
            ${this.formatK(row.wins)} / ${this.formatK(row.losses)}
          </span>
        </td>

      </tr>`;
  }

  // ── Event binding ─────────────────────────────────────────────────────────────

  private bindEvents(): void {
    const periodSel = this.container?.querySelector<HTMLSelectElement>('#gi-period-select');
    periodSel?.addEventListener('change', () => {
      this.itemsPeriod = periodSel.value as ItemsPeriod;
      this.loaded = false;
      this.currentStats = [];
      this.refStats = [];
      this.fetchAll();
    });

    const rankSel = this.container?.querySelector<HTMLSelectElement>('#gi-rank-select');
    rankSel?.addEventListener('change', () => {
      const val = rankSel.value;
      if (val === 'all') {
        this.itemsRank = { mode: 'all', tier: 0 };
      } else if (val.endsWith('+')) {
        this.itemsRank = { mode: 'plus', tier: parseInt(val) };
      } else {
        this.itemsRank = { mode: 'exact', tier: parseInt(val) };
      }
      this.loaded = false;
      this.currentStats = [];
      this.refStats = [];
      this.fetchAll();
    });

    // Tier toggles — client-side filter only, no re-fetch
    this.container?.querySelectorAll<HTMLButtonElement>('.gi-tier-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tier = parseInt(btn.dataset.tier ?? '');
        if (isNaN(tier)) return;
        if (this.itemsTiers.has(tier)) {
          this.itemsTiers.delete(tier);
        } else {
          this.itemsTiers.add(tier);
        }
        this.renderPage();
      });
    });

    // Sort headers — client-side re-sort only
    this.container?.querySelectorAll<HTMLButtonElement>('.gi-sort-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const col = btn.dataset.sort as ItemsSortCol;
        if (this.itemsSortCol === col) {
          this.itemsSortDir = this.itemsSortDir === 'desc' ? 'asc' : 'desc';
        } else {
          this.itemsSortCol = col;
          this.itemsSortDir = 'desc';
        }
        this.renderPage();
      });
    });

    // Refresh — resets ALL filters to defaults then re-fetches
    this.container?.querySelector<HTMLButtonElement>('#gi-refresh-btn')
      ?.addEventListener('click', () => {
        if (!this.isFiltered()) return;
        this.resetFilters();
        this.loaded = false;
        this.currentStats = [];
        this.refStats = [];
        this.fetchAll();
      });

    // Retry on error
    this.container?.querySelector<HTMLButtonElement>('#gi-retry-btn')
      ?.addEventListener('click', () => {
        this.error = false;
        this.fetchAll();
      });
  }

  // ── Formatting helpers ────────────────────────────────────────────────────────

  private changeClass(val: number): string {
    if (val >= 5)  return 'text-emerald-500 font-semibold';
    if (val > 0)   return 'text-green-400';
    if (val === 0) return 'text-grey-500';
    if (val > -5)  return 'text-orange-400';
    return 'text-red-600 font-bold';
  }

  private formatChange(val: number): string {
    if (val === 0) return '—';
    return `${val > 0 ? '+' : ''}${val.toFixed(2)}%`;
  }

  private formatK(n: number): string {
    return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);
  }
}
