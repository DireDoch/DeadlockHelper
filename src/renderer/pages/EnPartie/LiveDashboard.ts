/**
 * Live Dashboard - Sub Page
 * Displays 12 player cards organized by team and lane
 */

import type { Player, MatchData, SteamProfile, HeroData } from '../../../lib/types';
import { PlayerCard } from '../../componentsUI/PlayerCard';

export class LiveDashboardPage {
  private container: HTMLElement | null = null;
  private isLoading: boolean = false;
  private matchData: MatchData | null = null;
  private heroCache: Map<number, HeroData> = new Map();

  mount(container: HTMLElement): void {
    this.container = container;
    this.render();
    this.loadMatchData();
  }

  private async loadMatchData(): Promise<void> {
    if (this.isLoading || !this.container) return;
    
    this.isLoading = true;
    this.updateLoadingState(true);

    try {
      // Get mock mode state from localStorage
      const mockModeEnabled = localStorage.getItem('mockModeEnabled') === 'true';
      
      // Call Python script with match query
      if (!window.api?.executePython) {
        throw new Error('API not available');
      }

      const response = await window.api.executePython('match', '54980378', mockModeEnabled);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch match data');
      }

      // Parse match data
      const matchInfo = response.data?.match_info || response.data;
      if (!matchInfo || !matchInfo.players) {
        throw new Error('Invalid match data structure');
      }

      // Process players and add lane information
      let players: Player[] = matchInfo.players.map((p: any) => ({
        ...p,
        lane: p.lane || this.mapLaneNumber(p.assigned_lane),
      }));

      // Fetch Steam profiles for all players
      const accountIds = players.map(p => p.account_id).filter(id => id !== undefined);
      const steamProfiles = await this.fetchSteamProfiles(accountIds);

      // Fetch Hero data for unique hero IDs
      const uniqueHeroIds = [...new Set(players.map(p => p.hero_id).filter(id => id !== undefined))];
      const heroDataPromises = uniqueHeroIds.map(heroId => this.fetchHeroData(heroId));
      const heroDataResults = await Promise.all(heroDataPromises);
      const heroDataMap = new Map<number, HeroData>();
      uniqueHeroIds.forEach((heroId, index) => {
        const heroData = heroDataResults[index];
        if (heroData) {
          heroDataMap.set(heroId, heroData);
        }
      });

      // Merge Steam and Hero data into players
      players = players.map(player => ({
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

      this.renderMatchData();
    } catch (error) {
      console.error('Failed to load match data:', error);
      this.showError(error instanceof Error ? error.message : 'Failed to load match data');
    } finally {
      this.isLoading = false;
      this.updateLoadingState(false);
    }
  }

  /**
   * Fetch Steam profiles for multiple account IDs
   */
  private async fetchSteamProfiles(accountIds: number[]): Promise<Map<number, SteamProfile>> {
    const profileMap = new Map<number, SteamProfile>();
    
    if (accountIds.length === 0) return profileMap;

    try {
      const accountIdsParam = accountIds.join(',');
      const response = await fetch(
        `https://api.deadlock-api.com/v1/players/steam?account_ids=${accountIdsParam}`
      );

      if (!response.ok) {
        console.warn('Failed to fetch Steam profiles:', response.statusText);
        return profileMap;
      }

      const profiles: SteamProfile[] = await response.json();
      profiles.forEach(profile => {
        profileMap.set(profile.account_id, profile);
      });
    } catch (error) {
      console.error('Error fetching Steam profiles:', error);
    }

    return profileMap;
  }

  /**
   * Fetch Hero data for a specific hero ID (with caching)
   */
  private async fetchHeroData(heroId: number): Promise<HeroData | null> {
    // Check cache first
    if (this.heroCache.has(heroId)) {
      return this.heroCache.get(heroId)!;
    }

    try {
      const response = await fetch(
        `https://assets.deadlock-api.com/v2/heroes/${heroId}`
      );

      if (!response.ok) {
        console.warn(`Failed to fetch hero data for hero_id ${heroId}:`, response.statusText);
        return null;
      }

      const heroData: HeroData = await response.json();
      this.heroCache.set(heroId, heroData);
      return heroData;
    } catch (error) {
      console.error(`Error fetching hero data for hero_id ${heroId}:`, error);
      return null;
    }
  }

  /**
   * Map assigned_lane number to lane name
   * Supports both mock data system (0,1,2) and real API system (1,4,6)
   */
  private mapLaneNumber(assignedLane: number | undefined): 'yellow' | 'blue' | 'green' | undefined {
    if (assignedLane === undefined) return undefined;
    
    // Real API system (1, 4, 6)
    if (assignedLane === 1) return 'blue';
    if (assignedLane === 4) return 'yellow';
    if (assignedLane === 6) return 'green';
    
    // Mock data system (0, 1, 2)
    const mockMap: Record<number, 'yellow' | 'blue' | 'green'> = {
      0: 'yellow',
      1: 'blue',
      2: 'green',
    };
    
    return mockMap[assignedLane];
  }

  /**
   * Organize players into a 6x2 grid layout
   * Columns 1-2: Yellow lane, Columns 3-4: Blue lane, Columns 5-6: Green lane
   * Row 1: Team 0 (Allies), Row 2: Team 1 (Enemies)
   */
  private organizePlayersIntoGrid(players: Player[]): {
    row0: (Player | null)[]; // Team 0 - 6 players
    row1: (Player | null)[]; // Team 1 - 6 players
  } {
    // Organize by lane
    const yellowPlayers = players.filter(p => p.lane === 'yellow');
    const bluePlayers = players.filter(p => p.lane === 'blue');
    const greenPlayers = players.filter(p => p.lane === 'green');

    // Get team 0 and team 1 for each lane
    const yellowTeam0 = yellowPlayers.filter(p => p.team === 0).slice(0, 2);
    const yellowTeam1 = yellowPlayers.filter(p => p.team === 1).slice(0, 2);
    const blueTeam0 = bluePlayers.filter(p => p.team === 0).slice(0, 2);
    const blueTeam1 = bluePlayers.filter(p => p.team === 1).slice(0, 2);
    const greenTeam0 = greenPlayers.filter(p => p.team === 0).slice(0, 2);
    const greenTeam1 = greenPlayers.filter(p => p.team === 1).slice(0, 2);

    // Build grid: [yellow1, yellow2, blue1, blue2, green1, green2]
    const row0: (Player | null)[] = [
      yellowTeam0[0] || null,
      yellowTeam0[1] || null,
      blueTeam0[0] || null,
      blueTeam0[1] || null,
      greenTeam0[0] || null,
      greenTeam0[1] || null,
    ];

    const row1: (Player | null)[] = [
      yellowTeam1[0] || null,
      yellowTeam1[1] || null,
      blueTeam1[0] || null,
      blueTeam1[1] || null,
      greenTeam1[0] || null,
      greenTeam1[1] || null,
    ];

    return { row0, row1 };
  }

  private renderMatchData(): void {
    if (!this.container || !this.matchData) return;

    const { row0, row1 } = this.organizePlayersIntoGrid(this.matchData.players);

    // Get lane color for indicator
    const getLaneColor = (columnIndex: number): 'yellow' | 'blue' | 'green' => {
      // Columns 0-1: Yellow, Columns 2-3: Blue, Columns 4-5: Green
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
          <!-- Header (minimal) -->
          <div class="flex items-center justify-between p-4 shrink-0">
            <h1 class="text-2xl font-bold text-white">
              Live Dashboard
            </h1>
            <button
              id="refresh-match-btn"
              class="px-4 py-2 bg-charcoal-200 hover:bg-charcoal-300 text-white rounded-lg border border-grey-600 hover:border-frosted-mint-500 transition-colors"
            >
              Actualiser
            </button>
          </div>

          <!-- Main Grid: 6 columns x 2 rows -->
          <div class="flex-1 grid grid-cols-6 grid-rows-2 gap-x-2 gap-y-12 p-2 overflow-hidden">
            <!-- Row 0: Team 0 (Allies) -->
            ${row0.map((player, colIndex) => `
              <div>
                ${renderPlayerCard(player, colIndex)}
              </div>
            `).join('')}
            
            <!-- Row 1: Team 1 (Enemies) -->
            ${row1.map((player, colIndex) => `
              <div>
                ${renderPlayerCard(player, colIndex)}
              </div>
            `).join('')}
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
      const loadingDiv = this.container.querySelector('.fixed.inset-0');
      if (loadingDiv) {
        loadingDiv.remove();
      }
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
    if (container) {
      container.insertBefore(errorDiv, container.firstChild);
    }
  }

  private attachEventListeners(): void {
    const refreshBtn = document.getElementById('refresh-match-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        this.loadMatchData();
      });
    }
  }

  private render(): void {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="p-8 bg-charcoal-100 min-h-screen">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-3xl font-bold text-white mb-6">
            Live Dashboard
          </h1>
          <p class="text-grey-300 mb-8">
            Cartes des 12 joueurs disposées par lane.
          </p>
          <div class="bg-charcoal-200 rounded-lg p-6 border border-grey-600">
            <p class="text-grey-400">
              Chargement des données...
            </p>
          </div>
        </div>
      </div>
    `;
  }
}
