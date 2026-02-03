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
