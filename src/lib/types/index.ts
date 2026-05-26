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
  images?: {
    icon_image_small?: string;
    icon_image_small_webp?: string;
    [key: string]: any;
  };
  [key: string]: any; // Allow additional fields from API
}

// Match and Player types for Live Dashboard
export type Lane = 'yellow' | 'blue' | 'green';

export interface Player {
  account_id: number;
  player_slot: number;
  hero_id: number;
  hero_name?: string;
  team: 0 | 1;
  lane?: Lane;
  assigned_lane?: number; // Lane number from API (0=yellow, 1=blue, 2=green)
  kills: number;
  deaths: number;
  assists: number;
  kda?: string; // Formatted KDA string (e.g., "2.5/1.2/3.1")
  level: number;
  net_worth?: number;
  rank?: number; // Badge/rank number
  name?: string; // Player username
  winrate?: number; // Winrate percentage
  total_matches?: number;
  steamProfile?: SteamProfile;
  heroData?: HeroData;
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
