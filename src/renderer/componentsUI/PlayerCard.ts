/**
 * PlayerCard - Reusable component for displaying player information
 * Used in Live Dashboard to show player cards with rounded corners
 */

import type { Player } from '../../lib/types';

export interface PlayerCardProps {
  player: Player;
  showLane?: boolean;
  columnIndex?: number;
  laneColor?: 'yellow' | 'blue' | 'green';
}

export class PlayerCard {
  /**
   * Render a player card with rounded corners
   */
  static render(props: PlayerCardProps): string {
    const { player, showLane = true, columnIndex, laneColor } = props;
    
    // Format KDA
    const kda = player.kda || `${player.kills}/${player.deaths}/${player.assists}`;
    const kdaRatio =
      player.deaths > 0
        ? ((player.kills + player.assists) / player.deaths).toFixed(2)
        : '0.00';

    // Team indicator
    const teamColor = player.team === 0 
      ? 'border-l-4 border-l-frosted-mint-500' 
      : 'border-l-4 border-l-dry-sage-500';

    // Steam profile data
    const personaname = player.steamProfile?.personaname || player.name || `Player ${player.player_slot + 1}`;
    const profileurl = player.steamProfile?.profileurl || '#';

    // Hero data
    const heroName = player.heroData?.name || player.hero_name || '';
    const heroIcon = player.heroData?.images?.icon_image_small_webp || 
                     player.heroData?.images?.icon_image_small || '';

    // Lane color indicator
    const laneColorClass = laneColor === 'yellow' ? 'bg-yellow-500' : 
                          laneColor === 'blue' ? 'bg-blue-500' : 
                          laneColor === 'green' ? 'bg-green-500' : '';

    return `
      <div class="bg-charcoal-200 rounded-lg p-4 border border-grey-600 ${teamColor} hover:border-frosted-mint-500/50 transition-colors relative h-full flex flex-col" style="height: 38vh; max-height: 400px;">
        <!-- Hero Icon (overlapping at top, reduced size) -->
        ${heroIcon ? `
          <div class="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
            <div class="w-16 h-16 rounded-full border-2 border-grey-600 bg-charcoal-200 p-1 flex items-center justify-center">
              <img src="${heroIcon}" alt="${heroName}" class="w-full h-full rounded-full object-cover" />
            </div>
          </div>
        ` : ''}

        <!-- Card Content -->
        <div class="flex-1 flex flex-col ${heroIcon ? 'mt-8' : 'mt-0'}">
          <!-- Top Section: Name with Lane Indicator -->
          <div class="flex flex-col items-center gap-2 mb-4">
            <div class="w-full text-center">
              <!-- Personaname with Lane Indicator -->
              <div class="flex items-center justify-center gap-2">
                <a 
                  href="${profileurl}" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="text-lg font-bold text-frosted-mint-500 hover:text-frosted-mint-400 transition-colors truncate"
                >
                  ${personaname}
                </a>
                ${laneColor ? `
                  <span class="w-3 h-3 rounded-full ${laneColorClass} shrink-0"></span>
                ` : ''}
              </div>
              <!-- Hero Name (below personaname, grayed) -->
              ${heroName ? `
                <p class="text-sm text-grey-400 mt-1">
                  ${heroName}
                </p>
              ` : ''}
            </div>
          </div>

          <!-- Stats Section (compact) -->
          <div class="flex-1 flex flex-col justify-between gap-3">
            <!-- KDA Section -->
            <div class="text-center">
              <p class="text-xs text-grey-400 mb-1">KDA</p>
              <p class="text-base font-semibold text-white">${kda}</p>
              <p class="text-xs text-grey-500">Ratio: ${kdaRatio}</p>
            </div>

            <!-- Level and Winrate -->
            <div class="grid grid-cols-2 gap-2">
              <div class="text-center">
                <p class="text-xs text-grey-400 mb-1">Level</p>
                <p class="text-base font-semibold text-white">${player.level || 'N/A'}</p>
              </div>
              ${player.winrate !== undefined ? `
                <div class="text-center">
                  <p class="text-xs text-grey-400 mb-1">Winrate</p>
                  <p class="text-base font-semibold text-frosted-mint-500">${player.winrate}%</p>
                </div>
              ` : ''}
            </div>
            
            <!-- Net Worth (bottom, visible) -->
            ${player.net_worth !== undefined ? `
              <div class="text-center pt-2 border-t border-grey-600 mt-auto">
                <p class="text-xs text-grey-400 mb-1">Net Worth</p>
                <p class="text-lg font-bold text-dry-sage-500">${player.net_worth.toLocaleString()}</p>
              </div>
            ` : ''}

            <!-- Rank Badge (smaller) -->
            ${player.rank ? `
              <div class="flex justify-center pt-2">
                <div class="w-12 h-12 rounded-full bg-charcoal-300 border-2 border-grey-500 flex items-center justify-center">
                  <span class="text-sm font-bold text-frosted-mint-500">${player.rank}</span>
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }
  
  /**
   * Mount the player card into a container element
   */
  static mount(container: HTMLElement, props: PlayerCardProps): void {
    container.innerHTML = this.render(props);
  }
}
