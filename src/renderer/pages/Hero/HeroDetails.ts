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
} from '../../../lib/types';

const API = 'https://api.deadlock-api.com';

// ── Module-level items cache (survives hero navigation) ───────────────────────
let _itemsCache: Map<number, ItemData> | null = null;
let _itemsFetch: Promise<Map<number, ItemData>> | null = null;

function fetchItemsCache(): Promise<Map<number, ItemData>> {
  if (_itemsCache) return Promise.resolve(_itemsCache);
  if (_itemsFetch) return _itemsFetch;
  // GET /v1/assets/items — full item list including abilities, weapons, upgrades
  _itemsFetch = fetch(`${API}/v1/assets/items`)
    .then(r => (r.ok ? r.json() : []))
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

  private async fetchAll(): Promise<void> {
    if (!this.hero) return;
    const id = this.hero.id;

    try {
      const [builds, stats, items, abilities, abilityOrder] = await Promise.all([
        // GET /v1/builds?hero_id={id}&sort_by=weekly_favorites&limit=3&only_latest=true&build_language=English
        // build_language=English filters to NA/EN builds, avoiding non-English region builds
        fetch(`${API}/v1/builds?hero_id=${id}&sort_by=weekly_favorites&limit=3&only_latest=true&build_language=English`)
          .then(r => (r.ok ? r.json() : [])),

        // GET /v1/analytics/hero-build-stats/{id}
        fetch(`${API}/v1/analytics/hero-build-stats/${id}`)
          .then(r => (r.ok ? r.json() : [])),

        // GET /v1/assets/items — cached module-level
        fetchItemsCache(),

        // GET /v1/assets/items/by-hero-id/{id} — hero signature abilities
        fetch(`${API}/v1/assets/items/by-hero-id/${id}`)
          .then(r => (r.ok ? r.json() : [])),

        // GET /v1/analytics/ability-order-stats?hero_id={id}&min_matches=200
        fetch(`${API}/v1/analytics/ability-order-stats?hero_id=${id}&min_matches=200`)
          .then(r => (r.ok ? r.json() : [])),
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
      this.heroAbilities = rawAbilities
        .filter(a => a.name !== 'Melee' && !a.name.includes('_'))
        .slice(0, 4);

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

  private renderBuildSummary(build: BuildData, idx: number): string {
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

    const TIER_LABEL: Record<number, string> = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV' };

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

  private renderSkillVariation(
    stat: AbilityOrderStats,
    varIdx: number,
    abilityIdxMap: Map<number, number>,
  ): string {
    const wr       = stat.matches > 0 ? (stat.wins / stat.matches * 100).toFixed(1) : '—';
    const steps    = stat.abilities.length;
    const CELL     = 22; // px per column

    // Build 4×steps grid
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

  // ── Event binding ───────────────────────────────────────────────────────────

  private bindEvents(): void {
    this.container?.querySelectorAll<HTMLButtonElement>('.hero-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab as Tab | undefined;
        if (tab && tab !== this.currentTab) {
          this.currentTab = tab;
          this.render();
        }
      });
    });
    this.bindBuildEvents();
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
}
