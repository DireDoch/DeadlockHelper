import type { Player } from '../../lib/types';

export interface PlayerCardProps {
  player: Player;
  laneColor?: 'yellow' | 'blue' | 'green';
  columnIndex?: number;
  showLane?: boolean;
}

// Lane color → Tailwind border + accent classes
const LANE_STYLES: Record<string, { border: string; dot: string; text: string }> = {
  yellow: { border: 'border-l-yellow-400',  dot: 'bg-yellow-400',  text: 'text-yellow-400' },
  blue:   { border: 'border-l-blue-400',    dot: 'bg-blue-400',    text: 'text-blue-400'   },
  green:  { border: 'border-l-emerald-400', dot: 'bg-emerald-400', text: 'text-emerald-400' },
};

function formatDecimal(value: number): string {
  return value.toFixed(1);
}

export class PlayerCard {
  static render(props: PlayerCardProps): string {
    const { player, laneColor, showLane } = props;

    // showLane === false (Street Brawl): lanes are meaningless → neutral border, no dot.
    // See CONTEXT.md "Player Tile" / "Lane Color".
    const NEUTRAL = { border: 'border-l-grey-600', dot: 'bg-grey-600', text: 'text-grey-400' };
    const lane = showLane === false ? NEUTRAL : (LANE_STYLES[laneColor ?? ''] ?? NEUTRAL);

    // Identity
    const personaname = player.steamProfile?.personaname ?? player.name ?? `Player ${player.player_slot + 1}`;
    const heroName    = player.heroData?.name ?? player.hero_name ?? '—';

    // Steam profile URL
    // Prefer the profileurl field from /v1/players/steam (already a full URL).
    // Fallback: derive SteamID64 from SteamID3 (account_id + 76561197960265728).
    const steamProfileUrl = player.steamProfile?.profileurl
      ?? `https://steamcommunity.com/profiles/${BigInt(player.account_id) + BigInt('76561197960265728')}`;

    // Hero icon
    // Source: https://assets.deadlock-api.com/v2/heroes/{hero_id}
    // Field: images.icon_image_small_webp (preferred) or icon_image_small
    const heroIcon = player.heroData?.images?.icon_image_small_webp
                  ?? player.heroData?.images?.icon_image_small
                  ?? '';

    // Hero stats
    const heroMatchesPlayed = player.heroMatchesPlayed ?? 0;
    const heroWinPct        = player.heroWinrate !== undefined
      ? Math.round(player.heroWinrate)
      : null;

    // KDA averages (from hero history via /v1/players/hero-stats)
    const avgKills   = player.heroAvgKills   !== undefined ? formatDecimal(player.heroAvgKills)   : '—';
    const avgDeaths  = player.heroAvgDeaths  !== undefined ? formatDecimal(player.heroAvgDeaths)  : '—';
    const avgAssists = player.heroAvgAssists !== undefined ? formatDecimal(player.heroAvgAssists) : '—';

    // KDA ratio = (Kills + Assists) / Deaths  — displayed as "KDA (4.0)"
    const kdaRatio = player.heroAvgKills !== undefined && player.heroAvgDeaths !== undefined && player.heroAvgAssists !== undefined
      ? formatDecimal((player.heroAvgKills + player.heroAvgAssists) / Math.max(player.heroAvgDeaths, 0.1))
      : null;

    // Rank (from /v1/players/mmr + /v1/assets/ranks)
    const rankName     = player.rankName ?? null;
    const rankImageUrl = player.rankImageUrl ?? null;
    const topPercent   = player.rankTopPercent !== undefined ? player.rankTopPercent : null;

    // Activity (from /v1/players/{account_id}/match-history, filtered by start_time)
    const act12h = player.activity12h;
    const act30d = player.activity30d;

    return `
      <div class="
        relative h-full flex flex-col
        bg-[#1a1f24] rounded-lg
        border border-[#2a2f35] border-l-4 ${lane.border}
        hover:border-[#3a4048] transition-colors duration-200
        overflow-hidden
      ">
        <!-- HEADER: player name (clickable → Steam profile) + lane dot -->
        <div class="flex items-center justify-between px-3 pt-3 pb-1 shrink-0">
          <a
            href="${steamProfileUrl}"
            target="_blank"
            rel="noopener noreferrer"
            class="text-white font-bold text-base leading-tight truncate flex-1 min-w-0 hover:text-frosted-mint-400 transition-colors"
            title="Voir le profil Steam"
          >${personaname}</a>
          ${showLane === false
            ? ''
            : `<span class="w-2 h-2 rounded-full ml-2 shrink-0 ${lane.dot}"></span>`}
        </div>

        <!-- HERO SECTION: icon + "as Hero (Xp)" + winrate -->
        <div class="flex items-center gap-2 px-3 pb-2 shrink-0">
          <!-- Hero icon: icon_image_small_webp from /v1/assets/heroes/{id} (full CDN URL) -->
          ${heroIcon
            ? `<div class="w-10 h-10 rounded-full bg-[#111518] border-2 border-[#2a2f35] overflow-hidden shrink-0 flex items-center justify-center">
                 <img src="${heroIcon}" alt="${heroName}" class="w-full h-full object-cover" />
               </div>`
            : `<div class="w-10 h-10 rounded-full bg-[#111518] border-2 border-[#2a2f35] shrink-0 flex items-center justify-center">
                 <svg class="w-5 h-5 text-[#555]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                 </svg>
               </div>`
          }
          <div class="flex flex-col min-w-0">
            <span class="text-[#c9d1d9] text-sm font-medium leading-tight truncate">
              as ${heroName}${heroMatchesPlayed > 0 ? ` (${heroMatchesPlayed}p)` : ''}
            </span>
            ${heroWinPct !== null
              ? `<span class="text-[#9ca3af] text-xs leading-tight">
                   ${heroWinPct}% Win
                 </span>`
              : ''
            }
          </div>
        </div>

        <!-- DIVIDER -->
        <div class="mx-3 border-t border-[#2a2f35] mb-2 shrink-0"></div>

        <!-- KDA SECTION -->
        <div class="px-3 pb-2 shrink-0">
          <div class="flex items-center justify-center gap-1 text-sm font-bold leading-tight">
            <span class="text-emerald-400">${avgKills}</span>
            <span class="text-[#555]">/</span>
            <span class="text-red-400">${avgDeaths}</span>
            <span class="text-[#555]">/</span>
            <span class="text-yellow-400">${avgAssists}</span>
          </div>
          <p class="text-center text-[10px] text-[#555] mt-0.5 leading-tight">
            ${kdaRatio !== null ? `KDA (${kdaRatio})` : 'KDA (—)'}
          </p>
        </div>

        <!-- DIVIDER -->
        <div class="mx-3 border-t border-[#2a2f35] mb-2 shrink-0"></div>

        <!-- RANK SECTION -->
        <div class="flex items-center gap-2 px-3 pb-2 shrink-0">
          ${rankImageUrl
            ? `<img src="${rankImageUrl}" alt="${rankName ?? 'rank'}" class="w-8 h-8 object-contain shrink-0" />`
            : `<div class="w-8 h-8 rounded bg-[#111518] border border-[#2a2f35] shrink-0"></div>`
          }
          <div class="flex flex-col min-w-0">
            <span class="text-white text-xs font-semibold leading-tight truncate">
              ${rankName ?? '—'}
            </span>
            ${topPercent !== null
              ? `<span class="text-[#9ca3af] text-[10px] leading-tight">Top ${topPercent}%</span>`
              : ''
            }
          </div>
        </div>

        <!-- DIVIDER -->
        <div class="mx-3 border-t border-[#2a2f35] mb-2 shrink-0"></div>

        <!-- ACTIVITY: 12H + 30D -->
        <div class="flex gap-2 px-3 pb-2 shrink-0">
          <div class="flex-1 bg-[#111518] rounded px-2 py-1">
            <p class="text-[10px] text-[#555] leading-tight font-medium">12H</p>
            <p class="text-[11px] text-[#9ca3af] leading-tight">
              ${act12h !== undefined
                ? `${act12h.games} games · ${act12h.wins} wins`
                : '— games · — wins'
              }
            </p>
          </div>
          <div class="flex-1 bg-[#111518] rounded px-2 py-1">
            <p class="text-[10px] text-[#555] leading-tight font-medium">30D</p>
            <p class="text-[11px] text-[#9ca3af] leading-tight">
              ${act30d !== undefined
                ? `${act30d.games} games · ${act30d.wins} wins`
                : '— games · — wins'
              }
            </p>
          </div>
        </div>

        <!-- TAG PLACEHOLDER (future: WARMING UP / IN GAME / etc.) -->
        <div class="mt-auto px-3 pb-3 shrink-0">
          <!-- tag slot: status logic to be wired from MatchHistory endpoint -->
        </div>
      </div>
    `;
  }

  static mount(container: HTMLElement, props: PlayerCardProps): void {
    container.innerHTML = this.render(props);
  }
}
