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

// ── Hero Detail Page types ────────────────────────────────────────────────────

export interface BuildData {
  hero_build: {
    hero_build_id: number;
    hero_id: number;
    name: string;
    description?: string | null;
    details: {
      ability_order?: {
        currency_changes?: Array<{
          ability_id: number;
          currency_type: number;
          delta: number;
          annotation?: string | null;
        }>;
      } | null;
      mod_categories?: Array<{
        name: string;
        description?: string | null;
        mods?: Array<{ ability_id: number; annotation?: string | null }> | null;
      }>;
    };
  };
  num_weekly_favorites?: number | null;
}

export interface BuildStats {
  hero_build_id: number;
  hero_id: number;
  wins: number;
  losses: number;
  matches: number;
  players: number;
}

// Description object returned by the Deadlock API for items and abilities
interface ItemDescription {
  desc?: string | null;
  active?: string | null;
  passive?: string | null;
  [key: string]: string | null | undefined;
}

// Stat property on an item (value + formatting metadata)
interface ItemPropertyValue {
  value?: string | null;
  label?: string | null;
  prefix?: string | null;
  postfix?: string | null;
  display_units?: string | null;
  negative_attribute?: boolean | null;
  tooltip_is_important?: boolean | null;
  [key: string]: any;
}

// Tooltip section attribute — lists which property names to show
interface UpgradeTooltipSectionAttribute {
  loc_string?: string | null;
  important_properties?: string[] | null;
  properties?: string[] | null;
}

export interface ItemData {
  id: number;
  name: string;
  description?: ItemDescription | string | null;
  item_slot_type?: 'weapon' | 'spirit' | 'vitality' | null;
  cost?: number | null;
  // Primary icon fields (Upgrade/shop items)
  shop_image_webp?: string | null;
  shop_image_small_webp?: string | null;
  shop_image?: string | null;
  shop_image_small?: string | null;
  // Ability icon fields
  image_webp?: string | null;
  image?: string | null;
  // Stat properties keyed by property name (e.g. "BonusFireRate")
  properties?: Record<string, ItemPropertyValue> | null;
  // Tooltip sections define which stats to surface per section
  tooltip_sections?: Array<{
    section_attributes?: UpgradeTooltipSectionAttribute[] | null;
  }> | null;
  [key: string]: any;
}

export interface AbilityOrderStats {
  abilities: number[];
  wins: number;
  losses: number;
  matches: number;
  players: number;
}

export interface HeroAbilityItem {
  id: number;
  name: string;
  image?: string | null;
  image_webp?: string | null;
}
