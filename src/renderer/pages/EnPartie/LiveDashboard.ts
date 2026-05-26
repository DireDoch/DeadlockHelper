import type { Player, MatchData, SteamProfile, HeroData } from '../../../lib/types';
import { PlayerCard } from '../../componentsUI/PlayerCard';

type GameState = 'GAME_CLOSED' | 'GAME_MENU' | 'GAME_IN_MATCH';

export class LiveDashboardPage {
  private container: HTMLElement | null = null;
  private isLoading: boolean = false;
  private matchData: MatchData | null = null;
  private heroCache: Map<number, HeroData> = new Map();
  private detectedMatchId: string | null = null;
  private currentGameState: GameState = 'GAME_CLOSED';

  mount(container: HTMLElement): void {
    this.container = container;
    // Render the last known state immediately (no transition on initial mount)
    this.renderCurrentState();
    // Sync from main process in case our local state is stale
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

  // Kept for any remaining call sites
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
      // Keep whatever we already rendered
    }
  }

  private renderCurrentState(): void {
    if (this.currentGameState === 'GAME_IN_MATCH') {
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

    if (!this.container) return; // user may have navigated away

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

  // ── State views ─────────────────────────────────────────────────────────────

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
              <li>Start a Deadlock match and this page will automatically update</li>
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

          <!-- Skeleton grid (6×2) -->
          <div class="grid grid-cols-6 gap-2 opacity-20">
            ${Array(12).fill(0).map(() => `
              <div class="bg-charcoal-200 rounded-lg animate-pulse" style="height: 100px;"></div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  private renderInitialLoading(): void {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="p-8 bg-charcoal-100 min-h-screen">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-3xl font-bold text-white mb-6">Live Dashboard</h1>
          <p class="text-grey-300 mb-8">Cartes des 12 joueurs disposées par lane.</p>
          <div class="bg-charcoal-200 rounded-lg p-6 border border-grey-600">
            <p class="text-grey-400">Chargement des données...</p>
          </div>
        </div>
      </div>
    `;
  }

  // ── Match data loading (unchanged logic) ────────────────────────────────────

  private resolveMatchId(): string {
    if (this.detectedMatchId) return this.detectedMatchId;

    const storedMatchId = localStorage.getItem('detectedMatchId');
    if (storedMatchId) {
      this.detectedMatchId = storedMatchId;
      return storedMatchId;
    }

    return '57331114';
  }

  private async loadMatchData(): Promise<void> {
    if (this.isLoading || !this.container) return;

    this.isLoading = true;
    this.updateLoadingState(true);

    try {
      const mockModeEnabled = localStorage.getItem('mockModeEnabled') === 'true';

      if (!window.api?.executePython) {
        throw new Error('API not available');
      }

      const matchId = this.resolveMatchId();
      let response = await window.api.executePython('match', matchId, mockModeEnabled);
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

      const matchInfo = response.data?.match_info || response.data;
      if (!matchInfo || !matchInfo.players) {
        throw new Error('Invalid match data structure');
      }

      if (usingCache && this.container) {
        this.showCacheIndicator();
      }

      let players: Player[] = matchInfo.players.map((p: any) => ({
        ...p,
        lane: p.lane || this.mapLaneNumber(p.assigned_lane),
      }));

      const accountIds = players.map((p) => p.account_id).filter((id) => id !== undefined);
      const steamProfiles = await this.fetchSteamProfiles(accountIds);

      const uniqueHeroIds = [...new Set(players.map((p) => p.hero_id).filter((id) => id !== undefined))];
      const heroDataResults = await Promise.all(uniqueHeroIds.map((id) => this.fetchHeroData(id)));
      const heroDataMap = new Map<number, HeroData>();
      uniqueHeroIds.forEach((heroId, i) => {
        const data = heroDataResults[i];
        if (data) heroDataMap.set(heroId, data);
      });

      players = players.map((player) => ({
        ...player,
        steamProfile: steamProfiles.get(player.account_id),
        heroData: heroDataMap.get(player.hero_id),
      }));

      this.matchData = {
        match_id: matchInfo.match_id,
        duration_s: matchInfo.duration_s,
        winning_team: matchInfo.winning_team,
        players,
        teams: response.data?.teams || [],
      };

      if (!usingCache && response.success && window.api?.cacheMatch && matchInfo.match_id) {
        try {
          await window.api.cacheMatch(matchId, this.matchData);
        } catch {
          // Non-fatal
        }
      }

      this.renderMatchData();
    } catch (error) {
      console.error('Failed to load match data:', error);
      this.showError(error instanceof Error ? error.message : 'Failed to load match data');
    } finally {
      this.isLoading = false;
      this.updateLoadingState(false);
    }
  }

  private async fetchSteamProfiles(accountIds: number[]): Promise<Map<number, SteamProfile>> {
    const profileMap = new Map<number, SteamProfile>();
    if (accountIds.length === 0) return profileMap;

    try {
      const response = await fetch(
        `https://api.deadlock-api.com/v1/players/steam?account_ids=${accountIds.join(',')}`,
      );
      if (!response.ok) return profileMap;

      const profiles: SteamProfile[] = await response.json();
      profiles.forEach((profile) => profileMap.set(profile.account_id, profile));
    } catch {
      // Return empty map on failure
    }

    return profileMap;
  }

  private async fetchHeroData(heroId: number): Promise<HeroData | null> {
    if (this.heroCache.has(heroId)) return this.heroCache.get(heroId)!;

    try {
      const response = await fetch(`https://assets.deadlock-api.com/v2/heroes/${heroId}`);
      if (!response.ok) return null;

      const heroData: HeroData = await response.json();
      this.heroCache.set(heroId, heroData);
      return heroData;
    } catch {
      return null;
    }
  }

  private mapLaneNumber(assignedLane: number | undefined): 'yellow' | 'blue' | 'green' | undefined {
    if (assignedLane === undefined) return undefined;
    if (assignedLane === 1) return 'blue';
    if (assignedLane === 4) return 'yellow';
    if (assignedLane === 6) return 'green';
    const mockMap: Record<number, 'yellow' | 'blue' | 'green'> = { 0: 'yellow', 1: 'blue', 2: 'green' };
    return mockMap[assignedLane];
  }

  private organizePlayersIntoGrid(players: Player[]): {
    row0: (Player | null)[];
    row1: (Player | null)[];
  } {
    const yellowPlayers = players.filter((p) => p.lane === 'yellow');
    const bluePlayers = players.filter((p) => p.lane === 'blue');
    const greenPlayers = players.filter((p) => p.lane === 'green');

    const row0: (Player | null)[] = [
      yellowPlayers.filter((p) => p.team === 0)[0] ?? null,
      yellowPlayers.filter((p) => p.team === 0)[1] ?? null,
      bluePlayers.filter((p) => p.team === 0)[0] ?? null,
      bluePlayers.filter((p) => p.team === 0)[1] ?? null,
      greenPlayers.filter((p) => p.team === 0)[0] ?? null,
      greenPlayers.filter((p) => p.team === 0)[1] ?? null,
    ];

    const row1: (Player | null)[] = [
      yellowPlayers.filter((p) => p.team === 1)[0] ?? null,
      yellowPlayers.filter((p) => p.team === 1)[1] ?? null,
      bluePlayers.filter((p) => p.team === 1)[0] ?? null,
      bluePlayers.filter((p) => p.team === 1)[1] ?? null,
      greenPlayers.filter((p) => p.team === 1)[0] ?? null,
      greenPlayers.filter((p) => p.team === 1)[1] ?? null,
    ];

    return { row0, row1 };
  }

  private renderMatchData(): void {
    if (!this.container || !this.matchData) return;

    const { row0, row1 } = this.organizePlayersIntoGrid(this.matchData.players);

    const getLaneColor = (columnIndex: number): 'yellow' | 'blue' | 'green' => {
      if (columnIndex < 2) return 'yellow';
      if (columnIndex < 4) return 'blue';
      return 'green';
    };

    const renderPlayerCard = (player: Player | null, columnIndex: number): string => {
      if (!player) {
        return `<div class="bg-charcoal-200 rounded-lg border border-grey-600/30 opacity-30" style="height: 38vh; max-height: 400px;"></div>`;
      }
      const laneColor = getLaneColor(columnIndex);
      const cardContainer = document.createElement('div');
      PlayerCard.mount(cardContainer, { player, showLane: false, columnIndex, laneColor });
      return cardContainer.innerHTML;
    };

    this.container.innerHTML = `
      <div class="bg-charcoal-100 min-h-screen h-screen overflow-hidden">
        <div class="h-full flex flex-col">
          <div class="flex items-center justify-between p-4 shrink-0">
            <h1 class="text-2xl font-bold text-white">Live Dashboard</h1>
            <button
              id="refresh-match-btn"
              class="px-4 py-2 bg-charcoal-200 hover:bg-charcoal-300 text-white rounded-lg border border-grey-600 hover:border-frosted-mint-500 transition-colors"
            >
              Actualiser
            </button>
          </div>

          <div class="flex-1 grid grid-cols-6 grid-rows-2 gap-x-2 gap-y-12 p-2 overflow-hidden">
            ${row0.map((player, colIndex) => `<div>${renderPlayerCard(player, colIndex)}</div>`).join('')}
            ${row1.map((player, colIndex) => `<div>${renderPlayerCard(player, colIndex)}</div>`).join('')}
          </div>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  private updateLoadingState(loading: boolean): void {
    if (!this.container) return;

    const content = this.container.querySelector('.max-w-7xl');
    if (!content) return;

    if (loading) {
      const loadingDiv = document.createElement('div');
      loadingDiv.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
      loadingDiv.innerHTML = `
        <div class="bg-charcoal-200 rounded-lg p-6 border border-grey-600">
          <p class="text-white">Chargement des données du match...</p>
        </div>
      `;
      this.container.appendChild(loadingDiv);
    } else {
      this.container.querySelector('.fixed.inset-0')?.remove();
    }
  }

  private showError(message: string): void {
    if (!this.container) return;

    const errorDiv = document.createElement('div');
    errorDiv.className = 'bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-4';
    errorDiv.innerHTML = `
      <p class="text-red-400 font-semibold mb-1">Erreur</p>
      <p class="text-red-300 text-sm">${message}</p>
    `;

    const container = this.container.querySelector('.max-w-7xl');
    container?.insertBefore(errorDiv, container.firstChild);
  }

  private showCacheIndicator(): void {
    if (!this.container) return;

    this.container.querySelector('.cache-indicator')?.remove();

    const cacheDiv = document.createElement('div');
    cacheDiv.className =
      'cache-indicator fixed top-16 right-4 z-40 bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-3';
    cacheDiv.innerHTML = `
      <p class="text-yellow-400 text-sm font-semibold">Donnees en cache</p>
      <p class="text-yellow-300 text-xs">L'API est indisponible. Affichage des dernieres donnees disponibles.</p>
    `;
    this.container.appendChild(cacheDiv);

    setTimeout(() => cacheDiv.parentNode && cacheDiv.remove(), 5000);
  }

  private attachEventListeners(): void {
    document.getElementById('refresh-match-btn')?.addEventListener('click', () => {
      this.loadMatchData();
    });
  }
}
