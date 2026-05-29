/**
 * Rankings — Leaderboard général (joueurs) et par héros.
 *
 * DATA FLOW — Player Leaderboard:
 *   GET https://api.deadlock-api.com/v1/leaderboard/{region}
 *   → { entries: ApiLeaderboardEntry[] } — classement ordonné par région
 *
 *   GET https://api.deadlock-api.com/v1/players/steam?account_ids=...
 *   → SteamProfileData[] — avatars & noms Steam par batch (max 100)
 *
 *   GET https://api.deadlock-api.com/v1/assets/heroes
 *   → HeroAsset[] — portraits + noms pour la colonne Top Heroes et la liste héros
 *
 * DATA FLOW — Hero Leaderboard:
 *   GET https://api.deadlock-api.com/v1/leaderboard/{region}/{hero_id}
 *   → { entries: ApiLeaderboardEntry[] } — classement spécifique au héros sélectionné
 */

import rankInitiateUrl  from '../../../assets/icons/RankBadge/Initiator.png?url';
import rankSeekerUrl    from '../../../assets/icons/RankBadge/Seekers.png?url';
import rankAlchemistUrl from '../../../assets/icons/RankBadge/Alchemist.png?url';
import rankArcanistUrl  from '../../../assets/icons/RankBadge/Arcanist.png?url';
import rankRitualistUrl from '../../../assets/icons/RankBadge/Ritualist.png?url';
import rankEmissaryUrl  from '../../../assets/icons/RankBadge/Emissary.png?url';
import rankArchonUrl    from '../../../assets/icons/RankBadge/Archon.png?url';
import rankOracleUrl    from '../../../assets/icons/RankBadge/Oracle.png?url';
import rankPhantomUrl   from '../../../assets/icons/RankBadge/Phantom.png?url';
import rankAscendantUrl from '../../../assets/icons/RankBadge/Ascendent.png?url';
import rankEternusUrl   from '../../../assets/icons/RankBadge/Eternus.png?url';

const DEADLOCK_API     = 'https://api.deadlock-api.com';
const ENTRIES_PER_PAGE = 50;

const RANK_BADGE_URLS: Record<number, string> = {
  1:  rankInitiateUrl,  2:  rankSeekerUrl,    3:  rankAlchemistUrl,
  4:  rankArcanistUrl,  5:  rankRitualistUrl, 6:  rankEmissaryUrl,
  7:  rankArchonUrl,    8:  rankOracleUrl,    9:  rankPhantomUrl,
  10: rankAscendantUrl, 11: rankEternusUrl,
};

const RANK_NAMES: Record<number, string> = {
  1:  'Initiate',  2:  'Seeker',    3:  'Alchemist', 4:  'Arcanist',
  5:  'Ritualist', 6:  'Emissary', 7:  'Archon',    8:  'Oracle',
  9:  'Phantom',   10: 'Ascendant', 11: 'Eternus',
};

const SUBTIER_ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI'];

// ── Types ─────────────────────────────────────────────────────────────────────

type Region = 'NAmerica' | 'Europe' | 'Asia' | 'SAmerica' | 'Oceania';

const REGIONS: { value: Region; label: string }[] = [
  { value: 'NAmerica', label: 'North America' },
  { value: 'Europe',   label: 'Europe'         },
  { value: 'Asia',     label: 'Asia'            },
  { value: 'SAmerica', label: 'South America'  },
  { value: 'Oceania',  label: 'Oceania'        },
];

interface ApiLeaderboardEntry {
  account_name:         string | null;
  badge_level:          number | null;
  possible_account_ids: number[];
  rank:                 number | null;
  ranked_rank:          number | null;
  ranked_subrank:       number | null;
  top_hero_ids:         number[];
}

export interface GeneralLeaderboardEntry {
  displayRank: number;
  accountName: string;
  badgeLevel:  number;
  accountId:   number | null;
  topHeroIds:  number[];
  rankTier:    number;
  rankSubtier: number;
  avatarUrl:   string;
}

export interface HeroLeaderboardEntry {
  displayRank: number;
  accountName: string;
  badgeLevel:  number;
  accountId:   number | null;
  globalRank:  number;
  rankTier:    number;
  rankSubtier: number;
  avatarUrl:   string;
}

interface HeroAsset {
  id:               number;
  name:             string;
  player_selectable?: boolean;
  disabled?:        boolean;
  in_development?:  boolean;
  images?: {
    icon_hero_card_webp?:   string;
    icon_hero_card?:        string;
    icon_image_small_webp?: string;
    icon_image_small?:      string;
  };
}

interface SteamProfileData {
  account_id:   number;
  personaname:  string;
  avatarmedium: string;
  avatar:       string;
}

// ── Mock Data (100 entries — demonstrates 2-page pagination) ──────────────────

const PLAYER_NAMES = [
  'Salah', 'TTV/Reimux_xx', 'Maht', 'adofan11', 'dew', 'FPSL Lomein', 'eve',
  'DiscoVirtuoso.ttv', 'wander', 'read this if noob lol', 'Teemo', 'BlazeRunner99',
  'NocturnalX', 'Phosphophyllite', 'Jitler (Fraudmaxx?)', 'Jonny', 'Caleb',
  'unbound cripple', 'Twitch/Shieere', 'Cac2510 TTV', 'MCCAIN', 'chunky chips',
  'BigDWH15', 'The Aura King', 'Ice', 'GlitchHunter', 'StormBringer', 'PixelKnight',
  'DarkMage', 'SilverArrow', 'VoidWalker', 'CrimsonFang', 'IronWill', 'ShadowStep',
];

const HERO_POOL = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

function makeMockGeneralEntries(count: number): GeneralLeaderboardEntry[] {
  return Array.from({ length: count }, (_, i) => {
    const nameIdx   = i % PLAYER_NAMES.length;
    const nameSuffix = i >= PLAYER_NAMES.length ? ` #${Math.floor(i / PLAYER_NAMES.length) + 1}` : '';
    const subtier   = i < 10 ? 6 : i < 30 ? 5 : i < 60 ? 4 : i < 80 ? 3 : 2;
    const heroCount = i % 4 === 0 ? 0 : (i % 3) + 1;
    const heroStart = i % HERO_POOL.length;
    return {
      displayRank: i + 1,
      accountName: PLAYER_NAMES[nameIdx] + nameSuffix,
      badgeLevel:  110 + subtier,
      accountId:   100001 + i,
      topHeroIds:  HERO_POOL.slice(heroStart, heroStart + heroCount),
      rankTier:    11,
      rankSubtier: subtier,
      avatarUrl:   '',
    };
  });
}

function makeMockHeroEntries(count: number): HeroLeaderboardEntry[] {
  return Array.from({ length: count }, (_, i) => {
    const nameIdx    = i % PLAYER_NAMES.length;
    const nameSuffix = i >= PLAYER_NAMES.length ? ` #${Math.floor(i / PLAYER_NAMES.length) + 1}` : '';
    const subtier    = i < 10 ? 6 : i < 30 ? 5 : i < 60 ? 4 : i < 80 ? 3 : 2;
    return {
      displayRank: i + 1,
      accountName: PLAYER_NAMES[nameIdx] + nameSuffix,
      badgeLevel:  110 + subtier,
      accountId:   100001 + i,
      globalRank:  i + 1 + (i * 3 % 11),
      rankTier:    11,
      rankSubtier: subtier,
      avatarUrl:   '',
    };
  });
}

const MOCK_GENERAL: GeneralLeaderboardEntry[] = makeMockGeneralEntries(100);
const MOCK_HERO:    HeroLeaderboardEntry[]    = makeMockHeroEntries(100);

// ── Utilities ─────────────────────────────────────────────────────────────────

function badgeToDisplay(badgeLevel: number): { tier: number; subtier: number; label: string } {
  const tier    = Math.floor(badgeLevel / 10);
  const subtier = badgeLevel % 10;
  const name    = RANK_NAMES[tier] ?? 'Unknown';
  const roman   = SUBTIER_ROMAN[subtier] ?? '';
  return { tier, subtier, label: roman ? `${name} ${roman}` : name };
}

function nameInitials(name: string): string {
  return name.slice(0, 2).toUpperCase();
}

/**
 * Renders a circular avatar.
 * Pattern: fallback initials are always in the DOM (absolute, behind).
 * The avatar <img> overlays on top. onerror="this.remove()" reveals the fallback.
 * No recursive error: removing the element prevents further onerror firing.
 */
function renderAvatar(avatarUrl: string, name: string): string {
  const safe = name.replace(/"/g, '&quot;');
  return `
    <div class="relative w-7 h-7 rounded-full shrink-0 overflow-hidden border border-charcoal-400">
      <div class="absolute inset-0 bg-charcoal-400 flex items-center justify-center">
        <span class="text-[9px] font-bold text-grey-500 select-none">${nameInitials(name)}</span>
      </div>
      ${avatarUrl
        ? `<img src="${avatarUrl}" alt="${safe}"
               class="absolute inset-0 w-full h-full object-cover"
               onerror="this.remove()">`
        : ''}
    </div>`;
}

function parseApiEntries(raw: ApiLeaderboardEntry[]): GeneralLeaderboardEntry[] {
  return raw.map((e, i) => {
    const badgeLevel = e.badge_level ?? 116;
    const { tier, subtier } = badgeToDisplay(badgeLevel);
    return {
      displayRank: i + 1,
      accountName: e.account_name ?? `Player #${i + 1}`,
      badgeLevel,
      accountId:   e.possible_account_ids[0] ?? null,
      topHeroIds:  e.top_hero_ids ?? [],
      rankTier:    tier,
      rankSubtier: subtier,
      avatarUrl:   '',
    };
  });
}

function parseApiHeroEntries(
  raw:            ApiLeaderboardEntry[],
  generalEntries: GeneralLeaderboardEntry[],
): HeroLeaderboardEntry[] {
  return raw.map((e, i) => {
    const badgeLevel = e.badge_level ?? 116;
    const { tier, subtier } = badgeToDisplay(badgeLevel);
    const accountId  = e.possible_account_ids[0] ?? null;
    const globalRank = accountId
      ? (generalEntries.find(g => g.accountId === accountId)?.displayRank ?? 0)
      : 0;
    return {
      displayRank: i + 1,
      accountName: e.account_name ?? `Player #${i + 1}`,
      badgeLevel,
      accountId,
      globalRank,
      rankTier:    tier,
      rankSubtier: subtier,
      avatarUrl:   '',
    };
  });
}

// ── Main Class ────────────────────────────────────────────────────────────────

export class RankingsPage {
  private container: HTMLElement | null = null;

  private activeTab:      'player' | 'hero' = 'player';
  private selectedRegion: Region             = 'NAmerica';
  private selectedHeroId: number | null      = null;
  private playerPage                         = 1;
  private heroPage                           = 1;

  // Caches
  private heroes:      HeroAsset[]                            = [];
  private heroMap:     Map<number, HeroAsset>                 = new Map();
  private playerCache: Map<Region, GeneralLeaderboardEntry[]> = new Map();
  private heroLbCache: Map<string, HeroLeaderboardEntry[]>    = new Map();
  private steamCache:  Map<number, SteamProfileData>          = new Map();

  // Per-key loading sets — prevent duplicate in-flight requests
  private loadingRegions:  Set<Region>  = new Set();
  private loadingHeroKeys: Set<string>  = new Set();
  private heroesLoaded = false;

  mount(container: HTMLElement): void {
    this.container = container;
    this.renderShell();
    this.init();
  }

  private async init(): Promise<void> {
    await this.fetchHeroes();
    await this.fetchPlayerLeaderboard(this.selectedRegion);
    this.renderContent();
  }

  // ── Shell (rendered once, never re-rendered) ───────────────────────────────

  private renderShell(): void {
    if (!this.container) return;
    this.container.innerHTML = `
      <div id="rankings-root" class="min-h-screen bg-charcoal-100">
        <div class="max-w-7xl mx-auto px-6 py-6">

          <!-- Page header -->
          <div class="mb-5">
            <h1 class="text-2xl font-bold text-white tracking-wide">Deadlock Leaderboard</h1>
            <p id="rankings-desc" class="text-grey-600 text-sm mt-1 leading-relaxed max-w-2xl">
              Welcome to the Deadlock elite player rankings! This leaderboard showcases the top
              players based on Deadlock's in-game ranking system. This leaderboard mirrors the
              in-game leaderboard and is updated daily.
            </p>
          </div>

          <!-- Controls bar -->
          <div class="flex flex-wrap items-center justify-between gap-3 mb-5">

            <!-- Tab Switcher -->
            <div class="flex gap-1 bg-charcoal-200 rounded-lg p-1 border border-grey-200">
              <button class="tab-btn px-4 py-1.5 rounded-md text-sm font-medium transition-all
                             duration-150 bg-charcoal-300 text-dry-sage-400"
                      data-tab="player">
                Leaderboard Player
              </button>
              <button class="tab-btn px-4 py-1.5 rounded-md text-sm font-medium transition-all
                             duration-150 text-grey-600 hover:text-white"
                      data-tab="hero">
                Leaderboard Heroes
              </button>
            </div>

            <!-- Region Selector -->
            <div class="flex items-center gap-2">
              <span class="text-grey-500 text-xs uppercase tracking-wider">Region</span>
              <div class="relative">
                <select id="region-select"
                  class="appearance-none bg-charcoal-200 border border-grey-200 text-white text-sm
                         rounded-lg pl-3 pr-8 py-1.5 cursor-pointer focus:outline-none
                         focus:border-dry-sage-400 hover:border-grey-400 transition-colors">
                  ${REGIONS.map(r => `
                    <option value="${r.value}" ${r.value === this.selectedRegion ? 'selected' : ''}>
                      ${r.label}
                    </option>`).join('')}
                </select>
                <svg class="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-grey-500
                            pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="m19 9-7 7-7-7"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Separator -->
          <div class="h-px bg-gradient-to-r from-dry-sage-400/30 via-charcoal-400
                      to-transparent mb-5"></div>

          <!-- Dynamic content — only this section is re-rendered -->
          <div id="rankings-content">
            ${this.renderSkeletonRows(15)}
          </div>

        </div>
      </div>`;

    this.wireShellEvents();
  }

  private wireShellEvents(): void {
    if (!this.container) return;

    // ── Tabs ──
    this.container.querySelectorAll<HTMLButtonElement>('.tab-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const tab = btn.dataset.tab as 'player' | 'hero';
        if (tab === this.activeTab) return;
        this.activeTab  = tab;
        this.playerPage = 1;
        this.heroPage   = 1;
        this.updateTabButtons();
        this.updateHeaderDesc();
        this.renderContent();
        // Auto-fetch hero leaderboard when switching to the hero tab for the first time
        if (tab === 'hero' && this.selectedHeroId !== null) {
          const key = `${this.selectedRegion}:${this.selectedHeroId}`;
          if (!this.heroLbCache.has(key)) {
            await this.fetchHeroLeaderboard(this.selectedRegion, this.selectedHeroId);
            this.renderContent();
          }
        }
      });
    });

    // ── Region ──
    const regionSelect = this.container.querySelector<HTMLSelectElement>('#region-select');
    regionSelect?.addEventListener('change', async () => {
      this.selectedRegion = regionSelect.value as Region;
      this.playerPage     = 1;
      this.heroPage       = 1;
      this.updateHeaderDesc();
      this.renderContent(); // show skeleton immediately
      if (this.activeTab === 'player') {
        await this.fetchPlayerLeaderboard(this.selectedRegion);
      } else if (this.selectedHeroId !== null) {
        await this.fetchHeroLeaderboard(this.selectedRegion, this.selectedHeroId);
      }
      this.renderContent();
    });
  }

  private updateTabButtons(): void {
    if (!this.container) return;
    this.container.querySelectorAll<HTMLButtonElement>('.tab-btn').forEach(btn => {
      const active = btn.dataset.tab === this.activeTab;
      btn.className = `tab-btn px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-150 ${
        active ? 'bg-charcoal-300 text-dry-sage-400' : 'text-grey-600 hover:text-white'
      }`;
    });
  }

  private updateHeaderDesc(): void {
    const el = this.container?.querySelector<HTMLElement>('#rankings-desc');
    if (!el) return;
    // Hero tab shows its description inside the right panel — hide it from the header
    if (this.activeTab === 'hero') {
      el.style.display = 'none';
    } else {
      el.style.display = '';
      el.textContent =
        "Welcome to the Deadlock elite player rankings! This leaderboard showcases the top players "
        + "based on Deadlock's in-game ranking system. This leaderboard mirrors the in-game "
        + "leaderboard and is updated daily.";
    }
  }

  // ── Content (re-rendered on every state change) ────────────────────────────

  private renderContent(): void {
    const el = this.container?.querySelector<HTMLElement>('#rankings-content');
    if (!el) return;

    if (this.activeTab === 'player') {
      const allEntries = this.playerCache.get(this.selectedRegion);
      if (!allEntries && this.loadingRegions.has(this.selectedRegion)) {
        el.innerHTML = this.renderSkeletonRows(15);
        return;
      }
      const entries    = allEntries ?? MOCK_GENERAL;
      const total      = entries.length;
      const totalPages = Math.max(1, Math.ceil(total / ENTRIES_PER_PAGE));
      this.playerPage  = Math.min(this.playerPage, totalPages);
      const slice      = entries.slice(
        (this.playerPage - 1) * ENTRIES_PER_PAGE,
         this.playerPage      * ENTRIES_PER_PAGE,
      );
      el.innerHTML = this.renderPlayerTable(slice, this.playerPage, totalPages, total);
      this.wireTableLinks(el);
      this.wirePaginationEvents(el, 'player');

    } else {
      if (!this.heroesLoaded) {
        el.innerHTML = this.renderSkeletonRows(10);
        return;
      }
      const lbKey       = `${this.selectedRegion}:${this.selectedHeroId}`;
      const cached      = this.selectedHeroId !== null ? this.heroLbCache.get(lbKey) : undefined;
      const isLoading   = this.loadingHeroKeys.has(lbKey);
      const allEntries  = (isLoading && !cached)
        ? undefined
        : (cached ?? (this.selectedHeroId !== null ? MOCK_HERO : undefined));

      let slice: HeroLeaderboardEntry[] | undefined;
      let heroTotalPages = 1;
      let heroTotal      = 0;
      if (allEntries) {
        heroTotal      = allEntries.length;
        heroTotalPages = Math.max(1, Math.ceil(heroTotal / ENTRIES_PER_PAGE));
        this.heroPage  = Math.min(this.heroPage, heroTotalPages);
        slice          = allEntries.slice(
          (this.heroPage - 1) * ENTRIES_PER_PAGE,
           this.heroPage      * ENTRIES_PER_PAGE,
        );
      }

      el.innerHTML = this.renderHeroTab(slice, this.heroPage, heroTotalPages, heroTotal);
      this.wireHeroTabEvents(el);
      this.wirePaginationEvents(el, 'hero');
    }
  }

  // ── Player Leaderboard ────────────────────────────────────────────────────

  private renderPlayerTable(
    entries:    GeneralLeaderboardEntry[],
    page:       number,
    totalPages: number,
    total:      number,
  ): string {
    const from = (page - 1) * ENTRIES_PER_PAGE + 1;
    const to   = Math.min(page * ENTRIES_PER_PAGE, total);
    return `
      <div class="bg-charcoal-200 rounded-xl border border-grey-200 overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-grey-200 text-grey-500 text-xs uppercase tracking-wider">
              <th class="text-left pl-5 pr-3 py-3 w-14">Rank</th>
              <th class="text-left px-3 py-3">Player</th>
              <th class="text-left px-3 py-3">Rank Badge</th>
              <th class="text-left px-3 py-3">Top Heroes</th>
            </tr>
          </thead>
          <tbody>
            ${entries.map(e => this.renderPlayerRow(e)).join('')}
          </tbody>
        </table>
      </div>
      ${this.renderPagination(page, totalPages, total, from, to, 'player')}`;
  }

  private renderPlayerRow(e: GeneralLeaderboardEntry): string {
    const { label }   = badgeToDisplay(e.badgeLevel);
    const badgeImgUrl = RANK_BADGE_URLS[e.rankTier] ?? '';
    const rankClass   = e.displayRank === 1 ? 'text-yellow-400 font-bold'
                      : e.displayRank === 2 ? 'text-grey-500 font-semibold'
                      : e.displayRank === 3 ? 'text-grey-600 font-semibold'
                      : 'text-grey-500';

    const heroIcons = e.topHeroIds.slice(0, 3).map(hid => {
      const hero   = this.heroMap.get(hid);
      const imgUrl = hero?.images?.icon_image_small_webp ?? hero?.images?.icon_image_small ?? '';
      const safe   = (hero?.name ?? '').replace(/"/g, '&quot;');
      return imgUrl
        ? `<img src="${imgUrl}" alt="${safe}" title="${safe}"
               class="w-7 h-7 rounded-full object-cover border border-charcoal-400"
               onerror="this.remove()">`
        : `<div class="w-7 h-7 rounded-full bg-charcoal-400 border border-charcoal-500
                       flex items-center justify-center">
             <span class="text-grey-500 text-[9px]">?</span>
           </div>`;
    }).join('');

    return `
      <tr class="border-b border-charcoal-300 last:border-0
                 hover:bg-charcoal-300/40 transition-colors">
        <td class="pl-5 pr-3 py-2.5">
          <span class="${rankClass} text-sm tabular-nums">${e.displayRank}</span>
        </td>
        <td class="px-3 py-2.5">
          <div class="flex items-center gap-2">
            ${renderAvatar(e.avatarUrl, e.accountName)}
            <a href="#" data-account-id="${e.accountId ?? ''}"
               class="player-link text-white hover:text-dry-sage-400 font-medium
                      truncate max-w-[200px] transition-colors">
              ${e.accountName}
            </a>
          </div>
        </td>
        <td class="px-3 py-2.5">
          <div class="flex items-center gap-2">
            ${badgeImgUrl
              ? `<img src="${badgeImgUrl}" alt="${label}"
                     class="w-5 h-5 object-contain" onerror="this.remove()">`
              : ''}
            <span class="text-grey-600 text-xs whitespace-nowrap">${label}</span>
          </div>
        </td>
        <td class="px-3 py-2.5">
          <div class="flex items-center gap-1">
            ${heroIcons || '<span class="text-grey-500 text-xs">—</span>'}
          </div>
        </td>
      </tr>`;
  }

  // ── Hero Leaderboard ──────────────────────────────────────────────────────

  private renderHeroTab(
    entries:    HeroLeaderboardEntry[] | undefined,
    page:       number,
    totalPages: number,
    total:      number,
  ): string {
    const selectedHero = this.selectedHeroId !== null
      ? this.heroMap.get(this.selectedHeroId)
      : null;
    const heroName    = selectedHero?.name ?? 'Hero';
    const regionLabel = REGIONS.find(r => r.value === this.selectedRegion)?.label
                      ?? this.selectedRegion;

    return `
      <div class="flex gap-5" style="min-height: 600px;">

        <!-- LEFT: Hero Grid -->
        <div class="shrink-0 w-52 bg-charcoal-200 rounded-xl border border-grey-200
                    flex flex-col overflow-hidden">
          <div class="px-3 py-2 border-b border-grey-200 shrink-0">
            <p class="text-grey-500 text-xs uppercase tracking-wider font-medium">Heroes</p>
          </div>
          <div class="overflow-y-auto flex-1">
            <div class="grid grid-cols-3 gap-0.5 p-1.5">
              ${this.heroes.map(h => this.renderHeroGridItem(h)).join('')}
            </div>
          </div>
        </div>

        <!-- RIGHT: Leaderboard Panel -->
        <div class="flex-1 min-w-0">
          ${this.selectedHeroId === null
            ? `<div class="flex flex-col items-center justify-center h-64 gap-3">
                 <svg class="w-10 h-10 text-grey-500 opacity-30" fill="none"
                      stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                         d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2
                            0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                 </svg>
                 <p class="text-grey-500 text-sm">Select a hero to view their leaderboard</p>
               </div>`
            : `<!-- Dynamic hero title + description -->
               <div class="mb-4">
                 <h2 class="text-xl font-bold text-white">${heroName} Leaderboard</h2>
                 <p class="text-grey-600 text-sm mt-1 leading-relaxed">
                   Explore the top Deadlock ${heroName} players in ${regionLabel}.
                   This hero-specific leaderboard mirrors the in-game rankings and updates daily.
                 </p>
               </div>
               ${entries
                 ? this.renderHeroTable(entries, page, totalPages, total)
                 : this.renderSkeletonRows(10)}`
          }
        </div>
      </div>`;
  }

  private renderHeroGridItem(hero: HeroAsset): string {
    const isActive = hero.id === this.selectedHeroId;
    const imgUrl   = hero.images?.icon_hero_card_webp
                  ?? hero.images?.icon_hero_card
                  ?? hero.images?.icon_image_small_webp
                  ?? hero.images?.icon_image_small
                  ?? '';
    const safe     = hero.name.replace(/"/g, '&quot;');
    const abbr     = hero.name.slice(0, 2);

    return `
      <button data-hero-id="${hero.id}"
        class="hero-grid-btn flex flex-col items-center gap-0.5 p-1 rounded-lg
               transition-all duration-150
               ${isActive
                 ? 'bg-dry-sage-200/30 ring-1 ring-dry-sage-400'
                 : 'hover:bg-charcoal-300'}">
        <!-- Portrait with absolute-layered fallback initials -->
        <div class="relative w-14 h-14 rounded-lg overflow-hidden bg-charcoal-400
                    border ${isActive ? 'border-dry-sage-400' : 'border-charcoal-300'}">
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-grey-500 text-xs select-none">${abbr}</span>
          </div>
          ${imgUrl
            ? `<img src="${imgUrl}" alt="${safe}"
                   class="absolute inset-0 w-full h-full object-cover"
                   onerror="this.remove()">`
            : ''}
        </div>
        <span class="text-[10px] text-center leading-tight w-full truncate px-0.5
                     ${isActive ? 'text-dry-sage-400 font-medium' : 'text-grey-600'}">
          ${hero.name}
        </span>
      </button>`;
  }

  private renderHeroTable(
    entries:    HeroLeaderboardEntry[],
    page:       number,
    totalPages: number,
    total:      number,
  ): string {
    const from = (page - 1) * ENTRIES_PER_PAGE + 1;
    const to   = Math.min(page * ENTRIES_PER_PAGE, total);
    return `
      <div class="bg-charcoal-200 rounded-xl border border-grey-200 overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-grey-200 text-grey-500 text-xs uppercase tracking-wider">
              <th class="text-left pl-5 pr-3 py-3 w-14">Rank</th>
              <th class="text-left px-3 py-3">Player</th>
              <th class="text-left px-3 py-3">Rank Badge</th>
              <th class="text-left px-3 py-3 w-28">Global Rank</th>
            </tr>
          </thead>
          <tbody>
            ${entries.map(e => this.renderHeroRow(e)).join('')}
          </tbody>
        </table>
      </div>
      ${this.renderPagination(page, totalPages, total, from, to, 'hero')}`;
  }

  private renderHeroRow(e: HeroLeaderboardEntry): string {
    const { label }   = badgeToDisplay(e.badgeLevel);
    const badgeImgUrl = RANK_BADGE_URLS[e.rankTier] ?? '';
    const rankClass   = e.displayRank === 1 ? 'text-yellow-400 font-bold'
                      : e.displayRank === 2 ? 'text-grey-500 font-semibold'
                      : e.displayRank === 3 ? 'text-grey-600 font-semibold'
                      : 'text-grey-500';

    return `
      <tr class="border-b border-charcoal-300 last:border-0
                 hover:bg-charcoal-300/40 transition-colors">
        <td class="pl-5 pr-3 py-2.5">
          <span class="${rankClass} text-sm tabular-nums">${e.displayRank}</span>
        </td>
        <td class="px-3 py-2.5">
          <div class="flex items-center gap-2">
            ${renderAvatar(e.avatarUrl, e.accountName)}
            <a href="#" data-account-id="${e.accountId ?? ''}"
               class="player-link text-white hover:text-dry-sage-400 font-medium
                      truncate max-w-[180px] transition-colors">
              ${e.accountName}
            </a>
          </div>
        </td>
        <td class="px-3 py-2.5">
          <div class="flex items-center gap-2">
            ${badgeImgUrl
              ? `<img src="${badgeImgUrl}" alt="${label}"
                     class="w-5 h-5 object-contain" onerror="this.remove()">`
              : ''}
            <span class="text-grey-600 text-xs whitespace-nowrap">${label}</span>
          </div>
        </td>
        <td class="px-3 py-2.5">
          ${e.globalRank > 0
            ? `<span class="text-grey-500 tabular-nums">#${e.globalRank}</span>`
            : '<span class="text-grey-500 text-xs">—</span>'}
        </td>
      </tr>`;
  }

  // ── Pagination ────────────────────────────────────────────────────────────

  private renderPagination(
    page:       number,
    totalPages: number,
    total:      number,
    from:       number,
    to:         number,
    type:       'player' | 'hero',
  ): string {
    if (totalPages <= 1) return '';
    const hasPrev = page > 1;
    const hasNext = page < totalPages;

    const btnBase  = 'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors';
    const btnOn    = `${btnBase} bg-charcoal-300 text-white hover:bg-charcoal-400 border border-grey-200`;
    const btnOff   = `${btnBase} bg-charcoal-200 text-grey-500 opacity-40 cursor-not-allowed`;

    return `
      <div class="flex items-center justify-between mt-3 px-1">
        <span class="text-grey-500 text-xs">
          Showing <span class="text-grey-400 font-medium">${from}–${to}</span>
          of <span class="text-grey-400 font-medium">${total}</span> players
        </span>
        <div class="flex items-center gap-2">
          <button data-pag-action="prev" data-pag-type="${type}"
                  class="${hasPrev ? btnOn : btnOff}" ${hasPrev ? '' : 'disabled'}>
            ← Prev
          </button>
          <span class="text-grey-500 text-xs tabular-nums px-1">
            ${page} / ${totalPages}
          </span>
          <button data-pag-action="next" data-pag-type="${type}"
                  class="${hasNext ? btnOn : btnOff}" ${hasNext ? '' : 'disabled'}>
            Next →
          </button>
        </div>
      </div>`;
  }

  private wirePaginationEvents(el: HTMLElement, type: 'player' | 'hero'): void {
    el.querySelectorAll<HTMLButtonElement>(`[data-pag-type="${type}"]`).forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        const dir = btn.dataset.pagAction === 'prev' ? -1 : 1;
        if (type === 'player') {
          this.playerPage += dir;
        } else {
          this.heroPage += dir;
        }
        this.renderContent();
        // Scroll content back to top after page change
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  // ── Skeleton ──────────────────────────────────────────────────────────────

  private renderSkeletonRows(count: number): string {
    return `
      <div class="bg-charcoal-200 rounded-xl border border-grey-200 overflow-hidden">
        <div class="flex gap-8 px-5 py-3 border-b border-grey-200">
          ${['w-8', 'w-20', 'w-24', 'w-16'].map(w =>
            `<div class="h-2.5 ${w} rounded bg-charcoal-300 animate-pulse"></div>`
          ).join('')}
        </div>
        ${Array.from({ length: count }, () => `
          <div class="flex items-center gap-4 px-5 py-3 border-b border-charcoal-300
                      last:border-0 animate-pulse">
            <div class="h-4 w-5 rounded bg-charcoal-300 shrink-0"></div>
            <div class="flex items-center gap-2 flex-1">
              <div class="w-7 h-7 rounded-full bg-charcoal-300 shrink-0"></div>
              <div class="h-3 w-32 rounded bg-charcoal-300"></div>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-5 h-5 rounded bg-charcoal-300"></div>
              <div class="h-3 w-20 rounded bg-charcoal-300"></div>
            </div>
            <div class="flex gap-1">
              <div class="w-7 h-7 rounded-full bg-charcoal-300"></div>
              <div class="w-7 h-7 rounded-full bg-charcoal-300"></div>
              <div class="w-7 h-7 rounded-full bg-charcoal-300"></div>
            </div>
          </div>`).join('')}
      </div>`;
  }

  // ── Event Wiring ──────────────────────────────────────────────────────────

  private wireTableLinks(el: HTMLElement): void {
    el.querySelectorAll<HTMLAnchorElement>('.player-link').forEach(link => {
      link.addEventListener('click', ev => {
        ev.preventDefault();
        const accountId = parseInt(link.dataset.accountId ?? '', 10);
        if (accountId) {
          document.dispatchEvent(
            new CustomEvent('navigate-player', { detail: { accountId } }),
          );
        }
      });
    });
  }

  private wireHeroTabEvents(el: HTMLElement): void {
    el.querySelectorAll<HTMLButtonElement>('.hero-grid-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const heroId = parseInt(btn.dataset.heroId ?? '', 10);
        if (isNaN(heroId) || heroId === this.selectedHeroId) return;
        this.selectedHeroId = heroId;
        this.heroPage       = 1;
        this.renderContent(); // re-render to highlight new hero + show skeleton/mock
        const key = `${this.selectedRegion}:${heroId}`;
        if (!this.heroLbCache.has(key)) {
          await this.fetchHeroLeaderboard(this.selectedRegion, heroId);
          this.renderContent(); // re-render with real data
        }
      });
    });
    this.wireTableLinks(el);
  }

  // ── API Fetching ──────────────────────────────────────────────────────────

  private async fetchHeroes(): Promise<void> {
    try {
      const res = await fetch(`${DEADLOCK_API}/v1/assets/heroes`);
      if (!res.ok) return;
      const raw: HeroAsset[] = await res.json();
      this.heroes = raw
        .filter(h => h.player_selectable !== false && !h.disabled && !h.in_development)
        .sort((a, b) => a.name.localeCompare(b.name));
      this.heroMap = new Map(this.heroes.map(h => [h.id, h]));
      // Default: first hero alphabetically (usually Abrams)
      if (this.selectedHeroId === null && this.heroes.length > 0) {
        this.selectedHeroId = this.heroes[0].id;
      }
    } catch {
      // heroesLoaded still set below — hero tab shows empty state gracefully
    } finally {
      this.heroesLoaded = true;
    }
  }

  private async fetchPlayerLeaderboard(region: Region): Promise<void> {
    // Skip if already cached or a fetch for this region is in-flight
    if (this.playerCache.has(region) || this.loadingRegions.has(region)) return;
    this.loadingRegions.add(region);
    try {
      // GET /v1/leaderboard/{region}
      const res = await fetch(`${DEADLOCK_API}/v1/leaderboard/${region}`);
      if (!res.ok) return;
      const json: { entries: ApiLeaderboardEntry[] } = await res.json();
      const entries = parseApiEntries(json.entries ?? []);
      this.playerCache.set(region, entries);
      await this.enrichAvatars(
        entries.map(e => ({ accountId: e.accountId, setUrl: (u: string) => { e.avatarUrl = u; } })),
      );
    } catch {
      // playerCache stays empty — MOCK_GENERAL used as fallback in renderContent
    } finally {
      this.loadingRegions.delete(region);
    }
  }

  private async fetchHeroLeaderboard(region: Region, heroId: number): Promise<void> {
    const key = `${region}:${heroId}`;
    if (this.heroLbCache.has(key) || this.loadingHeroKeys.has(key)) return;
    this.loadingHeroKeys.add(key);
    try {
      // GET /v1/leaderboard/{region}/{hero_id}
      const res = await fetch(`${DEADLOCK_API}/v1/leaderboard/${region}/${heroId}`);
      if (!res.ok) return;
      const json: { entries: ApiLeaderboardEntry[] } = await res.json();
      const generalEntries = this.playerCache.get(region) ?? [];
      const entries        = parseApiHeroEntries(json.entries ?? [], generalEntries);
      this.heroLbCache.set(key, entries);
      await this.enrichAvatars(
        entries.map(e => ({ accountId: e.accountId, setUrl: (u: string) => { e.avatarUrl = u; } })),
      );
    } catch {
      // heroLbCache stays empty — MOCK_HERO used as fallback in renderContent
    } finally {
      this.loadingHeroKeys.delete(key);
    }
  }

  /**
   * GET /v1/players/steam?account_ids=... — batch-loads Steam avatars.
   * Accepts a generic list so it works for both entry types without duplication.
   */
  private async enrichAvatars(
    targets: Array<{ accountId: number | null; setUrl: (url: string) => void }>,
  ): Promise<void> {
    const toFetch = targets
      .filter(t => t.accountId !== null && !this.steamCache.has(t.accountId!))
      .map(t => t.accountId!)
      .slice(0, 100);

    if (toFetch.length > 0) {
      try {
        // GET /v1/players/steam?account_ids={csv}
        const res = await fetch(`${DEADLOCK_API}/v1/players/steam?account_ids=${toFetch.join(',')}`);
        if (res.ok) {
          const profiles: SteamProfileData[] = await res.json();
          profiles.forEach(p => this.steamCache.set(p.account_id, p));
        }
      } catch { /* no avatars — initials fallback already in DOM */ }
    }

    targets.forEach(t => {
      if (t.accountId !== null) {
        const p = this.steamCache.get(t.accountId);
        if (p) t.setUrl(p.avatarmedium || p.avatar || '');
      }
    });
  }
}
