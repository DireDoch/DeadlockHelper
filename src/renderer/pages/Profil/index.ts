/**
 * Profile Page — Refonte complète
 *
 * DATA FLOW:
 *   window.api.steamGetProfile() → steamId64, avatarUrl, personaname
 *
 *   GET /v1/players/steam-search?search_query={steamId64}&min_matches_played_last_30d=0&limit=1
 *     → account_id, last_team_avg_badge (estimation initiale du rang), matches_played_last_30d
 *
 *   GET /v1/players/{account_id}/match-history
 *     → PlayerMatchHistoryEntry[] — historique complet
 *       match_result === player_team → victoire, sinon défaite
 *       game_mode 1 = Normal (6v6), 4 = Street Brawl (4v4)
 *
 *   GET /v1/assets/heroes, GET /v1/assets/items — caches module-level
 *   GET /v1/analytics/badge-distribution — calcul "Top X%"
 *
 *   GET /v1/matches/{match_id}/metadata — par batch de 50 au chargement :
 *     · Matches 0-49 : average_badge_team{player_team} → moving average du rang (Q1 : B)
 *     · Matches 0-9  : also populate rows (build + teams)
 *     match_info.players[].{account_id, team, hero_id, items[]}
 *
 *   GET /v1/players/steam?account_ids=... — batch Steam profiles pour noms d'équipe
 *     Résultat mis en cache via electron-store (TTL 7 jours) — player-names:get/set-many
 */

import { RANKS } from '../../../lib/constants/ranks';
import { renderItemTierBadge } from '../../../lib/utils';
import { MatchDetailController } from './matchDetail';
import type { DetailContext, RichMatchMeta, HeroAsset as DetailHeroAsset, DetailItem } from './matchDetail/types';
import { computeAwardsForMatch } from './awards/criteria';
import { renderAwardsTab, attachAwardsTabEvents } from './awards/tab';
import type { AwardId, AwardEntry } from '../../../lib/awards';

import rankInitiateUrl   from '../../../assets/icons/RankBadge/Initiator.png?url';
import rankSeekerUrl     from '../../../assets/icons/RankBadge/Seekers.png?url';
import rankAlchemistUrl  from '../../../assets/icons/RankBadge/Alchemist.png?url';
import rankArcanistUrl   from '../../../assets/icons/RankBadge/Arcanist.png?url';
import rankRitualistUrl  from '../../../assets/icons/RankBadge/Ritualist.png?url';
import rankEmissaryUrl   from '../../../assets/icons/RankBadge/Emissary.png?url';
import rankArchonUrl     from '../../../assets/icons/RankBadge/Archon.png?url';
import rankOracleUrl     from '../../../assets/icons/RankBadge/Oracle.png?url';
import rankPhantomUrl    from '../../../assets/icons/RankBadge/Phantom.png?url';
import rankAscendantUrl  from '../../../assets/icons/RankBadge/Ascendent.png?url';
import rankEternusUrl    from '../../../assets/icons/RankBadge/Eternus.png?url';

const API = 'https://api.deadlock-api.com';

const RANK_BADGE_URLS: Record<number, string> = {
  1: rankInitiateUrl, 2: rankSeekerUrl,  3: rankAlchemistUrl, 4: rankArcanistUrl,
  5: rankRitualistUrl, 6: rankEmissaryUrl, 7: rankArchonUrl, 8: rankOracleUrl,
  9: rankPhantomUrl, 10: rankAscendantUrl, 11: rankEternusUrl,
};

const SUBTIER_ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI'];
const GAME_MODE_LABEL: Record<number, string> = { 1: 'Normal', 4: 'Street Brawl' };
const GAME_MODE_SIZE: Record<number, number>  = { 1: 6, 4: 4 }; // players per team


// ── Types ─────────────────────────────────────────────────────────────────────

interface DeadlockSteamProfile {
  account_id: number;
  personaname: string;
  avatarmedium: string;
  last_team_avg_badge: number | null;
  matches_played_last_30d: number;
}

interface MatchEntry {
  account_id: number;
  match_id: number;
  hero_id: number;
  start_time: number;
  game_mode: number;
  player_team: number;
  player_kills: number;
  player_deaths: number;
  player_assists: number;
  match_duration_s: number;
  match_result: number;
}

interface MetaItem { item_id: number; sold_time_s: number | null; }

interface MetaPlayer {
  account_id: number;
  team: number;
  hero_id: number;
  kills: number;
  deaths: number;
  assists: number;
  items: MetaItem[];
}

interface MatchMeta {
  winning_team: number;
  average_badge_team0: number;
  average_badge_team1: number;
  players: MetaPlayer[];
}

interface HeroAsset {
  id: number;
  name: string;
  images: {
    icon_hero_card_webp?: string;
    minimap_image_webp?: string;
    background_image_webp?: string;
  };
}

interface ItemData {
  id: number;
  name: string;
  shop_image_webp?: string;
  item_tier?: number;
}

// ── Tab definitions ────────────────────────────────────────────────────────────

type Tab = 'overview' | 'heroes' | 'matches' | 'awards';
const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'heroes',   label: 'Heroes'   },
  { id: 'matches',  label: 'Matches'  },
  { id: 'awards',   label: 'Awards'   },
];

// ── Module-level caches ────────────────────────────────────────────────────────

let _heroCache: Map<number, HeroAsset> | null = null;
let _heroFetch: Promise<Map<number, HeroAsset>> | null = null;
let _itemsCache: Map<number, ItemData> | null = null;
let _itemsFetch: Promise<Map<number, ItemData>> | null = null;
let _badgeDist: Array<{ badge_level: number; total_matches: number }> | null = null;
let _badgeDistFetch: Promise<typeof _badgeDist> | null = null;

function fetchHeroCache(): Promise<Map<number, HeroAsset>> {
  if (_heroCache) return Promise.resolve(_heroCache);
  if (_heroFetch) return _heroFetch;
  _heroFetch = fetch(`${API}/v1/assets/heroes`)
    .then(r => r.ok ? r.json() : [])
    .then((arr: HeroAsset[]) => { _heroCache = new Map(arr.map(h => [h.id, h])); return _heroCache!; })
    .catch(() => { _heroFetch = null; return new Map<number, HeroAsset>(); });
  return _heroFetch;
}

function fetchItemsCache(): Promise<Map<number, ItemData>> {
  if (_itemsCache) return Promise.resolve(_itemsCache);
  if (_itemsFetch) return _itemsFetch;
  // GET /v1/assets/items — shop_image_webp + item_tier for build display
  _itemsFetch = fetch(`${API}/v1/assets/items`)
    .then(r => r.ok ? r.json() : [])
    .then((arr: ItemData[]) => { _itemsCache = new Map(arr.map(i => [i.id, i])); return _itemsCache!; })
    .catch(() => { _itemsFetch = null; return new Map<number, ItemData>(); });
  return _itemsFetch;
}

function fetchBadgeDist(): Promise<typeof _badgeDist> {
  if (_badgeDist) return Promise.resolve(_badgeDist);
  if (_badgeDistFetch) return _badgeDistFetch;
  _badgeDistFetch = fetch(`${API}/v1/analytics/badge-distribution`)
    .then(r => r.ok ? r.json() : [])
    .then(d => { _badgeDist = d; return _badgeDist; })
    .catch(() => { _badgeDistFetch = null; return null; });
  return _badgeDistFetch;
}

// ── Utilities ─────────────────────────────────────────────────────────────────

function badgeToRank(badge: number) {
  const tier    = Math.floor(badge / 10);
  const subtier = badge % 10;
  return { name: RANKS.find(r => r.tier === tier)?.name ?? 'Unknown', subtier, tier };
}

function calcTopPercent(badge: number, dist: Array<{ badge_level: number; total_matches: number }>): number {
  const total = dist.reduce((s, d) => s + d.total_matches, 0);
  if (!total) return 0;
  return (dist.filter(d => d.badge_level > badge).reduce((s, d) => s + d.total_matches, 0) / total) * 100;
}

function timeAgo(ts: number): string {
  const d = Math.floor(Date.now() / 1000) - ts;
  if (d < 120)         return `${d}s`;
  if (d < 3600)        return `${Math.floor(d / 60)}min.`;
  if (d < 86400)       return `${Math.floor(d / 3600)}h`;
  if (d < 86400 * 7)   return `${Math.floor(d / 86400)}d`;
  if (d < 86400 * 30)  return `${Math.floor(d / (86400 * 7))} weeks`;
  if (d < 86400 * 365) return `${Math.floor(d / (86400 * 30))} months`;
  return `${Math.floor(d / (86400 * 365))}y`;
}

function formatDuration(s: number): string {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function activityLabel(n: number): { label: string; color: string } {
  if (n === 0) return { label: 'Inactif',    color: 'text-grey-500' };
  if (n < 6)   return { label: 'Peu actif',  color: 'text-amber-400' };
  if (n < 21)  return { label: 'Actif',      color: 'text-emerald-400' };
  return              { label: 'Très actif', color: 'text-emerald-300' };
}

/** End-game shop items: not sold, in items cache, first 12 by purchase order (Q3: A). */
function endGameItems(metaItems: MetaItem[], itemMap: Map<number, ItemData>): ItemData[] {
  const seen = new Set<number>();
  const result: ItemData[] = [];
  for (const mi of metaItems) {
    if (result.length >= 12) break;
    if (mi.sold_time_s !== 0 && mi.sold_time_s !== null) continue;
    if (seen.has(mi.item_id)) continue;
    const item = itemMap.get(mi.item_id);
    if (!item?.shop_image_webp || !item.item_tier) continue;
    seen.add(mi.item_id);
    result.push(item);
  }
  return result;
}

/** Top N heroes by total matches. KDA calculated over last 50 matches with that hero (Q5: B). */
function computeTopHeroes(
  matches: MatchEntry[],
  heroMap: Map<number, HeroAsset>,
  topN = 3,
) {
  const stats = new Map<number, { total: number; wins: number }>();
  for (const m of matches) {
    const s = stats.get(m.hero_id) ?? { total: 0, wins: 0 };
    s.total++;
    if (m.match_result === m.player_team) s.wins++;
    stats.set(m.hero_id, s);
  }

  return [...stats.entries()]
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, topN)
    .map(([heroId, s]) => {
      // KDA on last 50 matches with this hero specifically
      const heroMatches = matches.filter(m => m.hero_id === heroId).slice(0, 50);
      const kills   = heroMatches.reduce((a, m) => a + m.player_kills,   0);
      const deaths  = heroMatches.reduce((a, m) => a + m.player_deaths,  0);
      const assists = heroMatches.reduce((a, m) => a + m.player_assists, 0);
      const kda = deaths > 0 ? (kills + assists) / deaths : kills + assists;
      const recent5 = matches.filter(m => m.hero_id === heroId).slice(0, 5)
        .map(m => m.match_result === m.player_team);
      return {
        heroId,
        hero: heroMap.get(heroId),
        total: s.total,
        wins: s.wins,
        kda,
        kills, deaths, assists,
        kdaCount: heroMatches.length,
        recent5,
        pickRate: (s.total / matches.length) * 100,
      };
    });
}

// ── ProfilPage ─────────────────────────────────────────────────────────────────

/**
 * Profile page with three tabs: Overview, Match History, and Awards.
 *
 * On mount, resolves the linked Steam account then fetches the last 50 matches in
 * batches of 50 via the bulk metadata endpoint. Metadata from matches 0-9 populates
 * the match history rows; metadata from 0-49 feeds the rolling rank average estimate.
 *
 * The Awards tab evaluates each match against 53 criteria defined in `src/lib/awards.ts`
 * and persists earned awards to the Main Process via `awards:save-batch` IPC.
 * A native OS notification fires for any award earned for the first time.
 *
 * All API fetches are documented in the file-level DATA FLOW comment above.
 */
export class ProfilPage {
  private container: HTMLElement | null = null;
  private currentTab: Tab = 'overview';

  private loading  = true;
  private steamProfile: { steamId64: string; avatarUrl?: string; personaname?: string } | null = null;
  private deadlockProfile: DeadlockSteamProfile | null = null;
  private badgeDist: Array<{ badge_level: number; total_matches: number }> | null = null;

  private allMatches: MatchEntry[]  = [];
  private visibleCount              = 10;
  private heroMap: Map<number, HeroAsset> = new Map();
  private itemMap: Map<number, ItemData>  = new Map();

  private matchMetaMap: Map<number, MatchMeta> = new Map();
  private metaLoadingSet: Set<number>          = new Set();
  private expandedMatches: Set<number>         = new Set();

  // Expandable per-match analysis panel (Overview/Lane Stats/Items/Economy/Damage)
  private matchDetail = new MatchDetailController();

  // player name cache (in-memory for this session, backed by electron-store)
  private playerNameMap: Map<number, string>   = new Map();

  // moving average rank (computed after 50 metadata loads)
  private movingAvgBadge: number | null = null;

  // when non-null, page shows an external player instead of the logged-in user
  private externalAccountId: number | null = null;

  // Awards earned by the local player, loaded from electron-store + updated after Phase 3
  private awardsEarned: Map<AwardId, AwardEntry> = new Map();

  // ── Lifecycle ────────────────────────────────────────────────────────────────

  mount(container: HTMLElement): void {
    this.externalAccountId = null;
    this._resetState(container);
    this.loadData();
  }

  /** Navigate to another player's profile by their account_id (SteamID3). */
  mountForPlayer(container: HTMLElement, accountId: number): void {
    this.externalAccountId = accountId;
    this._resetState(container);
    this.loadDataForPlayer(accountId);
  }

  /** Mount the local player's profile and immediately switch to the Awards tab.
   *  Called when the user clicks an awards notification. */
  mountOnAwardsTab(container: HTMLElement): void {
    this.currentTab = 'awards';
    this.mount(container);
  }

  private _resetState(container: HTMLElement): void {
    this.container       = container;
    this.loading         = true;
    this.visibleCount    = 10;
    this.allMatches      = [];
    this.matchMetaMap    = new Map();
    this.expandedMatches = new Set();
    this.matchDetail.reset(); // clear per-match panel UI state (owner-relative defaults)
    this.movingAvgBadge  = null;
    this.deadlockProfile = null;
    this.awardsEarned    = new Map();
    // Awards tab is only available on the local player's profile — reset to overview
    // when navigating to an external player to avoid showing an empty tab.
    if (this.externalAccountId !== null && this.currentTab === 'awards') {
      this.currentTab = 'overview';
    }
    this.render();
  }

  // ── Data loading ──────────────────────────────────────────────────────────────

  private async loadData(): Promise<void> {
    try {
      this.steamProfile = await window.api?.steamGetProfile?.() ?? null;
      if (!this.steamProfile?.steamId64) {
        this.loading = false;
        this.render();
        return;
      }

      // Phase 1: profile + assets in parallel (awards loaded from store in background)
      const [profileArr, heroMap, itemMap, badgeDist] = await Promise.all([
        // GET /v1/players/steam-search — resolves account_id + initial badge estimate
        fetch(`${API}/v1/players/steam-search?search_query=${encodeURIComponent(this.steamProfile.steamId64)}&min_matches_played_last_30d=0&limit=1`)
          .then(r => r.ok ? r.json() : []).catch(() => []),
        fetchHeroCache(),
        fetchItemsCache(),
        fetchBadgeDist(),
      ]);

      // Load persisted awards from electron-store so the tab renders immediately
      window.api?.getAllAwards?.().then(all => {
        this.awardsEarned = new Map(
          Object.entries(all ?? {}).map(([k, v]) => [k as AwardId, v as AwardEntry]),
        );
      }).catch(() => {});

      this.deadlockProfile = (profileArr as DeadlockSteamProfile[])[0] ?? null;
      this.heroMap  = heroMap;
      this.itemMap  = itemMap;
      this.badgeDist = badgeDist;

      // Phase 2: match history
      if (this.deadlockProfile?.account_id) {
        // GET /v1/players/{account_id}/match-history — full history
        this.allMatches = await fetch(`${API}/v1/players/${this.deadlockProfile.account_id}/match-history`)
          .then(r => r.ok ? r.json() : []).catch(() => []) as MatchEntry[];
      }

      this.loading = false;
      this.render();

      // Phase 3: metadata for first 50 matches (rank moving average + first 10 row display)
      this.fetchBatchMetadata(0, Math.min(50, this.allMatches.length));

    } catch (err) {
      console.error('[ProfilPage] loadData error:', err);
      this.loading = false;
      this.render();
    }
  }

  /**
   * Load profile data for an external player by account_id.
   * GET /v1/players/steam?account_ids={id} — resolves name + avatar
   * GET /v1/players/{id}/match-history — match history
   */
  private async loadDataForPlayer(accountId: number): Promise<void> {
    try {
      const [profileArr, heroMap, itemMap, badgeDist] = await Promise.all([
        // GET /v1/players/steam — batch profile (single id) for name + avatar
        fetch(`${API}/v1/players/steam?account_ids=${accountId}`)
          .then(r => r.ok ? r.json() : []).catch(() => []),
        fetchHeroCache(),
        fetchItemsCache(),
        fetchBadgeDist(),
      ]);

      const raw = (profileArr as Array<{ account_id: number; personaname: string; avatarmedium: string; last_team_avg_badge?: number | null; matches_played_last_30d?: number }>)[0];
      if (raw) {
        this.deadlockProfile = {
          account_id:             raw.account_id,
          personaname:            raw.personaname,
          avatarmedium:           raw.avatarmedium,
          last_team_avg_badge:    raw.last_team_avg_badge ?? null,
          matches_played_last_30d: raw.matches_played_last_30d ?? 0,
        };
      }
      this.heroMap   = heroMap;
      this.itemMap   = itemMap;
      this.badgeDist = badgeDist;

      // GET /v1/players/{account_id}/match-history
      this.allMatches = await fetch(`${API}/v1/players/${accountId}/match-history`)
        .then(r => r.ok ? r.json() : []).catch(() => []) as MatchEntry[];

      this.loading = false;
      this.render();
      this.fetchBatchMetadata(0, Math.min(50, this.allMatches.length));
    } catch (err) {
      console.error('[ProfilPage] loadDataForPlayer error:', err);
      this.loading = false;
      this.render();
    }
  }

  /**
   * Fetch metadata for a slice of allMatches in parallel.
   * First 10 → populate match rows. All 50 → compute moving average rank.
   * GET /v1/matches/{match_id}/metadata
   */
  private async fetchBatchMetadata(start: number, end: number): Promise<void> {
    const slice   = this.allMatches.slice(start, end);
    const toFetch = slice.filter(m => !this.matchMetaMap.has(m.match_id) && !this.metaLoadingSet.has(m.match_id));
    if (!toFetch.length) return;

    toFetch.forEach(m => this.metaLoadingSet.add(m.match_id));

    await Promise.all(toFetch.map(async m => {
      try {
        const data = await fetch(`${API}/v1/matches/${m.match_id}/metadata`).then(r => r.ok ? r.json() : null);
        if (data?.match_info) {
          // Retain the full match_info (rich stats[]/items[]/assigned_lane drive the detail panel),
          // but drop the heavy player-vs-player damage_matrix blob — the detail tabs read totals
          // from stats[] instead, so it is dead weight across 50 cached matches.
          delete data.match_info.damage_matrix;
          this.matchMetaMap.set(m.match_id, data.match_info as MatchMeta);
        }
      } catch { /* ignore — row shows partial data */ }
      finally { this.metaLoadingSet.delete(m.match_id); }
    }));

    // Update moving average rank once we have the first batch
    this.updateMovingAverageRank();

    // Resolve Steam names for all players in visible matches
    this.resolvePlayerNames();

    // Re-render match rows with fresh metadata
    this.refreshMatchRows();

    // Compute awards from loaded metadata (own profile only)
    this.computeAndSaveAwards();
  }

  /**
   * Evaluate all computable awards against the loaded matchMetaMap and persist
   * new occurrences via IPC. Only runs for the local player's own profile.
   * Fires after fetchBatchMetadata resolves — matchMetaMap is fully populated.
   */
  private async computeAndSaveAwards(): Promise<void> {
    if (this.externalAccountId !== null) return;
    if (!this.deadlockProfile?.account_id) return;

    const accountId = this.deadlockProfile.account_id;
    const pending   = new Map<AwardId, AwardEntry>();

    for (const [matchId, rawMeta] of this.matchMetaMap) {
      const meta      = rawMeta as unknown as RichMatchMeta;
      const matchBase = this.allMatches.find(m => m.match_id === matchId);
      // firstEarnedAt = match start_time (seconds → ms); falls back to now if entry absent
      const earnedAt  = matchBase ? matchBase.start_time * 1000 : Date.now();

      for (const awardId of computeAwardsForMatch(accountId, meta)) {
        const existing = pending.get(awardId);
        if (existing) {
          existing.matchIds.push(matchId);
          existing.count++;
        } else {
          pending.set(awardId, { awardId, matchIds: [matchId], firstEarnedAt: earnedAt, count: 1 });
        }
      }
    }

    if (!pending.size) return;

    try {
      await window.api?.saveAwardsBatch?.([...pending.values()]);
      // Refresh earnedMap from the authoritative store after the save
      const all = await window.api?.getAllAwards?.();
      if (all) {
        this.awardsEarned = new Map(
          Object.entries(all).map(([k, v]) => [k as AwardId, v as AwardEntry]),
        );
        if (this.currentTab === 'awards') this.refreshTabContent();
      }
    } catch (err) {
      console.error('[ProfilPage] computeAndSaveAwards error:', err);
    }
  }

  /**
   * Moving average of average_badge_team{player_team} across up to 50 matches (Q1: B).
   * Updates banner rank badge after initial estimate from steam-search.
   */
  private updateMovingAverageRank(): void {
    const badgeValues: number[] = [];
    for (let i = 0; i < Math.min(50, this.allMatches.length); i++) {
      const m    = this.allMatches[i];
      const meta = this.matchMetaMap.get(m.match_id);
      if (!meta) continue;
      const b = m.player_team === 0 ? meta.average_badge_team0 : meta.average_badge_team1;
      if (b > 0) badgeValues.push(b);
    }
    if (!badgeValues.length) return;
    this.movingAvgBadge = Math.round(badgeValues.reduce((s, v) => s + v, 0) / badgeValues.length);

    // Update only the banner — no full re-render needed
    this.refreshBanner();
  }

  /**
   * Collect all account_ids from visible match metadata, check electron-store cache,
   * fetch uncached ones via GET /v1/players/steam?account_ids=... (batch, 1 call).
   */
  private async resolvePlayerNames(): Promise<void> {
    const visible  = this.allMatches.slice(0, this.visibleCount);
    const allIds   = new Set<number>();

    for (const m of visible) {
      const meta = this.matchMetaMap.get(m.match_id);
      if (meta) meta.players.forEach(p => allIds.add(p.account_id));
    }

    const idList = [...allIds];
    if (!idList.length) return;

    // Check electron-store cache first
    let cached: Record<number, string | null> = {};
    try {
      cached = await window.api?.getPlayerNames?.(idList) ?? {};
    } catch { /* ignore */ }

    // Populate in-memory map from cache
    for (const [id, name] of Object.entries(cached)) {
      if (name) this.playerNameMap.set(Number(id), name);
    }

    // Fetch only uncached ids
    const uncachedIds = idList.filter(id => !cached[id]);
    if (uncachedIds.length) {
      try {
        // GET /v1/players/steam?account_ids=... — batch Steam profiles (up to 1000 per call)
        const profiles = await fetch(`${API}/v1/players/steam?account_ids=${uncachedIds.join(',')}`)
          .then(r => r.ok ? r.json() : []).catch(() => []) as Array<{ account_id: number; personaname: string; avatarmedium?: string }>;

        const toStore: Array<{ accountId: number; personaname: string; avatarmedium?: string }> = [];
        for (const p of profiles) {
          this.playerNameMap.set(p.account_id, p.personaname);
          toStore.push({ accountId: p.account_id, personaname: p.personaname, avatarmedium: p.avatarmedium });
        }

        // Persist to electron-store
        if (toStore.length) {
          window.api?.cachePlayerNames?.(toStore).catch(() => { /* ignore */ });
        }
      } catch { /* ignore — names will fall back to account_id display */ }
    }

    this.refreshMatchRows();
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  private render(): void {
    if (!this.container) return;

    if (this.loading) {
      this.container.innerHTML = this.renderSkeleton();
      return;
    }

    if (!this.externalAccountId && !this.steamProfile?.steamId64) {
      this.container.innerHTML = this.renderNotLoggedIn();
      this.container.querySelector('#go-settings-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        document.dispatchEvent(new CustomEvent('navigate-page', { detail: { page: 'settings' } }));
      });
      return;
    }

    this.container.innerHTML = `
      <div class="min-h-screen bg-charcoal-100 relative" id="profil-page-root">
        <!-- Dynamic background: splash art of most played hero (Q4: fade-in) -->
        <div id="profil-bg-layer"
             class="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-top opacity-0 transition-opacity duration-700"
             style="mask-image: linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.06) 50%, transparent 100%);
                    -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.06) 50%, transparent 100%);">
        </div>
        <div class="relative z-10">
          <div id="profil-banner">${this.renderHeroBanner()}</div>
          ${this.renderTabBar()}
          <div id="profil-tab-content" class="pb-12">${this.renderTabContent()}</div>
        </div>
      </div>`;

    this.attachEvents();
    this.applyBackgroundImage();
  }

  /** Apply hero background after render — fade in via opacity transition (Q4: A). */
  private applyBackgroundImage(): void {
    if (!this.container || !this.allMatches.length) return;
    const topHeroId  = [...new Map(this.allMatches.map(m => [m.hero_id, m]))
      .entries()].reduce<[number, number]>(
        (best, [id]) => {
          const count = this.allMatches.filter(m => m.hero_id === id).length;
          return count > best[1] ? [id, count] : best;
        }, [0, 0])[0];

    const hero = this.heroMap.get(topHeroId);
    const imgUrl = hero?.images?.background_image_webp;
    if (!imgUrl) return;

    const bgLayer = this.container.querySelector('#profil-bg-layer') as HTMLElement;
    if (!bgLayer) return;
    bgLayer.style.backgroundImage = `url('${imgUrl}')`;
    requestAnimationFrame(() => { bgLayer.style.opacity = '1'; });
  }

  // ── Banner ────────────────────────────────────────────────────────────────────

  private renderHeroBanner(): string {
    const p  = this.deadlockProfile;
    const sp = this.steamProfile;
    const avatar = p?.avatarmedium || sp?.avatarUrl || '';
    const name   = p?.personaname  || sp?.personaname || 'Unknown';

    // Moving average rank takes priority over steam-search estimate
    const badgeValue = this.movingAvgBadge ?? p?.last_team_avg_badge ?? null;
    let rankHtml = '';
    if (badgeValue) {
      const { name: rankName, subtier, tier } = badgeToRank(badgeValue);
      const iconUrl = RANK_BADGE_URLS[tier] ?? '';
      const sub = subtier > 0 ? ` ${SUBTIER_ROMAN[subtier]}` : '';
      let topPct = '';
      if (this.badgeDist?.length) {
        topPct = ` · Top ${calcTopPercent(badgeValue, this.badgeDist).toFixed(2)}%`;
      }
      rankHtml = `
        ${iconUrl ? `<img src="${iconUrl}" alt="${rankName}" class="w-7 h-7 object-contain">` : ''}
        <span class="text-grey-200 text-sm font-semibold">${rankName}${sub}</span>
        <span class="text-grey-500 text-xs">${topPct}</span>`;
    }

    return `
      <div class="bg-slate-900/75 backdrop-blur border-b border-grey-700/60 px-8 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          ${avatar
            ? `<img src="${avatar}" alt="${name}" class="w-14 h-14 rounded-lg object-cover border border-grey-600 flex-shrink-0">`
            : `<div class="w-14 h-14 rounded-lg bg-grey-700 flex items-center justify-center text-grey-400 text-xl font-bold flex-shrink-0">${(name[0] ?? '?').toUpperCase()}</div>`}
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h1 class="text-white text-xl font-bold leading-none">${name}</h1>
              ${rankHtml}
            </div>
            ${p?.account_id ? `<p class="text-grey-600 text-xs mt-1">ID: ${p.account_id}</p>` : ''}
          </div>
        </div>
      </div>`;
  }

  private refreshBanner(): void {
    const el = this.container?.querySelector('#profil-banner');
    if (el) el.innerHTML = this.renderHeroBanner();
  }

  // ── Tab bar ───────────────────────────────────────────────────────────────────

  private renderTabBar(): string {
    // Awards tab only available on the local player's own profile
    const visibleTabs = this.externalAccountId !== null
      ? TABS.filter(t => t.id !== 'awards')
      : TABS;

    return `
      <div class="sticky top-0 z-20 bg-charcoal-100/95 backdrop-blur border-b border-grey-700 px-8">
        <div class="flex gap-1 -mb-px">
          ${visibleTabs.map(t => `
            <button data-tab="${t.id}"
              class="profil-tab-btn px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap
                ${this.currentTab === t.id
                  ? 'text-dry-sage-400 border-dry-sage-400'
                  : 'text-grey-400 border-transparent hover:text-grey-200 hover:border-grey-500'}">
              ${t.label}
            </button>`).join('')}
        </div>
      </div>`;
  }

  // ── Tab content ───────────────────────────────────────────────────────────────

  private renderTabContent(): string {
    switch (this.currentTab) {
      case 'overview': return this.renderOverviewTab();
      case 'awards':   return renderAwardsTab(this.awardsEarned);
      case 'heroes':
      case 'matches':
        return `
          <div class="flex flex-col items-center justify-center py-32 gap-3">
            <div class="w-12 h-12 rounded-full bg-grey-700 flex items-center justify-center text-grey-500 text-xl">✦</div>
            <p class="text-grey-400 text-sm">Onglet <span class="text-white font-medium">${TABS.find(t => t.id === this.currentTab)?.label}</span> — en développement</p>
          </div>`;
    }
  }

  private refreshTabContent(): void {
    const el = this.container?.querySelector('#profil-tab-content');
    if (!el) return;
    el.innerHTML = this.renderTabContent();
    this.attachMatchRowEvents();
    this.attachAwardsEvents();
  }

  /** Wire award card clicks + drawer events. No-op outside the Awards tab. */
  private attachAwardsEvents(): void {
    if (!this.container || this.currentTab !== 'awards') return;
    attachAwardsTabEvents(
      this.container,
      this.awardsEarned,
      (matchId: number) => {
        // Switch to Overview and expand the match row
        const idx = this.allMatches.findIndex(m => m.match_id === matchId);
        if (idx === -1) return;
        if (idx >= this.visibleCount) this.visibleCount = idx + 1;
        this.expandedMatches.add(matchId);
        this.currentTab = 'overview';
        this.render();
        // Scroll to the expanded row after render
        requestAnimationFrame(() => {
          this.container?.querySelector(`[data-match-id="${matchId}"]`)
            ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
      },
    );
  }

  // ── Overview tab ──────────────────────────────────────────────────────────────

  private renderOverviewTab(): string {
    return `
      <div class="px-6 py-5 max-w-7xl mx-auto space-y-5">
        ${this.renderStatsAndHeroesRow()}
        ${this.renderMatchHistory()}
      </div>`;
  }

  // ── B+C. Side-by-side: Stats cards | Most played heroes (Q2: nouvelle rangée) ──

  private renderStatsAndHeroesRow(): string {
    const matches  = this.allMatches;
    const total    = matches.length;
    const wins     = matches.filter(m => m.match_result === m.player_team).length;
    const losses   = total - wins;
    const wr       = total ? (wins / total) * 100 : 0;
    const avgK     = total ? matches.reduce((s, m) => s + m.player_kills,   0) / total : 0;
    const avgD     = total ? matches.reduce((s, m) => s + m.player_deaths,  0) / total : 0;
    const avgA     = total ? matches.reduce((s, m) => s + m.player_assists, 0) / total : 0;
    const act30    = this.deadlockProfile?.matches_played_last_30d ?? 0;
    const act      = activityLabel(act30);

    const card = (title: string, main: string, sub: string) => `
      <div class="bg-charcoal-200 border border-grey-700 rounded-xl p-4 hover:border-grey-500 transition-colors">
        <p class="text-grey-500 text-[10px] font-semibold uppercase tracking-widest mb-1.5">${title}</p>
        <p class="text-white text-xl font-bold tabular-nums leading-none mb-1">${main}</p>
        <p class="text-grey-400 text-xs">${sub}</p>
      </div>`;

    const topHeroes  = computeTopHeroes(matches, this.heroMap, 3);
    const heroRows   = topHeroes.map(h => {
      const imgUrl  = h.hero?.images?.icon_hero_card_webp ?? '';
      const name    = h.hero?.name ?? `Hero #${h.heroId}`;
      const wrH     = h.total ? (h.wins / h.total) * 100 : 0;
      const wCount  = h.recent5.filter(Boolean).length;
      const lCount  = h.recent5.length - wCount;
      return `
        <tr class="border-b border-grey-700/40 last:border-0 hover:bg-charcoal-100/30 transition-colors">
          <td class="py-2.5 px-4">
            <div class="flex items-center gap-2">
              ${imgUrl
                ? `<img src="${imgUrl}" alt="${name}" class="w-8 h-8 rounded-full object-cover border border-grey-600 flex-shrink-0">`
                : `<div class="w-8 h-8 rounded-full bg-grey-700 flex-shrink-0"></div>`}
              <span class="text-white text-sm font-medium">${name}</span>
            </div>
          </td>
          <td class="py-2.5 px-2 text-right">
            <p class="text-white text-sm tabular-nums font-medium">${h.total}G</p>
            <p class="text-grey-500 text-xs">${h.pickRate.toFixed(1)}%</p>
          </td>
          <td class="py-2.5 px-3 min-w-[120px]">
            <p class="text-white text-sm tabular-nums font-medium">${wrH.toFixed(2)}%</p>
            <div class="w-full h-1 bg-grey-700 rounded-full mt-1 mb-1">
              <div class="h-full bg-emerald-500 rounded-full" style="width:${Math.min(wrH, 100).toFixed(1)}%"></div>
            </div>
            <p class="text-grey-500 text-[10px]">(${wCount}Win ${lCount}Lose)</p>
          </td>
          <td class="py-2.5 px-4 text-right">
            <p class="text-white text-sm tabular-nums font-medium">${h.kda.toFixed(2)}</p>
            <p class="text-grey-500 text-[10px]">
              <span class="text-emerald-400">${(h.kills/h.kdaCount).toFixed(1)}</span>/
              <span class="text-red-400">${(h.deaths/h.kdaCount).toFixed(1)}</span>/
              <span class="text-amber-400">${(h.assists/h.kdaCount).toFixed(1)}</span>
            </p>
          </td>
        </tr>`;
    }).join('');

    return `
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Left: 2×2 stat cards -->
        <div class="grid grid-cols-2 gap-3">
          ${card('Win Rate Global', `${wr.toFixed(2)}%`, `${wins} Wins / ${losses} Losses`)}
          <div class="bg-charcoal-200 border border-grey-700 rounded-xl p-4 hover:border-grey-500 transition-colors">
            <p class="text-grey-500 text-[10px] font-semibold uppercase tracking-widest mb-1.5">KDA Moyen</p>
            <p class="text-lg font-bold tabular-nums leading-none mb-1">
              <span class="text-emerald-400">${avgK.toFixed(1)}</span>
              <span class="text-grey-600">/</span>
              <span class="text-red-400">${avgD.toFixed(1)}</span>
              <span class="text-grey-600">/</span>
              <span class="text-amber-400">${avgA.toFixed(1)}</span>
            </p>
            <p class="text-grey-400 text-xs">K / D / A</p>
          </div>
          ${card('Total Matches', `${total} Games`, 'Parties analysées')}
          <div class="bg-charcoal-200 border border-grey-700 rounded-xl p-4 hover:border-grey-500 transition-colors">
            <p class="text-grey-500 text-[10px] font-semibold uppercase tracking-widest mb-1.5">Activité 30j</p>
            <p class="text-white text-xl font-bold tabular-nums leading-none mb-1">${act30}<span class="text-sm font-normal text-grey-400 ml-1">parties</span></p>
            <p class="text-xs ${act.color} font-semibold">${act.label}</p>
          </div>
        </div>

        <!-- Right: Most played heroes -->
        <div class="bg-charcoal-200 border border-grey-700 rounded-xl overflow-hidden">
          <div class="px-4 py-3 border-b border-grey-700">
            <h2 class="text-white font-semibold text-xs uppercase tracking-wider">Most Played Heroes</h2>
          </div>
          <table class="w-full">
            <thead>
              <tr class="text-grey-500 text-[10px] uppercase tracking-wider border-b border-grey-700/60">
                <th class="px-4 py-1.5 text-left">Hero</th>
                <th class="px-2 py-1.5 text-right">Matches</th>
                <th class="px-3 py-1.5 text-left">Win Rate</th>
                <th class="px-4 py-1.5 text-right">KDA</th>
              </tr>
            </thead>
            <tbody>${heroRows}</tbody>
          </table>
        </div>
      </div>`;
  }

  // ── D. Match history (×2 scale) ────────────────────────────────────────────────

  private renderMatchHistory(): string {
    const visible = this.allMatches.slice(0, this.visibleCount);
    const hasMore = this.allMatches.length > this.visibleCount;
    return `
      <div class="bg-charcoal-200 border border-grey-700 rounded-xl overflow-hidden" id="match-history-section">
        <div class="px-5 py-3.5 border-b border-grey-700 flex items-center justify-between">
          <h2 class="text-white font-semibold text-xs uppercase tracking-wider">Historique des Matchs</h2>
          <span class="text-grey-500 text-xs">${this.allMatches.length} parties</span>
        </div>
        <div id="match-rows-list">${visible.map(m => this.renderMatchRow(m)).join('')}</div>
        ${hasMore ? `
          <div class="px-5 py-4 border-t border-grey-700 text-center">
            <button id="load-more-matches"
              class="px-6 py-2 bg-charcoal-100 hover:bg-grey-700 border border-grey-600 hover:border-grey-500
                     text-grey-300 hover:text-white text-sm font-medium rounded-lg transition-all">
              Charger ${Math.min(10, this.allMatches.length - this.visibleCount)} parties de plus
            </button>
          </div>` : ''}
      </div>`;
  }

  /** Assemble the (state-less) context the Match Detail Panel needs for a given match. */
  private buildDetailBase(matchId: number): Omit<DetailContext, 'state'> | null {
    const meta  = this.matchMetaMap.get(matchId);
    const entry = this.allMatches.find(m => m.match_id === matchId);
    if (!meta || !entry) return null;
    return {
      matchId,
      // matchMetaMap stores the full match_info at runtime — widen the narrow view.
      meta: meta as unknown as RichMatchMeta,
      ownerAccountId: entry.account_id,
      gameMode: entry.game_mode,
      heroMap: this.heroMap as unknown as Map<number, DetailHeroAsset>,
      itemMap: this.itemMap as unknown as Map<number, DetailItem>,
      playerNameMap: this.playerNameMap,
    };
  }

  private renderMatchRow(m: MatchEntry): string {
    const won       = m.match_result === m.player_team;
    const hero      = this.heroMap.get(m.hero_id);
    const heroImg   = hero?.images?.icon_hero_card_webp ?? '';
    const heroName  = hero?.name ?? `Hero #${m.hero_id}`;
    const modeLabel = GAME_MODE_LABEL[m.game_mode] ?? `Mode ${m.game_mode}`;
    const teamSize  = GAME_MODE_SIZE[m.game_mode] ?? 6;
    const meta      = this.matchMetaMap.get(m.match_id);
    const metaLoad  = this.metaLoadingSet.has(m.match_id);
    const expanded  = this.expandedMatches.has(m.match_id);

    const borderCls = won ? 'border-l-emerald-500' : 'border-l-red-500';
    const expandBg  = won
      ? 'bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400'
      : 'bg-red-600/20 hover:bg-red-600/40 text-red-400';

    // KP (requires meta for team kill total)
    let kpHtml = `<span class="text-grey-600 text-xs">— KP</span>`;
    if (meta) {
      const myTeam    = meta.players.filter(p => p.team === m.player_team);
      const teamKills = myTeam.reduce((s, p) => s + p.kills, 0);
      if (teamKills > 0) {
        const kp = ((m.player_kills + m.player_assists) / teamKills) * 100;
        kpHtml = `<span class="text-grey-300 text-xs font-medium">${kp.toFixed(0)}% KP</span>`;
      }
    }

    let expandPanel = '';
    if (expanded) {
      const base = this.buildDetailBase(m.match_id);
      const inner = base
        ? this.matchDetail.renderInner(base)
        : `<div class="flex items-center gap-2 text-grey-500 text-sm py-6">
             <span class="w-4 h-4 border-2 border-grey-600 border-t-dry-sage-400 rounded-full animate-spin"></span>
             <span>Chargement de la télémétrie du match…</span>
           </div>`;
      expandPanel = `
        <div class="border-t border-grey-700/50 px-6 py-4 bg-charcoal-100/30" data-detail-root data-match-id="${m.match_id}">
          <div data-detail-content>${inner}</div>
        </div>`;
    }

    return `
      <div class="border-l-4 ${borderCls} border-b border-grey-700/40 last:border-b-0" data-match-id="${m.match_id}">
        <div class="flex items-stretch">

          <!-- Left: hero + meta + KDA (×2 scale: larger icon, more padding) -->
          <div class="flex items-center gap-4 px-5 py-5 w-[26%] min-w-0">
            ${heroImg
              ? `<img src="${heroImg}" alt="${heroName}" class="w-16 h-16 rounded-lg object-cover border border-grey-700 flex-shrink-0">`
              : `<div class="w-16 h-16 rounded-lg bg-grey-700 flex-shrink-0"></div>`}
            <div class="min-w-0">
              <div class="flex items-center gap-2 flex-wrap mb-1">
                <span class="text-xs font-bold uppercase ${won ? 'text-emerald-400' : 'text-red-400'}">${won ? 'Victoire' : 'Défaite'}</span>
                <span class="text-[10px] text-grey-400 bg-charcoal-100 px-1.5 py-0.5 rounded">${modeLabel}</span>
              </div>
              <p class="text-grey-500 text-xs truncate">#${m.match_id} · ${formatDuration(m.match_duration_s)} · ${timeAgo(m.start_time)}</p>
              <p class="text-white text-lg font-bold tabular-nums mt-1 leading-none">
                <span class="text-emerald-400">${m.player_kills}</span><span class="text-grey-500"> / </span><span class="text-red-400">${m.player_deaths}</span><span class="text-grey-500"> / </span><span class="text-amber-400">${m.player_assists}</span>
              </p>
              <div class="mt-0.5">${kpHtml}</div>
            </div>
          </div>

          <!-- Center: 6×2 build grid + team composition -->
          <div class="flex-1 border-l border-grey-700/40 px-4 py-4 flex gap-4 min-w-0">
            <!-- Build grid 6×2 (12 slots fixed) -->
            <div class="flex-shrink-0">
              <p class="text-grey-600 text-[10px] uppercase tracking-wider mb-2">Build</p>
              ${this.renderBuildGrid(m, meta, metaLoad)}
            </div>

            <!-- Team composition -->
            <div class="flex-1 border-l border-grey-700/30 pl-4 min-w-0">
              <p class="text-grey-600 text-[10px] uppercase tracking-wider mb-2">Équipes · ${teamSize}v${teamSize}</p>
              ${this.renderTeamComposition(m, meta, metaLoad, teamSize)}
            </div>
          </div>

          <!-- Right: expand button (win/loss background) -->
          <div class="border-l border-grey-700/40 flex-shrink-0 flex items-center">
            <button class="expand-match-btn ${expandBg} transition-colors h-full px-3 flex items-center justify-center"
                    data-match-id="${m.match_id}" title="Détails">
              <svg class="w-5 h-5 transition-transform ${expanded ? 'rotate-180' : ''}"
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
          </div>

        </div>
        ${expandPanel}
      </div>`;
  }

  /** 6×2 fixed grid — 12 slots, empties shown as placeholder boxes (Q3: A). */
  private renderBuildGrid(m: MatchEntry, meta: MatchMeta | undefined, loading: boolean): string {
    if (loading && !meta) {
      return `
        <div class="grid grid-cols-6 gap-1">
          ${Array(12).fill(0).map(() => `<div class="w-10 h-10 rounded bg-grey-700/40 animate-pulse"></div>`).join('')}
        </div>`;
    }

    const EMPTY_SLOT = `<div class="w-10 h-10 rounded border border-grey-700/30 bg-charcoal-100/10"></div>`;

    if (!meta) {
      return `<div class="grid grid-cols-6 gap-1">${Array(12).fill(EMPTY_SLOT).join('')}</div>`;
    }

    const me    = meta.players.find(p => p.account_id === m.account_id);
    const items = me ? endGameItems(me.items, this.itemMap) : [];

    const slots = Array(12).fill(null).map((_, i) => {
      const item = items[i];
      if (!item) return EMPTY_SLOT;
      return `
        <div class="relative w-10 h-10 group" title="${item.name}">
          <div class="relative w-10 h-10 rounded overflow-hidden border border-grey-700/60">
            <img src="${item.shop_image_webp}" alt="${item.name}" class="w-full h-full object-cover">
            ${renderItemTierBadge(item)}
          </div>
        </div>`;
    });

    return `<div class="grid grid-cols-6 gap-1">${slots.join('')}</div>`;
  }

  /** Team composition: hero icon + Steam name, split into two columns. */
  private renderTeamComposition(m: MatchEntry, meta: MatchMeta | undefined, loading: boolean, teamSize: number): string {
    if (loading && !meta) {
      return `
        <div class="grid grid-cols-2 gap-x-4 gap-y-1">
          ${Array(teamSize * 2).fill(0).map(() =>
            `<div class="flex items-center gap-1.5 animate-pulse">
               <div class="w-5 h-5 rounded-full bg-grey-700 flex-shrink-0"></div>
               <div class="h-2.5 w-16 bg-grey-700 rounded"></div>
             </div>`).join('')}
        </div>`;
    }

    if (!meta) {
      return `<div class="text-grey-600 text-xs">— Données indisponibles</div>`;
    }

    const team0 = meta.players.filter(p => p.team === 0).slice(0, teamSize);
    const team1 = meta.players.filter(p => p.team === 1).slice(0, teamSize);

    const renderPlayer = (p: MetaPlayer) => {
      const pHero = this.heroMap.get(p.hero_id);
      const pImg  = pHero?.images?.minimap_image_webp ?? pHero?.images?.icon_hero_card_webp ?? '';
      const pName = this.playerNameMap.get(p.account_id) ?? `#${p.account_id}`;
      const isSelf = p.account_id === m.account_id;
      return `
        <div class="flex items-center gap-1.5">
          ${pImg
            ? `<img src="${pImg}" alt="${pHero?.name}" class="w-5 h-5 rounded-full object-cover flex-shrink-0 border border-grey-700/60">`
            : `<div class="w-5 h-5 rounded-full bg-grey-700 flex-shrink-0"></div>`}
          <button class="navigate-player-btn text-left text-xs truncate max-w-[90px] transition-colors hover:text-dry-sage-400
                         ${isSelf ? 'text-white font-semibold' : 'text-grey-400'}"
                  data-account-id="${p.account_id}" title="${pName}">
            ${pName}
          </button>
        </div>`;
    };

    // Interleave team0 and team1 side by side in a 2-column grid
    const maxLen  = Math.max(team0.length, team1.length);
    const rows    = Array(maxLen).fill(null).map((_, i) => {
      const p0 = team0[i];
      const p1 = team1[i];
      return `
        ${p0 ? renderPlayer(p0) : '<div></div>'}
        ${p1 ? renderPlayer(p1) : '<div></div>'}`;
    });

    return `<div class="grid grid-cols-2 gap-x-4 gap-y-1">${rows.join('')}</div>`;
  }

  // ── Partial re-renders ────────────────────────────────────────────────────────

  private refreshMatchRows(): void {
    if (!this.container || this.loading) return;
    const list = this.container.querySelector('#match-rows-list');
    if (!list) return;
    list.innerHTML = this.allMatches.slice(0, this.visibleCount).map(m => this.renderMatchRow(m)).join('');
    this.attachMatchRowEvents();
  }

  // ── Skeleton ─────────────────────────────────────────────────────────────────

  private renderSkeleton(): string {
    const skCard = `
      <div class="bg-charcoal-200 border border-grey-700 rounded-xl p-4 animate-pulse">
        <div class="h-2.5 w-20 bg-grey-600 rounded mb-2"></div>
        <div class="h-6 w-16 bg-grey-500 rounded mb-1.5"></div>
        <div class="h-2.5 w-28 bg-grey-600 rounded"></div>
      </div>`;
    const skRow = (h: string) => `<div class="border-l-4 border-l-grey-700 border-b border-grey-700/40 animate-pulse"><div class="flex h-${h} items-center px-5 gap-4">
      <div class="w-16 h-16 rounded-lg bg-grey-700 flex-shrink-0"></div>
      <div class="flex-1 space-y-2"><div class="h-3 w-24 bg-grey-600 rounded"></div><div class="h-5 w-32 bg-grey-500 rounded"></div></div>
      <div class="grid grid-cols-6 gap-1">${Array(12).fill('<div class="w-10 h-10 rounded bg-grey-700/40"></div>').join('')}</div>
    </div></div>`;
    return `
      <div class="min-h-screen bg-charcoal-100">
        <!-- Banner skeleton -->
        <div class="bg-slate-900/75 border-b border-grey-700 px-8 py-4 flex items-center gap-3 animate-pulse">
          <div class="w-14 h-14 rounded-lg bg-grey-700 flex-shrink-0"></div>
          <div class="space-y-1.5">
            <div class="flex items-center gap-2">
              <div class="h-5 w-36 bg-grey-500 rounded"></div>
              <div class="w-7 h-7 rounded bg-grey-600"></div>
              <div class="h-3 w-20 bg-grey-600 rounded"></div>
            </div>
            <div class="h-2.5 w-16 bg-grey-700 rounded"></div>
          </div>
        </div>
        <!-- Tab bar skeleton -->
        <div class="border-b border-grey-700 px-8 h-11 flex items-end gap-6 animate-pulse">
          ${Array(3).fill('<div class="h-3 w-16 bg-grey-700 rounded mb-3"></div>').join('')}
        </div>
        <!-- Content skeleton -->
        <div class="px-6 py-5 max-w-7xl mx-auto space-y-4">
          <!-- Side-by-side row -->
          <div class="grid grid-cols-2 gap-4">
            <div class="grid grid-cols-2 gap-3">${skCard.repeat(4)}</div>
            <div class="bg-charcoal-200 border border-grey-700 rounded-xl p-4 animate-pulse h-48"></div>
          </div>
          <!-- Match rows -->
          <div class="bg-charcoal-200 border border-grey-700 rounded-xl overflow-hidden">
            ${[28, 28, 28, 28, 28].map(h => skRow(String(h))).join('')}
          </div>
        </div>
      </div>`;
  }

  private renderNotLoggedIn(): string {
    return `
      <div class="flex flex-col items-center justify-center min-h-screen bg-charcoal-100 gap-4">
        <p class="text-grey-400 text-lg">Connectez-vous à Steam pour voir votre profil.</p>
        <a href="#" id="go-settings-btn"
           class="px-4 py-2 bg-dry-sage-500 hover:bg-dry-sage-400 text-charcoal-100 rounded-lg text-sm font-medium transition-colors">
          Aller aux paramètres
        </a>
      </div>`;
  }

  // ── Events ────────────────────────────────────────────────────────────────────

  private attachEvents(): void {
    if (!this.container) return;
    this.container.querySelectorAll('.profil-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = (btn as HTMLElement).dataset.tab as Tab;
        if (tab && tab !== this.currentTab) { this.currentTab = tab; this.render(); }
      });
    });
    this.attachMatchRowEvents();
    this.attachAwardsEvents();
  }

  private attachMatchRowEvents(): void {
    if (!this.container) return;

    this.container.querySelectorAll('.expand-match-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number((btn as HTMLElement).dataset.matchId);
        if (!id) return;
        if (this.expandedMatches.has(id)) this.expandedMatches.delete(id);
        else this.expandedMatches.add(id);
        this.refreshMatchRows();
      });
    });

    this.container.querySelectorAll('.navigate-player-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const accountId = Number((btn as HTMLElement).dataset.accountId);
        if (accountId) document.dispatchEvent(new CustomEvent('navigate-player', { detail: { accountId } }));
      });
    });

    this.container.querySelector('#load-more-matches')?.addEventListener('click', () => {
      const prev = this.visibleCount;
      this.visibleCount += 10;
      this.refreshTabContent();
      this.fetchBatchMetadata(prev, this.visibleCount);
    });

    // Bind the expandable match-detail panels (Overview/Lane Stats/Items/Economy/Damage).
    this.matchDetail.attach(this.container, (matchId) => this.buildDetailBase(matchId));
  }
}
