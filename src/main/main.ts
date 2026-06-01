import 'dotenv/config';
import { app, BrowserWindow, ipcMain, shell, session } from 'electron';


import path from 'node:path';
import Store from 'electron-store';
import { setupSteamHandlers } from './steam-logic';
import { setupSpotifyHandlers } from './spotify-logic';
import { runPython, getDataProcessorPath, isPythonDebugEnabled } from './python-runner';
import {
  findActiveMatchByAccountId,
  getDeadlockProcessStatus,
  steamId64ToAccountId,
} from './deadlock-detector';
import {
  createOverlayWindow,
  destroyOverlayWindow,
  sendToOverlay,
  getOverlaySettings,
  patchOverlaySettings,
  setupOverlayIpcHandlers,
} from './overlay-window';
import { setupAwardsIpcHandlers } from './awards-store';
import { ocrWorker } from './ocr-worker';
import {
  getKwinOverlayRuleStatus,
  installKwinOverlayRule,
  removeKwinOverlayRule,
} from './kwin-overlay-rule';
import { LogWatcher } from './log-watcher';
import started from 'electron-squirrel-startup';
import type { CachedMatchData, MatchData, GameState } from '../lib/types';

/** Shape of JSON returned by data_processor.py (success, status, data, etc.) */
interface PythonQueryResult {
  success?: boolean;
  status?: string;
  code?: number;
  data?: any;
  [key: string]: unknown;
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Store reference for health alerts
  mainWindow = window;

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    window.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    window.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  // Open the DevTools.
  window.webContents.openDevTools();
};

// Mock mode state (in-memory, can be migrated to config file later)
let mockModeEnabled = false;

// Initialize electron-store for health tracking and cache (persists in app.getPath('userData') by default)
const store = new Store<{
  apiHealth: {
    requestHistory: boolean[];
    lastCheck: number;
    currentAvailability: number;
  };
  matchCache: Record<string, CachedMatchData>;
}>({
  defaults: {
    apiHealth: {
      requestHistory: [],
      lastCheck: 0,
      currentAvailability: 100,
    },
    matchCache: {},
  },
});

// Player name cache — persists account_id → personaname across sessions (TTL 7 days)
const playerNamesStore = new Store<{
  names: Record<string, { personaname: string; avatarmedium?: string; cachedAt: number }>;
}>({
  name: 'player-names',
  defaults: { names: {} },
});

// Read Steam profile data persisted by steam-logic.ts
const steamProfileStore = new Store<{
  steamId64: string | null;
}>({
  name: 'steam-profile',
  defaults: {
    steamId64: null,
  },
});

// Heartbeat timer reference
let heartbeatTimer: NodeJS.Timeout | null = null;
let deadlockPollingTimer: NodeJS.Timeout | null = null;

// Main window reference for sending health alerts
let mainWindow: BrowserWindow | null = null;
let lastGameRunning = false;
let lastKnownMatchId: number | null = null;
let lastApiCheckAt = 0;
let lastGameState: GameState = 'GAME_CLOSED';
// Which source set the current match: the local console.log ('log', reliable) or
// the community API ('api'). Used so the API poll never ends a log-detected match.
let matchSource: 'log' | 'api' | null = null;

// Log watcher instance for condebug overlay support
const logWatcher = new LogWatcher();

// Démarre le worker OCR uniquement si le toggle espOcrEnabled est activé.
function startOcrIfEnabled(): void {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  if (getOverlaySettings().espOcrEnabled !== true) return;
  ocrWorker.start(mainWindow);
}

/**
 * Record API call result and update availability
 */
function recordApiCall(success: boolean): void {
  const health = store.get('apiHealth');
  const requestHistory = [...health.requestHistory, success];
  
  // Maintain rolling window of 50 requests (FIFO)
  const MAX_HISTORY = 50;
  const trimmedHistory = requestHistory.length > MAX_HISTORY
    ? requestHistory.slice(-MAX_HISTORY)
    : requestHistory;
  
  // Calculate availability percentage
  const successCount = trimmedHistory.filter(Boolean).length;
  const availability = trimmedHistory.length > 0
    ? Math.round((successCount / trimmedHistory.length) * 100)
    : 100;
  
  // Update store
  store.set('apiHealth', {
    requestHistory: trimmedHistory,
    lastCheck: Date.now(),
    currentAvailability: availability,
  });
  
  // Notify renderer if availability changed
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('api:health-alert', availability);
  }
}

/**
 * Calculate current availability from stored history
 */
function calculateAvailability(): number {
  const health = store.get('apiHealth');
  const history = health.requestHistory;
  
  if (history.length === 0) return 100;
  
  const successCount = history.filter(Boolean).length;
  return Math.round((successCount / history.length) * 100);
}

/**
 * Perform health check by calling Python script (via python-runner abstraction)
 */
async function performHealthCheck(): Promise<void> {
  const appPath = app.getAppPath();
  const isPackaged = app.isPackaged;
  // getDataProcessorPath returns the PyInstaller binary path (packaged) or .py source path (dev)
  const { scriptPath, directExecutable } = getDataProcessorPath(appPath, isPackaged);
  const cwd = isPackaged ? path.dirname(scriptPath) : appPath;
  const debug = isPythonDebugEnabled();

  try {
    const { data } = await runPython<{ success?: boolean; status?: string }>({
      scriptPath,
      args: ['--health-check'],
      cwd,
      debug,
      directExecutable,
    });
    const success = Boolean(data?.success && data?.status !== 'api_error');
    recordApiCall(success);
  } catch (error) {
    recordApiCall(false);
    console.error('Health check failed:', error);
  }
}

/**
 * Start heartbeat timer (checks every 5 minutes)
 */
function startHeartbeat(): void {
  // Perform initial check
  performHealthCheck();
  
  // Set interval for 5 minutes (300000 ms)
  heartbeatTimer = setInterval(() => {
    performHealthCheck();
  }, 5 * 60 * 1000);
}

/**
 * Stop heartbeat timer
 */
function stopHeartbeat(): void {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
}

function emitMatchStarted(matchId: number): void {
  if (!mainWindow || mainWindow.isDestroyed()) return;

  mainWindow.webContents.send('game:match-started', {
    matchId,
    timestamp: Date.now(),
  });
}

function emitGameProcessStatus(isRunning: boolean): void {
  if (!mainWindow || mainWindow.isDestroyed()) return;

  mainWindow.webContents.send('game:process-status', {
    isRunning,
    timestamp: Date.now(),
  });
}

function emitMatchEnded(matchId: number | null): void {
  if (!mainWindow || mainWindow.isDestroyed()) return;

  mainWindow.webContents.send('game:match-ended', {
    matchId,
    timestamp: Date.now(),
  });
}

function emitGameStateChanged(state: GameState, matchId?: number): void {
  if (!mainWindow || mainWindow.isDestroyed()) return;

  mainWindow.webContents.send('game:state-changed', {
    state,
    matchId,
    timestamp: Date.now(),
  });
}

/**
 * Apply / remove the KWin keep-above fix in lockstep with the game lifecycle.
 * Tied to the real game launch (not a manual button) so the rules activate
 * against the game's actual window/resolution and Window Mode, and are removed
 * on close so the `fullscreen=No` rule never lingers for sessions played without
 * the helper. No-op when the user disabled auto-fix (default on); the installer
 * is itself a no-op off KDE/Wayland.
 */
function syncKwinOverlayFix(gameRunning: boolean): void {
  if (getOverlaySettings().autoKwinFix === false) return;
  const action = gameRunning ? installKwinOverlayRule() : removeKwinOverlayRule();
  action
    .then((r) => console.log(`[Main] KWin overlay fix (${gameRunning ? 'launch' : 'close'}):`, JSON.stringify(r)))
    .catch((e) => console.error('[Main] KWin overlay fix error:', e));
}

/**
 * Wire the LogWatcher events ONCE (avoids stacking listeners on every game launch).
 *
 * Primary, reliable match detection: parsed from Deadlock's local console.log.
 * The community /v1/matches/active API stays as a best-effort fallback but never
 * overrides a match detected locally (see matchSource guard in the API poll).
 */
function setupLogWatcherListeners(): void {
  // Overlay start-time signal (fires on "ChangeGameState: GameInProgress").
  logWatcher.on('game-started', (wallTime: number) => {
    sendToOverlay('overlay:log-game-started', wallTime);
  });

  // Match start detected locally — drives the Live Dashboard into GAME_IN_MATCH.
  logWatcher.on('match-started', ({ matchId, wallTime }: { matchId: number; wallTime: number }) => {
    if (matchId === lastKnownMatchId) return;
    lastKnownMatchId = matchId;
    matchSource = 'log';
    emitMatchStarted(matchId);
    if (lastGameState !== 'GAME_IN_MATCH') {
      lastGameState = 'GAME_IN_MATCH';
      emitGameStateChanged('GAME_IN_MATCH', matchId);
    }
    // Overlay gets the matchId + start time; hero details are filled by the API path when available.
    sendToOverlay('overlay:match-data', {
      matchId,
      startWallTime: wallTime,
      playerHeroId: 0,
      playerAccountId: 0,
      enemyHeroIds: [],
    });
    // ESP (Live Roster OCR) — démarre le worker si le toggle est actif.
    startOcrIfEnabled();
  });

  // Match end detected locally.
  logWatcher.on('match-ended', ({ matchId }: { matchId: number }) => {
    if (lastKnownMatchId === null) return;
    emitMatchEnded(lastKnownMatchId);
    lastKnownMatchId = null;
    matchSource = null;
    ocrWorker.stop();
    sendToOverlay('overlay:match-ended');
    if (lastGameState !== 'GAME_MENU' && lastGameRunning) {
      lastGameState = 'GAME_MENU';
      emitGameStateChanged('GAME_MENU');
    }
  });
}

async function checkDeadlockAndMatchStatus(): Promise<void> {
  const processStatus = await getDeadlockProcessStatus();
  const isRunning = processStatus.running;
  const wasRunning = lastGameRunning;

  if (!isRunning) {
    if (wasRunning) {
      emitGameProcessStatus(false);
      emitMatchEnded(lastKnownMatchId);
      destroyOverlayWindow();
      logWatcher.stop();
      ocrWorker.stop();
      syncKwinOverlayFix(false); // remove the rules now that the game is gone
    }
    lastGameRunning = false;
    lastKnownMatchId = null;
    matchSource = null;

    if (lastGameState !== 'GAME_CLOSED') {
      lastGameState = 'GAME_CLOSED';
      emitGameStateChanged('GAME_CLOSED');
    }
    return;
  }

  if (!wasRunning) {
    emitGameProcessStatus(true);
    console.log('[Main] Deadlock process detected — creating overlay window');
    // Show overlay immediately when game is detected (debug + waiting state)
    const preloadDir = path.join(app.getAppPath(), '.vite/build');
    createOverlayWindow(preloadDir);
    // Start log watcher using saved or auto-detected path
    const overlaySettings = getOverlaySettings();
    const logPath = overlaySettings.logPath || LogWatcher.detectLogPath();
    logWatcher.setLogPath(logPath); // listeners are wired once in setupLogWatcherListeners()
    // Auto-apply the KWin keep-above fix now that Deadlock is really running
    syncKwinOverlayFix(true);
  }
  lastGameRunning = true;

  // Transition to at least GAME_MENU as soon as process is detected
  if (lastGameState === 'GAME_CLOSED') {
    lastGameState = 'GAME_MENU';
    emitGameStateChanged('GAME_MENU');
  }

  const now = Date.now();
  if (now - lastApiCheckAt < 20_000) return;
  lastApiCheckAt = now;

  const steamId64 = steamProfileStore.get('steamId64');
  if (!steamId64) return;

  const accountId = steamId64ToAccountId(steamId64);
  if (accountId === null) return;

  const { matchId, durationS, playerHeroId, enemyHeroIds } = await findActiveMatchByAccountId(accountId);

  if (matchId !== null && matchId !== lastKnownMatchId) {
    lastKnownMatchId = matchId;
    matchSource = 'api';
    emitMatchStarted(matchId);
    if (lastGameState !== 'GAME_IN_MATCH') {
      lastGameState = 'GAME_IN_MATCH';
      emitGameStateChanged('GAME_IN_MATCH', matchId);
    }
    // Push full match context to overlay
    const startWallTime = durationS != null
      ? Date.now() - durationS * 1000
      : Date.now();
    console.log('[Main] Sending overlay:match-data', { matchId, durationS, playerHeroId, enemyHeroIds });
    sendToOverlay('overlay:match-data', {
      matchId,
      startWallTime,
      playerHeroId: playerHeroId ?? 0,
      playerAccountId: accountId,
      enemyHeroIds,
    });
    startOcrIfEnabled();
    return;
  }

  // Only the API may end a match it started. A match detected from the local log
  // is ended by the log's "destroyed" line — never by an empty API response.
  if (matchId === null && lastKnownMatchId !== null && matchSource !== 'log') {
    emitMatchEnded(lastKnownMatchId);
    lastKnownMatchId = null;
    matchSource = null;
    ocrWorker.stop();
    logWatcher.resetGameState();
    sendToOverlay('overlay:match-ended');
    if (lastGameState !== 'GAME_MENU') {
      lastGameState = 'GAME_MENU';
      emitGameStateChanged('GAME_MENU');
    }
  }
}

function startDeadlockPolling(): void {
  // Initial check for responsiveness after app startup.
  checkDeadlockAndMatchStatus().catch((error) => {
    console.error('Initial Deadlock check failed:', error);
  });

  deadlockPollingTimer = setInterval(() => {
    checkDeadlockAndMatchStatus().catch((error) => {
      console.error('Deadlock polling failed:', error);
    });
  }, 7_000);
}

function stopDeadlockPolling(): void {
  if (deadlockPollingTimer) {
    clearInterval(deadlockPollingTimer);
    deadlockPollingTimer = null;
  }
}

// Setup IPC handlers
function setupIpcHandlers(): void {
  // Python script execution handler (uses python-runner abstraction)
  ipcMain.handle('python:execute', async (event, { query, param, mockMode }) => {
    const appPath = app.getAppPath();
    const isPackaged = app.isPackaged;
    // getDataProcessorPath returns the PyInstaller binary path (packaged) or .py source path (dev)
    const { scriptPath, directExecutable } = getDataProcessorPath(appPath, isPackaged);
    const cwd = isPackaged ? path.dirname(scriptPath) : appPath;
    const useMockMode = mockMode !== undefined ? mockMode : mockModeEnabled;
    const args = ['--query', query || 'items'];
    if (useMockMode) args.push('--mock');
    if (param) args.push('--param', param);

    try {
      const { data: result } = await runPython<PythonQueryResult>({
        scriptPath,
        args,
        cwd,
        debug: isPythonDebugEnabled(),
        directExecutable,
      });

      const isApiError = result.status === 'api_error' || (!result.success && (result.code ?? 0) >= 500);
      recordApiCall(!isApiError);

      if (isApiError && query === 'match' && param) {
        const cachedMatch = store.get(`matchCache.${param}`);
        if (cachedMatch) {
          return {
            ...cachedMatch.data,
            success: true,
            cached: true,
            cached_at: cachedMatch.cached_at,
          };
        }
      }

      if (result.success && query === 'match' && param && result.data) {
        const matchInfo = result.data?.match_info || result.data;
        if (matchInfo?.match_id) {
          store.set(`matchCache.${param}`, {
            match_id: matchInfo.match_id,
            data: result.data,
            cached_at: Date.now(),
          });
        }
      }

      return result;
    } catch (err: any) {
      recordApiCall(false);
      throw {
        ...err,
        pythonScript: err.scriptPath ?? scriptPath,
        workingDir: err.workingDir ?? appPath,
      };
    }
  });
  
  // Mock mode handlers
  ipcMain.handle('settings:getMockMode', async () => {
    return mockModeEnabled;
  });
  
  ipcMain.handle('settings:setMockMode', async (event, enabled: boolean) => {
    mockModeEnabled = enabled;
    return { success: true, mockMode: mockModeEnabled };
  });
  
  // API Health handlers
  ipcMain.handle('api:health-check', async () => {
    await performHealthCheck();
    return { success: true };
  });
  
  ipcMain.handle('api:get-availability', async () => {
    return calculateAvailability();
  });
  
  ipcMain.handle('api:cache-match', async (event, matchId: string, matchData: MatchData) => {
    if (matchData.match_id) {
      const cachedData: CachedMatchData = {
        match_id: matchData.match_id,
        data: matchData,
        cached_at: Date.now(),
      };
      store.set(`matchCache.${matchId}`, cachedData);
      return { success: true };
    }
    return { success: false, error: 'Invalid match data' };
  });
  
  ipcMain.handle('api:get-cached-match', async (event, matchId: string) => {
    const cachedMatch = store.get(`matchCache.${matchId}`);
    if (cachedMatch) {
      return cachedMatch.data;
    }
    return null;
  });

  // Batch read player names from cache (TTL = 7 days)
  ipcMain.handle('player-names:get-many', async (_, accountIds: number[]) => {
    const names = playerNamesStore.get('names');
    const TTL = 7 * 24 * 3600 * 1000;
    const result: Record<number, string | null> = {};
    for (const id of accountIds) {
      const entry = names[String(id)];
      result[id] = (entry && Date.now() - entry.cachedAt < TTL) ? entry.personaname : null;
    }
    return result;
  });

  // Batch write player names to cache
  ipcMain.handle('player-names:set-many', async (_, entries: Array<{ accountId: number; personaname: string; avatarmedium?: string }>) => {
    const names = playerNamesStore.get('names');
    const now = Date.now();
    for (const e of entries) {
      names[String(e.accountId)] = { personaname: e.personaname, avatarmedium: e.avatarmedium, cachedAt: now };
    }
    playerNamesStore.set('names', names);
    return { success: true };
  });

  ipcMain.handle('game:get-status', async () => {
    return {
      isRunning: lastGameRunning,
      inMatch: lastKnownMatchId !== null,
      matchId: lastKnownMatchId,
      state: lastGameState,
      timestamp: Date.now(),
    };
  });
  
  // Awards system — persistence + native notification
  setupAwardsIpcHandlers(ipcMain, () => mainWindow);

  // Setup Steam handlers
  setupSteamHandlers();

  // Setup Spotify handlers
  setupSpotifyHandlers();

  // Setup overlay handlers
  setupOverlayIpcHandlers();

  // KWin "keep overlay above the game" fix (KDE Plasma + Wayland only).
  // Driven by an explicit button in the Configuration page — see kwin-overlay-rule.ts.
  ipcMain.handle('overlay:kwin-fix-status', () => getKwinOverlayRuleStatus());
  ipcMain.handle('overlay:kwin-fix-apply', () => installKwinOverlayRule());
  ipcMain.handle('overlay:kwin-fix-remove', () => removeKwinOverlayRule());

  // ESP (Live Roster OCR) toggle — stocké dans overlay-settings (electron-store).
  ipcMain.handle('esp:get-enabled', () => getOverlaySettings().espOcrEnabled ?? false);

  ipcMain.handle('esp:set-enabled', (_event, enabled: boolean) => {
    patchOverlaySettings({ espOcrEnabled: enabled });
    if (enabled && lastGameState === 'GAME_IN_MATCH') {
      startOcrIfEnabled();
    } else if (!enabled) {
      ocrWorker.stop();
    }
    return { success: true, espOcrEnabled: enabled };
  });

  // Launch Deadlock via Steam protocol (respects user's saved launch options)
  // Steam App ID 1422450 = Deadlock
  ipcMain.handle('game:launch-deadlock', async () => {
    console.log('[Main] Launching Deadlock via steam://rungameid/1422450');
    await shell.openExternal('steam://rungameid/1422450');
    return { success: true };
  });
}

/**
 * Injecte les headers Content-Security-Policy sur toutes les réponses de la session par défaut.
 * Cette couche est plus robuste que le meta tag HTML : elle s'applique avant le rendu de la page
 * et couvre les deux fenêtres (main_window et overlay_window).
 *
 * Politique :
 *   - script-src 'self'       : uniquement les scripts bundlés par Vite (pas d'eval, pas de CDN)
 *   - style-src 'unsafe-inline': Tailwind génère des styles inline — nécessaire
 *   - img-src                 : avatars Steam (*.steamstatic.com) + images héros/items Deadlock API
 *   - connect-src             : APIs Deadlock + Spotify (OAuth + playback) — pas de wildcard https:
 *   - object-src / media-src  : désactivés (pas de Flash ni de <video> externe)
 */
function setupContentSecurityPolicy(): void {
  const CSP = [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    // Steam avatar CDN (avatarmedium URLs) + Deadlock API hero/item image assets
    "img-src 'self' data: https://*.steamstatic.com https://*.steampowered.com https://steamcommunity.com https://*.deadlock-api.com",
    // Deadlock community API + Spotify API for token refresh and playback control
    "connect-src 'self' https://api.deadlock-api.com https://assets.deadlock-api.com https://api.spotify.com https://accounts.spotify.com",
    "object-src 'none'",
    "media-src 'none'",
  ].join('; ');

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        // Preserve existing response headers (e.g. Content-Type) and append CSP
        ...details.responseHeaders,
        'Content-Security-Policy': [CSP],
      },
    });
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  setupContentSecurityPolicy();
  setupIpcHandlers();
  setupLogWatcherListeners();
  createWindow();
  startHeartbeat();
  startDeadlockPolling();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
// Best-effort: if we exit while the game is still running, don't leave the
// fullscreen=No rule behind. removeKwinOverlayRule writes the cleaned file
// synchronously before its (async) reconfigure, so the rule is gone from disk
// even if the process exits before reconfigure completes.
app.on('before-quit', () => {
  ocrWorker.stop();
  if (lastGameRunning && getOverlaySettings().autoKwinFix !== false) {
    removeKwinOverlayRule().catch(() => {});
  }
});

app.on('window-all-closed', () => {
  stopHeartbeat();
  stopDeadlockPolling();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
