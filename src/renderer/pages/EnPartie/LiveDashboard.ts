/**
 * LiveDashboard — 6×2 grid of PlayerCards showing all 12 players at match start.
 *
 * DEMO MODE
 * ─────────
 * Enabled via localStorage('demoModeEnabled') = 'true' (toggled in Configuration settings).
 * Cycles through 3 real match IDs: [80659633, 84419762, 80457157].
 * A "Refresh" button (demo only) advances to the next match in the cycle.
 * The cycle index resets to 0 on each app session.
 *
 * PRODUCTION (real mode)
 * ──────────────────────
 * Triggered by: deadlock.exe -steam -console
 * Process target: deadlock.exe  |  Expected status: Running
 * Binary path: S:\common\Deadlock\game\bin\win64\deadlock.exe
 * Match ID is injected by deadlock-detector.ts via game:match-started IPC event.
 *
 * DATA FLOW (renderer-side fetches)
 * ──────────────────────────────────
 * 1. Python (IPC) → /v1/matches/{id}/metadata   → 12 players + hero_ids
 * 2. fetch batch  → /v1/players/steam?account_ids=…   → Steam names + 30d game count
 * 3. fetch each   → /v1/assets/heroes/{id}  → hero name + icon_image_small_webp (one per unique hero)
 * 4. fetch batch  → /v1/players/hero-stats?account_ids=…     → win%, avg KDA per hero
 * 5. fetch batch  → /v1/players/mmr?account_ids=…            → individual badge level
 * 6. fetch once   → /v1/assets/ranks                         → rank names + badge images
 * 7. fetch once   → /v1/players/mmr/distribution             → global distribution for Top%
 * 8. fetch ×12    → /v1/players/{id}/match-history (parallel) → 12H / 30D wins
 */

import type {
  Player, MatchData, SteamProfile, HeroData,
  HeroStats, MMREntry, RankDistributionEntry, RankAsset, MatchHistoryEntry,
} from '../../../lib/types';
import { PlayerCard } from '../../componentsUI/PlayerCard';

type GameState = 'GAME_CLOSED' | 'GAME_MENU' | 'GAME_IN_MATCH';

const DEADLOCK_API   = 'https://api.deadlock-api.com';
const DEADLOCK_ASSET = 'https://assets.deadlock-api.com';

// Demo mode: 3 real match IDs from history to simulate a match just launched
const DEMO_MATCH_IDS = [80659633, 84419762, 80457157] as const;

// Unix offsets (seconds) used to slice match-history for activity windows
const SECONDS_12H = 12 * 60 * 60;
const SECONDS_30D = 30 * 24 * 60 * 60;

export class LiveDashboardPage {
  private container: HTMLElement | null = null;
  private isLoading = false;
  private matchData: MatchData | null = null;
  private heroCache = new Map<number, HeroData>();
  private detectedMatchId: string | null = null;
  private currentGameState: GameState = 'GAME_CLOSED';

  // Demo mode state (cycle resets on each app session)
  private isDemoMode = false;
  private demoIndex = 0;

  // Shared enrichment data (fetched once per match load)
  private rankDistribution: RankDistributionEntry[] = [];
  private rankAssets: RankAsset[] = [];

  mount(container: HTMLElement): void {
    this.container = container;
    this.isDemoMode = localStorage.getItem('demoModeEnabled') === 'true';
    this.renderCurrentState();
    this.syncStateFromMain();
  }

  handleGameStateChanged(state: GameState, matchId?: number): void {
    if (state === 'GAME_IN_MATCH' && matchId) {
      this.detectedMatchId = String(matchId);
      localStorage.setItem('detectedMatchId', this.detectedMatchId);
    } else if (state === 'GAME_CLOSED') {
      this.detectedMatchId = null;
      localStorage.removeItem('detectedMatchId');
    }

    const prevState = this.currentGameState;
    this.currentGameState = state;

    if (!this.container || prevState === state) return;
    this.transitionToState(state);
  }

  handleDetectedMatch(matchId: number): void {
    this.handleGameStateChanged('GAME_IN_MATCH', matchId);
  }

  clearDetectedMatchId(): void {
    this.handleGameStateChanged('GAME_CLOSED');
  }

  private async syncStateFromMain(): Promise<void> {
    if (!window.api?.getGameStatus) return;
    try {
      const status = await window.api.getGameStatus();
      const state: GameState =
        status.state ??
        (status.inMatch ? 'GAME_IN_MATCH' : status.isRunning ? 'GAME_MENU' : 'GAME_CLOSED');

      if (state === this.currentGameState) return;

      if (state === 'GAME_IN_MATCH' && status.matchId) {
        this.detectedMatchId = String(status.matchId);
        localStorage.setItem('detectedMatchId', this.detectedMatchId);
      }

      this.currentGameState = state;
      this.renderCurrentState();
    } catch {
      /* keep whatever we rendered */
    }
  }

  // ── State views ─────────────────────────────────────────────────────────────

  private renderCurrentState(): void {
    // Re-read demo flag in case it changed while the page was mounted
    this.isDemoMode = localStorage.getItem('demoModeEnabled') === 'true';

    if (this.isDemoMode || this.currentGameState === 'GAME_IN_MATCH') {
      this.renderInitialLoading();
      this.loadMatchData();
    } else if (this.currentGameState === 'GAME_MENU') {
      this.renderMenuView();
    } else {
      this.renderClosedView();
    }
  }

  private async transitionToState(state: GameState): Promise<void> {
    if (!this.container) return;

    this.container.style.transition = 'opacity 0.3s ease';
    this.container.style.opacity = '0';
    await new Promise<void>((r) => setTimeout(r, 300));
    if (!this.container) return;

    if (state === 'GAME_IN_MATCH') {
      this.renderInitialLoading();
      this.loadMatchData();
    } else if (state === 'GAME_MENU') {
      this.renderMenuView();
    } else {
      this.renderClosedView();
    }

    this.container.style.opacity = '1';
  }

  private renderClosedView(): void {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="bg-charcoal-100 min-h-screen h-screen overflow-hidden flex flex-col items-center justify-center">
        <div class="text-center max-w-lg px-8">
          <div class="w-16 h-16 rounded-full bg-charcoal-200 border border-grey-600 flex items-center justify-center mx-auto mb-8">
            <svg class="w-8 h-8 text-grey-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-white mb-3">No Active Game Detected</h1>
          <p class="text-grey-400 mb-8">We're not detecting any live game data at the moment.</p>
          <div class="bg-charcoal-200 rounded-lg border border-grey-600 p-5 text-left mb-4">
            <h3 class="text-white font-semibold mb-3">Why is this happening?</h3>
            <ul class="text-grey-400 text-sm space-y-2 list-disc list-inside">
              <li>You may not be in an active Deadlock match</li>
              <li>The game client may not be running</li>
            </ul>
          </div>
          <div class="bg-charcoal-200 rounded-lg border border-grey-600 p-5 text-left">
            <h3 class="text-white font-semibold mb-3">What to do next:</h3>
            <ul class="text-grey-400 text-sm space-y-2 list-disc list-inside">
              <li>Start a Deadlock match and this page will update automatically</li>
            </ul>
          </div>
          <p class="text-grey-500 text-xs mt-6 italic">
            This page will automatically refresh when you enter a match
          </p>
        </div>
      </div>
    `;
  }

  private renderMenuView(): void {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="bg-charcoal-100 min-h-screen h-screen overflow-hidden flex flex-col items-center justify-center">
        <div class="text-center max-w-lg px-8 w-full">
          <div class="flex items-center justify-center gap-2 mb-6">
            <span class="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse"></span>
            <span class="text-blue-400 text-sm font-medium">Game Detected</span>
          </div>
          <h1 class="text-2xl font-bold text-white mb-2">Waiting for Match to Start</h1>
          <p class="text-grey-400 text-sm mb-10">
            Deadlock is running. This page will update automatically when a match begins.
          </p>
          <div class="grid grid-cols-6 gap-2 opacity-20">
            ${Array(12).fill(0).map(() => `<div class="bg-charcoal-200 rounded-lg animate-pulse" style="height:100px;"></div>`).join('')}
          </div>
        </div>
      </div>
    `;
  }

  private renderInitialLoading(): void {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="p-4 bg-charcoal-100 min-h-screen h-screen flex flex-col">
        <div class="shrink-0 mb-4">
          <h1 class="text-2xl font-bold text-white">Live Dashboard</h1>
        </div>
        <div class="flex-1 grid grid-cols-6 gap-2">
          ${Array(12).fill(0).map(() => `<div class="bg-charcoal-200 rounded-lg animate-pulse border border-grey-600/30 border-l-4 border-l-grey-600"></div>`).join('')}
        </div>
      </div>
    `;
  }

  // ── Match ID resolution ──────────────────────────────────────────────────────

  private resolveMatchId(): string {
    // Demo mode: use the current demo match ID from the cycle
    if (this.isDemoMode) {
      return String(DEMO_MATCH_IDS[this.demoIndex]);
    }

    if (this.detectedMatchId) return this.detectedMatchId;

    const stored = localStorage.getItem('detectedMatchId');
    if (stored) {
      this.detectedMatchId = stored;
      return stored;
    }

    return '57331114'; // fallback
  }

  // ── Main data loading ────────────────────────────────────────────────────────

  private async loadMatchData(): Promise<void> {
    if (this.isLoading || !this.container) return;

    this.isLoading = true;

    try {
      if (!window.api?.executePython) throw new Error('API not available');

      const matchId = this.resolveMatchId();

      // Always use real API — demo mode uses real match IDs, no fake data
      let response = await window.api.executePython('match', matchId, false);
      let usingCache = false;

      if (response.cached) {
        usingCache = true;
      } else if (!response.success || response.status === 'api_error') {
        if (window.api?.getCachedMatch) {
          const cachedMatch = await window.api.getCachedMatch(matchId);
          if (cachedMatch) {
            response = { success: true, data: cachedMatch, cached: true };
            usingCache = true;
          } else {
            throw new Error(response.error || 'Failed to fetch match data and no cache available');
          }
        } else {
          throw new Error(response.error || 'Failed to fetch match data');
        }
      }

      const matchInfo = response.data?.match_info ?? response.data;
      if (!matchInfo?.players) throw new Error('Invalid match data structure');

      if (usingCache && this.container) this.showCacheIndicator();

      let players: Player[] = matchInfo.players.map((p: any) => ({
        ...p,
        lane: p.lane ?? this.mapLaneNumber(p.assigned_lane),
      }));

      const accountIds = players.map((p) => p.account_id).filter(Boolean) as number[];

      // ── Parallel enrichment phase ─────────────────────────────────────────
      // All fetches run concurrently to minimize total wait time.
      // Each fetch is documented with its source endpoint.
      // Runs all enrichment fetches concurrently to minimise total wait time.
      // fetchRankDistribution() and fetchRankAssets() store results in instance fields
      // rather than returning values, so we destructure only the first 4 slots.
      await Promise.all([
        this.fetchRankDistribution(), // 5. GET /v1/players/mmr/distribution
        this.fetchRankAssets(),       // 6. GET /v1/assets/ranks
      ]);

      const [steamProfiles, heroDataMap, heroStatsMap, mmrMap] = await Promise.all([
        // 1. Steam display names + avatar
        this.fetchSteamProfiles(accountIds),

        // 2. Hero name + icon_image_small_webp (CDN full URL)
        //    GET /v1/assets/heroes/{id} — one fetch per unique hero_id, cached
        this.fetchHeroDataMap(players.map((p) => p.hero_id).filter(Boolean) as number[]),

        // 3. Per-hero totals: matches_played, wins, kills, deaths, assists
        //    GET /v1/players/hero-stats?account_ids=<all 12>
        //    Keyed as "account_id:hero_id" for O(1) lookup
        this.fetchHeroStats(accountIds),

        // 4. Latest badge level (0–116) per player
        //    GET /v1/players/mmr?account_ids=<all 12>
        //    Most-recent entry per player (max start_time)
        this.fetchPlayerMMR(accountIds),
      ]);

      // 7. Match history per player (12 parallel calls) for 12H / 30D wins
      //    GET /v1/players/{account_id}/match-history
      //    Filtered client-side by start_time against Date.now() (real wall-clock time)
      const matchHistories = await this.fetchAllMatchHistories(accountIds);

      // ── Assemble enriched player objects ────────────────────────────────────
      players = players.map((player) => {
        const heroStat = heroStatsMap.get(`${player.account_id}:${player.hero_id}`);
        const mmrEntry = mmrMap.get(player.account_id);
        const history  = matchHistories.get(player.account_id) ?? [];
        const now      = Math.floor(Date.now() / 1000);

        // --- Hero-specific stats ---
        // Winrate: wins / matches_played for this specific hero
        const heroMatchesPlayed = heroStat?.matches_played ?? 0;
        const heroWins          = heroStat?.wins ?? 0;
        const heroWinrate       = heroMatchesPlayed > 0
          ? (heroWins / heroMatchesPlayed) * 100
          : undefined;

        // Average KDA: total kills (deaths, assists) / matches_played for this hero
        const heroAvgKills   = heroStat && heroMatchesPlayed > 0
          ? heroStat.kills   / heroMatchesPlayed : undefined;
        const heroAvgDeaths  = heroStat && heroMatchesPlayed > 0
          ? heroStat.deaths  / heroMatchesPlayed : undefined;
        const heroAvgAssists = heroStat && heroMatchesPlayed > 0
          ? heroStat.assists / heroMatchesPlayed : undefined;

        // --- Rank ---
        // Badge level from /v1/players/mmr (most recent entry)
        const rankBadgeLevel = mmrEntry?.rank;
        const rankTier       = rankBadgeLevel !== undefined ? Math.floor(rankBadgeLevel / 10) : undefined;
        const rankSubrank    = rankBadgeLevel !== undefined ? rankBadgeLevel % 10 : undefined;

        // Rank asset: match tier to asset, pick subtier image
        const rankAsset      = rankTier !== undefined
          ? this.rankAssets.find((r) => r.tier === rankTier)
          : undefined;

        // Rank name: e.g. "Arcanist" + roman subrank → "Arcanist II"
        const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI'];
        const rankName = rankAsset && rankSubrank !== undefined
          ? `${rankAsset.name} ${ROMAN[rankSubrank] ?? ''}`.trim()
          : undefined;

        // Rank image: use subtier-specific image when available
        const subKey = rankSubrank !== undefined ? `small_subrank${rankSubrank}_webp` : undefined;
        const rankImageUrl = rankAsset
          ? (subKey && rankAsset.images[subKey])
            ?? rankAsset.images['small_webp']
            ?? rankAsset.images['small']
            ?? undefined
          : undefined;

        // Top% = percentage of players with a higher badge level than this player
        const rankTopPercent = rankBadgeLevel !== undefined
          ? this.computeTopPercent(rankBadgeLevel)
          : undefined;

        // --- Activity windows (using real Date.now() as reference) ---
        // Filters match-history entries by start_time timestamp
        // match_result interpretation: 0 = loss, 1 = win (Deadlock API convention)
        const slice12h = history.filter((e) => e.start_time >= now - SECONDS_12H);
        const slice30d = history.filter((e) => e.start_time >= now - SECONDS_30D);

        const toActivity = (entries: MatchHistoryEntry[]) => ({
          games: entries.length,
          wins:  entries.filter((e) => e.match_result === 1).length,
        });

        return {
          ...player,
          steamProfile:    steamProfiles.get(player.account_id),
          heroData:        heroDataMap.get(player.hero_id),
          heroMatchesPlayed,
          heroWinrate,
          heroAvgKills,
          heroAvgDeaths,
          heroAvgAssists,
          rankBadgeLevel,
          rankName,
          rankImageUrl,
          rankTopPercent,
          activity12h: toActivity(slice12h),
          activity30d: toActivity(slice30d),
        };
      });

      this.matchData = {
        match_id:     matchInfo.match_id,
        duration_s:   matchInfo.duration_s,
        winning_team: matchInfo.winning_team,
        players,
        teams: response.data?.teams ?? [],
      };

      // Cache only real (non-demo) match data to avoid poisoning with historical demos
      if (!usingCache && !this.isDemoMode && response.success && window.api?.cacheMatch && matchInfo.match_id) {
        window.api.cacheMatch(matchId, this.matchData).catch(() => { /* non-fatal */ });
      }

      this.renderMatchData();
    } catch (error) {
      console.error('Failed to load match data:', error);
      this.showError(error instanceof Error ? error.message : 'Failed to load match data');
    } finally {
      this.isLoading = false;
    }
  }

  // ── Enrichment fetches ───────────────────────────────────────────────────────

  /**
   * GET /v1/players/steam?account_ids=…
   * Returns Steam display names, avatar URLs, matches_played_last_30d.
   * Batch endpoint — supports up to 1 000 account_ids in one call.
   */
  private async fetchSteamProfiles(accountIds: number[]): Promise<Map<number, SteamProfile>> {
    const map = new Map<number, SteamProfile>();
    if (!accountIds.length) return map;
    try {
      const res = await fetch(`${DEADLOCK_API}/v1/players/steam?account_ids=${accountIds.join(',')}`);
      if (!res.ok) return map;
      const profiles: SteamProfile[] = await res.json();
      profiles.forEach((p) => map.set(p.account_id, p));
    } catch { /* return empty map */ }
    return map;
  }

  /**
   * GET https://api.deadlock-api.com/v1/assets/heroes/{heroId}
   * Returns hero data including images.icon_image_small_webp (full CDN URL to assets-bucket.deadlock-api.com).
   * One fetch per unique hero_id — results cached in this.heroCache.
   */
  private async fetchHeroDataMap(heroIds: number[]): Promise<Map<number, HeroData>> {
    const unique = [...new Set(heroIds)];
    const results = await Promise.all(unique.map((id) => this.fetchHeroData(id)));
    const map = new Map<number, HeroData>();
    unique.forEach((id, i) => { if (results[i]) map.set(id, results[i]!); });
    return map;
  }

  private async fetchHeroData(heroId: number): Promise<HeroData | null> {
    if (this.heroCache.has(heroId)) return this.heroCache.get(heroId)!;
    try {
      // Correct endpoint: api.deadlock-api.com (not assets subdomain)
      // assets.deadlock-api.com/v2/heroes/{id} returns 301 — use /v1/assets/heroes/{id}
      const res = await fetch(`${DEADLOCK_API}/v1/assets/heroes/${heroId}`);
      if (!res.ok) return null;
      const data: HeroData = await res.json();
      this.heroCache.set(heroId, data);
      return data;
    } catch { return null; }
  }

  /**
   * GET /v1/players/hero-stats?account_ids=…
   * Returns a flat array of HeroStats, one entry per (account_id, hero_id) combo.
   * Keyed as "account_id:hero_id" for O(1) lookups.
   * Used for: hero winrate, avg kills/deaths/assists per game.
   */
  private async fetchHeroStats(accountIds: number[]): Promise<Map<string, HeroStats>> {
    const map = new Map<string, HeroStats>();
    if (!accountIds.length) return map;
    try {
      const res = await fetch(`${DEADLOCK_API}/v1/players/hero-stats?account_ids=${accountIds.join(',')}`);
      if (!res.ok) return map;
      const stats: HeroStats[] = await res.json();
      stats.forEach((s) => map.set(`${s.account_id}:${s.hero_id}`, s));
    } catch { /* return empty map */ }
    return map;
  }

  /**
   * GET /v1/players/mmr?account_ids=…
   * Returns MMR history entries (may include multiple entries per player).
   * We keep only the most recent entry per account_id (highest start_time).
   * Used for: individual badge level → rank name + image.
   */
  private async fetchPlayerMMR(accountIds: number[]): Promise<Map<number, MMREntry>> {
    const map = new Map<number, MMREntry>();
    if (!accountIds.length) return map;
    try {
      const res = await fetch(`${DEADLOCK_API}/v1/players/mmr?account_ids=${accountIds.join(',')}`);
      if (!res.ok) return map;
      const entries: MMREntry[] = await res.json();
      // Keep the most recent entry per player (highest start_time = latest match)
      entries.forEach((e) => {
        const existing = map.get(e.account_id);
        if (!existing || e.start_time > existing.start_time) {
          map.set(e.account_id, e);
        }
      });
    } catch { /* return empty map */ }
    return map;
  }

  /**
   * GET /v1/players/mmr/distribution
   * Returns the global distribution of players across badge levels.
   * Used to compute Top X% (what fraction of players have a higher badge than this player).
   * Fetched once per session and stored in this.rankDistribution.
   */
  private async fetchRankDistribution(): Promise<void> {
    if (this.rankDistribution.length > 0) return; // already loaded
    try {
      const res = await fetch(`${DEADLOCK_API}/v1/players/mmr/distribution`);
      if (!res.ok) return;
      this.rankDistribution = await res.json();
    } catch { /* leave empty */ }
  }

  /**
   * GET /v1/assets/ranks
   * Returns 12 rank tiers with localized names and badge image URLs.
   * Fields used: tier (0–11), name, images.small_webp, images.small_subrank{N}_webp.
   * Fetched once per session and stored in this.rankAssets.
   */
  private async fetchRankAssets(): Promise<void> {
    if (this.rankAssets.length > 0) return; // already loaded
    try {
      const res = await fetch(`${DEADLOCK_API}/v1/assets/ranks`);
      if (!res.ok) return;
      this.rankAssets = await res.json();
    } catch { /* leave empty */ }
  }

  /**
   * GET /v1/players/{account_id}/match-history  (12 parallel calls)
   * Returns full match history per player. We filter client-side by start_time
   * using real Date.now() to compute 12H and 30D activity windows.
   *
   * Rate limit: 100 req/s from IP (non bot-friend) — 12 parallel calls are well within limit.
   */
  private async fetchAllMatchHistories(accountIds: number[]): Promise<Map<number, MatchHistoryEntry[]>> {
    const map = new Map<number, MatchHistoryEntry[]>();
    const results = await Promise.all(
      accountIds.map(async (id): Promise<{ id: number; entries: MatchHistoryEntry[] }> => {
        try {
          const r = await fetch(`${DEADLOCK_API}/v1/players/${id}/match-history`);
          const entries: MatchHistoryEntry[] = r.ok ? await r.json() : [];
          return { id, entries };
        } catch {
          return { id, entries: [] };
        }
      })
    );
    results.forEach(({ id, entries }) => map.set(id, entries));
    return map;
  }

  // ── Rank computation ─────────────────────────────────────────────────────────

  /**
   * Computes "Top X%" = percentage of players with a badge_level STRICTLY higher
   * than this player's badge.
   * Example: if 74% of players have a higher badge → "Top 74%".
   */
  private computeTopPercent(badgeLevel: number): number {
    if (!this.rankDistribution.length) return 50; // fallback when distribution unavailable
    const total = this.rankDistribution.reduce((s, e) => s + e.players, 0);
    if (total === 0) return 50;
    // Players with a rank strictly greater than this player's badge level
    const above = this.rankDistribution
      .filter((e) => e.rank > badgeLevel)
      .reduce((s, e) => s + e.players, 0);
    return Math.round((above / total) * 100);
  }

  // ── Grid rendering ───────────────────────────────────────────────────────────

  private mapLaneNumber(assignedLane: number | undefined): 'yellow' | 'blue' | 'green' | undefined {
    // Real API lane values
    if (assignedLane === 1) return 'blue';
    if (assignedLane === 4) return 'yellow';
    if (assignedLane === 6) return 'green';
    // Fallback for mock/legacy data (0=yellow, 1=blue, 2=green)
    const fallback: Record<number, 'yellow' | 'blue' | 'green'> = { 0: 'yellow', 2: 'green' };
    return assignedLane !== undefined ? fallback[assignedLane] : undefined;
  }

  /**
   * Organises the 12 players into a 6×2 grid where columns represent lane matchups:
   *   Col 0–1 : Yellow lane (team 0 vs team 1)
   *   Col 2–3 : Blue   lane (team 0 vs team 1)
   *   Col 4–5 : Green  lane (team 0 vs team 1)
   *
   * Row 0 = Team 0 (left side), Row 1 = Team 1 (right side).
   * Adjacent rows in the same column are the direct lane opponents.
   */
  private organizePlayersIntoGrid(players: Player[]): { row0: (Player | null)[]; row1: (Player | null)[] } {
    const byLane = (lane: string, team: 0 | 1) => players.filter((p) => p.lane === lane && p.team === team);

    const row0: (Player | null)[] = [
      byLane('yellow', 0)[0] ?? null, byLane('yellow', 0)[1] ?? null,
      byLane('blue',   0)[0] ?? null, byLane('blue',   0)[1] ?? null,
      byLane('green',  0)[0] ?? null, byLane('green',  0)[1] ?? null,
    ];
    const row1: (Player | null)[] = [
      byLane('yellow', 1)[0] ?? null, byLane('yellow', 1)[1] ?? null,
      byLane('blue',   1)[0] ?? null, byLane('blue',   1)[1] ?? null,
      byLane('green',  1)[0] ?? null, byLane('green',  1)[1] ?? null,
    ];

    return { row0, row1 };
  }

  private renderMatchData(): void {
    if (!this.container || !this.matchData) return;

    const { row0, row1 } = this.organizePlayersIntoGrid(this.matchData.players);

    const getLaneColor = (col: number): 'yellow' | 'blue' | 'green' =>
      col < 2 ? 'yellow' : col < 4 ? 'blue' : 'green';

    const renderCell = (player: Player | null, col: number): string => {
      if (!player) {
        return `<div class="bg-[#1a1f24] rounded-lg border border-[#2a2f35] opacity-20"></div>`;
      }
      const el = document.createElement('div');
      PlayerCard.mount(el, { player, laneColor: getLaneColor(col) });
      return el.innerHTML;
    };

    const matchId    = this.matchData.match_id ?? this.resolveMatchId();
    const demoLabel  = this.isDemoMode
      ? `<span class="px-2 py-0.5 rounded text-xs font-medium bg-yellow-400/10 text-yellow-400 border border-yellow-400/30">DEMO</span>`
      : '';

    this.container.innerHTML = `
      <div class="bg-charcoal-100 min-h-screen h-screen overflow-hidden flex flex-col">

        <!-- HEADER -->
        <div class="flex items-center justify-between px-4 py-3 shrink-0 border-b border-[#2a2f35]">
          <div class="flex items-center gap-3">
            <h1 class="text-lg font-bold text-white">Live Dashboard</h1>
            ${demoLabel}
            <!-- Match ID always visible regardless of mode -->
            <span class="text-xs text-[#555] font-mono">Match ID: ${matchId}</span>
          </div>

          <!-- Refresh: shows cycle arrow in demo mode, simple reload icon in real mode -->
          <button
            id="refresh-match-btn"
            title="${this.isDemoMode ? 'Next demo match' : 'Refresh match data'}"
            class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-charcoal-200 hover:bg-charcoal-300 text-white border border-grey-600 hover:border-frosted-mint-500 transition-colors text-sm"
          >
            ${this.isDemoMode
              ? `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                     d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                 </svg>
                 Refresh`
              : `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                     d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                 </svg>
                 Actualiser`
            }
          </button>
        </div>

        <!-- GRID: 6 columns × 2 rows, each column = one lane matchup -->
        <!-- Yellow (col 0-1) | Blue (col 2-3) | Green (col 4-5) -->
        <div class="flex-1 grid grid-cols-6 grid-rows-2 gap-x-2 gap-y-2 p-2 overflow-hidden">
          ${row0.map((p, i) => `<div class="min-h-0">${renderCell(p, i)}</div>`).join('')}
          ${row1.map((p, i) => `<div class="min-h-0">${renderCell(p, i)}</div>`).join('')}
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  // ── Event listeners ──────────────────────────────────────────────────────────

  private attachEventListeners(): void {
    document.getElementById('refresh-match-btn')?.addEventListener('click', () => {
      if (this.isDemoMode) {
        // Advance to the next demo match ID in the cycle (wraps around)
        this.demoIndex = (this.demoIndex + 1) % DEMO_MATCH_IDS.length;
      }
      this.loadMatchData();
    });
  }

  // ── UI helpers ───────────────────────────────────────────────────────────────

  private showError(message: string): void {
    if (!this.container) return;
    const div = document.createElement('div');
    div.className = 'fixed bottom-4 right-4 z-50 bg-red-900/90 border border-red-500/50 rounded-lg p-4 max-w-sm';
    div.innerHTML = `
      <p class="text-red-400 font-semibold text-sm mb-1">Erreur de chargement</p>
      <p class="text-red-300 text-xs">${message}</p>
    `;
    this.container.appendChild(div);
    setTimeout(() => div.remove(), 7000);
  }

  private showCacheIndicator(): void {
    if (!this.container) return;
    this.container.querySelector('.cache-indicator')?.remove();
    const div = document.createElement('div');
    div.className = 'cache-indicator fixed top-16 right-4 z-40 bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-3';
    div.innerHTML = `
      <p class="text-yellow-400 text-sm font-semibold">Données en cache</p>
      <p class="text-yellow-300 text-xs">L'API est indisponible. Affichage des dernières données.</p>
    `;
    this.container.appendChild(div);
    setTimeout(() => div.parentNode && div.remove(), 5000);
  }
}
