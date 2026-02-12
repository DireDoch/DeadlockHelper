/**
 * Preload script - Security bridge between Main and Renderer processes
 * 
 * This file exposes secure APIs to the renderer process via contextBridge.
 * Never enable nodeIntegration in the renderer for security reasons.
 */

import { clipboard, contextBridge, ipcRenderer } from 'electron';

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

  copyToClipboard: async (text: string) => {
    if (typeof text !== 'string' || text.length === 0) {
      return false;
    }
    try {
      clipboard.writeText(text);
      return true;
    } catch {
      try {
        return (await ipcRenderer.invoke('clipboard:write-text', text)) === true;
      } catch {
        return false;
      }
    }
  },
  
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
      copyToClipboard: (text: string) => Promise<boolean>;
      onHealthStatusChange: (callback: (availability: number) => void) => void;
      onSteamProfileUpdated: (callback: () => void) => void;
      onMatchStarted: (callback: (payload: { matchId: number; timestamp: number }) => void) => void;
      onMatchEnded: (callback: (payload: { matchId: number | null; timestamp: number }) => void) => void;
      onGameProcessStatusChange: (callback: (payload: { isRunning: boolean; timestamp: number }) => void) => void;
    };
  }
}
