import { BrowserWindow, screen, ipcMain } from 'electron';
import path from 'node:path';
import Store from 'electron-store';
import type { OverlaySettings } from '../lib/types';

declare const OVERLAY_WINDOW_VITE_DEV_SERVER_URL: string;
declare const OVERLAY_WINDOW_VITE_NAME: string;

const OVERLAY_W = 280;
const OVERLAY_H = 298; // +18px for drag handle

const overlayStore = new Store<{ settings: OverlaySettings }>({
  name: 'overlay-settings',
  defaults: {
    settings: {
      corner: 'center-right',
      opacity: 0.25,
      logPath: '',
      showSoulsPerMin: true,
      showMidBossTimer: true,
      showUrnTimer: true,
      showItemSuggestions: true,
      autoKwinFix: true,
    },
  },
});

let overlayWindow: BrowserWindow | null = null;
let alwaysOnTopTimer: ReturnType<typeof setInterval> | null = null;

// Pick the display most likely to contain the game.
// Heuristic: prefer the leftmost display (lowest x), which is typically
// where a gaming monitor is placed in a dual-screen setup on Linux.
function getGameDisplay() {
  const displays = screen.getAllDisplays();
  displays.sort((a, b) => a.bounds.x - b.bounds.x);
  return displays[0] ?? screen.getPrimaryDisplay();
}

function resolvePosition(corner: OverlaySettings['corner']): { x: number; y: number } {
  const { bounds } = getGameDisplay();
  const margin = 16;
  switch (corner) {
    case 'top-left':
      return { x: bounds.x + margin, y: bounds.y + margin };
    case 'top-right':
      return { x: bounds.x + bounds.width - OVERLAY_W - margin, y: bounds.y + margin };
    case 'bottom-left':
      return { x: bounds.x + margin, y: bounds.y + bounds.height - OVERLAY_H - margin };
    case 'bottom-right':
      return { x: bounds.x + bounds.width - OVERLAY_W - margin, y: bounds.y + bounds.height - OVERLAY_H - margin };
    case 'center-right':
    default:
      return {
        x: bounds.x + bounds.width - OVERLAY_W - margin,
        y: bounds.y + Math.floor((bounds.height - OVERLAY_H) / 2),
      };
  }
}

export function createOverlayWindow(preloadDir: string): void {
  if (overlayWindow && !overlayWindow.isDestroyed()) {
    console.log('[Overlay] Window already exists — skipping create');
    return;
  }
  console.log('[Overlay] Creating overlay window');

  const settings = overlayStore.get('settings');
  // Use last saved drag position if available; otherwise compute from corner preference.
  // On Wayland the compositor may ignore x/y at creation — the drag handle lets the
  // user reposition manually, and we persist the result.
  const { x, y } = (settings.lastX != null && settings.lastY != null)
    ? { x: settings.lastX, y: settings.lastY }
    : resolvePosition(settings.corner);
  console.log(`[Overlay] Position: corner=${settings.corner} x=${x} y=${y}`);

  overlayWindow = new BrowserWindow({
    width: OVERLAY_W,
    height: OVERLAY_H,
    x,
    y,
    // Stable, distinct window caption — the match key for the KWin keep-above
    // rule (see kwin-overlay-rule.ts). Must not collide with the main window.
    title: 'Deadlock Overlay',
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    focusable: true,
    hasShadow: false,
    webPreferences: {
      preload: path.join(preloadDir, 'overlay-preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // screen-saver is the highest Electron level — works on X11 over fullscreen
  overlayWindow.setAlwaysOnTop(true, 'screen-saver');

  // visibleOnFullScreen: essential on macOS and Linux compositors to stay on top
  // of a fullscreen/focused game window
  overlayWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  // Start with mouse events ignored — hover handler in renderer re-enables them
  overlayWindow.setIgnoreMouseEvents(true, { forward: true });

  if (OVERLAY_WINDOW_VITE_DEV_SERVER_URL) {
    overlayWindow.loadURL(`${OVERLAY_WINDOW_VITE_DEV_SERVER_URL}/overlay.html`);
  } else {
    overlayWindow.loadFile(
      path.join(__dirname, `../renderer/${OVERLAY_WINDOW_VITE_NAME}/overlay.html`),
    );
  }

  // Persist position after user drags the overlay (Wayland-compatible repositioning)
  overlayWindow.on('moved', () => {
    if (!overlayWindow || overlayWindow.isDestroyed()) return;
    const [nx, ny] = overlayWindow.getPosition();
    const current = overlayStore.get('settings');
    overlayStore.set('settings', { ...current, lastX: nx, lastY: ny });
    console.log(`[Overlay] Position saved after drag: x=${nx} y=${ny}`);
  });

  overlayWindow.webContents.once('did-finish-load', () => {
    console.log('[Overlay] Renderer loaded — sending settings');
    sendToOverlay('overlay:settings', settings);
  });

  // Mirror overlay renderer console messages to the main process stdout for debugging
  overlayWindow.webContents.on('console-message', (_e, level, message) => {
    const label = ['verbose', 'info', 'warn', 'error'][level] ?? String(level);
    console.log(`[Overlay/${label}] ${message}`);
  });

  // Periodically re-assert always-on-top in case the compositor drops it when
  // the game window takes focus (Wayland / KDE Plasma workaround)
  alwaysOnTopTimer = setInterval(() => {
    if (overlayWindow && !overlayWindow.isDestroyed()) {
      overlayWindow.setAlwaysOnTop(true, 'screen-saver');
      overlayWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    }
  }, 2000);
}

export function destroyOverlayWindow(): void {
  if (alwaysOnTopTimer) {
    clearInterval(alwaysOnTopTimer);
    alwaysOnTopTimer = null;
  }
  overlayWindow?.destroy();
  overlayWindow = null;
}

export function sendToOverlay(channel: string, ...args: unknown[]): void {
  if (overlayWindow && !overlayWindow.isDestroyed()) {
    overlayWindow.webContents.send(channel, ...args);
  }
}

export function getOverlaySettings(): OverlaySettings {
  return overlayStore.get('settings');
}

export function setupOverlayIpcHandlers(): void {
  ipcMain.handle('overlay:get-settings', () => overlayStore.get('settings'));

  ipcMain.handle('overlay:update-settings', (_event, settings: OverlaySettings) => {
    overlayStore.set('settings', settings);
    if (overlayWindow && !overlayWindow.isDestroyed()) {
      const { x, y } = resolvePosition(settings.corner);
      console.log(`[Overlay] Repositioning: corner=${settings.corner} x=${x} y=${y}`);
      overlayWindow.setPosition(x, y);
      overlayWindow.webContents.send('overlay:settings', settings);
    }
    return { success: true };
  });

  // Renderer toggles mouse passthrough on hover to allow clicking the Mid Boss button
  ipcMain.on('overlay:set-ignore-mouse', (_event, ignore: boolean) => {
    if (overlayWindow && !overlayWindow.isDestroyed()) {
      overlayWindow.setIgnoreMouseEvents(ignore, { forward: true });
    }
  });
}
