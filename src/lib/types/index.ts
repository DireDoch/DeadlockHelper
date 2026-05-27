/**
 * Shared TypeScript types and interfaces
 */

// Legacy Page type for backward compatibility
export type Page = 'home' | 'settings' | 'enPartie' | 'historique' | 'accueil';

// New hierarchical navigation types
export type MainPage = 
  | 'profil' 
  | 'hero-stats' 
  | 'game-overlay' 
  | 'leaderboards' 
  | 'meta-items' 
  | 'rank-distribution' 
  | 'settings';

export type SubPage = 
  | 'hero-library' 
  | 'hero-details' 
  | 'meta-builds'
  | 'live-dashboard' 
  | 'tactical-analysis'
  | 'rankings' 
  | 'rank-analytics'
  | 'configuration' 
  | 'spotify-widget';

export interface NavigationItem {
  id: MainPage | SubPage;
  label: string;
  icon: string;
  parent?: MainPage;
  route: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SteamUser {
  id: string;
  username: string;
  avatar?: string;
}

// Steam Profile from Deadlock API
export interface SteamProfile {
  account_id: number;
  personaname: string;
  profileurl: string;
  avatar: string;
  avatarmedium: string;
  avatarfull: string;
  realname?: string | null;
  countrycode?: string | null;
  last_updated?: number;
}

// Hero Data from Deadlock API
export interface HeroData {
  id: number;
  name: string;
  player_selectable?: boolean;
  disabled?: boolean;
  in_development?: boolean;
  images?: {
    icon_hero_card?: string;
    icon_hero_card_webp?: string;
    icon_image_small?: string;
    icon_image_small_webp?: string;
    background_image?: string;
    background_image_webp?: string;
    top_bar_vertical_image?: string;
    top_bar_vertical_image_webp?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

// Match and Player types for Live Dashboard
export type Lane = 'yellow' | 'blue' | 'green';

// From /v1/players/hero-stats (per account_id + hero_id combo)
export interface HeroStats {
  account_id: number;
  hero_id: number;
  matches_played: number;
  wins: number;
  kills: number;
  deaths: number;
  assists: number;
  last_played: number;
}

// From /v1/players/mmr?account_ids=... (latest entry per player)
export interface MMREntry {
  account_id: number;
  match_id: number;
  start_time: number;
  rank: number; // badge level 0–116 (tier = rank//10, subrank = rank%10)
  division: number; // rank // 10
  division_tier: number; // rank % 10
}

// From /v1/players/mmr/distribution
export interface RankDistributionEntry {
  rank: number;
  players: number;
}

// From /v1/assets/ranks
export interface RankAsset {
  tier: number;
  name: string;
  images: {
    small?: string;
    small_webp?: string;
    large?: string;
    [key: string]: string | undefined;
  };
  color?: string;
}

// From /v1/players/{account_id}/match-history (single entry)
export interface MatchHistoryEntry {
  account_id: number;
  match_id: number;
  hero_id: number;
  start_time: number;
  match_result: number; // 1 = win typically
  player_kills: number;
  player_deaths: number;
  player_assists: number;
  match_duration_s: number;
}

export interface ActivityStats {
  games: number;
  wins: number;
}

export interface Player {
  account_id: number;
  player_slot: number;
  hero_id: number;
  hero_name?: string;
  team: 0 | 1;
  lane?: Lane;
  assigned_lane?: number; // Lane number from API (1=blue, 4=yellow, 6=green)
  kills: number;
  deaths: number;
  assists: number;
  kda?: string; // Formatted KDA string (e.g., "2.5/1.2/3.1")
  level: number;
  net_worth?: number;
  rank?: number; // Legacy badge number (from mock data)
  name?: string; // Player username
  winrate?: number; // Account-wide winrate (legacy)
  total_matches?: number;
  steamProfile?: SteamProfile;
  heroData?: HeroData;
  // --- New fields from enrichment fetches ---
  heroWinrate?: number; // win% with this hero (0–100)
  heroMatchesPlayed?: number; // total matches played with this hero
  heroAvgKills?: number; // kills / matches_played for this hero
  heroAvgDeaths?: number;
  heroAvgAssists?: number;
  rankBadgeLevel?: number; // badge level 0–116 from /v1/players/mmr
  rankName?: string; // e.g. "Arcanist II"
  rankImageUrl?: string; // official badge image URL from /v1/assets/ranks
  rankTopPercent?: number; // position in global player base (e.g. 74 = Top 74%)
  activity12h?: ActivityStats;
  activity30d?: ActivityStats;
}

export interface MatchData {
  match_id?: number;
  duration_s?: number;
  winning_team?: 0 | 1;
  players: Player[];
  teams?: Array<{
    team: 0 | 1;
    [key: string]: any;
  }>;
  game_mode?: string;
  [key: string]: any; // Allow additional fields from API
}

// Game state as reported by the background detector
export type GameState = 'GAME_CLOSED' | 'GAME_MENU' | 'GAME_IN_MATCH';

// API Health Monitoring Types
export interface ApiHealthStatus {
  availability: number;
  lastCheck: number;
  requestHistory: boolean[];
}

export interface CachedMatchData {
  match_id: number;
  data: MatchData;
  cached_at: number;
}
