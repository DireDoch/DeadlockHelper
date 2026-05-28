/**
 * Hero Details Page
 *
 * DATA FLOW:
 *   hero.images.background_image_webp  → sticky header background (from HeroLibrary fetch)
 *   GET /v1/builds?hero_id={id}&sort_by=weekly_favorites&limit=3&only_latest=true&build_language=English
 *     → top 3 English community builds — name, details.mod_categories, details.ability_order
 *       build.hero_build.details.mod_categories[].mods[].ability_id = shop item ID
 *       build.hero_build.details.ability_order.currency_changes[].ability_id = hero ability ID
 *   GET /v1/analytics/hero-build-stats/{id}
 *     → HeroBuildStats[] — wins/losses/matches per hero_build_id
 *   GET /v1/assets/items
 *     → Item[] — all items/abilities/upgrades; cached module-level across navigations
 *       item.item_slot_type: 'weapon' | 'spirit' | 'vitality' (damage type split)
 *       item.shop_image_webp (best icon for shop items) > shop_image_small_webp > shop_image > image_webp > image
 *       item.cost — price shown in tooltip
 *       item.description.desc/.active/.passive — tooltip body
 *       item.tooltip_sections[].section_attributes[].important_properties → stat names
 *       item.properties[statName].label/.value/.prefix/.postfix → formatted stat rows
 *   GET /v1/assets/items/by-hero-id/{id}
 *     → Ability[] — hero signature abilities; image_webp / image (unlock order + skill path rows)
 *       Only abilities that appear in ability-order-stats are shown (filters out hidden ultimate)
 *   GET /v1/analytics/ability-order-stats?hero_id={id}&min_matches=200
 *     → AbilityOrderStats[] — top skill-upgrade sequences; abilities[] = ordered ability IDs
 */

import abilityLearnUrl from '../../../assets/icons/ability-learn.png?url';
import type {
  HeroData,
  BuildData,
  BuildStats,
  ItemData,
  AbilityOrderStats,
  HeroAbilityItem,
  ItemsPeriod,
  ItemsRankFilter,
  ApiItemStat,
  AnalyticsHeroStat,
  ItemStatRow,
} from '../../../lib/types';
import { RANKS } from '../../../lib/constants/ranks';

const API = 'https://api.deadlock-api.com';

// ── Module-level items cache (survives hero navigation) ───────────────────────
// Stored at module scope (not on the class instance) so that navigating between
// heroes does NOT discard the ~3 MB items payload.  Every HeroDetailsPage instance
// shares the same resolved Map; only the very first hero triggers a network fetch.
let _itemsCache: Map<number, ItemData> | null = null;
let _itemsFetch: Promise<Map<number, ItemData>> | null = null;

/**
 * GET /v1/assets/items — full catalogue of items, abilities, and upgrades.
 * Fields used: id, name, class_name, item_slot_type, item_tier, cost,
 *   shop_image_webp / image_webp (icon), description, properties,
 *   tooltip_sections, weapon_info, ability_type, upgrades.
 *
 * Promise-deduplicated: if two hero navigations fire before the first response
 * arrives, both await the same in-flight promise instead of issuing two requests.
 */
function fetchItemsCache(): Promise<Map<number, ItemData>> {
  if (_itemsCache) return Promise.resolve(_itemsCache);
  if (_itemsFetch) return _itemsFetch;
  // GET /v1/assets/items — full item list including abilities, weapons, upgrades
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

/** Best icon URL for a shop item (Upgrade). Falls back through all known CDN fields. */
function itemImg(item: ItemData | HeroAbilityItem): string {
  const i = item as ItemData;
  // Shop thumbnails (preferred — used in-game shop UI)
  return i.shop_image_webp
    ?? i.shop_image_small_webp
    ?? i.shop_image
    ?? i.shop_image_small
    // Ability / weapon icon fallback
    ?? i.image_webp
    ?? i.image
    ?? '';
}

/** Plain description text (desc > active > passive). */
function itemDesc(item: ItemData): string {
  const d = item.description;
  if (!d) return '';
  if (typeof d === 'string') return d;
  return (d.desc ?? d.active ?? d.passive ?? '').trim();
}

/**
 * Build formatted stat lines from tooltip_sections + properties.
 * Returns up to 5 key stats as "Label: +value postfix" strings.
 */
function itemStatLines(item: ItemData): string[] {
  const props = item.properties;
  if (!props || !item.tooltip_sections?.length) return [];

  const lines: string[] = [];
  for (const section of item.tooltip_sections) {
    for (const attr of section.section_attributes ?? []) {
      for (const propName of attr.important_properties ?? []) {
        const p = props[propName];
        if (!p || lines.length >= 5) break;
        const label   = p.label ?? propName;
        const prefix  = p.prefix ?? '';
        const val     = p.value ?? '';
        const postfix = p.postfix ?? p.display_units ?? '';
        if (val) lines.push(`${label}: ${prefix}${val}${postfix}`);
      }
    }
    if (lines.length >= 5) break;
  }
  return lines;
}

// ── Hero tier badge labels ────────────────────────────────────────────────────
const TIER_LABEL: Record<number, string> = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV' };

// ── Items tab sort types ──────────────────────────────────────────────────────
type ItemsSortCol = 'name' | 'cost' | 'winRate' | 'winRateChange' | 'usage' | 'usageChange' | 'winloss';
type ItemsSortDir = 'asc' | 'desc';

// ── Tab definitions ───────────────────────────────────────────────────────────
type Tab = 'builds' | 'items' | 'skill-path' | 'overview' | 'lore';
const TABS: { id: Tab; label: string }[] = [
  { id: 'builds',   label: 'Builds' },
  { id: 'items',    label: 'Items' },
  { id: 'skill-path', label: 'Skill Path' },
  { id: 'overview', label: 'Overview & Abilities' },
  { id: 'lore',     label: 'Lore' },
];

// Per-ability row accent colors for the skill path grid
const ABILITY_COLORS = ['#6eb3a8', '#c9a46e', '#a86e9e', '#8cb86e'];

// ── HeroDetailsPage ───────────────────────────────────────────────────────────
export class HeroDetailsPage {
  private container: HTMLElement | null = null;
  private hero: HeroData | null = null;
  private currentTab: Tab = 'builds';
  private selectedBuildIdx: number = 0;

  private builds: BuildData[] = [];
  private buildStats: BuildStats[] = [];
  private heroAbilities: HeroAbilityItem[] = [];
  private abilityStats: AbilityOrderStats[] = [];
  private items: Map<number, ItemData> = new Map();

  // ── Items tab state ─────────────────────────────────────────────────────────
  private itemsPeriod: ItemsPeriod = 'latest';
  private itemsRank: ItemsRankFilter = { mode: 'all', tier: 0 };
  private itemsTiers: Set<number> = new Set([1, 2, 3, 4]);
  private itemsCurrentStats: ApiItemStat[] = [];
  private itemsRefStats: ApiItemStat[] = [];
  private heroMatchesCur = 0;
  private heroMatchesRef = 0;
  private patchDays: string[] = [];
  private itemsLoading = false;
  private itemsLoaded = false;
  private itemsError = false;
  private itemsSortCol: ItemsSortCol = 'usage';
  private itemsSortDir: ItemsSortDir = 'desc';
  private selectedAbilityIdx: number = 0;

  // ── Public API ──────────────────────────────────────────────────────────────

  mountWithHero(container: HTMLElement, hero: HeroData): void {
    this.container = container;
    this.hero = hero;
    this.currentTab = 'builds';
    this.selectedBuildIdx = 0;
    this.builds = [];
    this.buildStats = [];
    this.heroAbilities = [];
    this.abilityStats = [];
    this.items = new Map();

    // Reset items tab state for new hero
    this.itemsPeriod = 'latest';
    this.itemsRank = { mode: 'all', tier: 0 };
    this.itemsTiers = new Set([1, 2, 3, 4]);
    this.itemsCurrentStats = [];
    this.itemsRefStats = [];
    this.heroMatchesCur = 0;
    this.heroMatchesRef = 0;
    this.itemsLoading = false;
    this.itemsLoaded = false;
    this.itemsError = false;
    this.itemsSortCol = 'usage';
    this.itemsSortDir = 'desc';
    this.selectedAbilityIdx = 0;

    this.renderSkeleton();
    this.fetchAll();
  }

  mount(container: HTMLElement): void {
    container.innerHTML = `
      <div class="p-8 bg-charcoal-100 min-h-screen flex items-center justify-center">
        <p class="text-grey-500 text-sm">Select a hero from the library to view details.</p>
      </div>`;
  }

  // ── Data fetching ───────────────────────────────────────────────────────────

  /**
   * Fires all hero-specific data requests in parallel so the page renders as
   * soon as the slowest response arrives rather than waterfall-fetching.
   * The items catalogue is shared (module-level cache) so it isn't re-downloaded
   * on every hero navigation.
   *
   * GET /v1/builds?hero_id={id}&sort_by=weekly_favorites&limit=3&only_latest=true&build_language=English
   *   → top 3 weekly-favourited builds in English; fields: name, mod_categories, ability_order
   * GET /v1/analytics/hero-build-stats/{id}
   *   → BuildStats[] — wins/losses/matches per hero_build_id (for win-rate badge)
   * GET /v1/assets/items (module-level cache)
   *   → full item catalogue — see fetchItemsCache() JSDoc for used fields
   * GET /v1/assets/items/by-hero-id/{id}
   *   → HeroAbilityItem[] — the hero's 4 signature abilities (icon, id, name)
   * GET /v1/analytics/ability-order-stats?hero_id={id}&min_matches=200
   *   → AbilityOrderStats[] — skill-upgrade sequences with ≥ 200 matches; abilities[] = ordered IDs
   */
  private async fetchAll(): Promise<void> {
    if (!this.hero) return;
    const id = this.hero.id;

    try {
      const [builds, stats, items, abilities, abilityOrder] = await Promise.all([
        // build_language=English filters to NA/EN builds, avoiding non-English region builds
        fetch(`${API}/v1/builds?hero_id=${id}&sort_by=weekly_favorites&limit=3&only_latest=true&build_language=English`)
          .then(r => (r.ok ? r.json() : Promise.resolve([]))),

        // GET /v1/analytics/hero-build-stats/{id}
        fetch(`${API}/v1/analytics/hero-build-stats/${id}`)
          .then(r => (r.ok ? r.json() : Promise.resolve([]))),

        // GET /v1/assets/items — cached module-level
        fetchItemsCache(),

        // GET /v1/assets/items/by-hero-id/{id} — hero signature abilities
        fetch(`${API}/v1/assets/items/by-hero-id/${id}`)
          .then(r => (r.ok ? r.json() : Promise.resolve([]))),

        // GET /v1/analytics/ability-order-stats?hero_id={id}&min_matches=200
        fetch(`${API}/v1/analytics/ability-order-stats?hero_id=${id}&min_matches=200`)
          .then(r => (r.ok ? r.json() : Promise.resolve([]))),
      ]);

      this.builds = Array.isArray(builds) ? builds.slice(0, 3) : [];
      this.buildStats = Array.isArray(stats) ? stats : [];
      this.items = items;

      // Top 5 skill-path variations by match count
      this.abilityStats = (Array.isArray(abilityOrder) ? abilityOrder as AbilityOrderStats[] : [])
        .sort((a, b) => b.matches - a.matches)
        .slice(0, 5);

      // Keep the 4 real signature abilities: exclude the shared melee/punch ('Melee')
      // and any ability whose name is still a raw class name (contains '_'), e.g. 'ability_hero_slide'.
      const rawAbilities: HeroAbilityItem[] = Array.isArray(abilities) ? abilities : [];
      // Stable-sort so the ultimate always occupies the last (4th) slot regardless of API return
      // order.  The items cache is already populated at this point so ability_type is safe to read.
      // Without this sort, heroes like Infernus had their ultimate appear as the first button.
      this.heroAbilities = rawAbilities
        .filter(a => a.name !== 'Melee' && !a.name.includes('_'))
        .slice(0, 4)
        .sort((a, b) => {
          const aUlt = (this.items.get(a.id) as any)?.ability_type === 'ultimate' ? 1 : 0;
          const bUlt = (this.items.get(b.id) as any)?.ability_type === 'ultimate' ? 1 : 0;
          return aUlt - bUlt;
        });

      this.render();
    } catch {
      this.renderError();
    }
  }

  // ── Top-level render ────────────────────────────────────────────────────────

  private render(): void {
    if (!this.container || !this.hero) return;
    this.container.innerHTML =
      this.renderHeader() +
      `<div id="hero-tab-content" class="pb-12">${this.renderTabContent()}</div>`;
    this.bindEvents();
  }

  private renderSkeleton(): void {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="bg-charcoal-100 min-h-screen animate-pulse">
        <div class="sticky top-0 z-50">
          <div class="h-28 bg-charcoal-300 w-full"></div>
          <div class="h-11 bg-charcoal-200 border-b border-charcoal-400 flex gap-6 px-8 items-center">
            ${[1, 2, 3, 4, 5].map(() => `<div class="h-3 w-20 rounded-full bg-charcoal-300"></div>`).join('')}
          </div>
        </div>
        <div class="p-8 space-y-5">
          <div class="h-5 w-32 rounded bg-charcoal-300"></div>
          <div class="flex gap-3">
            ${[1, 2, 3].map(() => `<div class="h-14 w-48 rounded-lg bg-charcoal-200 border border-charcoal-400"></div>`).join('')}
          </div>
          <div class="h-36 rounded-xl bg-charcoal-200 border border-charcoal-400"></div>
          <div class="h-5 w-24 rounded bg-charcoal-300 mt-4"></div>
          <div class="flex flex-wrap gap-2">
            ${Array.from({ length: 24 }).map(() => `<div class="w-12 h-12 rounded bg-charcoal-300"></div>`).join('')}
          </div>
        </div>
      </div>`;
  }

  private renderError(): void {
    if (!this.container) return;
    const header = this.hero ? this.renderHeader() : '';
    this.container.innerHTML = `
      ${header}
      <div class="flex flex-col items-center justify-center gap-4 py-24">
        <div class="w-10 h-10 rounded-full border border-charcoal-400 flex items-center justify-center text-grey-500 text-lg">!</div>
        <p class="text-grey-500 text-sm">Failed to load hero data.</p>
        <button id="retry-btn"
          class="px-4 py-2 bg-charcoal-300 hover:bg-charcoal-200 text-grey-300 text-sm rounded-lg border border-charcoal-400 transition-colors">
          Retry
        </button>
      </div>`;
    this.container.querySelector('#retry-btn')?.addEventListener('click', () => {
      this.renderSkeleton();
      this.fetchAll();
    });
  }

  // ── Sticky header + tab bar ─────────────────────────────────────────────────

  private renderHeader(): string {
    if (!this.hero) return '';
    const bgUrl   = this.hero.images?.background_image_webp ?? this.hero.images?.background_image ?? '';
    const iconUrl = this.hero.images?.icon_hero_card_webp  ?? this.hero.images?.icon_hero_card    ?? '';
    const name    = this.hero.name ?? 'Unknown Hero';

    return `
      <div class="sticky top-0 z-50">
        <!-- Background image with gradient overlay -->
        <div class="relative overflow-hidden"
             style="background-image:url('${bgUrl}'); background-size:cover; background-position:center top;">
          <div class="absolute inset-0 pointer-events-none"
               style="background:linear-gradient(to bottom,rgba(0,0,0,0.55),rgba(15,17,19,0.97));"></div>
          <div class="relative flex items-center gap-5 px-8 py-4">
            ${iconUrl
              ? `<img src="${iconUrl}" alt="${name}"
                      class="h-20 rounded-lg border border-charcoal-400 shadow-xl shrink-0 object-cover object-top" />`
              : ''}
            <div>
              <h1 class="text-3xl font-bold text-white tracking-wide">${name}</h1>
              <p class="text-dry-sage-500 text-sm mt-0.5 uppercase tracking-widest">Hero Details</p>
            </div>
          </div>
        </div>

        <!-- Tab bar -->
        <div class="bg-charcoal-200 border-b border-charcoal-400">
          <div class="flex px-8">
            ${TABS.map(t => `
              <button data-tab="${t.id}"
                class="hero-tab-btn px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap
                  ${this.currentTab === t.id
                    ? 'text-dry-sage-400 border-dry-sage-400'
                    : 'text-grey-500 border-transparent hover:text-grey-300 hover:border-charcoal-300'}">
                ${t.label}
              </button>`).join('')}
          </div>
        </div>
      </div>`;
  }

  // ── Tab content dispatcher ──────────────────────────────────────────────────

  private renderTabContent(): string {
    switch (this.currentTab) {
      case 'builds':     return this.renderBuildsTab();
      case 'skill-path': return this.renderSkillPathTab();
      case 'lore':       return this.renderLoreTab();
      case 'items':      return this.renderItemsTab();
      case 'overview':   return this.renderOverviewTab();
      default:           return this.renderPlaceholder(TABS.find(t => t.id === this.currentTab)?.label ?? '');
    }
  }

  // ── BUILDS TAB ──────────────────────────────────────────────────────────────

  private renderBuildsTab(): string {
    if (this.builds.length === 0) {
      return `<div class="flex flex-col items-center justify-center gap-3 py-24 text-grey-500">
        <p class="text-sm">No builds found for this hero.</p>
      </div>`;
    }
    const recIdx = this.recommendedBuildIdx();
    return `
      <div class="max-w-5xl">
        ${this.renderBuildSelector(recIdx)}
        <div id="build-detail-area" class="p-8 pt-6 space-y-5">
          ${this.renderBuildDetail(this.selectedBuildIdx)}
        </div>
      </div>`;
  }

  private recommendedBuildIdx(): number {
    let best = 0, bestFav = -1;
    this.builds.forEach((b, i) => {
      const fav = b.num_weekly_favorites ?? 0;
      if (fav > bestFav) { bestFav = fav; best = i; }
    });
    return best;
  }

  /**
   * Classifies a build as Gun or Mystic based on the majority item-slot type
   * across all mod_categories.  Vitality items are neutral and don't influence
   * the result.  Returns null if no weapon/spirit items are found (e.g. build data
   * not yet resolved from the items cache).
   */
  private damageType(build: BuildData): 'Gun' | 'Mystic' | null {
    let weapon = 0, spirit = 0;
    (build.hero_build.details.mod_categories ?? []).forEach(cat => {
      (cat.mods ?? []).forEach(mod => {
        const item = this.items.get(mod.ability_id);
        if (!item) return;
        if (item.item_slot_type === 'weapon') weapon++;
        else if (item.item_slot_type === 'spirit') spirit++;
      });
    });
    if (weapon === 0 && spirit === 0) return null;
    return weapon >= spirit ? 'Gun' : 'Mystic';
  }

  private renderBuildSelector(recIdx: number): string {
    return `
      <div class="flex border-b border-charcoal-400 bg-charcoal-200/60">
        ${this.builds.map((b, i) => {
          const s          = this.buildStats.find(s => s.hero_build_id === b.hero_build.hero_build_id);
          const wr         = s && s.matches > 0 ? Math.round(s.wins / s.matches * 100) : null;
          const dmg        = this.damageType(b);
          const isSelected = i === this.selectedBuildIdx;
          const isRec      = i === recIdx;
          const dmgBg      = dmg === 'Gun'    ? 'background:#f9731622;color:#fb923c;border:1px solid #f9731640'
                           : dmg === 'Mystic' ? 'background:#a855f722;color:#c084fc;border:1px solid #a855f740'
                           : 'background:#37415122;color:#9ca3af;border:1px solid #37415140';
          return `
            <button data-build-idx="${i}"
              class="build-selector-btn relative flex-1 flex flex-col gap-2 px-5 py-4 text-left
                     transition-all duration-200 border-r border-charcoal-400 last:border-r-0
                     ${isSelected ? 'bg-charcoal-300/80' : 'hover:bg-charcoal-300/40'}">
              <!-- Active top accent bar -->
              <div class="absolute top-0 left-0 right-0 h-0.5 transition-all duration-200"
                   style="background:${isSelected ? '#9cbc9c' : 'transparent'};"></div>

              <!-- Row 1: name + recommended badge -->
              <div class="flex items-start gap-2 pr-1">
                <span class="text-sm font-semibold leading-snug truncate
                  ${isSelected ? 'text-white' : 'text-grey-400'}"
                  style="max-width:160px;">${b.hero_build.name}</span>
                ${isRec ? `
                  <span class="shrink-0 text-[9px] px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-wider"
                        style="background:#9cbc9c22;color:#9cbc9c;border:1px solid #9cbc9c44;">
                    Rec
                  </span>` : ''}
              </div>

              <!-- Row 2: damage chip + win rate -->
              <div class="flex items-center gap-2">
                ${dmg ? `
                  <span class="text-[10px] px-2 py-0.5 rounded-sm font-semibold uppercase tracking-wide"
                        style="${dmgBg}">${dmg}</span>` : ''}
                ${wr !== null ? `
                  <span class="text-[11px] font-bold ${isSelected ? 'text-white' : 'text-grey-500'}">${wr}%</span>
                  <span class="text-[10px] text-grey-600">WR</span>` : ''}
              </div>
            </button>`;
        }).join('')}
      </div>`;
  }

  private renderBuildDetail(idx: number): string {
    const build = this.builds[idx];
    if (!build) return '';
    return this.renderBuildSummary(build, idx) + this.renderBuildFullGrid(build);
  }

  private renderBuildSummary(build: BuildData, _idx: number): string {
    const s       = this.buildStats.find(s => s.hero_build_id === build.hero_build.hero_build_id);
    const wr      = s && s.matches > 0 ? (s.wins / s.matches * 100).toFixed(1) : null;
    const matches = s?.matches ?? 0;

    // Damage split percentages (Gun / Spirit / Vitality)
    let wep = 0, spr = 0, vit = 0;
    (build.hero_build.details.mod_categories ?? []).forEach(cat =>
      (cat.mods ?? []).forEach(mod => {
        const item = this.items.get(mod.ability_id);
        if (item?.item_slot_type === 'weapon') wep++;
        else if (item?.item_slot_type === 'spirit') spr++;
        else if (item?.item_slot_type === 'vitality') vit++;
      })
    );
    const total  = wep + spr + vit || 1;
    const gunPct = Math.round(wep / total * 100);
    const sprPct = Math.round(spr / total * 100);
    const vitPct = 100 - gunPct - sprPct;

    // Core items category
    const cats     = build.hero_build.details.mod_categories ?? [];
    const coreCat  = cats.find(c => c.name.toLowerCase().includes('core')) ?? cats[0];
    const coreMods = (coreCat?.mods ?? []).slice(0, 12);

    // Unlock order — first 8 steps
    const steps = (build.hero_build.details.ability_order?.currency_changes ?? []).slice(0, 8);

    return `
      <div class="bg-charcoal-200 rounded-xl border border-charcoal-400 overflow-hidden">

        <!-- ── ZONE A: Stats bar ──────────────────────────────────────── -->
        <div class="grid border-b border-charcoal-400"
             style="grid-template-columns:180px 1fr auto;">

          <!-- Left: Damage split -->
          <div class="px-4 py-3 border-r border-charcoal-400 flex flex-col justify-center gap-1.5">
            <p class="text-[9px] uppercase tracking-widest text-grey-600 mb-0.5">Damage Split</p>
            <div class="flex items-center gap-1.5">
              <div class="relative flex-1 h-4 rounded-sm overflow-hidden bg-charcoal-400 flex">
                <div class="h-full transition-all" style="width:${gunPct}%;background:#f97316;"></div>
                <div class="h-full transition-all" style="width:${sprPct}%;background:#a855f7;"></div>
                <div class="h-full transition-all" style="width:${vitPct}%;background:#22c55e;"></div>
              </div>
            </div>
            <div class="flex items-center gap-2 text-[10px]">
              <span class="text-orange-400 font-semibold">G ${gunPct}%</span>
              <span class="text-purple-400 font-semibold">S ${sprPct}%</span>
              <span class="text-green-400 font-semibold">V ${vitPct}%</span>
            </div>
          </div>

          <!-- Center: Unlock order -->
          <div class="px-4 py-3 flex flex-col justify-center gap-1.5 overflow-x-auto">
            <p class="text-[9px] uppercase tracking-widest text-grey-600 shrink-0">Unlock Order</p>
            <div class="flex items-center gap-1">
              ${steps.map((step, si) => {
                const ability = this.heroAbilities.find(a => a.id === step.ability_id);
                const img     = ability ? itemImg(ability) : '';
                return `
                  ${si > 0 ? `<span class="text-charcoal-400 text-[10px] shrink-0">›</span>` : ''}
                  <div class="relative group shrink-0">
                    <div class="w-8 h-8 rounded border border-charcoal-400 bg-charcoal-300 overflow-hidden">
                      ${img
                        ? `<img src="${img}" alt="${ability?.name ?? ''}" class="w-full h-full object-cover"/>`
                        : `<div class="w-full h-full flex items-center justify-center text-grey-600 text-[9px]">${si + 1}</div>`}
                    </div>
                    <span class="absolute -bottom-1 -right-1 text-[8px] bg-charcoal-100 text-grey-500 rounded-sm px-0.5 leading-tight border border-charcoal-400">${si + 1}</span>
                    ${ability ? `
                      <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 hidden group-hover:block pointer-events-none" style="width:140px;">
                        <div class="bg-charcoal-300 border border-charcoal-400 rounded-lg p-2 shadow-xl">
                          <p class="text-white text-[11px] font-semibold">${ability.name}</p>
                        </div>
                      </div>` : ''}
                  </div>`;
              }).join('')}
            </div>
          </div>

          <!-- Right: Win rate -->
          <div class="px-5 py-3 flex flex-col items-end justify-center gap-0.5 border-l border-charcoal-400">
            ${wr !== null ? `
              <span class="text-2xl font-bold text-white leading-none">${wr}%</span>
              <span class="text-[10px] text-grey-500 uppercase tracking-wider">Win Rate</span>
              <span class="text-[10px] text-grey-600">${matches.toLocaleString()} matches</span>
            ` : `<span class="text-grey-600 text-xs">No data</span>`}
          </div>
        </div>

        <!-- ── ZONE B: Core items ──────────────────────────────────────── -->
        ${coreMods.length > 0 ? `
          <div class="px-4 py-3">
            <p class="text-[9px] uppercase tracking-widest text-grey-600 mb-2">
              ${coreCat?.name ?? 'Core Items'}
            </p>
            <div class="flex gap-1.5 overflow-x-auto pb-1">
              ${this.renderItemIcons(coreMods.map(m => m.ability_id), 44)}
            </div>
          </div>` : ''}
      </div>`;
  }

  private renderBuildFullGrid(build: BuildData): string {
    const cats = (build.hero_build.details.mod_categories ?? []).filter(c => (c.mods ?? []).length > 0);
    if (cats.length === 0) return '';

    return `
      <div>
        <!-- Section header -->
        <div class="flex items-center gap-3 mb-3">
          <p class="text-[9px] uppercase tracking-widest text-grey-600 font-medium">Full Build</p>
          <div class="flex-1 h-px bg-charcoal-400"></div>
        </div>

        <!-- Row layout: each category = header + horizontal icon row -->
        <div class="space-y-4">
          ${cats.map(cat => {
            const mods = cat.mods ?? [];
            const slotCounts: Record<string, number> = {};
            mods.forEach(m => {
              const sl = this.items.get(m.ability_id)?.item_slot_type ?? 'other';
              slotCounts[sl] = (slotCounts[sl] ?? 0) + 1;
            });
            const dominantSlot = Object.entries(slotCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'other';
            const headerColor  = dominantSlot === 'weapon'   ? '#f97316'
                               : dominantSlot === 'spirit'   ? '#a855f7'
                               : dominantSlot === 'vitality' ? '#22c55e'
                               : '#4b5563';

            return `
              <div>
                <!-- Category label row -->
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-1.5 h-1.5 rounded-full shrink-0" style="background:${headerColor};"></div>
                  <p class="text-[10px] font-semibold uppercase tracking-wider"
                     style="color:${headerColor};">${cat.name}</p>
                  <div class="flex-1 h-px" style="background:${headerColor}33;"></div>
                </div>

                <!-- Horizontal icon row -->
                <div class="flex flex-wrap gap-2">
                  ${mods.map(mod => {
                    const item      = this.items.get(mod.ability_id);
                    const imgUrl    = item ? itemImg(item) : '';
                    const name      = item?.name ?? `#${mod.ability_id}`;
                    const desc      = item ? itemDesc(item) : '';
                    const cost      = item?.cost ?? null;
                    const tier      = item?.item_tier ?? null;
                    const tierLabel = tier && TIER_LABEL[tier] ? TIER_LABEL[tier] : null;
                    const stats     = item ? itemStatLines(item) : [];
                    const slotCol   = item?.item_slot_type === 'weapon'   ? '#f97316'
                                    : item?.item_slot_type === 'spirit'   ? '#a855f7'
                                    : item?.item_slot_type === 'vitality' ? '#22c55e'
                                    : '#4b5563';
                    return `
                      <div class="relative group shrink-0 flex flex-col items-center gap-0.5" style="width:52px;">
                        <!-- Icon square -->
                        <div class="relative w-full rounded border bg-charcoal-300 overflow-hidden cursor-default"
                             style="height:52px;border-color:${slotCol}44;">
                          ${imgUrl
                            ? `<img src="${imgUrl}" alt="${name}" class="w-full h-full object-cover"/>`
                            : `<div class="w-full h-full flex items-center justify-center text-grey-600 text-[8px] p-0.5 text-center leading-tight">${name.slice(0, 5)}</div>`}
                          <!-- Slot colour bottom strip -->
                          <div class="absolute bottom-0 left-0 right-0 h-0.5" style="background:${slotCol};"></div>
                          <!-- Tier badge top-right -->
                          ${tierLabel ? `
                            <span class="absolute top-0 right-0 text-[8px] font-bold px-0.5 leading-tight rounded-bl"
                                  style="background:${slotCol};color:#fff;">${tierLabel}</span>` : ''}
                        </div>
                        <!-- Cost always visible below icon -->
                        ${cost ? `<p class="text-[9px] font-semibold text-yellow-400 leading-none text-center">${cost.toLocaleString()}</p>` : ''}
                        <!-- Tooltip on hover — above icon -->
                        <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[60]
                                    hidden group-hover:block pointer-events-none"
                             style="width:220px;">
                          <div class="bg-charcoal-200 border border-charcoal-400 rounded-lg shadow-2xl overflow-hidden">
                            <div class="flex items-center justify-between gap-2 px-3 pt-2.5 pb-1.5"
                                 style="border-bottom:1px solid ${slotCol}44;">
                              <p class="text-white text-xs font-bold leading-tight">${name}</p>
                              ${cost ? `<span class="text-yellow-400 text-[11px] font-semibold shrink-0">${cost.toLocaleString()} 🪙</span>` : ''}
                            </div>
                            <div class="px-3 py-2 space-y-1.5">
                              ${desc ? `<p class="text-grey-400 text-[11px] leading-snug">${desc}</p>` : ''}
                              ${stats.length > 0 ? `
                                <div class="space-y-0.5 pt-1 border-t border-charcoal-400">
                                  ${stats.map(st => `<p class="text-dry-sage-400 text-[11px] font-medium">${st}</p>`).join('')}
                                </div>` : ''}
                            </div>
                          </div>
                        </div>
                      </div>`;
                  }).join('')}
                </div>
              </div>`;
          }).join('')}
        </div>
      </div>`;
  }

  private renderItemIcons(itemIds: number[], size: number): string {
    return itemIds.map(id => {
      const item   = this.items.get(id);
      const imgUrl = item ? itemImg(item) : '';
      const name   = item?.name ?? `#${id}`;
      const desc   = item ? itemDesc(item) : '';
      const cost   = item?.cost ?? null;
      const stats  = item ? itemStatLines(item) : [];
      const px     = `${size}px`;

      // Slot colour strip: weapon=orange, spirit=purple, vitality=green
      const slotColor = item?.item_slot_type === 'weapon'
        ? '#f97316' : item?.item_slot_type === 'spirit'
        ? '#a855f7' : item?.item_slot_type === 'vitality'
        ? '#22c55e' : '#4b5563';

      return `
        <div class="relative group shrink-0" style="width:${px};height:${px};">
          <div class="w-full h-full rounded border bg-charcoal-300 overflow-hidden cursor-default"
               style="border-color:${slotColor}33;">
            ${imgUrl
              ? `<img src="${imgUrl}" alt="${name}" class="w-full h-full object-cover"/>`
              : `<div class="w-full h-full flex items-center justify-center text-grey-600 text-[9px] p-0.5 text-center leading-tight">${name.slice(0, 6)}</div>`}
            <!-- Slot colour bottom strip -->
            <div class="absolute bottom-0 left-0 right-0 h-0.5" style="background:${slotColor};"></div>
          </div>

          <!-- Tooltip — shown on hover, positioned above, anchored to center -->
          <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[60]
                      hidden group-hover:block pointer-events-none"
               style="width:220px;">
            <div class="bg-charcoal-200 border border-charcoal-400 rounded-lg shadow-2xl overflow-hidden">
              <!-- Header: name + cost -->
              <div class="flex items-center justify-between gap-2 px-3 pt-2.5 pb-1.5"
                   style="border-bottom:1px solid ${slotColor}44;">
                <p class="text-white text-xs font-bold leading-tight">${name}</p>
                ${cost ? `<span class="text-yellow-400 text-[11px] font-semibold shrink-0">${cost.toLocaleString()} 🪙</span>` : ''}
              </div>
              <!-- Body: description + stats -->
              <div class="px-3 py-2 space-y-1.5">
                ${desc ? `<p class="text-grey-400 text-[11px] leading-snug">${desc}</p>` : ''}
                ${stats.length > 0 ? `
                  <div class="space-y-0.5 pt-1 border-t border-charcoal-400">
                    ${stats.map(s => `<p class="text-dry-sage-400 text-[11px] font-medium">${s}</p>`).join('')}
                  </div>` : ''}
              </div>
            </div>
          </div>
        </div>`;
    }).join('');
  }

  // ── OVERVIEW & ABILITIES TAB ────────────────────────────────────────────────
  // All data displayed here (weapon stats, base stats, ability descriptions,
  // upgrade tiers) is already present in this.hero, this.items, and
  // this.heroAbilities — no additional API requests are needed when switching
  // to this tab.

  /**
   * Resolves the hero's primary weapon item from the global items cache.
   * The API gives us hero.items.weapon_primary as a class_name string (e.g.
   * "citadel_weapon_base_pistol"), NOT as a numeric item ID.  We must scan the
   * full items Map to find the entry whose class_name field matches, because
   * there is no reverse-lookup endpoint.
   */
  private getWeaponItem(): ItemData | undefined {
    const className = (this.hero as any)?.items?.weapon_primary;
    if (!className) return undefined;
    for (const item of this.items.values()) {
      if ((item as any).class_name === className) return item;
    }
    return undefined;
  }

  private renderOverviewTab(): string {
    if (!this.hero) return '';
    return `
      <div class="p-8 max-w-6xl">
        <div>
          <h2 class="text-2xl font-bold text-white tracking-wide">${this.hero.name ?? 'Hero'} — Overview &amp; Abilities</h2>
          <p class="text-dry-sage-500 text-sm mt-1">Combat statistics and signature abilities.</p>
          <div class="mt-4 h-px bg-gradient-to-r from-dry-sage-400/50 via-charcoal-400 to-transparent"></div>
        </div>

        <div class="mt-6 flex gap-6">

          <!-- ── LEFT: Stat panels ──────────────────────────────────── -->
          <div class="w-52 shrink-0 space-y-5">
            ${this.renderWeaponStatBlock()}
            ${this.renderBaseStatBlock()}
          </div>

          <!-- ── RIGHT: Abilities ───────────────────────────────────── -->
          <div class="flex-1 min-w-0 space-y-4">
            <div>
              <p class="text-[9px] uppercase tracking-widest text-grey-600 font-medium mb-3">Abilities</p>
              <div id="ability-selector">
                ${this.renderAbilitySelector()}
              </div>
            </div>
            <div id="ability-detail-panel">
              ${this.renderAbilityDetail(this.selectedAbilityIdx)}
            </div>
          </div>

        </div>
      </div>`;
  }

  /**
   * Weapon stats live nested at item.weapon_info on the primary-weapon item,
   * not on the hero object directly.  The weapon item is resolved via
   * getWeaponItem() which cross-references hero.items.weapon_primary (class_name)
   * against the items cache.
   */
  private renderWeaponStatBlock(): string {
    const wi = (this.getWeaponItem() as any)?.weapon_info;
    const fmt = (n: number | undefined, dec = 2) =>
      typeof n === 'number' ? n.toFixed(dec) : '—';
    const rows: [string, string][] = [
      ['Clip Size',     wi?.clip_size != null ? String(wi.clip_size) : '—'],
      ['Bullet Damage', fmt(wi?.bullet_damage)],
      ['Fire Rate',     wi?.shots_per_second != null ? `${fmt(wi.shots_per_second)} rnd/s` : '—'],
      ['DPS',           fmt(wi?.damage_per_second)],
    ];
    return `
      <div class="bg-charcoal-200 rounded-xl border border-charcoal-400 overflow-hidden">
        <div class="px-4 py-2.5 border-b border-charcoal-400 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
               class="w-3.5 h-3.5 text-orange-400 shrink-0">
            <circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/>
            <line x1="12" y1="3" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="21"/>
            <line x1="3" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="21" y2="12"/>
          </svg>
          <p class="text-[9px] uppercase tracking-widest text-grey-600 font-medium">Weapon Stats</p>
        </div>
        <div class="divide-y divide-charcoal-400">
          ${rows.map(([label, value]) => `
            <div class="flex items-center justify-between px-4 py-2">
              <span class="text-grey-500 text-xs">${label}</span>
              <span class="text-white text-xs font-semibold tabular-nums">${value}</span>
            </div>`).join('')}
        </div>
      </div>`;
  }

  /**
   * Base stats come from hero.starting_stats where each entry is an object
   * { value, display_stat_name } rather than a plain number.  We read the
   * nested .value field through the helper v().
   */
  private renderBaseStatBlock(): string {
    const s = (this.hero as any)?.starting_stats ?? {};
    const v = (key: string, suffix = '') => {
      const val = s[key]?.value;
      return val != null ? `${val}${suffix}` : '—';
    };
    const cells: [string, string][] = [
      ['Max Health',  v('max_health')],
      ['Move Speed',  v('max_move_speed', ' m/s')],
      ['Light Melee', v('light_melee_damage')],
      ['Heavy Melee', v('heavy_melee_damage')],
    ];
    return `
      <div class="bg-charcoal-200 rounded-xl border border-charcoal-400 overflow-hidden">
        <div class="px-4 py-2.5 border-b border-charcoal-400 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
               class="w-3.5 h-3.5 text-green-400 shrink-0">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
          <p class="text-[9px] uppercase tracking-widest text-grey-600 font-medium">Base Stats</p>
        </div>
        <div class="grid grid-cols-2">
          ${cells.map(([label, value], i) => `
            <div class="px-3 py-2.5 ${i % 2 === 0 ? 'border-r' : ''} ${i < 2 ? 'border-b' : ''} border-charcoal-400">
              <p class="text-[9px] text-grey-600 uppercase tracking-wider mb-0.5 leading-none">${label}</p>
              <p class="text-white text-sm font-bold leading-none tabular-nums">${value}</p>
            </div>`).join('')}
        </div>
      </div>`;
  }

  /**
   * Renders 4 clickable ability buttons.  The ultimate (ability_type === 'ultimate'
   * from the items cache) receives a golden border and ULT badge to visually
   * distinguish it from signature abilities.  Selection state is tracked by
   * this.selectedAbilityIdx and written into inline styles rather than toggling
   * CSS classes so the active color can vary per ability type.
   */
  private renderAbilitySelector(): string {
    if (!this.heroAbilities.length) {
      return `<p class="text-grey-600 text-xs">No ability data available.</p>`;
    }
    return `
      <div class="grid grid-cols-4 gap-3">
        ${this.heroAbilities.map((ability, idx) => {
          const full       = this.items.get(ability.id);
          const isUltimate = (full as any)?.ability_type === 'ultimate';
          const isSel      = idx === this.selectedAbilityIdx;
          const img        = itemImg(ability);
          const borderColor = isSel
            ? isUltimate ? 'rgba(251,191,36,0.7)' : '#b0a472'
            : 'rgba(73,73,73,1)';
          return `
            <button data-ability-idx="${idx}"
              class="ability-btn relative flex flex-col items-center gap-2 p-3
                     rounded-xl border bg-charcoal-200 transition-all duration-200 cursor-pointer
                     ${isSel ? 'bg-charcoal-300/80' : 'hover:bg-charcoal-300/40'}"
              style="border-color:${borderColor};">
              ${isUltimate ? `
                <span class="absolute top-1.5 right-1.5 text-[7px] font-bold px-1 py-0.5 rounded leading-none"
                      style="background:rgba(250,180,30,0.15);color:#fbbf24;border:1px solid rgba(250,180,30,0.3);">
                  ULT
                </span>` : ''}
              <div class="w-16 h-16 rounded-lg overflow-hidden bg-charcoal-300 shrink-0"
                   style="border:1px solid ${isUltimate ? 'rgba(251,191,36,0.2)' : 'rgba(255,255,255,0.06)'};">
                ${img
                  ? `<img src="${img}" alt="${ability.name}" class="w-full h-full object-cover"/>`
                  : `<div class="w-full h-full flex items-center justify-center text-grey-600 text-xs font-bold">${idx + 1}</div>`}
              </div>
              <span class="text-[11px] font-medium text-center leading-tight w-full truncate
                           ${isSel ? 'text-white' : 'text-grey-400'}">${ability.name}</span>
            </button>`;
        }).join('')}
      </div>`;
  }

  private renderAbilityDetail(idx: number): string {
    const ability = this.heroAbilities[idx];
    if (!ability) {
      return `
        <div class="bg-charcoal-200 rounded-xl border border-charcoal-400 px-5 py-8 text-center">
          <p class="text-grey-600 text-sm">Select an ability to view its details.</p>
        </div>`;
    }

    // Resolve the full ItemData for this ability from the global items cache.
    // Ability-specific metadata (ability_type, description, properties, upgrades)
    // is only available on the full item, not on the lightweight HeroAbilityItem.
    const full: any       = this.items.get(ability.id) ?? {};
    const abilityType     = String(full?.ability_type ?? '');
    const isUltimate      = abilityType === 'ultimate';
    const props           = (full as ItemData)?.properties ?? {};
    const desc: any       = full?.description ?? {};

    // ── Description ──────────────────────────────────────────────────────────
    const rawDesc  = typeof desc === 'string' ? desc : (desc.desc ?? desc.active ?? desc.passive ?? '');
    const parsedDesc = rawDesc ? this.parseAbilityDesc(rawDesc) : '';

    // ── Quip ─────────────────────────────────────────────────────────────────
    const quip = typeof desc === 'object' ? String(desc.quip ?? '') : '';

    // ── Upgrade tiers ─────────────────────────────────────────────────────────
    const stripHtml = (s: string) =>
      s.replace(/<[^>]+>/g, '').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim();

    const rawUpgradesArr: any[] = (full as any)?.upgrades ?? [];

    // Two-tier fallback for upgrade text:
    //   1. description.t1_desc / t2_desc / t3_desc — human-readable HTML strings
    //   2. upgrades[i].property_upgrades — machine-readable numeric bonus objects
    // Some abilities (e.g. Concussive Combustion's T1) omit the explicit desc entirely,
    // so the numeric fallback ensures all three tiers are always populated when data exists.
    const buildUpgradeText = (tierIdx: number): string | null => {
      // Prefer explicit human-readable text from description
      const txKey = `t${tierIdx + 1}_desc`;
      const explicit = typeof desc === 'object' && desc ? desc[txKey] as string | undefined : undefined;
      if (explicit) return stripHtml(explicit);

      // Fall back to property_upgrades numeric bonuses
      const upg = rawUpgradesArr[tierIdx];
      const propUpgrades: Array<{ name: string; bonus: string | number }> = upg?.property_upgrades ?? [];
      if (!propUpgrades.length) return null;

      return propUpgrades.map(pu => {
        const prop    = props[pu.name] as any;
        const label   = prop?.label ?? pu.name;
        const postfix = prop?.postfix ?? '';
        const bNum    = typeof pu.bonus === 'number' ? pu.bonus : parseFloat(String(pu.bonus));
        let bStr: string;
        if (!isNaN(bNum)) {
          bStr = `${bNum >= 0 ? '+' : ''}${bNum}${postfix}`;
        } else {
          // Bonus already contains its unit (e.g. "7m") — prefix with +
          bStr = `+${pu.bonus}`;
        }
        return `${bStr} ${label}`;
      }).join(' · ');
    };

    const TC = ['#c084fc', '#a855f7', '#7c3aed'];
    const upgrades: { tier: string; text: string; color: string }[] = [];
    for (let i = 0; i < 3; i++) {
      const text = buildUpgradeText(i);
      if (text) upgrades.push({ tier: `T${i + 1}`, text, color: TC[i] });
    }

    // ── Standard stats ────────────────────────────────────────────────────────
    // These four/five properties are surfaced as dedicated stat chips at the bottom
    // of every ability panel.  Charges and charge delay only appear when applicable.
    const stdVal = (p: any, fallback = '0') => {
      if (!p) return fallback;
      return `${p.value ?? fallback}${p.postfix ?? ''}`;
    };
    const charges    = Number(props.AbilityCharges?.value ?? 0);
    const chargeDly  = Number(props.AbilityCooldownBetweenCharge?.value ?? -1);
    const stdStats: { label: string; value: string }[] = [
      { label: 'Cooldown',   value: stdVal(props.AbilityCooldown)   },
      { label: 'Cast Range', value: stdVal(props.AbilityCastRange)  },
      { label: 'Duration',   value: stdVal(props.AbilityDuration)   },
      ...(charges > 0 ? [{ label: 'Charges', value: String(charges) }] : []),
      ...(charges > 0 && chargeDly > 0 ? [{ label: 'Charge Delay', value: `${chargeDly}s` }] : []),
    ];

    // ── Dynamic key stats ─────────────────────────────────────────────────────
    // Shows up to 6 "interesting" properties that have a non-zero value.
    // BORING excludes properties that are either already shown as dedicated chips
    // (Cooldown, Duration, etc.) or are internal engine values irrelevant to the
    // player (cast delay, channel time, unit target limit).
    const BORING = new Set([
      'AbilityUnitTargetLimit', 'AbilityCastDelay', 'AbilityChannelTime',
      'AbilityPostCastDuration', 'ChannelMoveSpeed', 'AbilityResourceCost',
      'AbilityCooldown', 'AbilityDuration', 'AbilityCastRange',
      'AbilityCharges', 'AbilityCooldownBetweenCharge',
    ]);
    const dynamicStats = Object.entries(props)
      .filter(([key, p]) => {
        if (BORING.has(key) || !(p as any)?.label) return false;
        const v = String((p as any).value ?? '');
        return v && v !== '0' && v !== '-1' && v !== '0%' && v !== '0m' && v !== '0s' && v !== '0.0';
      })
      .slice(0, 6)
      .map(([, p]) => ({
        label: (p as any).label as string,
        value: `${(p as any).value}${(p as any).postfix ?? ''}`,
      }));

    // ── Badges / styling ─────────────────────────────────────────────────────
    const panelBorder = isUltimate ? 'rgba(251,191,36,0.25)' : '#494949';
    const typeBadge = isUltimate
      ? `<span class="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded font-bold uppercase
                      tracking-widest"
               style="background:rgba(250,180,30,0.12);color:#fbbf24;border:1px solid rgba(250,180,30,0.35);">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-2.5 h-2.5">
             <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
           </svg>
           Ultimate
         </span>`
      : abilityType === 'signature'
      ? `<span class="text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-widest"
               style="background:rgba(176,164,114,0.1);color:#b0a472;border:1px solid rgba(176,164,114,0.25);">
           Signature
         </span>`
      : '';

    const statChip = (label: string, value: string) => `
      <div class="flex flex-col items-center justify-center px-4 py-2 rounded-lg min-w-[76px]
                  bg-charcoal-300/60 border border-charcoal-400 text-center">
        <span class="text-[9px] uppercase tracking-widest text-grey-600 mb-0.5">${label}</span>
        <span class="text-white text-sm font-bold leading-none tabular-nums">${value}</span>
      </div>`;

    return `
      <div class="bg-charcoal-200 rounded-xl overflow-hidden" style="border:1px solid ${panelBorder};">

        <!-- ── Header ──────────────────────────────────────────────── -->
        <div class="px-5 py-4 border-b border-charcoal-400"
             style="${isUltimate ? 'background:linear-gradient(to right,rgba(120,53,15,0.22),transparent);' : ''}">
          <div class="flex items-center gap-3 flex-wrap">
            <h3 class="text-white text-xl font-bold tracking-wide leading-none">${ability.name}</h3>
            ${typeBadge}
          </div>
          ${quip ? `<p class="text-grey-500 text-sm mt-1.5 italic leading-snug">${quip}</p>` : ''}
        </div>

        <!-- ── Description ─────────────────────────────────────────── -->
        <div class="px-5 py-4">
          <p class="text-grey-800 text-sm leading-relaxed">
            ${parsedDesc || `<span class="text-grey-600">No description available.</span>`}
          </p>
        </div>

        ${upgrades.length ? `
        <!-- ── Upgrade Tiers ───────────────────────────────────────── -->
        <div class="px-5 py-3.5 border-t border-charcoal-400 space-y-2">
          <p class="text-xs font-semibold text-grey-700 uppercase tracking-widest mb-3">Ability Upgrades</p>
          ${upgrades.map(u => `
            <div class="flex items-start gap-2.5">
              <span class="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-sm leading-tight mt-0.5"
                    style="background:${u.color}22;color:${u.color};border:1px solid ${u.color}44;">${u.tier}</span>
              <span class="text-grey-700 text-xs leading-relaxed">${u.text}</span>
            </div>`).join('')}
        </div>` : ''}

        <!-- ── Stats Footer ─────────────────────────────────────────── -->
        <div class="px-5 py-4 border-t border-charcoal-400 space-y-3">
          ${dynamicStats.length ? `
          <div class="flex flex-wrap gap-2">
            ${dynamicStats.map(s => `
              <div class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
                          bg-charcoal-300/60 border border-charcoal-400">
                <span class="text-grey-500 text-[10px]">${s.label}</span>
                <span class="text-dry-sage-400 text-[10px] font-semibold tabular-nums">${s.value}</span>
              </div>`).join('')}
          </div>` : ''}
          <div class="flex flex-wrap gap-2">
            ${stdStats.map(s => statChip(s.label, s.value)).join('')}
          </div>
        </div>

      </div>`;
  }

  /**
   * Strips API HTML then highlights status-effect and damage-type keywords with
   * colored <span> elements and inline SVG icons.
   *
   * WHY single-pass regex:  building one combined RegExp from all RULES patterns
   * and replacing in a single pass prevents double-wrapping — if naive sequential
   * replacements were used, a keyword wrapped in a <span> on the first pass could
   * be partially matched by a later rule and produce broken HTML.
   *
   * Keywords sourced from docs/statusEffect.md.
   * Damage types: spirit (purple), weapon (orange).
   * Status effects: stun (amber), slow (sky), disarm (red), ground (lime),
   *   silence (violet), immobilize/root (teal), bleed (rose), burn/curse (fuchsia),
   *   sleep (indigo), unstoppable (emerald).
   */
  private parseAbilityDesc(raw: string): string {
    const text = raw
      .replace(/<[^>]+>/g, ' ')      // strip HTML tags from the API's rich text
      .replace(/&amp;/g, '&').replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const ico = (content: string) =>
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
       class="inline w-3 h-3 shrink-0 -mt-0.5" aria-hidden="true">${content}</svg>`;

    const RULES: { re: RegExp; cls: string; icon: string }[] = [
      // ── Damage types ───────────────────────────────────────────────────────
      {
        re: /\b(spirit damage|mystic damage)\b/gi,
        cls: 'text-purple-400',
        icon: ico('<path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>'),
      },
      {
        re: /\b(weapon damage|bullet damage)\b/gi,
        cls: 'text-orange-400',
        icon: ico('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="3" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="21"/><line x1="3" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="21" y2="12"/>'),
      },
      // ── Status effects ─────────────────────────────────────────────────────
      {
        re: /\b(stun(?:ned|s)?)\b/gi,
        cls: 'text-amber-400',
        icon: ico('<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>'),
      },
      {
        re: /\b(slow(?:ed|s)?|movement slow)\b/gi,
        cls: 'text-sky-400',
        icon: ico('<polyline points="17 11 12 6 7 11"/><polyline points="17 18 12 13 7 18"/>'),
      },
      {
        re: /\b(disarm(?:ed)?)\b/gi,
        cls: 'text-red-400',
        icon: ico('<circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>'),
      },
      {
        re: /\b(ground(?:ed)?)\b/gi,
        cls: 'text-lime-400',
        icon: ico('<circle cx="12" cy="5" r="3"/><line x1="12" y1="8" x2="12" y2="16"/><path d="M7 16c0 2.76 2.24 5 5 5s5-2.24 5-5"/><line x1="3" y1="22" x2="21" y2="22"/>'),
      },
      {
        re: /\b(silence(?:d)?|silences)\b/gi,
        cls: 'text-violet-400',
        icon: ico('<path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>'),
      },
      {
        re: /\b(immobilize[ds]?|root(?:ed)?)\b/gi,
        cls: 'text-teal-400',
        icon: ico('<line x1="12" y1="2" x2="12" y2="22"/><polyline points="7 7 12 2 17 7"/><line x1="2" y1="22" x2="22" y2="22"/>'),
      },
      {
        re: /\b(bleed(?:ing)?)\b/gi,
        cls: 'text-rose-400',
        icon: ico('<path d="M12 22a7 7 0 007-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 007 7z"/>'),
      },
      {
        re: /\b(burn(?:ing)?|cursed?)\b/gi,
        cls: 'text-fuchsia-400',
        icon: ico('<path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"/>'),
      },
      {
        re: /\b(sleep(?:ing)?)\b/gi,
        cls: 'text-indigo-400',
        icon: ico('<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>'),
      },
      {
        re: /\b(unstoppable)\b/gi,
        cls: 'text-emerald-400',
        icon: ico('<path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'),
      },
    ];

    const combined = new RegExp(RULES.map(r => `(?:${r.re.source})`).join('|'), 'gi');

    return text.replace(combined, match => {
      const rule = RULES.find(r => new RegExp(`^(?:${r.re.source})$`, 'i').test(match));
      if (!rule) return match;
      return `<span class="${rule.cls} inline-flex items-center gap-0.5 font-semibold">${rule.icon}${match}</span>`;
    });
  }

  /**
   * Attaches click handlers to the 4 ability selector buttons.
   *
   * WHY surgical re-render instead of a full this.render() call:
   * Replacing only #ability-selector and #ability-detail-panel preserves the
   * vertical scroll position of the overview tab.  A full re-render would scroll
   * back to the top on every ability click.
   *
   * bindAbilityEvents() is called recursively after each innerHTML replacement
   * because the old DOM nodes (and their listeners) are discarded by innerHTML
   * — the new nodes need fresh event listeners attached.
   */
  private bindAbilityEvents(): void {
    if (this.currentTab !== 'overview') return;
    this.container?.querySelectorAll<HTMLButtonElement>('.ability-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.abilityIdx ?? '', 10);
        if (isNaN(idx) || idx === this.selectedAbilityIdx) return;
        this.selectedAbilityIdx = idx;
        const selectorEl = this.container?.querySelector<HTMLElement>('#ability-selector');
        if (selectorEl) selectorEl.innerHTML = this.renderAbilitySelector();
        const detailEl = this.container?.querySelector<HTMLElement>('#ability-detail-panel');
        if (detailEl) detailEl.innerHTML = this.renderAbilityDetail(this.selectedAbilityIdx);
        this.bindAbilityEvents();
      });
    });
  }

  // ── SKILL PATH TAB ──────────────────────────────────────────────────────────

  private renderSkillPathTab(): string {
    if (this.abilityStats.length === 0) {
      return `<div class="flex flex-col items-center justify-center gap-3 py-24 text-grey-500">
        <p class="text-sm">No skill path data available for this hero.</p>
      </div>`;
    }

    // Map ability ID → row index (0–3)
    const abilityIdxMap = new Map<number, number>(
      this.heroAbilities.map((a, i) => [a.id, i])
    );

    const heroName = this.hero?.name ?? '';
    const patchNote = `${heroName} — Skills`;

    return `
      <div class="p-8 space-y-6 max-w-5xl">
        <div>
          <h2 class="text-white font-semibold text-lg mb-0.5">${patchNote}</h2>
          <p class="text-grey-500 text-sm">
            Skill builds for all games played on the latest patch.
            Top ${this.abilityStats.length} most common upgrade sequences (≥ 200 matches).
          </p>
        </div>
        ${this.abilityStats.map((stat, vi) =>
          this.renderSkillVariation(stat, vi, abilityIdxMap)
        ).join('')}
      </div>`;
  }

  /**
   * Renders a single skill-path variation as a 4-row × N-column boolean grid.
   * Rows = the 4 hero abilities (same order as heroAbilities array).
   * Columns = game levels at which an upgrade was taken.
   * A cell is filled when ability[row] was upgraded at level [col].
   *
   * abilityIdxMap translates API ability IDs → row indices so cells land in the
   * correct ability row even if the API returns abilities in a different order.
   */
  private renderSkillVariation(
    stat: AbilityOrderStats,
    varIdx: number,
    abilityIdxMap: Map<number, number>,
  ): string {
    const wr       = stat.matches > 0 ? (stat.wins / stat.matches * 100).toFixed(1) : '—';
    const steps    = stat.abilities.length;
    const CELL     = 22; // px per column

    // Build 4×steps boolean grid: grid[row][step] = true if this ability was upgraded at this step
    const grid: boolean[][] = Array.from({ length: 4 }, () => Array(steps).fill(false));
    stat.abilities.forEach((abilId, step) => {
      const row = abilityIdxMap.get(abilId);
      if (row !== undefined) grid[row][step] = true;
    });

    return `
      <div class="bg-charcoal-200 rounded-xl border border-charcoal-400 overflow-hidden">
        <!-- Variation header -->
        <div class="flex items-center justify-between px-4 py-2.5 bg-charcoal-300/60 border-b border-charcoal-400">
          <span class="text-grey-400 text-xs font-medium">Build Variation ${varIdx + 1}</span>
          <div class="flex items-center gap-5 text-xs">
            <span class="text-white font-bold">${wr}% WR</span>
            <span class="text-grey-500">Games: ${stat.matches.toLocaleString()}</span>
          </div>
        </div>

        <!-- Skill grid -->
        <div class="p-4 overflow-x-auto">
          <div class="inline-block min-w-full">
            <!-- Step number header -->
            <div class="flex items-center mb-1" style="padding-left:${40 + 8}px;">
              ${Array.from({ length: steps }, (_, i) => `
                <div class="text-[9px] text-grey-600 text-center shrink-0"
                     style="width:${CELL}px;">${i + 1}</div>`).join('')}
            </div>

            <!-- Ability rows -->
            ${this.heroAbilities.map((ability, row) => {
              const color  = ABILITY_COLORS[row] ?? ABILITY_COLORS[0];
              const img    = itemImg(ability);
              return `
                <div class="flex items-center mb-1">
                  <!-- Ability icon -->
                  <div class="shrink-0 mr-2" style="width:40px;height:40px;">
                    <div class="w-full h-full rounded border border-charcoal-400 bg-charcoal-300 overflow-hidden"
                         title="${ability.name}">
                      ${img
                        ? `<img src="${img}" alt="${ability.name}" class="w-full h-full object-cover"/>`
                        : `<div class="w-full h-full flex items-center justify-center text-grey-500 text-[10px]">${row + 1}</div>`}
                    </div>
                  </div>

                  <!-- Grid cells -->
                  ${grid[row].map(filled => `
                    <div class="shrink-0 flex items-center justify-center rounded-sm"
                         style="width:${CELL}px;height:${CELL}px;background:${filled ? color + '22' : 'transparent'};">
                      ${filled
                        ? `<img src="${abilityLearnUrl}" alt="" class="w-3.5 h-3.5 object-contain" />`
                        : ''}
                    </div>`).join('')}
                </div>`;
            }).join('')}

            ${this.heroAbilities.length === 0 ? `
              <p class="text-grey-600 text-xs py-2 pl-12">Ability icons unavailable — sequence data only.</p>
              <div class="flex gap-1 pl-12 flex-wrap">
                ${stat.abilities.map((id, i) => `
                  <span class="text-[10px] text-grey-500 bg-charcoal-300 px-1.5 py-0.5 rounded border border-charcoal-400">
                    ${i + 1}:${id}
                  </span>`).join('')}
              </div>` : ''}
          </div>
        </div>
      </div>`;
  }

  // ── PLACEHOLDER TABS ────────────────────────────────────────────────────────

  private renderPlaceholder(name: string): string {
    return `
      <div class="flex flex-col items-center justify-center gap-3 py-24 text-grey-500">
        <div class="text-4xl opacity-30">🔧</div>
        <p class="text-sm">${name} — Coming soon</p>
      </div>`;
  }

  // ── LORE TAB ────────────────────────────────────────────────────────────────

  private renderLoreTab(): string {
    if (!this.hero) return '';
    const name      = this.hero.name ?? 'Unknown Hero';
    const lore      = (this.hero.description as any)?.lore as string | null | undefined;
    const role      = (this.hero.description as any)?.role as string | null | undefined;
    const playstyle = (this.hero.description as any)?.playstyle as string | null | undefined;
    const bgUrl     = this.hero.images?.background_image_webp ?? this.hero.images?.background_image ?? '';

    // All content lives inside the background container — gradient fades from transparent at top
    // to near-opaque at bottom so text is readable while the splash art is still visible above.
    return `
      <div class="relative w-full overflow-hidden" style="min-height:520px;">
        <div class="absolute inset-0"
             style="background-image:url('${bgUrl}');background-size:cover;background-position:center top;"></div>
        <div class="absolute inset-0"
             style="background:linear-gradient(to bottom,rgba(0,0,0,0.05) 0%,rgba(0,0,0,0.35) 40%,rgba(18,18,18,0.93) 65%,rgba(18,18,18,1) 100%);"></div>
        <div class="relative z-10 flex flex-col justify-end px-10 pt-64 pb-10 space-y-4" style="min-height:520px;">
          <h1 class="text-5xl font-extrabold text-white tracking-wide leading-none">${name}</h1>
          ${role ? `<span class="inline-block self-start text-[10px] font-semibold uppercase tracking-widest text-dry-sage-400 bg-dry-sage-100 px-2 py-0.5 rounded border border-dry-sage-400/30">${role}</span>` : ''}
          ${lore ? `
            <div class="max-w-3xl space-y-1">
              <p class="text-[9px] uppercase tracking-widest text-grey-500 font-medium">Lore</p>
              <p class="text-grey-300 text-sm leading-relaxed whitespace-pre-line">${lore}</p>
            </div>` : `
            <p class="text-grey-500 text-sm">No lore available for this hero.</p>`}
          ${playstyle ? `
            <div class="max-w-3xl border-t border-white/10 pt-4 space-y-1">
              <p class="text-[9px] uppercase tracking-widest text-grey-500 font-medium">Playstyle</p>
              <p class="text-grey-300 text-sm leading-relaxed">${playstyle}</p>
            </div>` : ''}
        </div>
      </div>`;
  }

  // ── ITEMS TAB ───────────────────────────────────────────────────────────────

  /**
   * Fetches item stats for the selected hero, period, and rank filter.
   * Makes 4 parallel requests (current + reference period × item-stats + hero-stats).
   * For 'latest' period, fetches /v1/patches/big-days first to determine patch timestamps.
   *
   * GET /v1/analytics/item-stats?hero_ids={id}&min_unix_timestamp=...&max_unix_timestamp=...
   *   → ApiItemStat[] — wins/losses/matches per item for the period
   * GET /v1/analytics/hero-stats?min_unix_timestamp=...&max_unix_timestamp=...
   *   → AnalyticsHeroStat[] — total hero matches (usage-rate denominator), filtered client-side
   * GET /v1/patches/big-days
   *   → string[] — ISO date strings of major patch days (cached after first fetch)
   */
  private async fetchItemsData(): Promise<void> {
    if (!this.hero || this.itemsLoading) return;
    this.itemsLoading = true;
    this.itemsError = false;
    this.refreshTabContent();

    try {
      // Always cache patchDays — used for dropdown options AND 'latest' timestamp resolution
      if (this.patchDays.length === 0) {
        const pd = await fetch(`${API}/v1/patches/big-days`)
          .then((r): Promise<unknown> => (r.ok ? r.json() : Promise.resolve([])))
          .catch((): unknown[] => []);
        this.patchDays = Array.isArray(pd) ? (pd as string[]).sort() : [];
      }

      // Resolve 'latest' sentinel to the actual most-recent patch date string
      if (this.itemsPeriod === 'latest' && this.patchDays.length > 0) {
        this.itemsPeriod = this.patchDays[this.patchDays.length - 1] as ItemsPeriod;
      }

      const { curStart, curEnd, refStart, refEnd } = this.getPeriodTimestamps();

      const toArr = (r: Response): Promise<unknown[]> => r.ok ? r.json() : Promise.resolve([]);
      const [curItems, refItems, heroStatsCur, heroStatsRef] = await Promise.all([
        fetch(this.buildItemStatsUrl(curStart, curEnd)).then(toArr),
        fetch(this.buildItemStatsUrl(refStart, refEnd)).then(toArr),
        fetch(this.buildHeroStatsUrl(curStart, curEnd)).then(toArr),
        fetch(this.buildHeroStatsUrl(refStart, refEnd)).then(toArr),
      ]);

      this.itemsCurrentStats = Array.isArray(curItems) ? (curItems as ApiItemStat[]) : [];
      this.itemsRefStats     = Array.isArray(refItems) ? (refItems as ApiItemStat[]) : [];

      const heroId = this.hero.id;
      this.heroMatchesCur = (Array.isArray(heroStatsCur) ? (heroStatsCur as AnalyticsHeroStat[]) : [])
        .find(s => s.hero_id === heroId)?.matches ?? 0;
      this.heroMatchesRef = (Array.isArray(heroStatsRef) ? (heroStatsRef as AnalyticsHeroStat[]) : [])
        .find(s => s.hero_id === heroId)?.matches ?? 0;

      this.itemsLoaded = true;
    } catch {
      this.itemsError = true;
    } finally {
      this.itemsLoading = false;
      this.refreshTabContent();
    }
  }

  private buildItemStatsUrl(minTs: number, maxTs: number): string {
    const p = new URLSearchParams();
    p.set('hero_ids', String(this.hero!.id));
    if (minTs > 0) p.set('min_unix_timestamp', String(minTs));
    if (maxTs > 0) p.set('max_unix_timestamp', String(maxTs));
    this.appendBadgeParams(p);
    return `${API}/v1/analytics/item-stats?${p}`;
  }

  private buildHeroStatsUrl(minTs: number, maxTs: number): string {
    const p = new URLSearchParams();
    if (minTs > 0) p.set('min_unix_timestamp', String(minTs));
    if (maxTs > 0) p.set('max_unix_timestamp', String(maxTs));
    this.appendBadgeParams(p);
    return `${API}/v1/analytics/hero-stats?${p}`;
  }

  /**
   * Appends min_average_badge / max_average_badge query params from the
   * RANKS constant.  The API uses raw badge integers (0–116) rather than
   * human-friendly tier names, so we look up the tier in RANKS to get the
   * numeric range boundaries.  'plus' mode omits max_average_badge to include
   * all ranks above the selected tier.
   */
  private appendBadgeParams(p: URLSearchParams): void {
    if (this.itemsRank.mode === 'all') return;
    const rank = RANKS.find(r => r.tier === this.itemsRank.tier);
    if (!rank) return;
    p.set('min_average_badge', String(rank.badgeMin));
    if (this.itemsRank.mode === 'exact') p.set('max_average_badge', String(rank.badgeMax));
  }

  /**
   * Converts the current period selection into two Unix-timestamp windows:
   *   curStart–curEnd  = the selected period (shown as current stats)
   *   refStart–refEnd  = the immediately preceding period (used for change deltas)
   *
   * For relative periods (7d, 14d …) the reference is a same-length window
   * immediately before the current one.
   *
   * For patch-date periods the reference is the preceding patch window.  This
   * means WR/usage changes always compare apples-to-apples across two patches
   * rather than against a fixed calendar interval.
   *
   * curEnd = 0 means "no upper bound" (open-ended, up to now).
   */
  private getPeriodTimestamps(): { curStart: number; curEnd: number; refStart: number; refEnd: number } {
    const now = Math.floor(Date.now() / 1000);
    const day = 86400;

    // Relative periods — mirror-length window before as reference
    const RELATIVE: Record<string, number> = { '7d': 7, '14d': 14, '30d': 30, '90d': 90 };
    if (RELATIVE[this.itemsPeriod] !== undefined) {
      const d = RELATIVE[this.itemsPeriod] * day;
      return { curStart: now - d, curEnd: now, refStart: now - 2 * d, refEnd: now - d };
    }

    // Specific patch date (ISO string) or 'latest' fallback
    const targetDate = this.itemsPeriod === 'latest'
      ? (this.patchDays[this.patchDays.length - 1] ?? null)
      : this.itemsPeriod;

    if (!targetDate) {
      return { curStart: now - 30 * day, curEnd: 0, refStart: now - 60 * day, refEnd: now - 30 * day };
    }

    const dateIdx  = this.patchDays.indexOf(targetDate);
    const curStart = Math.floor(new Date(targetDate).getTime() / 1000);
    // Upper bound = next patch date (or open-ended for the latest patch)
    const curEnd   = dateIdx >= 0 && dateIdx < this.patchDays.length - 1
      ? Math.floor(new Date(this.patchDays[dateIdx + 1]).getTime() / 1000)
      : 0;
    // Reference = the patch window before the selected one; fall back to 14 days if first patch
    const refDate  = dateIdx > 0 ? this.patchDays[dateIdx - 1] : null;
    const refStart = refDate
      ? Math.floor(new Date(refDate).getTime() / 1000)
      : curStart - 14 * day;

    return { curStart, curEnd, refStart, refEnd: curStart };
  }

  /**
   * Joins current-period stats with reference-period stats to produce display rows.
   * Usage rate = item matches / total hero matches for the period, expressed as %.
   * Change columns = current value − reference value (signed delta, percentage points).
   * Items with no item_slot_type (abilities, passives) or filtered-out tier are skipped.
   */
  private computeItemRows(): ItemStatRow[] {
    const curMap = new Map<number, ApiItemStat>(this.itemsCurrentStats.map(s => [s.item_id, s]));
    const refMap = new Map<number, ApiItemStat>(this.itemsRefStats.map(s => [s.item_id, s]));
    const rows: ItemStatRow[] = [];

    for (const [itemId, cur] of curMap) {
      const item = this.items.get(itemId);
      if (!item?.item_slot_type) continue;

      const tier = item.item_tier ?? 0;
      if (tier > 0 && !this.itemsTiers.has(tier)) continue;

      const ref          = refMap.get(itemId);
      const winRate      = cur.matches > 0 ? (cur.wins / cur.matches) * 100 : 0;
      const refWinRate   = ref && ref.matches > 0 ? (ref.wins / ref.matches) * 100 : 0;
      const usagePct     = this.heroMatchesCur > 0 ? (cur.matches / this.heroMatchesCur) * 100 : 0;
      const refUsagePct  = ref && this.heroMatchesRef > 0 ? (ref.matches / this.heroMatchesRef) * 100 : 0;

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

  private renderItemsTab(): string {
    if (!this.hero) return '';
    const name = this.hero.name ?? 'Hero';

    if (this.itemsError) {
      return `
        <div class="flex flex-col items-center justify-center gap-3 py-24 text-grey-500">
          <div class="w-10 h-10 rounded-full border border-charcoal-400 flex items-center justify-center text-grey-500 text-lg">!</div>
          <p class="text-sm">Failed to load item statistics.</p>
          <button id="items-retry-btn"
            class="px-4 py-2 bg-charcoal-300 hover:bg-charcoal-200 text-grey-300 text-sm rounded-lg border border-charcoal-400 transition-colors">
            Retry
          </button>
        </div>`;
    }

    return `
      <div class="p-8 space-y-5 max-w-6xl">
        <!-- Title + description -->
        <div>
          <h2 class="text-2xl font-bold text-white tracking-wide">${name} — Items</h2>
          <p class="text-dry-sage-500 text-sm mt-1">
            Analyze the meta trends for all items used on ${name}, filtering by rank,
            item type, item cost, and date range to uncover which items are most popular
            and how well they perform.
          </p>
          <div class="mt-4 h-px bg-gradient-to-r from-dry-sage-400/50 via-charcoal-400 to-transparent"></div>
        </div>

        <!-- Filter bar -->
        ${this.renderItemsFilters()}

        <!-- Table or skeleton -->
        ${this.itemsLoading ? this.renderItemsTableSkeleton() : this.renderItemsTable(this.computeItemRows())}
      </div>`;
  }

  private isFiltered(): boolean {
    // Period is "changed" when it's not pointing at the latest patch
    const latestPatch = this.patchDays.length > 0 ? this.patchDays[this.patchDays.length - 1] : '';
    const periodChanged = this.itemsPeriod !== latestPatch && this.itemsPeriod !== 'latest';
    const rankChanged   = this.itemsRank.mode !== 'all';
    const tierChanged   = this.itemsTiers.size !== 4 || ![1, 2, 3, 4].every(t => this.itemsTiers.has(t));
    return periodChanged || rankChanged || tierChanged;
  }

  private renderItemsFilters(): string {
    const rankOpts = RANKS.map(r => `
      <option value="${r.tier}"
        ${this.itemsRank.mode === 'exact' && this.itemsRank.tier === r.tier ? 'selected' : ''}>
        ${r.name}
      </option>
      <option value="${r.tier}+"
        ${this.itemsRank.mode === 'plus' && this.itemsRank.tier === r.tier ? 'selected' : ''}>
        ${r.name} +
      </option>`).join('');

    // Last 7 patches (newest first) — populated once patchDays are fetched
    const recentPatches = this.patchDays.slice(-7).reverse();
    const patchOpts = recentPatches.length > 0
      ? `<optgroup label="Patches">
          ${recentPatches.map((date, i) => `
            <option value="${date}" ${this.itemsPeriod === date ? 'selected' : ''}>
              ${date}${i === 0 ? ' — Latest Patch' : ''}
            </option>`).join('')}
         </optgroup>`
      : `<option value="latest" selected>Latest Patch</option>`;

    return `
      <div class="flex items-center gap-3 flex-wrap">
        <!-- Period / Patch selector — shows up to 7 past patches + relative options -->
        <select id="items-period-select"
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
        <select id="items-rank-select"
          class="bg-charcoal-200 border border-charcoal-400 text-grey-300 text-sm rounded-lg px-3 py-2
                 cursor-pointer hover:border-charcoal-300 focus:outline-none focus:border-dry-sage-400 transition-colors">
          <option value="all" ${this.itemsRank.mode === 'all' ? 'selected' : ''}>All Ranks</option>
          ${rankOpts}
        </select>

        <!-- Tier toggle buttons (multi-select, client-side filter) -->
        <div class="flex items-center gap-1">
          ${[1, 2, 3, 4].map(t => `
            <button data-tier="${t}"
              class="items-tier-btn px-3 py-1.5 text-sm font-semibold rounded border transition-colors
                ${this.itemsTiers.has(t)
                  ? 'bg-dry-sage-400/20 border-dry-sage-400 text-dry-sage-400'
                  : 'bg-charcoal-200 border-charcoal-400 text-grey-500 hover:border-charcoal-300 hover:text-grey-300'}">
              T${t}
            </button>`).join('')}
        </div>

        <!-- Refresh button — enabled only when a non-default filter is active -->
        ${(() => {
          const active = this.isFiltered();
          return `<button id="items-refresh-btn" ${active ? '' : 'disabled'}
            class="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded border transition-colors
              ${active
                ? 'bg-dry-sage-400/20 border-dry-sage-400 text-dry-sage-400 hover:bg-dry-sage-400/30 cursor-pointer'
                : 'bg-charcoal-200 border-charcoal-400 text-grey-600 cursor-not-allowed opacity-50'}">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M4 4v5h5M20 20v-5h-5M4.93 14A8 8 0 1020 12" />
            </svg>
            Refresh
          </button>`;
        })()}
      </div>`;
  }

  private renderItemsTableSkeleton(): string {
    return `
      <div class="overflow-x-auto rounded-xl border border-charcoal-400 animate-pulse">
        <div class="bg-charcoal-300 h-10 w-full border-b border-charcoal-400 rounded-t-xl"></div>
        ${Array.from({ length: 8 }).map((_, i) => `
          <div class="flex items-center gap-4 px-4 py-3 border-b border-charcoal-400 ${i % 2 === 0 ? 'bg-charcoal-100' : 'bg-charcoal-200/40'}">
            <div class="w-9 h-9 rounded bg-charcoal-300 shrink-0"></div>
            <div class="h-3 w-32 rounded bg-charcoal-300"></div>
            <div class="ml-auto flex items-center gap-6">
              ${Array.from({ length: 5 }).map(() => `<div class="h-3 w-14 rounded bg-charcoal-300"></div>`).join('')}
            </div>
          </div>`).join('')}
      </div>`;
  }

  private renderItemsTable(rows: ItemStatRow[]): string {
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
              ${this.sortTh('Item',         'name',          'left')}
              ${this.sortTh('Cost',         'cost',          'right')}
              ${this.sortTh('Win Rate',     'winRate',       'left')}
              ${this.sortTh('WR Change',    'winRateChange', 'right')}
              ${this.sortTh('Usage',        'usage',         'left')}
              ${this.sortTh('Usage Change', 'usageChange',   'right')}
              ${this.sortTh('Win / Loss',   'winloss',       'right')}
            </tr>
          </thead>
          <tbody>
            ${rows.map((row, i) => this.renderItemRow(row, i)).join('')}
          </tbody>
        </table>
      </div>`;
  }

  private renderItemRow(row: ItemStatRow, idx: number): string {
    const item      = this.items.get(row.itemId);
    const imgUrl    = item ? itemImg(item) : '';
    const name      = item?.name ?? `#${row.itemId}`;
    const cost      = item?.cost ?? null;
    const tier      = item?.item_tier ?? null;
    const tierLabel = tier && TIER_LABEL[tier] ? TIER_LABEL[tier] : null;
    const slotCol   = item?.item_slot_type === 'weapon'   ? '#f97316'
                    : item?.item_slot_type === 'spirit'   ? '#a855f7'
                    : item?.item_slot_type === 'vitality' ? '#22c55e'
                    : '#4b5563';

    return `
      <tr class="border-b border-charcoal-400 ${idx % 2 === 0 ? 'bg-charcoal-100' : 'bg-charcoal-200/40'} hover:bg-charcoal-300/50 transition-colors">

        <!-- Item: icon + tier badge + name -->
        <td class="px-4 py-3">
          <div class="flex items-center gap-3">
            <div class="relative shrink-0" style="width:36px;height:36px;">
              <div class="w-full h-full rounded border bg-charcoal-300 overflow-hidden"
                   style="border-color:${slotCol}55;">
                ${imgUrl ? `<img src="${imgUrl}" alt="${name}" class="w-full h-full object-cover"/>` : ''}
                <div class="absolute bottom-0 left-0 right-0 h-0.5" style="background:${slotCol};"></div>
                ${tierLabel ? `
                  <span class="absolute top-0 right-0 text-[7px] font-bold px-0.5 leading-tight rounded-bl"
                        style="background:${slotCol};color:#fff;">${tierLabel}</span>` : ''}
              </div>
            </div>
            <span class="text-grey-900 text-sm font-medium">${name}</span>
          </div>
        </td>

        <!-- Cost: souls icon + value -->
        <td class="px-4 py-3 text-right">
          ${cost !== null ? `
            <span class="inline-flex items-center gap-1.5 justify-end">
              <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background:#3b82f6;box-shadow:0 0 4px #3b82f655;"></span>
              <span class="text-blue-400 font-semibold text-xs">${cost.toLocaleString()}</span>
            </span>` : `<span class="text-grey-600 text-xs">—</span>`}
        </td>

        <!-- Win Rate: percentage + progress bar -->
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
          <span class="${this.changeClass(row.winRateChange)} text-sm">${this.formatChange(row.winRateChange)}</span>
        </td>

        <!-- Usage: percentage + progress bar -->
        <td class="px-4 py-3">
          <div class="flex flex-col gap-1" style="min-width:100px;">
            <span class="text-white text-sm font-semibold">${row.usagePct.toFixed(2)}%</span>
            <div class="h-1 rounded-full bg-charcoal-400" style="width:100px;">
              <div class="h-full rounded-full bg-green-500 transition-all"
                   style="width:${Math.min(row.usagePct, 100).toFixed(1)}%;"></div>
            </div>
          </div>
        </td>

        <!-- Usage Change -->
        <td class="px-4 py-3 text-right">
          <span class="${this.changeClass(row.usageChange)} text-sm">${this.formatChange(row.usageChange)}</span>
        </td>

        <!-- Win / Loss volume -->
        <td class="px-4 py-3 text-right">
          <span class="text-grey-400 text-xs font-medium whitespace-nowrap">
            ${this.formatK(row.wins)} / ${this.formatK(row.losses)}
          </span>
        </td>
      </tr>`;
  }

  // ── Items tab helpers ────────────────────────────────────────────────────────

  private sortTh(label: string, col: ItemsSortCol, align: 'left' | 'right'): string {
    const active = this.itemsSortCol === col;
    const arrow  = active ? (this.itemsSortDir === 'desc' ? '↓' : '↑') : '↕';
    const base   = `items-sort-btn flex items-center gap-1 text-[10px] uppercase tracking-widest font-medium transition-colors whitespace-nowrap`;
    const color  = active ? 'text-dry-sage-400' : 'text-grey-500 hover:text-grey-300';
    const arrowCls = active ? 'text-dry-sage-400' : 'text-grey-700';
    return `
      <th class="px-4 py-3 ${align === 'right' ? 'text-right' : 'text-left'}">
        <button data-sort="${col}" class="${base} ${color} ${align === 'right' ? 'ml-auto' : ''}">
          ${label}
          <span class="${arrowCls} text-[11px]">${arrow}</span>
        </button>
      </th>`;
  }

  private changeClass(val: number): string {
    if (val >= 5)   return 'text-emerald-500 font-semibold';
    if (val > 0)    return 'text-green-400';
    if (val === 0)  return 'text-grey-500';
    if (val > -5)   return 'text-orange-400';
    return 'text-red-600 font-bold';
  }

  private formatChange(val: number): string {
    if (val === 0) return '—';
    return `${val > 0 ? '+' : ''}${val.toFixed(2)}%`;
  }

  private formatK(n: number): string {
    return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);
  }

  private refreshTabContent(): void {
    const el = this.container?.querySelector<HTMLElement>('#hero-tab-content');
    if (el) {
      el.innerHTML = this.renderTabContent();
      this.bindBuildEvents();
      this.bindItemsEvents();
    }
  }

  // ── Event binding ───────────────────────────────────────────────────────────

  private bindEvents(): void {
    this.container?.querySelectorAll<HTMLButtonElement>('.hero-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab as Tab | undefined;
        if (tab && tab !== this.currentTab) {
          this.currentTab = tab;
          this.render();
          if (tab === 'items' && !this.itemsLoaded && !this.itemsLoading) {
            this.fetchItemsData();
          }
        }
      });
    });
    this.bindBuildEvents();
    this.bindItemsEvents();
    this.bindAbilityEvents();
  }

  private bindBuildEvents(): void {
    this.container?.querySelectorAll<HTMLButtonElement>('.build-selector-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.buildIdx ?? '', 10);
        if (isNaN(idx) || idx === this.selectedBuildIdx) return;
        this.selectedBuildIdx = idx;
        // Re-render the builds tab content — all data is already in memory so this is instant.
        // This correctly updates the top-accent bar (inline style) and all selected-state classes.
        const tabContent = this.container?.querySelector('#hero-tab-content');
        if (tabContent) {
          tabContent.innerHTML = this.renderBuildsTab();
          this.bindBuildEvents();
        }
      });
    });
  }

  /**
   * Wires up all interactive controls inside the Items tab.
   *
   * Controls that trigger a new API request (period selector, rank selector,
   * refresh button) clear the cached stats and call fetchItemsData().
   *
   * Controls that only reorganise already-fetched data (column sort headers,
   * tier toggle buttons) just call refreshTabContent() — no network round-trip.
   */
  private bindItemsEvents(): void {
    if (this.currentTab !== 'items') return;

    const periodSel = this.container?.querySelector<HTMLSelectElement>('#items-period-select');
    periodSel?.addEventListener('change', () => {
      this.itemsPeriod = periodSel.value as ItemsPeriod;
      this.itemsLoaded = false;
      this.itemsCurrentStats = [];
      this.itemsRefStats = [];
      this.fetchItemsData();
    });

    const rankSel = this.container?.querySelector<HTMLSelectElement>('#items-rank-select');
    rankSel?.addEventListener('change', () => {
      const val = rankSel.value;
      if (val === 'all') {
        this.itemsRank = { mode: 'all', tier: 0 };
      } else if (val.endsWith('+')) {
        // "tier+" = selected rank AND all higher tiers (min_average_badge only, no max)
        this.itemsRank = { mode: 'plus', tier: parseInt(val) };
      } else {
        this.itemsRank = { mode: 'exact', tier: parseInt(val) };
      }
      this.itemsLoaded = false;
      this.itemsCurrentStats = [];
      this.itemsRefStats = [];
      this.fetchItemsData();
    });

    // Column sort — client-side re-sort only, no re-fetch
    this.container?.querySelectorAll<HTMLButtonElement>('.items-sort-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const col = btn.dataset.sort as ItemsSortCol;
        if (this.itemsSortCol === col) {
          this.itemsSortDir = this.itemsSortDir === 'desc' ? 'asc' : 'desc';
        } else {
          this.itemsSortCol = col;
          this.itemsSortDir = 'desc';
        }
        this.refreshTabContent();
      });
    });

    // Tier toggles are client-side — no re-fetch, just re-render the table
    this.container?.querySelectorAll<HTMLButtonElement>('.items-tier-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tier = parseInt(btn.dataset.tier ?? '');
        if (isNaN(tier)) return;
        if (this.itemsTiers.has(tier)) {
          this.itemsTiers.delete(tier);
        } else {
          this.itemsTiers.add(tier);
        }
        this.refreshTabContent();
      });
    });

    this.container?.querySelector<HTMLButtonElement>('#items-retry-btn')
      ?.addEventListener('click', () => {
        this.itemsError = false;
        this.fetchItemsData();
      });

    // Refresh button — re-fetch with current filters; only enabled when isFiltered()
    this.container?.querySelector<HTMLButtonElement>('#items-refresh-btn')
      ?.addEventListener('click', () => {
        if (!this.isFiltered()) return;
        this.itemsLoaded = false;
        this.itemsCurrentStats = [];
        this.itemsRefStats = [];
        this.fetchItemsData();
      });
  }
}
