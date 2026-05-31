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
 * 0. ROSTER (source depends on liveness — see ADR-0004 + docs/live-dashboard-spec.md):
 *    • Demo / historical → GET /v1/matches/metadata?match_ids={id}&include_info=true&include_player_info=true
 *      (BULK endpoint, 10 req/min IP, Clickhouse-backed — no Steam 503). Returns a flat
 *      JSON array with PascalCase enums ("StreetBrawl", "Team0") → normalizeMatchInfo().
 *    • Live-detected match → GET /v1/matches/active?account_ids={me} (real-time roster:
 *      account_id/hero_id/team only). Often empty mid-match → LIVE_PENDING state + poll.
 *    • Fallback → electron-store cached match (getCachedMatch).
 * 1. ↳ yields players[{account_id, player_slot, hero_id, team, assigned_lane}] + game_mode
 * 2. fetch batch  → /v1/players/steam?account_ids=…   → Steam names + 30d game count
 * 3. fetch each   → /v1/assets/heroes/{id}  → hero name + icon_image_small_webp (one per unique hero)
 * 4. fetch batch  → /v1/players/hero-stats?account_ids=…     → win%, avg KDA per hero
 * 5. fetch batch  → /v1/players/mmr?account_ids=…            → individual badge level
 * 6. fetch once   → /v1/assets/ranks                         → rank names + badge images
 * 7. fetch once   → /v1/players/mmr/distribution             → global distribution for Top%
 * 8. fetch ×N     → /v1/players/{id}/match-history (parallel) → 12H / 30D wins
 */

import type {
  Player, MatchData, SteamProfile, HeroData,
  HeroStats, MMREntry, RankDistributionEntry, RankAsset, MatchHistoryEntry,
  OcrRoster, OcrPlayer,
} from '../../../lib/types';
import { PlayerCard } from '../../componentsUI/PlayerCard';

type GameState = 'GAME_CLOSED' | 'GAME_MENU' | 'GAME_IN_MATCH';

const DEADLOCK_API   = 'https://api.deadlock-api.com';
const DEADLOCK_ASSET = 'https://assets.deadlock-api.com';

// Demo mode: real match IDs from history to simulate a match just launched.
// Includes a verified Street Brawl 4v4 (84553413) so the 4-tiles-per-team layout
// is testable on demand. (The brief's 85818364 is unusable — it 503s from Steam.)
const DEMO_MATCH_IDS = [80659633, 84419762, 80457157, 84553413] as const;

// Unix offsets (seconds) used to slice match-history for activity windows
const SECONDS_12H = 12 * 60 * 60;
const SECONDS_30D = 30 * 24 * 60 * 60;

export class LiveDashboardPage {
  private container: HTMLElement | null = null;
  private isLoading = false;
  private matchData: MatchData | null = null;
  private heroCache = new Map<number, HeroData>();
  private detectedMatchId: string | null = null;
  private loadedMatchId: string | null = null;
  private currentGameState: GameState = 'GAME_CLOSED';

  // Demo mode state (cycle resets on each app session)
  private isDemoMode = false;
  private demoIndex = 0;

  // Live-match polling: a freshly-detected match isn't ingested by the API yet,
  // so we re-attempt the roster fetch on a timer while in the LIVE_PENDING state.
  private livePollTimer: ReturnType<typeof setTimeout> | null = null;

  // Dernier roster reçu du worker OCR (ocr-worker/main.py → IPC ocr:roster-updated).
  // Utilisé comme fallback visuel en LIVE_PENDING quand l'API n'a pas encore ingéré la partie.
  private ocrRoster: OcrRoster | null = null;

  // Shared enrichment data (fetched once per match load)
  private rankDistribution: RankDistributionEntry[] = [];
  private rankAssets: RankAsset[] = [];

  mount(container: HTMLElement): void {
    this.container = container;
    this.isDemoMode = localStorage.getItem('demoModeEnabled') === 'true';
    this.renderCurrentState();
    this.syncStateFromMain();
    // Écoute le worker OCR — reçu dès qu'on presse ESC en partie (ocr-worker/main.py, poll 1,5s).
    // Si l'API n'a pas encore ingéré la partie (LIVE_PENDING), affiche les tuiles OCR immédiatement.
    window.api?.onOcrRosterUpdated?.((roster: OcrRoster) => {
      this.ocrRoster = roster;
      if (this.currentGameState === 'GAME_IN_MATCH' && !this.isLoading && !this.matchData) {
        this.renderOcrRosterView(roster);
      }
    });
  }

  handleGameStateChanged(state: GameState, matchId?: number): void {
    if (state === 'GAME_IN_MATCH' && matchId) {
      this.detectedMatchId = String(matchId);
      localStorage.setItem('detectedMatchId', this.detectedMatchId);
    } else if (state === 'GAME_CLOSED') {
      this.detectedMatchId = null;
      this.ocrRoster = null;
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

    // Load match data only when there is an actual match to show: demo mode, or a
    // live-detected match. When idle (no match), show the waiting screen — we do
    // NOT auto-load the player's most recent match (that was confusing: the last
    // ingested match would appear as if a game were live).
    if (this.isDemoMode || this.currentGameState === 'GAME_IN_MATCH' || this.detectedMatchId) {
      this.renderInitialLoading();
      this.loadMatchData();
    } else if (this.currentGameState === 'GAME_MENU') {
      this.renderMenuView();
    } else {
      this.renderClosedView();
    }
  }

  private async transitionToState(_state: GameState): Promise<void> {
    if (!this.container) return;

    // A state change (e.g. match ended) invalidates any pending live-poll loop.
    this.stopLivePoll();

    this.container.style.transition = 'opacity 0.3s ease';
    this.container.style.opacity = '0';
    await new Promise<void>((r) => setTimeout(r, 300));
    if (!this.container) return;

    // Render the view appropriate to the new state (waiting screens when idle,
    // match data only when actually in a match or in demo mode).
    this.renderCurrentState();

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

  /**
   * LIVE_PENDING: a match is detected but the community API has no data for it yet
   * (it ingests during/after the match, not in real time). Shown until a poll
   * succeeds. See glossary "Live Roster Availability".
   * Si le worker OCR a déjà un roster, l'affiche directement au lieu de l'écran d'attente.
   */
  private renderLivePending(matchId: string): void {
    if (!this.container) return;
    if (this.ocrRoster && (this.ocrRoster.myTeam.length > 0 || this.ocrRoster.enemyTeam.length > 0)) {
      this.renderOcrRosterView(this.ocrRoster);
      return;
    }
    this.container.innerHTML = `
      <div class="bg-charcoal-100 min-h-screen h-screen overflow-hidden flex flex-col items-center justify-center text-center px-8">
        <div class="flex items-center gap-2 mb-6">
          <span class="w-2.5 h-2.5 rounded-full bg-frosted-mint-500 animate-pulse"></span>
          <span class="text-frosted-mint-500 text-sm font-medium">Partie détectée — Match ID ${matchId}</span>
        </div>
        <h1 class="text-2xl font-bold text-white mb-3">Données indisponibles en direct</h1>
        <p class="text-grey-400 text-sm max-w-md mb-6">
          L'API publie les données des joueurs pendant / après la partie, pas en temps réel.
          Ce tableau se remplira automatiquement dès qu'elles seront disponibles.
        </p>
        <p class="text-grey-500 text-xs mb-10">
          ESP actif — ouvrez l'onglet PLAYERS dans le jeu (ESC) pour afficher le roster immédiatement.
        </p>
        <div class="grid grid-cols-4 gap-2 opacity-20 w-full max-w-3xl">
          ${Array(8).fill(0).map(() => `<div class="bg-charcoal-200 rounded-lg animate-pulse" style="height:90px;"></div>`).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Vue OCR fallback : roster issu de l'OCR (ocr-worker/main.py) quand l'API n'a pas de données.
   * Affiche les héros (nom + pseudo Steam) sans statistiques — celles-ci restent indisponibles
   * car le pseudo Steam n'est pas résolvable en account_id (voir docs/ESP_FINAL/OCR_WORKER.md §2.1).
   * L'icône héros utilise le cache heroCache si disponible, sinon un placeholder.
   * Source icône: GET https://api.deadlock-api.com/v1/assets/heroes/{heroId} → images.icon_image_small_webp
   */
  private renderOcrRosterView(roster: OcrRoster): void {
    if (!this.container) return;

    const heroTile = (p: OcrPlayer, side: 'ally' | 'enemy'): string => {
      const cached = p.heroId !== null ? this.heroCache.get(p.heroId) : null;
      const iconUrl = cached?.images?.icon_image_small_webp ?? cached?.images?.icon_image_small ?? null;
      const accentClass = side === 'ally' ? 'border-frosted-mint-500/40' : 'border-red-500/40';
      const confidencePct = Math.round(p.heroScore);
      return `
        <div class="bg-charcoal-200 rounded-lg border ${accentClass} border p-2 flex items-center gap-2 min-w-0">
          <div class="w-10 h-10 rounded bg-charcoal-300 shrink-0 overflow-hidden flex items-center justify-center text-grey-500 text-xs">
            ${iconUrl
              ? `<img src="${iconUrl}" alt="${p.heroName}" class="w-full h-full object-cover" />`
              : `<span>${p.heroName.slice(0, 2)}</span>`}
          </div>
          <div class="min-w-0 flex-1">
            <div class="text-white text-sm font-medium truncate">${p.heroName === 'unknown_hero' ? '???' : p.heroName}</div>
            <div class="text-grey-400 text-xs truncate">${p.steamName || '—'}</div>
          </div>
          <span class="text-grey-600 text-xs font-mono shrink-0">${confidencePct}%</span>
        </div>`;
    };

    const teamSection = (players: OcrPlayer[], label: string, side: 'ally' | 'enemy'): string => {
      if (players.length === 0) return '';
      const labelClass = side === 'ally' ? 'text-frosted-mint-400' : 'text-red-400';
      return `
        <div>
          <h2 class="text-xs font-semibold uppercase tracking-widest ${labelClass} mb-2 px-1">${label}</h2>
          <div class="space-y-1.5">${players.map((p) => heroTile(p, side)).join('')}</div>
        </div>`;
    };

    this.container.innerHTML = `
      <div class="bg-charcoal-100 min-h-screen h-screen overflow-hidden flex flex-col p-4">
        <div class="shrink-0 mb-4 flex items-center gap-3 flex-wrap">
          <div class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-frosted-mint-500 animate-pulse"></span>
            <span class="text-frosted-mint-500 text-xs font-medium uppercase tracking-wider">ESP Live Scan</span>
          </div>
          <h1 class="text-lg font-bold text-white">Roster détecté</h1>
          <span class="ml-auto text-grey-500 text-xs">Aucune stat — pseudo Steam non résolvable</span>
        </div>
        <div class="flex-1 grid grid-cols-2 gap-4 overflow-auto min-h-0">
          ${teamSection(roster.myTeam, 'Mon équipe', 'ally')}
          ${teamSection(roster.enemyTeam, 'Équipe ennemie', 'enemy')}
        </div>
        <div class="shrink-0 mt-3 text-center text-grey-600 text-xs">
          Ouvrez l'onglet PLAYERS dans le jeu (ESC) pour rafraîchir · l'API se remplira automatiquement
        </div>
      </div>
    `;
  }

  // ── Match ID resolution ──────────────────────────────────────────────────────

  private async resolveMatchId(): Promise<string | null> {
    // Demo mode (optional toggle): cycle through known real match IDs
    if (this.isDemoMode) {
      return String(DEMO_MATCH_IDS[this.demoIndex]);
    }

    // 1. A live-detected match always wins
    if (this.detectedMatchId) return this.detectedMatchId;
    const stored = localStorage.getItem('detectedMatchId');
    if (stored) {
      this.detectedMatchId = stored;
      return stored;
    }

    // Otherwise: no live match → null. The caller (renderCurrentState) shows the
    // waiting screen instead of falling back to the player's most recent match.
    return null;
  }

  /** SteamID64 → 32-bit account_id (subtract the Steam base constant). */
  private steamId64ToAccountId(steamId64: string): number | null {
    try {
      const base = 76561197960265728n;
      const value = BigInt(steamId64);
      if (value < base) return null;
      const accountId = Number(value - base);
      return Number.isSafeInteger(accountId) ? accountId : null;
    } catch {
      return null;
    }
  }

  // ── Roster fetch + normalization ─────────────────────────────────────────────

  /**
   * Bulk metadata endpoint — the dashboard's primary roster source.
   * GET /v1/matches/metadata?match_ids={id}&include_info=true&include_player_info=true
   * 10 req/min per IP, Clickhouse-backed (no Steam dependency → no 503).
   * Returns a JSON array of flat match objects with PascalCase enums
   * ("Normal"/"StreetBrawl", "Team0"/"Team1"); normalizeMatchInfo() canonicalises them.
   */
  private async fetchBulkMatchInfo(matchId: string): Promise<any | null> {
    try {
      const url = `${DEADLOCK_API}/v1/matches/metadata?match_ids=${matchId}`
        + `&include_info=true&include_player_info=true`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const arr = await res.json();
      const raw = Array.isArray(arr) ? arr[0] : arr;
      return this.normalizeMatchInfo(raw);
    } catch {
      return null;
    }
  }

  /**
   * Real-time roster for a live-detected match.
   * GET /v1/matches/active?account_ids={me} — returns the match the player is in,
   * with players carrying account_id / hero_id / team only (no assigned_lane or
   * player_slot → synthesized here). Frequently empty mid-match (post-match
   * ingestion lag), in which case the caller shows the LIVE_PENDING state.
   */
  private async fetchActiveMatchInfo(matchId: string): Promise<any | null> {
    try {
      const profile = await window.api?.steamGetProfile?.();
      if (!profile?.steamId64) return null;
      const accountId = this.steamId64ToAccountId(profile.steamId64);
      if (accountId === null) return null;

      const res = await fetch(`${DEADLOCK_API}/v1/matches/active?account_ids=${accountId}`);
      if (!res.ok) return null;
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) return null;

      const match = data.find((m: any) =>
        String(m.match_id) === String(matchId) && Array.isArray(m.players) && m.players.length)
        ?? data.find((m: any) => Array.isArray(m.players) && m.players.length);
      if (!match) return null;

      return this.normalizeMatchInfo({
        match_id: Number(matchId),
        game_mode: match.game_mode_parsed ?? match.game_mode,
        duration_s: match.duration_s,
        winning_team: match.winning_team,
        players: match.players.map((p: any, i: number) => ({
          account_id: p.account_id,
          hero_id: p.hero_id,
          team: p.team_parsed ?? p.team,
          player_slot: i,
          assigned_lane: p.assigned_lane,
        })),
      });
    } catch {
      return null;
    }
  }

  /**
   * Canonicalises a raw match object into the shape the dashboard renders, tolerating
   * BOTH endpoint dialects (bulk = flat + PascalCase strings; per-match/cache = nested
   * under match_info + integers). Player objects are spread so existing enrichment
   * fields survive when normalising a cached, already-enriched match.
   */
  private normalizeMatchInfo(raw: any): any | null {
    const info = raw?.match_info ?? raw;
    if (!info?.players?.length) return null;
    const players = info.players.map((p: any, i: number) => ({
      ...p,
      player_slot: p.player_slot ?? i,
      team: this.normalizeTeam(p.team),
    }));
    return {
      ...info,
      match_id: info.match_id,
      game_mode: info.game_mode,
      game_mode_label: this.gameModeLabel(info.game_mode),
      duration_s: info.duration_s,
      winning_team: this.normalizeTeam(info.winning_team),
      players,
    };
  }

  /** "Team0"/"Team1" (bulk) or 0/1 (per-match) → 0 | 1. Unknown/null → 0. */
  private normalizeTeam(team: any): 0 | 1 {
    return team === 1 || team === 'Team1' ? 1 : 0;
  }

  /** True for Street Brawl across every enum dialect (4 | "StreetBrawl" | "KECitadelGameModeStreetBrawl" | "street_brawl"). */
  private isStreetBrawl(gameMode: any): boolean {
    return gameMode === 4 || (typeof gameMode === 'string' && /street_?brawl/i.test(gameMode));
  }

  /** Human label for the mode badge. */
  private gameModeLabel(gameMode: any): string {
    if (this.isStreetBrawl(gameMode)) return 'Street Brawl';
    if (gameMode === 1 || (typeof gameMode === 'string' && /normal/i.test(gameMode))) return 'Normal';
    return '';
  }

  // ── Live-match polling (LIVE_PENDING state) ───────────────────────────────────

  /** Re-attempt the roster fetch while a detected live match isn't ingested yet. */
  private scheduleLivePoll(): void {
    this.stopLivePoll();
    this.livePollTimer = setTimeout(() => {
      this.livePollTimer = null;
      this.loadMatchData();
    }, 20000);
  }

  private stopLivePoll(): void {
    if (this.livePollTimer) {
      clearTimeout(this.livePollTimer);
      this.livePollTimer = null;
    }
  }

  // ── Main data loading ────────────────────────────────────────────────────────

  private async loadMatchData(): Promise<void> {
    if (this.isLoading || !this.container) return;

    this.isLoading = true;

    try {
      if (!window.api) throw new Error('API not available');

      const matchId = await this.resolveMatchId();
      if (!matchId) {
        // Not logged in to Steam, or no match history yet → nothing real to show.
        this.renderClosedView();
        return;
      }
      this.loadedMatchId = matchId;

      // A live-detected match (not demo) isn't ingested by the post-match APIs yet,
      // so its roster comes from the real-time active-match endpoint (best-effort).
      const isLiveDetected = !this.isDemoMode && this.detectedMatchId === matchId;

      // ── Roster resolution (see ADR-0004) ─────────────────────────────────────
      let matchInfo: any = null;

      if (isLiveDetected) {
        // Real-time roster first; if the match has just ended it may already be in
        // the bulk store, so try that too before giving up.
        matchInfo = await this.fetchActiveMatchInfo(matchId);
        if (!matchInfo) matchInfo = await this.fetchBulkMatchInfo(matchId);
        if (!matchInfo) {
          // Nothing available live yet → pending state, retry on a timer.
          this.renderLivePending(matchId);
          this.scheduleLivePoll();
          return;
        }
      } else {
        // Demo / historical → bulk metadata endpoint (10/min, no Steam 503).
        matchInfo = await this.fetchBulkMatchInfo(matchId);
        if (!matchInfo) {
          // API unavailable → fall back to the last cached (already-enriched) match.
          const cached = await window.api.getCachedMatch?.(matchId);
          const cachedInfo = cached ? this.normalizeMatchInfo(cached) : null;
          if (cachedInfo?.players?.length) {
            this.matchData = {
              match_id: cachedInfo.match_id,
              game_mode: cachedInfo.game_mode,
              duration_s: cachedInfo.duration_s,
              winning_team: cachedInfo.winning_team,
              players: cachedInfo.players,
              teams: cachedInfo.teams ?? [],
            };
            this.renderMatchData();
            this.showCacheIndicator();
            return;
          }
          throw new Error('Failed to fetch match data and no cache available');
        }
      }

      if (!matchInfo?.players?.length) throw new Error('Invalid match data structure');

      // We have a fresh roster → cancel any pending live-poll loop.
      this.stopLivePoll();

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
        game_mode:    matchInfo.game_mode,
        duration_s:   matchInfo.duration_s,
        winning_team: matchInfo.winning_team,
        players,
        teams: matchInfo.teams ?? [],
      };

      // Cache only real (non-demo) match data to avoid poisoning with historical demos
      if (!this.isDemoMode && window.api?.cacheMatch && matchInfo.match_id) {
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
   * Splits players into two team rows, ordered by lane (yellow→blue→green) then slot
   * so columns line up as lane match-ups when possible. The column count adapts to
   * team size (6 for 6v6, 4 for 4v4, …) so the grid works for any game mode.
   */
  private organizePlayersIntoGrid(players: Player[]): { row0: Player[]; row1: Player[] } {
    const laneOrder: Record<string, number> = { yellow: 0, blue: 1, green: 2 };
    const sortKey = (p: Player) =>
      (laneOrder[p.lane ?? ''] ?? 9) * 100 + ((p as any).player_slot ?? 0);
    const teamSorted = (team: number) =>
      players.filter((p) => p.team === team).sort((a, b) => sortKey(a) - sortKey(b));
    return { row0: teamSorted(0), row1: teamSorted(1) };
  }

  private renderMatchData(): void {
    if (!this.container || !this.matchData) return;

    const { row0, row1 } = this.organizePlayersIntoGrid(this.matchData.players);
    const cols = Math.max(row0.length, row1.length, 1);

    // Lane colours are meaningful only in Normal mode. In Street Brawl everyone
    // shares one lane (yet assigned_lane is still populated with 1/4/6), so the
    // tile renders a neutral border with no lane dot. Gated on game_mode, never
    // on the lane count — see CONTEXT.md "Lane Color".
    const streetBrawl = this.isStreetBrawl(this.matchData.game_mode);

    const laneColorFor = (p: Player): 'yellow' | 'blue' | 'green' =>
      (p.lane as 'yellow' | 'blue' | 'green' | undefined) ?? 'blue';

    const renderCell = (player: Player | null): string => {
      if (!player) {
        return `<div class="bg-[#1a1f24] rounded-lg border border-[#2a2f35] opacity-20"></div>`;
      }
      const el = document.createElement('div');
      PlayerCard.mount(el, { player, laneColor: laneColorFor(player), showLane: !streetBrawl });
      return el.innerHTML;
    };

    const renderRow = (team: Player[]): string => {
      let cells = '';
      for (let i = 0; i < cols; i++) {
        cells += `<div class="min-h-0">${renderCell(team[i] ?? null)}</div>`;
      }
      return cells;
    };

    const matchId   = this.matchData.match_id ?? this.loadedMatchId ?? '';
    const total     = this.matchData.players.length;
    const modeLabel = `${row0.length}v${row1.length} • ${total} joueurs`;
    const demoLabel = this.isDemoMode
      ? `<span class="px-2 py-0.5 rounded text-xs font-medium bg-yellow-400/10 text-yellow-400 border border-yellow-400/30">DEMO</span>`
      : '';

    // Visible game-mode badge (acceptance criterion: "indiquer le matchMode visible").
    // Street Brawl gets a distinct amber accent; Normal a neutral slate.
    const modeName = this.gameModeLabel(this.matchData.game_mode);
    const modeBadge = modeName
      ? `<span class="px-2 py-0.5 rounded text-xs font-bold ${streetBrawl
          ? 'bg-amber-400/15 text-amber-400 border border-amber-400/40'
          : 'bg-slate-400/10 text-slate-300 border border-slate-400/30'}">${modeName}</span>`
      : '';

    // Refresh button lives in the LEFT cluster: the right corner is owned by the
    // global #game-status-sticky badge (fixed top-4 right-4 z-[70]), which used to
    // overlap it. padding-right reserves room so the cluster never reaches the badge.
    const refreshBtn = `
      <button
        id="refresh-match-btn"
        title="${this.isDemoMode ? 'Next demo match' : 'Refresh match data'}"
        class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-charcoal-200 hover:bg-charcoal-300 text-white border border-grey-600 hover:border-frosted-mint-500 transition-colors text-sm"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        ${this.isDemoMode ? 'Refresh' : 'Actualiser'}
      </button>`;

    this.container.innerHTML = `
      <div class="bg-charcoal-100 min-h-screen h-screen overflow-hidden flex flex-col">

        <!-- HEADER (all controls left-aligned; right corner reserved for global status badge) -->
        <div class="flex items-center gap-3 flex-wrap px-4 py-3 shrink-0 border-b border-[#2a2f35]" style="padding-right: 320px;">
          <h1 class="text-lg font-bold text-white">Live Dashboard</h1>
          ${demoLabel}
          ${modeBadge}
          <!-- Player count derived from real metadata (adapts 12 / 8 / …) -->
          <span class="px-2 py-0.5 rounded text-xs font-medium bg-frosted-mint-500/10 text-frosted-mint-500 border border-frosted-mint-500/30">${modeLabel}</span>
          <span class="text-xs text-[#555] font-mono">Match ID: ${matchId}</span>
          ${refreshBtn}
        </div>

        <!-- GRID: row 0 = team 0, row 1 = team 1. Columns adapt to team size. -->
        <div class="flex-1 grid gap-x-2 gap-y-2 p-2 overflow-hidden"
             style="grid-template-columns: repeat(${cols}, minmax(0, 1fr)); grid-template-rows: repeat(2, minmax(0, 1fr));">
          ${renderRow(row0)}
          ${renderRow(row1)}
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
