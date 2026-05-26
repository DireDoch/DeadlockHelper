/**
 * Preload script - Security bridge between Main and Renderer processes
 * 
 * This file exposes secure APIs to the renderer process via contextBridge.
 * Never enable nodeIntegration in the renderer for security reasons.
 */

import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('api', {
  // API request handler
  request: (endpoint: string, options?: { method?: string; body?: any }) =>
    ipcRenderer.invoke('api:request', { endpoint, ...options }),
  
  // Token management
  setToken: (token: string) =>
    ipcRenderer.invoke('api:setToken', token),
  
  // Python script execution
  executePython: (query: string, param?: string, mockMode?: boolean) =>
    ipcRenderer.invoke('python:execute', { query, param, mockMode }),
  
  // Steam operations
  steamStartAuth: () =>
    ipcRenderer.invoke('steam:startAuth'),
  
  steamGetProfile: () =>
    ipcRenderer.invoke('steam:getProfile'),
  
  steamLogout: () =>
    ipcRenderer.invoke('steam:logout'),
  
  steamCheckInstallation: () =>
    ipcRenderer.invoke('steam:checkInstallation'),
  
  // Mock mode operations
  getMockMode: () =>
    ipcRenderer.invoke('settings:getMockMode'),
  
  setMockMode: (enabled: boolean) =>
    ipcRenderer.invoke('settings:setMockMode', enabled),
  
  // API Health operations
  getApiAvailability: () =>
    ipcRenderer.invoke('api:get-availability'),
  
  triggerHealthCheck: () =>
    ipcRenderer.invoke('api:health-check'),
  
  // Cache operations
  getCachedMatch: (matchId: string) =>
    ipcRenderer.invoke('api:get-cached-match', matchId),
  
  cacheMatch: (matchId: string, matchData: any) =>
    ipcRenderer.invoke('api:cache-match', matchId, matchData),

  getGameStatus: () =>
    ipcRenderer.invoke('game:get-status'),
  
  // Health status change listener
  onHealthStatusChange: (callback: (availability: number) => void) => {
    ipcRenderer.on('api:health-alert', (event, availability: number) => {
      callback(availability);
    });
  },

  // Steam profile updated (after login) – use to refresh UI
  onSteamProfileUpdated: (callback: () => void) => {
    ipcRenderer.on('steam:profile-updated', () => callback());
  },

  // Match status listeners (main process game detection)
  onMatchStarted: (callback: (payload: { matchId: number; timestamp: number }) => void) => {
    ipcRenderer.on('game:match-started', (_event, payload: { matchId: number; timestamp: number }) => {
      callback(payload);
    });
  },

  onMatchEnded: (callback: (payload: { matchId: number | null; timestamp: number }) => void) => {
    ipcRenderer.on('game:match-ended', (_event, payload: { matchId: number | null; timestamp: number }) => {
      callback(payload);
    });
  },

  onGameProcessStatusChange: (callback: (payload: { isRunning: boolean; timestamp: number }) => void) => {
    ipcRenderer.on('game:process-status', (_event, payload: { isRunning: boolean; timestamp: number }) => {
      callback(payload);
    });
  },
});

contextBridge.exposeInMainWorld('spotify', {
  login: () =>
    ipcRenderer.invoke('spotify:login'),
  logout: () =>
    ipcRenderer.invoke('spotify:logout'),
  getAuthStatus: () =>
    ipcRenderer.invoke('spotify:getAuthStatus'),
  play: (deviceId?: string) =>
    ipcRenderer.invoke('spotify:play', deviceId),
  pause: () =>
    ipcRenderer.invoke('spotify:pause'),
  next: () =>
    ipcRenderer.invoke('spotify:next'),
  previous: () =>
    ipcRenderer.invoke('spotify:previous'),
  getCurrentlyPlaying: () =>
    ipcRenderer.invoke('spotify:getCurrentlyPlaying'),
  getDevices: () =>
    ipcRenderer.invoke('spotify:getDevices'),
  transferDevice: (deviceId: string) =>
    ipcRenderer.invoke('spotify:transferDevice', deviceId),
});

// Type declaration for TypeScript
declare global {
  interface Window {
    api: {
      request: (endpoint: string, options?: { method?: string; body?: any }) => Promise<any>;
      setToken: (token: string) => Promise<any>;
      executePython: (query: string, param?: string, mockMode?: boolean) => Promise<any>;
      steamStartAuth: () => Promise<{ success: boolean; steamId64?: string; error?: string }>;
      steamGetProfile: () => Promise<{ steamId64: string; avatarUrl?: string; personaname?: string } | null>;
      steamLogout: () => Promise<void>;
      steamCheckInstallation: () => Promise<{ installed: boolean; path: string | null; error?: string }>;
      getMockMode: () => Promise<boolean>;
      setMockMode: (enabled: boolean) => Promise<any>;
      getApiAvailability: () => Promise<number>;
      triggerHealthCheck: () => Promise<any>;
      getCachedMatch: (matchId: string) => Promise<any>;
      cacheMatch: (matchId: string, matchData: any) => Promise<any>;
      getGameStatus: () => Promise<{ isRunning: boolean; inMatch: boolean; matchId: number | null; timestamp: number }>;
      onHealthStatusChange: (callback: (availability: number) => void) => void;
      onSteamProfileUpdated: (callback: () => void) => void;
      onMatchStarted: (callback: (payload: { matchId: number; timestamp: number }) => void) => void;
      onMatchEnded: (callback: (payload: { matchId: number | null; timestamp: number }) => void) => void;
      onGameProcessStatusChange: (callback: (payload: { isRunning: boolean; timestamp: number }) => void) => void;
    };
    spotify: {
      login: () => Promise<{ success: boolean; displayName?: string; error?: string }>;
      logout: () => Promise<{ success: boolean }>;
      getAuthStatus: () => Promise<{ isAuthenticated: boolean; displayName: string | null }>;
      play: (deviceId?: string) => Promise<{ success: boolean }>;
      pause: () => Promise<{ success: boolean }>;
      next: () => Promise<{ success: boolean }>;
      previous: () => Promise<{ success: boolean }>;
      getCurrentlyPlaying: () => Promise<{
        title: string;
        artist: string;
        albumArtUrl: string | null;
        isPlaying: boolean;
        progressMs: number;
        durationMs: number;
      } | null>;
      getDevices: () => Promise<Array<{ id: string; name: string; type: string; is_active: boolean; volume_percent: number }>>;
      transferDevice: (deviceId: string) => Promise<{ success: boolean }>;
    };
  }
}
