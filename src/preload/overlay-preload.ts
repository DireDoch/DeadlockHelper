import { contextBridge, ipcRenderer } from 'electron';
import type { OverlaySettings, OverlayMatchData } from '../lib/types';

contextBridge.exposeInMainWorld('overlayApi', {
  getSettings: (): Promise<OverlaySettings> =>
    ipcRenderer.invoke('overlay:get-settings'),

  setIgnoreMouse: (ignore: boolean): void =>
    ipcRenderer.send('overlay:set-ignore-mouse', ignore),

  onMatchData: (cb: (data: OverlayMatchData) => void): void => {
    ipcRenderer.on('overlay:match-data', (_e, data: OverlayMatchData) => cb(data));
  },

  onMatchEnded: (cb: () => void): void => {
    ipcRenderer.on('overlay:match-ended', () => cb());
  },

  onSettings: (cb: (settings: OverlaySettings) => void): void => {
    ipcRenderer.on('overlay:settings', (_e, settings: OverlaySettings) => cb(settings));
  },
});

declare global {
  interface Window {
    overlayApi: {
      getSettings: () => Promise<OverlaySettings>;
      setIgnoreMouse: (ignore: boolean) => void;
      onMatchData: (cb: (data: OverlayMatchData) => void) => void;
      onMatchEnded: (cb: () => void) => void;
      onSettings: (cb: (settings: OverlaySettings) => void) => void;
    };
  }
}
