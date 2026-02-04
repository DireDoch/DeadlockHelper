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
  detectSteam: () =>
    ipcRenderer.invoke('steam:detect'),
  
  authenticateSteam: (credentials: any) =>
    ipcRenderer.invoke('steam:authenticate', credentials),
  
  // Mock mode operations
  getMockMode: () =>
    ipcRenderer.invoke('settings:getMockMode'),
  
  setMockMode: (enabled: boolean) =>
    ipcRenderer.invoke('settings:setMockMode', enabled),
});

// Type declaration for TypeScript
declare global {
  interface Window {
    api: {
      request: (endpoint: string, options?: { method?: string; body?: any }) => Promise<any>;
      setToken: (token: string) => Promise<any>;
      executePython: (query: string, param?: string, mockMode?: boolean) => Promise<any>;
      detectSteam: () => Promise<any>;
      authenticateSteam: (credentials: any) => Promise<any>;
      getMockMode: () => Promise<boolean>;
      setMockMode: (enabled: boolean) => Promise<any>;
    };
  }
}
